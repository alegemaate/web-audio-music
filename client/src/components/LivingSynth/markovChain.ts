interface Sequence {
  current: string;
  next: string;
}

export class MarkovChain {
  private readonly chain: Record<string, string[]>;

  private current: string;

  constructor(values: Sequence[], start: string) {
    this.chain = {};
    for (let i = 0; i < values.length; i++) {
      let seq = values[i];
      if (!this.chain[seq.current]) {
        this.chain[seq.current] = [];
      }
      this.chain[seq.current].push(seq.next);
    }

    this.current = start;
  }

  next(): string {
    const currentChain = this.chain[this.current];

    if (currentChain) {
      this.current =
        currentChain[Math.floor(Math.random() * currentChain.length)];
    }

    return this.current;
  }
}
