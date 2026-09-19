import DashboardHeader from "@/components/DashboardHeader";
import SetupSyncWizard from "@/components/SetupSyncWizard";

export default function ManageProductsPage() {
  return (
    <div className="min-h-screen bg-grid">
      <DashboardHeader />
      <main className="flex justify-center px-6 py-12">
        <SetupSyncWizard variant="manage" />
      </main>
    </div>
  );
}
