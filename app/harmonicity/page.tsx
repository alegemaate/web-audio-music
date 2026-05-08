import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Harmonicity Ratio Controller",
  description:
    "Test the harmonicity of two oscillators by changing their ratio.",
};

export default function Page() {
  return <Client />;
}
