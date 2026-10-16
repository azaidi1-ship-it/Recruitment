import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

if (import.meta.env.DEV) {
  // Dev-only handle for manual QA from the browser console.
  void import('./services/progression').then((m) => {
    (window as unknown as { __ibAscend: typeof m }).__ibAscend = m;
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
