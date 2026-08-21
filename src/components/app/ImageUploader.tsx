import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Download, ImagePlus, Loader2, RotateCcw, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { GradientButton } from "@/components/brand/GradientButton";
import { BeforeAfterSlider } from "@/components/app/BeforeAfterSlider";
import { removeBackground } from "@/lib/snapcut.functions";
import { fileToBase64, formatBytes, validateImageFile } from "@/lib/image-validation";

type Result = { before: string; after: string; fileName: string };

export function ImageUploader({ remaining }: { remaining: number }) {
  const run = useServerFn(removeBackground);
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function select(next: File | null | undefined) {
    setError(null);
    setResult(null);
    const message = validateImageFile(next);
    if (message || !next) {
      setFile(null);
      setPreviewUrl(null);
      setError(message);
      return;
    }
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
  }

  function reset() {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function process() {
    if (!file || busy) return;
    setBusy(true);
    setError(null);
    try {
      const dataBase64 = await fileToBase64(file);
      const response = await run({
        data: { fileName: file.name, mimeType: file.type, dataBase64 },
      });

      if (!response.success) {
        setError(response.error.message);
        toast.error(response.error.message);
        return;
      }

      setResult({
        before: response.data.originalImageUrl,
        after: response.data.processedImageUrl,
        fileName: file.name,
      });
      toast.success("Background removed successfully");
      void queryClient.invalidateQueries();
    } catch {
      const message = "Unable to process the image. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function download() {
    if (!result) return;
    try {
      const blob = await (await fetch(result.after)).blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${result.fileName.replace(/\.[^.]+$/, "")}-snapcut.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed. Please try again.");
    }
  }

  const limitReached = remaining <= 0;

  return (
    <section className="glass-card p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Remove a background</h2>
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          {remaining} of today&rsquo;s free removals left
        </span>
      </div>

      {result ? (
        <div className="mt-5 space-y-4">
          <BeforeAfterSlider beforeSrc={result.before} afterSrc={result.after} />
          <div className="flex flex-wrap gap-3">
            <GradientButton onClick={download} size="lg">
              <Download /> Download PNG
            </GradientButton>
            <GradientButton variant="outline" size="lg" onClick={reset}>
              <RotateCcw /> Remove another
            </GradientButton>
          </div>
        </div>
      ) : (
        <>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              select(e.dataTransfer.files?.[0]);
            }}
            className={`mt-5 rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
              dragOver ? "border-brand-cyan bg-surface-2" : "border-border bg-surface/40"
            }`}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected upload preview"
                className="mx-auto max-h-64 rounded-xl object-contain"
              />
            ) : (
              <UploadCloud className="mx-auto size-10 text-muted-foreground" />
            )}

            <p className="mt-4 text-sm text-muted-foreground">
              {file
                ? `${file.name} · ${formatBytes(file.size)}`
                : "Drag and drop an image here, or choose a file"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">PNG, JPG, JPEG or WEBP · up to 5 MB</p>

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(e) => select(e.target.files?.[0])}
            />
            <GradientButton
              variant="outline"
              className="mt-4"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
            >
              <ImagePlus /> Choose image
            </GradientButton>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          {limitReached && (
            <p className="mt-4 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted-foreground">
              You&rsquo;ve used all 5 free removals for today. Your limit resets tomorrow.
            </p>
          )}

          <GradientButton
            size="lg"
            className="mt-5 w-full"
            onClick={process}
            disabled={!file || busy || limitReached}
          >
            {busy ? <Loader2 className="animate-spin" /> : null}
            {busy ? "Removing background…" : "Remove background"}
          </GradientButton>
        </>
      )}
    </section>
  );
}
