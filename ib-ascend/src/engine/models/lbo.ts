/**
 * Simple LBO for the Model Builder: one debt tranche, interest on the
 * beginning balance, a cash sweep, and exit at a multiple of final EBITDA.
 * Fees are funded with equity.
 */

export interface LboInputs {
  ebitda0: number;
  /** Annual EBITDA growth (decimal). */
  growth: number;
  entryMultiple: number;
  exitMultiple: number;
  /** Debt at entry as a multiple of EBITDA. */
  leverage: number;
  interestRate: number;
  taxRate: number;
  /** D&A and capex as % of EBITDA. */
  daPct: number;
  capexPct: number;
  /** Increase in NWC as % of the increase in EBITDA. */
  nwcPct: number;
  years: number;
  /** Share of free cash flow used to repay debt (0–1); the rest builds cash. */
  sweep: number;
  /** Transaction fees as % of entry EV. */
  feesPct: number;
}

export interface LboRow {
  year: number;
  ebitda: number;
  da: number;
  interest: number;
  taxes: number;
  netIncome: number;
  capex: number;
  nwc: number;
  fcf: number;
  repayment: number;
  debt: number;
  cash: number;
}

export interface LboResult {
  entryEv: number;
  fees: number;
  debt0: number;
  equity0: number;
  rows: LboRow[];
  exitEv: number;
  exitNetDebt: number;
  exitEquity: number;
  moic: number;
  irr: number;
  error: string | null;
}

export function runLbo(i: LboInputs): LboResult {
  const entryEv = i.ebitda0 * i.entryMultiple;
  const fees = entryEv * i.feesPct;
  const debt0 = i.ebitda0 * i.leverage;
  const equity0 = entryEv + fees - debt0;
  const rows: LboRow[] = [];
  let debt = debt0;
  let cash = 0;
  let ebitda = i.ebitda0;
  for (let y = 1; y <= i.years; y++) {
    const prev = ebitda;
    ebitda = prev * (1 + i.growth);
    const da = ebitda * i.daPct;
    const interest = debt * i.interestRate;
    const ebt = ebitda - da - interest;
    const taxes = Math.max(0, ebt) * i.taxRate;
    const netIncome = ebt - taxes;
    const capex = ebitda * i.capexPct;
    const nwc = (ebitda - prev) * i.nwcPct;
    const fcf = netIncome + da - capex - nwc;
    const repayment = Math.min(debt, Math.max(0, fcf * i.sweep));
    debt -= repayment;
    cash += fcf - repayment;
    rows.push({ year: y, ebitda, da, interest, taxes, netIncome, capex, nwc, fcf, repayment, debt, cash });
  }
  const exitEv = ebitda * i.exitMultiple;
  const exitNetDebt = debt - cash;
  const exitEquity = exitEv - exitNetDebt;
  let error: string | null = null;
  if (equity0 <= 0) error = 'Debt exceeds the purchase price: there is no equity check.';
  else if (i.years < 1) error = 'Hold for at least one year.';
  const moic = error ? 0 : exitEquity / equity0;
  const irr = error || moic <= 0 ? -1 : Math.pow(moic, 1 / i.years) - 1;
  return { entryEv, fees, debt0, equity0, rows, exitEv, exitNetDebt, exitEquity, moic, irr, error };
}

/** IRR across two inputs, e.g. entry × exit multiple. Null where the deal breaks. */
export function lboSensitivity<K extends keyof LboInputs>(
  i: LboInputs,
  rowKey: K,
  rowValues: number[],
  colKey: keyof LboInputs,
  colValues: number[],
): (number | null)[][] {
  return rowValues.map((rv) =>
    colValues.map((cv) => {
      const r = runLbo({ ...i, [rowKey]: rv, [colKey]: cv });
      return r.error ? null : r.irr;
    }),
  );
}
