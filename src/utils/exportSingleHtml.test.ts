import test from 'node:test';
import assert from 'node:assert/strict';
import { SAFELIGHT_PRESETS } from '../data/footerData';
import { buildSingleHtmlDocument, escapeHtml } from './exportSingleHtml';

test('escapeHtml escapes angle brackets, quotes, and ampersands', () => {
  assert.equal(
    escapeHtml('<script>"test" & \'more\'</script>'),
    '&lt;script&gt;&quot;test&quot; &amp; &#39;more&#39;&lt;/script&gt;'
  );
});

test('buildSingleHtmlDocument returns a self-contained HTML document with current config', () => {
  const html = buildSingleHtmlDocument({
    wordmark: 'ACME LAB',
    brandName: 'ACME.STUDIO',
    preset: SAFELIGHT_PRESETS[1],
    lineCount: 26,
    animated: true,
    showBackgroundLines: true,
    year: 2026,
  });

  assert.ok(html.startsWith('<!doctype html>'));
  assert.ok(html.includes('ACME.STUDIO'));
  assert.ok(html.includes('"ACME LAB"'));
  assert.ok(html.includes('--dr-accent: #ff8a00;'));
  assert.ok(html.includes('height: 364px;'));
  assert.ok(html.includes('BECOME AN OPEN SOURCE SPONSOR'));
  assert.ok(html.includes("LET'S TALK"));
  assert.ok(html.includes('&copy;2026 ACME.STUDIO'));
});
