import { Suspense } from "react";
import SetupSyncWizard from "@/components/SetupSyncWizard";

export default async function SetupSyncPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const { userId } = await searchParams;
  return (
    <Suspense>
      <SetupSyncWizard userId={userId} />
    </Suspense>
  );
}
