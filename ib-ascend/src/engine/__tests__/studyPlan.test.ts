import { describe, expect, it } from 'vitest';
import { studyPlan } from '../studyPlan';
import type { CalendarEvent } from '../../types/models';

const ev = (date: string, kind: CalendarEvent['kind'], title = 'X', firmId: string | null = null): CalendarEvent => ({ id: `${date}-${kind}`, title, kind, date, firmId, notes: '', createdAt: '' });
const today = '2026-10-17';

describe('studyPlan', () => {
  it('uses the base load with nothing scheduled', () => {
    expect(studyPlan([], today, 60)).toMatchObject({ minutes: 60, phase: 'normal', next: null });
  });

  it('ramps up as the next interview approaches, then tapers', () => {
    expect(studyPlan([ev('2026-11-20', 'interview')], today, 60)).toMatchObject({ phase: 'build', minutes: 75 });
    expect(studyPlan([ev('2026-11-01', 'interview')], today, 60)).toMatchObject({ phase: 'ramp', minutes: 90 });
    expect(studyPlan([ev('2026-10-22', 'superday', 'S', 'evercore')], today, 60, () => 'Evercore')).toMatchObject({ phase: 'final-week', minutes: 120 });
    const taper = studyPlan([ev('2026-10-18', 'interview', 'I', 'pjt')], today, 60, () => 'PJT Partners');
    expect(taper).toMatchObject({ phase: 'taper', minutes: 30 });
    expect(taper.focus.join(' ')).toContain('Why PJT Partners');
    expect(taper.next!.daysLeft).toBe(1);
  });

  it('never lowers a larger base load except in the taper', () => {
    expect(studyPlan([ev('2026-11-01', 'interview')], today, 150).minutes).toBe(150);
  });

  it('ignores past events and surfaces deadlines within a week', () => {
    const p = studyPlan([ev('2026-10-01', 'interview'), ev('2026-10-20', 'deadline', 'Moelis application'), ev('2026-12-20', 'deadline', 'Later')], today, 60);
    expect(p.next).toBeNull();
    expect(p.deadlines.map((d) => d.event.title)).toEqual(['Moelis application']);
    expect(p.focus[0]).toBe('Submit: Moelis application (in 3 days)');
  });
});
