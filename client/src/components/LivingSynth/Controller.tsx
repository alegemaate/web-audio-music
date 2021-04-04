import { MarkovChain } from "./markovChain";
import { SCALES } from "./scales";
import { FmPreset, FmSynth } from "../FmSynth";
import { AdditiveSynth } from "../AdditiveSynth";
import { DrumMachine } from "../DrumMachine";

const mtof = (midi: number) => {
  return Math.pow(2, (midi - 69) / 12) * 440;
};

const PRESET: FmPreset = {
  name: "Basic",
  gain: 0.1,
  op1: {
    dest: "out",
    type: "sawtooth",
    ratio: 0.5,
    feedback: 0.0,
    level: 1.0,
    adsr: {
      attackLevel: 0.0,
      attackTime: 0.0,
      decayLevel: 1.0,
      decayTime: 0.0,
      sustainLevel: 1.0,
      sustainTime: 0.0,
      releaseLevel: 0.0,
      releaseTime: 0.0,
    },
  },
  op2: {
    dest: "op1",
    type: "sine",
    ratio: 0.0,
    feedback: 0.0,
    level: 0.0,
    adsr: {
      attackLevel: 0.0,
      attackTime: 0.0,
      decayLevel: 1.0,
      decayTime: 0.02,
      sustainLevel: 1.0,
      sustainTime: 0.0,
      releaseLevel: 0.0,
      releaseTime: 0.0,
    },
  },
};

export class Controller {
  private readonly context: AudioContext;

  private readonly gain: GainNode;

  private scaleChain: MarkovChain;

  private chords: AdditiveSynth[];

  private leadSynth: FmSynth;

  private drumMachine: DrumMachine;

  private scale: number[];

  private preset: FmPreset = PRESET;

  public constructor(context: AudioContext, gain: GainNode) {
    // Create audio context
    this.context = context;

    // Create gains
    this.gain = this.context.createGain();
    this.gain.gain.value = 1.0;

    // Wiring
    this.gain.connect(gain);

    // Create chord component
    this.chords = [];
    this.chords.push(new AdditiveSynth(this.context, this.gain));
    this.chords.push(new AdditiveSynth(this.context, this.gain));
    this.chords.push(new AdditiveSynth(this.context, this.gain));
    this.chords.push(new AdditiveSynth(this.context, this.gain));
    this.chords.push(new AdditiveSynth(this.context, this.gain));
    this.chords.push(new AdditiveSynth(this.context, this.gain));
    this.chords.push(new AdditiveSynth(this.context, this.gain));
    this.chords.push(new AdditiveSynth(this.context, this.gain));

    this.drumMachine = new DrumMachine(context, gain);

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
          current: "blues",
          next: "chromatic",
        },
        {
          current: "algerian",
          next: "blues",
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

  public evolve(data: number[]): void {
    // Get chord
    // this.scale = SCALES[this.scaleChain.next()];

    // Adjust transpose
    const notes = data.flatMap((val, index) => {
      if (val === 0) {
        return [];
      }

      return [mtof(this.scale[index % this.scale.length] + 48)];
    });

    // Chords
    this.chords.forEach((op, i) => {
      if (notes[i]) {
        op.play(notes[i]);
      } else {
        op.play(0);
      }
    });

    // Random note in scale
    if (notes[0]) {
      this.leadSynth.play(notes[0]);
    }
  }

  public paramChange(x: number, y: number, z: number): void {
    this.preset.op1.adsr.attackTime = x;
    this.preset.op1.adsr.decayTime = y;
    this.preset.op1.adsr.releaseTime = z;
    this.leadSynth.changeInstrument(this.preset);
  }

  public paramChange2(x: number, y: number, z: number): void {
    this.preset.op2.level = x * 2000.0;
    this.preset.op2.ratio = y * 10.0;
    this.preset.op2.adsr.attackTime = z;
    this.leadSynth.changeInstrument(this.preset);
  }

  public drums(data: number[]) {
    this.drumMachine.play(data);
  }

  public setPoints(pts: { real: Float32Array; imag: Float32Array }): void {
    this.chords.forEach((op) => {
      op.setPoints(pts);
    });
  }

  public setScale(scale: number[]): void {
    this.scale = scale;
  }

  public setPolyVol(vol: number): void {
    this.chords.forEach((op) => {
      op.setVol(vol);
    });
  }

  public setMonoVol(vol: number): void {
    this.leadSynth.setVol(vol);
  }

  public setDrumVol(vol: number): void {
    this.drumMachine.setVol(vol);
  }

  public setDrumDist(vol: number): void {
    this.drumMachine.setDist(vol);
  }

  public setPolyDist(vol: number): void {
    this.chords.forEach((op) => {
      op.setDist(vol);
    });
  }
}
