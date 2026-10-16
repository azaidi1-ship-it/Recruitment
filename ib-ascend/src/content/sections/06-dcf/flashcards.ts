import type { Flashcard } from '../../../types/models';

export const flashcards: Flashcard[] = [
  { id: 'dcf-fc1', sectionId: 'dcf', subtopic: 'ufcf', front: 'Unlevered FCF formula', back: 'EBIT × (1 − t) + D&A − capex − ΔNWC' },
  { id: 'dcf-fc2', sectionId: 'dcf', subtopic: 'wacc', front: 'WACC formula', back: 'E/V × Ke + D/V × Kd × (1 − t)' },
  { id: 'dcf-fc3', sectionId: 'dcf', subtopic: 'capm-beta', front: 'CAPM', back: 'Ke = Rf + β × ERP' },
  { id: 'dcf-fc4', sectionId: 'dcf', subtopic: 'capm-beta', front: 'Unlever beta', back: 'βu = βL / (1 + (1 − t) × D/E)' },
  { id: 'dcf-fc5', sectionId: 'dcf', subtopic: 'terminal-value', front: 'Gordon growth terminal value', back: 'FCF × (1 + g) / (WACC − g)' },
  { id: 'dcf-fc6', sectionId: 'dcf', subtopic: 'terminal-value', front: 'Implied growth from an exit-multiple TV', back: 'g = (TV × WACC − FCF) / (TV + FCF)' },
  { id: 'dcf-fc7', sectionId: 'dcf', subtopic: 'mid-year', front: 'Mid-year convention', back: 'Discount at t − 0.5: assumes cash flows arrive evenly; raises value.' },
  { id: 'dcf-fc8', sectionId: 'dcf', subtopic: 'sensitivity', front: 'Company has NOLs: DCF treatment', back: 'Lower cash taxes as NOLs are used, or add the PV of the tax savings.' },
];
