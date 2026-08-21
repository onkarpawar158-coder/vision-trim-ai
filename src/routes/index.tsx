import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  Download,
  Image as ImageIcon,
  Shield,
  Sparkles,
  UploadCloud,
  Wand2,
  Zap,
} from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { BeforeAfterSlider } from "@/components/app/BeforeAfterSlider";
import { gradientButtonVariants } from "@/components/brand/GradientButton";
import demoBefore from "@/assets/demo-before.jpg";
import demoAfter from "@/assets/demo-after.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SnapCut AI — Remove Image Backgrounds Instantly" },
      {
        name: "description",
        content:
          "SnapCut AI removes backgrounds from your photos in seconds with clean, transparent PNG results. 5 free images every day.",
      },
      { property: "og:title", content: "SnapCut AI — Remove Image Backgrounds Instantly" },
      {
        property: "og:description",
        content: "AI background removal with crisp edges and transparent PNGs. 5 free images daily.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const steps = [
  { icon: UploadCloud, title: "Upload your image", body: "Drop a PNG, JPG or WEBP up to 5 MB." },
  { icon: Wand2, title: "AI cuts it out", body: "Edges, hair and fine detail preserved automatically." },
  { icon: Download, title: "Download the PNG", body: "Get a transparent cut-out ready for anything." },
];

const features = [
  { icon: Zap, title: "Seconds, not minutes", body: "Most images finish processing in under ten seconds." },
  { icon: ImageIcon, title: "Transparent PNGs", body: "True alpha channel output that drops onto any background." },
  { icon: Sparkles, title: "Detail preserving", body: "The subject stays exactly as you shot it — no repainting." },
  { icon: Shield, title: "Private by default", body: "Your images are stored privately and only you can access them." },
];

const faqs = [
  {
    q: "How many images can I process for free?",
    a: "Every account gets 5 background removals per day, free. The counter resets each day at midnight UTC.",
  },
  {
    q: "Which file formats are supported?",
    a: "PNG, JPG, JPEG and WEBP up to 5 MB per image. Results are always delivered as transparent PNGs.",
  },
  {
    q: "Do you keep my images?",
    a: "Your originals and cut-outs are stored in private storage tied to your account so you can re-download them from your history. Nobody else can view them.",
  },
  {
    q: "Do I need a credit card?",
    a: "No. Create an account with email or Google and start cutting out backgrounds right away.",
  },
];

function Landing() {
  return (
    <div id="top" className="min-h-screen">
      <SiteNav />

      <main>
        <section className="relative overflow-hidden px-4 pb-20 pt-28 sm:px-6 sm:pt-36">
          <div className="glow-orb -top-20 left-1/4 h-80 w-80 bg-gradient-brand-diagonal" />
          <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="size-3.5 text-brand-cyan" /> 5 free removals every day
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                Remove image backgrounds <span className="text-gradient">instantly</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
                Upload a photo and SnapCut AI cuts out the subject with clean edges — delivered as a
                transparent PNG in seconds. No design skills, no waiting.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/auth"
                  search={{ mode: "register" }}
                  className={gradientButtonVariants({ size: "lg" })}
                >
                  Start free
                </Link>
                <a href="#how-it-works" className={gradientButtonVariants({ variant: "outline", size: "lg" })}>
                  See how it works
                </a>
              </div>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                {["No credit card", "Transparent PNG output", "Private to your account"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="size-4 text-brand-cyan" /> {t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-3 sm:p-4">
              <BeforeAfterSlider beforeSrc={demoBefore} afterSrc={demoAfter} />
              <p className="px-1 pt-3 text-center text-xs text-muted-foreground">
                Drag the handle to compare the original and the AI cut-out.
              </p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20 border-t border-border/60 px-4 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-7xl">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground">
              Three steps from a busy photo to a clean, ready-to-use cut-out.
            </p>
            <ol className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="glass-card p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-gradient-brand-diagonal text-primary-foreground">
                    <s.icon className="size-5" />
                  </span>
                  <p className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="features" className="scroll-mt-20 border-t border-border/60 px-4 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-7xl">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Built for clean cut-outs
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => (
                <div key={f.title} className="glass-card p-6">
                  <f.icon className="size-6 text-brand-cyan" />
                  <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="scroll-mt-20 border-t border-border/60 px-4 py-20 sm:px-6">
          <div className="mx-auto w-full max-w-3xl">
            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>
            <div className="mt-10 space-y-4">
              {faqs.map((f) => (
                <details key={f.q} className="glass-card group p-5">
                  <summary className="cursor-pointer list-none text-base font-medium marker:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 pb-24 sm:px-6">
          <div className="glass-card mx-auto w-full max-w-4xl p-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Cut out your first image now</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
              Create a free account and get 5 AI background removals every single day.
            </p>
            <Link
              to="/auth"
              search={{ mode: "register" }}
              className={`${gradientButtonVariants({ size: "lg" })} mt-7`}
            >
              Get started free
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
