export function buildContext(sections, maxChars = 3000) {
  let context = "";
  let usedChars = 0;

  for (const sec of sections) {
    const header =
      `Act: ${sec.act}\n` +
      `Section: ${sec.section}\n` +
      `Title: ${sec.title}\n`;

    const cleanText = sec.text.replace(/\s+/g, " ").trim();

    let block = `${header}${cleanText}\n\n`;

    // 🔑 CASE 1: first block itself is too large → truncate
    if (usedChars === 0 && block.length > maxChars) {
      context += block.slice(0, maxChars);
      break;
    }

    // CASE 2: normal accumulation
    if (usedChars + block.length > maxChars) {
      break;
    }

    context += block;
    usedChars += block.length;
  }

  return context.trim();
}
