import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SyncPreviewMockup from "@/components/SyncPreviewMockup";
import { getSessionSummary } from "@/lib/backend";

function ConnectEtsyCard({ userId }: { userId?: string }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const connectHref = userId && backendUrl ? `${backendUrl}/auth/etsy/connect?userId=${encodeURIComponent(userId)}` : null;

  return (
    <div className="mx-auto w-full max-w-sm pt-16">
      <div className="card-glass rounded-2xl p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent-orange/15 via-accent-pink/15 to-accent-violet/15">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M13 2L4.5 13.5H11L9 22L19.5 9.5H13L15 2Z"
              stroke="url(#lightning)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="lightning" x1="4" y1="2" x2="20" y2="22">
                <stop stopColor="var(--accent-orange)" />
                <stop offset="0.5" stopColor="var(--accent-pink)" />
                <stop offset="1" stopColor="var(--accent-violet)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="mt-5 font-display text-xl font-bold text-foreground">
          Let&apos;s connect your Etsy shop
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Connect your Etsy shop to start syncing your listings to this
          Wix store. Make sure you&apos;re logged into the correct Etsy
          account before continuing.
        </p>

        {connectHref ? (
          <a
            href={connectHref}
            target="_blank"
            rel="noopener"
            className="mt-6 block w-full rounded-full bg-gradient-to-r from-accent-orange via-accent-pink to-accent-violet px-7 py-3 text-center text-sm font-semibold text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] transition-transform hover:scale-[1.02]"
          >
            Connect My Etsy Account
          </a>
        ) : (
          <p className="mt-6 text-sm font-medium text-red-500">
            Missing setup information. Please reinstall the app from the
            Wix App Market.
          </p>
        )}

        <p className="mt-5 text-xs text-muted">
          Opens in a new tab &mdash; Etsy doesn&apos;t allow signing in
          inside an embedded window.
        </p>
      </div>
    </div>
  );
}

export default async function ConnectEtsyPage({
  searchParams,
}: {
  searchParams: Promise<{ userId?: string }>;
}) {
  const { userId } = await searchParams;
  const session = await getSessionSummary();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar session={session} />
      <main className="flex flex-1 flex-col items-center justify-center bg-grid px-6 pb-20">
        <Suspense>
          <ConnectEtsyCard userId={userId} />
        </Suspense>
        {/* Fills what would otherwise be empty space below the card, and
            doubles as a preview of what the merchant is about to set up -
            onboarding is still a marketing moment. */}
        <SyncPreviewMockup />
      </main>
      <Footer />
    </div>
  );
}
