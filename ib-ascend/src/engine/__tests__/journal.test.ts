import { describe, expect, it } from 'vitest';
import { dealModelAnswer, dealPitchRubric, dealValueText, weekOf } from '../journal';
import { matchRubric, scoreRubric } from '../grading/rubric';
import type { DealEntry } from '../../types/models';

const deal: DealEntry = {
  id: 'd',
  acquirer: 'Northwind Corp',
  target: 'Contoso Software',
  valueMm: 12500,
  multiple: '18x EBITDA',
  sector: 'Software',
  announcedOn: '2026-09-15',
  rationale: 'Expands Northwind into recurring subscription revenue and cross-selling',
  myView: 'Sensible strategically but expensive; integration risk is high.',
  createdAt: '',
  updatedAt: '',
};

describe('journal helpers', () => {
  it('formats values and weeks', () => {
    expect(dealValueText(12500)).toBe('$12.5 billion');
    expect(dealValueText(3000)).toBe('$3 billion');
    expect(dealValueText(850)).toBe('$850 million');
    expect(weekOf('2026-10-17')).toBe('2026-10-12');
    expect(weekOf('2026-10-12')).toBe('2026-10-12');
  });

  it('builds a pitch rubric that its own model answer fully satisfies', () => {
    const rubric = dealPitchRubric(deal);
    const answer = dealModelAnswer(deal);
    expect(answer).toContain('Northwind Corp’s acquisition of Contoso Software, for about $12.5 billion');
    expect(scoreRubric(rubric, matchRubric(rubric, answer))).toBe(1);
    expect(scoreRubric(rubric, matchRubric(rubric, 'I am not sure.'))).toBeLessThan(0.5);
  });

  it('falls back to FILL INs for missing fields', () => {
    const a = dealModelAnswer({ ...deal, rationale: '', multiple: '', myView: '', valueMm: null, announcedOn: null });
    expect(a).toContain('[FILL IN: the rationale]');
    expect(a).not.toContain('billion');
  });
});
