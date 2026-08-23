import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Loader2, Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/brand/Logo";
import { GradientButton } from "@/components/brand/GradientButton";
import { useAuth } from "@/hooks/useAuth";

const searchSchema = z
  .object({
    mode: z.enum(["login", "register"]).catch("login"),
    code: z.string().optional(),
    error: z.string().optional(),
    error_description: z.string().optional(),
  })
  .catch({ mode: "login" as const });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in — SnapCut AI" },
      {
        name: "description",
        content:
          "Log in or create your free SnapCut AI account to remove image backgrounds instantly with AI.",
      },
      { property: "og:title", content: "Sign in — SnapCut AI" },
      {
        property: "og:description",
        content: "Create a free SnapCut AI account and cut out backgrounds in seconds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const credentials = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(255),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

function AuthPage() {
  const search = Route.useSearch();
  const { mode } = search;
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentEmail, setSentEmail] = useState(false);
  const [exchangingCode, setExchangingCode] = useState(false);

  const isRegister = mode === "register";

  useEffect(() => {
    if (!search.error) return;
    const message = search.error_description
      ? decodeURIComponent(search.error_description)
      : `OAuth error: ${search.error}`;
    setError((prev) => prev ?? message);
  }, [search.error, search.error_description]);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/dashboard", replace: true });
  }, [loading, session, navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!search.code || exchangingCode) return;
      setExchangingCode(true);
      try {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(search.code);
        if (exchangeError && !cancelled) {
          setError(
            exchangeError.message ||
              (search.error_description
                ? decodeURIComponent(search.error_description)
                : search.error
                  ? `OAuth error: ${search.error}`
                  : "Sign-in failed. Please try again."),
          );
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "Sign-in failed. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setExchangingCode(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [search.code, search.error, search.error_description, exchangingCode]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    if (isRegister && name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    setBusy(true);
    try {
      if (isRegister) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
            data: { name: name.trim() },
          },
        });
        if (signUpError) {
          setError(
            signUpError.message.toLowerCase().includes("already")
              ? "An account with this email already exists. Try logging in."
              : signUpError.message,
          );
          return;
        }
        if (!data.session) {
          setSentEmail(true);
          toast.success("Check your email to confirm your account.");
          return;
        }
        const { data: recheck } = await supabase.auth.getSession();
        if (!recheck.session) {
          setSentEmail(true);
          toast.success("Check your email to confirm your account.");
          return;
        }
        toast.success("Welcome to SnapCut AI!");
        navigate({ to: "/dashboard", replace: true });
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (signInError) {
          if (signInError.code === "email_not_confirmed") {
            setError(
              "Please confirm your email address before logging in. Check your inbox for the confirmation link.",
            );
          } else {
            setError(signInError.message || "Sign-in failed. Please try again.");
          }
          return;
        }
        const { data: recheck } = await supabase.auth.getSession();
        if (!recheck.session) {
          await new Promise((r) => setTimeout(r, 300));
          const { data: recheck2 } = await supabase.auth.getSession();
          if (!recheck2.session) {
            setError("Session was not created. Please try again.");
            return;
          }
        }
        toast.success("Welcome back!");
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (e) {
      const message =
        e instanceof Error && e.message ? e.message : "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth`,
        },
      });
      if (error) {
        setError(
          error.message || "Google sign-in failed. Please try again.",
        );
        setBusy(false);
      }
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Google sign-in failed. Please try again.",
      );
      setBusy(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-14">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gradient-brand opacity-20 blur-[120px]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <div className="glass-card rounded-2xl p-7 sm:p-8">
          {exchangingCode ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <Loader2 className="size-6 animate-spin text-brand-cyan" />
              <p className="text-sm text-muted-foreground">
                Completing sign-in…
              </p>
            </div>
          ) : sentEmail ? (
            <div className="text-center">
              <h1 className="text-xl font-semibold">Confirm your email</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                We sent a confirmation link to <span className="text-foreground">{email}</span>.
                Click it to activate your account, then come back and log in.
              </p>
              <Link
                to="/auth"
                search={{ mode: "login" }}
                onClick={() => setSentEmail(false)}
                className="mt-6 inline-block text-sm text-brand-cyan hover:underline"
              >
                Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">
                {isRegister ? "Create your free account" : "Welcome back"}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {isRegister
                  ? "5 free background removals every day. No credit card."
                  : "Log in to keep cutting out backgrounds."}
              </p>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={busy}
                className="mt-6 flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface-2 text-sm font-medium transition-colors hover:border-brand-cyan/40 disabled:opacity-50"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {isRegister && (
                  <Field
                    icon={<UserIcon className="size-4" />}
                    label="Name"
                    id="name"
                    type="text"
                    value={name}
                    autoComplete="name"
                    maxLength={80}
                    placeholder="Alex Rivera"
                    onChange={setName}
                  />
                )}
                <Field
                  icon={<Mail className="size-4" />}
                  label="Email"
                  id="email"
                  type="email"
                  value={email}
                  autoComplete="email"
                  maxLength={255}
                  placeholder="you@example.com"
                  onChange={setEmail}
                />
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="size-4" />
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={isRegister ? "new-password" : "current-password"}
                      placeholder="At least 8 characters"
                      className="h-11 w-full rounded-xl border border-border bg-surface-2 pl-9 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-cyan/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {error}
                  </p>
                )}

                <GradientButton type="submit" size="lg" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="size-4 animate-spin" />}
                  {isRegister ? "Create account" : "Log in"}
                </GradientButton>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {isRegister ? "Already have an account?" : "New to SnapCut AI?"}{" "}
                <Link
                  to="/auth"
                  search={{ mode: isRegister ? "login" : "register" }}
                  className="font-medium text-brand-cyan hover:underline"
                >
                  {isRegister ? "Log in" : "Create one free"}
                </Link>
              </p>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-muted-foreground hover:text-foreground">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}

function Field({
  icon,
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  maxLength,
}: {
  icon: React.ReactNode;
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          maxLength={maxLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full rounded-xl border border-border bg-surface-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-cyan/60"
        />
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c5.6 0 9.3-3.9 9.3-9.4 0-.6-.06-1.1-.15-1.6H12z"
      />
    </svg>
  );
}
