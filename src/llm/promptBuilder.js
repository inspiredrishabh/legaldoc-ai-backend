export function buildPrompt(context, question) {
  return `
You are a legal assistant.
Answer ONLY using the context below.
If the answer is not present in the context, say:
"I do not have sufficient information from the provided legal text."

Context:
${context}

Question:
${question}

Answer:
`.trim();
}