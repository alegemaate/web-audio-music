import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Bloom",
  description: "Click to play a note, and watch the bloom!",
};

export default function Page() {
  return <Client />;
}
