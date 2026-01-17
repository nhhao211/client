import { getSession } from "@/app/actions";
import LandingView from "./LandingView";

export default async function HomePage() {
  const token = await getSession();
  const isAuthenticated = !!token;

  return <LandingView isAuthenticated={isAuthenticated} />;
}
