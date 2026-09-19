import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SetupSyncWizard from "@/components/SetupSyncWizard";
import { getSessionSummary } from "@/lib/backend";

export default async function SetupSyncPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const { userId } = await searchParams;
  const session = await getSessionSummary();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar session={session} />
      <main className="flex flex-1 justify-center bg-grid px-6 py-12">
        <Suspense>
          <SetupSyncWizard userId={userId} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
