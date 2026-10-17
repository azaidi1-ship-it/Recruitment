/**
 * Save a generated file. Inside an embedded viewer (a published artifact)
 * plain download links are blocked, so the viewer's own save capability is
 * used when it exists; everywhere else a normal download link.
 */
type Downloads = { save: (r: { filename: string; data: Blob | string }) => Promise<unknown> };
type ClaudeHost = { use: (name: 'downloads') => Promise<Downloads | null> };

export async function saveFile(filename: string, data: Blob): Promise<void> {
  const host = (window as unknown as { claude?: ClaudeHost }).claude;
  if (host?.use) {
    const downloads = await host.use('downloads');
    if (downloads) {
      await downloads.save({ filename, data });
      return;
    }
  }
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** True when running inside another page's frame (where printing is unavailable). */
export function isEmbedded(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}
