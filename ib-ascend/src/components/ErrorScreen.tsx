import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { Button, Card } from './ui';

/** Shown instead of a blank page if a screen throws. Your data is untouched. */
export function ErrorScreen() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error instanceof Error ? error.message : String(error);
  return (
    <div className="mx-auto max-w-lg p-6">
      <Card>
        <h1 className="text-lg font-semibold">Something went wrong on this screen</h1>
        <p className="mt-2 text-sm text-muted">Your progress is saved in this browser and hasn’t been affected. Try reloading; if it keeps happening, export a backup from Settings.</p>
        <pre className="mt-3 overflow-x-auto rounded-md bg-sunk p-2 text-xs text-bad">{message}</pre>
        <div className="mt-4 flex gap-2">
          <Button variant="primary" onClick={() => window.location.reload()}>
            Reload
          </Button>
          <Link to="/">
            <Button>Dashboard</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
