import { Link } from "@tanstack/react-router";
import mark from "@/assets/snapcut-mark.png";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  to?: string;
};

const sizes = {
  sm: { box: "h-8 w-8", text: "text-base" },
  md: { box: "h-10 w-10", text: "text-lg" },
  lg: { box: "h-14 w-14", text: "text-2xl" },
};

export function Logo({ className, size = "md", showWordmark = true, to = "/" }: LogoProps) {
  const s = sizes[size];
  return (
    <Link
      to={to}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="SnapCut AI home"
    >
      <span
        className={cn(
          "relative grid place-items-center rounded-xl border border-border bg-surface-2 p-1.5 transition-shadow group-hover:shadow-glow",
          s.box,
        )}
      >
        <img src={mark} alt="" aria-hidden="true" className="h-full w-full object-contain" />
      </span>
      {showWordmark && (
        <span className={cn("font-sans font-bold tracking-tight", s.text)}>
          SnapCut <span className="text-gradient">AI</span>
        </span>
      )}
    </Link>
  );
}
