export function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function similarity(a, b) {
  const A = new Set(a.split(" "));
  const B = new Set(b.split(" "));

  const intersection = [...A].filter((x) => B.has(x));
  return intersection.length / Math.max(A.size, B.size);
}
