import test from 'node:test';
import assert from 'node:assert/strict';
import { contrastRatio, assertContrast, WCAG } from '../src/contrast';

test('contrastRatio computes high contrast correctly for black on white', () => {
  const ratio = contrastRatio('#000000', '#ffffff');
  assert.ok(ratio >= 21.0);
});

test('contrastRatio computes low contrast for light gray on white', () => {
  const ratio = contrastRatio('#cccccc', '#ffffff');
  assert.ok(ratio < WCAG.AA_TEXT);
});

test('assertContrast returns false when failing WCAG AA', () => {
  const passes = assertContrast('#999999', '#ffffff', 'Test Context', WCAG.AA_TEXT);
  assert.strictEqual(passes, false);
});
