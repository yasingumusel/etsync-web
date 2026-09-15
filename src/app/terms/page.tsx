import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service — ETSYNC",
  description: "The terms that govern your use of the ETSYNC service.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <LegalLayout title="Terms of Service" updated="September 16, 2026">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) govern access to
            and use of ETSYNC&rsquo;s website and inventory synchronization
            service (the &ldquo;Service&rdquo;). ETSYNC is a personal,
            single-developer project. It is not a company, it is not open
            to the general public, and today it is used by exactly one
            person: its developer, for their own Etsy shop and Wix store.
          </p>

          <h2>1. The Service</h2>
          <p>
            ETSYNC reads its developer&rsquo;s own active Etsy listings
            (read-only, using the <code>listings_r</code> and{" "}
            <code>shops_r</code> scopes) and updates the matching
            product&rsquo;s inventory on their own connected Wix store. The
            Service does not write, edit, or upload anything back to Etsy,
            does not read Etsy sales or order data, and does not send email
            or messages through Etsy.
          </p>

          <h2>2. Eligibility &amp; Account Ownership</h2>
          <p>
            Only the developer of ETSYNC connects an Etsy shop or Wix store
            to it, and only their own shop and store. ETSYNC does not
            accept API credentials or access on behalf of any other
            person&rsquo;s shop, and is not to be used to provide access to
            a third-party application.
          </p>

          <h2>3. Connecting Accounts</h2>
          <p>
            Connecting an Etsy or Wix account authorizes ETSYNC, through
            each platform&rsquo;s official OAuth process, to access the
            specific data described in the{" "}
            <a href="/privacy">Privacy Policy</a>. This remains subject to
            Etsy&rsquo;s and Wix&rsquo;s own terms of service, and
            ETSYNC&rsquo;s access is limited to the <code>listings_r</code>{" "}
            and <code>shops_r</code> scopes on Etsy&rsquo;s side.
          </p>

          <h2>4. Acceptable Use</h2>
          <p>ETSYNC is not to be used to:</p>
          <ul>
            <li>Access, resell, or redistribute Etsy or Wix API data to a third party</li>
            <li>Act on behalf of a shop its developer does not own or manage</li>
            <li>Circumvent rate limits, security controls, or the intended read-only scope of Etsy API access</li>
            <li>Serve any unlawful purpose or violate Etsy&rsquo;s or Wix&rsquo;s own terms of use</li>
          </ul>

          <h2>5. Current Status &amp; Availability</h2>
          <p>
            ETSYNC is provided free, for personal use, and is not offered
            to other sellers today. There is no sign-up flow, invite
            system, or account creation for anyone other than its
            developer. Features and availability may change at any time as
            the project is developed further.
          </p>

          <h2>6. Data Ownership</h2>
          <p>
            Shop, listing, and inventory data remains the developer&rsquo;s
            own, and is accessed and processed only as necessary to provide
            the Service, as described in the{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>

          <h2>7. Service Availability</h2>
          <p>
            I aim to keep the Service syncing reliably, but sync timing and
            availability may depend on the uptime and rate limits of the
            Etsy and Wix APIs themselves, which are outside my control.
          </p>

          <h2>8. Termination</h2>
          <p>
            The Service can be stopped and shops disconnected at any time.
            I may suspend or remove access that violates these Terms,
            misuses API access, or poses a security risk to the Service,
            Etsy, or Wix.
          </p>

          <h2>9. Disclaimer &amp; Limitation of Liability</h2>
          <p>
            The Service is provided &ldquo;as is,&rdquo; as a personal
            project, without warranties of any kind. To the maximum extent
            permitted by law, I will not be liable for indirect,
            incidental, or consequential damages arising from its use.
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
