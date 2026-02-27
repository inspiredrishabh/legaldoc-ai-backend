// import { loadAllActs } from "./loaders/actLoader.js";
// import { loadAllQA } from "./loaders/qaLoader.js";

// console.log("🔄 Loading legal datasets...");

// const acts = loadAllActs();
// const qa = loadAllQA();

// console.log("✅ Total Act sections loaded:", acts.length);
// console.log("✅ Total QA pairs loaded:", qa.length);

// // sanity check
// console.log(acts[0]);
// console.log(qa[0]);

// import { loadAllActs } from "./loaders/actLoader.js";
// import { retrieveRelevantSections } from "./retrieval/retrieveSections.js";

// const acts = loadAllActs();

// const results = retrieveRelevantSections(
//   "What is bail under Section 437 CrPC?",
//   acts
// );

// console.log(results);

import { loadAllActs } from "./loaders/actLoader.js";
import { retrieveRelevantSections } from "./retrieval/retrieveSections.js";
import { buildContext } from "./context/contextBuilder.js";

const acts = loadAllActs();

const sections = retrieveRelevantSections(
  "What is bail under Section 437 CrPC?",
  acts
);

console.log("🔍 Retrieved sections count:", sections.length);
console.dir(sections, { depth: 2 });

const context = buildContext(sections);

console.log("----- CONTEXT START -----");
console.log(context);
console.log("----- CONTEXT END -----");