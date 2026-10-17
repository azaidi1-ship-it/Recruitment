import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileUp, GitCompare, Minus, Pencil, Plus } from 'lucide-react';
import { diffResume, parseResumeText, type ParsedItem, type ResumeDiff } from '../../engine/storyBank';
import { applyResumeImport, pdfToText, type ImportResult } from '../../services/storyBank';
import type { Resume } from '../../types/models';
import { Button, Card } from '../../components/ui';

/**
 * Update the resume: paste its text or upload a PDF, preview what changed,
 * then save it as a new version. New items get draft stories; stories about
 * changed items are flagged for review.
 */
export function ResumeImport({ resume }: { resume: Resume }) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<{ parsed: ParsedItem[]; diff: ResumeDiff } | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function loadFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      setText(file.name.toLowerCase().endsWith('.pdf') ? await pdfToText(file) : await file.text());
      setPreview(null);
    } catch {
      setError('Couldn’t read that file. Try pasting the text instead.');
    } finally {
      setBusy(false);
    }
  }

  function compare() {
    const parsed = parseResumeText(text);
    if (parsed.length === 0) {
      setError('No entries found. The importer expects section headings (EXPERIENCE, LEADERSHIP…) and “Role | Organization” lines, as in your current resume.');
      setPreview(null);
      return;
    }
    setError(null);
    setPreview({ parsed, diff: diffResume(resume, parsed) });
  }

  return (
    <Card>
      <h2 className="mb-1 flex items-center gap-2 font-semibold">
        <GitCompare size={17} className="text-muted" /> Update your resume
      </h2>
      <p className="mb-3 text-sm text-muted">
        Upload a PDF or paste the text of a new version. You’ll see what changed before anything is saved. New items get a first-draft story; existing stories are never overwritten.
      </p>
      {result ? (
        <div className="rounded-lg border border-ok/40 bg-ok-soft/40 p-3 text-sm">
          <p className="font-medium">Saved as resume v{result.resume.version}.</p>
          <ul className="mt-1 list-disc pl-5 text-muted">
            <li>
              {result.draftedStories.length} draft stor{result.draftedStories.length === 1 ? 'y' : 'ies'} for new items
              {result.draftedStories.map((s) => (
                <Link key={s.id} to={`/stories?tab=stories&story=${s.id}`} className="ml-2 text-accent hover:underline">
                  {s.title}
                </Link>
              ))}
            </li>
            <li>{result.flaggedStories.length} existing stories flagged for review because their item changed</li>
            <li>{result.diff.removed.length} items no longer on the resume (their stories are kept)</li>
          </ul>
          <Button className="mt-3" onClick={() => (setResult(null), setText(''), setPreview(null))}>
            Done
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-sunk px-3 py-2 text-sm hover:border-faint">
              <FileUp size={15} /> {busy ? 'Reading…' : 'Upload PDF or .txt'}
              <input type="file" accept=".pdf,.txt" className="sr-only" onChange={(e) => e.target.files?.[0] && void loadFile(e.target.files[0])} />
            </label>
            <span className="text-xs text-faint">or paste below</span>
          </div>
          <textarea
            aria-label="Resume text"
            rows={8}
            value={text}
            onChange={(e) => (setText(e.target.value), setPreview(null))}
            placeholder="Paste your updated resume text here"
            className="w-full rounded-md border border-line bg-sunk p-3 font-mono text-xs outline-none focus:border-accent"
          />
          {error && <p className="mt-2 text-sm text-bad">{error}</p>}
          <div className="mt-3 flex gap-2">
            <Button onClick={compare} disabled={!text.trim()}>
              Compare with v{resume.version}
            </Button>
            {preview && (
              <Button
                variant="primary"
                disabled={busy || preview.diff.added.length + preview.diff.changed.length + preview.diff.removed.length === 0}
                onClick={async () => {
                  setBusy(true);
                  setResult(await applyResumeImport(preview.parsed, text));
                  setBusy(false);
                }}
              >
                Save as v{resume.version + 1}
              </Button>
            )}
          </div>
          {preview && <DiffView diff={preview.diff} />}
        </>
      )}
    </Card>
  );
}

function DiffView({ diff }: { diff: ResumeDiff }) {
  const none = diff.added.length + diff.changed.length + diff.removed.length === 0;
  return (
    <div className="mt-4 space-y-3 text-sm">
      {none && <p className="text-muted">No changes to experience, projects or leadership.</p>}
      {diff.added.map((a) => (
        <p key={`${a.role}${a.org}`} className="flex items-start gap-2">
          <Plus size={15} className="mt-0.5 shrink-0 text-ok" />
          <span>
            <span className="font-medium">New:</span> {a.role}, {a.org} ({a.start} – {a.end}) · {a.bullets.length} bullet{a.bullets.length === 1 ? '' : 's'}
          </span>
        </p>
      ))}
      {diff.changed.map((c) => (
        <div key={c.old.id} className="flex items-start gap-2">
          <Pencil size={14} className="mt-0.5 shrink-0 text-warn" />
          <div>
            <span className="font-medium">Changed:</span> {c.old.role}, {c.old.org}
            <ul className="mt-1 space-y-0.5 text-xs">
              {c.next.bullets
                .filter((b) => !c.old.bullets.includes(b))
                .map((b) => (
                  <li key={b} className="text-ok">
                    + {b}
                  </li>
                ))}
              {c.old.bullets
                .filter((b) => !c.next.bullets.includes(b))
                .map((b) => (
                  <li key={b} className="text-bad line-through">
                    − {b}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      ))}
      {diff.removed.map((r) => (
        <p key={r.id} className="flex items-start gap-2">
          <Minus size={15} className="mt-0.5 shrink-0 text-bad" />
          <span>
            <span className="font-medium">Removed:</span> {r.role}, {r.org}
          </span>
        </p>
      ))}
      <p className="text-xs text-faint">{diff.unchanged.length} items unchanged. Education and achievements are kept from the current version.</p>
    </div>
  );
}
