/**
 * Optional Claude features: answer grading and the conversational Superday
 * interviewer. Calls go straight from the browser to the Anthropic API with
 * the key stored in Settings; nothing else leaves the device. Every caller
 * must keep working without a key (keyword grading, offline Superday).
 */
import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { z } from 'zod';
import { DEFAULT_MODEL, GRADER_SYSTEM, SCORER_SYSTEM, gradeRequestText, scoreRequestText, type GradeInput, type GradeResult } from '../engine/ai';
import { useSettingsStore, hasLlmKey } from '../store/useSettingsStore';
import type { Settings } from '../types/models';

export class LlmError extends Error {
  constructor(
    message: string,
    readonly kind: 'no-key' | 'auth' | 'rate-limit' | 'refused' | 'network' | 'other',
  ) {
    super(message);
  }
}

function settings(): Settings {
  return useSettingsStore.getState().settings;
}

export function llmEnabled(s: Settings = settings()): boolean {
  return s.llmProvider === 'anthropic' && hasLlmKey(s);
}

function client(s: Settings): Anthropic {
  if (!llmEnabled(s)) throw new LlmError('Add an Anthropic API key in Settings to use AI features.', 'no-key');
  // The key is the user's own, entered on this device; requests go only to the Anthropic API.
  return new Anthropic({ apiKey: s.llmApiKey, dangerouslyAllowBrowser: true, maxRetries: 2 });
}

function model(s: Settings): string {
  return s.llmModel || DEFAULT_MODEL;
}

/**
 * Refusal fallback: on Opus / Sonnet the API reroutes a safety decline to
 * another model in the same call. Haiku has no server-side fallback.
 */
function fallback(m: string): { betas?: Anthropic.Beta.AnthropicBeta[]; fallbacks?: 'default' } {
  return /haiku/.test(m) ? {} : { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' };
}

function toLlmError(e: unknown): LlmError {
  if (e instanceof LlmError) return e;
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) return new LlmError('Your API key was rejected. Check it in Settings.', 'auth');
  if (e instanceof Anthropic.RateLimitError) return new LlmError('Rate limited by the API. Wait a moment and try again.', 'rate-limit');
  if (e instanceof Anthropic.APIConnectionError) return new LlmError('Couldn’t reach the Anthropic API. Check your connection.', 'network');
  if (e instanceof Anthropic.APIError) return new LlmError(`API error ${e.status ?? ''}: ${e.message}`, 'other');
  return new LlmError(e instanceof Error ? e.message : String(e), 'other');
}

// ───────────────────────────── Grading ─────────────────────────────

const GradeSchema = z.object({
  points: z.array(z.object({ id: z.string(), met: z.boolean(), note: z.string() })),
  feedback: z.string(),
});

/** Grade a verbal answer against its rubric. Throws LlmError; callers fall back to keyword grading. */
export async function gradeAnswer(input: GradeInput): Promise<GradeResult> {
  const s = settings();
  const m = model(s);
  try {
    const res = await client(s).beta.messages.parse({
      model: m,
      max_tokens: 16000,
      system: GRADER_SYSTEM,
      messages: [{ role: 'user', content: gradeRequestText(input) }],
      output_config: { effort: 'medium', format: betaZodOutputFormat(GradeSchema) },
      ...fallback(m),
    });
    if (res.stop_reason === 'refusal') throw new LlmError('Claude declined to grade this answer.', 'refused');
    if (!res.parsed_output) throw new LlmError('Claude’s grade couldn’t be read. Grade it yourself this time.', 'other');
    return res.parsed_output;
  } catch (e) {
    throw toLlmError(e);
  }
}

/** A tiny request to confirm the key and model work. */
export async function testConnection(): Promise<string> {
  const s = settings();
  const m = model(s);
  try {
    const res = await client(s).beta.messages.create({
      model: m,
      max_tokens: 2000,
      output_config: { effort: 'low' },
      messages: [{ role: 'user', content: 'Reply with the single word: ready' }],
      ...fallback(m),
    });
    const text = res.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('').trim();
    return `${res.model} replied “${text.slice(0, 40)}”.`;
  } catch (e) {
    throw toLlmError(e);
  }
}

// ───────────────────────────── AI interviewer ─────────────────────────────

export type InterviewHistory = Anthropic.Beta.BetaMessageParam[];

/**
 * One interviewer turn, streamed. The full assistant content (including any
 * thinking blocks) is returned so the caller can append it unchanged; the
 * conversation history is never edited.
 */
export async function interviewerTurn(system: string, history: InterviewHistory, onText: (soFar: string) => void, signal?: AbortSignal): Promise<{ text: string; content: Anthropic.Beta.BetaContentBlock[] }> {
  const s = settings();
  const m = model(s);
  try {
    const stream = client(s).beta.messages.stream(
      {
        model: m,
        max_tokens: 8000,
        system,
        messages: history,
        output_config: { effort: 'low' },
        ...fallback(m),
      },
      { signal },
    );
    let text = '';
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        text += event.delta.text;
        onText(text);
      }
    }
    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') throw new LlmError('The interviewer declined to continue this conversation.', 'refused');
    return { text, content: final.content };
  } catch (e) {
    throw toLlmError(e);
  }
}

const ScoreSchema = z.object({
  technical_accuracy: z.number().nullable(),
  structure: z.number().nullable(),
  story_quality: z.number().nullable(),
  would_advance: z.boolean(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  questions: z.array(z.object({ question: z.string(), note: z.string() })),
});

export type AiScore = z.infer<typeof ScoreSchema>;

export async function scoreInterview(personaTitle: string, transcript: string): Promise<AiScore> {
  const s = settings();
  const m = model(s);
  try {
    const res = await client(s).beta.messages.parse({
      model: m,
      max_tokens: 16000,
      system: SCORER_SYSTEM,
      messages: [{ role: 'user', content: scoreRequestText(personaTitle, transcript) }],
      output_config: { effort: 'high', format: betaZodOutputFormat(ScoreSchema) },
      ...fallback(m),
    });
    if (res.stop_reason === 'refusal') throw new LlmError('Claude declined to score this interview.', 'refused');
    if (!res.parsed_output) throw new LlmError('The scorecard couldn’t be read. Try again.', 'other');
    return res.parsed_output;
  } catch (e) {
    throw toLlmError(e);
  }
}
