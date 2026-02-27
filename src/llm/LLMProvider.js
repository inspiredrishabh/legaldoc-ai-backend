// This is a CONTRACT, not an implementation
export class LLMProvider {
  async generateAnswer(prompt) {
    throw new Error("generateAnswer() must be implemented");
  }
}
