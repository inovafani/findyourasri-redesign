/**
 * Encrypts the MADÒ ONNÀ social calendar for /madoonna-social-proposal/ (components/madoonna/SocialCalendar.tsx).
 *
 * Reads _src/madoonna-social-proposal/content.json plus its images (gitignored, never deployed), inlines the images
 * as data URLs, and writes public/portal-data/madoonna-social-proposal/{meta.json,payload.bin}: AES-256-GCM keyed
 * from the password with PBKDF2-SHA256, the same format PortalApp reads. Re-run after any content or password change:
 *
 *   PASSWORD='…' node scripts/encrypt-madoonna-social-proposal.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { webcrypto as crypto } from 'node:crypto';
import assert from 'node:assert/strict';

const SRC = '_src/madoonna-social-proposal';
const OUT = 'public/portal-data/madoonna-social-proposal';
const ROUNDS = 600000;
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

const password = process.env.PASSWORD;
if (!password) throw new Error("Set PASSWORD='…' in the environment.");

const content = JSON.parse(await readFile(join(SRC, 'content.json'), 'utf8'));
const files = [content.hero.logo, content.render.src, ...content.grid.items.map((i) => i.src)];
content.images = {};
for (const f of files) {
  const mime = MIME[extname(f).toLowerCase()];
  assert(mime, `Unknown image type: ${f}`);
  content.images[f] = `data:${mime};base64,${(await readFile(join(SRC, f))).toString('base64')}`;
}

const salt = crypto.getRandomValues(new Uint8Array(16));
const keyFor = async (pw) =>
  crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ROUNDS, hash: 'SHA-256' },
    await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']),
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
const key = await keyFor(password);
const iv = crypto.getRandomValues(new Uint8Array(12));
const plain = new TextEncoder().encode(JSON.stringify(content));
const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain));
const payload = Buffer.concat([iv, cipher]);

// Self-check: the right password round-trips, a wrong one is refused.
const back = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: payload.subarray(0, 12) }, key, payload.subarray(12));
assert.deepEqual(new Uint8Array(back), plain);
await assert.rejects(crypto.subtle.decrypt({ name: 'AES-GCM', iv }, await keyFor(password + 'x'), cipher));

await mkdir(OUT, { recursive: true });
const meta = { v: 1, kdf: 'PBKDF2-SHA256', rounds: ROUNDS, salt: Buffer.from(salt).toString('base64'), cipher: 'AES-256-GCM' };
await writeFile(join(OUT, 'meta.json'), JSON.stringify(meta));
await writeFile(join(OUT, 'payload.bin'), payload);
console.log(`Wrote ${OUT}/payload.bin (${(payload.length / 1024).toFixed(0)} KB) and meta.json; round-trip check passed.`);
