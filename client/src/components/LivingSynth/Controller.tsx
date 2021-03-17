import { ChordSynth } from "./ChordSynth";
import { getChord } from "./chords";
import { MarkovChain } from "./markovChain";
import { SCALES } from "./scales";
import { FmSynth, FM_INSTRUMENTS } from "../FmSynth";

const STEP_TIME = 500;

const mtof = (midi: number) => {
  return Math.pow(2, (midi - 69) / 12) * 440;
};

export class Controller {
  private readonly context: AudioContext;

  private readonly gain: GainNode;

  private readonly convolver: ConvolverNode;

  private interval: number;

  private chordChain: MarkovChain;

  private chords: ChordSynth;

  private leadSynth: FmSynth;

  private scale: number[];

  public constructor(context: AudioContext) {
    // Create audio context
    this.context = context;

    // Create convolver
    this.convolver = this.context.createConvolver();
    this.getImpulseBuffer("impulse.ogg");

    // Create gains
    this.gain = this.context.createGain();
    this.gain.gain.value = 0.1;

    // Wiring
    this.gain.connect(this.convolver);
    this.convolver.connect(this.context.destination);

    // Create chord component
    this.chords = new ChordSynth(this.context, this.gain);

    // Create lead synth component
    this.leadSynth = new FmSynth(this.context, this.gain);
    this.leadSynth.changeInstrument(FM_INSTRUMENTS[3]);

    // No interval
    this.interval = -1;

    // Setup chordChain
    this.chordChain = new MarkovChain(
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

    // Initial scale
    this.scale = SCALES.major_pentatonic;
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
    // Get chord
    const chord = getChord(24, this.chordChain.next());

    // Adjust transpose
    const frequencies = chord.map(mtof);

    // Chords
    this.chords.play(frequencies, STEP_TIME);

    // Random note in scale
    const leadNote =
      this.scale[Math.floor(Math.random() * this.scale.length)] + 24;
    this.leadSynth.play(mtof(leadNote + chord[0]));

    console.log(chord, frequencies, leadNote);
  }

  public setScale(scale: number[]): void {
    console.log(scale);
    this.scale = scale;
  }

  public createAnalyser(): AnalyserNode {
    const analyser = this.context.createAnalyser();
    analyser.fftSize = 256;
    this.gain.connect(analyser);
    return analyser;
  }

  private async getImpulseBuffer(impulseUrl: string): Promise<void> {
    const buffer = await fetch(impulseUrl)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => this.context.decodeAudioData(arrayBuffer));

    this.convolver.buffer = buffer;
  }
}
