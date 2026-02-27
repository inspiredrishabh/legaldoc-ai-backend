export function rankSections(sections, tokens) {
  return sections
    .map(sec => {
      let score = 0;

      for (const token of tokens) {
        if (sec.text.toLowerCase().includes(token)) score += 2;
        if (sec.title.toLowerCase().includes(token)) score += 3;
      }

      return { ...sec, score };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score);
}