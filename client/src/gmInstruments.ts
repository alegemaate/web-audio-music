import { GmPreset } from "./GmTest";

export const GM_INSTRUMENTS: GmPreset[] = [
  {
    gain: 1.0,
    op1: {
      dest: "out",
      type: "sine",
      ratio: 1.0,
      feedback: 1000.0,
      adsr: {
        attackLevel: 1.0,
        attackTime: 0.0,
        decayLevel: 0.1,
        decayTime: 0.1,
        sustainLevel: 0.0,
        sustainTime: 1.0,
        releaseLevel: 0.0,
        releaseTime: 0.0,
      },
    },
    op2: {
      dest: "blackhole",
      type: "sine",
      ratio: 0.5,
      feedback: 0.0,
      adsr: {
        attackLevel: 0.0,
        attackTime: 0.0,
        decayLevel: 0.0,
        decayTime: 0.0,
        sustainLevel: 1000.0,
        sustainTime: 0.0,
        releaseLevel: 0.0,
        releaseTime: 0.0,
      },
    },
  },
  {
    gain: 1.0,
    op1: {
      dest: "out",
      type: "sine",
      ratio: 1.0,
      feedback: 1.0,
      adsr: {
        attackLevel: 1.0,
        attackTime: 0.1,
        decayLevel: 0.9,
        decayTime: 0.2,
        sustainLevel: 1.0,
        sustainTime: 1.0,
        releaseLevel: 0.0,
        releaseTime: 1.0,
      },
    },
    op2: {
      dest: "blackhole",
      type: "sawtooth",
      ratio: 1.2,
      feedback: 0.0,
      adsr: {
        attackLevel: 0.0,
        attackTime: 0.1,
        decayLevel: 0.0,
        decayTime: 0.0,
        sustainLevel: 1000.0,
        sustainTime: 0.0,
        releaseLevel: 0.0,
        releaseTime: 0.0,
      },
    },
  },
  {
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
  },

  // Flute
  {
    gain: 1.0,
    op1: {
      dest: "out",
      type: "sine",
      ratio: 1.0,
      feedback: 0.0,
      adsr: {
        attackTime: 0.5,
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
      type: "sawtooth",
      ratio: 2.0,
      feedback: 0.0,
      adsr: {
        attackTime: 0.7,
        attackLevel: 1000.0,
        decayTime: 1.0,
        decayLevel: 500.0,
        sustainTime: 1.0,
        sustainLevel: 100.0,
        releaseTime: 1.0,
        releaseLevel: 0.0,
      },
    },
  },

  // Brass
  {
    gain: 1.0,
    op1: {
      dest: "out",
      type: "sawtooth",
      ratio: 1.0,
      feedback: 0.0,
      adsr: {
        attackTime: 0,
        attackLevel: 1.0,
        decayTime: 0.5,
        decayLevel: 0.0,
        sustainTime: 0.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
    op2: {
      dest: "op1",
      type: "sine",
      ratio: 0.501,
      feedback: 0.0,
      adsr: {
        attackTime: 0.1,
        attackLevel: 1000.0,
        decayTime: 0.5,
        decayLevel: 0.0,
        sustainTime: 0.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
  },

  // Bass
  {
    gain: 1.0,
    op1: {
      dest: "out",
      type: "sine",
      ratio: 0.5,
      feedback: 0.0,
      adsr: {
        attackTime: 0,
        attackLevel: 1.0,
        decayTime: 0.5,
        decayLevel: 0.0,
        sustainTime: 0.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
    op2: {
      dest: "op1",
      type: "sine",
      ratio: 0.501,
      feedback: 0.0,
      adsr: {
        attackTime: 0.1,
        attackLevel: 1000.0,
        decayTime: 0.5,
        decayLevel: 0.0,
        sustainTime: 0.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
  },
  // Bell
  {
    gain: 1.0,
    op1: {
      dest: "out",
      type: "sine",
      ratio: 1.0,
      feedback: 0.0,
      adsr: {
        attackTime: 0,
        attackLevel: 1.0,
        decayTime: 0.5,
        decayLevel: 0.0,
        sustainTime: 0.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
    op2: {
      dest: "op1",
      type: "sine",
      ratio: 1.27,
      feedback: 0.0,
      adsr: {
        attackTime: 0.1,
        attackLevel: 1000.0,
        decayTime: 0.5,
        decayLevel: 0.0,
        sustainTime: 0.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
  },
  // Guitar
  {
    gain: 1.0,
    op1: {
      dest: "out",
      type: "sine",
      ratio: 1.0,
      feedback: 0.0,
      adsr: {
        attackTime: 0,
        attackLevel: 1.0,
        decayTime: 1.0,
        decayLevel: 0.0,
        sustainTime: 0.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
    op2: {
      dest: "op1",
      type: "sine",
      ratio: 3.0,
      feedback: 0.0,
      adsr: {
        attackTime: 0.01,
        attackLevel: 2000.0,
        decayTime: 0.7,
        decayLevel: 0.0,
        sustainTime: 0.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
  },
  // Piano
  {
    gain: 1.0,
    op1: {
      dest: "out",
      type: "sine",
      ratio: 1.0,
      feedback: 0.0,
      adsr: {
        attackTime: 0,
        attackLevel: 1.0,
        decayTime: 1.0,
        decayLevel: 0.7,
        sustainTime: 1.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
    op2: {
      dest: "op1",
      type: "sine",
      ratio: 3.0,
      feedback: 0.0,
      adsr: {
        attackTime: 0.0,
        attackLevel: 2000.0,
        decayTime: 0.2,
        decayLevel: 0.7,
        sustainTime: 5.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
  },
  // Piano 2
  {
    gain: 1.0,
    op1: {
      dest: "out",
      type: "sine",
      ratio: 1.0,
      feedback: 0.0,
      adsr: {
        attackTime: 0,
        attackLevel: 1.0,
        decayTime: 1.0,
        decayLevel: 0.7,
        sustainTime: 1.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
    op2: {
      dest: "op1",
      type: "sine",
      ratio: 2.01,
      feedback: 0.0,
      adsr: {
        attackTime: 0.0,
        attackLevel: 2000.0,
        decayTime: 0.2,
        decayLevel: 0.7,
        sustainTime: 5.0,
        sustainLevel: 0.0,
        releaseTime: 0.0,
        releaseLevel: 0.0,
      },
    },
  },
];
