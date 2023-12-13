interface Sequence {
  current: string;
  next: string;
}

export class MarkovChain {
  private readonly chain: Record<string, string[]>;

  private current: string;

  public constructor(values: Sequence[], start: string) {
    this.chain = {};

    for (const seq of values) {
      if (!(this.chain[seq.current] as string[] | undefined)) {
        this.chain[seq.current] = [];
      }

      this.chain[seq.current].push(seq.next);
    }

    this.current = start;
  }

  public next(): string {
    const currentChain = this.chain[this.current] as string[] | undefined;

    if (currentChain) {
      this.current =
        currentChain[Math.floor(Math.random() * currentChain.length)];
    }

    return this.current;
  }
}
