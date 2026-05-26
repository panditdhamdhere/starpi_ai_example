import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getAuthToken, requireAuth } from "@/lib/auth";
import {
  listConversations,
  listImageRecords,
  listVideoRecords,
} from "@/lib/strapi";

export default async function DashboardPage() {
  const user = await requireAuth();
  const jwt = await getAuthToken();

  const [conversations, images, videos] = await Promise.all([
    jwt ? listConversations(jwt).catch(() => []) : [],
    jwt ? listImageRecords(jwt).catch(() => []) : [],
    jwt ? listVideoRecords(jwt).catch(() => []) : [],
  ]);

  return (
    <DashboardOverview
      user={user}
      conversations={conversations}
      images={images}
      videos={videos}
    />
  );
}
