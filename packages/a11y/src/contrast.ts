export const WCAG = {
  AA_TEXT: 4.5,
  AA_LARGE_TEXT: 3.0,
  AA_UI: 3.0,
  AAA_TEXT: 7.0,
} as const;

const lin = (c: number): number => {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
};

export function luminance(hex: string): number {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3
    ? clean.split('').map((char) => char + char).join('')
    : clean.slice(0, 6);
  const n = parseInt(full, 16);
  if (isNaN(n)) return 0;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(fgHex: string, bgHex: string): number {
  const l1 = luminance(fgHex);
  const l2 = luminance(bgHex);
  const brighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((brighter + 0.05) / (darker + 0.05)).toFixed(2));
}

export function assertContrast(
  fg: string,
  bg: string,
  context: string,
  min: number = WCAG.AA_TEXT
): boolean {
  const r = contrastRatio(fg, bg);
  if (r < min) {
    if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') {
      console.warn(`[a11y-warning] ${context}: contrast ${r}:1 does not satisfy ${min}:1 target (${fg} on ${bg})`);
    }
    return false;
  }
  return true;
}
