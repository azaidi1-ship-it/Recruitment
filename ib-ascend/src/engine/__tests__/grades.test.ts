import { describe, expect, it } from 'vitest';
import { sectionGrade } from '../grades';

describe('sectionGrade', () => {
  it('is null without mocks', () => {
    expect(sectionGrade([]).grade).toBeNull();
  });
  it('needs 3 consistent mocks for S', () => {
    expect(sectionGrade([0.95, 0.95, 0.95]).grade).toBe('S');
    expect(sectionGrade([0.95, 0.95]).grade).toBe('A');
  });
  it('rewards consistency, not one lucky run: 0.6 × 0.9 + 0.4 × 0.7 = 0.82 → B', () => {
    const r = sectionGrade([0.5, 0.9]);
    expect(r.composite).toBeCloseTo(0.82);
    expect(r.grade).toBe('B');
  });
  it('maps single scores onto the F–A bands', () => {
    expect(sectionGrade([0.86]).grade).toBe('A');
    expect(sectionGrade([0.75]).grade).toBe('B');
    expect(sectionGrade([0.7]).grade).toBe('C');
    expect(sectionGrade([0.6]).grade).toBe('D');
    expect(sectionGrade([0.3]).grade).toBe('F');
  });
});
