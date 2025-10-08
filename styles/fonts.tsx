//-| File path: styles/fonts.tsx
import {
  Inter,
  Roboto,
  Open_Sans,
  Lato,
  Montserrat,
  Poppins,
  Source_Sans_3,
  Raleway,
  Merriweather,
  Playfair_Display,
  Lora,
  PT_Serif,
  Crimson_Text,
  Source_Code_Pro,
  JetBrains_Mono,
  Fira_Code,
  IBM_Plex_Mono,
  Space_Mono,
} from "next/font/google";

export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const roboto = Roboto({ weight: ["400", "500", "700"], subsets: ["latin"], variable: "--font-roboto" });
export const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" });
export const lato = Lato({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-lato" });
export const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
export const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-poppins" });
export const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-source-sans" });
export const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });

export const merriweather = Merriweather({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-merriweather" });
export const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
export const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
export const ptSerif = PT_Serif({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-pt-serif" });
export const crimsonText = Crimson_Text({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--font-crimson" });

export const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], variable: "--font-source-code" });
export const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });
export const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira-code" });
export const ibmPlexMono = IBM_Plex_Mono({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-ibm-plex" });
export const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-space-mono" });

export const fontMap = {
  inter: { font: inter, name: "Inter" },
  roboto: { font: roboto, name: "Roboto" },
  "open-sans": { font: openSans, name: "Open Sans" },
  lato: { font: lato, name: "Lato" },
  montserrat: { font: montserrat, name: "Montserrat" },
  poppins: { font: poppins, name: "Poppins" },
  "source-sans": { font: sourceSans, name: "Source Sans 3" },
  raleway: { font: raleway, name: "Raleway" },
  merriweather: { font: merriweather, name: "Merriweather" },
  playfair: { font: playfair, name: "Playfair Display" },
  lora: { font: lora, name: "Lora" },
  "pt-serif": { font: ptSerif, name: "PT Serif" },
  crimson: { font: crimsonText, name: "Crimson Text" },
  "source-code": { font: sourceCodePro, name: "Source Code Pro" },
  jetbrains: { font: jetbrainsMono, name: "JetBrains Mono" },
  "fira-code": { font: firaCode, name: "Fira Code" },
  "ibm-plex": { font: ibmPlexMono, name: "IBM Plex Mono" },
  "space-mono": { font: spaceMono, name: "Space Mono" },
};
