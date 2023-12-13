/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from "react";
import { Equalizer, Home } from "@material-ui/icons";

import ImgLandscape from "../images/landscape.jpg";
import ImgBloom from "../images/bloom.png";
import ImgTwoOpFmSynth from "../images/gmsynth.png";
import ImgFmSynth from "../images/fmsynth.png";

interface ModuleType {
  name: string;
  link: string;
  icon: JSX.Element;
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
    link: "/osc-bloom",
    icon: <Equalizer />,
    image: ImgBloom,
    dashboard: true,
    description: "Interactive Bloom clone inspired by Bryan Eno.",
  },
  {
    name: "Accelerometer Control",
    link: "/osc-accelerometer",
    icon: <Equalizer />,
    image: ImgLandscape,
    dashboard: true,
    description: "Accelerometer controller for mobile devices.",
  },
  {
    name: "FM Accelerometer",
    link: "/fm-accelerometer",
    icon: <Equalizer />,
    image: ImgFmSynth,
    dashboard: true,
    description: "Attempt at a fm synthesizer",
  },
  {
    name: "2 Op FM Synth",
    link: "/fm-synth",
    icon: <Equalizer />,
    image: ImgTwoOpFmSynth,
    dashboard: true,
    description: "GM implementation in FM",
  },
  {
    name: "Harmonicity Ratio",
    link: "/harmonicity",
    icon: <Equalizer />,
    image: ImgLandscape,
    dashboard: true,
    description: "Harmonicity Ratio Playground",
  },
  {
    name: "Waveform Draw",
    link: "/waveform",
    icon: <Equalizer />,
    image: ImgLandscape,
    dashboard: true,
    description: "Draw waveform using canvas",
  },
  {
    name: "Guided Music",
    link: "/guided-music",
    icon: <Equalizer />,
    image: ImgLandscape,
    dashboard: true,
    description: "Living composition",
  },
];
