-- Orders contain customer names, emails, phones and addresses.
-- The website now reads them only through the order-access Edge Function,
-- so the public read rules are no longer needed. Removing them does not
-- delete any orders.
drop policy if exists "Public can read order headers" on public.order_headers;
drop policy if exists "Public can read order items" on public.order_items;
