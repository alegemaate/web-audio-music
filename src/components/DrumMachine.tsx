import { asset } from "../lib/basePath";

const clap = asset("/audio/clap.wav");
const metal = asset("/audio/metal.wav");
const kick = asset("/audio/kick.wav");
const hat = asset("/audio/hat.wav");
const snap = asset("/audio/snap.wav");
const shaker = asset("/audio/shaker.wav");
const snare = asset("/audio/snare.wav");
const tap = asset("/audio/tap.wav");

const makeDistortionCurve = (amount: number) => {
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
    this.context = context;

    this.gain = this.context.createGain();
    this.gain.gain.value = 0.1;
    this.gain.connect(output);

    this.distGain = this.context.createGain();
    this.distGain.gain.value = 0.0;
    this.distGain.connect(this.gain);

    this.distortion = this.context.createWaveShaper();
    this.distortion.curve = makeDistortionCurve(2000);
    this.distortion.oversample = "4x";
    this.distortion.connect(this.distGain);

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
    sound.preload = "auto";

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

  public destroy(): void {
    this.samples.forEach((sample) => {
      sample.mediaElement.pause();
      sample.disconnect();
    });
    this.samples.length = 0;
    this.distortion.disconnect();
    this.distGain.disconnect();
    this.gain.disconnect();
  }

  public setVol(vol: number): void {
    this.gain.gain.value = vol;
  }

  public setDist(vol: number): void {
    this.distGain.gain.value = vol;
  }
}
