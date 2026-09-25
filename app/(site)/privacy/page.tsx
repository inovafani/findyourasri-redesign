import type { Metadata } from 'next';

import { mailto, pageMetadata, pages, site } from '@/lib/site';

export const metadata: Metadata = pageMetadata(pages.privacy);

/**
 * The template is ours; the words are counsel's (B5), and the controller's
 * name waits on the entity (D3). Each section renders once its text exists.
 */
const sections: { title: string; body: string[] }[] = [
  { title: 'Who we are', body: [] },
  { title: 'What we collect', body: [] },
  { title: 'Why, and for how long', body: [] },
  { title: 'Your choices', body: [] },
  { title: 'Contact', body: [] },
];

const updated: string | null = null;

export default function PrivacyPage() {
  const written = sections.filter((s) => s.body.length);

  return (
    <section className="section section--first section--short">
      <div className="stack stack--head">
        <h1 className="page-title line-mask">Privacy Notice</h1>
        {updated ? <p className="small">Last updated {updated}</p> : null}
      </div>
      <div className="prose">
        {written.length ? (
          written.map((s) => (
            <div key={s.title}>
              <h2>{s.title}</h2>
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          ))
        ) : (
          <p>
            We use the details you send through our contact form only to reply to you. The full
            notice is being finalised. For any question about your data, write to{' '}
            <a href={mailto}>{site.email}</a>.
          </p>
        )}
      </div>
    </section>
  );
}
