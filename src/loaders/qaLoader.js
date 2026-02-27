import fs from "fs";
import path from "path";
import { QA_DIR } from "../config/paths.js";

export function loadAllQA() {
  const qaPairs = [];

  const files = fs.readdirSync(QA_DIR);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const source = file.replace(".json", "").toUpperCase();
    const raw = JSON.parse(
      fs.readFileSync(path.join(QA_DIR, file), "utf-8")
    );

    raw.forEach(item => {
      qaPairs.push({
        source,
        question: item.question,
        answer: item.answer
      });
    });
  }

  return qaPairs;
}