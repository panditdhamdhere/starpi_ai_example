"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { MessageCircle, Code, ImageIcon, VideoIcon, LogOut as LogOutIcon, User } from "lucide-react"
import { logoutAction } from "@/actions/auth"

const nav = [
    { href: "/chat", label: "Chat", icon: MessageCircle },
    { href: "/code", label: "Code", icon: Code },
    { href: "/image", label: "Image", icon: ImageIcon },
    { href: "/video", label: "Video", icon: VideoIcon },
]

type DashboardShellProps = {
    userEmail: string
    children: ReactNode
}

export function DashboardShell({ userEmail, children }: DashboardShellProps) {
    const pathName = usePathname()

    return (
        <div className="flex min-h-screen flex-col bg-background md:flex-row">

            {/* ── Sidebar ─────────────────────────────────────────── */}
            <aside className="flex w-[210px] shrink-0 flex-col border-r border-border bg-background">

                {/* Logo */}
                <div className="flex items-center gap-2.5 px-4 py-[18px]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 3v10M3 8h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <path d="M5 5l6 6M11 5l-6 6" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                        </svg>
                    </div>
                    <span className="text-[15px] font-semibold tracking-tight text-foreground">
                        AIverse
                    </span>
                </div>

                {/* Nav links */}
                <nav className="flex flex-1 flex-col gap-0.5 px-2">
                    {nav.map(({ href, label, icon: Icon }) => {
                        const active = pathName === href || pathName.startsWith(href + "/")
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex items-center gap-2.5 rounded-md px-3 py-[7px] text-[13.5px] font-medium transition-colors",
                                    active
                                        ? "bg-accent text-foreground"
                                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                                )}
                            >
                                <Icon size={15} className="shrink-0" />
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                {/* ── Bottom section ───────────────────────────────── */}
                <div className="mt-auto flex flex-col gap-3 border-t border-border p-3 md:p-4">

                    {/* Theme label + ModeToggle side by side */}
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                            Theme
                        </span>
                        <ModeToggle />
                    </div>

                    {/* Signed-in user row */}
                    <div className="flex min-w-0 items-center gap-2 rounded-md border border-border/60 bg-background/80 px-2 py-1.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
                            <User className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                                Signed in
                            </p>
                            <p className="truncate text-xs text-foreground" title={userEmail}>
                                {userEmail}
                            </p>
                        </div>
                    </div>

                    {/* Log out */}
                    <form action={logoutAction} className="w-full">
                        <Button
                            type="submit"
                            variant="outline"
                            className="h-9 w-full gap-2"
                        >
                            <LogOutIcon className="h-4 w-4" />
                            Log out
                        </Button>
                    </form>

                </div>
            </aside>

            {/* ── Main content ────────────────────────────────────── */}
            <main className="flex flex-1 flex-col overflow-auto bg-background">
                {children}
            </main>

        </div>
    )
}