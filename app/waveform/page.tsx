import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Waveform Draw",
  description: "Draw a waveform!",
};

export default function Page() {
  return <Client />;
}
