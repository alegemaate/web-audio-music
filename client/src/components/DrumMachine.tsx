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

  public constructor(context: AudioContext, output: GainNode) {
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
    this.distortion.curve = makeDistortionCurve(50);
    this.distortion.oversample = "4x";
    this.distortion.connect(this.distGain);

    // Create samples
    this.samples = [];
    this.loadSample("audio/clap.wav");
    this.loadSample("audio/metal.wav");
    this.loadSample("audio/kick.wav");
    this.loadSample("audio/hat.wav");
    this.loadSample("audio/snap.wav");
    this.loadSample("audio/shaker.wav");
    this.loadSample("audio/snare.wav");
    this.loadSample("audio/tap.wav");
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
    this.samples.forEach((sample, i) => {
      if (data[i]) {
        sample.mediaElement.fastSeek(0);
        sample.mediaElement.play();
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
