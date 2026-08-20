import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const BUCKET = "snapcut";
const SIGNED_URL_TTL = 60 * 60 * 24 * 7; // 7 days
const ALLOWED = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

function dailyLimit(): number {
  const raw = process.env["FREE_DAILY_LIMIT"];
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export type ImageRecord = {
  id: string;
  originalFileName: string;
  originalFormat: string;
  status: string;
  processingTimeMs: number | null;
  createdAt: string;
  originalUrl: string | null;
  processedUrl: string | null;
  available: boolean;
};

export type OverviewData = {
  name: string;
  email: string;
  used: number;
  remaining: number;
  limit: number;
  totalProcessed: number;
  recent: ImageRecord[];
};

const RemoveInput = z.object({
  fileName: z.string().min(1).max(200),
  mimeType: z.string().min(1).max(80),
  dataBase64: z.string().min(1),
});

/** Shared helper: signs storage paths and shapes rows for the UI. */
async function toRecords(
  admin: {
    storage: {
      from: (b: string) => {
        createSignedUrls: (
          paths: string[],
          ttl: number,
        ) => Promise<{ data: { path: string | null; signedUrl: string }[] | null }>;
      };
    };
  },
  rows: {
    id: string;
    original_file_name: string;
    original_format: string;
    status: string;
    processing_time_ms: number | null;
    created_at: string;
    original_url: string | null;
    processed_url: string | null;
  }[],
): Promise<ImageRecord[]> {
  const paths = rows
    .flatMap((r) => [r.original_url, r.processed_url])
    .filter((p): p is string => Boolean(p));

  const signedMap = new Map<string, string>();
  if (paths.length > 0) {
    const { data } = await admin.storage.from(BUCKET).createSignedUrls(paths, SIGNED_URL_TTL);
    for (const entry of data ?? []) {
      if (entry.path && entry.signedUrl) signedMap.set(entry.path, entry.signedUrl);
    }
  }

  return rows.map((r) => {
    const processedUrl = r.processed_url ? (signedMap.get(r.processed_url) ?? null) : null;
    return {
      id: r.id,
      originalFileName: r.original_file_name,
      originalFormat: r.original_format,
      status: r.status,
      processingTimeMs: r.processing_time_ms,
      createdAt: r.created_at,
      originalUrl: r.original_url ? (signedMap.get(r.original_url) ?? null) : null,
      processedUrl,
      available: Boolean(processedUrl),
    };
  });
}

export const getOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<OverviewData> => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const [profileRes, usageRes, totalRes, recentRes] = await Promise.all([
      supabase.from("profiles").select("name, email").eq("id", userId).maybeSingle(),
      supabase
        .from("usage")
        .select("processing_count")
        .eq("user_id", userId)
        .eq("date", todayKey())
        .maybeSingle(),
      supabase
        .from("image_processing")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "success"),
      supabase
        .from("image_processing")
        .select(
          "id, original_file_name, original_format, status, processing_time_ms, created_at, original_url, processed_url",
        )
        .eq("user_id", userId)
        .eq("status", "success")
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    const limit = dailyLimit();
    const used = usageRes.data?.processing_count ?? 0;

    return {
      name: profileRes.data?.name ?? "",
      email: profileRes.data?.email ?? "",
      used,
      remaining: Math.max(0, limit - used),
      limit,
      totalProcessed: totalRes.count ?? 0,
      recent: await toRecords(supabaseAdmin, recentRes.data ?? []),
    };
  });

export const getHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ImageRecord[]> => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data } = await supabase
      .from("image_processing")
      .select(
        "id, original_file_name, original_format, status, processing_time_ms, created_at, original_url, processed_url",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(100);

    return toRecords(supabaseAdmin, data ?? []);
  });

export const updateProfileName = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ name: z.string().trim().min(1).max(80) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("profiles")
      .update({ name: data.name })
      .eq("id", context.userId);
    if (error) throw new Error("Could not update your profile. Please try again.");
    return { success: true as const };
  });

export type RemoveBackgroundResult =
  | {
      success: true;
      data: {
        originalImageUrl: string;
        processedImageUrl: string;
        processingId: string;
        format: "png";
        remaining: number;
        used: number;
        limit: number;
      };
      message: string;
    }
  | { success: false; error: { code: string; message: string } };

export const removeBackground = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => RemoveInput.parse(input))
  .handler(async ({ data, context }): Promise<RemoveBackgroundResult> => {
    const { userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const limit = dailyLimit();
    const date = todayKey();

    // --- server-side validation -------------------------------------------
    const mime = data.mimeType.toLowerCase();
    if (!ALLOWED.includes(mime)) {
      return {
        success: false,
        error: {
          code: "UNSUPPORTED_FORMAT",
          message: "This file format isn't supported. Please upload PNG, JPG, JPEG, or WEBP.",
        },
      };
    }

    let bytes: Uint8Array;
    try {
      const binary = atob(data.dataBase64);
      bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    } catch {
      return {
        success: false,
        error: { code: "INVALID_IMAGE", message: "The uploaded image could not be read." },
      };
    }

    if (bytes.byteLength === 0) {
      return {
        success: false,
        error: { code: "NO_FILE", message: "Please select an image first." },
      };
    }
    if (bytes.byteLength > MAX_BYTES) {
      return {
        success: false,
        error: { code: "FILE_TOO_LARGE", message: "This image is too large. Maximum file size is 5 MB." },
      };
    }

    // --- duplicate request prevention -------------------------------------
    const sixtySecondsAgo = new Date(Date.now() - 60_000).toISOString();
    const { count: inFlight } = await supabaseAdmin
      .from("image_processing")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "processing")
      .gte("created_at", sixtySecondsAgo);

    if ((inFlight ?? 0) > 0) {
      return {
        success: false,
        error: {
          code: "REQUEST_IN_PROGRESS",
          message: "An image is already being processed. Please wait for it to finish.",
        },
      };
    }

    // --- server-side usage check ------------------------------------------
    const { data: usageRow } = await supabaseAdmin
      .from("usage")
      .select("processing_count")
      .eq("user_id", userId)
      .eq("date", date)
      .maybeSingle();

    const used = usageRow?.processing_count ?? 0;
    if (used >= limit) {
      return {
        success: false,
        error: {
          code: "DAILY_LIMIT_REACHED",
          message: `You've reached today's free limit of ${limit} images. Your limit will reset tomorrow.`,
        },
      };
    }

    const format = mime.split("/")[1] ?? "png";
    const startedAt = Date.now();

    const { data: record, error: recordError } = await supabaseAdmin
      .from("image_processing")
      .insert({
        user_id: userId,
        original_file_name: data.fileName.slice(0, 200),
        original_format: format,
        status: "processing",
      })
      .select("id")
      .single();

    if (recordError || !record) {
      return {
        success: false,
        error: { code: "IMAGE_PROCESSING_FAILED", message: "Unable to process the image. Please try again." },
      };
    }

    const processingId: string = record.id;

    const fail = async (code: string, message: string): Promise<RemoveBackgroundResult> => {
      await supabaseAdmin
        .from("image_processing")
        .update({ status: "failed", error_message: code })
        .eq("id", processingId);
      return { success: false, error: { code, message } };
    };

    // --- AI background removal --------------------------------------------
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      console.error("[snapcut] missing AI credentials");
      return fail("AI_NOT_CONFIGURED", "Background removal is not configured. Please try again later.");
    }

    let processedBytes: Uint8Array;
    try {
      const form = new FormData();
      form.append("image", new Blob([bytes as unknown as BlobPart], { type: mime }), data.fileName);
      form.append("model", "openai/gpt-image-2");
      form.append(
        "prompt",
        "Remove the background completely and return only the main subject cut out cleanly with a fully transparent background. Preserve the subject exactly: same pose, colors, lighting, proportions and fine edge detail. Do not add, replace or invent any background, shadow, or new elements.",
      );
      form.append("background", "transparent");
      form.append("output_format", "png");
      form.append("input_fidelity", "high");

      const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/edits", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}` },
        body: form,
      });

      if (!upstream.ok) {
        const status = upstream.status;
        const body = await upstream.text().catch(() => "");
        console.error(`[snapcut] gateway error ${status}: ${body.slice(0, 400)}`);
        if (status === 429) {
          return fail("RATE_LIMITED", "Too many requests right now. Please try again in a moment.");
        }
        if (status === 402) {
          return fail("AI_CREDITS_EXHAUSTED", "AI processing is temporarily unavailable. Please try again later.");
        }
        return fail("IMAGE_PROCESSING_FAILED", "Unable to process the image. Please try again.");
      }

      const json = (await upstream.json()) as { data?: { b64_json?: string }[] };
      const b64 = json.data?.[0]?.b64_json;
      if (!b64) {
        return fail("IMAGE_PROCESSING_FAILED", "Unable to process the image. Please try again.");
      }
      const binary = atob(b64);
      processedBytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) processedBytes[i] = binary.charCodeAt(i);
    } catch (err) {
      console.error("[snapcut] processing error", err instanceof Error ? err.message : "unknown");
      return fail("IMAGE_PROCESSING_FAILED", "Unable to process the image. Please try again.");
    }

    // --- store results ------------------------------------------------------
    const originalPath = `${userId}/${processingId}/original.${format === "jpeg" ? "jpg" : format}`;
    const processedPath = `${userId}/${processingId}/processed.png`;

    const [originalUpload, processedUpload] = await Promise.all([
      supabaseAdmin.storage
        .from(BUCKET)
        .upload(originalPath, bytes as unknown as ArrayBufferView, { contentType: mime, upsert: true }),
      supabaseAdmin.storage
        .from(BUCKET)
        .upload(processedPath, processedBytes as unknown as ArrayBufferView, {
          contentType: "image/png",
          upsert: true,
        }),
    ]);

    if (originalUpload.error || processedUpload.error) {
      console.error("[snapcut] storage upload failed");
      return fail("STORAGE_FAILED", "Unable to save the processed image. Please try again.");
    }

    const processingTime = Date.now() - startedAt;

    await supabaseAdmin
      .from("image_processing")
      .update({
        status: "success",
        processing_time_ms: processingTime,
        original_url: originalPath,
        processed_url: processedPath,
      })
      .eq("id", processingId);

    // --- increment usage ONLY after a successful removal --------------------
    const newUsed = used + 1;
    await supabaseAdmin
      .from("usage")
      .upsert(
        { user_id: userId, date, processing_count: newUsed, updated_at: new Date().toISOString() },
        { onConflict: "user_id,date" },
      );

    const [{ data: signedOriginal }, { data: signedProcessed }] = await Promise.all([
      supabaseAdmin.storage.from(BUCKET).createSignedUrl(originalPath, SIGNED_URL_TTL),
      supabaseAdmin.storage.from(BUCKET).createSignedUrl(processedPath, SIGNED_URL_TTL),
    ]);

    return {
      success: true,
      data: {
        originalImageUrl: signedOriginal?.signedUrl ?? "",
        processedImageUrl: signedProcessed?.signedUrl ?? "",
        processingId,
        format: "png",
        used: newUsed,
        remaining: Math.max(0, limit - newUsed),
        limit,
      },
      message: "Background removed successfully",
    };
  });
