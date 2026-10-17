/**
 * Accretion / dilution for the Model Builder: pro forma EPS for an
 * acquisition paid with any mix of cash, new debt and stock.
 */

export interface AccretionInputs {
  acquirerPrice: number;
  acquirerShares: number;
  acquirerNetIncome: number;
  targetNetIncome: number;
  /** Equity purchase price paid for the target. */
  purchasePrice: number;
  /** Consideration mix (decimals); normalized if they don't sum to 1. */
  pctCash: number;
  pctDebt: number;
  pctStock: number;
  /** Pre-tax rate on new debt and pre-tax interest forgone on cash used. */
  debtRate: number;
  cashRate: number;
  taxRate: number;
  /** Pre-tax synergies. */
  synergies: number;
}

export interface AccretionResult {
  newShares: number;
  afterTaxInterest: number;
  forgoneInterest: number;
  afterTaxSynergies: number;
  proFormaNetIncome: number;
  proFormaShares: number;
  standaloneEps: number;
  proFormaEps: number;
  /** Pro forma / standalone − 1. */
  accretion: number;
  /** Pre-tax synergies needed to break even (0 if already accretive). */
  breakevenSynergies: number;
  /** After-tax cost of each funding source vs the target's yield (net income / price). */
  costs: { cash: number; debt: number; stock: number; targetYield: number };
}

export function runAccretion(i: AccretionInputs): AccretionResult {
  const mix = i.pctCash + i.pctDebt + i.pctStock || 1;
  const cash = (i.purchasePrice * i.pctCash) / mix;
  const debt = (i.purchasePrice * i.pctDebt) / mix;
  const stock = (i.purchasePrice * i.pctStock) / mix;

  const newShares = i.acquirerPrice > 0 ? stock / i.acquirerPrice : 0;
  const afterTaxInterest = debt * i.debtRate * (1 - i.taxRate);
  const forgoneInterest = cash * i.cashRate * (1 - i.taxRate);
  const afterTaxSynergies = i.synergies * (1 - i.taxRate);
  const beforeSynergies = i.acquirerNetIncome + i.targetNetIncome - afterTaxInterest - forgoneInterest;
  const proFormaNetIncome = beforeSynergies + afterTaxSynergies;
  const proFormaShares = i.acquirerShares + newShares;
  const standaloneEps = i.acquirerShares > 0 ? i.acquirerNetIncome / i.acquirerShares : 0;
  const proFormaEps = proFormaShares > 0 ? proFormaNetIncome / proFormaShares : 0;
  const needed = (standaloneEps * proFormaShares - beforeSynergies) / (1 - i.taxRate);

  return {
    newShares,
    afterTaxInterest,
    forgoneInterest,
    afterTaxSynergies,
    proFormaNetIncome,
    proFormaShares,
    standaloneEps,
    proFormaEps,
    accretion: standaloneEps !== 0 ? proFormaEps / standaloneEps - 1 : 0,
    breakevenSynergies: Math.max(0, needed),
    costs: {
      cash: i.cashRate * (1 - i.taxRate),
      debt: i.debtRate * (1 - i.taxRate),
      stock: i.acquirerPrice > 0 ? standaloneEps / i.acquirerPrice : 0,
      targetYield: i.purchasePrice > 0 ? i.targetNetIncome / i.purchasePrice : 0,
    },
  };
}

/**
 * Accretion across % stock (rows; the rest split between cash and debt in
 * the inputs' cash:debt ratio) × purchase price (columns).
 */
export function accretionSensitivity(i: AccretionInputs, stockPcts: number[], prices: number[]): number[][] {
  const nonStock = i.pctCash + i.pctDebt;
  const cashShare = nonStock > 0 ? i.pctCash / nonStock : 0;
  return stockPcts.map((s) =>
    prices.map(
      (p) =>
        runAccretion({ ...i, purchasePrice: p, pctStock: s, pctCash: (1 - s) * cashShare, pctDebt: (1 - s) * (1 - cashShare) }).accretion,
    ),
  );
}
