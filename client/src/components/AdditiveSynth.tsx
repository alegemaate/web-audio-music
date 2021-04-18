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

export class AdditiveSynth {
  private readonly context: AudioContext;

  private readonly gain: GainNode;

  private readonly distGain: GainNode;

  private readonly op1: OscillatorNode;

  private readonly distortion: WaveShaperNode;

  private vol: number;

  public constructor(
    context: AudioContext,
    output: GainNode,
    recorder?: MediaStreamAudioDestinationNode
  ) {
    // Create audio context
    this.context = context;

    this.vol = 0.1;

    // Create global gain
    this.gain = this.context.createGain();
    this.gain.gain.value = 0.0;
    this.gain.connect(output);

    if (recorder) {
      this.gain.connect(recorder);
    }

    // Create oscs
    this.op1 = this.context.createOscillator();
    this.op1.connect(this.gain);

    // Create dist gain
    this.distGain = this.context.createGain();
    this.distGain.gain.value = 0.0;
    this.distGain.connect(this.gain);

    // Create dist
    this.distortion = this.context.createWaveShaper();
    this.distortion.curve = makeDistortionCurve(2000);
    this.distortion.oversample = "4x";
    this.distortion.connect(this.distGain);
    this.op1.connect(this.distortion);

    // Start Synth
    this.op1.start();
  }

  public play(freq: number): void {
    if (freq === 0) {
      this.gain.gain.value = 0.0;
      return;
    }

    this.gain.gain.value = this.vol;

    // Set frequency
    this.op1.frequency.value = freq;
  }

  public setPoints(points: { real: Float32Array; imag: Float32Array }): void {
    this.op1.setPeriodicWave(
      this.context.createPeriodicWave(points.real, points.imag)
    );
  }

  public stop(): void {
    this.gain.disconnect();
  }

  public setVol(vol: number): void {
    this.vol = vol;
  }

  public setDist(vol: number): void {
    this.distGain.gain.value = vol;
  }
}
