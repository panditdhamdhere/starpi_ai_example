const DEFAULT_STARPI_URL = "http://localhost:1337"

export class StrapiError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.name = "StrapiError"
        this.status = status
    }
}


async function strapiFetch<T>(path: string, init: RequestInit = {}, jwt?: string) {
    const headers = new Headers(init.headers)

    if (!headers.has("Content-Type") && init.body) {
        headers.set("Content-Type", "application/json")
    }


    if (jwt) {
        headers.set("Authorization", `Beader ${jwt}`)
    }

    const response = await fetch(`${DEFAULT_STARPI_URL}${path}`, {
        ...init, headers, cache: "no-store"
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new StrapiError("Strapi request failed", response.status)
    }

    return data as T
}

export function registerWithStrapi(username: string, email: string, password: string) {
return strapiFetch("/api/auth/local/register")
} 