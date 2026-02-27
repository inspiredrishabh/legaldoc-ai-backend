export function extractSectionNumbers(query) {
  const matches = query.match(/section\s+(\d+[a-z]?)/gi);
  if (!matches) return [];

  return matches.map(m =>
    m.replace(/section/i, "")
     .replace(/\./g, "")
     .trim()
  );
}