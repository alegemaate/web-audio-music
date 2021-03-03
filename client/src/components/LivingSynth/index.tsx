import { getChord } from "../../helpers/chords";
import { MarkovChain } from "../../helpers/markovChain";

interface Operator {
  osc: OscillatorNode;
  oscGain: GainNode;
  lfo: OscillatorNode;
  panner: StereoPannerNode;
}

const NUM_OSCS = 4;
const STEP_TIME = 2000;
const SEQ_LENGTH = 4;

const mtof = (midi: number) => {
  return Math.pow(2, (midi - 69) / 12) * 440;
};

export class LivingSynth {
  private readonly context: AudioContext;

  private readonly gain: GainNode;

  private readonly convolver: ConvolverNode;

  private readonly analyser: AnalyserNode;

  private readonly operators: Operator[];

  private interval: number;

  private chain: MarkovChain;

  private readonly arpOp: Operator;

  private step: number;

  public constructor() {
    // Create audio context
    this.context = new AudioContext();
    this.context.resume();

    // Create convolver
    this.convolver = this.context.createConvolver();
    this.getImpulseBuffer("impulse.ogg");

    // Create analyser
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 256;

    // Create gains
    this.gain = this.context.createGain();
    this.gain.gain.value = 0.1;

    // Wiring
    this.gain.connect(this.convolver);
    this.convolver.connect(this.context.destination);
    this.gain.connect(this.analyser);

    // Set up arp op
    this.arpOp = {
      osc: this.context.createOscillator(),
      oscGain: this.context.createGain(),
      lfo: this.context.createOscillator(),
      panner: this.context.createStereoPanner(),
    };
    this.arpOp.osc.type = "triangle";
    this.arpOp.osc.start();
    this.arpOp.lfo.start();
    this.arpOp.osc.connect(this.arpOp.oscGain);
    this.arpOp.lfo.connect(this.arpOp.panner.pan);
    this.arpOp.oscGain.connect(this.arpOp.panner);
    this.arpOp.panner.connect(this.gain);
    this.arpOp.oscGain.gain.value = 0.1;
    this.arpOp.lfo.frequency.value = 0.1;

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
      op.oscGain.gain.value = 1.0;
      op.lfo.frequency.value = i + 1;
      this.operators.push(op);
    }

    // No interval
    this.interval = -1;

    // Setup chain
    this.chain = new MarkovChain(
      [
        {
          current: "C-M7",
          next: "F-M7",
        },
        {
          current: "C-M7",
          next: "F-M7",
        },
        {
          current: "F-M7",
          next: "C-M7",
        },
        {
          current: "F-M7",
          next: "E-m7",
        },
        {
          current: "E-m7",
          next: "D-M7",
        },
        {
          current: "D-M7",
          next: "F-M7",
        },
        {
          current: "D-M7",
          next: "C-M7",
        },
      ],
      "C-M7"
    );

    // Step
    this.step = 0;
  }

  public start(): void {
    if (this.interval !== -1) {
      window.clearInterval(this.interval);
      this.interval = -1;
    }
    this.interval = window.setInterval(this.evolve.bind(this), STEP_TIME);
    this.evolve();
  }

  public evolve(): void {
    const chord = this.chain.next();

    // Adjust transpose
    const notes = getChord(24, chord);
    const now = this.context.currentTime;

    this.operators.forEach((op, i) => {
      op.osc.frequency.cancelScheduledValues(0);
      op.osc.frequency.setValueAtTime(op.osc.frequency.value, now);
      // Try other interpolation
      op.osc.frequency.linearRampToValueAtTime(
        mtof(notes[i] ?? 0),
        now + STEP_TIME / 11000.0
      );
    });

    // Arp op
    this.arpOp.osc.frequency.cancelScheduledValues(0);
    this.step += 1;

    for (let i = 0; i < SEQ_LENGTH; i++) {
      let nextNote = notes[Math.floor(Math.random() * notes.length)] ?? 0;
      // Resolve on root
      if (this.step % SEQ_LENGTH === 0) {
        nextNote = notes[0] ?? 0;
      }
      console.log(nextNote);
      const freq = mtof(nextNote + 24);
      this.arpOp.osc.frequency.setValueAtTime(
        freq,
        now + (STEP_TIME / (1000.0 * SEQ_LENGTH)) * i
      );
    }

    console.log(chord, notes, this.step % SEQ_LENGTH);
  }

  public getAnalyser(): AnalyserNode {
    return this.analyser;
  }

  private async getImpulseBuffer(impulseUrl: string): Promise<void> {
    const buffer = await fetch(impulseUrl)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => this.context.decodeAudioData(arrayBuffer));

    this.convolver.buffer = buffer;
  }
}
