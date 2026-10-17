import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flag, Loader2, RotateCcw, Send, Sparkles, Timer } from 'lucide-react';
import { INTERVIEW_DONE, aiScorecard, interviewerSystem, transcriptText, type InterviewerSetup, type Turn } from '../../engine/ai';
import type { Scorecard } from '../../engine/superday';
import { interviewerTurn, scoreInterview, type AiScore, type InterviewHistory } from '../../services/llm';
import { Badge, Button, Card, cx } from '../../components/ui';

export interface AiInterviewResult {
  turns: Turn[];
  ai: AiScore;
  scorecard: Scorecard;
}

interface Props {
  setup: InterviewerSetup;
  onFinish: (r: AiInterviewResult) => void | Promise<void>;
  onAbandon: () => void;
}

/** Hidden first user turn: the interviewer opens the conversation. */
const BEGIN = 'Begin the interview.';

/**
 * A conversational Superday round with Claude as the interviewer. Each
 * interviewer turn is streamed; the API history is append-only (the full
 * assistant content goes back unchanged), and the visible transcript is kept
 * separately with answer times for the speed score.
 */
export function AiInterview({ setup, onFinish, onAbandon }: Props) {
  const [system] = useState(() => interviewerSystem(setup));
  const history = useRef<InterviewHistory>([{ role: 'user', content: BEGIN }]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [live, setLive] = useState('');
  const [phase, setPhase] = useState<'asking' | 'answering' | 'ended' | 'scoring'>('asking');
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const shownAt = useRef(Date.now());
  const abort = useRef<AbortController | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  const elapsedMin = (now - startedAt) / 60_000;
  const overtime = elapsedMin >= setup.minutes;
  const answered = turns.filter((t) => t.role === 'candidate').length;

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    bottom.current?.scrollIntoView?.({ block: 'end', behavior: 'smooth' });
  }, [turns.length, live, phase]);

  async function ask() {
    setError(null);
    setPhase('asking');
    setLive('');
    const ctrl = new AbortController();
    abort.current = ctrl;
    try {
      const { text, content } = await interviewerTurn(system, history.current, setLive, ctrl.signal);
      if (ctrl.signal.aborted) return;
      history.current = [...history.current, { role: 'assistant', content }];
      setTurns((ts) => [...ts, { role: 'interviewer', text }]);
      setLive('');
      shownAt.current = Date.now();
      setPhase(text.includes(INTERVIEW_DONE) ? 'ended' : 'answering');
    } catch (e) {
      if (ctrl.signal.aborted) return;
      setLive('');
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  // The opening question. Aborting on cleanup also covers StrictMode's
  // mount–unmount–mount: the first request is cancelled, the second stands.
  useEffect(() => {
    void ask();
    return () => abort.current?.abort();
  }, []);

  function send() {
    const text = answer.trim();
    if (!text || phase !== 'answering') return;
    const turn: Turn = { role: 'candidate', text, ms: Date.now() - shownAt.current };
    history.current = [...history.current, { role: 'user', content: text }];
    setTurns((ts) => [...ts, turn]);
    setAnswer('');
    void ask();
  }

  async function finish() {
    abort.current?.abort();
    setLive('');
    setError(null);
    setPhase('scoring');
    try {
      const ai = await scoreInterview(setup.persona.title, transcriptText(turns));
      await onFinish({ turns, ai, scorecard: aiScorecard(ai, turns, setup.persona) });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setPhase('ended');
    }
  }

  const visible = turns.map((t) => ({ ...t, text: t.text.replace(INTERVIEW_DONE, '').trim() }));

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="mb-3 flex flex-wrap items-center justify-between gap-2 py-3">
        <span className="flex items-center gap-2 text-sm">
          <Sparkles size={16} className="text-info" />
          <span className="font-medium">AI interviewer</span>
          <Badge tone="info">{setup.persona.title}</Badge>
        </span>
        <span className="flex items-center gap-3">
          <span className={cx('flex items-center gap-1 text-sm tabular', overtime ? 'text-warn' : 'text-muted')} aria-label="Time elapsed">
            <Timer size={14} />
            {Math.floor(elapsedMin)}:{String(Math.floor(((now - startedAt) / 1000) % 60)).padStart(2, '0')} / {setup.minutes}:00
          </span>
          <Button onClick={onAbandon} disabled={phase === 'scoring'}>
            Quit
          </Button>
        </span>
      </Card>

      <Card>
        <ol className="space-y-4" aria-label="Interview transcript" aria-live="polite">
          {visible.map((t, k) => (
            <Bubble key={k} turn={t} />
          ))}
          {phase === 'asking' && !error && (
            <li className="anim-fade-in flex gap-3">
              <Avatar who="interviewer" />
              <p className="rounded-lg bg-sunk px-3 py-2 text-sm leading-relaxed">
                {live.replace(INTERVIEW_DONE, '') || (
                  <span className="flex items-center gap-1.5 text-muted">
                    <Loader2 size={14} className="animate-spin" /> The interviewer is thinking…
                  </span>
                )}
              </p>
            </li>
          )}
        </ol>

        {error && (
          <div className="mt-4 rounded-lg border border-warn/40 bg-warn-soft/40 p-3 text-sm" role="alert">
            <p>{error}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {phase === 'ended' ? (
                <Button onClick={finish}>
                  <RotateCcw size={14} /> Try scoring again
                </Button>
              ) : (
                <Button onClick={ask}>
                  <RotateCcw size={14} /> Retry
                </Button>
              )}
              <Link to="/settings" className="self-center text-accent hover:underline">
                Settings
              </Link>
            </div>
          </div>
        )}

        {phase === 'answering' && (
          <div className="mt-5">
            {overtime && <p className="mb-2 text-xs text-warn">Time’s up for this round. Answer this one, then finish when you’re ready.</p>}
            <textarea
              autoFocus
              rows={5}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              aria-label="Your answer"
              placeholder="Answer as you would out loud: lead with the answer, then support it."
              className="w-full rounded-lg border border-line bg-sunk p-3 text-sm leading-relaxed"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs text-faint">Ctrl/⌘ + Enter to send · no feedback until the end</span>
              <Button variant="primary" onClick={send} disabled={!answer.trim()}>
                <Send size={15} /> Send answer
              </Button>
            </div>
          </div>
        )}

        {phase === 'scoring' && (
          <p className="mt-5 flex items-center gap-2 text-sm text-muted" role="status">
            <Loader2 size={15} className="animate-spin" /> Claude is writing up your scorecard…
          </p>
        )}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
          <span className="text-xs text-muted">
            {answered} answer{answered === 1 ? '' : 's'} given
            {phase === 'ended' && !error && ' · the interviewer has wrapped up'}
          </span>
          <Button variant={phase === 'ended' ? 'primary' : 'secondary'} onClick={finish} disabled={phase === 'scoring' || answered === 0}>
            <Flag size={15} /> {phase === 'ended' ? 'See scorecard' : 'Finish and score'}
          </Button>
        </div>
        <div ref={bottom} />
      </Card>
    </div>
  );
}

function Avatar({ who }: { who: Turn['role'] }) {
  return (
    <span
      aria-hidden
      className={cx('grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-semibold', who === 'interviewer' ? 'bg-info-soft text-info' : 'bg-accent-soft text-accent')}
    >
      {who === 'interviewer' ? 'IV' : 'You'}
    </span>
  );
}

function Bubble({ turn }: { turn: Turn }) {
  const me = turn.role === 'candidate';
  return (
    <li className={cx('anim-fade-in flex gap-3', me && 'flex-row-reverse')}>
      <Avatar who={turn.role} />
      <div className={cx('max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed whitespace-pre-line', me ? 'bg-accent-soft/60' : 'bg-sunk')}>
        <span className="sr-only">{me ? 'You: ' : 'Interviewer: '}</span>
        {turn.text}
        {me && typeof turn.ms === 'number' && <span className="mt-1 block text-right text-[11px] text-faint tabular">{Math.round(turn.ms / 1000)}s</span>}
      </div>
    </li>
  );
}
