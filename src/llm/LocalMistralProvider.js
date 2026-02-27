import { LLMProvider } from "./LLMProvider.js";
import http from "http";

export class LocalMistralProvider extends LLMProvider {
  async generateAnswer(prompt) {
    const payload = JSON.stringify({
      model: "mistral",
      prompt,
      stream: false,
    });

    const options = {
      hostname: "localhost",
      port: 11434,
      path: "/api/generate",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk.toString();
        });

        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json.response?.trim());
          } catch (err) {
            reject(new Error("Invalid response from Ollama"));
          }
        });
      });

      req.on("error", (err) => reject(err));

      req.write(payload);
      req.end();
    });
  }
}
