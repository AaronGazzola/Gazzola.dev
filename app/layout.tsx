import type { Metadata } from "next";
import "@/app/styles/globals.css";
import { inter } from "@/app/styles/fonts";

export const metadata: Metadata = {
  title: "Gazzola Development",
  description: "Aaron Gazzola's web development portfolio",
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
      <body className={`${inter.className} antialiased text-gray-200 bg-black`}>
        {children}
      </body>
    </html>
  );
}
