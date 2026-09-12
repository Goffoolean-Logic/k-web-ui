import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src/base/icons');

for (const dest of [join(root, 'dist/icons'), join(root, 'dist/base/icons')]) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}
