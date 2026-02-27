import { analyzeQuery } from "./queryAnalyzer.js";
import { detectActs } from "./actMatcher.js";
import { extractSectionNumbers } from "./sectionMatcher.js";
import { rankSections } from "./ranker.js";

export function retrieveRelevantSections(query, actsData, limit = 5) {
  const { normalized, tokens } = analyzeQuery(query);
  const acts = detectActs(tokens);
  const sections = extractSectionNumbers(normalized);

  let candidates = actsData.filter((sec) => acts.includes(sec.act));

  if (sections.length > 0) {
    candidates = candidates.filter((sec) => {
      const normalized = (sec.section || "")
        .toString()
        .replace(/[^0-9a-z]/gi, "")
        .toLowerCase();

      return sections.some((s) => normalized.startsWith(s.toLowerCase()));
    });
  }
  if (sections.length > 0 && candidates.length === 0) {
    candidates = actsData.filter((sec) => acts.includes(sec.act));
  }
  //   console.log("Detected Acts:", acts);
  //   console.log("Detected Sections:", sections);
  //   console.log("Candidates before ranking:", candidates.length);
  const ranked = rankSections(candidates, tokens);

  return ranked.slice(0, limit);
}
