import { normalize, similarity } from "./qaMatcher.js";

export function findAnswerFromQA(query, qaData, threshold = 0.6) {
  const normalizedQuery = normalize(query);

  let bestMatch = null;
  let bestScore = 0;

  for (const qa of qaData) {
    const score = similarity(normalizedQuery, normalize(qa.question));

    if (score > bestScore) {
      bestScore = score;
      bestMatch = qa;
    }
  }

  if (bestScore >= threshold) {
    return {
      answer: bestMatch.answer,
      source: bestMatch.source,
      confidence: bestScore,
    };
  }

  return null;
}
