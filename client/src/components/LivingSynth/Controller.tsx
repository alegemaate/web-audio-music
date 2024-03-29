import { SCALES } from "./scales";
import { type FmPreset, FmSynth } from "../FmSynth";
import { AdditiveSynth } from "../AdditiveSynth";
import { DrumMachine } from "../DrumMachine";

const mtof = (midi: number) => 2 ** ((midi - 69) / 12) * 440;

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

class AudioRecorder {
  private readonly chunks: Blob[];

  private readonly recorder: MediaRecorder;

  private readonly dest: MediaStreamAudioDestinationNode;

  private readonly name: string;

  public constructor(context: AudioContext, name: string) {
    // Name
    this.name = name;

    // Create recorder
    this.chunks = [];
    this.dest = context.createMediaStreamDestination();
    this.recorder = new MediaRecorder(this.dest.stream);
    this.recorder.start(1000);

    this.recorder.ondataavailable = (evt) => {
      this.chunks.push(evt.data);
      console.log(
        `${this.name}: Recorder data avail! Data size: ${evt.data.size}. Chunks so far: ${this.chunks.length}. Recorder state: ${this.recorder.state}`,
      );
    };

    this.recorder.onstop = () => {
      console.log(
        `${this.name}: Recorder stopped. Chunks recorded: ${this.chunks.length}`,
      );
      const blob = new Blob(this.chunks, { type: "audio/ogg; codecs=opus" });
      const audioElement = document.createElement("audio");
      audioElement.src = URL.createObjectURL(blob);
      audioElement.controls = true;
      audioElement.title = this.name;

      const label = document.createElement("p");
      label.innerHTML = this.name;

      const recordings = document.getElementById("recording-list");
      if (recordings) {
        recordings.appendChild(label);
        recordings.appendChild(audioElement);
      }
    };
  }

  public getRecorder(): MediaStreamAudioDestinationNode {
    return this.dest;
  }

  public stop(): void {
    this.recorder.stop();
  }
}

export class Controller {
  private readonly context: AudioContext;

  private readonly gain: GainNode;

  private readonly chords: AdditiveSynth[];

  private readonly leadSynth: FmSynth;

  private readonly drumMachine: DrumMachine;

  private scale: number[];

  private readonly preset: FmPreset = PRESET;

  private readonly recorders: AudioRecorder[];

  public constructor(context: AudioContext, gain: GainNode) {
    // Create audio context
    this.context = context;

    // Create gains
    this.gain = this.context.createGain();
    this.gain.gain.value = 1.0;

    // Wiring
    this.gain.connect(gain);

    // Recorders
    this.recorders = [];

    // Create chord component
    const chordRecorder = new AudioRecorder(this.context, "Poly synth");
    this.recorders.push(chordRecorder);

    this.chords = [];
    this.chords.push(
      new AdditiveSynth(this.context, this.gain, chordRecorder.getRecorder()),
    );
    this.chords.push(
      new AdditiveSynth(this.context, this.gain, chordRecorder.getRecorder()),
    );
    this.chords.push(
      new AdditiveSynth(this.context, this.gain, chordRecorder.getRecorder()),
    );
    this.chords.push(
      new AdditiveSynth(this.context, this.gain, chordRecorder.getRecorder()),
    );
    this.chords.push(
      new AdditiveSynth(this.context, this.gain, chordRecorder.getRecorder()),
    );
    this.chords.push(
      new AdditiveSynth(this.context, this.gain, chordRecorder.getRecorder()),
    );
    this.chords.push(
      new AdditiveSynth(this.context, this.gain, chordRecorder.getRecorder()),
    );
    this.chords.push(
      new AdditiveSynth(this.context, this.gain, chordRecorder.getRecorder()),
    );

    // Create drum machine
    const drumRecorder = new AudioRecorder(this.context, "Drums");
    this.recorders.push(drumRecorder);
    this.drumMachine = new DrumMachine(
      context,
      gain,
      drumRecorder.getRecorder(),
    );

    // Create lead synth component
    const leadRecorder = new AudioRecorder(this.context, "Lead synth");
    this.recorders.push(leadRecorder);
    this.leadSynth = new FmSynth(
      this.context,
      this.gain,
      leadRecorder.getRecorder(),
    );
    this.leadSynth.changeInstrument(this.preset);

    // Initial scale
    this.scale = SCALES.acoustic;
  }

  public evolve(data: number[]): void {
    /*
     * Get chord
     * this.scale = SCALES[this.scaleChain.next()];
     */

    // Adjust transpose
    const notes = data.flatMap((val, index) => {
      if (val === 0) {
        return [];
      }

      return [
        mtof(
          this.scale[index % this.scale.length] +
            48 +
            12 * Math.floor(index / this.scale.length),
        ),
      ];
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
    this.preset.op1.adsr.attackTime = x / 10.0;
    this.preset.op1.adsr.decayTime = y / 10.0;
    this.preset.op1.adsr.releaseTime = z / 10.0;

    this.leadSynth.changeInstrument(this.preset);
  }

  public paramChange2(x: number, y: number, z: number): void {
    this.preset.op2.level = x * 2000.0;
    this.preset.op2.ratio = y * 10.0;
    this.preset.op2.adsr.attackTime = z;
    this.leadSynth.changeInstrument(this.preset);
  }

  public drums(data: number[]): void {
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

  public stop(): void {
    this.chords.forEach((op) => {
      op.stop();
    });

    this.drumMachine.stop();

    this.leadSynth.destroy();

    this.recorders.forEach((rec) => {
      rec.stop();
    });
  }
}
