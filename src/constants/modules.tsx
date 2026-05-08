import * as React from "react";
import { Equalizer, Home } from "@mui/icons-material";

import { asset } from "../lib/basePath";

interface ModuleType {
  name: string;
  link: string;
  icon: React.ReactElement;
  dashboard: boolean;
  description: string;
  image?: string;
}

export const MODULES: ModuleType[] = [
  {
    name: "Home",
    link: "/",
    icon: <Home />,
    dashboard: false,
    description: "",
  },
  {
    name: "Bloom",
    link: "/bloom",
    icon: <Equalizer />,
    image: asset("/images/bloom.png"),
    dashboard: true,
    description:
      "Tap to spawn ambient tones that bloom and decay, inspired by Brian Eno's Bloom.",
  },
  {
    name: "Accelerometer Control",
    link: "/osc-accelerometer",
    icon: <Equalizer />,
    image: asset("/images/landscape.jpg"),
    dashboard: true,
    description:
      "Tilt a mobile device to drive a simple oscillator's pitch and gain.",
  },
  {
    name: "FM Accelerometer",
    link: "/fm-accelerometer",
    icon: <Equalizer />,
    image: asset("/images/fmsynth.png"),
    dashboard: true,
    description:
      "Device orientation modulates carrier and modulator frequencies of an FM synth.",
  },
  {
    name: "2 Op FM Synth",
    link: "/fm-synth",
    icon: <Equalizer />,
    image: asset("/images/gmsynth.png"),
    dashboard: true,
    description:
      "Two-operator FM synthesizer with adjustable ADSR envelope and presets.",
  },
  {
    name: "Harmonicity Ratio",
    link: "/harmonicity",
    icon: <Equalizer />,
    image: asset("/images/landscape.jpg"),
    dashboard: true,
    description:
      "Sweep the ratio between two oscillators to hear when intervals turn harmonic or inharmonic.",
  },
  {
    name: "Waveform Draw",
    link: "/waveform",
    icon: <Equalizer />,
    image: asset("/images/landscape.jpg"),
    dashboard: true,
    description:
      "Sketch real and imaginary harmonic components to build a custom additive waveform.",
  },
  {
    name: "Guided Music",
    link: "/guided-music",
    icon: <Equalizer />,
    image: asset("/images/landscape.jpg"),
    dashboard: true,
    description:
      "Conway's Game of Life conducts an evolving, generative composition.",
  },
];
