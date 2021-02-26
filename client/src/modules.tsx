import * as React from "react";
import { Equalizer, Home } from "@material-ui/icons";

import ImgLandscape from "./images/landscape.jpg";
import ImgBloom from "./images/bloom.png";
import ImgGmSynth from "./images/gmsynth.png";
import ImgFmSynth from "./images/fmsynth.png";

type ModuleType = {
  name: string;
  link: string;
  icon: JSX.Element;
  dashboard: boolean;
  description: string;
  image?: string;
};

export const MODULES: ModuleType[] = [
  {
    name: "Home",
    link: "/osc-controller",
    icon: <Home />,
    dashboard: false,
    description: "",
  },
  {
    name: "Bloom",
    link: "/osc-controller/bloom",
    icon: <Equalizer />,
    image: ImgBloom,
    dashboard: true,
    description: "Interactive Bloom clone inspired by Bryan Eno.",
  },
  {
    name: "Accelerometer Control",
    link: "/osc-controller/accel",
    icon: <Equalizer />,
    image: ImgLandscape,
    dashboard: true,
    description: "Accelerometer controller for mobile devices.",
  },
  {
    name: "FM Accelerometer",
    link: "/osc-controller/fmsynth",
    icon: <Equalizer />,
    image: ImgFmSynth,
    dashboard: true,
    description: "Attempt at a fm synthesizer",
  },
  {
    name: "2 Op FM Synth",
    link: "/osc-controller/gmsynth",
    icon: <Equalizer />,
    image: ImgGmSynth,
    dashboard: true,
    description: "GM implementation in FM",
  },
  {
    name: "Harmonicity Ratio",
    link: "/osc-controller/harmonicity",
    icon: <Equalizer />,
    image: ImgLandscape,
    dashboard: true,
    description: "Harmonicity Ratio Playground",
  },
];
