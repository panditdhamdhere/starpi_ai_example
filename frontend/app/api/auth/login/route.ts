import { setAuthCookie } from "@/lib/auth";
import { loginWithStrapi } from "@/lib/starpi";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const auth = loginWithStrapi(
            String(body.idenfier ?? ""),
            String(body.password ?? "")
        )

        await setAuthCookie((await auth).jwt)

        return NextResponse.json({ user: (await auth).user })
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 })
    }
}