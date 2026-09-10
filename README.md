# florvae-pages

Static, self-contained landing pages for all Florvae brands, served from **one domain**
(`florvae.com`) on Cloudflare Pages. No Shopify/Replo runtime dependencies — every page is
plain HTML/CSS/vanilla-JS with locally hosted, optimized WebP images, so it loads fast and
Pinterest only ever sees one verified domain.

First brand live: **Everlove** (mascara), ported 1:1 from the source Shopify/Replo pages.

## Structure

```
/                         root served by Cloudflare Pages
  index.html              simple multi-brand hub
  404.html
  /everlove/
     index.html           PHASE 1 — advertorial ("10 Reasons…")
     buy/index.html       PHASE 2 — sales page
  /assets/everlove/       optimized WebP images for the brand
  /_shared/
     base.css             reset + design tokens + shared components
     countdown.js          evergreen countdown (localStorage, per visitor)
     slider.js             testimonial / content carousel (arrows + swipe)
     gallery.js            product image gallery (thumbs + swipe)
```

All internal links are **root-relative** (`/everlove/buy/`, `/assets/…`, `/_shared/…`) so they
behave identically locally (served from the repo root) and on Cloudflare.

## Adding a new brand

1. `cp -r everlove <new-slug>` and edit the copy/images.
2. `mkdir assets/<new-slug>` and drop that brand's optimized WebP images in.
3. Add a link on the root `index.html` hub.
4. Reuse everything in `/_shared/`.

## ⚠️ Before going live — placeholders to fill

- **Checkout URL** (sales page): open `everlove/buy/index.html`, find the
  `CHECKOUT_URL PLACEHOLDER` block near the top and replace:
  ```js
  window.CHECKOUT_URL = "REPLACE_WITH_CHECKOUT_URL";
  ```
  with your real Shopify cart permalink / checkout link, e.g.
  `https://facelove-cosmetics.com/cart/VARIANT_ID:1`. Every "Add to Cart" button uses it.
  (Optional) fill both IDs in `window.CHECKOUT_VARIANTS` to make the colour swatch change the
  checkout variant.
- **Pinterest domain verification**: paste your meta tag where each page's `<head>` has
  `<!-- PINTEREST_VERIFICATION -->`.
- **Analytics / pixels** (Pinterest / Meta / GA4): paste your snippet where each page has
  `<!-- ANALYTICS -->` just before `</body>`.

`<title>`, `meta description` and Open Graph tags are already filled from the source pages.

## Local preview

```bash
python3 -m http.server 8799
# then open http://localhost:8799/everlove/
```

## Deploy — Cloudflare Pages

**Option A — Git integration (recommended):**
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick this repo (`florvae-pages`).
3. Build settings: **Framework preset = None**, **Build command = (empty)**,
   **Build output directory = `/`**.
4. Save & Deploy. You get a `*.pages.dev` URL immediately.
5. **Custom domains → Set up a domain → `florvae.com`** (DNS managed in Cloudflare).

**Option B — CLI:**
```bash
npx wrangler pages deploy . --project-name=florvae-pages
```

Live URLs once the domain is attached:
- Advertorial → `https://florvae.com/everlove/`
- Sales page → `https://florvae.com/everlove/buy/`

## Notes

- Images were downscaled + re-encoded to WebP (source PNGs were 2–3 MB each). The reason-8
  animation was converted from a 13 MB GIF to a ~1 MB animated WebP.
- The countdown is evergreen: it starts a 10-minute window per visitor (stored in
  `localStorage`) and rolls over when it hits zero — no server needed.
- All content is the store's own; Shopify chrome (nav, cart, currency selector) and dead
  template fragments were intentionally dropped.
