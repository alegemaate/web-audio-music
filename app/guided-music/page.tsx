import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "Guided Music",
  description:
    "Experimental guided music controller based on Conways Game of Life",
};

export default function Page() {
  return <Client />;
}
