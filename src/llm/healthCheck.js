import { spawn } from "child_process";

export async function checkLLMConnection(timeoutMs = 5000) {
  return new Promise((resolve) => {
    const ollama = spawn("ollama", ["list"]);

    let responded = false;

    ollama.stdout.on("data", () => {
      responded = true;
    });

    ollama.on("close", (code) => {
      if (responded && code === 0) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    // timeout safety
    setTimeout(() => {
      resolve(false);
    }, timeoutMs);
  });
}
