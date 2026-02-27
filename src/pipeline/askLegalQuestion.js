import { findAnswerFromQA } from "../qa/qaRetriever.js";
import { retrieveRelevantSections } from "../retrieval/retrieveSections.js";
import { buildContext } from "../context/contextBuilder.js";
import { getLLMProvider } from "../llm/index.js";
import { buildPrompt } from "../llm/promptBuilder.js";
import { checkLLMConnection } from "../llm/healthCheck.js";

export async function askLegalQuestion(query, actsData, qaData) {
  // 1️⃣ Try QA dataset first
  const qaResult = findAnswerFromQA(query, qaData);

  if (qaResult && qaResult.confidence >= 0.85) {
    return {
      answer: qaResult.answer,
      source: qaResult.source,
      method: "qa_dataset",
      confidence: qaResult.confidence
    };
  }

  // 2️⃣ Retrieve relevant legal sections
  const sections = retrieveRelevantSections(query, actsData);

  if (!sections || sections.length === 0) {
    return {
      answer:
        "No relevant legal provision was found for this query in the available Acts.",
      source: "acts",
      method: "fallback"
    };
  }

  // 3️⃣ Build context
  const context = buildContext(sections);

  if (!context || context.length < 100) {
    return {
      answer:
        "Relevant legal provisions were found, but insufficient text was available to generate a reliable explanation.",
      source: "acts",
      method: "fallback"
    };
  }

  // 4️⃣ Check LLM availability
  const llmAvailable = await checkLLMConnection();

  if (!llmAvailable) {
    return {
      answer:
        "AI engine is currently unavailable. Showing legal text-based information only.",
      source: "system",
      method: "no_llm"
    };
  }

  // 5️⃣ Call LLM
  const llm = getLLMProvider();
  const prompt = buildPrompt(context, query);

  let llmAnswer;
  try {
    llmAnswer = await llm.generateAnswer(prompt);
  } catch (err) {
    return {
      answer:
        "An error occurred while generating an AI-based explanation.",
      source: "llm",
      method: "error"
    };
  }

  if (!llmAnswer || llmAnswer.trim().length === 0) {
    return {
      answer:
        "The AI model could not generate a reliable answer from the provided legal context.",
      source: "llm",
      method: "fallback"
    };
  }

  // 6️⃣ Final successful response
  return {
    answer: llmAnswer,
    source: "LLM + Legal Acts",
    method: "llm"
  };
}