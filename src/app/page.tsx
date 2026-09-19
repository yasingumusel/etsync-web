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
import { getSessionSummary } from "@/lib/backend";

export default async function Home() {
  const session = await getSessionSummary();

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
