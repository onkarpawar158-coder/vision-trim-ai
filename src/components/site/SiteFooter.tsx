import { Logo } from "@/components/brand/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <Logo size="sm" />
        <p className="text-sm text-muted-foreground">
          AI background removal, free for everyone. 5 images per day.
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} SnapCut AI
        </p>
      </div>
    </footer>
  );
}
