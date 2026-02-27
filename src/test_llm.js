import { getLLMProvider } from "./llm/index.js";

const llm = getLLMProvider();

const answer = await llm.generateAnswer("Say OK");

console.log("LLM says:", answer);