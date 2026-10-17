import { Printer } from 'lucide-react';
import { Blocks } from '../../components/Blocks';
import { Button } from '../../components/ui';
import { useSection } from './useSection';
import { isEmbedded } from '../../lib/saveFile';

/** One-page printable summary. Print styles hide the app chrome. */
export function CheatSheet() {
  const ctx = useSection();
  if (!ctx) return null;
  const sheet = ctx.content.cheatSheet;
  if (!sheet) return <p className="text-sm text-muted">No cheat sheet yet.</p>;
  return (
    <div className="mx-auto max-w-3xl">
      {!isEmbedded() && (
        <div className="no-print mb-4 flex justify-end">
          <Button onClick={() => window.print()}>
            <Printer size={16} /> Print
          </Button>
        </div>
      )}
      <article className="print-sheet">
        <h2 className="mb-4 text-xl font-semibold">
          {ctx.section.number}. {ctx.section.title}: cheat sheet
        </h2>
        <div className="columns-1 gap-6 md:columns-2 [&>div>*]:mb-3">
          <Blocks blocks={sheet.blocks} compact />
        </div>
      </article>
    </div>
  );
}
