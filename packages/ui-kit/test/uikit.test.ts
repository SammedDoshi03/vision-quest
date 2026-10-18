import test from 'node:test';
import assert from 'node:assert/strict';
import { darkTheme } from '../src/theme/tokens';
import { contrastRatio, WCAG } from '@internal/a11y/contrast';

test('darkTheme textPrimary meets WCAG AA contrast against background', () => {
  const ratio = contrastRatio(darkTheme.colors.textPrimary, darkTheme.colors.background);
  assert.ok(ratio >= WCAG.AA_TEXT, `Contrast ratio was ${ratio}, expected >= ${WCAG.AA_TEXT}`);
});

test('darkTheme textPrimary meets WCAG AA contrast against surfaceElevated (SlideUpPanel background)', () => {
  const ratio = contrastRatio(darkTheme.colors.textPrimary, darkTheme.colors.surfaceElevated);
  assert.ok(ratio >= WCAG.AA_TEXT, `Contrast ratio was ${ratio}, expected >= ${WCAG.AA_TEXT}`);
});

test('darkTheme primary brand color meets WCAG AA for UI elements against background', () => {
  const ratio = contrastRatio(darkTheme.colors.primary, darkTheme.colors.background);
  assert.ok(ratio >= WCAG.AA_UI, `Contrast ratio was ${ratio}, expected >= ${WCAG.AA_UI}`);
});
