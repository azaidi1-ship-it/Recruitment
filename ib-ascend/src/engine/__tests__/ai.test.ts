import { describe, expect, it } from 'vitest';
import { PERSONAS } from '../../content/superday/personas';
import { SEED_RESUME } from '../../content/resume/resume';
import {
  AI_ANSWER_BUDGET_MS,
  DEFAULT_MODEL,
  INTERVIEW_DONE,
  LLM_MODELS,
  aiScorecard,
  applyGrade,
  gradeRequestText,
  interviewerSystem,
  resumeBrief,
  scoreRequestText,
  transcriptText,
  type Turn,
} from '../ai';
import { SUPERDAY_FLOOR } from '../superday';

const rubric = [
  { id: 'a', point: 'Says EBITDA excludes D&A' },
  { id: 'b', point: 'Mentions capital structure neutrality' },
];

describe('grading helpers', () => {
  it('lists the default model first', () => {
    expect(LLM_MODELS[0].id).toBe(DEFAULT_MODEL);
  });

  it('puts the question, every rubric id, the reference and the answer in the request', () => {
    const text = gradeRequestText({ prompt: 'Why EV/EBITDA?', rubric, modelAnswer: 'Because…', answer: 'My answer', context: 'Extra' });
    expect(text).toContain('<question>\nWhy EV/EBITDA?');
    expect(text).toContain('id: a | Says EBITDA excludes D&A');
    expect(text).toContain('id: b |');
    expect(text).toContain('<reference_answer>');
    expect(text).toContain('<context>\nExtra');
    expect(text.indexOf('<candidate_answer>')).toBeGreaterThan(text.indexOf('<rubric>'));
  });

  it('omits the optional reference and context when absent', () => {
    const text = gradeRequestText({ prompt: 'Q', rubric, answer: 'A' });
    expect(text).not.toContain('<reference_answer>');
    expect(text).not.toContain('<context>');
  });

  it('keeps only known rubric ids, de-duplicates hits and trims feedback', () => {
    const g = applyGrade(rubric, {
      points: [
        { id: 'a', met: true, note: 'Got it' },
        { id: 'a', met: true, note: 'Again' },
        { id: 'b', met: false, note: 'Missing' },
        { id: 'zzz', met: true, note: 'Invented' },
      ],
      feedback: '  Lead with the answer.  ',
    });
    expect(g.hits).toEqual(['a']);
    expect(g.notes).toEqual({ a: 'Again', b: 'Missing' });
    expect(g.feedback).toBe('Lead with the answer.');
  });

  it('treats rubric points Claude skipped as not met', () => {
    expect(applyGrade(rubric, { points: [], feedback: '' }).hits).toEqual([]);
  });
});

describe('interviewer prompt', () => {
  const persona = PERSONAS[0]!;
  const sys = interviewerSystem({ persona, minutes: 25, topics: ['DCF', 'LBO'], resume: SEED_RESUME, storyTitles: ['Story one', 'Story two'] });

  it('includes the persona, topics, stories, end marker and the full resume', () => {
    expect(sys).toContain(persona.description);
    expect(sys).toContain(persona.openers.mixed);
    expect(sys).toContain('DCF, LBO');
    expect(sys).toContain('Story one; Story two');
    expect(sys).toContain(INTERVIEW_DONE);
    expect(sys).toContain('25-minute');
    for (const item of SEED_RESUME.items) {
      expect(sys).toContain(item.org);
      for (const b of item.bullets) expect(sys).toContain(b);
    }
  });

  it('scales the question count with length but never below six', () => {
    expect(sys).toContain('After about 10 questions');
    expect(interviewerSystem({ persona, minutes: 10, topics: [], resume: SEED_RESUME, storyTitles: [] })).toContain('After about 6 questions');
  });

  it('says so when no stories are prepared', () => {
    expect(interviewerSystem({ persona, minutes: 10, topics: [], resume: SEED_RESUME, storyTitles: [] })).toContain('none listed');
  });

  it('only states facts from the resume', () => {
    const brief = resumeBrief(SEED_RESUME);
    expect(brief.startsWith(`Candidate: ${SEED_RESUME.name}`)).toBe(true);
    expect(brief).not.toMatch(/\[FILL IN/);
  });
});

describe('transcript and scorecard', () => {
  const turns: Turn[] = [
    { role: 'interviewer', text: 'Walk me through a DCF.' },
    { role: 'candidate', text: 'Project free cash flow…', ms: 60_000 },
    { role: 'interviewer', text: 'Thanks for your time. ' + INTERVIEW_DONE },
  ];

  it('labels speakers and strips the end marker', () => {
    const t = transcriptText(turns);
    expect(t).toBe('INTERVIEWER: Walk me through a DCF.\n\nCANDIDATE: Project free cash flow…\n\nINTERVIEWER: Thanks for your time.');
    expect(scoreRequestText('Deep technicals', t)).toContain('<transcript>\nINTERVIEWER:');
  });

  const persona = { weights: { technical: 0.5, structure: 0.2, speed: 0.1, story: 0.2 }, bar: 0.75 };

  it('maps 0–100 scores to 0–1, measures speed locally and weights by persona', () => {
    const sc = aiScorecard({ technical_accuracy: 90, structure: 80, story_quality: 70, would_advance: true }, turns, persona);
    expect(sc.categories).toEqual({ technical: 0.9, structure: 0.8, speed: 1, story: 0.7 });
    expect(sc.overall).toBeCloseTo(0.5 * 0.9 + 0.2 * 0.8 + 0.1 * 1 + 0.2 * 0.7);
    expect(sc.wouldAdvance).toBe(true);
    expect(sc.rounds).toEqual([{ index: 0, kind: 'mixed', score: sc.overall, answered: 1, total: 1 }]);
    expect(sc.strongest).toBe('speed');
    expect(sc.weakest).toBe('story');
  });

  it('drops categories Claude marks as not tested from the weighting', () => {
    const sc = aiScorecard({ technical_accuracy: 80, structure: 80, story_quality: null, would_advance: true }, turns, persona);
    expect(sc.categories.story).toBeNull();
    expect(sc.overall).toBeCloseTo((0.5 * 0.8 + 0.2 * 0.8 + 0.1 * 1) / 0.8);
  });

  it('penalizes slow answers', () => {
    const slow: Turn[] = [turns[0]!, { ...turns[1]!, ms: AI_ANSWER_BUDGET_MS * 2 }];
    expect(aiScorecard({ technical_accuracy: 80, structure: 80, story_quality: 80, would_advance: true }, slow, persona).categories.speed).toBe(0.5);
  });

  it('clamps out-of-range scores', () => {
    const sc = aiScorecard({ technical_accuracy: 140, structure: -5, story_quality: 50, would_advance: false }, turns, persona);
    expect(sc.categories.technical).toBe(1);
    expect(sc.categories.structure).toBe(0);
  });

  it('needs the interviewer’s own call as well as the numbers', () => {
    const sc = aiScorecard({ technical_accuracy: 100, structure: 100, story_quality: 100, would_advance: false }, turns, persona);
    expect(sc.overall).toBe(1);
    expect(sc.wouldAdvance).toBe(false);
    expect(sc.reasons.at(-1)).toContain('would not advance');
  });

  it('applies the same one-weak-spot floor as the offline Superday, whatever Claude says', () => {
    const weak = (SUPERDAY_FLOOR - 0.1) * 100;
    const sc = aiScorecard({ technical_accuracy: 100, structure: 100, story_quality: weak, would_advance: true }, turns, { ...persona, bar: 0.5 });
    expect(sc.overall).toBeGreaterThan(0.5);
    expect(sc.wouldAdvance).toBe(false);
    expect(sc.reasons.some((r) => r.includes('red flag'))).toBe(true);
    expect(sc.reasons.at(-1)).toContain('would advance');
  });

  it('never advances an interview with no answers', () => {
    const sc = aiScorecard({ technical_accuracy: null, structure: null, story_quality: null, would_advance: true }, [turns[0]!], persona);
    expect(sc.wouldAdvance).toBe(false);
    expect(sc.overall).toBe(0);
    expect(sc.categories.speed).toBeNull();
  });
});
