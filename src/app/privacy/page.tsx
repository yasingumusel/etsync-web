import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — ETSYNC",
  description:
    "How ETSYNC collects, uses, and protects data from your connected Etsy and Wix accounts.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <LegalLayout title="Privacy Policy" updated="September 16, 2026">
          <p>
            This Privacy Policy explains how ETSYNC (&ldquo;ETSYNC&rdquo;,
            &ldquo;I&rdquo;, &ldquo;me&rdquo;) collects, uses, and protects
            information when you use the ETSYNC website and inventory
            synchronization service (the &ldquo;Service&rdquo;), including
            data accessed through the Etsy Open API and the Wix REST API.
            ETSYNC is a personal project built and operated by a single
            developer, not a company, and today it is used by exactly one
            person: me, for my own Etsy shop and my own Wix store.
          </p>

          <h2>1. Who I Am</h2>
          <p>
            ETSYNC is an independent, single-developer software product
            that reads my own active Etsy listings and keeps the matching
            products in my own Wix store in sync. I am the developer of
            record for the ETSYNC Etsy API application and the ETSYNC Wix
            API application; I do not create or distribute API credentials
            on behalf of any other person, company, or app, and no other
            seller&rsquo;s shop is connected to ETSYNC.
          </p>

          <h2>2. Data Accessed via the Etsy API (Read-Only)</h2>
          <p>
            When you connect your Etsy shop to ETSYNC through Etsy&rsquo;s
            official OAuth 2.0 authorization flow, ETSYNC requests exactly
            two read-only scopes:
          </p>
          <ul>
            <li><code>listings_r</code> &mdash; to read your shop&rsquo;s active listings, including titles, SKUs, variations, and inventory quantities</li>
            <li><code>shops_r</code> &mdash; to read basic shop profile information (shop name, shop ID)</li>
          </ul>
          <p>
            ETSYNC does not request, and cannot access, your Etsy receipts,
            transactions, sales history, buyer information, financial data,
            or shop management functions. ETSYNC never writes to, edits,
            creates, or uploads anything on your Etsy shop, and never sends
            email or messages through Etsy on your behalf. I never access
            your Etsy account password &mdash; authentication is handled
            entirely by Etsy&rsquo;s own login and consent screen.
          </p>

          <h2>3. Data Accessed via the Wix API</h2>
          <p>
            When you connect your Wix store, ETSYNC accesses product
            catalog and inventory data through Wix&rsquo;s official API and
            OAuth flow, and writes inventory quantity updates to your Wix
            store so it reflects what was read from Etsy.
          </p>

          <h2>4. How Data Is Used</h2>
          <p>The data described above is used only to:</p>
          <ul>
            <li>Detect inventory quantity changes on your active Etsy listings</li>
            <li>Update the matching product&rsquo;s stock quantity on your connected Wix store</li>
            <li>Alert you to sync failures or low-stock conditions</li>
            <li>Maintain the security and reliability of the Service</li>
          </ul>

          <h2>5. What ETSYNC Does Not Do</h2>
          <ul>
            <li>Does not sell, license, rent, or otherwise transfer your Etsy or Wix shop data to any third party.</li>
            <li>Does not read Etsy sales, order, receipt, or transaction data.</li>
            <li>Does not write, edit, or upload anything to your Etsy shop, or send email/messages through Etsy.</li>
            <li>Does not use your shop data for advertising or any purpose other than operating the Service for your account.</li>
            <li>Does not provide your API credentials, access tokens, or shop data to any other application, company, or third party.</li>
          </ul>

          <h2>6. Data Retention</h2>
          <p>
            Synced listing and inventory data is retained only for as long
            as your account is active and your shops remain connected, so
            the sync can function and its history stays accurate. If you
            disconnect a shop or ask me to close your account, associated
            data is deleted or anonymized within a reasonable period.
          </p>

          <h2>7. Revoking Access</h2>
          <p>
            You can disconnect your Etsy or Wix shop from ETSYNC at any
            time, either by asking me directly or from your Etsy or
            Wix account&rsquo;s own connected-apps settings. Once
            disconnected, ETSYNC stops accessing your shop data going
            forward.
          </p>

          <h2>8. Security</h2>
          <p>
            Access tokens are stored encrypted at rest. All data in transit
            between ETSYNC, Etsy, and Wix is encrypted using TLS. As a
            single-developer, single-user project, only I have access to
            this data, and only as needed to operate the Service for my own
            shop.
          </p>

          <h2>9. Current Status</h2>
          <p>
            ETSYNC is not offered to other sellers today. There is no
            sign-up flow, invite system, or account creation for anyone
            other than me, and no other seller&rsquo;s Etsy or Wix account
            is connected. If that ever changes, this Privacy Policy will be
            updated before any other shop is connected.
          </p>

          <h2>10. Your Rights</h2>
          <p>
            Depending on your location, you may have the right to access,
            correct, export, or delete the personal data held about you. To
            exercise these rights, contact me using the details below.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            This Privacy Policy may be updated from time to time. Material
            changes will be reflected by updating the date at the top of
            this page.
          </p>

          <h2>12. Contact</h2>
          <p>
            Questions about this Privacy Policy or how ETSYNC handles your
            data can be sent to{" "}
            <a href="mailto:yasin.gumusel@gmail.com">
              yasin.gumusel@gmail.com
            </a>
            .
          </p>
        </LegalLayout>
      </main>
      <Footer />
    </div>
  );
}
