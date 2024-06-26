import type { Metadata } from "next";
import { inter } from "@/app/styles/fonts";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import "@/app/styles/globals.css";
import "swiper/css";

export const metadata: Metadata = {
  title: "Gazzola Development",
  description: "Aaron Gazzola's web development portfolio",
  metadataBase: new URL("https://gazzola.dev"),
  openGraph: {
    title: "Gazzola Development",
    description: "Aaron Gazzola's web development portfolio",
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
        className={clsx(inter.className, "antialiased text-gray-100 bg-black")}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
