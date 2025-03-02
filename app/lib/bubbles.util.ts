import {
  BookHeart,
  Eclipse,
  Heart,
  Moon,
  Power,
  Salad,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";

// export Interfaces
export interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  isHovered: boolean;
  isPopping: boolean;
  gifIndex: number;
  isGrowing: boolean;
  visualSize: number; // Added to track the visual size during growth
  popIcon: number; // Added to track which icon to show when popping
  popColor: string; // Added to track the color of the pop icon
  glowIntensity: number; // Added to track the glow intensity during the growing phase
}

export interface BubblesProps {
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  bubbleCount?: number;
  backgroundColor?: string;
}

// GIF and thumbnail data
export const bubbleMedia = [
  {
    gif: "/rainbowofemotions.app.gif",
    thumbnail: "/rainbow-screenshot.jpg",
    title: "Rainbow of Emotions",
    liveLink: "https://rainbowofemotions.app/about",
  },
  {
    gif: "/email-editor.gif",
    thumbnail: "/email-editor-screenshot.png",
    title: "Loops Email Editor",
    liveLink: "https://loops.so",
  },
  {
    gif: "/generations-kampen.gif",
    thumbnail: "/generations-kampen-screenshot.jpg",
    title: "Generations Kampen",
    githubLink: "https://github.com/AaronGazzola/Generations-kampen",
    liveLink: "https://genapp.nangarra.games/",
  },
  {
    gif: "/origami.cool.gif",
    thumbnail: "/origami-screenshot.jpg",
    title: "Origami.Cool",
    githubLink: "https://github.com/AaronGazzola/Origami.cool",
  },
  {
    gif: "/questionnaire.gif",
    thumbnail: "/questionnaire-screenshot.png",
    title: "Questionnaire",
    liveLink: "https://questionnaire-demo-six.vercel.app",
    githubLink: "https://github.com/AaronGazzola/questionnaire-demo",
  },
];

// Array of pop icons
export const popIcons = [
  Sparkles,
  Heart,
  Sun,
  Moon,
  Star,
  Eclipse,
  Salad,
  BookHeart,
  Power,
];

// Array of vibrant colors for pop icons
export const vibrantColors = [
  "#FF5252", // Bright Red
  "#FF4081", // Pink
  "#7C4DFF", // Deep Purple
  "#536DFE", // Indigo
  "#448AFF", // Blue
  "#40C4FF", // Light Blue
  "#18FFFF", // Cyan
  "#64FFDA", // Teal
  "#69F0AE", // Green
  "#B2FF59", // Light Green
  "#EEFF41", // Lime
  "#FFFF00", // Yellow
  "#FFD740", // Amber
  "#FFAB40", // Orange
  "#FF6E40", // Deep Orange
];
