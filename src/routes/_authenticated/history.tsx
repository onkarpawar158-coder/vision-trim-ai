import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GradientButton } from "@/components/brand/GradientButton";
import { getHistory } from "@/lib/snapcut.functions";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "History — SnapCut AI" },
      { name: "description", content: "Every background you removed with SnapCut AI." },
      { property: "og:title", content: "History — SnapCut AI" },
      { property: "og:description", content: "Browse and re-download your SnapCut AI cut-outs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: History,
});

async function download(url: string, fileName: string) {
  try {
    const blob = await (await fetch(url)).blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `${fileName.replace(/\.[^.]+$/, "")}-snapcut.png`;
    a.click();
    URL.revokeObjectURL(objectUrl);
  } catch {
    toast.error("Download failed. Please try again.");
  }
}

function History() {
  const fetchHistory = useServerFn(getHistory);
  const { data, isLoading } = useQuery({ queryKey: ["history"], queryFn: () => fetchHistory() });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your most recent background removals, newest first.
        </p>
      </header>

      {isLoading ? (
        <div className="grid place-items-center py-20 text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : !data || data.length === 0 ? (
        <p className="glass-card p-6 text-sm text-muted-foreground">
          You haven&rsquo;t processed any images yet.
        </p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((item) => (
            <li key={item.id} className="glass-card overflow-hidden">
              <div className="checkerboard grid h-44 place-items-center">
                {item.processedUrl ? (
                  <img
                    src={item.processedUrl}
                    alt={`Cut-out of ${item.originalFileName}`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-slate-600">Not available</span>
                )}
              </div>
              <div className="space-y-2 p-4">
                <p className="truncate text-sm font-medium">{item.originalFileName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()} ·{" "}
                  {item.status === "success" ? "Completed" : "Failed"}
                  {item.processingTimeMs ? ` · ${(item.processingTimeMs / 1000).toFixed(1)}s` : ""}
                </p>
                <GradientButton
                  variant="outline"
                  size="sm"
                  disabled={!item.available}
                  onClick={() =>
                    item.processedUrl && download(item.processedUrl, item.originalFileName)
                  }
                >
                  <Download /> Download
                </GradientButton>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
