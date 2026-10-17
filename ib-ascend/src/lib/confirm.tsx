import { useEffect } from 'react';
import { create } from 'zustand';
import { Button } from '../components/ui';

interface Pending {
  message: string;
  confirmLabel: string;
  resolve: (ok: boolean) => void;
}

const useConfirmStore = create<{ pending: Pending | null }>(() => ({ pending: null }));

/**
 * An in-app replacement for window.confirm, which some hosts (embedded
 * viewers) answer "no" without showing anything. Resolves true on confirm.
 */
export function confirmAction(message: string, confirmLabel = 'Confirm'): Promise<boolean> {
  return new Promise((resolve) => {
    useConfirmStore.getState().pending?.resolve(false);
    useConfirmStore.setState({ pending: { message, confirmLabel, resolve } });
  });
}

function close(ok: boolean) {
  const p = useConfirmStore.getState().pending;
  useConfirmStore.setState({ pending: null });
  p?.resolve(ok);
}

export function ConfirmHost() {
  const pending = useConfirmStore((s) => s.pending);
  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pending]);
  if (!pending) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-bg/70 p-6 backdrop-blur-sm" onClick={() => close(false)}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Confirm"
        className="anim-fade-in w-full max-w-sm rounded-2xl border border-line bg-surface p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm leading-relaxed">{pending.message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button autoFocus onClick={() => close(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => close(true)}>
            {pending.confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
