import { describe, expect, it } from 'vitest';
import { SEED_RESUME } from '../../content/resume/resume';
import { SEED_RESUME_TEXT } from '../../content/resume/resumeText';
import { CANDIDATE_BACKSTORY } from '../../content/resume/backstory';
import { seedStories } from '../../content/stories/seedStories';
import { coverageMatrix, dateKey, diffResume, draftStoryForItem, parseResumeText, resumeWalkthrough, whyFirm, whyIb } from '../storyBank';

const stories = seedStories('2026-10-17T00:00:00.000Z');
const words = (s: string) => s.split(/\s+/).length;

describe('coverage matrix', () => {
  it('lists stories per competency and flags gaps with suggestions from other resume items', () => {
    const rows = coverageMatrix(stories, SEED_RESUME);
    expect(rows).toHaveLength(15);
    for (const r of rows) {
      expect(r.gap).toBe(r.stories.length < 2);
      for (const s of r.suggestions) expect(r.stories.some((x) => x.resumeItemId === s.itemId)).toBe(false);
    }
    const ethics = rows.find((r) => r.competency.id === 'ethics')!;
    expect(ethics.gap).toBe(true);
    expect(ethics.suggestions.length).toBeGreaterThan(0);
  });

  it('closes a gap once a second story covers it', () => {
    const extra = { ...stories[0]!, id: 'x', resumeItemId: 'exp-clarus', competencies: ['ethics' as const, 'detail' as const] };
    const ethics = coverageMatrix([...stories, extra], SEED_RESUME).find((r) => r.competency.id === 'ethics')!;
    expect(ethics.gap).toBe(false);
  });
});

describe('generated answers', () => {
  it('builds 60-second and 2-minute walkthroughs from the resume', () => {
    const short = resumeWalkthrough(SEED_RESUME, '60s');
    const long = resumeWalkthrough(SEED_RESUME, '2min');
    expect(words(short)).toBeGreaterThanOrEqual(90);
    expect(words(short)).toBeLessThanOrEqual(175);
    expect(words(long)).toBeGreaterThan(words(short));
    expect(words(long)).toBeLessThanOrEqual(330);
    expect(short).toContain('Ayah Apparel');
    expect(short).toContain('Stratus Labs');
    expect(short).toContain('$250K pre-seed raise. That raise closed.');
    expect(long).toContain('I went to school in Dubai, at Dubai College.');
    expect(short).toMatch(/investment banking/);
    // Where the interest in finance started is the candidate's to say, never asserted.
    for (const t of [short, long]) {
      expect(t).toContain('[FILL IN: What first got you interested in finance?]');
      expect(t).not.toMatch(/grew up|interest in finance started|hooked/);
    }
  });

  it('says where the interest in finance started when the candidate backstory supplies it', () => {
    const facts = { origin: 'My interest started with a research project', sparkLesson: 'it showed me numbers drive decisions.' };
    for (const len of ['60s', '2min'] as const) {
      const t = resumeWalkthrough(SEED_RESUME, len, facts);
      expect(t).toContain('My interest started with a research project. At Ayah Apparel,');
      expect(t).toContain(', and it showed me numbers drive decisions.');
      expect(t).not.toContain('[FILL IN');
    }
    const ib = whyIb(SEED_RESUME, facts);
    expect(ib.startsWith('My interest started with a research project. At Ayah Apparel I launched')).toBe(true);
    expect(ib).not.toContain('[FILL IN');
    // The seed candidate's own backstory keeps both walkthroughs inside their word budgets.
    const short = resumeWalkthrough(SEED_RESUME, '60s', CANDIDATE_BACKSTORY);
    const long = resumeWalkthrough(SEED_RESUME, '2min', CANDIDATE_BACKSTORY);
    expect(short).toContain(CANDIDATE_BACKSTORY.origin!);
    expect(words(short)).toBeLessThanOrEqual(175);
    expect(words(long)).toBeLessThanOrEqual(330);
    expect(whyIb(SEED_RESUME, CANDIDATE_BACKSTORY)).not.toContain('[FILL IN');
  });

  it('falls back to FILL INs when the backstory is empty', () => {
    expect(resumeWalkthrough(SEED_RESUME, '60s', { origin: '  ' })).toBe(resumeWalkthrough(SEED_RESUME, '60s'));
    expect(whyIb(SEED_RESUME, {})).toBe(whyIb(SEED_RESUME));
    expect(whyIb(SEED_RESUME, {})).toContain('[FILL IN: what that experience showed you about finance]');
  });

  it('writes Why IB and Why [firm] drafts, with FILL INs where data is missing', () => {
    const ib = whyIb(SEED_RESUME);
    expect(ib).toMatch(/Since then I’ve tested that interest/);
    expect(ib).toContain('[FILL IN: What first got you interested in finance?]');
    expect(ib).not.toMatch(/realized|first got interested when/);
    const blank = whyFirm({ name: 'Evercore', tier: 'elite-boutique', focusAreas: ['M&A advisory'], contacts: [], researchedDeals: [] }, [], SEED_RESUME);
    expect(blank).toContain('[FILL IN: a recent deal');
    const full = whyFirm(
      { name: 'Evercore', tier: 'elite-boutique', focusAreas: ['Restructuring'], contacts: [{ id: 'c', name: 'Sam Lee', role: 'Associate', date: null, notes: 'Analysts get client time early.' }], researchedDeals: ['d1'] },
      [{ id: 'd1', acquirer: 'A Corp', target: 'B Inc' }],
      SEED_RESUME,
    );
    expect(full).toContain('A Corp’s deal for B Inc');
    expect(full).toContain('I spoke with Sam Lee (Associate)');
    expect(full).not.toContain('[FILL IN: someone at the firm]');
  });

  it('orders resume dates', () => {
    expect(dateKey('Oct 2025')).toBeGreaterThan(dateKey('Dec 2023'));
    expect(dateKey('Present')).toBeGreaterThan(dateKey('Dec 2030'));
  });
});

describe('resume re-import', () => {
  const parsed = parseResumeText(SEED_RESUME_TEXT);

  it('parses the seed resume text back into its items', () => {
    const scope = SEED_RESUME.items.filter((i) => ['experience', 'project', 'leadership'].includes(i.category));
    expect(parsed).toHaveLength(scope.length);
    const stratus = parsed.find((p) => p.org.startsWith('Stratus Labs'))!;
    expect(stratus).toMatchObject({ role: 'Advisor & Analyst', start: 'Oct 2025', end: 'Dec 2025', category: 'experience' });
    expect(stratus.bullets).toHaveLength(2);
    const lumiere = parsed.find((p) => p.org.startsWith('Lumiere'))!;
    expect(lumiere).toMatchObject({ start: 'Jun 2023', end: 'Sep 2023', category: 'project' });
    expect(parsed.find((p) => p.org.startsWith('180 Degrees'))!.bullets[0]).toBe(SEED_RESUME.items.find((i) => i.id === 'exp-180dc')!.bullets[0]);
  });

  it('reports no changes for the same resume', () => {
    const d = diffResume(SEED_RESUME, parsed);
    expect(d.added).toHaveLength(0);
    expect(d.removed).toHaveLength(0);
    expect(d.changed).toHaveLength(0);
  });

  it('finds added, changed and removed items', () => {
    const text = SEED_RESUME_TEXT.replace(
      'EXPERIENCE\n',
      'EXPERIENCE\nSummer Analyst | Example Partners, New York, NY\nJun 2027 – Aug 2027\n• Built merger models for two sell-side processes\n',
    )
      .replace('five recurring clients', 'six recurring clients')
      .replace(/Member \| Computer Science Society[\s\S]*?research\n/, '');
    const d = diffResume(SEED_RESUME, parseResumeText(text));
    expect(d.added.map((a) => a.org)).toEqual(['Example Partners, New York, NY']);
    expect(d.changed.map((c) => c.old.id)).toEqual(['exp-fitness']);
    expect(d.removed.map((r) => r.id)).toEqual(['lead-cs-society']);
  });

  it('drafts a story for a new item with only resume facts and FILL INs', () => {
    const item = { id: 'exp-example', category: 'experience' as const, role: 'Summer Analyst', org: 'Example Partners, New York, NY', start: 'Jun 2027', end: 'Aug 2027', bullets: ['Built merger models for two sell-side processes'] };
    const s = draftStoryForItem(item, '2026-10-17T00:00:00Z', 'st-new');
    expect(s.action).toContain('I built merger models for two sell-side processes.');
    expect(s.fillIns.length).toBeGreaterThanOrEqual(5);
    expect(s.needsRewrite).toBe(true);
    expect(s.competencies).toContain('analytical');
  });
});
