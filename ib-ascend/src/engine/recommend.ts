import { DASHBOARD } from '../config/gameConfig';
import type { Grade } from '../config/gameConfig';
import type { Section, SectionId, SectionProgress } from '../types/models';
import type { WeakSubtopic } from './analytics';

export interface NextAction {
  kind: 'review' | 'read' | 'postQuiz' | 'mock' | 'mistakes' | 'drill' | 'preQuiz' | 'retakeMock' | 'hirevue';
  title: string;
  detail: string;
  /** Hash-router path. */
  to: string;
  cta: string;
}

export interface NextActionInput {
  sections: Pick<Section, 'id' | 'shortTitle' | 'title'>[];
  unlocked: SectionId[];
  progress: Record<SectionId, SectionProgress>;
  /** Lesson ids in reading order, per section; sections without content are skipped. */
  lessonIds: Record<SectionId, string[]>;
  hasQuestions: Record<SectionId, boolean>;
  cardsDue: number;
  mistakesBySection: Partial<Record<SectionId, number>>;
  weakest: WeakSubtopic | null;
  grades: Record<SectionId, Grade | null>;
}

const GOOD_GRADES: Grade[] = ['S', 'A'];

/**
 * One recommendation, in priority order: a big review backlog, finishing the
 * section in progress, its Boss Fight, the rest of the review queue, a pile
 * of mistakes, the weakest subtopic, the next section, then mock retakes.
 */
export function nextBestAction(i: NextActionInput): NextAction {
  const open = i.sections.filter((s) => i.unlocked.includes(s.id) && i.hasQuestions[s.id]);
  const started = (p: SectionProgress) => p.preQuizScore !== null || p.lessonsRead.length > 0 || p.postQuizBest !== null;

  if (i.cardsDue >= DASHBOARD.reviewFirstThreshold) return review(i.cardsDue, true);

  for (const s of open) {
    const p = i.progress[s.id];
    if (!started(p) || p.postQuizPassedAt) continue;
    const unread = (i.lessonIds[s.id] ?? []).find((id) => !p.lessonsRead.includes(id));
    if (unread && !p.fastTracked) {
      return {
        kind: 'read',
        title: `Keep going in ${s.shortTitle}`,
        detail: `Read the next chapter (${p.lessonsRead.length + 1} of ${(i.lessonIds[s.id] ?? []).length}), then take the post-quiz.`,
        to: `/section/${s.id}/read/${unread}`,
        cta: 'Read next chapter',
      };
    }
    return {
      kind: 'postQuiz',
      title: `Take the ${s.shortTitle} post-quiz`,
      detail: 'Score 80% to clear the section and unlock its Boss Fight.',
      to: `/section/${s.id}/quiz/post`,
      cta: 'Start post-quiz',
    };
  }

  for (const s of open) {
    const p = i.progress[s.id];
    if (p.postQuizPassedAt && p.mockBest === null) {
      return {
        kind: 'mock',
        title: `Fight the ${s.shortTitle} Boss`,
        detail: 'A timed, interview-style mock with follow-ups. It’s worth over a third of your mastery.',
        to: `/section/${s.id}/quiz/mock`,
        cta: 'Start Boss Fight',
      };
    }
  }

  if (i.cardsDue > 0) return review(i.cardsDue, false);

  const [worstId, worstCount] = (Object.entries(i.mistakesBySection) as [SectionId, number][])
    .sort((a, b) => b[1] - a[1])[0] ?? [null, 0];
  if (worstId && worstCount >= DASHBOARD.mistakeThreshold) {
    const s = i.sections.find((x) => x.id === worstId);
    return {
      kind: 'mistakes',
      title: `Redo your ${s?.shortTitle ?? ''} mistakes`,
      detail: `${worstCount} open mistakes. Each one you get right is cleared.`,
      to: `/section/${worstId}/quiz/mistakes`,
      cta: 'Redo mistakes',
    };
  }

  if (i.weakest && i.weakest.attempts > 0 && i.weakest.mastery < 0.6) {
    return drill(i.weakest);
  }

  const fresh = open.find((s) => !started(i.progress[s.id]));
  if (fresh) {
    return {
      kind: 'preQuiz',
      title: `Start ${fresh.title}`,
      detail: 'A short diagnostic sets your starting mastery; 90% fast-tracks you to the post-quiz.',
      to: `/section/${fresh.id}/quiz/pre`,
      cta: 'Take pre-quiz',
    };
  }

  const retake = open.find((s) => i.grades[s.id] !== null && !GOOD_GRADES.includes(i.grades[s.id] as Grade));
  if (retake) {
    return {
      kind: 'retakeMock',
      title: `Raise your ${retake.shortTitle} grade`,
      detail: `You’re at ${i.grades[retake.id]}. Another Boss Fight run lifts your grade and mastery.`,
      to: `/section/${retake.id}/quiz/mock`,
      cta: 'Retake Boss Fight',
    };
  }

  if (i.weakest) return drill(i.weakest);

  return {
    kind: 'hirevue',
    title: 'Practice a HireVue round',
    detail: 'Everything is on track. Keep your delivery sharp with a timed video round.',
    to: '/hirevue',
    cta: 'Start HireVue',
  };
}

function review(n: number, backlog: boolean): NextAction {
  return {
    kind: 'review',
    title: backlog ? 'Clear your review backlog' : 'Clear today’s reviews',
    detail: `${n} card${n === 1 ? '' : 's'} due. Short daily reviews keep what you’ve learned from fading.`,
    to: '/review',
    cta: 'Start review',
  };
}

function drill(w: WeakSubtopic): NextAction {
  return {
    kind: 'drill',
    title: `Drill ${w.title}`,
    detail:
      w.attempts > 0
        ? `Your weakest subtopic (${w.sectionTitle}, ${Math.round(w.mastery * 100)}% mastery).`
        : `You haven’t been tested on this ${w.sectionTitle} subtopic yet.`,
    to: drillPath(w.sectionId, w.subtopicId),
    cta: 'Start drill',
  };
}

export function drillPath(sectionId: SectionId, subtopicId: string): string {
  return `/section/${sectionId}/quiz/drill?subtopic=${encodeURIComponent(subtopicId)}`;
}
