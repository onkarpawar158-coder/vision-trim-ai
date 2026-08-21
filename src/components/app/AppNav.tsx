import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { gradientButtonVariants } from "@/components/brand/GradientButton";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/settings", label: "Settings" },
] as const;

export function AppNav() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { mode: "login" }, replace: true });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav
        aria-label="Application"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6"
      >
        <Logo size="sm" to="/dashboard" />

        <ul className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                activeProps={{ className: "bg-surface-2 text-foreground" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={signOut}
          className={gradientButtonVariants({ variant: "outline", size: "sm" })}
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </nav>
    </header>
  );
}
