import { useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { dcfSensitivity, runDcf, type DcfInputs } from '../../engine/models/dcf';
import { accretionSensitivity, runAccretion, type AccretionInputs } from '../../engine/models/accretion';
import { lboSensitivity, runLbo, type LboInputs } from '../../engine/models/lbo';
import { Button, Card, PageHeader, cx } from '../../components/ui';
import { InputGroup, NumberField, Output, SensitivityTable, around, money, mult, pct, round } from './modelUi';

const TABS = [
  { id: 'dcf', label: 'DCF' },
  { id: 'accretion', label: 'Accretion / dilution' },
  { id: 'lbo', label: 'LBO' },
] as const;

/** Interactive mini models: change any input and every output and sensitivity table updates. */
export function ModelBuilders() {
  const { model } = useParams();
  const tab = TABS.find((t) => t.id === model)?.id ?? 'dcf';
  return (
    <>
      <PageHeader title="Model Builders" subtitle="Change any input; outputs and sensitivity tables update instantly. Percent fields are typed as percentages." />
      <nav className="mb-4 flex gap-1 border-b border-line" aria-label="Models">
        {TABS.map((t) => (
          <NavLink
            key={t.id}
            to={`/tools/models/${t.id}`}
            className={({ isActive }) =>
              cx('-mb-px border-b-2 px-3 py-2 text-sm transition', isActive || (t.id === 'dcf' && !model) ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink')
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
      {tab === 'dcf' && <DcfBuilder />}
      {tab === 'accretion' && <AccretionBuilder />}
      {tab === 'lbo' && <LboBuilder />}
    </>
  );
}

// ───────────────────────────── DCF ─────────────────────────────

const DCF_DEFAULT: DcfInputs = {
  revenue0: 1000,
  growth: [0.1, 0.09, 0.08, 0.07, 0.06],
  ebitdaMargin: 0.25,
  daPct: 0.04,
  capexPct: 0.05,
  nwcPct: 0.1,
  taxRate: 0.25,
  wacc: 0.09,
  terminal: { method: 'gordon', growth: 0.025 },
  netDebt: 400,
  shares: 100,
  midYear: false,
};

function DcfBuilder() {
  const [i, setI] = useState(DCF_DEFAULT);
  const set = <K extends keyof DcfInputs>(k: K, v: DcfInputs[K]) => setI((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => runDcf(i), [i]);
  const gordon = i.terminal.method === 'gordon';
  const driver = gordon ? (i.terminal as { growth: number }).growth : (i.terminal as { multiple: number }).multiple;
  const waccs = around(i.wacc, 0.01);
  const drivers = gordon ? around(driver, 0.005) : around(driver, 1);
  const grid = useMemo(() => dcfSensitivity(i, waccs, drivers), [i]);

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <Card>
        <InputGroup title="Operations">
          <NumberField label="Revenue (year 0)" value={i.revenue0} onChange={(v) => set('revenue0', v)} suffix="$" />
          <NumberField label="EBITDA margin" value={i.ebitdaMargin} onChange={(v) => set('ebitdaMargin', v)} percent />
          {i.growth.map((g, k) => (
            <NumberField key={k} label={`Growth, year ${k + 1}`} value={g} percent onChange={(v) => set('growth', i.growth.map((x, j) => (j === k ? v : x)))} />
          ))}
        </InputGroup>
        <InputGroup title="Cash flow">
          <NumberField label="D&A % revenue" value={i.daPct} onChange={(v) => set('daPct', v)} percent />
          <NumberField label="Capex % revenue" value={i.capexPct} onChange={(v) => set('capexPct', v)} percent />
          <NumberField label="ΔNWC % Δrevenue" value={i.nwcPct} onChange={(v) => set('nwcPct', v)} percent />
          <NumberField label="Tax rate" value={i.taxRate} onChange={(v) => set('taxRate', v)} percent />
        </InputGroup>
        <InputGroup title="Valuation">
          <NumberField label="WACC" value={i.wacc} onChange={(v) => set('wacc', v)} percent />
          {gordon ? (
            <NumberField label="Terminal growth" value={driver} percent onChange={(v) => set('terminal', { method: 'gordon', growth: v })} />
          ) : (
            <NumberField label="Exit EV/EBITDA" value={driver} suffix="x" onChange={(v) => set('terminal', { method: 'multiple', multiple: v })} />
          )}
          <NumberField label="Net debt" value={i.netDebt} onChange={(v) => set('netDebt', v)} suffix="$" />
          <NumberField label="Diluted shares" value={i.shares} onChange={(v) => set('shares', v)} />
        </InputGroup>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <Toggle
            on={gordon}
            labels={['Gordon growth', 'Exit multiple']}
            onChange={(g) => set('terminal', g ? { method: 'gordon', growth: 0.025 } : { method: 'multiple', multiple: 10 })}
          />
          <Toggle on={i.midYear} labels={['Mid-year', 'End of year']} onChange={(m) => set('midYear', m)} />
        </div>
        <Button variant="ghost" className="mt-3" onClick={() => setI(DCF_DEFAULT)}>
          <RotateCcw size={14} /> Reset
        </Button>
      </Card>

      <div className="space-y-4">
        <Card>
          {r.error && <p className="mb-2 text-sm text-bad">{r.error}</p>}
          <div className="grid gap-x-8 sm:grid-cols-2">
            <div>
              <Output label="PV of cash flows" value={money(r.sumPv)} />
              <Output label="Terminal value" value={money(r.terminalValue)} />
              <Output label="PV of terminal value" value={money(r.pvTerminal)} note={`${pct(r.tvShare, 0)} of EV`} />
              <Output label="Enterprise value" value={money(r.enterpriseValue)} />
            </div>
            <div>
              <Output label="Less net debt" value={money(-i.netDebt)} />
              <Output label="Equity value" value={money(r.equityValue)} />
              <Output label="Value per share" value={money(r.perShare, 2)} strong />
              <Output
                label={gordon ? 'Implied exit multiple' : 'Implied perpetual growth'}
                value={gordon ? mult(r.impliedCheck) : pct(r.impliedCheck)}
                note="sanity check"
              />
            </div>
          </div>
        </Card>
        <ProjectionTable
          headers={['', ...r.rows.map((x) => `Year ${x.year}`)]}
          rows={[
            ['Revenue', r.rows.map((x) => x.revenue)],
            ['EBITDA', r.rows.map((x) => x.ebitda)],
            ['Less taxes on EBIT', r.rows.map((x) => -x.taxes)],
            ['Less capex', r.rows.map((x) => -x.capex)],
            ['Less ΔNWC', r.rows.map((x) => -x.nwc)],
            ['Unlevered FCF', r.rows.map((x) => x.ufcf), true],
            ['PV of FCF', r.rows.map((x) => x.pv)],
          ]}
        />
        <SensitivityTable
          title="Value per share"
          rowLabel="WACC"
          colLabel={gordon ? 'terminal growth' : 'exit multiple'}
          rows={waccs.map((w) => pct(w))}
          cols={drivers.map((d) => (gordon ? pct(d) : mult(d)))}
          values={grid}
          format={(v) => money(v, 2)}
          baseRow={2}
          baseCol={2}
        />
      </div>
    </div>
  );
}

// ───────────────────────────── Accretion / dilution ─────────────────────────────

const AD_DEFAULT: AccretionInputs = {
  acquirerPrice: 50,
  acquirerShares: 200,
  acquirerNetIncome: 500,
  targetNetIncome: 60,
  purchasePrice: 1000,
  pctCash: 0.3,
  pctDebt: 0.3,
  pctStock: 0.4,
  debtRate: 0.07,
  cashRate: 0.03,
  taxRate: 0.25,
  synergies: 20,
};

function AccretionBuilder() {
  const [i, setI] = useState(AD_DEFAULT);
  const set = <K extends keyof AccretionInputs>(k: K, v: AccretionInputs[K]) => setI((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => runAccretion(i), [i]);
  const mix = i.pctCash + i.pctDebt + i.pctStock;
  const stockShare = round(i.pctStock / (mix || 1), 4);
  const stockPcts = [...new Set([0, 0.25, 0.5, 0.75, 1, stockShare])].sort((a, b) => a - b);
  const prices = around(i.purchasePrice, round(i.purchasePrice * 0.1, 0));
  const grid = useMemo(() => accretionSensitivity(i, stockPcts, prices), [i]);
  const acquirerPe = r.standaloneEps > 0 ? i.acquirerPrice / r.standaloneEps : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <Card>
        <InputGroup title="Acquirer">
          <NumberField label="Share price" value={i.acquirerPrice} onChange={(v) => set('acquirerPrice', v)} suffix="$" />
          <NumberField label="Diluted shares" value={i.acquirerShares} onChange={(v) => set('acquirerShares', v)} />
          <NumberField label="Net income" value={i.acquirerNetIncome} onChange={(v) => set('acquirerNetIncome', v)} suffix="$" />
          <NumberField label="Tax rate" value={i.taxRate} onChange={(v) => set('taxRate', v)} percent />
        </InputGroup>
        <InputGroup title="Target and price">
          <NumberField label="Target net income" value={i.targetNetIncome} onChange={(v) => set('targetNetIncome', v)} suffix="$" />
          <NumberField label="Equity purchase price" value={i.purchasePrice} onChange={(v) => set('purchasePrice', v)} suffix="$" />
          <NumberField label="Pre-tax synergies" value={i.synergies} onChange={(v) => set('synergies', v)} suffix="$" />
        </InputGroup>
        <InputGroup title="Consideration">
          <NumberField label="% cash" value={i.pctCash} onChange={(v) => set('pctCash', v)} percent />
          <NumberField label="% new debt" value={i.pctDebt} onChange={(v) => set('pctDebt', v)} percent />
          <NumberField label="% stock" value={i.pctStock} onChange={(v) => set('pctStock', v)} percent />
          <NumberField label="Interest on debt" value={i.debtRate} onChange={(v) => set('debtRate', v)} percent />
          <NumberField label="Interest on cash" value={i.cashRate} onChange={(v) => set('cashRate', v)} percent hint="Forgone when cash is used" />
        </InputGroup>
        {Math.abs(mix - 1) > 1e-6 && <p className="text-xs text-warn">The mix adds to {pct(mix, 0)}; it’s scaled to 100%.</p>}
        <Button variant="ghost" className="mt-3" onClick={() => setI(AD_DEFAULT)}>
          <RotateCcw size={14} /> Reset
        </Button>
      </Card>
      <div className="space-y-4">
        <Card>
          <div className="grid gap-x-8 sm:grid-cols-2">
            <div>
              <Output label="New shares issued" value={round(r.newShares, 2).toLocaleString()} />
              <Output label="After-tax interest on new debt" value={money(-r.afterTaxInterest)} />
              <Output label="After-tax interest forgone on cash" value={money(-r.forgoneInterest)} />
              <Output label="After-tax synergies" value={money(r.afterTaxSynergies)} />
              <Output label="Pro forma net income" value={money(r.proFormaNetIncome)} />
            </div>
            <div>
              <Output label="Standalone EPS" value={money(r.standaloneEps, 2)} />
              <Output label="Pro forma EPS" value={money(r.proFormaEps, 2)} />
              <Output label={r.accretion >= 0 ? 'Accretion' : 'Dilution'} value={pct(r.accretion, 1)} strong />
              <Output label="Breakeven pre-tax synergies" value={r.breakevenSynergies > 0 ? money(r.breakevenSynergies) : 'Already accretive'} />
            </div>
          </div>
        </Card>
        <Card>
          <h3 className="mb-2 text-sm font-semibold">Cost of each currency vs what you’re buying</h3>
          <p className="mb-3 text-xs text-muted">
            The shortcut: if the weighted after-tax cost of the funding is below the target’s earnings yield (net income / price), the deal is accretive before synergies.
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <Stat label="Cash (after tax)" value={pct(r.costs.cash, 2)} />
            <Stat label="Debt (after tax)" value={pct(r.costs.debt, 2)} />
            <Stat label="Stock (1 / P/E)" value={pct(r.costs.stock, 2)} note={`P/E ${acquirerPe.toFixed(1)}x`} />
            <Stat label="Target yield" value={pct(r.costs.targetYield, 2)} note={`P/E ${(1 / (r.costs.targetYield || 1)).toFixed(1)}x paid`} />
          </div>
        </Card>
        <SensitivityTable
          title="Accretion / (dilution)"
          rowLabel="% paid in stock (rest in the current cash : debt ratio)"
          colLabel="equity purchase price"
          rows={stockPcts.map((s) => pct(s, 0))}
          cols={prices.map((p) => money(p, 0))}
          values={grid}
          format={(v) => pct(v, 1)}
          baseRow={stockPcts.indexOf(stockShare)}
          baseCol={2}
        />
      </div>
    </div>
  );
}

// ───────────────────────────── LBO ─────────────────────────────

const LBO_DEFAULT: LboInputs = {
  ebitda0: 100,
  growth: 0.06,
  entryMultiple: 10,
  exitMultiple: 10,
  leverage: 5.5,
  interestRate: 0.08,
  taxRate: 0.25,
  daPct: 0.1,
  capexPct: 0.12,
  nwcPct: 0.1,
  years: 5,
  sweep: 1,
  feesPct: 0.02,
};

function LboBuilder() {
  const [i, setI] = useState(LBO_DEFAULT);
  const set = <K extends keyof LboInputs>(k: K, v: LboInputs[K]) => setI((p) => ({ ...p, [k]: v }));
  const r = useMemo(() => runLbo(i), [i]);
  const entries = around(i.entryMultiple, 1);
  const exits = around(i.exitMultiple, 1);
  const levs = around(i.leverage, 0.5);
  const gridMult = useMemo(() => lboSensitivity(i, 'entryMultiple', entries, 'exitMultiple', exits), [i]);
  const gridLev = useMemo(() => lboSensitivity(i, 'leverage', levs, 'exitMultiple', exits), [i]);

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <Card>
        <InputGroup title="Entry">
          <NumberField label="EBITDA (year 0)" value={i.ebitda0} onChange={(v) => set('ebitda0', v)} suffix="$" />
          <NumberField label="Entry multiple" value={i.entryMultiple} onChange={(v) => set('entryMultiple', v)} suffix="x" />
          <NumberField label="Debt / EBITDA" value={i.leverage} onChange={(v) => set('leverage', v)} suffix="x" />
          <NumberField label="Fees % of EV" value={i.feesPct} onChange={(v) => set('feesPct', v)} percent />
        </InputGroup>
        <InputGroup title="Operations">
          <NumberField label="EBITDA growth" value={i.growth} onChange={(v) => set('growth', v)} percent />
          <NumberField label="Tax rate" value={i.taxRate} onChange={(v) => set('taxRate', v)} percent />
          <NumberField label="D&A % EBITDA" value={i.daPct} onChange={(v) => set('daPct', v)} percent />
          <NumberField label="Capex % EBITDA" value={i.capexPct} onChange={(v) => set('capexPct', v)} percent />
          <NumberField label="ΔNWC % ΔEBITDA" value={i.nwcPct} onChange={(v) => set('nwcPct', v)} percent />
        </InputGroup>
        <InputGroup title="Debt and exit">
          <NumberField label="Interest rate" value={i.interestRate} onChange={(v) => set('interestRate', v)} percent />
          <NumberField label="Cash sweep" value={i.sweep} onChange={(v) => set('sweep', Math.min(1, Math.max(0, v)))} percent />
          <NumberField label="Exit multiple" value={i.exitMultiple} onChange={(v) => set('exitMultiple', v)} suffix="x" />
          <NumberField label="Hold (years)" value={i.years} onChange={(v) => set('years', Math.max(1, Math.min(10, Math.round(v))))} />
        </InputGroup>
        <Button variant="ghost" className="mt-1" onClick={() => setI(LBO_DEFAULT)}>
          <RotateCcw size={14} /> Reset
        </Button>
      </Card>
      <div className="space-y-4">
        <Card>
          {r.error && <p className="mb-2 text-sm text-bad">{r.error}</p>}
          <div className="grid gap-x-8 sm:grid-cols-2">
            <div>
              <Output label="Entry EV" value={money(r.entryEv)} />
              <Output label="Debt raised" value={money(r.debt0)} />
              <Output label="Sponsor equity" value={money(r.equity0)} note={r.entryEv > 0 ? `${pct(r.equity0 / (r.entryEv + r.fees), 0)} incl. fees` : undefined} />
            </div>
            <div>
              <Output label="Exit EV" value={money(r.exitEv)} />
              <Output label="Less net debt at exit" value={money(-r.exitNetDebt)} />
              <Output label="Exit equity" value={money(r.exitEquity)} />
              <Output label="MOIC / IRR" value={r.error ? '—' : `${r.moic.toFixed(2)}x / ${pct(r.irr)}`} strong />
            </div>
          </div>
        </Card>
        <ProjectionTable
          headers={['', ...r.rows.map((x) => `Year ${x.year}`)]}
          rows={[
            ['EBITDA', r.rows.map((x) => x.ebitda)],
            ['Interest', r.rows.map((x) => -x.interest)],
            ['Taxes', r.rows.map((x) => -x.taxes)],
            ['Capex', r.rows.map((x) => -x.capex)],
            ['Free cash flow', r.rows.map((x) => x.fcf), true],
            ['Debt repaid', r.rows.map((x) => x.repayment)],
            ['Debt, end of year', r.rows.map((x) => x.debt)],
            ['Cash, end of year', r.rows.map((x) => x.cash)],
          ]}
        />
        <div className="grid gap-4 2xl:grid-cols-2">
          <SensitivityTable
            title="IRR: entry vs exit multiple"
            rowLabel="entry multiple"
            colLabel="exit multiple"
            rows={entries.map(mult)}
            cols={exits.map(mult)}
            values={gridMult}
            format={(v) => pct(v, 1)}
            baseRow={2}
            baseCol={2}
          />
          <SensitivityTable
            title="IRR: leverage vs exit multiple"
            rowLabel="debt / EBITDA"
            colLabel="exit multiple"
            rows={levs.map(mult)}
            cols={exits.map(mult)}
            values={gridLev}
            format={(v) => pct(v, 1)}
            baseRow={2}
            baseCol={2}
          />
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────── Shared ─────────────────────────────

function ProjectionTable({ headers, rows }: { headers: string[]; rows: [string, number[], boolean?][] }) {
  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm tabular">
          <thead>
            <tr className="text-xs text-faint">
              {headers.map((h, k) => (
                <th key={k} scope="col" className={cx('pb-2 font-medium', k === 0 ? 'text-left' : 'text-right')}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, values, bold]) => (
              <tr key={label} className={cx(bold && 'border-t border-line font-semibold')}>
                <th scope="row" className="py-1 pr-3 text-left font-normal text-muted">
                  {label}
                </th>
                {values.map((v, k) => (
                  <td key={k} className="py-1 text-right">
                    {v < 0 ? `(${Math.abs(v).toFixed(1)})` : v.toFixed(1)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function Toggle({ on, labels, onChange }: { on: boolean; labels: [string, string]; onChange: (v: boolean) => void }) {
  return (
    <div className="inline-flex rounded-md border border-line p-0.5" role="group">
      {labels.map((l, k) => (
        <button
          key={l}
          type="button"
          aria-pressed={on === (k === 0)}
          onClick={() => onChange(k === 0)}
          className={cx('rounded px-2 py-1 transition', on === (k === 0) ? 'bg-accent-soft text-accent' : 'text-muted hover:text-ink')}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-lg border border-line bg-sunk p-2.5">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="mt-0.5 font-semibold tabular">{value}</p>
      {note && <p className="text-[11px] text-faint">{note}</p>}
    </div>
  );
}
