import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "OSC Accelerometer Controller",
  description:
    "WIP - Accelerometer Controlled OSC Synthesizer Controller",
};

export default function Page() {
  return <Client />;
}
