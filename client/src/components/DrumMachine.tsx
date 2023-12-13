/* eslint-disable @typescript-eslint/no-unsafe-argument */
import clap from "../audio/clap.wav";
import metal from "../audio/metal.wav";
import kick from "../audio/kick.wav";
import hat from "../audio/hat.wav";
import snap from "../audio/snap.wav";
import shaker from "../audio/shaker.wav";
import snare from "../audio/snare.wav";
import tap from "../audio/tap.wav";

const makeDistortionCurve = (amount: number): Float32Array => {
  const k = amount;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  let x = 0;
  for (let i = 0; i < n_samples; ++i) {
    x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
};

export class DrumMachine {
  private readonly context: AudioContext;

  private readonly gain: GainNode;

  private readonly distGain: GainNode;

  private readonly samples: MediaElementAudioSourceNode[];

  private readonly distortion: WaveShaperNode;

  public constructor(
    context: AudioContext,
    output: GainNode,
    recorder?: MediaStreamAudioDestinationNode,
  ) {
    // Create audio context
    this.context = context;

    // Create global gain
    this.gain = this.context.createGain();
    this.gain.gain.value = 0.1;
    this.gain.connect(output);

    // Create dist gain
    this.distGain = this.context.createGain();
    this.distGain.gain.value = 0.0;
    this.distGain.connect(this.gain);

    // Create dist
    this.distortion = this.context.createWaveShaper();
    this.distortion.curve = makeDistortionCurve(2000);
    this.distortion.oversample = "4x";
    this.distortion.connect(this.distGain);

    // Create samples
    this.samples = [];
    this.loadSample(clap);
    this.loadSample(metal);
    this.loadSample(kick);
    this.loadSample(hat);
    this.loadSample(snap);
    this.loadSample(shaker);
    this.loadSample(snare);
    this.loadSample(tap);

    if (recorder) {
      this.gain.connect(recorder);
    }
  }

  public loadSample(name: string): void {
    const sound = document.createElement("audio");
    sound.id = name;
    sound.src = name;

    const track = this.context.createMediaElementSource(sound);
    track.connect(this.gain);
    track.connect(this.distortion);

    this.samples.push(track);
  }

  public play(data: number[]): void {
    this.gain.gain.value = 0.1;

    this.samples.forEach((sample, i) => {
      if (data[i]) {
        sample.mediaElement.currentTime = 0;
        sample.mediaElement.play().catch(console.error);
      }
    });
  }

  public stop(): void {
    this.gain.gain.value = 0.0;
  }

  public setVol(vol: number): void {
    this.gain.gain.value = vol;
  }

  public setDist(vol: number): void {
    this.distGain.gain.value = vol;
  }
}
