import { getLLMProvider } from "./llm/index.js";

const llm = getLLMProvider();

const answer = await llm.generateAnswer(
  "Answer in one line: What is bail?"
);

console.log(answer);