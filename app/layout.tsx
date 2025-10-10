//-| File path: app/layout.tsx
import Providers from "@/app/layout.providers";
import {
  inter,
  roboto,
  openSans,
  lato,
  montserrat,
  poppins,
  sourceSans,
  raleway,
  merriweather,
  playfair,
  lora,
  ptSerif,
  crimsonText,
  sourceCodePro,
  jetbrainsMono,
  firaCode,
  ibmPlexMono,
  spaceMono,
} from "@/styles/fonts";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gazzola Web App Roadmap Maker",
  description:
    "A platform for generating full-stack web app roadmaps. Design and download comprehensive and detailed step-by-step instructions for you and your AI to vibe code your custom web app.",
  metadataBase: new URL("https://gazzola.dev"),
  openGraph: {
    title: "Gazzola Web App Roadmap Maker",
    description:
      "A platform for generating full-stack web app roadmaps. Design and download comprehensive and detailed step-by-step instructions for you and your AI to vibe code your custom web app.",
    images: [
      {
        url: "/GazzolaLogo.png",
        width: 2048,
        height: 2048,
        alt: "Gazzola development logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icon.ico" />
      </head>
      <body
        className={clsx(
          inter.variable,
          roboto.variable,
          openSans.variable,
          lato.variable,
          montserrat.variable,
          poppins.variable,
          sourceSans.variable,
          raleway.variable,
          merriweather.variable,
          playfair.variable,
          lora.variable,
          ptSerif.variable,
          crimsonText.variable,
          sourceCodePro.variable,
          jetbrainsMono.variable,
          firaCode.variable,
          ibmPlexMono.variable,
          spaceMono.variable,
          inter.className,
          "antialiased text-gray-100 bg-black"
        )}
      >
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
