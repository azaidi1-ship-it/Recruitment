import { Link } from 'react-router-dom';
import { SECTIONS, SECTION_BY_ID } from '../../content/sections';
import { STAT_LABEL, type StatKey } from '../../types/models';
import { Badge, Card, PageHeader } from '../../components/ui';

/**
 * Phase 1: lists the tree and its prerequisites.
 * TODO(Phase 2): lock/unlock state from engine/unlocks.ts and mastery colors.
 */
export function SkillTree() {
  return (
    <>
      <PageHeader
        title="Skill Tree"
        subtitle="Accounting → Walk-throughs → EV vs Equity → Valuation → (Comps, DCF) → M&A → LBO → Restructuring. Mental Math, Markets and Fit are always open."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s) => (
          <Link key={s.id} to={`/section/${s.id}`} className="block">
            <Card className="h-full transition hover:border-faint">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-faint tabular">Section {s.number}</span>
                {s.alwaysOpen ? <Badge tone="info">Always open</Badge> : null}
              </div>
              <h2 className="font-semibold">{s.title}</h2>
              <p className="mt-1 text-sm text-muted">{s.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Object.keys(s.statWeights).map((k) => (
                  <Badge key={k} tone="accent">
                    {STAT_LABEL[k as StatKey]}
                  </Badge>
                ))}
              </div>
              {s.prerequisites.length > 0 && (
                <p className="mt-3 text-xs text-faint">
                  Requires: {s.prerequisites.map((p) => SECTION_BY_ID[p].shortTitle).join(' + ')}
                </p>
              )}
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
