import fs from "fs";
import path from "path";
import { ACTS_DIR } from "../config/paths.js";

export function loadAllActs() {
  const acts = [];

  const files = fs.readdirSync(ACTS_DIR);

  for (const file of files) {
    if (!file.endsWith(".json")) continue;

    const actName = file.replace(".json", "").toUpperCase();
    const raw = JSON.parse(
      fs.readFileSync(path.join(ACTS_DIR, file), "utf-8")
    );

    raw.forEach(section => {
      acts.push({
        act: actName,
        section: section.section || section.Section || null,
        title: section.title || section.section_title || "",
        text: section.description || section.section_desc || ""
      });
    });
  }

  return acts;
}