const DEFAULT_STARPI_URL = "http://localhost:1337";
export const AUTH_COOKIE_NAME = "strapi_jwt";

export type StrapiUser = {
  id: number;
  username: string;
  email: string;
};

export type StrapiAuthResponse = {
  jwt: string;
  user: StrapiUser;
};

export class StrapiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "StrapiError";
    this.status = status;
  }
}

async function strapiFetch<T>(
  path: string,
  init: RequestInit = {},
  jwt?: string,
) {
  const headers = new Headers(init.headers);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }

  if (jwt) {
    headers.set("Authorization", `Bearer ${jwt}`);
  }

  const response = await fetch(`${DEFAULT_STARPI_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new StrapiError("Strapi request failed", response.status);
  }

  return data as T;
}

export function registerWithStrapi(
  username: string,
  email: string,
  password: string,
) {
  return strapiFetch<StrapiAuthResponse>("/api/auth/local/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });
}

export function loginWithStrapi(identifier: string, password: string) {
  return strapiFetch<StrapiAuthResponse>("/api/auth/local/", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export function fetchCurrentUser(jwt: string) {
  return strapiFetch("/api/users/me", {}, jwt);
}

/// -------------- Conversations --------------------- ///

type One<T> = {
  data: T;
};

type Many<T> = {
  data: T[];
};

async function strapiCreate<T>(
  jwt: string | undefined,
  path: string,
  fields: Record<string, unknown>,
) {
  const response = await strapiFetch<One<T>>(
    path,
    {
      method: "POST",
      body: JSON.stringify({ data: fields }),
    },
    jwt,
  );
  return response.data;
}

async function strapiList<T>(
  jwt: string,
  path: string,
  pageSize: string,
): Promise<T[]> {
  const q = new URLSearchParams({
    sort: "createdAt: desc",
    "pegination[pageSize]": pageSize,
  });

  const response = await strapiFetch<Many<T>>(`${path}?${q}`, {}, jwt);
  return response.data;
}

export type ChatRole = "user" | "assistant";

export type StrapiMessages = {
  id: number;
  documentId: string;
  content: string;
  role: ChatRole;
  createdAt: string;
  updatedAt: string;
};

export type StrapiConversations = {
  id: number;
  documentId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

export function createConversation(
  jwt: string | undefined,
  param: { title: string },
): Promise<StrapiConversations> {
  return strapiCreate(jwt, "/api/conversations", { title: param.title });
}

export async function getConversation(jwt: string | undefined, documentId: string) {
  try {
    const response = await strapiFetch<One<StrapiConversations>>(
      `/api/conversations/${encodeURIComponent(documentId)}`,
      {},
      jwt,
    );

    return response.data;
  } catch (error) {
    throw error;
  }
}

export function createMessage(
  jwt: string | undefined,
  params: { content: string; role: ChatRole; conversationDocumentId: string },
): Promise<StrapiMessages> {
  return strapiCreate(jwt, "/api/messages", {
    content: params.content,
    role: params.role,
    conversation: params.conversationDocumentId,
  });
}

// -------------------Images and Videos ------------------//

export type StrapiImageRecord = {
  id: number;
  documentId: string;
  prompt: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export function createImageRecord(jwt: string, params: { prompt: string, imageUrl: string }): Promise<StrapiImageRecord> {
  return strapiCreate(jwt, "/api/images", {
    prompt: params.prompt,
    imageUrl: params.imageUrl
  })
}

export function listImageRecords(jwt: string): Promise<StrapiImageRecord[]> {
  return strapiList(jwt, "/api/images", "24")
}


export type StrapiVideoRecord = {
  id: number;
  documentId: string;
  prompt: string | null;
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
export function createVideoRecord(jwt: string, params: { prompt: string, videoUrl: string }): Promise<StrapiVideoRecord> {
  return strapiCreate(jwt, "/api/images", {
    prompt: params.prompt,
    imageUrl: params.videoUrl
  })
}


