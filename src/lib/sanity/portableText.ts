// Tiny Portable Text → plain string reducer. Used where a full rich-text
// render is overkill (card blurbs, meta descriptions). Only walks `block`
// nodes and their spans; anything else is ignored.

interface PtSpan {
  _type?: string;
  text?: string;
}
interface PtBlock {
  _type?: string;
  children?: PtSpan[];
}

export function blocksToPlainText(blocks?: unknown): string {
  if (!Array.isArray(blocks)) return '';
  return (blocks as PtBlock[])
    .filter((b) => b && b._type === 'block' && Array.isArray(b.children))
    .map((b) => (b.children ?? []).map((c) => c.text ?? '').join(''))
    .join('\n\n')
    .trim();
}

/** First non-empty paragraph of a Portable Text body, for one-line summaries. */
export function firstLine(blocks?: unknown): string | undefined {
  const text = blocksToPlainText(blocks);
  if (!text) return undefined;
  return text.split('\n').find((line) => line.trim().length > 0)?.trim();
}
