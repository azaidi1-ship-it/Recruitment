import type { Resume, ResumeItem } from '../../types/models';
import type { FreeTextQuestion } from '../../types/questions';
import type { CandidateBackstory } from '../resume/backstory';

/**
 * Resume probes: "Your resume says X. What exactly was your role?" One per
 * bullet on experience, project and leadership items. Generated from the
 * resume so they follow re-imports. Model answers use the resume text, the
 * confirmed notes and, when given, the candidate backstory's detail for that
 * bullet; anything still missing is a [your detail] placeholder.
 */

const PROBED: ResumeItem['category'][] = ['experience', 'project', 'leadership'];
const STOP = new Set(['across', 'including', 'through', 'within', 'during', 'between', 'students', 'clients', 'projects', 'present']);

export function shortOrg(org: string): string {
  return org.split(/ — |, /)[0]!.trim();
}

/** "Built the model…" → "I built the model…"; passive openers keep their sense. */
export function firstPerson(bullet: string): string {
  const b = bullet.trim().replace(/\.$/, '');
  if (/^(Selected|Awarded|Chosen|Invited|Asked)\b/.test(b)) return `I was ${b[0]!.toLowerCase()}${b.slice(1)}.`;
  return `I ${b[0]!.toLowerCase()}${b.slice(1)}.`;
}

/** Up to four distinctive word stems from the bullet, for the "specifics" rubric point. */
export function detailStems(bullet: string): string[] {
  const words = bullet
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 6 && !STOP.has(w));
  const stems = [...new Set(words.map((w) => `${w.slice(0, Math.max(5, w.length - 3))}*`))];
  return stems.slice(0, 4);
}

export function resumeProbes(resume: Resume, backstory?: Pick<CandidateBackstory, 'probes'>): FreeTextQuestion[] {
  const out: FreeTextQuestion[] = [];
  for (const item of resume.items) {
    if (!PROBED.includes(item.category)) continue;
    const org = shortOrg(item.org);
    item.bullets.forEach((bullet, i) => {
      const stems = detailStems(bullet);
      if (stems.length === 0) return;
      const confirmed = (item.confirmedNotes ?? []).join(' ');
      const detail = backstory?.probes?.[`${item.id}-${i + 1}`];
      out.push({
        id: `probe-${item.id}-${i + 1}`,
        sectionId: 'fit',
        subtopic: 'resume-walkthrough',
        difficulty: 'intermediate',
        pools: ['mock'],
        tags: ['resume-probe', item.id],
        type: 'freeText',
        prompt: `Your resume says: “${bullet.trim().replace(/\.$/, '')}” (${item.role}, ${org}). What exactly was your role, and what did you do yourself?`,
        rubric: [
          { id: 'role', point: 'States your role and what you personally owned, in the first person', keywords: [['my role|i was responsible|i owned|i personally']], weight: 1 },
          { id: 'specifics', point: 'Explains how: the method, tools or numbers', keywords: [[stems.join('|')]], weight: 1 },
          { id: 'result', point: 'Gives the result or outcome', keywords: [['result*|outcome|led to|closed|which meant']], weight: 1 },
          { id: 'learning', point: 'Says what you learned and why it matters for banking', keywords: [['learn*|taught me|bank*']], weight: 1 },
        ],
        modelAnswer: [
          `My role was ${item.role} at ${org}.`,
          firstPerson(bullet),
          detail?.how ?? '[your detail: the specific steps you took yourself and the tools you used]',
          detail?.result
            ? `The result was ${detail.result}`
            : confirmed
              ? `The result was this: ${confirmed}`
              : 'The result was [your detail: the outcome, ideally with a number].',
          detail
            ? `What I learned is ${detail.learned}, and it matters in banking because ${detail.whyBanking}.`
            : 'What I learned is [your detail], and it matters in banking because [your detail].',
        ].join(' '),
        targetSeconds: 60,
        explanation: 'Interviewers probe resume bullets to check you did the work. Use “I”, explain how, give the result, and link it to banking.',
      });
    });
  }
  return out;
}
