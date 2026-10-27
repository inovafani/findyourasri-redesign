/**
 * The shared form engine: field and section types, the rules that show or hide a question, how answers are read,
 * collected and written out as text, and the upload limits. Each form (lib/client-profile/schema.ts,
 * lib/website-form/schema.ts) lists its own questions and builds its helpers with makeForm().
 *
 * Answers are keyed by field id. A question hidden by its `show` rule reads as empty, so a changed mind never
 * leaves a stale answer behind.
 */

export type RefRow = { url: string; notes: string };
export type Answer = string | string[] | boolean | RefRow[];
export type Getter = (id: string) => Answer;
export type Cond = (get: Getter) => boolean;

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checks'
  | 'refs'
  | 'consent'
  /** Brand colours: swatches picked on screen. The answer is one string, "#0C0A08, #C9A063". */
  | 'colors'
  /** An upload. Holds no answer: the files live apart, keyed by this field's id. */
  | 'file';

export type Field = {
  id: string;
  label: string;
  type: FieldType;
  req?: boolean;
  help?: string;
  ph?: string;
  opts?: readonly string[];
  show?: Cond;
  /** For 'file' fields: the category their files are filed under; 'auto' guesses from the file name. */
  category?: KitCategory | 'auto';
  /** The card this question sits in on screen. Set by applyLayout from the form's GROUPS. */
  group?: string;
  /** For 'refs': placeholder and size of the notes box beside each link. Defaults suit short notes. */
  notesPh?: string;
  notesMultiline?: boolean;
  /** For 'refs': the row (counting from 0) from which "(optional)" is added to the link's placeholder. Default 3. */
  optionalFrom?: number;
};

export type Section = {
  id: string;
  title: string;
  lede: string;
  note?: string;
  /** Rough minutes a client needs for it, for the "time left" line. Set below, from MINUTES. */
  minutes?: number;
  fields: Field[];
};

/* ---------- limits and categories for uploads ---------- */

/** Keep in step with MAX_FILE_BYTES, EXTENSIONS and CATEGORIES in supabase/functions/client-profile/index.ts. */
export const KIT_MAX_BYTES = 50 * 1024 * 1024;
export const KIT_MAX_FILES = 40;
export const KIT_EXTENSIONS = [
  'pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'tif', 'tiff', 'heic',
  'ai', 'eps', 'psd', 'indd', 'sketch', 'fig',
  'zip', 'doc', 'docx', 'ppt', 'pptx', 'key', 'pages', 'xls', 'xlsx', 'numbers', 'csv', 'txt',
  'ttf', 'otf', 'woff', 'woff2', 'mp4', 'mov',
] as const;
export const KIT_CATEGORIES = [
  'Logo', 'Brand guidelines', 'Photos', 'Renderings', 'Menu or price list', 'Press kit',
  'Inspiration', 'Website copy', 'Supporting content', 'Legal pages',
  'Other',
] as const;
export type KitCategory = (typeof KIT_CATEGORIES)[number];

/** A first guess at the category from the file name, so most files need no change. */
export function guessCategory(name: string): KitCategory {
  const n = name.toLowerCase();
  const ext = n.includes('.') ? n.split('.').pop()! : '';
  if (/logo|wordmark|monogram/.test(n)) return 'Logo';
  if (/guideline|brand[\s_-]?(book|guide|manual|kit)|style[\s_-]?guide/.test(n)) return 'Brand guidelines';
  if (/menu|rate|price|tariff/.test(n)) return 'Menu or price list';
  if (/press|media[\s_-]?kit/.test(n)) return 'Press kit';
  if (['jpg', 'jpeg', 'png', 'webp', 'heic', 'tif', 'tiff'].includes(ext)) return 'Photos';
  return 'Other';
}

/* ---------- conditions ---------- */

export const is =
  (id: string, ...vals: string[]): Cond =>
  (get) => {
    const x = get(id);
    return Array.isArray(x) ? vals.some((v) => (x as string[]).includes(v)) : vals.includes(x as string);
  };

/** Answered, and not only with one of `vals`. An empty answer counts as hidden. */
export const not =
  (id: string, ...vals: string[]): Cond =>
  (get) => {
    const x = get(id);
    if (x === '') return false;
    if (Array.isArray(x)) {
      const list = x as string[];
      return !(list.length === 0 || (vals.some((v) => list.includes(v)) && list.length === 1));
    }
    return !vals.includes(x as string);
  };

export const filled =
  (id: string): Cond =>
  (get) => {
    const x = get(id);
    return Array.isArray(x) ? x.length > 0 : Boolean(x);
  };

export const any =
  (...fs: Cond[]): Cond =>
  (get) =>
    fs.some((f) => f(get));

/* ---------- reading answers ---------- */

export const emptyFor = (f: Field): Answer => (f.type === 'checks' || f.type === 'refs' ? [] : f.type === 'consent' ? false : '');

export function hasValue(x: Answer): boolean {
  if (Array.isArray(x)) return (x as unknown[]).some((r) => (typeof r === 'string' ? r : r && ((r as RefRow).url || (r as RefRow).notes)));
  return x === true || (typeof x === 'string' && x.trim() !== '');
}

export const isVisible = (f: Field, get: Getter) => !f.show || f.show(get);

export function formatAnswer(f: Field, x: Answer): string {
  if (f.type === 'refs') return (x as RefRow[]).filter((r) => r.url || r.notes).map((r) => (r.url || '(no link)') + (r.notes ? `: ${r.notes}` : '')).join('\n');
  if (f.type === 'consent') return x ? 'Confirmed' : '';
  if (Array.isArray(x)) return (x as string[]).join(', ');
  return String(x).trim();
}

/** Puts each question in its titled card and gives each section its minutes. Run once per form, at load. */
export function applyLayout(sections: Section[], minutes: Record<string, number>, groups: Record<string, [string, string[]][]>) {
  for (const s of sections) {
    s.minutes = minutes[s.id];
    for (const [title, ids] of groups[s.id] ?? []) {
      for (const id of ids) {
        const f = s.fields.find((x) => x.id === id);
        if (f) f.group = title;
      }
    }
  }
}

/** The helpers that need to know which questions exist, bound to one form. `label` heads the plain-text copy. */
export function makeForm(sections: Section[], label: string) {
  const fields: Record<string, Field> = Object.fromEntries(sections.flatMap((s) => s.fields.map((f) => [f.id, f])));

  /** A getter over raw answers that applies the show rules: hidden questions read as empty. */
  function makeGetter(answers: Record<string, Answer>): Getter {
    const get: Getter = (id) => {
      const f = fields[id];
      if (!f) return '';
      if (f.show && !f.show(get)) return emptyFor(f);
      const x = answers[id];
      return x === undefined ? emptyFor(f) : x;
    };
    return get;
  }

  /** Everything the client should be sent: visible questions with an answer, nothing else. */
  function collectAnswers(get: Getter): Record<string, Answer> {
    const out: Record<string, Answer> = {};
    for (const s of sections) {
      for (const f of s.fields) {
        if (!isVisible(f, get)) continue;
        const x = get(f.id);
        if (hasValue(x)) out[f.id] = f.type === 'refs' ? (x as RefRow[]).filter((r) => r.url || r.notes) : x;
      }
    }
    return out;
  }

  /** The answers as plain text, for the "copy my answers" button and the admin page's "Copy all answers". */
  function answersAsText(get: Getter, kit: { name: string; category: string; field: string }[]): string {
    const lines: string[] = [`${label}: ${get('biz_name') as string}`, ''];
    for (const s of sections) {
      const rows = s.fields.filter((f) => isVisible(f, get) && hasValue(get(f.id)));
      const sectionFiles = kit.filter((k) => s.fields.some((f) => f.id === k.field));
      if (!rows.length && !sectionFiles.length) continue;
      lines.push(s.title.toUpperCase());
      rows.forEach((f) => {
        const t = formatAnswer(f, get(f.id));
        lines.push(t.includes('\n') ? `${f.label}:\n${t}` : `${f.label}: ${t}`);
      });
      if (sectionFiles.length) lines.push(`Files sent: ${sectionFiles.map((k) => `${k.name} (${k.category})`).join(', ')}`);
      lines.push('');
    }
    return lines.join('\n');
  }

  return { sections, fields, makeGetter, collectAnswers, answersAsText };
}

/* ---------- follow-ups and the shape of a form ---------- */

export type FollowUp = { kind: 'setup' | 'check' | 'note'; text: string };

/** Everything the form screen needs to know about one form. See lib/client-profile/schema.ts and lib/website-form/schema.ts. */
export type FormConfig = {
  /** Sent with every submission, and stored with it, so the admin page knows which questions the answers belong to. */
  id: 'client_profile' | 'website_brief';
  title: string;
  /** The line under the title: how long it takes, and that answers are saved on this device. */
  sub: string;
  /** What the thank-you page calls it: "Your profile for ..." */
  noun: string;
  storeKey: string;
  sections: Section[];
  fields: Record<string, Field>;
  chapters: { title: string; ids: string[] }[];
  followUps: (get: Getter, kitFiles: number) => FollowUp[];
  makeGetter: ReturnType<typeof makeForm>['makeGetter'];
  collectAnswers: ReturnType<typeof makeForm>['collectAnswers'];
  answersAsText: ReturnType<typeof makeForm>['answersAsText'];
  /** A checkbox answer that excludes the others in its list, by field id: choosing "None yet" clears the rest. */
  exclusive?: Record<string, string>;
  /** The few answers repeated back on the thank-you page. */
  doneFields: string[];
};
