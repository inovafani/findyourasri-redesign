-- Which form a row came from: the client profile (/client-profile/) or the website brief (/website-form/).
--
-- Both forms are stored in client_profiles, because they share everything that matters: a draft id that uploads
-- are filed under, the contact, the answers, the team follow-ups, and the files. `answers` is keyed by field id,
-- and which questions those ids belong to is decided by form_type (lib/client-profile/schema.ts or
-- lib/website-form/schema.ts). Rows that exist already are client profiles, which is the default.
--
-- Run this BEFORE redeploying the function. The function still saves client profiles if it has not been run
-- yet, but it refuses website briefs rather than file them under the wrong form.
--
-- A website brief has no consent question, so its `consent` column is false. Nothing reads it.

alter table public.client_profiles
  add column if not exists form_type text not null default 'client_profile'
    check (form_type in ('client_profile', 'website_brief'));

create index if not exists client_profiles_form_type_idx on public.client_profiles (form_type, submitted_at desc);
