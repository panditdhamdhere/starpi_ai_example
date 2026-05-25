import { FunctionResponse, GoogleGenAI } from "@google/genai"
import { mkdir } from "node:fs/promises"
import { join } from "node:path"

import { getAuthToken, getCurrentUser } from "@/lib/auth"
import { createVideoRecord, StrapiError } from "@/lib/strapi"

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