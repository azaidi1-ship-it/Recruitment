import type { DealEntry, ISODate } from '../types/models';
import type { RubricPoint } from '../types/questions';
import { addDays, parseLocalDate } from '../lib/dates';

/** Monday of the week containing the date. */
export function weekOf(date: ISODate): ISODate {
  const dow = (parseLocalDate(date).getDay() + 6) % 7;
  return addDays(date, -dow);
}

export function dealValueText(valueMm: number | null): string {
  if (valueMm === null) return '';
  return valueMm >= 1000 ? `$${(valueMm / 1000).toFixed(valueMm % 1000 === 0 ? 0 : 1)} billion` : `$${valueMm.toLocaleString('en-US')} million`;
}

const STOP = new Set(['because', 'should', 'would', 'their', 'there', 'which', 'about', 'company', 'companies', 'business']);

function stems(text: string, n: number): string[] {
  const words = text
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 6 && !STOP.has(w));
  return [...new Set(words.map((w) => `${w.slice(0, Math.max(5, w.length - 3))}*`))].slice(0, n);
}

/** Rubric for "Tell me about a deal you've followed", built from your own journal entry. */
export function dealPitchRubric(d: DealEntry): RubricPoint[] {
  const names = [d.acquirer, d.target].map((s) => s.toLowerCase().replace(/[’']/g, '').split(/\s+/)[0]).filter(Boolean);
  const rationale = stems(d.rationale, 5);
  const view = stems(d.myView, 4);
  return [
    { id: 'facts', point: `The facts: ${d.acquirer} buying ${d.target}${d.valueMm ? ` for ${dealValueText(d.valueMm)}` : ''}`, keywords: [[names.join('|') || 'acquir*'], ['billion|million|value*|price*|paid|bn|mm']], weight: 1 },
    { id: 'rationale', point: 'The strategic rationale', keywords: [[['rationale', 'strategic', 'synerg*', ...rationale].join('|')]], weight: 1 },
    { id: 'valuation', point: d.multiple ? `The valuation (${d.multiple})` : 'The valuation: multiple or premium', keywords: [['multiple|premium|ebitda|revenue|x|times|valuation']], weight: 1 },
    { id: 'view', point: 'Your view and the main risk', keywords: [[['i think', 'my view', 'risk*', ...view].join('|')]], weight: 1 },
  ];
}

/** A model answer in the deal-pitch structure, filled from the entry. */
export function dealModelAnswer(d: DealEntry): string {
  return [
    `One deal I’ve been following is ${d.acquirer}’s acquisition of ${d.target}${d.valueMm ? `, for about ${dealValueText(d.valueMm)}` : ''}${d.announcedOn ? `, announced ${parseLocalDate(d.announcedOn).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}.`,
    d.rationale ? `The strategic rationale is ${d.rationale.replace(/\.$/, '').replace(/^./, (c) => c.toLowerCase())}.` : 'The strategic rationale is [FILL IN: the rationale].',
    d.multiple ? `It was valued at ${d.multiple}, which I’d compare with [FILL IN: recent deals in ${d.sector || 'the sector'}].` : 'On valuation, [FILL IN: the multiple paid and how it compares].',
    d.myView ? `My view: ${d.myView.replace(/\.$/, '')}. The main risk is [FILL IN: integration, regulatory or financing risk].` : 'I think [FILL IN: your view], and the main risk is [FILL IN: the risk].',
  ].join(' ');
}
