import { getLLMProvider } from "./llm/index.js";
import { buildPrompt } from "./llm/promptBuilder.js";

const llm = getLLMProvider();

const context = `
Act: CRPC
Section: 437
Title: When bail may be taken in case of non-bailable offence
Bail may be granted at the discretion of the court...
`;

const question = "When can bail be granted under Section 437?";

const prompt = buildPrompt(context, question);

const answer = await llm.generateAnswer(prompt);

console.log("LLM Answer:");
console.log(answer);
