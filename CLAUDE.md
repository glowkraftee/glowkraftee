# GlowKraftee – notes for working on this site

Storefront: Vite + React (this repo) on Vercel, data in Supabase project
`bqgmsiiyxqrbwyulvzrl`, payments by Safepay. Owner contact email lives in
`lib/siteConfig.ts`.

## Copying products from the GlowKraftee Etsy shop

The owner sometimes asks to copy listings from https://www.etsy.com/shop/GlowKraftee.
Follow these rules every time:

1. **Price:** website price = Etsy price × 0.85 (15% lower), rounded to cents.
   Store it in `product_items.price` with `discount_enabled = false`.
2. **Photos must never be cropped.** Product photos are shown whole
   (`object-contain` on a cream `bg-background-100`), so any photo shape works.
   For tall images such as book covers or posters, also make a **square** version
   (whole image centred on a matching background, ~1000×1000) and use that as the
   first photo, so the title is never cut off. Check the result on the live site.
3. **Photos:** take up to 8 per listing. Prefer copying them into the site
   (`public/images/...` or Supabase storage) over hotlinking Etsy, because Etsy
   URLs break if the listing is removed.
4. **Description:** copy the Etsy text, but remove "Free Delivery at your
   doorstep" and "All taxes pre-paid and included in the price" (the website
   charges shipping and tax). Keep "GlowKraftee Artisans made it with care and
   love for you." If the listing has colour/design choices, tell the buyer to
   send their choice after ordering (the site has no option selector yet).
5. **Sizes with different prices:** the site has no size selector yet. Add the
   smallest size as the product and put the size in the name, unless the owner
   asks for separate products per size.
6. **Category:** put each item in the matching category (create one if needed);
   empty categories are hidden automatically.
7. **Digital items:** set `is_digital = true`, upload the file to the private
   `digital-products` bucket and set `digital_file_path`; put it in the
   "Digital Downloads" category. Buyers get a 24-hour link after payment.
8. Flag strong health claims (asthma, SAD, etc.) to the owner rather than
   silently publishing them.

## Security rules already in place – keep them

- Checkout prices, shipping and tax are computed on the server
  (`create-checkout-session`); never trust prices from the browser.
- Orders are private: read them only through the `order-access` function
  (order number + email, or Safepay tracker). Do not add public read policies
  to `order_headers` / `order_items`.
- The Safepay webhook verifies signatures (HMAC-SHA512) and only moves
  `pending_payment` → `paid`.
