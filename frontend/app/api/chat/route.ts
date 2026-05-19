import {google } from "@ai-sdk/google"
import {convertToModelMessages , streamText, type UIMessage} from "ai"
import { getAuthToken, getCurrentUser } from "@/lib/auth"