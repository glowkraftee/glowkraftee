-- Email the shop owner (via the notify-owner Edge Function) when a new
-- contact message or newsletter sign-up is saved. Safe to run more than once.

create extension if not exists pg_net with schema extensions;

alter table public.contact_messages add column if not exists notified_at timestamptz;
alter table public.newsletter_subscribers add column if not exists notified_at timestamptz;

create or replace function public.notify_owner_of_new_row()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform net.http_post(
    url := 'https://bqgmsiiyxqrbwyulvzrl.supabase.co/functions/v1/notify-owner',
    body := jsonb_build_object('table', TG_TABLE_NAME, 'id', NEW.id),
    headers := '{"Content-Type": "application/json"}'::jsonb,
    timeout_milliseconds := 5000
  );
  return NEW;
end;
$$;

revoke all on function public.notify_owner_of_new_row() from public, anon, authenticated;

drop trigger if exists notify_owner_contact on public.contact_messages;
create trigger notify_owner_contact
  after insert on public.contact_messages
  for each row execute function public.notify_owner_of_new_row();

drop trigger if exists notify_owner_newsletter on public.newsletter_subscribers;
create trigger notify_owner_newsletter
  after insert on public.newsletter_subscribers
  for each row execute function public.notify_owner_of_new_row();
