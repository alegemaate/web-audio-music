import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "FM Synth",
  description: "Web Audio FM Synthesizer",
};

export default function Page() {
  return <Client />;
}
