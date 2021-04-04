interface Operator {
  osc: OscillatorNode;
  oscGain: GainNode;
  lfo: OscillatorNode;
  panner: StereoPannerNode;
}

const NUM_OSCS = 8;

export class ChordSynth {
  private readonly context: AudioContext;

  private readonly gain: GainNode;

  private readonly operators: Operator[];

  public constructor(context: AudioContext, output: GainNode) {
    // Create audio context
    this.context = context;

    // Create gains
    this.gain = this.context.createGain();
    this.gain.gain.value = 0.9;
    this.gain.connect(output);

    // Operators is empty array (for now)
    this.operators = [];

    for (let i = 0; i < NUM_OSCS; i++) {
      const op: Operator = {
        osc: this.context.createOscillator(),
        oscGain: this.context.createGain(),
        lfo: this.context.createOscillator(),
        panner: this.context.createStereoPanner(),
      };
      op.osc.start();
      op.lfo.start();
      op.osc.connect(op.oscGain);
      op.lfo.connect(op.panner.pan);
      op.oscGain.connect(op.panner);
      op.panner.connect(this.gain);
      op.oscGain.gain.value = 0.0;
      op.lfo.frequency.value = i + 1;
      this.operators.push(op);
    }
  }

  public play(notes: number[][], duration: number): void {
    const now = this.context.currentTime;

    this.operators.forEach((op, i) => {
      if (notes[i]) {
        op.oscGain.gain.value = 1.0;
        op.osc.frequency.cancelScheduledValues(0);
        op.osc.frequency.setValueAtTime(op.osc.frequency.value, now);
        op.osc.frequency.linearRampToValueAtTime(notes[i][0], now + duration);
      } else {
        //op.oscGain.gain.value = 0;
      }
    });
  }
}
