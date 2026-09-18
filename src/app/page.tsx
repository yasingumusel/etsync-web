import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogosStrip from "@/components/LogosStrip";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import ApiTrust from "@/components/ApiTrust";
import Pricing from "@/components/Pricing";
import Stats from "@/components/Stats";
import Status from "@/components/Status";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import { getSessionUserId, callSyncBackend } from "@/lib/backend";

type Plan = "free" | "starter" | "growth" | "pro" | "unlimited";

/**
 * Looks up the logged-in visitor's account, if any, so the navbar can show
 * the same bell/avatar as the dashboard instead of "Log In" to someone who
 * already is, and the hero mockup can show their real synced count instead
 * of the static demo numbers. A visitor without a session cookie never
 * triggers the backend call below - this stays free for anonymous traffic.
 */
async function getHomeSession() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const { ok, body } = await callSyncBackend(userId, "status");
  if (!ok) return null;

  const syncedProducts = (
    body.targetStores as { syncedProductCount: number }[]
  ).reduce((sum, s) => sum + (s.syncedProductCount || 0), 0);

  return {
    email: body.email as string | undefined,
    plan: body.plan as Plan | undefined,
    syncedProducts,
  };
}

export default async function Home() {
  const session = await getHomeSession();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar session={session} />
      <main className="flex-1">
        <Hero syncedProducts={session?.syncedProducts} />
        <LogosStrip />
        <Features />
        <HowItWorks />
        <ApiTrust />
        <Pricing />
        <Stats />
        <Status />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
