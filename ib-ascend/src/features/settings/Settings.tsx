import { useRef, useState, type ReactNode } from 'react';
import { Download, Upload, Trash2 } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { hydrateAll } from '../../store/bootstrap';
import { BackupError, backupFileName, exportBackup, importBackup, parseBackup, wipeAll } from '../../db/backup';
import { Button, Card, PageHeader } from '../../components/ui';
import { LLM_MODELS } from '../../engine/ai';
import { testConnection } from '../../services/llm';

const field = 'w-full rounded-lg border border-line bg-sunk px-3 py-2 text-sm text-ink placeholder:text-faint';

export function Settings() {
  const { settings, update } = useSettingsStore();
  const [showKey, setShowKey] = useState(false);

  return (
    <>
      <PageHeader title="Settings" />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-semibold">Preferences</h2>
          <div className="space-y-4 text-sm">
            <Row label="Theme">
              <select
                className={field}
                value={settings.theme}
                onChange={(e) => update({ theme: e.target.value as 'dark' | 'light' })}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </Row>
            <Row label="Default tax rate" hint="Used by statement walk-throughs unless a question says otherwise.">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={60}
                  step={1}
                  className={field}
                  value={Math.round(settings.defaultTaxRate * 100)}
                  onChange={(e) => update({ defaultTaxRate: Math.min(60, Math.max(0, Number(e.target.value))) / 100 })}
                />
                <span className="text-muted">%</span>
              </div>
            </Row>
            <Row label="Daily study goal" hint="Your normal daily load. The Recruiting Calendar raises it as interviews approach.">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={10}
                  max={480}
                  step={5}
                  className={field}
                  value={settings.dailyGoalMinutes}
                  onChange={(e) => update({ dailyGoalMinutes: Math.max(10, Number(e.target.value)) })}
                />
                <span className="text-muted">min</span>
              </div>
            </Row>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.reduceMotion}
                onChange={(e) => update({ reduceMotion: e.target.checked })}
              />
              Reduce motion (skip level-up animations)
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="mb-1 font-semibold">AI grading & interviewer (optional)</h2>
          <p className="mb-4 text-sm text-muted">
            The app works fully without a key. With an Anthropic API key, free-text answers get AI feedback and the
            Superday Simulator can run a conversational interviewer. The key stays in this browser and is left out of
            backups unless you choose to include it.
          </p>
          <div className="space-y-4 text-sm">
            <Row label="Anthropic API key">
              <div className="flex gap-2">
                <input
                  type={showKey ? 'text' : 'password'}
                  autoComplete="off"
                  spellCheck={false}
                  className={field}
                  placeholder="sk-ant-…"
                  value={settings.llmApiKey}
                  onChange={(e) => update({ llmApiKey: e.target.value.trim() })}
                />
                <Button onClick={() => setShowKey((v) => !v)}>{showKey ? 'Hide' : 'Show'}</Button>
              </div>
            </Row>
            <Row label="Model" hint="Opus is the most thorough grader and interviewer; Sonnet and Haiku are faster and cost less per answer.">
              <select className={field} value={settings.llmModel} onChange={(e) => update({ llmModel: e.target.value })}>
                {LLM_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}: {m.note}
                  </option>
                ))}
                {!LLM_MODELS.some((m) => m.id === settings.llmModel) && <option value={settings.llmModel}>{settings.llmModel}</option>}
              </select>
            </Row>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={settings.llmAutoGrade} onChange={(e) => update({ llmAutoGrade: e.target.checked })} />
              Grade verbal answers with Claude automatically (you still confirm every score)
            </label>
            <TestKey disabled={!settings.llmApiKey} />
          </div>
        </Card>

        <BackupPanel />
      </div>
    </>
  );
}

function TestKey({ disabled }: { disabled: boolean }) {
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        disabled={disabled || busy}
        onClick={async () => {
          setBusy(true);
          setStatus(null);
          try {
            setStatus({ ok: true, text: await testConnection() });
          } catch (e) {
            setStatus({ ok: false, text: e instanceof Error ? e.message : String(e) });
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? 'Testing…' : 'Test key'}
      </Button>
      {status && <span className={status.ok ? 'text-ok' : 'text-bad'}>{status.text}</span>}
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 font-medium">{label}</div>
      {children}
      {hint && <p className="mt-1 text-xs text-faint">{hint}</p>}
    </div>
  );
}

function BackupPanel() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [includeKey, setIncludeKey] = useState(false);
  const [status, setStatus] = useState<{ tone: 'ok' | 'bad'; text: string } | null>(null);

  async function onExport() {
    const file = await exportBackup(undefined, { includeApiKey: includeKey });
    const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = backupFileName();
    a.click();
    URL.revokeObjectURL(url);
    const rows = Object.values(file.tables).reduce((n, t) => n + t.length, 0);
    setStatus({ tone: 'ok', text: `Exported ${rows.toLocaleString()} records.` });
  }

  async function onImport(f: File) {
    try {
      const parsed = parseBackup(await f.text());
      const when = new Date(parsed.exportedAt).toLocaleString();
      if (!window.confirm(`Replace ALL current progress with the backup from ${when}? This can’t be undone.`)) return;
      const { counts } = await importBackup(parsed);
      await hydrateAll();
      const rows = Object.values(counts).reduce((n, c) => n + (c ?? 0), 0);
      setStatus({ tone: 'ok', text: `Restored ${rows.toLocaleString()} records from ${when}.` });
    } catch (e) {
      setStatus({ tone: 'bad', text: e instanceof BackupError ? e.message : 'Import failed. Your data was not changed.' });
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function onReset() {
    if (!window.confirm('Delete ALL progress, stories and notes in this browser? Export a backup first if unsure.')) return;
    await wipeAll();
    await hydrateAll();
    setStatus({ tone: 'ok', text: 'All progress reset.' });
  }

  return (
    <Card className="lg:col-span-2">
      <h2 className="mb-1 font-semibold">Backup</h2>
      <p className="mb-4 text-sm text-muted">
        Everything lives in this browser’s IndexedDB. Export a JSON backup regularly, and before clearing site data or
        switching devices.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={onExport}>
          <Download size={16} /> Export backup
        </Button>
        <Button onClick={() => fileRef.current?.click()}>
          <Upload size={16} /> Import backup
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onImport(f);
          }}
        />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={includeKey} onChange={(e) => setIncludeKey(e.target.checked)} />
          Include API key in export
        </label>
        <Button variant="danger" className="sm:ml-auto" onClick={onReset}>
          <Trash2 size={16} /> Reset all progress
        </Button>
      </div>
      {status && (
        <p role="status" className={`mt-3 text-sm ${status.tone === 'ok' ? 'text-ok' : 'text-bad'}`}>
          {status.text}
        </p>
      )}
    </Card>
  );
}
