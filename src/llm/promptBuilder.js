export function buildPrompt(context, question) {
  return `
You are a legal assistant.
If the document is in Hindi, respond in Hindi.
If in English, respond in English.
Answer using the context below.

Context:
${context}

Question:
${question}

Answer:
`.trim();
}
