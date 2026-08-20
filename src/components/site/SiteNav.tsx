import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { gradientButtonVariants } from "@/components/brand/GradientButton";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { label: "Home", href: "/#top" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { session, loading } = useAuth();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6"
      >
        <Logo size="sm" />

        <ul className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && session ? (
            <Link to="/dashboard" className={gradientButtonVariants({ size: "sm" })}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className={gradientButtonVariants({ variant: "ghost", size: "sm" })}
              >
                Login
              </Link>
              <Link
                to="/auth"
                search={{ mode: "register" }}
                className={gradientButtonVariants({ size: "sm" })}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid h-10 w-10 place-items-center rounded-xl border border-border text-foreground md:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 px-4 py-5 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            {!loading && session ? (
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className={gradientButtonVariants({ size: "lg" })}
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth"
                  search={{ mode: "login" }}
                  onClick={() => setOpen(false)}
                  className={gradientButtonVariants({ variant: "outline", size: "lg" })}
                >
                  Login
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "register" }}
                  onClick={() => setOpen(false)}
                  className={gradientButtonVariants({ size: "lg" })}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
