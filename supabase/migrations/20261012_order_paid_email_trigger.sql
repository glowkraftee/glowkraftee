-- Email the owner (and, once the domain is verified, the buyer) when an order
-- becomes "paid". Calls the notify-owner Edge Function.
alter table public.order_headers add column if not exists notified_at timestamptz;

create or replace function public.notify_order_paid()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform net.http_post(
    url := 'https://bqgmsiiyxqrbwyulvzrl.supabase.co/functions/v1/notify-owner',
    body := jsonb_build_object('table', 'order_headers', 'id', NEW.id),
    headers := '{"Content-Type": "application/json"}'::jsonb,
    timeout_milliseconds := 8000
  );
  return NEW;
end;
$$;

revoke all on function public.notify_order_paid() from public, anon, authenticated;

create trigger notify_order_paid_trg
  after update of status on public.order_headers
  for each row
  when (NEW.status = 'paid' and OLD.status is distinct from 'paid')
  execute function public.notify_order_paid();
