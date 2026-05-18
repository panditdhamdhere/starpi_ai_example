import { clearAuthCookie } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
   await clearAuthCookie()
   return NextResponse.json({ok:true})
}