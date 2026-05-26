import { FunctionResponse, GoogleGenAI } from "@google/genai"
import { mkdir } from "node:fs/promises"
import { join, resolve } from "node:path"

import { getAuthToken, getCurrentUser } from "@/lib/auth"
import { createVideoRecord, StrapiError } from "@/lib/strapi"

export const maxDuration = 600;

const VIDEO_MODEL = "veo-3.1-generate-preview"

type GoogleVideosAspectRatio = "16:9" | "9:16"
type GoogleVideosDuration = 4 | 6 | 8

const ASPECT_RATIOS: GoogleVideosAspectRatio[] = ["16:9", "9:16"]
const DURATIONS: GoogleVideosDuration[] = [4, 6, 8]
const POLL_INTERVAL_MS = 10_000;
const MAX_POLLS = 60

function parseAspectRatio(value: unknown): GoogleVideosAspectRatio {
    if (typeof value === "string" && ASPECT_RATIOS.includes(value as GoogleVideosAspectRatio)) {
        return value as GoogleVideosAspectRatio
    }
    return "16:9"
}

function parseDuration(value: unknown): GoogleVideosDuration {
    if (typeof
        value === "number" && DURATIONS.includes(value as GoogleVideosDuration)
    ) {
        return value as GoogleVideosDuration
    }

    if (typeof value === "string") {
        const parsed = Number(value)
        if (DURATIONS.includes(parsed as GoogleVideosDuration)) {
            return parsed as GoogleVideosDuration
        }
    }
    return 4
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function saveGeneratedVideo(ai: GoogleGenAI, file: Parameters<GoogleGenAI["files"]["download"]>[0]["file"]) {
    //   const extension = MEDIA_TYPE_EXTENTIONS[mediaType] ?? "png";
    const fileName = `${crypto.randomUUID()}.mp4`;

    const publicPath = `/generated-videos/${fileName}`;
    const outPutDir = join(process.cwd(), "public", "generated-videos");
    const outputPath = join(outPutDir, fileName)
    await mkdir(outPutDir, { recursive: true });
    await ai.files.download({ file, downloadPath: outputPath })

    return publicPath;
}

export async function POST(request: Request) {
    const jwt = await getAuthToken()
    const user = await getCurrentUser()

    if (!jwt || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const body = await request.json()
    const aspectRatio = parseAspectRatio(body.aspectRatio);
    const duration = parseDuration(body.duration);

    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!
        })
        let operation = await ai.models.generateVideos({
            model: VIDEO_MODEL,
            prompt: body.prompt,
            config: {
                numberOfVideos: 1, aspectRatio, durationSeconds: duration
            }
        })

        for (let poll = 0; !operation.done && poll < MAX_POLLS; poll++) {
            await delay(POLL_INTERVAL_MS)
            operation = await ai.operations.getVideosOperation({ operation })
        }

        if (!operation.done) {
            return new Response(JSON.stringify({ error: "Video gneration timeout" }), { status: 500 })

        }

        if (operation.error) {
            console.error("video generation error:", operation.error)
            return new Response(JSON.stringify({ error: "Video generation failed" }), { status: 500 })
        }

        const generatedVideo = operation?.response?.generatedVideos?.[0].video;

        if (!generatedVideo) {
            return new Response(JSON.stringify({ error: "No video generated" }), { status: 500 })


        }

        const videoUrl = await saveGeneratedVideo(ai, generatedVideo)
        const record = await createVideoRecord(jwt, {
            prompt: body.prompt,
            videoUrl
        })

        return Response.json({
            model: VIDEO_MODEL, documentId: record.documentId, prompt: record.prompt, videoUrl: record.videoUrl
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: "Failed to generate Videos" }), { status: 500 })
    }
}