import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — MirrorStock",
  description:
    "How MirrorStock collects, uses, and protects data from your connected Etsy and Wix accounts.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <LegalLayout title="Privacy Policy" updated="September 17, 2026">
          <p>
            This Privacy Policy explains how MirrorStock
            (&ldquo;MirrorStock&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
            collects, uses, and protects information when you use the
            MirrorStock website and product synchronization service (the
            &ldquo;Service&rdquo;), including data accessed through the Etsy
            Open API and the Wix REST API.
          </p>

          <h2>1. Who We Are</h2>
          <p>
            MirrorStock is an independent software product that reads the
            active listings in your Etsy shop and keeps the matching
            products in your connected store in sync. We are the developer
            of record for the MirrorStock Etsy API application and the
            MirrorStock Wix application. We do not create or distribute API
            credentials on behalf of any other person, company, or app.
          </p>
          <p>
            In respect of any information relating to Etsy members that we
            access through the Etsy API, we act as a service provider to
            you, the seller. We process that information only to provide the
            synchronization described in these policies and in our{" "}
            <a href="/terms">Terms of Service</a>, and for no other purpose.
          </p>

          <h2>2. Data Accessed via the Etsy API (Read-Only)</h2>
          <p>
            When you connect your Etsy shop to MirrorStock through
            Etsy&rsquo;s official OAuth 2.0 authorization flow, MirrorStock
            requests exactly two read-only scopes:
          </p>
          <ul>
            <li><code>listings_r</code> &mdash; to read your shop&rsquo;s active listings, including titles, descriptions, SKUs, variations, prices, images, and inventory quantities</li>
            <li><code>shops_r</code> &mdash; to read basic shop profile information (shop name, shop ID)</li>
          </ul>
          <p>
            MirrorStock does not request, and cannot access, your Etsy
            receipts, transactions, sales history, buyer information,
            financial data, or shop management functions. MirrorStock never
            writes to, edits, creates, deletes, or uploads anything on your
            Etsy shop, and never sends email or messages through Etsy on
            your behalf. We never see your Etsy account password &mdash;
            authentication is handled entirely by Etsy&rsquo;s own login and
            consent screen.
          </p>

          <h2>3. Data Accessed via the Wix API</h2>
          <p>
            When you connect your Wix store, MirrorStock accesses your
            product catalogue through Wix&rsquo;s official API, and creates
            or updates products there so they reflect what was read from
            your Etsy shop. This includes product titles, descriptions,
            prices, images, and product options such as size and colour.
          </p>

          <h2>4. How Data Is Used</h2>
          <p>The data described above is used only to:</p>
          <ul>
            <li>Read the products and variations in your active Etsy listings</li>
            <li>Create or update the matching products in your connected store</li>
            <li>Convert prices when your two stores use different currencies</li>
            <li>Hide a product in your store once its Etsy listing is no longer active</li>
            <li>Show you the progress, history and outcome of each sync</li>
            <li>Maintain the security and reliability of the Service</li>
          </ul>

          <h2>5. When Data Is Read</h2>
          <p>
            Once your shops are connected, MirrorStock re-reads your active
            listings automatically, roughly every four hours, and applies any
            changes it finds. You can also start a sync yourself at any time
            from your dashboard. Etsy&rsquo;s API Terms require that listing
            content displayed outside Etsy is never significantly staler than
            Etsy itself, which is why this runs on a schedule rather than only
            when you ask for it.
          </p>

          <h2>6. What MirrorStock Does Not Do</h2>
          <ul>
            <li>Does not sell, license, rent, or otherwise transfer your Etsy or Wix shop data to any third party.</li>
            <li>Does not read Etsy sales, order, receipt, or transaction data.</li>
            <li>Does not write, edit, delete, or upload anything to your Etsy shop, or send email or messages through Etsy.</li>
            <li>Does not use your shop data for advertising or any purpose other than operating the Service for your account.</li>
            <li>Does not provide your API credentials, access tokens, or shop data to any other application, company, or third party.</li>
          </ul>

          <h2>7. Data Retention</h2>
          <p>
            Listing and product data is retained only for as long as your
            account is active and your shops remain connected, so that a
            later sync can update the products it created earlier rather
            than duplicating them. If you disconnect a shop or ask us to
            close your account, the associated data is deleted or
            anonymized within a reasonable period.
          </p>

          <h2>8. Revoking Access</h2>
          <p>
            You can disconnect your Etsy or Wix shop from MirrorStock at any
            time, either by contacting us or from your Etsy or Wix
            account&rsquo;s own connected-apps settings. Once disconnected,
            MirrorStock stops accessing your shop data going forward.
            Products already created in your own store remain yours and are
            not removed.
          </p>

          <h2>9. Security</h2>
          <p>
            Access tokens are stored encrypted at rest. All data in transit
            between MirrorStock, Etsy, and Wix is encrypted using TLS.
            Access to production data is limited to the people who need it
            to operate the Service.
          </p>

          <h2>10. Your Rights</h2>
          <p>
            Depending on your location, you may have the right to access,
            correct, export, or delete the personal data held about you. To
            exercise these rights, contact us using the details below.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            This Privacy Policy may be updated from time to time. Material
            changes will be reflected by updating the date at the top of
            this page.
          </p>

          <h2>12. Contact</h2>
          <p>
            Questions about this Privacy Policy or how MirrorStock handles
            your data can be sent to{" "}
            <a href="mailto:support@mirrorstock.com">
              support@mirrorstock.com
            </a>
            .
          </p>
        </LegalLayout>
      </main>
      <Footer />
    </div>
  );
}
