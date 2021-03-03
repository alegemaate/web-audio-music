interface ChordSequence {
  chord: string;
  next: string;
}

/**
 * Get the chain
 */
export function markovChords(values: ChordSequence[]) {
  const chain: Record<string, string[]> = {};

  for (let i = 0; i < values.length; i++) {
    let seq = values[i];
    if (!chain[seq.chord]) {
      chain[seq.chord] = [];
    }
    chain[seq.chord].push(seq.next);
  }

  return chain;
}

/**
 * Generate next chord
 */
