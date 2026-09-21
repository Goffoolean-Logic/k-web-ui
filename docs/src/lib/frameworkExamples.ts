/** Build Angular / React snippets from the vanilla HTML + TS pair used in docs. */

function stripKitImport(ts: string): string {
  return ts
    .replace(/^import\s+['"]k-web-ui\/js['"]\s*;?\s*\n+/m, '')
    .replace(/\nimport\s+['"]k-web-ui\/js['"]\s*;?/g, '')
    .trim();
}

function indent(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => (line.length ? pad + line : line))
    .join('\n');
}

function htmlToJsx(html: string): string {
  return html
    .replace(/\sclass=/g, ' className=')
    .replace(/\sfor=/g, ' htmlFor=')
    .replace(/\sstyle="([^"]*)"/g, (_match, css: string) => {
      const entries = css
        .split(';')
        .map((part: string) => part.trim())
        .filter(Boolean)
        .map((part: string) => {
          const colon = part.indexOf(':');
          if (colon < 0) return null;
          const key = part
            .slice(0, colon)
            .trim()
            .replace(/-([a-z])/g, (_m, c: string) => c.toUpperCase());
          const value = part.slice(colon + 1).trim();
          return `${key}: '${value}'`;
        })
        .filter(Boolean);
      return ` style={{ ${entries.join(', ')} }}`;
    });
}

export function toAngularExample(html: string, ts: string): string {
  const body = stripKitImport(ts);
  const angularImports = `import { Component, CUSTOM_ELEMENTS_SCHEMA${
    body ? ', type AfterViewInit' : ''
  } } from '@angular/core';`;

  const classBody = body
    ? ` implements AfterViewInit {
  ngAfterViewInit() {
${indent(body, 4)}
  }
}`
    : ` {}`;

  return `${angularImports}
import 'k-web-ui/js';

@Component({
  selector: 'app-example',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: \`
${indent(html.trim(), 4)}
  \`,
})
export class ExampleComponent${classBody}
`;
}

export function toReactExample(html: string, ts: string): string {
  const body = stripKitImport(ts);
  const jsx = htmlToJsx(html.trim());
  const reactImport = body
    ? `import { useEffect } from 'react';
import 'k-web-ui/js';`
    : `import 'k-web-ui/js';`;

  const effect = body
    ? `
  useEffect(() => {
${indent(body, 4)}
  }, []);
`
    : '\n';

  return `${reactImport}

export function Example() {${effect}
  return (
    <>
${indent(jsx, 6)}
    </>
  );
}
`;
}
