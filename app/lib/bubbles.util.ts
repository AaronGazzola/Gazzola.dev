import {
  Asterisk,
  Bed,
  Bell,
  BookHeart,
  Bot,
  BrainCog,
  Bug,
  Castle,
  ChefHat,
  Compass,
  ConciergeBell,
  Cone,
  Construction,
  Dices,
  Eclipse,
  FerrisWheel,
  Gamepad2,
  GraduationCap,
  Heart,
  Home,
  Joystick,
  LucideIcon,
  MessageCircleCode,
  MessageSquareCode,
  Moon,
  RollerCoaster,
  Salad,
  Sparkles,
  SquareFunction,
  Star,
  Sun,
  TicketSlash,
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

export interface BubbleHookProps {
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  bubbleCount?: number;
}

export interface BubbleMedia {
  gif: string;
  thumbnail: string;
  title: string;
  liveLink?: string;
  githubLink?: string;
}

export interface BubbleHookReturnType {
  bubbles: Bubble[];
  containerRef: React.RefObject<HTMLDivElement>;
  handleBubbleClick: (id: number) => void;
  handleMouseEnter: (id: number) => void;
  handleMouseLeave: (id: number) => void;
  handleLinkClick: (e: React.MouseEvent) => void;
  handleTouchStart: (event: React.TouchEvent, bubbleId: number) => void;
  handleTouchEnd: (event: React.TouchEvent, bubbleId: number) => void;
  handleTouchMove: (event: React.TouchEvent) => void;
  handleTouchCancel: (event: React.TouchEvent, bubbleId: number) => void;
  linkClickedRef?: React.MutableRefObject<boolean>;
}

// GIF and thumbnail data
export const bubbleMedia: BubbleMedia[] = [
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
  {
    gif: "/eco3d-screenshot.png",
    thumbnail: "/eco3d-screenshot.png",
    title: "Eco3D.Shop",
    liveLink: "https://eco3d.shop",
  },
  {
    gif: "/cash-dash-text.png",
    thumbnail: "/cash-dash-logo.png",
    title: "Cash Dash Pro Demo",
    liveLink: "https://demo.cashdash.pro",
  },
  {
    gif: "/github-full.png",
    thumbnail: "/github-thumb.png",
    title: "Github",
    liveLink: "https://github.com/AaronGazzola",
  },

  {
    gif: "/upwork-full.png",
    thumbnail: "/upwork-thumb.png",
    title: "Github",
    liveLink: "https://www.upwork.com/freelancers/~017424c1cc6bed64e2",
  },
];

// Array of pop icons
export const popIcons: LucideIcon[] = [
  Sparkles,
  Heart,
  Sun,
  Moon,
  Star,
  Eclipse,
  Salad,
  BookHeart,
  Cone,
  RollerCoaster,
  TicketSlash,
  FerrisWheel,
  SquareFunction,
  Asterisk,
  Bell,
  BrainCog,
  Bug,
  Bed,
  Home,
  Construction,
  ConciergeBell,
  Compass,
  Dices,
  Joystick,
  Gamepad2,
  Gamepad2, // Fixing the Gamepad import (should be Gamepad2 twice)
  Castle,
  GraduationCap,
  Bot,
  MessageCircleCode,
  MessageSquareCode,
  ChefHat,
];

// Array of vibrant colors for pop icons
export const vibrantColors: string[] = [
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
