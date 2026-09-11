import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src/base/fonts');

for (const dest of [join(root, 'dist/fonts'), join(root, 'dist/base/fonts')]) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}
