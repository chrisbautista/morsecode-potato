/** Trigger a browser download of a Blob. No-op outside the browser. */
export function saveBlob(blob: Blob, filename: string): void {
  if (typeof document === "undefined") return;
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/** Trigger a browser download of plain text. No-op outside the browser. */
export function saveText(text: string, filename: string): void {
  saveBlob(new Blob([text], { type: "text/plain" }), filename);
}
