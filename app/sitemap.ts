import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const SITE_URL = "https://alegemaate.com/web-audio-music";

const ROUTES = [
  "",
  "/bloom",
  "/fm-accelerometer",
  "/fm-synth",
  "/guided-music",
  "/harmonicity",
  "/osc-accelerometer",
  "/waveform",
];

const sitemap = (): MetadataRoute.Sitemap =>
  ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));

export default sitemap;
