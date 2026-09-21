import tailwindcss from '@tailwindcss/postcss';
import { ensureEditorSupport } from './scripts/ensure-editor.js';

try {
  ensureEditorSupport();
} catch {
  // Editor setup must not block CSS compilation.
}

export default tailwindcss;
