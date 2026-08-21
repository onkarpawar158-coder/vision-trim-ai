import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Images, Loader2, Sparkles, Timer } from "lucide-react";
import { ImageUploader } from "@/components/app/ImageUploader";
import { getOverview } from "@/lib/snapcut.functions";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SnapCut AI" },
      {
        name: "description",
        content: "Upload an image and remove its background instantly with SnapCut AI.",
      },
      { property: "og:title", content: "Dashboard — SnapCut AI" },
      { property: "og:description", content: "Your SnapCut AI background removal workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const fetchOverview = useServerFn(getOverview);
  const { data, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: () => fetchOverview(),
  });

  if (isLoading || !data) {
    return (
      <div className="grid place-items-center py-24 text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const stats = [
    { icon: Sparkles, label: "Used today", value: `${data.used} / ${data.limit}` },
    { icon: Timer, label: "Remaining today", value: String(data.remaining) },
    { icon: Images, label: "Total processed", value: String(data.totalProcessed) },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{data.name ? `, ${data.name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Upload an image and SnapCut AI will cut out the background in seconds.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="glass-card flex items-center gap-4 p-5">
            <span className="grid size-11 place-items-center rounded-xl bg-gradient-brand-diagonal text-primary-foreground">
              <s.icon className="size-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="text-xl font-semibold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <ImageUploader remaining={data.remaining} />

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent cut-outs</h2>
          <Link to="/history" className="text-sm text-brand-cyan hover:underline">
            View all
          </Link>
        </div>

        {data.recent.length === 0 ? (
          <p className="glass-card p-6 text-sm text-muted-foreground">
            Nothing here yet — your processed images will appear in this list.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.recent.map((item) => (
              <li key={item.id} className="glass-card overflow-hidden">
                <div className="checkerboard grid h-40 place-items-center">
                  {item.processedUrl && (
                    <img
                      src={item.processedUrl}
                      alt={`Cut-out of ${item.originalFileName}`}
                      className="h-full w-full object-contain"
                    />
                  )}
                </div>
                <p className="truncate px-4 py-3 text-sm text-muted-foreground">
                  {item.originalFileName}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
