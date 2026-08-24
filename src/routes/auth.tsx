import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Loader2, Mail, Lock, User as UserIcon, Eye, EyeOff, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Logo } from "@/components/brand/Logo";
import { GradientButton } from "@/components/brand/GradientButton";
import { useAuth } from "@/hooks/useAuth";

const searchSchema = z
  .object({
    mode: z.enum(["login", "register"]).catch("login"),
    code: z.string().optional(),
    error: z.string().optional(),
    error_description: z.string().optional(),
    error_code: z.string().optional(),
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
  const [isEmailUnconfirmed, setIsEmailUnconfirmed] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [sentEmail, setSentEmail] = useState(false);
  const [exchangingCode, setExchangingCode] = useState(false);
  const exchangingCodeRef = useRef(false);

  const isRegister = mode === "register";

  // Check URL search params for errors
  useEffect(() => {
    if (!search.error && !search.error_description) return;
    const message = search.error_description
      ? decodeURIComponent(search.error_description.replace(/\+/g, " "))
      : `OAuth error: ${search.error}`;
    setError((prev) => prev ?? message);
  }, [search.error, search.error_description]);

  // Check URL hash fragment for errors or tokens
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;
    try {
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const hashError = params.get("error");
      const hashDesc = params.get("error_description");
      if (hashError || hashDesc) {
        setError(
          hashDesc
            ? decodeURIComponent(hashDesc.replace(/\+/g, " "))
            : `Authentication error: ${hashError}`,
        );
      }
    } catch {
      // Ignore hash parse errors
    }
  }, []);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && session) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [loading, session, navigate]);

  // Handle PKCE code exchange from email confirmation or OAuth callback
  useEffect(() => {
    const code = search.code;
    if (!code || exchangingCodeRef.current) return;
    exchangingCodeRef.current = true;
    setExchangingCode(true);

    (async () => {
      try {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          const desc = search.error_description
            ? decodeURIComponent(search.error_description.replace(/\+/g, " "))
            : search.error
              ? `OAuth error: ${search.error}`
              : null;
          setError(exchangeError.message || desc || "Sign-in verification failed. Please try logging in.");
        } else if (data.session) {
          toast.success("Successfully signed in!");
          navigate({ to: "/dashboard", replace: true });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Sign-in failed. Please try again.");
      } finally {
        setExchangingCode(false);
      }
    })();
  }, [search.code, search.error, search.error_description, navigate]);

  async function handleResendConfirmation() {
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address above first.");
      return;
    }
    setResendingEmail(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email: trimmed,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      if (resendError) {
        const msg = resendError.message?.toLowerCase() || "";
        if (msg.includes("rate limit") || resendError.status === 429) {
          toast.error("Email rate limit exceeded. Please wait a few minutes before requesting another email.");
        } else {
          toast.error(resendError.message || "Could not resend confirmation email.");
        }
      } else {
        toast.success(`Confirmation email resent to ${trimmed}. Please check your inbox!`);
      }
    } catch {
      toast.error("Failed to resend confirmation email.");
    } finally {
      setResendingEmail(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsEmailUnconfirmed(false);

    const parsed = credentials.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    if (isRegister && name.trim().length < 2) {
      setError("Please enter your name (at least 2 characters).");
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
          const msg = signUpError.message?.toLowerCase() || "";
          if (msg.includes("rate limit") || signUpError.status === 429) {
            setError(
              "Email rate limit exceeded: Supabase limits verification emails per hour. If you have already registered with this email, please log in below.",
            );
          } else if (msg.includes("already") || msg.includes("registered") || signUpError.status === 422) {
            setError("An account with this email already exists. Try logging in with your password.");
          } else {
            setError(signUpError.message || "Registration failed. Please try again.");
          }
          return;
        }

        // If session is already created (auto-confirm enabled), navigate to dashboard
        if (data.session) {
          toast.success("Welcome to SnapCut AI!");
          navigate({ to: "/dashboard", replace: true });
          return;
        }

        // Email confirmation is required
        setSentEmail(true);
        toast.success("Check your email to confirm your account.");
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });

        if (signInError) {
          const msg = signInError.message?.toLowerCase() || "";
          if (signInError.code === "email_not_confirmed" || msg.includes("email not confirmed")) {
            setIsEmailUnconfirmed(true);
            setError(
              "Please confirm your email address before logging in. Check your inbox for the confirmation link.",
            );
          } else if (msg.includes("rate limit") || signInError.status === 429) {
            setError("Too many login attempts. Please wait a few minutes and try again.");
          } else if (msg.includes("invalid login credentials") || msg.includes("invalid credentials")) {
            setError("Invalid email or password. Please check your credentials or create a free account.");
          } else {
            setError(signInError.message || "Sign-in failed. Please try again.");
          }
          return;
        }

        if (data.session) {
          toast.success("Welcome back!");
          navigate({ to: "/dashboard", replace: true });
          return;
        }

        // In case session update is asynchronously dispatched
        const { data: recheck } = await supabase.auth.getSession();
        if (recheck.session) {
          toast.success("Welcome back!");
          navigate({ to: "/dashboard", replace: true });
          return;
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
    setIsEmailUnconfirmed(false);
    setBusy(true);

    try {
      let isInIframe = false;
      try {
        isInIframe = typeof window !== "undefined" && window.self !== window.top;
      } catch {
        isInIframe = true;
      }

      if (isInIframe) {
        // Inside Lovable preview iframe: use Lovable Cloud Auth broker
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: `${window.location.origin}/auth`,
        });

        if (result.redirected) {
          return;
        }

        if (result.error) {
          const errMsg = result.error.message || "";
          if (
            errMsg.toLowerCase().includes("not enabled") ||
            errMsg.toLowerCase().includes("unsupported provider") ||
            errMsg.toLowerCase().includes("validation_failed")
          ) {
            setError(
              "Google sign-in is not enabled for this project. Please sign in with email and password, or enable Google provider in your Supabase Auth settings.",
            );
          } else {
            setError(errMsg || "Google sign-in failed. Please try again.");
          }
          setBusy(false);
          return;
        }

        if (result.tokens) {
          toast.success("Welcome back!");
          navigate({ to: "/dashboard", replace: true });
          return;
        }
      }

      // Outside iframe (standalone browser): use direct Supabase OAuth with skipBrowserRedirect
      // This prevents the browser from navigating to 404 or raw 400 JSON pages
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth`,
          skipBrowserRedirect: true,
        },
      });

      if (oauthError) {
        const msg = oauthError.message || "";
        if (
          msg.toLowerCase().includes("not enabled") ||
          msg.toLowerCase().includes("unsupported provider") ||
          msg.toLowerCase().includes("validation_failed")
        ) {
          setError(
            "Google sign-in is not enabled for this project. Please sign in with email and password, or enable Google provider in your Supabase Auth settings.",
          );
        } else {
          setError(msg || "Google sign-in failed. Please try again.");
        }
        setBusy(false);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError(
          "Google sign-in is not configured on this Supabase project. Please sign in with email and password.",
        );
        setBusy(false);
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      if (
        errMsg.toLowerCase().includes("not enabled") ||
        errMsg.toLowerCase().includes("unsupported provider") ||
        errMsg.toLowerCase().includes("validation_failed")
      ) {
        setError(
          "Google sign-in is not enabled for this project. Please sign in with email and password, or enable Google provider in your Supabase Auth settings.",
        );
      } else {
        setError(errMsg || "Google sign-in failed. Please try again.");
      }
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
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <Loader2 className="size-8 animate-spin text-brand-cyan" />
              <p className="text-sm font-medium text-foreground">
                Completing sign-in…
              </p>
              <p className="text-xs text-muted-foreground">
                Verifying your credentials, please wait.
              </p>
            </div>
          ) : sentEmail ? (
            <div className="text-center">
              <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-brand-cyan/10 text-brand-cyan">
                <Mail className="size-6" />
              </div>
              <h1 className="text-xl font-semibold">Confirm your email</h1>
              <p className="mt-3 text-sm text-muted-foreground">
                We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>.
                Click the link in your email to activate your account.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleResendConfirmation}
                  disabled={resendingEmail}
                  className="inline-flex items-center justify-center gap-2 text-sm font-medium text-brand-cyan hover:underline disabled:opacity-50"
                >
                  {resendingEmail ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                  Resend confirmation email
                </button>
                <Link
                  to="/auth"
                  search={{ mode: "login" }}
                  onClick={() => setSentEmail(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Back to login
                </Link>
              </div>
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
                  <div role="alert" className="space-y-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      <p className="flex-1 leading-relaxed">{error}</p>
                    </div>
                    {isEmailUnconfirmed && (
                      <button
                        type="button"
                        onClick={handleResendConfirmation}
                        disabled={resendingEmail}
                        className="inline-flex items-center gap-1.5 pl-6 text-xs font-semibold underline hover:opacity-80 disabled:opacity-50"
                      >
                        {resendingEmail ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Send className="size-3" />
                        )}
                        Resend confirmation email
                      </button>
                    )}
                  </div>
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
                  onClick={() => {
                    setError(null);
                    setIsEmailUnconfirmed(false);
                  }}
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
