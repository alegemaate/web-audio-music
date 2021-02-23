import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Button, Card, CardContent } from "@material-ui/core";
import { GM_INSTRUMENTS } from "./gmInstruments";

export const GmSynth: React.FC<RouteComponentProps> = () => {
  const [gmPlayer, setGmPlayer] = React.useState<GmPlayer | null>(null);

  const startSynth = () => {
    setGmPlayer(new GmPlayer());
  };

  const playNote = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!gmPlayer) {
      return;
    }

    // gmPlayer.programChange(1);
    gmPlayer.changeInstrument({
      gain: 1.0,
      op1: {
        dest: "out",
        type: "sawtooth",
        ratio: 1.0,
        feedback: 0.0,
        adsr: {
          attackTime: 0.0,
          attackLevel: 1.0,
          decayTime: 0.0,
          decayLevel: 1.0,
          sustainTime: 1.0,
          sustainLevel: 1.0,
          releaseTime: 1.5,
          releaseLevel: 0.0,
        },
      },
      op2: {
        dest: "op1",
        type: "sine",
        ratio: 1.2,
        feedback: 0.0,
        adsr: {
          attackTime: 0.5,
          attackLevel: 1000.0,
          decayTime: 1.0,
          decayLevel: 500.0,
          sustainTime: 1.0,
          sustainLevel: 100.0,
          releaseTime: 1.0,
          releaseLevel: 0.0,
        },
      },
    });

    const freq = event.clientX + 50;
    gmPlayer.play(freq);
  };

  const stopNote = () => {
    if (!gmPlayer) {
      return;
    }

    gmPlayer.stop();
  };

  return (
    <>
      <Card>
        <CardContent>
          {!gmPlayer && (
            <Button
              onClick={startSynth}
              variant="outlined"
              color="primary"
              fullWidth
            >
              Start
            </Button>
          )}
          {gmPlayer && (
            <>
              <Button
                onMouseDown={playNote}
                onMouseUp={stopNote}
                variant="outlined"
                color="primary"
                fullWidth
              >
                Note
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

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
}

export interface GmPreset {
  gain: number;
  op1: GmOpPreset;
  op2: GmOpPreset;
}

export class GmPlayer {
  private static context: AudioContext;

  private readonly gain: GainNode;

  private readonly op1: OscillatorNode;

  private readonly op2: OscillatorNode;

  private readonly op1Gain: GainNode;

  private readonly op2Gain: GainNode;

  private readonly op1Feedback: GainNode;

  private readonly op2Feedback: GainNode;

  private op1Ratio: number;

  private op2Ratio: number;

  private op1Adsr: GmAdsrPreset;

  private op2Adsr: GmAdsrPreset;

  public constructor() {
    // Create audio context
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    GmPlayer.context = new AudioContext();
    GmPlayer.context.resume();

    // Create oscs
    this.op1 = GmPlayer.context.createOscillator();
    this.op2 = GmPlayer.context.createOscillator();

    // Create gains
    this.op1Gain = GmPlayer.context.createGain();
    this.op2Gain = GmPlayer.context.createGain();

    // Create feedbacks
    this.op1Feedback = GmPlayer.context.createGain();
    this.op2Feedback = GmPlayer.context.createGain();

    // Create global gain
    this.gain = GmPlayer.context.createGain();
    this.gain.connect(GmPlayer.context.destination);

    // Wiring
    this.op1
      .connect(this.op1Gain)
      .connect(this.op1Feedback)
      .connect(this.op1.frequency);
    this.op2
      .connect(this.op2Gain)
      .connect(this.op2Feedback)
      .connect(this.op2.frequency);

    // Start synth
    this.op1.start();
    this.op2.start();

    // Setup adsr
    this.op1Adsr = {
      attackLevel: 1,
      attackTime: 1,
      decayLevel: 1,
      decayTime: 1,
      sustainLevel: 1,
      sustainTime: 1,
      releaseLevel: 0,
      releaseTime: 1,
    };

    this.op2Adsr = {
      attackLevel: 1,
      attackTime: 1,
      decayLevel: 1,
      decayTime: 1,
      sustainLevel: 1,
      sustainTime: 1,
      releaseLevel: 0,
      releaseTime: 1,
    };

    // Set ratios
    this.op1Ratio = 1.0;
    this.op2Ratio = 1.0;
  }

  public programChange(instrument: number): void {
    const preset = GM_INSTRUMENTS[instrument];

    if (!preset) {
      return;
    }

    this.changeInstrument(preset);
  }

  public changeInstrument(preset: GmPreset): void {
    // Gain
    this.gain.gain.value = preset.gain;

    // Wave
    this.op1.type = preset.op1.type;
    this.op2.type = preset.op2.type;

    // Ratio
    this.op1Ratio = preset.op1.ratio;
    this.op2Ratio = preset.op2.ratio;

    // Gain
    this.op1Gain.gain.value = 0.0;
    this.op2Gain.gain.value = 0.0;

    // Feedback
    this.op1Feedback.gain.value = preset.op1.feedback;
    this.op2Feedback.gain.value = preset.op2.feedback;

    // ADSR
    this.op1Adsr = preset.op1.adsr;
    this.op2Adsr = preset.op2.adsr;

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
    this.op1.frequency.value = freq * this.op1Ratio;
    this.op2.frequency.value = freq * this.op2Ratio;

    const now = GmPlayer.context.currentTime;

    // Op 1 ADSR
    this.op1Gain.gain.cancelScheduledValues(0);
    this.op1Gain.gain.setValueAtTime(0, now);
    this.op1Gain.gain.linearRampToValueAtTime(
      this.op1Adsr.attackLevel,
      now + this.op1Adsr.attackTime
    );
    this.op1Gain.gain.linearRampToValueAtTime(
      this.op1Adsr.decayLevel,
      now + this.op1Adsr.attackTime + this.op1Adsr.decayTime
    );
    this.op1Gain.gain.linearRampToValueAtTime(
      this.op1Adsr.sustainLevel,
      now +
        this.op1Adsr.attackTime +
        this.op1Adsr.decayTime +
        this.op1Adsr.sustainTime
    );

    // Op 2 ADSR
    this.op2Gain.gain.cancelScheduledValues(0);
    this.op2Gain.gain.setValueAtTime(0, now);
    this.op2Gain.gain.linearRampToValueAtTime(
      this.op2Adsr.attackLevel,
      now + this.op2Adsr.attackTime
    );
    this.op2Gain.gain.linearRampToValueAtTime(
      this.op2Adsr.decayLevel,
      now + this.op2Adsr.attackTime + this.op2Adsr.decayTime
    );
    this.op2Gain.gain.linearRampToValueAtTime(
      this.op2Adsr.sustainLevel,
      now +
        this.op2Adsr.attackTime +
        this.op2Adsr.decayTime +
        this.op2Adsr.sustainTime
    );
  }

  public stop(): void {
    const now = GmPlayer.context.currentTime;

    // Op 1 ADSR
    this.op1Gain.gain.cancelScheduledValues(0);
    this.op1Gain.gain.setValueAtTime(this.op1Gain.gain.value, now);
    this.op1Gain.gain.linearRampToValueAtTime(
      this.op1Adsr.releaseLevel,
      now + this.op1Adsr.releaseTime
    );

    // Op 2 ADSR
    this.op2Gain.gain.cancelScheduledValues(0);
    this.op2Gain.gain.setValueAtTime(this.op2Gain.gain.value, now);
    this.op2Gain.gain.linearRampToValueAtTime(
      this.op2Adsr.releaseLevel,
      now + this.op2Adsr.releaseTime
    );
  }
}
