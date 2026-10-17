import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { hydrateAll } from './store/bootstrap';
import { useSettingsStore } from './store/useSettingsStore';

export function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useSettingsStore((s) => s.settings.theme);
  const reduceMotion = useSettingsStore((s) => s.settings.reduceMotion);

  useEffect(() => {
    hydrateAll()
      .then(() => setReady(true))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
  }, [reduceMotion]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg p-6 text-sm">
        <h1 className="mb-2 text-lg font-semibold text-bad">Couldn’t open your local data</h1>
        <p className="text-muted">
          IB Ascend stores progress in this browser’s IndexedDB. It may be disabled (for example in a private
          window). Details: {error}
        </p>
      </div>
    );
  }
  if (!ready) return <div className="p-6 text-sm text-muted">Loading…</div>;
  return <RouterProvider router={router} />;
}
