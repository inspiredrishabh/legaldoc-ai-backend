import { spawn } from "child_process";
import { LLMProvider } from "./LLMProvider.js";

export class LocalMistralProvider extends LLMProvider {
  async generateAnswer(prompt) {
    return new Promise((resolve, reject) => {
      const ollama = spawn("ollama", ["run", "mistral"], {
        stdio: ["pipe", "pipe", "pipe"]
      });

      let output = "";
      let error = "";

      ollama.stdout.on("data", (data) => {
        output += data.toString();
      });

      ollama.stderr.on("data", (data) => {
        error += data.toString();
      });

      ollama.on("close", (code) => {
        if (code !== 0) {
          reject(
            new Error(
              error || `Ollama exited with code ${code}`
            )
          );
        } else {
          resolve(output.trim());
        }
      });

      ollama.on("error", (err) => {
        reject(err);
      });

      // ✅ Send prompt safely via stdin
      ollama.stdin.write(prompt);
      ollama.stdin.end();
    });
  }
}