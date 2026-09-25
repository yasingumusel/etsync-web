/**
 * MirrorStock Etsy Reviews widget - a self-hosted Wix Custom Element.
 *
 * Registered as a Site Widget extension in the Wix Dev Center, pointing at
 * this file's public URL (https://www.mirrorstock.com/mirrorstock-reviews-widget.js).
 * A merchant drags it onto a Wix product page in the editor and configures
 * two attributes there: `instance-id` (their Wix site's app instance id -
 * MirrorStock already has it once they've connected, this widget just
 * needs it repeated here since a Custom Element has no other way to reach
 * our backend) and `sku` (the Wix product's SKU on that page, so the same
 * widget instance shows only that product's reviews - see
 * routes/public/reviews.js on the backend for why this works without any
 * additional auth: Etsy reviews carry no buyer name, photo, or email, so
 * there is nothing private being exposed here).
 *
 * Deliberately framework-free (no React/build step) so it stays a single
 * small file a Custom Element can load directly.
 */
(function () {
  const API_BASE = "https://api.mirrorstock.com/public/reviews";

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

    disconnectedCallback() {
      this._closeModal();
    }

    // Only a couple of reviews sit next to the product (so "Add to cart"
    // isn't pushed far down the page); the rest open in a popup via "More".
    _fetchReviews(url) {
      const preview = Number(this.getAttribute("max")) || 2;
      fetch(url)
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((data) => {
          const reviews = data.reviews || [];
          this._allReviews = reviews;
          this._setBody(this._reviewsHtml(reviews.slice(0, preview)));
          const more = this._root.getElementById("more");
          if (more) {
            more.hidden = reviews.length <= preview;
            more.textContent = `More (${reviews.length})`;
          }
        })
        .catch(() => {
          this._setBody('<p class="ms-empty">Reviews are unavailable right now.</p>');
        });
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

    _openModal() {
      this._closeModal();
      const reviews = this._allReviews || [];
      const accent = this.getAttribute("accent-color") || "#7c4fe0";
      const title = this.getAttribute("title") || "Reviews from Etsy";

      // Appended to <body> rather than kept inside this element: Wix wraps
      // page elements in containers that can use CSS transforms, which would
      // pin a position:fixed popup to the container instead of the screen.
      const host = document.createElement("div");
      host.setAttribute("data-mirrorstock-reviews-modal", "");
      const shadow = host.attachShadow({ mode: "open" });
      shadow.innerHTML = `
        <style>
          .ms-backdrop {
            position: fixed; inset: 0; z-index: 2147483000;
            background: rgba(0,0,0,0.45);
            display: flex; align-items: center; justify-content: center;
            padding: 16px; font-family: inherit;
          }
          .ms-dialog {
            background: #fff; color: #1a1a1a; width: 100%; max-width: 560px;
            max-height: 85vh; border-radius: 16px; display: flex; flex-direction: column;
            box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          }
          .ms-head {
            display: flex; align-items: center; justify-content: space-between; gap: 12px;
            padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.08);
          }
          .ms-head h2 { margin: 0; font-size: 17px; font-weight: 700; }
          .ms-close {
            border: 0; background: transparent; font-size: 26px; line-height: 1;
            cursor: pointer; color: inherit; padding: 0 4px;
          }
          ul { list-style: none; margin: 0; padding: 16px 20px 20px; display: grid; gap: 14px; overflow-y: auto; }
          .ms-review { border: 1px solid rgba(0,0,0,0.1); border-radius: 12px; padding: 12px 14px; }
          .ms-stars { color: ${accent}; display: flex; gap: 2px; }
          .ms-text { margin: 8px 0 4px 0; font-size: 13px; line-height: 1.5; }
          .ms-date { margin: 0; font-size: 11px; opacity: 0.6; }
        </style>
        <div class="ms-backdrop" id="backdrop">
          <div class="ms-dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}">
            <div class="ms-head">
              <h2>${escapeHtml(title)} (${reviews.length})</h2>
              <button type="button" class="ms-close" id="close" aria-label="Close">&times;</button>
            </div>
            <ul>${this._reviewsHtml(reviews)}</ul>
          </div>
        </div>
      `;

      shadow.getElementById("close").addEventListener("click", () => this._closeModal());
      shadow.getElementById("backdrop").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) this._closeModal();
      });
      this._onKey = (e) => {
        if (e.key === "Escape") this._closeModal();
      };
      document.addEventListener("keydown", this._onKey);

      this._prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      document.body.appendChild(host);
      this._modal = host;
      shadow.getElementById("close").focus();
    }

    _closeModal() {
      if (!this._modal) return;
      this._modal.remove();
      this._modal = null;
      document.removeEventListener("keydown", this._onKey);
      document.body.style.overflow = this._prevOverflow || "";
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
          .ms-more-row { display: flex; justify-content: flex-end; margin-top: 8px; }
          .ms-more {
            border: 0; background: transparent; padding: 4px 0; cursor: pointer;
            font: inherit; font-size: 13px; font-weight: 600; color: ${accent};
          }
          .ms-more:hover { text-decoration: underline; }
          .ms-more[hidden] { display: none; }
        </style>
        <div class="ms-wrap">
          <p class="ms-title">${escapeHtml(title)}</p>
          <ul id="list"><li class="ms-empty">Loading reviews…</li></ul>
          <div class="ms-more-row"><button type="button" class="ms-more" id="more" hidden>More</button></div>
        </div>
      `;
      this._root.getElementById("more").addEventListener("click", () => this._openModal());
    }
  }

  /**
   * Site Widget variant - freely dragged anywhere, manually configured in
   * its settings panel with `instance-id` and the product's `sku`.
   */
  class MirrorStockReviews extends MirrorStockReviewsBase {
    static get observedAttributes() {
      return ["instance-id", "sku", "title", "max", "accent-color"];
    }

    _load() {
      const instanceId = this.getAttribute("instance-id");
      const sku = this.getAttribute("sku");
      if (!instanceId || !sku) {
        this._setBody('<p class="ms-empty">Missing instance-id or sku.</p>');
        return;
      }
      this._fetchReviews(`${API_BASE}/${encodeURIComponent(instanceId)}/${encodeURIComponent(sku)}`);
    }
  }

  /**
   * Site Plugin variant - placed once by Wix into a slot on the Wix Stores
   * Product Page template; the host page automatically feeds it a fresh
   * `product-id` attribute for whichever product the shopper is currently
   * viewing (see https://dev.wix.com/docs - Wix Stores Product Page plugin
   * API, `productId` prop -> `product-id` attribute). `instance-id` is not
   * part of that host API, so it's still set once via this plugin's own
   * settings panel (reviews-plugin-settings.html) at add-time, the same way
   * the Site Widget's panel sets it - see that file for how it's resolved.
   */
  class MirrorStockReviewsPlugin extends MirrorStockReviewsBase {
    static get observedAttributes() {
      return ["instance-id", "product-id", "title", "max", "accent-color"];
    }

    _load() {
      const instanceId = this.getAttribute("instance-id");
      const productId = this.getAttribute("product-id");
      if (!instanceId || !productId) {
        this._setBody('<p class="ms-empty">Missing instance-id or product-id.</p>');
        return;
      }
      this._fetchReviews(`${API_BASE}/by-product/${encodeURIComponent(instanceId)}/${encodeURIComponent(productId)}`);
    }
  }

  if (!customElements.get("mirrorstock-reviews")) {
    customElements.define("mirrorstock-reviews", MirrorStockReviews);
  }
  if (!customElements.get("mirrorstock-reviews-plugin")) {
    customElements.define("mirrorstock-reviews-plugin", MirrorStockReviewsPlugin);
  }
})();
