/**
 * Parse what someone types into a numeric answer box. Accepts "1,250",
 * "$85", "-40", "(40)" (accounting negative), "12.5%", "3.5x", "+10".
 * Returns null for empty or unparseable input.
 */
export function parseNumberInput(raw: string): number | null {
  let s = raw.trim();
  if (!s) return null;
  let negative = false;
  if (/^\(.*\)$/.test(s)) {
    negative = true;
    s = s.slice(1, -1);
  }
  s = s.replace(/[$,\s]/g, '').replace(/[%x×]$/i, '').replace(/^\+/, '');
  if (s.startsWith('-')) {
    negative = !negative;
    s = s.slice(1);
  }
  if (!/^\d*\.?\d+$|^\d+\.$/.test(s)) return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

/** Format a number for display: thousands separators, up to 2 decimals, accounting negatives off. */
export function formatNumber(n: number, digits = 2): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: digits });
}
