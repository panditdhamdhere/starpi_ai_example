import { google } from "@ai-sdk/google";
import { generateImage } from "ai";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { createImageRecord, StrapiError } from "@/lib/strapi";

const IMAGE_MODEL = "gemini-3.1-flash-image-preview";
type GoogleImageAspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";

const ASPECT_RATIO: GoogleImageAspectRatio[] = [
  "1:1",
  "3:4",
  "4:3",
  "9:16",
  "16:9",
];

const MEDIA_TYPE_EXTENTIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function parseAspectRatio(value: unknown): GoogleImageAspectRatio {
  if (
    typeof value === "string" &&
    ASPECT_RATIO.includes(value as GoogleImageAspectRatio)
  ) {
    return value as GoogleImageAspectRatio;
  }
  return "1:1";
}

async function saveGeneratedImage(base64: string, mediaType: string) {
  const extension = MEDIA_TYPE_EXTENTIONS[mediaType] ?? "png";
  const fileName = `${crypto.randomUUID()}.${extension}`;

  const publicPath = `/generated-images/${fileName}`;
  const outPutDir = join(process.cwd(), "public", "generated-images");
  await mkdir(outPutDir, { recursive: true });
  await writeFile(join(outPutDir, fileName), Buffer.from(base64, "base64"));

  return publicPath;
}

export async function POST(request: Request) {
  const jwt = await getAuthToken();
  const user = await getCurrentUser();

  if (!jwt || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const body = await request.json();
  const { prompt, aspectRatio } = body;

  const parsedAspectRatio = parseAspectRatio(aspectRatio);

  try {
    const result = await generateImage({
      model: google.image(IMAGE_MODEL),
      prompt,
      n: 1,
      providerOptions: {
        google: {
          aspectRatio,
        },
      },
    });
    const file = result.image;
    const imageUrl = await saveGeneratedImage(file.base64, file.mediaType);
    const record = await createImageRecord(jwt, {
      prompt,
      imageUrl,
    });

    return Response.json({
      model: IMAGE_MODEL,
      documentId: record.documentId,
      prompt: record.prompt,
      imageUrl: record.imageUrl,
    });
  } catch (error) {
    console.error("Error generating Image", error);
    return new Response(JSON.stringify({ error: "Failed to generate Image" }), {
      status: 500,
    });
  }
}
