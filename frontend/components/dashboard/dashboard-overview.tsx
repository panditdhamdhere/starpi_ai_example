import Link from "next/link";
import {
  ArrowRight,
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageCircle,
  VideoIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  StrapiConversations,
  StrapiImageRecord,
  StrapiUser,
  StrapiVideoRecord,
} from "@/lib/strapi";
import { cn } from "@/lib/utils";

const workspaces = [
  {
    href: "/chat",
    label: "Chat",
    description: "Stream conversations with Gemini",
    icon: MessageCircle,
    accent: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    href: "/code",
    label: "Code",
    description: "Pair-program and debug with AI",
    icon: Code,
    accent: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
  },
  {
    href: "/image",
    label: "Image",
    description: "Generate and browse your gallery",
    icon: ImageIcon,
    accent: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    href: "/video",
    label: "Video",
    description: "Create and review video generations",
    icon: VideoIcon,
    accent: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
] as const;

type DashboardOverviewProps = {
  user: StrapiUser;
  conversations: StrapiConversations[];
  images: StrapiImageRecord[];
  videos: StrapiVideoRecord[];
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function displayName(user: StrapiUser) {
  return user.username || user.email.split("@")[0];
}

export function DashboardOverview({
  user,
  conversations,
  images,
  videos,
}: DashboardOverviewProps) {
  const recentImages = images.slice(0, 4);
  const recentConversations = conversations.slice(0, 5);

  const stats = [
    { label: "Conversations", value: conversations.length },
    { label: "Images", value: images.length },
    { label: "Videos", value: videos.length },
  ];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-4 pb-10 md:p-8">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <LayoutDashboard className="size-3.5" />
            Dashboard
          </Badge>
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Welcome back, {displayName(user)}
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Pick a workspace below or jump back into recent work. Everything you
          create is saved to your Strapi account.
        </p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, value }) => (
          <li key={label}>
            <Card size="sm" className="py-4">
              <CardHeader className="gap-1">
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
              </CardHeader>
            </Card>
          </li>
        ))}
      </ul>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-medium tracking-tight">Workspaces</h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {workspaces.map(({ href, label, description, icon: Icon, accent, bg }) => (
            <li key={href}>
              <Link
                href={href}
                className="group block rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:border-border hover:bg-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      bg,
                    )}
                  >
                    <Icon className={cn("size-5", accent)} />
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <p className="mt-3 font-medium">{label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium tracking-tight">
              Recent conversations
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              nativeButton={false}
              render={<Link href="/chat" />}
            >
              Open chat
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          {recentConversations.length === 0 ? (
            <Card size="sm">
              <CardHeader>
                <CardDescription>
                  No conversations yet. Start chatting to see them here.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <ul className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/60">
              {recentConversations.map((conversation) => (
                <li key={conversation.documentId}>
                  <Link
                    href="/chat"
                    className="flex items-center justify-between gap-3 bg-card/30 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {conversation.title || "Untitled conversation"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(conversation.updatedAt)}
                      </p>
                    </div>
                    <MessageCircle className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium tracking-tight">Recent images</h2>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              nativeButton={false}
              render={<Link href="/image" />}
            >
              Open image
              <ArrowRight className="size-3.5" />
            </Button>
          </div>

          {recentImages.length === 0 ? (
            <Card size="sm">
              <CardHeader>
                <CardDescription>
                  No images yet. Generate one in the Image workspace.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <ul className="grid grid-cols-2 gap-2">
              {recentImages.map((image) => (
                <li
                  key={image.documentId}
                  className="overflow-hidden rounded-lg border border-border/60"
                >
                  <Link href="/image" className="block">
                    {image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt={image.prompt ?? "Generated image"}
                        className="aspect-square w-full object-cover transition-opacity hover:opacity-90"
                      />
                    ) : (
                      <div className="flex aspect-square items-center justify-center bg-muted text-xs text-muted-foreground">
                        No preview
                      </div>
                    )}
                    {image.prompt && (
                      <p className="line-clamp-1 border-t border-border/60 bg-card/80 px-2 py-1.5 text-xs text-muted-foreground">
                        {image.prompt}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {videos.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium tracking-tight">Recent videos</h2>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              nativeButton={false}
              render={<Link href="/video" />}
            >
              Open video
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {videos.slice(0, 4).map((video) => (
              <li
                key={video.documentId}
                className="rounded-lg border border-border/60 bg-card/30 px-4 py-3"
              >
                <p className="line-clamp-2 text-sm">
                  {video.prompt || "Untitled video"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(video.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
