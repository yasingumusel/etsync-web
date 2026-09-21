/**
 * MirrorStock Etsy Reviews widget - a self-hosted Wix Custom Element.
 *
 * Registered as a Site Widget extension (freely placed, needs a `sku`
 * attribute) and a Site Plugin extension (auto-placed into the Wix Stores
 * Product Page, fed a `product-id` attribute automatically by Wix) in the
 * Wix Dev Center, both pointing at this file's public URL
 * (https://www.mirrorstock.com/mirrorstock-reviews-widget.js).
 *
 * Neither variant needs a merchant (or a settings-panel script) to ever
 * enter or resolve their site's app instance id. Instead, `@wix/site`'s
 * site.auth() automatically attaches a signed Wix access token to every
 * fetchWithAuth() call made from a self-hosted widget running on a live
 * Wix site - the backend verifies that token and reads the instance id
 * straight out of it (see requireWixSiteToken() in
 * routes/public/reviews.js). This is Wix's own documented pattern for
 * exactly this case - see
 * https://dev.wix.com/docs/build-apps/.../identify-the-app-instance-in-a-self-hosted-site-widget -
 * and it's what makes the Site Plugin variant fully hands-free: it's
 * auto-added to every product page on install with nothing left for a
 * merchant to configure.
 *
 * Etsy reviews carry no buyer name, photo, or email (Etsy fully anonymises
 * the buyer), so there is nothing private ever exposed through these calls.
 *
 * Deliberately framework-free (no React/build step) so it stays a single
 * small file a Custom Element can load directly.
 */
(function () {
  const API_BASE = "https://api.mirrorstock.com/public/reviews";
  // Public Wix App ID - the same one already used in the app's install URL
  // (routes/auth/wix.js), not a secret.
  const WIX_APP_ID = "27c1d8a2-d9f2-46c6-8009-d5bb09ea2bee";

  let wixClient = null;
  async function getWixClient() {
    if (wixClient) return wixClient;
    const [{ site }, { createClient }] = await Promise.all([
      import("https://cdn.jsdelivr.net/npm/@wix/site/+esm"),
      import("https://cdn.jsdelivr.net/npm/@wix/sdk/+esm"),
    ]);
    wixClient = createClient({
      auth: site.auth(),
      host: site.host({ applicationId: WIX_APP_ID }),
    });
    return wixClient;
  }

  const STAR_FILLED =
    '<path d="M8 1.2l2.02 4.1 4.53.66-3.28 3.2.77 4.5L8 11.5l-4.04 2.16.77-4.5-3.28-3.2 4.53-.66L8 1.2z" fill="currentColor"/>';

  function escapeHtml(text) {
    return String(text == null ? "" : text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function formatDate(iso) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short" });
    } catch {
      return "";
    }
  }

  function starsHtml(rating) {
    const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    let html = "";
    for (let i = 0; i < 5; i += 1) {
      html += `<svg width="14" height="14" viewBox="0 0 16 16" style="opacity:${i < n ? 1 : 0.25}">${STAR_FILLED}</svg>`;
    }
    return html;
  }

  /**
   * Shared rendering (shadow DOM, star markup, review list) for both
   * variants below - they only differ in which attributes they read and
   * which backend endpoint they call.
   */
  class MirrorStockReviewsBase extends HTMLElement {
    constructor() {
      super();
      // Kicks off site-auth setup immediately (not just on connect) so it's
      // usually already resolved by the time _fetchReviews needs it.
      this._clientReady = getWixClient().then((client) => {
        this._wixClient = client;
        // Must be called (even though its own return value is unused) to
        // register the injector that makes fetchWithAuth() below actually
        // attach a Wix access token to outgoing requests.
        client.auth.getAccessTokenInjector();
      });
    }

    connectedCallback() {
      if (!this._root) {
        this._root = this.attachShadow({ mode: "open" });
      }
      this._render();
      this._load();
    }

    attributeChangedCallback() {
      if (this._root) {
        this._render();
        this._load();
      }
    }

    async _fetchReviews(url) {
      const max = Number(this.getAttribute("max")) || 5;
      try {
        await this._clientReady;
        const res = await this._wixClient.fetchWithAuth(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const reviews = (data.reviews || []).slice(0, max);
        this.style.display = "";
        this._setBody(this._reviewsHtml(reviews));
      } catch {
        // Covers both "this site's plan doesn't include the reviews
        // feature" (backend returns 403) and any other failure. Either
        // way, a real shopper sees nothing rather than an error box - a
        // Free/Starter/Growth site ends up with an invisible plugin
        // instead of a broken-looking one, since Wix has no way for us to
        // stop the plugin from being placed on those sites in the first
        // place (see routes/public/reviews.js).
        this.style.display = "none";
      }
    }

    _reviewsHtml(reviews) {
      if (!reviews.length) {
        return '<p class="ms-empty">No reviews yet for this item.</p>';
      }
      return reviews
        .map(
          (r) => `
        <li class="ms-review">
          <div class="ms-stars">${starsHtml(r.rating)}</div>
          ${r.review ? `<p class="ms-text">${escapeHtml(r.review)}</p>` : ""}
          ${r.createdAt ? `<p class="ms-date">${escapeHtml(formatDate(r.createdAt))}</p>` : ""}
        </li>`
        )
        .join("");
    }

    _setBody(innerHtml) {
      const list = this._root.getElementById("list");
      if (list) list.innerHTML = innerHtml;
    }

    _render() {
      const accent = this.getAttribute("accent-color") || "#7c4fe0";
      const title = this.getAttribute("title") || "Reviews from Etsy";

      this._root.innerHTML = `
        <style>
          :host { display: block; font-family: inherit; }
          .ms-wrap { max-width: 100%; }
          .ms-title {
            font-size: 16px; font-weight: 700; margin: 0 0 12px 0;
            color: inherit;
          }
          ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
          .ms-review {
            border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 12px 14px;
          }
          .ms-stars { color: ${accent}; display: flex; gap: 2px; }
          .ms-text { margin: 8px 0 4px 0; font-size: 13px; line-height: 1.5; color: inherit; }
          .ms-date { margin: 0; font-size: 11px; opacity: 0.6; }
          .ms-empty { font-size: 13px; opacity: 0.7; margin: 0; }
        </style>
        <div class="ms-wrap">
          <p class="ms-title">${escapeHtml(title)}</p>
          <ul id="list"><li class="ms-empty">Loading reviews…</li></ul>
        </div>
      `;
    }
  }

  /**
   * Site Widget variant - freely dragged onto any page. The only thing left
   * to configure is which product it's for (`sku`) - its own site's
   * identity no longer needs configuring at all, see the class comment
   * above.
   */
  class MirrorStockReviews extends MirrorStockReviewsBase {
    static get observedAttributes() {
      return ["sku", "title", "max", "accent-color"];
    }

    _load() {
      const sku = this.getAttribute("sku");
      if (!sku) {
        this._setBody('<p class="ms-empty">Missing sku.</p>');
        return;
      }
      this._fetchReviews(`${API_BASE}/site/by-sku/${encodeURIComponent(sku)}`);
    }
  }

  /**
   * Site Plugin variant - placed automatically by Wix into a slot on the
   * Wix Stores Product Page template on every install, with zero manual
   * setup: the host page feeds it a fresh `product-id` attribute for
   * whichever product the shopper is currently viewing (see
   * https://dev.wix.com/docs - Wix Stores Product Page plugin API,
   * `productId` prop -> `product-id` attribute), and its own site identity
   * comes from the access token site.auth() attaches automatically (see the
   * class comment above) - nothing left for a merchant to open a settings
   * panel for.
   */
  class MirrorStockReviewsPlugin extends MirrorStockReviewsBase {
    static get observedAttributes() {
      return ["product-id", "title", "max", "accent-color"];
    }

    _load() {
      const productId = this.getAttribute("product-id");
      if (!productId) {
        this._setBody('<p class="ms-empty">Missing product-id.</p>');
        return;
      }
      this._fetchReviews(`${API_BASE}/site/by-product/${encodeURIComponent(productId)}`);
    }
  }

  if (!customElements.get("mirrorstock-reviews")) {
    customElements.define("mirrorstock-reviews", MirrorStockReviews);
  }
  if (!customElements.get("mirrorstock-reviews-plugin")) {
    customElements.define("mirrorstock-reviews-plugin", MirrorStockReviewsPlugin);
  }
})();
