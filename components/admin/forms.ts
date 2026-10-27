import { config as clientProfile } from '@/lib/client-profile/schema';
import type { FormConfig } from '@/lib/forms/engine';
import { config as websiteBrief } from '@/lib/website-form/schema';

/**
 * The two forms the admin pages can show. A row's `form_type` says which one its answers belong to; rows saved
 * before the column existed have none, and are client profiles.
 */
export type FormType = FormConfig['id'];

export const FORMS: Record<FormType, { cfg: FormConfig; label: string; plural: string }> = {
  client_profile: { cfg: clientProfile, label: 'Client profile', plural: 'Client profiles' },
  website_brief: { cfg: websiteBrief, label: 'Website brief', plural: 'Website briefs' },
};

export const typeOf = (row: { form_type?: string | null }): FormType => (row.form_type === 'website_brief' ? 'website_brief' : 'client_profile');
