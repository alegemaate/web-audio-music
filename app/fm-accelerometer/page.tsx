import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "FM Accelerometer",
  description: "Accelerometer Controlled FM Synthesizer",
};

export default function Page() {
  return <Client />;
}
