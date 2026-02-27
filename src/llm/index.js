import { LocalMistralProvider } from "./LocalMistralProvider.js";

export function getLLMProvider() {
  // later: switch via env variable
  return new LocalMistralProvider();
}


// if (process.env.LLM_MODE === "api") {
//   return new ApiLLMProvider();
// }