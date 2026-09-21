import { existsSync, readFileSync, symlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const kitDir = dirname(fileURLToPath(import.meta.url));

function readName(root) {
  try {
    return JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).name;
  } catch {
    return '';
  }
}

/**
 * Tailwind IntelliSense loads the app CSS and then `require('tailwindcss')`
 * from the app. pnpm keeps that package inside k-web-ui's store, so the
 * extension never starts and never sees @theme.
 *
 * Expose the kit's tailwindcss at the app's node_modules without adding it
 * to the app's package.json. Dist CSS cannot do this: the language service
 * ignores node_modules and does not parse compiled utilities as a theme.
 */
export function ensureEditorSupport(root = process.cwd()) {
  try {
    const name = readName(root);
    if (name === 'k-web-ui' || name === 'k-web-ui-workspace') {
      return;
    }
    const nodeModules = join(root, 'node_modules');
    if (!existsSync(nodeModules)) {
      return;
    }
    const twRoot = dirname(
      require.resolve('tailwindcss/package.json', { paths: [kitDir] }),
    );
    const dest = join(nodeModules, 'tailwindcss');
    if (existsSync(dest)) {
      try {
        if (resolve(dest) === resolve(twRoot)) {
          return;
        }
      } catch {
        return;
      }
      return;
    }
    symlinkSync(
      twRoot,
      dest,
      process.platform === 'win32' ? 'junction' : 'dir',
    );
  } catch {
    // App CSS compile must not fail if node_modules is not writable.
  }
}
