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

  class MirrorStockReviews extends HTMLElement {
    static get observedAttributes() {
      return ["instance-id", "sku", "title", "max", "accent-color"];
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

    _load() {
      const instanceId = this.getAttribute("instance-id");
      const sku = this.getAttribute("sku");
      if (!instanceId || !sku) {
        this._setBody('<p class="ms-empty">Missing instance-id or sku.</p>');
        return;
      }

      const max = Number(this.getAttribute("max")) || 5;
      const url = `${API_BASE}/${encodeURIComponent(instanceId)}/${encodeURIComponent(sku)}`;

      fetch(url)
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((data) => {
          const reviews = (data.reviews || []).slice(0, max);
          this._setBody(this._reviewsHtml(reviews));
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

  if (!customElements.get("mirrorstock-reviews")) {
    customElements.define("mirrorstock-reviews", MirrorStockReviews);
  }
})();
