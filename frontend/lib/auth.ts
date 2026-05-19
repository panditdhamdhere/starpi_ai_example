import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, fetchCurrentUser } from "@/lib/starpi";

const AUTH_COOKIE_AGE = 60 * 60 * 24 * 7;

function authCookieOptions() {
  return {
    httpOnly: true,
    maxAge: AUTH_COOKIE_AGE,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function setAuthCookie(jwt: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, jwt, authCookieOptions());
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

export async function getCurrentUser() {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  try {
    return await fetchCurrentUser(token);
  } catch (error) {
    return null;
  }
}

export async function requireAuth(redirectTo = "/login") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export async function requireNoAuth(redirectTo = "/") {
  const user = await getCurrentUser();

  if (user) {
    redirect(redirectTo);
  }

  return null;
}
