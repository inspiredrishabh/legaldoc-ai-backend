export function analyzeQuery(query) {
  const normalized = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const tokens = normalized.split(" ");

  return {
    original: query,
    normalized,
    tokens
  };
}