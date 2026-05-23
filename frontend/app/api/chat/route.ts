import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getAuthToken, getCurrentUser } from "@/lib/auth";

import {
    createConversation,
    createMessage,
    getConversation,
    StrapiError,
} from "@/lib/strapi";

const MODEL_ID = "gemini-2.5-flash";
const TITLE_MAX_LENGTH = 60;

const SYSTEM_PROMPTS = {
    chat: "You are a helpful AI assistant. Keep responses concise and accurate. Format replies in Markdown — use headers, bullet points, and code blocks where appropriate.",
    code: "You are an expert software Engineer and pair programmer, Help with code, debugging, architecture, and tooling."
} as const;

type ChatMode = keyof typeof SYSTEM_PROMPTS;
type ChatRequestBody = {
    messages?: UIMessage[];
    conversationId?: string;
    mode?: ChatMode;
};

function getMessageText(message: UIMessage | undefined) {
    if (!message) return "";
    return message.parts
        .filter((part) => part.type === "text")
        .map((part) => ("text" in part ? part.text : ""))
        .join("")
        .trim();
}

export async function POST(request: Request) {
    const jwt = await getAuthToken();
    const user = await getCurrentUser();

    if (!user || !user) {
        return Response.json({ error: "Unauthorized " }, { status: 401 });
    }

    let body: ChatRequestBody;
    try {
        body = (await request.json()) as ChatRequestBody
    } catch (error) {
        return Response.json({ error: "Invalid json body" }, { status: 400 })
    }

    const mode: ChatMode = body.mode === "code" || body.mode === "chat" ? body.mode : "chat"
    const systemPrompt = SYSTEM_PROMPTS[mode]

    const messages = body.messages
    if (!messages?.length) {
        return Response.json({ error: "Message is required" }, { status: 400 })
    }

    const lastMessage = messages ? messages[messages.length - 1] : undefined

    if (!lastMessage) {
        return Response.json({ error: "message is required. " }, { status: 400 })
    }
    if (lastMessage.role !== "user") {
        return Response.json({ error: "The last message must be from user." }, { status: 400 })
    }

    const userText = getMessageText(lastMessage)

    let conversationDocumentId = body.conversationId

    try {
        // if (conversationDocumentId) {
        //     const existing = await getConversation(jwt, conversationDocumentId)
        //     if (!existing) {
        //         const created = await createConversation(jwt, {
        //             title: userText.slice(0, TITLE_MAX_LENGTH) || "untitled",
        //         })
        //         conversationDocumentId = created.documentId
        //         // return Response.json({ error: "conversation not found" }, { status: 404 })
        //     }
        // } else {
        //     const created = await createConversation(jwt, {
        //         title: "Untitled"
        //     })
        //     conversationDocumentId = created.documentId
        // }

        // await createMessage(jwt, {
        //     content: userText,
        //     role: "user",
        //     conversationDocumentId
        // })

        if (!conversationDocumentId) {
            const created = await createConversation(jwt, {
                title: userText.slice(0, TITLE_MAX_LENGTH) || "untited",
            });
            conversationDocumentId = created.documentId;

        } else {
            const existing = await getConversation(jwt, conversationDocumentId)
            if (!existing) {
                return Response.json({ error: "Conversation not found" }, { status: 400 })
            }
        }

        await createMessage(jwt, {
            content: userText,
            role: "user", 
            conversationDocumentId
        })

    } catch (error) {
        return Response.json({ error: messages }, { status: 500 })
    }

    const result = streamText(
        {
            model: google(MODEL_ID),
            system: systemPrompt,
            messages: await convertToModelMessages(messages)
        }
    )
    result.consumeStream()
    const finalConversationDocumentId = conversationDocumentId;
    return result.toUIMessageStreamResponse({
        originalMessages: messages,
        headers: {
            "x-conversation-id": finalConversationDocumentId
        },
        messageMetadata: ({ part }) => {
            if (part.type === "start") {
                // const assistantText = getMessageText(responseMessage)
                return { conversationId: finalConversationDocumentId }
            }
        },
        onFinish: async ({ responseMessage }) => {
            const assistantText = getMessageText(responseMessage)
            if (!assistantText) return;

            try {
                await createMessage(jwt, {
                    content: assistantText, role: "assistant", conversationDocumentId: finalConversationDocumentId!
                })
            } catch (error) {
                console.error("[chat] Failed to persist assistant message:", error)
            }
        }
    })
}
