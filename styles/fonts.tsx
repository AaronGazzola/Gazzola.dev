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
  DM_Sans,
  Plus_Jakarta_Sans,
  Outfit,
  Quicksand,
  Oxanium,
  Libre_Baskerville,
  Architects_Daughter,
  Roboto_Mono,
  Ubuntu_Mono,
  Geist_Mono,
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
export const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
export const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-plus-jakarta" });
export const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
export const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quicksand" });
export const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-oxanium" });
export const libreBaskerville = Libre_Baskerville({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-libre-baskerville" });
export const architectsDaughter = Architects_Daughter({ weight: ["400"], subsets: ["latin"], variable: "--font-architects-daughter" });
export const robotoMono = Roboto_Mono({ subsets: ["latin"], variable: "--font-roboto-mono" });
export const ubuntuMono = Ubuntu_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-ubuntu-mono" });
export const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const fontOptions = {
  sans: [
    { value: "var(--font-inter)", label: "Inter", variable: "--font-inter" },
    { value: "var(--font-roboto)", label: "Roboto", variable: "--font-roboto" },
    { value: "var(--font-open-sans)", label: "Open Sans", variable: "--font-open-sans" },
    { value: "var(--font-lato)", label: "Lato", variable: "--font-lato" },
    { value: "var(--font-montserrat)", label: "Montserrat", variable: "--font-montserrat" },
    { value: "var(--font-poppins)", label: "Poppins", variable: "--font-poppins" },
    { value: "var(--font-source-sans)", label: "Source Sans 3", variable: "--font-source-sans" },
    { value: "var(--font-raleway)", label: "Raleway", variable: "--font-raleway" },
    { value: "var(--font-dm-sans)", label: "DM Sans", variable: "--font-dm-sans" },
    { value: "var(--font-plus-jakarta)", label: "Plus Jakarta Sans", variable: "--font-plus-jakarta" },
    { value: "var(--font-outfit)", label: "Outfit", variable: "--font-outfit" },
    { value: "var(--font-quicksand)", label: "Quicksand", variable: "--font-quicksand" },
    { value: "var(--font-oxanium)", label: "Oxanium", variable: "--font-oxanium" },
    { value: "var(--font-architects-daughter)", label: "Architects Daughter", variable: "--font-architects-daughter" },
    { value: "system-ui, sans-serif", label: "System Sans", variable: null },
  ],
  serif: [
    { value: "var(--font-merriweather)", label: "Merriweather", variable: "--font-merriweather" },
    { value: "var(--font-playfair)", label: "Playfair Display", variable: "--font-playfair" },
    { value: "var(--font-lora)", label: "Lora", variable: "--font-lora" },
    { value: "var(--font-pt-serif)", label: "PT Serif", variable: "--font-pt-serif" },
    { value: "var(--font-crimson)", label: "Crimson Text", variable: "--font-crimson" },
    { value: "var(--font-libre-baskerville)", label: "Libre Baskerville", variable: "--font-libre-baskerville" },
    { value: "Georgia, serif", label: "Georgia", variable: null },
    { value: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif", label: "System Serif", variable: null },
  ],
  mono: [
    { value: "var(--font-source-code)", label: "Source Code Pro", variable: "--font-source-code" },
    { value: "var(--font-jetbrains)", label: "JetBrains Mono", variable: "--font-jetbrains" },
    { value: "var(--font-fira-code)", label: "Fira Code", variable: "--font-fira-code" },
    { value: "var(--font-ibm-plex)", label: "IBM Plex Mono", variable: "--font-ibm-plex" },
    { value: "var(--font-space-mono)", label: "Space Mono", variable: "--font-space-mono" },
    { value: "var(--font-roboto-mono)", label: "Roboto Mono", variable: "--font-roboto-mono" },
    { value: "var(--font-ubuntu-mono)", label: "Ubuntu Mono", variable: "--font-ubuntu-mono" },
    { value: "var(--font-geist-mono)", label: "Geist Mono", variable: "--font-geist-mono" },
    { value: "Menlo, monospace", label: "Menlo", variable: null },
    { value: "'Courier New', Courier, monospace", label: "Courier New", variable: null },
    { value: "monospace", label: "System Mono", variable: null },
  ],
};

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
  "dm-sans": { font: dmSans, name: "DM Sans" },
  "plus-jakarta": { font: plusJakartaSans, name: "Plus Jakarta Sans" },
  outfit: { font: outfit, name: "Outfit" },
  quicksand: { font: quicksand, name: "Quicksand" },
  oxanium: { font: oxanium, name: "Oxanium" },
  "libre-baskerville": { font: libreBaskerville, name: "Libre Baskerville" },
  "architects-daughter": { font: architectsDaughter, name: "Architects Daughter" },
  "roboto-mono": { font: robotoMono, name: "Roboto Mono" },
  "ubuntu-mono": { font: ubuntuMono, name: "Ubuntu Mono" },
  "geist-mono": { font: geistMono, name: "Geist Mono" },
};
