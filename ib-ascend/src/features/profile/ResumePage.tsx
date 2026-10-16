import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import type { ResumeItemCategory } from '../../types/models';
import { Badge, Card, PageHeader } from '../../components/ui';

const GROUPS: { category: ResumeItemCategory; title: string }[] = [
  { category: 'education', title: 'Education' },
  { category: 'experience', title: 'Experience' },
  { category: 'project', title: 'Research & projects' },
  { category: 'leadership', title: 'Leadership & activities' },
  { category: 'achievement', title: 'Achievements' },
];

/** Read-only view of the stored resume. TODO(Phase 9): re-import + diff, story links per item. */
export function ResumePage() {
  const resume = useLiveQuery(() => db.resumes.orderBy('version').last());
  if (!resume) return null;

  return (
    <>
      <PageHeader
        title={resume.name}
        subtitle={`${resume.contact.location} · ${resume.contact.email} · resume v${resume.version}`}
      />
      <div className="grid gap-4">
        {GROUPS.map((g) => {
          const items = resume.items.filter((i) => i.category === g.category);
          if (!items.length) return null;
          return (
            <Card key={g.category}>
              <h2 className="mb-3 font-semibold">{g.title}</h2>
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.id}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="text-sm font-medium">
                        {item.role} <span className="text-muted">· {item.org}</span>
                      </div>
                      <div className="text-xs text-faint tabular">
                        {item.start} – {item.end}
                      </div>
                    </div>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted">
                      {item.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    {item.confirmedNotes?.map((n) => (
                      <div key={n} className="mt-1.5 flex items-start gap-2 text-xs text-muted">
                        <Badge tone="ok">Confirmed</Badge>
                        <span>{n}</span>
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
        <Card>
          <h2 className="mb-2 font-semibold">Skills, languages & certifications</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-[140px_1fr]">
            <dt className="text-muted">Finance</dt>
            <dd>{resume.skills.finance.join(', ')}</dd>
            <dt className="text-muted">Technical</dt>
            <dd>{resume.skills.technical.join(', ')}</dd>
            <dt className="text-muted">Languages</dt>
            <dd>{resume.languages.map((l) => `${l.language} (${l.level.toLowerCase()})`).join(', ')}</dd>
            <dt className="text-muted">Certifications</dt>
            <dd>{resume.certifications.join('; ')}</dd>
          </dl>
        </Card>
      </div>
    </>
  );
}
