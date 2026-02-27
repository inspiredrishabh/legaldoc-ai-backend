const ACT_KEYWORDS = {
  IPC: ["ipc", "penal", "murder", "theft", "rape", "crime"],
  CRPC: ["crpc", "procedure", "bail", "arrest", "trial"],
  CPC: ["cpc", "civil procedure", "suit", "injunction"],
  IEA: ["evidence", "proof", "witness"],
  HMA: ["marriage", "divorce", "husband", "wife"],
  IDA: ["divorce act"],
  MVA: ["motor", "vehicle", "accident"],
  NIA: ["cheque", "negotiable", "dishonour"]
};

export function detectActs(tokens) {
  const detected = new Set();

  for (const [act, keywords] of Object.entries(ACT_KEYWORDS)) {
    for (const word of tokens) {
      if (keywords.includes(word)) {
        detected.add(act);
      }
    }
  }

  return detected.size > 0 ? [...detected] : ["IPC", "CRPC"];
}