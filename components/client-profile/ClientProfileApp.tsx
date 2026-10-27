'use client';

import { config } from '@/lib/client-profile/schema';

import FormApp from './FormApp';

/** The client profile, at /client-profile/. */
export default function ClientProfileApp() {
  return <FormApp cfg={config} />;
}
