import type { CheatSheet } from '../../../types/models';

export const cheatSheet: CheatSheet = {
  sectionId: 'walkthroughs',
  blocks: [
    {
      kind: 'formula',
      title: 'The answer order',
      lines: ['1. Tax rate', '2. IS: pre-tax → tax → NI', '3. CFS: NI → non-cash → WC → CFI → CFF → Δcash', '4. BS: cash + affected lines', '5. Assets = L + E'],
    },
    {
      kind: 'table',
      headers: ['Event (25% tax)', 'NI', 'Cash', 'BS'],
      rows: [
        ['D&A +10', '−7.5', '+2.5', 'PP&E −10, RE −7.5'],
        ['Inventory write-down 40', '−30', '+10', 'Inventory −40, RE −30'],
        ['SBC 20', '−15', '+5', 'APIC +20, RE −15'],
        ['Impairment 100 (deductible)', '−75', '+25', 'Goodwill −100, RE −75'],
        ['Impairment 100 (not deductible)', '−100', '0', 'Goodwill −100, RE −100'],
        ['Interest +10 (cash)', '−7.5', '−7.5', 'RE −7.5'],
        ['Dividend 30', '0', '−30', 'RE −30'],
        ['Buyback 50', '0', '−50', 'Treasury stock −50'],
        ['PP&E 100 with debt', '0', '0', 'PP&E +100, debt +100'],
      ],
    },
    {
      kind: 'formula',
      title: 'Rules',
      lines: ['Non-cash deductible expense X → cash +X·t', 'Asset sale: −gain in CFO, +proceeds in CFI', 'Principal: CFF only, never IS', 'Book tax = cash tax + deferred tax'],
    },
    {
      kind: 'trap',
      title: 'Common mistakes',
      text: 'Saying cash falls when D&A rises. Treating dividends or principal as expenses. Forgetting to remove a gain from CFO. Putting buybacks in retained earnings. Forgetting the tax assumption on impairments and SBC.',
    },
  ],
};
