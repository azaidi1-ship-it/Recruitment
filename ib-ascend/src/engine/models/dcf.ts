/**
 * Unlevered DCF for the Model Builder. Five explicit years, then a Gordon
 * growth or exit-multiple terminal value. The terminal value is always
 * discounted a full N years; mid-year convention applies to the explicit
 * cash flows only.
 */

export interface DcfInputs {
  revenue0: number;
  /** Revenue growth for each projection year (decimal). */
  growth: number[];
  ebitdaMargin: number;
  /** D&A, capex as % of revenue. */
  daPct: number;
  capexPct: number;
  /** Increase in net working capital as % of the increase in revenue. */
  nwcPct: number;
  taxRate: number;
  wacc: number;
  terminal: { method: 'gordon'; growth: number } | { method: 'multiple'; multiple: number };
  netDebt: number;
  shares: number;
  midYear: boolean;
}

export interface DcfRow {
  year: number;
  revenue: number;
  ebitda: number;
  da: number;
  ebit: number;
  taxes: number;
  capex: number;
  nwc: number;
  ufcf: number;
  discountFactor: number;
  pv: number;
}

export interface DcfResult {
  rows: DcfRow[];
  sumPv: number;
  terminalValue: number;
  pvTerminal: number;
  enterpriseValue: number;
  equityValue: number;
  perShare: number;
  /** Share of EV from the terminal value (0–1). */
  tvShare: number;
  /** Implied exit multiple (Gordon) or implied perpetual growth (multiple). */
  impliedCheck: number;
  /** Set when the inputs make the model meaningless (e.g. WACC ≤ g). */
  error: string | null;
}

export function runDcf(i: DcfInputs): DcfResult {
  const rows: DcfRow[] = [];
  let prev = i.revenue0;
  for (let y = 1; y <= i.growth.length; y++) {
    const revenue = prev * (1 + (i.growth[y - 1] ?? 0));
    const ebitda = revenue * i.ebitdaMargin;
    const da = revenue * i.daPct;
    const ebit = ebitda - da;
    const taxes = Math.max(0, ebit) * i.taxRate;
    const capex = revenue * i.capexPct;
    const nwc = (revenue - prev) * i.nwcPct;
    const ufcf = ebit - taxes + da - capex - nwc;
    const discountFactor = 1 / Math.pow(1 + i.wacc, i.midYear ? y - 0.5 : y);
    rows.push({ year: y, revenue, ebitda, da, ebit, taxes, capex, nwc, ufcf, discountFactor, pv: ufcf * discountFactor });
    prev = revenue;
  }
  const last = rows[rows.length - 1];
  const n = rows.length;
  const sumPv = rows.reduce((s, r) => s + r.pv, 0);

  let error: string | null = null;
  let terminalValue = 0;
  let impliedCheck = 0;
  if (!last) error = 'Add at least one projection year.';
  else if (i.terminal.method === 'gordon') {
    const g = i.terminal.growth;
    if (i.wacc <= g) error = 'WACC must be above the terminal growth rate.';
    else {
      terminalValue = (last.ufcf * (1 + g)) / (i.wacc - g);
      impliedCheck = last.ebitda > 0 ? terminalValue / last.ebitda : 0;
    }
  } else {
    terminalValue = last.ebitda * i.terminal.multiple;
    // g such that TV = FCF × (1 + g) / (WACC − g)  →  g = (TV × WACC − FCF) / (TV + FCF)
    impliedCheck = (terminalValue * i.wacc - last.ufcf) / (terminalValue + last.ufcf);
  }
  const pvTerminal = error ? 0 : terminalValue / Math.pow(1 + i.wacc, n);
  const enterpriseValue = sumPv + pvTerminal;
  const equityValue = enterpriseValue - i.netDebt;
  return {
    rows,
    sumPv,
    terminalValue,
    pvTerminal,
    enterpriseValue,
    equityValue,
    perShare: i.shares > 0 ? equityValue / i.shares : 0,
    tvShare: enterpriseValue > 0 ? pvTerminal / enterpriseValue : 0,
    impliedCheck,
    error,
  };
}

/**
 * Share price across WACC (rows) × terminal driver (columns: growth rate or
 * exit multiple, matching the inputs' method). Null where the model breaks.
 */
export function dcfSensitivity(i: DcfInputs, waccs: number[], drivers: number[]): (number | null)[][] {
  return waccs.map((wacc) =>
    drivers.map((d) => {
      const r = runDcf({
        ...i,
        wacc,
        terminal: i.terminal.method === 'gordon' ? { method: 'gordon', growth: d } : { method: 'multiple', multiple: d },
      });
      return r.error ? null : r.perShare;
    }),
  );
}
