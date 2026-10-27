'use client';

import { config } from '@/lib/website-form/schema';

import FormApp from './FormApp';

/** The website brief, at /website-form/. */
export default function WebsiteFormApp() {
  return <FormApp cfg={config} />;
}
