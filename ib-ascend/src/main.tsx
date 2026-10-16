import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

if (import.meta.env.DEV) {
  // Dev-only handle for manual QA from the browser console.
  void Promise.all([import('./services/progression'), import('./content/registry'), import('./db/db')]).then(([progression, content, database]) => {
    Object.assign(window, { __ibAscend: progression, __ibContent: content, __ibDb: database.db });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
