import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GradientButton } from "@/components/brand/GradientButton";
import { getOverview, updateProfileName } from "@/lib/snapcut.functions";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SnapCut AI" },
      { name: "description", content: "Manage your SnapCut AI profile and daily usage." },
      { property: "og:title", content: "Settings — SnapCut AI" },
      { property: "og:description", content: "Update your SnapCut AI account details." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Settings,
});

function Settings() {
  const fetchOverview = useServerFn(getOverview);
  const saveName = useServerFn(updateProfileName);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ["overview"], queryFn: () => fetchOverview() });
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data?.name) setName(data.name);
  }, [data?.name]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 1) {
      toast.error("Please enter your name.");
      return;
    }
    setBusy(true);
    try {
      await saveName({ data: { name: name.trim() } });
      toast.success("Profile updated");
      void queryClient.invalidateQueries({ queryKey: ["overview"] });
    } catch {
      toast.error("Could not update your profile. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (isLoading || !data) {
    return (
      <div className="grid place-items-center py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage your account details.</p>
      </header>

      <form onSubmit={submit} className="glass-card space-y-5 p-6">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            value={name}
            maxLength={80}
            onChange={(e) => setName(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-surface-2 px-3 text-sm outline-none focus:border-brand-cyan/60"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            value={data.email}
            readOnly
            className="h-11 w-full rounded-xl border border-border bg-surface/60 px-3 text-sm text-muted-foreground"
          />
        </div>
        <GradientButton type="submit" disabled={busy}>
          {busy && <Loader2 className="animate-spin" />} Save changes
        </GradientButton>
      </form>

      <section className="glass-card p-6">
        <h2 className="text-lg font-semibold">Daily usage</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {data.used} of {data.limit} free removals used today. Resets at midnight UTC.
        </p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-gradient-brand"
            style={{ width: `${Math.min(100, (data.used / data.limit) * 100)}%` }}
          />
        </div>
      </section>
    </div>
  );
}
