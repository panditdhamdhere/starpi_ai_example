import Link from "next/link";
import {
  ArrowRight,
  Code,
  ImageIcon,
  MessageCircle,
  Sparkles,
  VideoIcon,
  Zap,
} from "lucide-react";

import { SiteHeader } from "@/components/marketing/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Chat",
    description:
      "Stream natural conversations powered by Gemini. Markdown replies, saved to your Strapi history.",
    href: "/chat",
    icon: MessageCircle,
    accent: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    title: "Code",
    description:
      "Pair-program with an AI that understands debugging, architecture, and modern tooling.",
    href: "/code",
    icon: Code,
    accent: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    title: "Image",
    description:
      "Describe a scene and generate images with aspect-ratio control. Every creation lands in your gallery.",
    href: "/image",
    icon: ImageIcon,
    accent: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    title: "Video",
    description:
      "Turn prompts into short clips. Generate, preview, and browse past videos in one workspace.",
    href: "/video",
    icon: VideoIcon,
    accent: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
] as const;

const steps = [
  {
    step: "01",
    title: "Create your account",
    description: "Sign up with Strapi-backed auth. Your sessions stay secure with HTTP-only cookies.",
  },
  {
    step: "02",
    title: "Pick a workspace",
    description: "Jump into chat, code, image, or video — each tuned with its own system prompt and tools.",
  },
  {
    step: "03",
    title: "Create and revisit",
    description: "Conversations, images, and videos persist in Strapi so you can pick up where you left off.",
  },
] as const;

type HomePageProps = {
  isAuthenticated: boolean;
};

export function HomePage({ isAuthenticated }: HomePageProps) {
  const workspaceHref = isAuthenticated ? "/chat" : "/register";
  const workspaceLabel = isAuthenticated ? "Open workspace" : "Start for free";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isAuthenticated={isAuthenticated} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,oklch(0.525_0.223_3.958/0.18),transparent)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,oklch(0.55_0.2_280/0.12),transparent)]" />

          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
                <Sparkles className="size-3.5" />
                AI workspace · Gemini · Strapi
              </Badge>

              <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
                One place for chat, code, images, and video
              </h1>

              <p className="mt-5 text-lg text-muted-foreground text-pretty sm:text-xl">
                AIverse is your creative studio — stream AI responses, generate visuals,
                and keep everything organized in Strapi-backed collections.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="gap-2 px-6"
                  nativeButton={false}
                  render={<Link href={workspaceHref} />}
                >
                  {workspaceLabel}
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 px-6"
                  nativeButton={false}
                  render={<Link href="#features" />}
                >
                  Explore features
                </Button>
              </div>
            </div>

            {/* Preview cards */}
            <div className="mx-auto mt-16 grid max-w-4xl gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-card/50 p-4 shadow-xs backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Chat · streaming
                </div>
                <div className="space-y-2">
                  <div className="ml-auto max-w-[85%] rounded-lg bg-primary/15 px-3 py-2 text-sm">
                    Explain RAG in simple terms
                  </div>
                  <div className="max-w-[90%] rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                    Retrieval-augmented generation combines search with generation…
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/50 p-4 shadow-xs backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="size-3.5 text-primary" />
                  Image · generateImage
                </div>
                <div className="flex aspect-video items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 via-primary/10 to-rose-500/20">
                  <ImageIcon className="size-10 text-muted-foreground/50" />
                </div>
                <p className="mt-2 truncate text-xs text-muted-foreground">
                  A red panda reading in a cozy library, soft lighting
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="border-b border-border/60 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                Everything you need to build with AI
              </h2>
              <p className="mt-3 text-muted-foreground">
                Four focused workspaces, one account, one sidebar. Switch tools without
                losing context.
              </p>
            </div>

            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ title, description, href, icon: Icon, accent, bg }) => (
                <li key={title}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div
                        className={`mb-2 flex size-10 items-center justify-center rounded-lg ${bg}`}
                      >
                        <Icon className={`size-5 ${accent}`} />
                      </div>
                      <CardTitle>{title}</CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <div className="mt-auto px-6 pb-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 px-0"
                        nativeButton={false}
                        render={
                          <Link href={isAuthenticated ? href : "/register"} />
                        }
                      >
                        {isAuthenticated ? `Open ${title}` : "Sign up to try"}
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-b border-border/60 bg-muted/30 py-20 sm:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-semibold tracking-tight">
                How it works
              </h2>
              <p className="mt-3 text-muted-foreground">
                From sign-up to saved generations in three steps.
              </p>
            </div>

            <ol className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map(({ step, title, description }) => (
                <li key={step} className="relative text-center md:text-left">
                  <span className="font-heading text-4xl font-semibold text-primary/30">
                    {step}
                  </span>
                  <h3 className="mt-2 text-lg font-medium">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card px-6 py-14 text-center shadow-xs sm:px-12">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.525_0.223_3.958/0.12),transparent_70%)]"
                aria-hidden
              />
              <h2 className="relative font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                Ready to create?
              </h2>
              <p className="relative mx-auto mt-3 max-w-lg text-muted-foreground">
                {isAuthenticated
                  ? "Your workspace is waiting. Pick up a chat or generate something new."
                  : "Join AIverse and start chatting, coding, and generating in minutes."}
              </p>
              <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="gap-2"
                  nativeButton={false}
                  render={<Link href={workspaceHref} />}
                >
                  {workspaceLabel}
                  <ArrowRight className="size-4" />
                </Button>
                {!isAuthenticated && (
                  <Button
                    size="lg"
                    variant="outline"
                    nativeButton={false}
                    render={<Link href="/login" />}
                  >
                    I already have an account
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} AIverse. Built with Next.js & Strapi.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-foreground">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
