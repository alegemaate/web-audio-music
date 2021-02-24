import { GM_INSTRUMENTS } from "./gmInstruments";

interface GmAdsrPreset {
  attackLevel: number;
  attackTime: number;
  decayLevel: number;
  decayTime: number;
  sustainLevel: number;
  sustainTime: number;
  releaseLevel: number;
  releaseTime: number;
}

interface GmOpPreset {
  type: "sawtooth" | "sine" | "square" | "triangle";
  dest: "op1" | "op2" | "out" | "blackhole";
  ratio: number;
  adsr: GmAdsrPreset;
  feedback: number;
  level: number;
}

export interface GmPreset {
  gain: number;
  op1: GmOpPreset;
  op2: GmOpPreset;
}

export class GmSynth {
  private readonly context: AudioContext;

  private readonly gain: GainNode;

  private readonly op1: OscillatorNode;

  private readonly op2: OscillatorNode;

  private readonly op1Gain: GainNode;

  private readonly op2Gain: GainNode;

  private readonly op1Feedback: GainNode;

  private readonly op2Feedback: GainNode;

  private preset: GmPreset;

  public constructor() {
    // Create audio context
    this.context = new AudioContext();
    this.context.resume();

    // Create oscs
    this.op1 = this.context.createOscillator();
    this.op2 = this.context.createOscillator();

    // Create gains
    this.op1Gain = this.context.createGain();
    this.op2Gain = this.context.createGain();

    // Create feedbacks
    this.op1Feedback = this.context.createGain();
    this.op2Feedback = this.context.createGain();

    // Create global gain
    this.gain = this.context.createGain();

    // Wiring
    this.op1.connect(this.op1Gain);
    this.op1.connect(this.op1Feedback).connect(this.op1.frequency);
    this.op2.connect(this.op2Gain);
    this.op2.connect(this.op2Feedback).connect(this.op2.frequency);
    this.gain.connect(this.context.destination);

    // Start Synth
    this.op1.start();
    this.op2.start();

    // Setup preset
    this.preset = GM_INSTRUMENTS[0];
    this.changeInstrument(this.preset);
  }

  public programChange(instrument: number): void {
    const preset = GM_INSTRUMENTS[instrument];

    if (!preset) {
      return;
    }

    this.changeInstrument(preset);
  }

  public changeInstrument(preset: GmPreset): void {
    // Set preset
    this.preset = preset;

    // Gain
    this.gain.gain.value = preset.gain;

    // Wave
    this.op1.type = preset.op1.type;
    this.op2.type = preset.op2.type;

    // Gain
    this.op1Gain.gain.value = 0.0;
    this.op2Gain.gain.value = 0.0;

    // Feedback
    this.op1Feedback.gain.value = preset.op1.feedback;
    this.op2Feedback.gain.value = preset.op2.feedback;

    // Op 1 wiring
    this.op1Gain.disconnect();
    switch (preset.op1.dest) {
      case "op2":
        this.op1Gain.connect(this.op2.frequency);
        break;
      case "out":
        this.op1Gain.connect(this.gain);
        break;
      default:
        break;
    }

    // Op 2 wiring
    this.op2Gain.disconnect();
    switch (preset.op2.dest) {
      case "op1":
        this.op2Gain.connect(this.op1.frequency);
        break;
      case "out":
        this.op2Gain.connect(this.gain);
        break;
      default:
        break;
    }
  }

  public play(freq: number): void {
    // Set frequency
    this.op1.frequency.value = freq * this.preset.op1.ratio;
    this.op2.frequency.value = freq * this.preset.op2.ratio;

    const now = this.context.currentTime;

    // Op 1 ADSR
    this.op1Gain.gain.cancelScheduledValues(0);
    this.op1Gain.gain.setValueAtTime(0, now);
    this.op1Gain.gain.linearRampToValueAtTime(
      this.preset.op1.adsr.attackLevel * this.preset.op1.level,
      now + this.preset.op1.adsr.attackTime
    );
    this.op1Gain.gain.linearRampToValueAtTime(
      this.preset.op1.adsr.decayLevel * this.preset.op1.level,
      now + this.preset.op1.adsr.attackTime + this.preset.op1.adsr.decayTime
    );
    this.op1Gain.gain.linearRampToValueAtTime(
      this.preset.op1.adsr.sustainLevel * this.preset.op1.level,
      now +
        this.preset.op1.adsr.attackTime +
        this.preset.op1.adsr.decayTime +
        this.preset.op1.adsr.sustainTime
    );

    // Op 2 ADSR
    this.op2Gain.gain.cancelScheduledValues(0);
    this.op2Gain.gain.setValueAtTime(0, now);
    this.op2Gain.gain.linearRampToValueAtTime(
      this.preset.op2.adsr.attackLevel * this.preset.op2.level,
      now + this.preset.op2.adsr.attackTime
    );
    this.op2Gain.gain.linearRampToValueAtTime(
      this.preset.op2.adsr.decayLevel * this.preset.op2.level,
      now + this.preset.op2.adsr.attackTime + this.preset.op2.adsr.decayTime
    );
    this.op2Gain.gain.linearRampToValueAtTime(
      this.preset.op2.adsr.sustainLevel * this.preset.op2.level,
      now +
        this.preset.op2.adsr.attackTime +
        this.preset.op2.adsr.decayTime +
        this.preset.op2.adsr.sustainTime
    );
  }

  public stop(): void {
    const now = this.context.currentTime;

    // Op 1 ADSR
    this.op1Gain.gain.cancelScheduledValues(0);
    this.op1Gain.gain.setValueAtTime(this.op1Gain.gain.value, now);
    this.op1Gain.gain.linearRampToValueAtTime(
      this.preset.op1.adsr.releaseLevel * this.preset.op1.level,
      now + this.preset.op1.adsr.releaseTime
    );

    // Op 2 ADSR
    this.op2Gain.gain.cancelScheduledValues(0);
    this.op2Gain.gain.setValueAtTime(this.op2Gain.gain.value, now);
    this.op2Gain.gain.linearRampToValueAtTime(
      this.preset.op2.adsr.releaseLevel * this.preset.op2.level,
      now + this.preset.op2.adsr.releaseTime
    );
  }

  public destroy() {
    this.op1.disconnect();
    this.op2.disconnect();
    this.op1Gain.disconnect();
    this.op2Gain.disconnect();
    this.op1Feedback.disconnect();
    this.op2Feedback.disconnect();
    this.gain.disconnect();
    if (this.context.state !== "closed") {
      this.context.close();
      this.op1.stop();
      this.op2.stop();
    }
  }
}
