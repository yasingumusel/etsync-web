import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service — MirrorStock",
  description: "The terms that govern your use of the MirrorStock service.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <LegalLayout title="Terms of Service" updated="September 24, 2026">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern access to
            and use of MirrorStock&rsquo;s website and product
            synchronization service (the &ldquo;Service&rdquo;). By creating
            an account or connecting a shop, you agree to them.
          </p>

          <h2>1. The Service</h2>
          <p>
            MirrorStock reads the active listings in your Etsy shop (using
            the <code>listings_r</code> and <code>shops_r</code> scopes) and
            creates or updates the matching products in your connected Wix or
            Shopify store. If you switch off syncing a listing&rsquo;s title or
            description in your dashboard, MirrorStock instead writes your
            current store value back to the matching Etsy listing (using the{" "}
            <code>listings_w</code> scope). If you fill in your defaults for
            new Etsy listings, the Service also publishes products you
            created in your Wix or Shopify store to Etsy as draft listings,
            which it never activates for you. These two opt-in writes are
            the only ways the Service writes to Etsy. It does not otherwise
            create, edit, delete, or upload anything on Etsy, does
            not read Etsy sales, order, or payment data, and does not send
            email or messages through Etsy.
          </p>

          <h2>2. Eligibility &amp; Account Ownership</h2>
          <p>
            You may only connect shops and stores that you own or are
            authorized to manage. MirrorStock does not accept API
            credentials or access on behalf of another person&rsquo;s shop,
            and is not to be used to provide access to a third-party
            application.
          </p>

          <h2>3. Connecting Accounts</h2>
          <p>
            Connecting an Etsy, Wix, or Shopify account authorizes MirrorStock,
            through each platform&rsquo;s official OAuth process, to access
            the specific data described in the{" "}
            <a href="/privacy">Privacy Policy</a>. This remains subject to
            the terms of service of Etsy, Wix, and Shopify, and
            MirrorStock&rsquo;s access is limited to the{" "}
            <code>listings_r</code> and <code>shops_r</code> scopes on
            Etsy&rsquo;s side (plus <code>listings_w</code> for the two opt-in
            writes described above).
          </p>

          <h2>4. Acceptable Use</h2>
          <p>MirrorStock is not to be used to:</p>
          <ul>
            <li>Access, resell, or redistribute Etsy, Wix, or Shopify API data to a third party</li>
            <li>Act on behalf of a shop you do not own or manage</li>
            <li>Circumvent rate limits, security controls, or the intended scope of Etsy, Wix, or Shopify API access</li>
            <li>Serve any unlawful purpose or violate the terms of use of Etsy, Wix, or Shopify</li>
          </ul>

          <h2>5. Availability &amp; Changes</h2>
          <p>
            MirrorStock is in early access. Features, limits, and pricing
            may change as the product develops, and we will give reasonable
            notice of material changes that affect you.
          </p>

          <h2>6. Data Ownership</h2>
          <p>
            Your shop, listing, and product data remains yours. It is
            accessed and processed only as necessary to provide the Service,
            as described in the <a href="/privacy">Privacy Policy</a>.
            Products created in your own store belong to you and remain
            there if you stop using the Service.
          </p>

          <h2>7. Service Availability</h2>
          <p>
            We aim to keep the Service syncing reliably, but sync timing and
            availability may depend on the uptime and rate limits of the
            Etsy, Wix, and Shopify APIs themselves, which are outside our control.
          </p>

          <h2>8. Termination</h2>
          <p>
            You can stop using the Service and disconnect your shops at any
            time. We may suspend or remove access that violates these Terms,
            misuses API access, or poses a security risk to the Service,
            Etsy, Wix, or Shopify.
          </p>

          <h2>9. Disclaimer &amp; Limitation of Liability</h2>
          <p>
            DISCLAIMER: THIS APPLICATION IS SOLELY PROVIDED BY MIRRORSTOCK
            (THE &ldquo;APPLICATION DEVELOPER&rdquo;). YOU ACKNOWLEDGE THAT
            ETSY, INC. AND ITS AFFILIATES ARE NOT THE APPLICATION DEVELOPER,
            DO NOT PROVIDE THE APPLICATION SERVICE, AND MAKE NO WARRANTIES
            OF ANY KIND WITH RESPECT TO THE APPLICATION OR DATA ACCESSED
            THROUGH IT.
          </p>
          <p>
            The Service is provided &ldquo;as is,&rdquo; without warranties
            of any kind. To the maximum extent permitted by law, we will not
            be liable for indirect, incidental, or consequential damages
            arising from its use.
          </p>

          <h2>10. Changes to These Terms</h2>
          <p>
            These Terms may be updated from time to time. Continued use of
            the Service after changes take effect constitutes acceptance of
            the updated Terms.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about these Terms can be sent to{" "}
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
