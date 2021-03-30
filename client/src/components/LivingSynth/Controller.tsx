import { ChordSynth } from "./ChordSynth";
import { MarkovChain } from "./markovChain";
import { SCALES } from "./scales";
import { FmPreset, FmSynth } from "../FmSynth";

const mtof = (midi: number) => {
  return Math.pow(2, (midi - 69) / 12) * 440;
};

const PRESET: FmPreset = {
  name: "Basic",
  gain: 0.2,
  op1: {
    dest: "out",
    type: "sine",
    ratio: 1.0,
    feedback: 0.0,
    level: 1.0,
    adsr: {
      attackLevel: 0.0,
      attackTime: 0.01,
      decayLevel: 0.7,
      decayTime: 0.01,
      sustainLevel: 0.7,
      sustainTime: 7.0,
      releaseLevel: 0.0,
      releaseTime: 0.0,
    },
  },
  op2: {
    dest: "op1",
    type: "sine",
    ratio: 0.5,
    feedback: 0.0,
    level: 500.0,
    adsr: {
      attackLevel: 0.0,
      attackTime: 0.01,
      decayLevel: 1.0,
      decayTime: 0.01,
      sustainLevel: 8.0,
      sustainTime: 0.0,
      releaseLevel: 0.0,
      releaseTime: 0.0,
    },
  },
};

export class Controller {
  private readonly context: AudioContext;

  private readonly gain: GainNode;

  //private readonly convolver: ConvolverNode;

  private scaleChain: MarkovChain;

  private chords: ChordSynth;

  private leadSynth: FmSynth;

  private scale: number[];

  private preset: FmPreset = PRESET;

  public constructor(context: AudioContext) {
    // Create audio context
    this.context = context;

    // Create convolver
    //this.convolver = this.context.createConvolver();
    //this.getImpulseBuffer("impulse.ogg");

    // Create gains
    this.gain = this.context.createGain();
    this.gain.gain.value = 0.1;

    // Wiring
    this.gain.connect(this.context.destination);

    // Create chord component
    this.chords = new ChordSynth(this.context, this.gain);

    // Create lead synth component
    this.leadSynth = new FmSynth(this.context, this.gain);
    this.leadSynth.changeInstrument(this.preset);

    // Setup scaleChain
    this.scaleChain = new MarkovChain(
      [
        {
          current: "acoustic",
          next: "aeolian",
        },
        {
          current: "aeolian",
          next: "algerian",
        },
        {
          current: "algerian",
          next: "augmented",
        },
        {
          current: "bkyes",
          next: "chromatic",
        },
        {
          current: "algerian",
          next: "bkyes",
        },
        {
          current: "chromatic",
          next: "yo",
        },
        {
          current: "yo",
          next: "acoustic",
        },
      ],
      "acoustic"
    );

    // Initial scale
    this.scale = SCALES[this.scaleChain.next()];
  }

  public evolve(data: number[][]): void {
    // Get chord
    // this.scale = SCALES[this.scaleChain.next()];

    const data_chord = data.map((arr) => arr.reduce((i, c) => c + i, 0));

    // Adjust transpose
    const notes = data_chord.flatMap((val, index) => {
      if (val === 0) {
        return [];
      }

      return [[mtof(this.scale[index % this.scale.length] + 60), val]];
    });

    // Chords
    this.chords.play(notes, 10);

    // Random note in scale
    this.leadSynth.play(notes[0]?.[0] ?? 0);
    // this.leadSynth.changeInstrument(this.preset);
  }

  public paramChange(x: number, y: number, z: number): void {
    this.leadSynth.changeInstrument({
      ...this.preset,
      op1: { ...this.preset.op1, ratio: z / 100.0 },
      op2: { ...this.preset.op2, level: x, ratio: y / 1000.0 },
    });
  }

  public setScale(scale: number[]): void {
    this.scale = scale;
  }

  public createAnalyser(): AnalyserNode {
    const analyser = this.context.createAnalyser();
    analyser.fftSize = 256;
    this.gain.connect(analyser);
    return analyser;
  }

  // private async getImpulseBuffer(impulseUrl: string): Promise<void> {
  //   const buffer = await fetch(impulseUrl)
  //     .then((response) => response.arrayBuffer())
  //     .then((arrayBuffer) => this.context.decodeAudioData(arrayBuffer));

  //   this.convolver.buffer = buffer;
  // }
}
