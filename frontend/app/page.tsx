import { HomePage } from "@/components/marketing/home-page";
import { getCurrentUser } from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return <HomePage isAuthenticated={!!user} />;
}
