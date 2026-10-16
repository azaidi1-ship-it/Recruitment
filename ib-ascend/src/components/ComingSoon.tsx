import { Card, PageHeader } from './ui';

/** Stand-in for features scheduled in a later build phase. */
export function ComingSoon({ title, phase, what }: { title: string; phase?: number; what: string }) {
  return (
    <>
      <PageHeader title={title} />
      <Card>
        {phase !== undefined && <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent">Ships in Phase {phase}</p>}
        <p className="text-sm text-muted">{what}</p>
      </Card>
    </>
  );
}
