import { COMPETENCIES } from '../content/behavioral/competencies';
import { COVERAGE_SUGGESTIONS } from '../content/stories/coverageSuggestions';
import { firstPerson, shortOrg } from '../content/superday/probes';
import { STATS } from '../config/gameConfig';
import type { Competency, CompetencyId, DealEntry, Firm, Resume, ResumeItem, ResumeItemCategory, Story } from '../types/models';

// ───────────────────────────── Coverage ─────────────────────────────

export interface CoverageRow {
  competency: Competency;
  stories: Pick<Story, 'id' | 'title' | 'resumeItemId'>[];
  gap: boolean;
  suggestions: { itemId: string; org: string; idea: string }[];
}

/**
 * Competencies × stories. A competency with fewer than two stories is a gap;
 * suggestions point at resume items that don't already cover it.
 */
export function coverageMatrix(stories: Pick<Story, 'id' | 'title' | 'resumeItemId' | 'competencies'>[], resume: Pick<Resume, 'items'>): CoverageRow[] {
  const orgOf = (id: string) => {
    const it = resume.items.find((i) => i.id === id);
    return it ? shortOrg(it.org) : id;
  };
  return COMPETENCIES.map((competency) => {
    const own = stories.filter((s) => s.competencies.includes(competency.id));
    const covered = new Set(own.map((s) => s.resumeItemId));
    const gap = own.length < STATS.storiesPerCompetency;
    return {
      competency,
      stories: own,
      gap,
      suggestions: gap
        ? COVERAGE_SUGGESTIONS[competency.id]
            .filter((x) => !covered.has(x.itemId) && resume.items.some((i) => i.id === x.itemId))
            .map((x) => ({ ...x, org: orgOf(x.itemId) }))
        : [],
    };
  });
}

// ───────────────────────────── Resume-generated answers ─────────────────────────────

const FINANCE_WORDS = /model|valuation|dcf|comps|raise|investor|equity|fund|financial|credit|market|yield/gi;

function relevance(item: ResumeItem): number {
  return item.bullets.join(' ').match(FINANCE_WORDS)?.length ?? 0;
}

/** Sortable month index from "Oct 2025", "2026", "Present", "Expected May 2029". */
export function dateKey(s: string): number {
  if (/present/i.test(s)) return 1e9;
  const year = Number(s.match(/(19|20)\d{2}/)?.[0] ?? 0);
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const m = months.findIndex((x) => s.toLowerCase().includes(x));
  return year * 12 + (m >= 0 ? m : 0);
}

/** The first clause of a bullet, in the first person: "I built the financial model … raise." */
export function clause(bullet: string): string {
  const head = bullet.split(/, (?=[a-z]+ing\b)/)[0]!;
  return firstPerson(head);
}

/**
 * Confirmed outcomes worth saying aloud ("The $250K pre-seed raise closed."),
 * shortened to "That raise closed." when the clause already names it.
 */
function confirmedSentence(item: ResumeItem, said = ''): string {
  return (item.confirmedNotes ?? [])
    .filter((n) => /closed|completed|finished/i.test(n) && !/at least/i.test(n))
    .map((n) => {
      const m = n.match(/^The (.+) (closed|completed|finished)\.$/);
      return m && said.includes(m[1]!) ? `That ${m[1]!.split(' ').pop()} ${m[2]}.` : n;
    })
    .join(' ');
}

export function possessive(name: string): string {
  return /s$/i.test(name) ? `${name}’` : `${name}’s`;
}

/**
 * "Walk me through your resume", generated from the resume so it follows
 * re-imports: background, the spark (first experience), the most
 * finance-relevant later items in order, then the landing on banking.
 */
export function resumeWalkthrough(resume: Resume, length: '60s' | '2min'): string {
  const edu = resume.items.filter((i) => i.category === 'education');
  const college = edu.find((e) => /college|university/i.test(e.org) && /B\.?A|B\.?S|degree|major/i.test(e.role)) ?? edu[0];
  const school = edu.find((e) => e !== college);
  const exps = resume.items.filter((i) => i.category === 'experience' || i.category === 'project').sort((a, b) => dateKey(a.start) - dateKey(b.start));
  const spark = exps.find((e) => /found/i.test(e.role)) ?? exps[0];
  const later = exps.filter((e) => e !== spark && dateKey(e.start) >= dateKey(spark?.start ?? ''));
  const pickN = length === '60s' ? 2 : 4;
  const picked = [...later].sort((a, b) => relevance(b) - relevance(a)).slice(0, pickN).sort((a, b) => dateKey(a.start) - dateKey(b.start));

  const parts: string[] = [];
  const major = college?.role.match(/in ([^(]+)/)?.[1]?.trim();
  if (school && length === '2min') parts.push(`I grew up in ${school.location?.split(',')[0] ?? '[FILL IN: where you grew up]'} and went to ${school.org}.`);
  if (college) parts.push(`I’m now at ${college.org}${major ? ` studying ${major.toLowerCase()}` : ''}.`);
  if (spark) {
    parts.push(`My interest in finance started with ${spark.org.split(',')[0]}: ${clause(spark.bullets[0] ?? '').replace(/^I /, 'I ')}`);
    if (spark.bullets[0]?.includes(', building')) parts.push(`I built ${spark.bullets[0].split(', building ')[1]!.replace(/\.$/, '')}, and that got me hooked on the numbers behind decisions.`);
    else parts.push('That got me hooked on the numbers behind decisions.');
  }
  const linkers = ['Building on that,', 'Since then,', 'Most recently,', 'Alongside that,'];
  picked.forEach((item, k) => {
    const org = shortOrg(item.org);
    const verb = clause(item.bullets[0] ?? '').replace(/^I /, '');
    const link = k === picked.length - 1 && picked.length > 1 ? 'Most recently,' : linkers[k % 2]!;
    const done = confirmedSentence(item, verb);
    parts.push(`${link} at ${org} I ${verb.replace(/\.$/, '')}.${done ? ` ${done}` : ''}`);
  });
  if (length === '2min') {
    const leads = resume.items.filter((i) => i.category === 'leadership');
    const lead = leads.find((i) => /president|captain|head|chair|founder|lead/i.test(i.role)) ?? [...leads].sort((a, b) => relevance(b) - relevance(a))[0];
    if (lead) parts.push(`Outside work, as ${lead.role.toLowerCase()} of ${shortOrg(lead.org)}, I ${clause(lead.bullets[0] ?? '').replace(/^I /, '').replace(/\.$/, '')}.`);
  }
  parts.push('That’s what led me to investment banking: I want to do this kind of analysis on live transactions, with a team that will push me much further.');
  return parts.join(' ').replace(/\s+/g, ' ').replace(/\.\./g, '.');
}

/** "Why investment banking?" from the resume: origin, evidence, what you want to learn. */
export function whyIb(resume: Resume): string {
  const exps = resume.items.filter((i) => i.category === 'experience' || i.category === 'project');
  const spark = exps.find((e) => /found/i.test(e.role)) ?? exps[0];
  const evidence = [...exps].filter((e) => e !== spark).sort((a, b) => relevance(b) - relevance(a)).slice(0, 2);
  const ev = evidence.map((e) => {
    const verb = clause(e.bullets[0] ?? '').replace(/^I /, '').replace(/\.$/, '');
    const done = confirmedSentence(e, verb);
    return `at ${shortOrg(e.org)} I ${verb}${done ? `, which ${done.split(' ').pop()!.replace(/\.$/, '')}` : ''}`;
  });
  return [
    spark ? `I first got interested when I ${clause(spark.bullets[0] ?? '').replace(/^I /, '').replace(/\.$/, '')} and realized the numbers were driving every decision.` : '[FILL IN: How did you first get interested in finance?]',
    ev.length ? `Since then I’ve tested that interest: ${ev.join(', and ')}.` : '',
    'What draws me to banking rather than consulting is that the analysis sits at the center of a live transaction, where it decides a concrete outcome for a client.',
    'And I want the steepest learning curve I can find early in my career: I want to learn how deals are valued, negotiated and closed.',
  ]
    .filter(Boolean)
    .join(' ');
}

/** "Why [firm]?" template from the Firm Tracker card, with [FILL IN] wherever the card is still empty. */
export function whyFirm(firm: Pick<Firm, 'name' | 'tier' | 'focusAreas' | 'contacts' | 'researchedDeals'>, deals: Pick<DealEntry, 'id' | 'acquirer' | 'target'>[], resume: Resume): string {
  const deal = deals.find((d) => firm.researchedDeals.includes(d.id));
  const contact = firm.contacts[0];
  const focus = firm.focusAreas[0];
  const stratus = resume.items.find((i) => i.id === 'exp-stratus');
  const fitLine = stratus
    ? `I built the model and deck behind ${possessive(shortOrg(stratus.org))} pre-seed raise and want to keep working close to clients on transactions`
    : '[FILL IN: the experience that best fits this firm]';
  const model =
    firm.tier === 'elite-boutique'
      ? 'Its advisory-only model and lean deal teams mean analysts get real responsibility and client exposure early'
      : firm.tier === 'bulge-bracket'
        ? 'Its scale across advisory, financing and capital markets means analysts see the full range of products on large deals'
        : 'Its focus and deal volume mean analysts work on many transactions and take on responsibility early';
  return [
    `Three reasons. First, ${possessive(firm.name)} strength in ${focus ? focus.replace(/^[A-Z](?=[a-z])/, (c) => c.toLowerCase()) : '[FILL IN: the firm’s sector or product strength]'}: ${deal ? `I followed its work on ${possessive(deal.acquirer)} deal for ${deal.target}, and [FILL IN: what stood out to you about that deal]` : 'I followed [FILL IN: a recent deal the firm advised on] and [FILL IN: what stood out to you]'}.`,
    `Second, the people: ${contact ? `I spoke with ${contact.name}${contact.role ? ` (${contact.role})` : ''}, and ${contact.notes ? `what stood out was ${contact.notes.replace(/\.$/, '').replace(/^./, (c) => c.toLowerCase())}` : '[FILL IN: what stood out from that conversation]'}` : 'I spoke with [FILL IN: someone at the firm], and [FILL IN: what stood out from that conversation]'}.`,
    `Third, the fit. ${model}, and that suits me: ${fitLine}.`,
  ].join(' ');
}

// ───────────────────────────── Resume re-import ─────────────────────────────

const SECTION_MAP: [RegExp, ResumeItemCategory | null][] = [
  [/^EDUCATION/, 'education'],
  [/^(PROFESSIONAL |WORK )?EXPERIENCE/, 'experience'],
  [/^(RESEARCH|PROJECTS)/, 'project'],
  [/^(LEADERSHIP|ACTIVITIES|EXTRACURRICULAR)/, 'leadership'],
  [/^(SKILLS|CERTIFICATIONS|INTERESTS|ADDITIONAL)/, null],
];

export interface ParsedItem {
  category: ResumeItemCategory;
  role: string;
  org: string;
  start: string;
  end: string;
  bullets: string[];
}

const DATE_LINE = /^((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*)?((19|20)\d{2})?\s*(–|-|—|to)?\s*((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*)?((19|20)\d{2}|present)?$/i;

/**
 * Parse resume text in the common "Role | Organization" / dates / bullets
 * layout (the format of the seed resume). Only experience, project and
 * leadership entries are extracted; education is kept from the stored resume.
 */
export function parseResumeText(text: string): ParsedItem[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const items: ParsedItem[] = [];
  let section: ResumeItemCategory | null = null;
  let cur: ParsedItem | null = null;
  for (const line of lines) {
    const heading = SECTION_MAP.find(([re]) => re.test(line) && line === line.toUpperCase());
    if (heading) {
      section = heading[1];
      cur = null;
      continue;
    }
    if (!section || section === 'education') continue;
    if (line.includes(' | ')) {
      const [role, org] = line.split(' | ');
      cur = { category: section, role: role!.trim(), org: org!.trim(), start: '', end: '', bullets: [] };
      items.push(cur);
      continue;
    }
    if (!cur) continue;
    if (!cur.start && DATE_LINE.test(line) && /\d|present/i.test(line)) {
      const [a, b] = line.split(/\s+(?:–|-|—|to)\s+/);
      const end = (b ?? a ?? '').trim();
      let start = (a ?? '').trim();
      if (!/\d/.test(start)) start = `${start} ${end.match(/(19|20)\d{2}/)?.[0] ?? ''}`.trim();
      cur.start = start;
      cur.end = end;
      continue;
    }
    if (/^[•\-*▪◦]/.test(line)) cur.bullets.push(line.replace(/^[•\-*▪◦]\s*/, ''));
    else if (cur.bullets.length) cur.bullets[cur.bullets.length - 1] += ` ${line}`;
  }
  return items;
}

export interface ResumeDiff {
  added: ParsedItem[];
  changed: { old: ResumeItem; next: ParsedItem }[];
  removed: ResumeItem[];
  unchanged: ResumeItem[];
}

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

export function diffResume(old: Pick<Resume, 'items'>, parsed: ParsedItem[]): ResumeDiff {
  const scope: ResumeItemCategory[] = ['experience', 'project', 'leadership'];
  const olds = old.items.filter((i) => scope.includes(i.category));
  const matched = new Set<string>();
  const diff: ResumeDiff = { added: [], changed: [], removed: [], unchanged: [] };
  for (const p of parsed) {
    const hit = olds.find((o) => !matched.has(o.id) && norm(shortOrg(o.org)) === norm(shortOrg(p.org)) && (norm(o.role) === norm(p.role) || o.category === p.category));
    if (!hit) {
      diff.added.push(p);
      continue;
    }
    matched.add(hit.id);
    const same = hit.bullets.length === p.bullets.length && hit.bullets.every((b, k) => norm(b) === norm(p.bullets[k] ?? '')) && norm(hit.role) === norm(p.role);
    if (same) diff.unchanged.push(hit);
    else diff.changed.push({ old: hit, next: p });
  }
  diff.removed = olds.filter((o) => !matched.has(o.id));
  return diff;
}

const PREFIX: Record<ResumeItemCategory, string> = { education: 'edu', experience: 'exp', project: 'proj', leadership: 'lead', achievement: 'ach' };

export function newItemId(p: ParsedItem, taken: Set<string>): string {
  const base = `${PREFIX[p.category]}-${norm(shortOrg(p.org)).split(' ').slice(0, 3).join('-') || 'item'}`;
  let id = base;
  for (let k = 2; taken.has(id); k++) id = `${base}-${k}`;
  return id;
}

const COMPETENCY_HINTS: [RegExp, CompetencyId][] = [
  [/model|analy|data|valuation|research|market/i, 'analytical'],
  [/led|lead|team|managed|president|captain/i, 'leadership'],
  [/client|customer|investor/i, 'client-focus'],
  [/found|launch|built|created|started/i, 'initiative'],
  [/present|pitch|recommend|persuad/i, 'persuasion'],
  [/deadline|time|weekly/i, 'time-management'],
];

/** A first-draft STAR story for a new resume item: resume facts plus [FILL IN] questions. */
export function draftStoryForItem(item: ResumeItem, nowIso: string, id: string): Story {
  const text = item.bullets.join(' ');
  const competencies = [...new Set(COMPETENCY_HINTS.filter(([re]) => re.test(text)).map(([, c]) => c))];
  for (const c of ['initiative', 'analytical'] as CompetencyId[]) if (competencies.length < 2 && !competencies.includes(c)) competencies.push(c);
  const org = shortOrg(item.org);
  const situation = `From ${item.start} to ${item.end.toLowerCase() === 'present' ? 'today' : item.end}, I was ${item.role} at ${org}. [FILL IN: What was the context or problem when you started?]`;
  const task = 'I was responsible for [FILL IN: your specific responsibility].';
  const action = `${item.bullets.map((b) => firstPerson(b)).join(' ')} [FILL IN: The specific steps you took yourself, and the tools you used.] [FILL IN: The hardest moment and how you handled it.]`;
  const result = 'The result was [FILL IN: the outcome, ideally with a number]. I learned [FILL IN: what you learned], which matters in banking because [FILL IN: why it matters for an analyst].';
  const spoken = [situation, task, action, result].join(' ');
  const short = `${clause(item.bullets[0] ?? `I worked at ${org}.`)} [FILL IN: the result in one sentence.]`;
  return {
    id,
    resumeItemId: item.id,
    title: `${item.role} at ${org}`,
    angle: 'first draft',
    competencies: competencies.slice(0, 3),
    situation,
    task,
    action,
    result,
    spoken,
    short,
    fillIns: [...new Set([...spoken.matchAll(/\[FILL IN: ([^\]]+)\]/g), ...short.matchAll(/\[FILL IN: ([^\]]+)\]/g)].map((m) => m[1]!))],
    unverifiedDetails: [],
    practiceScore: null,
    needsRewrite: true,
    userEdited: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}
