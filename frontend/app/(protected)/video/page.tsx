"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Loader, SpaceIcon, Sparkle, VideoIcon } from "lucide-react";
import { toast } from "sonner";

type GalleryItem = {
  documentId: string;
  prompt: string | null;
  videoUrl: string | null;
  createdAt: string;
};

type generateResponse = {
  documentId: string;
  prompt: string | null;
  videoUrl: string | null;
  model: string;
};

const ASPECT_OPTIONS: { value: string; label: string }[] = [
  { value: "16:9", label: "16:9 — Wide" },
  { value: "9:16", label: "9:16 — Tall" },
];

const DURATION_OPTIONS: { value: string; label: string }[] = [
  { value: "4", label: "4 seconds" },
  { value: "6", label: "6 seconds" },
  { value: "8", label: "8 seconds" },
];

const page = () => {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [durationSeconds, setDurationSeconds] = useState("4");
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  // const [gallery, setGallery] = useState<>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);

  const loadGallery = async () => {
    try {
      const response = await fetch("/api/videos", { cache: "no-store" });
      if (!response.ok) {
        if (response.status === 401) return;
        throw new Error("Failed to load gallery");
      }
      const data = await response.json();
      setGallery(data.videos ?? []);
    } catch (error) {
      toast.error("Could not load your Video");
    } finally {
      setIsLoadingGallery(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = prompt.trim();
    setIsGenerating(true);
    setPreview(null);

    try {
      const response = await fetch("/api/videos/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text, aspectRatio, durationSeconds }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          typeof data?.error === "string" ? data.error : "Failed to generate video",
        );
      }
      setPreview(data.videoUrl);
      toast.success("Video is ready");
      await loadGallery();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error generating video",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 pb-8">
      <header>
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Workspace
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Image
          </h1>
          <p className="text-xs text-muted-foreground">
            veo 3.1(default: Generate preview)
          </p>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Describe a scene; Video are generated with the Ai SDK {""}
          <code className="rounded bg-muted px-1 py-0.5 text-xs ">
            generateImage
          </code>
          {""}
          and saved to your Strapi collection
        </p>
      </header>

      <form
        onSubmit={handleGenerate}
        className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/30 p-4"
      >
        <div className="grid gap-4 sm;grid-cols-[1fr, auto] sm:items-end">
          <div className="grid gap-2">
            <Label htmlFor="image-prompt">Prompt</Label>
            <textarea
              id="image-prompt"
              className="border-input bg-background min-h-24 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-[50] disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Eg, A Red Panda reading a book incoz libraray, soft lightining"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
          </div>
          <div className="grid gap-2 sm:w-40">
            <Label htmlFor="aspect">Aspect ratio</Label>
            <select
              id="aspect"
              className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              disabled={isGenerating}
            >
              {ASPECT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2 sm:w-40">
            <Label htmlFor="duration">Duration</Label>
            <select
              id="duration"
              className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(e.target.value)}
              disabled={isGenerating}
            >
              {DURATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            type="submit"
            className="gap-2"
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <Loader className="size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <SpaceIcon className="size-4" />
                Generate
              </>
            )}
          </Button>
        </div>
      </form>

      <section className="space-y-2">
        <h2 className="text-sm font-medium tracking-tight">latest result</h2>
        <div
          className={cn(
            "relative flex min-h-72 w-full items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-muted/20",
            aspectRatio === "1:1" && "aspect-square max-w-md",
            aspectRatio === "16:9" && "aspect-video max-w-3xl",
            aspectRatio === "9:16" && "aspect-9/16 max-w-xs",
            aspectRatio === "4:3" && "aspect-4/3 max-w-2xl",
            aspectRatio === "3:4" && "aspect-3/4 max-w-lg",
          )}
        >
          {isGenerating && (
            <>
              <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
              <div className="bg-background/70 absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                <Loader className="text-primary size-10 animate-spin" />
                <p className="text-muted-foreground text-sm">
                  Generating your Video...
                </p>
              </div>
            </>
          )}
          {!isGenerating && !preview && (
            <div className="text bg-muted-foreground flex min-h-72 w-full flex-col items-center justify-center gap-2 px-6 text-center text-sm">
              <VideoIcon className={"size-10 opacity-50"} />
              <span> Your new Video will show here</span>
            </div>
          )}
          {preview && !isGenerating && (
            <video
              className="max-h-[min(70vh, 720px)] w-full object-contain p-2"
              src={preview}
              controls
              playsInline
            />
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-medium tracking-tight">Your Generations</h2>
        {isLoadingGallery ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : gallery?.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No Video yet, generate one above - it will be listed here and stored
            in Strapi
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {gallery.map((item) => (
              <li
                key={item.documentId}
                className="group border-border/60 relative overflow-hidden rounded-lg border"
              >
                {item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    className="aspect-video w-full bg-black
                     object-cover transition group-hover:opacity-90"
                    controls
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <div className="bg-muted flex aspect-square items-center justify-center text-xs text-accent-foreground">
                    No preview
                  </div>
                )}
                {item.prompt && (
                  <p className="line-clamp-2 border-t border-border/60 bg-card/90 p-2 text-xs text-muted-foreground">
                    {item.prompt}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default page;
