import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";

import { Providers } from "./Providers";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Allan's Web Audio Playground",
    template: "%s | Allan's Web Audio Playground",
  },
  description: "Try out the Web Audio API in your browser!",
  applicationName: "Allan's Web Audio Playground",
  icons: { icon: "/web-audio-music/images/favicon.png" },
  twitter: {
    card: "summary_large_image",
    creator: "@alegemaate",
  },
};

export const viewport: Viewport = {
  themeColor: "#15151a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
