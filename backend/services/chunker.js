export function chunkText(text, options = {}) {
  const chunkSize = options.chunkSize || 500;
  const overlap = options.overlap || 50;

  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];

  for (let start = 0; start < words.length; start += chunkSize - overlap) {
    const end = Math.min(start + chunkSize, words.length);
    const chunk = words.slice(start, end).join(" ");

    if (chunk.trim()) {
      chunks.push({
        text: chunk,
        startWord: start,
        endWord: end
      });
    }

    if (end === words.length) break;
  }

  return chunks;
}
