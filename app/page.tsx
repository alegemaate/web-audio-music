import type { Metadata } from "next";
import Dashboard from "./Client";

export const metadata: Metadata = {
  title: "All Modules",
  description: "View all modules available on the Web Audio Playground.",
};

export default function Page() {
  return <Dashboard />;
}
