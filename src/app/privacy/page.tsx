import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — MirrorStock",
  description:
    "How MirrorStock collects, uses, and protects data from your connected Etsy, Wix, and Shopify accounts.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <LegalLayout title="Privacy Policy" updated="September 26, 2026">
          <p>
            This Privacy Policy explains how MirrorStock
            (&ldquo;MirrorStock&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
            collects, uses, and protects information when you use the
            MirrorStock website and product synchronization service (the
            &ldquo;Service&rdquo;), including data accessed through the Etsy
            Open API, the Wix REST API, and the Shopify Admin API.
          </p>

          <h2>1. Who We Are</h2>
          <p>
            MirrorStock is an independent software product that reads the
            active listings in your Etsy shop and keeps the matching
            products in your connected store in sync. We are the developer
            of record for the MirrorStock Etsy API application and the
            MirrorStock Wix and Shopify applications. We do not create or distribute API
            credentials on behalf of any other person, company, or app.
          </p>
          <p>
            In respect of any information relating to Etsy members that we
            access through the Etsy API, we act as a service provider to
            you, the seller. We process that information only to provide the
            synchronization described in these policies and in our{" "}
            <a href="/terms">Terms of Service</a>, and for no other purpose.
          </p>

          <h2>2. Data Accessed via the Etsy API</h2>
          <p>
            When you connect your Etsy shop to MirrorStock through
            Etsy&rsquo;s official OAuth 2.0 authorization flow, MirrorStock
            requests three scopes:
          </p>
          <ul>
            <li><code>listings_r</code> &mdash; read-only, to read your shop&rsquo;s active listings (and draft listings, if you choose to include them), including titles, descriptions, SKUs, variations, prices, images, and inventory quantities. MirrorStock also notes which of your listings Etsy has made inactive, only so it never uploads a matching product back to Etsy</li>
            <li><code>shops_r</code> &mdash; read-only, to read basic shop profile information (shop name, shop ID) and your shop&rsquo;s reviews (star rating, review text and date). Etsy does not include the buyer&rsquo;s name, photo or email in reviews, and MirrorStock does not store the buyer&rsquo;s Etsy user ID</li>
            <li><code>listings_w</code> &mdash; write, used only for two things you switch on yourself: (1) if you switch off syncing a listing&rsquo;s title or description in your dashboard (telling MirrorStock you now edit that field in your Wix or Shopify store instead), MirrorStock writes your current store value back to the matching Etsy listing; (2) if you fill in your defaults for new Etsy listings, products you created in your Wix or Shopify store are published to your Etsy shop as <em>draft</em> listings (title, description, price, quantity, variations and product images, using the category, shipping and processing profiles you chose) for you to review and activate yourself. This scope is never used to activate or delete a listing, or to change the price, inventory, images, shipping, or any other setting of a listing you created on Etsy.</li>
          </ul>
          <p>
            MirrorStock does not request, and cannot access, your Etsy
            receipts, transactions, sales history, buyer information,
            financial data, or shop management functions. Outside of the
            two opt-in writes described above, MirrorStock never edits,
            creates, deletes, or uploads anything on your Etsy shop, and never sends email or messages through
            Etsy on your behalf. We never see your Etsy account password
            &mdash; authentication is handled entirely by Etsy&rsquo;s own
            login and consent screen.
          </p>

          <h2>3. Data Accessed via the Wix and Shopify APIs</h2>
          <p>
            When you connect your Wix store, MirrorStock accesses your
            product catalogue through Wix&rsquo;s official API, and creates
            or updates products there so they reflect what was read from
            your Etsy shop. This includes product titles, descriptions,
            prices, images, and product options such as size and colour.
          </p>
          <p>
            When you connect your Shopify store, MirrorStock does the same
            through Shopify&rsquo;s official Admin API, using Shopify&rsquo;s
            OAuth authorization flow and requesting three scopes:
          </p>
          <ul>
            <li><code>read_products</code> &mdash; to find the products MirrorStock has already created and, if you opt in, read a product&rsquo;s title and description so an edit can be written back to Etsy</li>
            <li><code>write_products</code> &mdash; to create and update products, variants, and prices that reflect your Etsy listings</li>
            <li><code>write_files</code> &mdash; to attach your listing images to those products</li>
            <li><code>write_publications</code> &mdash; to make those products visible in your Online Store sales channel, so shoppers can see and buy them</li>
          </ul>
          <p>
            MirrorStock does not request access to your Shopify orders,
            customers, payments, or any other store data. We never see your
            Shopify password &mdash; authentication is handled entirely by
            Shopify.
          </p>

          <h2>4. How Data Is Used</h2>
          <p>The data described above is used only to:</p>
          <ul>
            <li>Read the products and variations in your active Etsy listings</li>
            <li>Create or update the matching products in your connected store</li>
            <li>Convert prices when your two stores use different currencies</li>
            <li>Hide a product in your store once its Etsy listing is no longer active</li>
            <li>If you choose to, show your Etsy reviews on the matching product pages of your store, with a link back to the listing on Etsy</li>
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
            when you ask for it. Your shop&rsquo;s reviews are refreshed on
            the same schedule, and if they could not be refreshed for 24
            hours (for example because the Etsy connection was removed),
            MirrorStock stops showing them until they are up to date again.
          </p>

          <h2>6. What MirrorStock Does Not Do</h2>
          <ul>
            <li>Does not sell, license, rent, or otherwise transfer your Etsy, Wix, or Shopify shop data to any third party.</li>
            <li>Does not read Etsy sales, order, receipt, or transaction data.</li>
            <li>Does not write anything to your Etsy shop except the two opt-in writes described in section 2, never deletes or activates Etsy listings, and never sends email or messages through Etsy.</li>
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
            You can disconnect your Etsy, Wix, or Shopify shop from MirrorStock
            at any time, either by contacting us or from that platform&rsquo;s
            own connected-apps settings. Once disconnected,
            MirrorStock stops accessing your shop data going forward.
            Products already created in your own store remain yours and are
            not removed.
          </p>

          <h2>9. Security</h2>
          <p>
            Access tokens are stored encrypted at rest. All data in transit
            between MirrorStock, Etsy, Wix, and Shopify is encrypted using TLS.
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
