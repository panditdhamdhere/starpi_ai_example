import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { listVideoRecords, StrapiError } from "@/lib/strapi";

export async function GET() {
  const jwt = await getAuthToken();
  const user = await getCurrentUser();

  if (!jwt && !user) {
    return new Response(JSON.stringify({ error: "unauthorised" }), {
      status: 401,
    });
  }

  try {
    const videos = await listVideoRecords(jwt!);
    return Response.json({ videos });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
