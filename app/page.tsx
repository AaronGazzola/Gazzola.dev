"use client";
import { GithubLogo } from "@/app/Logos";
import {
  BookHeart,
  Eclipse,
  ExternalLinkIcon,
  Heart,
  Moon,
  Power,
  Salad,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";

// Interfaces
interface Bubble {
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

interface BubblesProps {
  minSize?: number;
  maxSize?: number;
  minSpeed?: number;
  maxSpeed?: number;
  bubbleCount?: number;
  backgroundColor?: string;
}

// GIF and thumbnail data
const bubbleMedia = [
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
const popIcons = [
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
const vibrantColors = [
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

const Bubbles: React.FC<BubblesProps> = ({
  minSize = 40,
  maxSize = 100,
  minSpeed = 0.5,
  maxSpeed = 1.5,
  bubbleCount = 50,
  backgroundColor = "linear-gradient(180deg, rgba(75, 0, 130, 0.6) 0%, rgba(138, 43, 226, 0.6) 100%)",
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedBubble, setSelectedBubble] = useState<number | null>(null);
  const [activeTouchId, setActiveTouchId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastBubbleTime = useRef<number>(0);
  const growTimeoutRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const growAnimationRef = useRef<{ [key: number]: number }>({});
  const popTimeoutRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
  const glowAnimationRef = useRef<{ [key: number]: number }>({});
  const touchBubbleRef = useRef<{ [touchId: number]: number }>({});

  // Initialize dimensions
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Create a new bubble
  const createBubble = useCallback((): Bubble => {
    const size = Math.random() * (maxSize - minSize) + minSize;
    return {
      id: Math.random(),
      x: Math.random() * dimensions.width,
      y: dimensions.height + size,
      size,
      speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
      opacity: Math.random() * 0.5 + 0.3,
      isHovered: false,
      isPopping: false,
      gifIndex: Math.floor(Math.random() * bubbleMedia.length),
      isGrowing: false,
      visualSize: size, // Initialize visual size to match actual size
      popIcon: Math.floor(Math.random() * popIcons.length),
      popColor: vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
      glowIntensity: 0, // Initialize glow intensity to 0
    };
  }, [
    maxSize,
    minSize,
    dimensions.width,
    dimensions.height,
    maxSpeed,
    minSpeed,
  ]);

  // Animation function for smooth growth
  const animateGrowth = (id: number, startTime: number) => {
    const bubble = bubbles.find((b) => b.id === id);
    if (!bubble || !bubble.isGrowing) return;

    const elapsed = Date.now() - startTime;
    const duration = 500; // 500ms for growth animation
    const progress = Math.min(elapsed / duration, 1);

    // Calculate current visual size based on animation progress
    const targetSize = bubble.size * 2;
    const currentSize = bubble.size + (targetSize - bubble.size) * progress;

    setBubbles((prevBubbles) =>
      prevBubbles.map((b) =>
        b.id === id ? { ...b, visualSize: currentSize } : b
      )
    );

    if (progress < 1) {
      growAnimationRef.current[id] = requestAnimationFrame(() =>
        animateGrowth(id, startTime)
      );
    }
  };

  // Animation function for glow effect
  const animateGlow = (id: number, startTime: number) => {
    const bubble = bubbles.find((b) => b.id === id);
    if (!bubble || !bubble.isGrowing) return;

    const elapsed = Date.now() - startTime;
    const duration = 1500; // 1500ms for glow animation (matches the growing phase timeout)
    const progress = Math.min(elapsed / duration, 1);

    // Calculate current glow intensity based on animation progress with easing
    const targetIntensity = 1; // Full intensity
    // Use easing function to make glow more dramatic as it progresses
    const easeInOut =
      progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const currentIntensity = easeInOut * targetIntensity;

    setBubbles((prevBubbles) =>
      prevBubbles.map((b) =>
        b.id === id ? { ...b, glowIntensity: currentIntensity } : b
      )
    );

    if (progress < 1 && bubble.isGrowing) {
      glowAnimationRef.current[id] = requestAnimationFrame(() =>
        animateGlow(id, startTime)
      );
    }
  };

  // Handle click for bubble popping
  const handleBubbleClick = (id: number) => {
    const bubble = bubbles.find((b) => b.id === id);

    // Only pop if the bubble is not already hovered (in second phase)
    if (bubble && !bubble.isHovered) {
      // Clear any growing timeout and animation for this bubble
      if (growTimeoutRef.current[id]) {
        clearTimeout(growTimeoutRef.current[id]);
        delete growTimeoutRef.current[id];
      }

      if (growAnimationRef.current[id]) {
        cancelAnimationFrame(growAnimationRef.current[id]);
        delete growAnimationRef.current[id];
      }

      if (glowAnimationRef.current[id]) {
        cancelAnimationFrame(glowAnimationRef.current[id]);
        delete glowAnimationRef.current[id];
      }

      // Set the bubble to popping state
      setBubbles((prevBubbles) =>
        prevBubbles.map((b) =>
          b.id === id ? { ...b, isPopping: true, isGrowing: false } : b
        )
      );

      // Remove the bubble after animation completes
      popTimeoutRef.current[id] = setTimeout(() => {
        setBubbles((prevBubbles) => prevBubbles.filter((b) => b.id !== id));
        delete popTimeoutRef.current[id];
      }, 1000);
    }
  };

  // Handle mouse enter for bubbles
  const handleMouseEnter = (id: number) => {
    // Only allow hovering if no bubble is selected or this is the selected bubble
    if (selectedBubble === null || selectedBubble === id) {
      setSelectedBubble(id);

      // First set the bubble to growing state
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) =>
          bubble.id === id ? { ...bubble, isGrowing: true } : bubble
        )
      );

      // Start growth animation
      const startTime = Date.now();
      growAnimationRef.current[id] = requestAnimationFrame(() =>
        animateGrowth(id, startTime)
      );

      // Start glow animation
      glowAnimationRef.current[id] = requestAnimationFrame(() =>
        animateGlow(id, startTime)
      );

      // After a delay, set it to fully hovered
      growTimeoutRef.current[id] = setTimeout(() => {
        // Cancel the growth animation
        if (growAnimationRef.current[id]) {
          cancelAnimationFrame(growAnimationRef.current[id]);
          delete growAnimationRef.current[id];
        }

        // Cancel the glow animation
        if (glowAnimationRef.current[id]) {
          cancelAnimationFrame(glowAnimationRef.current[id]);
          delete glowAnimationRef.current[id];
        }

        setBubbles((prevBubbles) =>
          prevBubbles.map((bubble) =>
            bubble.id === id
              ? {
                  ...bubble,
                  isHovered: true,
                  isGrowing: false,
                  glowIntensity: 0, // Reset glow when entering fully hovered state
                }
              : bubble
          )
        );
      }, 1500); // 1500ms for the growing animation
    }
  };

  // Handle mouse leave for bubbles
  const handleMouseLeave = (id: number) => {
    // Clear any growing timeout for this bubble
    if (growTimeoutRef.current[id]) {
      clearTimeout(growTimeoutRef.current[id]);
      delete growTimeoutRef.current[id];
    }

    // Cancel any growth animation
    if (growAnimationRef.current[id]) {
      cancelAnimationFrame(growAnimationRef.current[id]);
      delete growAnimationRef.current[id];
    }

    // Cancel any glow animation
    if (glowAnimationRef.current[id]) {
      cancelAnimationFrame(glowAnimationRef.current[id]);
      delete glowAnimationRef.current[id];
    }

    setBubbles((prevBubbles) =>
      prevBubbles.map((bubble) =>
        bubble.id === id
          ? {
              ...bubble,
              isHovered: false,
              isGrowing: false,
              visualSize: bubble.size, // Reset visual size to original
              glowIntensity: 0, // Reset glow intensity
            }
          : bubble
      )
    );

    setSelectedBubble(null);
  };

  // Handle touch start event for bubbles
  const handleTouchStart = (event: React.TouchEvent, bubbleId: number) => {
    // Prevent default to avoid scrolling and other default behaviors
    event.preventDefault();

    // Only process if we don't already have an active touch
    if (activeTouchId === null) {
      // Get the first touch from the event
      const touch = event.touches[0];

      // Save the touch identifier and associated bubble
      setActiveTouchId(touch.identifier);
      touchBubbleRef.current[touch.identifier] = bubbleId;

      // Call the same handler as for mouse enter
      handleMouseEnter(bubbleId);
    }
  };

  // Handle touch end event for bubbles
  const handleTouchEnd = (event: React.TouchEvent, bubbleId: number) => {
    // Prevent default behavior
    event.preventDefault();

    // Process any ending touches
    Array.from(event.changedTouches).forEach((touch) => {
      if (touch.identifier === activeTouchId) {
        // Reset the active touch
        setActiveTouchId(null);
        delete touchBubbleRef.current[touch.identifier];

        // Call the same handler as for mouse leave
        handleMouseLeave(bubbleId);
      }
    });
  };

  // Handle touch move to maintain hover state even when moving
  const handleTouchMove = (event: React.TouchEvent) => {
    // Prevent default to avoid scrolling
    event.preventDefault();
  };

  // Handle touch cancel (e.g., when a system dialog appears)
  const handleTouchCancel = (event: React.TouchEvent, bubbleId: number) => {
    // Reset any active touches
    Array.from(event.changedTouches).forEach((touch) => {
      if (touchBubbleRef.current[touch.identifier]) {
        // Call the mouse leave handler for the associated bubble
        handleMouseLeave(touchBubbleRef.current[touch.identifier]);

        // Clean up
        delete touchBubbleRef.current[touch.identifier];
      }
    });

    setActiveTouchId(null);
  };

  // Global touch handler for container to capture touch events that might leave bubbles
  useEffect(() => {
    const handleGlobalTouchEnd = (event: TouchEvent) => {
      // Check if we have an active touch that's ending
      Array.from(event.changedTouches).forEach((touch) => {
        if (touch.identifier === activeTouchId) {
          // Get the associated bubble ID
          const bubbleId = touchBubbleRef.current[touch.identifier];
          if (bubbleId) {
            // Call the mouse leave handler
            handleMouseLeave(bubbleId);

            // Clean up
            delete touchBubbleRef.current[touch.identifier];
            setActiveTouchId(null);
          }
        }
      });
    };

    // Add global event listener to catch all touch ends
    document.addEventListener("touchend", handleGlobalTouchEnd);
    document.addEventListener("touchcancel", handleGlobalTouchEnd);

    return () => {
      document.removeEventListener("touchend", handleGlobalTouchEnd);
      document.removeEventListener("touchcancel", handleGlobalTouchEnd);
    };
  }, [activeTouchId]);

  // Animation loop
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    // Initialize bubbles
    const initialBubbles = Array.from(
      { length: bubbleCount / 2 },
      createBubble
    );
    setBubbles(initialBubbles);

    const animate = (timestamp: number) => {
      // Add new bubbles periodically
      if (timestamp - lastBubbleTime.current > 300) {
        setBubbles((prevBubbles) => {
          // Only add new bubbles if we're below the count
          if (prevBubbles.length < bubbleCount) {
            return [...prevBubbles, createBubble()];
          }
          return prevBubbles;
        });
        lastBubbleTime.current = timestamp;
      }

      // Update bubble positions
      setBubbles((prevBubbles) =>
        prevBubbles
          .map((bubble) => {
            // If the bubble is being hovered or growing, move it very slowly (10% of original speed)
            const effectiveSpeed =
              bubble.isHovered || bubble.isGrowing
                ? bubble.speed * 0.1
                : bubble.speed;

            // Move the bubble upward
            const newY = bubble.y - effectiveSpeed;

            // Add slight horizontal movement for a natural effect
            const wobble = Math.sin(timestamp / 1000 + bubble.id) * 0.5;
            const newX = bubble.x + wobble;

            return { ...bubble, x: newX, y: newY };
          })
          // Remove bubbles that have moved off the top of the screen
          .filter((bubble) => bubble.y > -bubble.size * 2)
      );

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      // Clear all timeouts
      Object.values(growTimeoutRef.current).forEach(clearTimeout);
      growTimeoutRef.current = {};
      // Clear all animations
      Object.values(growAnimationRef.current).forEach(cancelAnimationFrame);
      growAnimationRef.current = {};
      // Clear all glow animations
      Object.values(glowAnimationRef.current).forEach(cancelAnimationFrame);
      glowAnimationRef.current = {};
      // Clear all pop timeouts
      Object.values(popTimeoutRef.current).forEach(clearTimeout);
      popTimeoutRef.current = {};
    };
  }, [
    dimensions,
    bubbleCount,
    maxSize,
    minSize,
    maxSpeed,
    minSpeed,
    createBubble,
  ]);

  // Render bubbles
  return (
    <div
      className="select-none"
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: backgroundColor,
        overflow: "hidden",
        touchAction: "none", // Prevent browser handling of touch events
      }}
    >
      {bubbles.map((bubble) => {
        const media = bubbleMedia[bubble.gifIndex];
        // Use the visual size for rendering, which dynamically animates during growth
        const displaySize = bubble.isHovered
          ? "100%"
          : bubble.isGrowing
          ? `${bubble.visualSize}px`
          : `${bubble.size}px`;

        // Select the appropriate icon component
        const PopIcon = popIcons[bubble.popIcon];

        // Calculate glow styles based on glowIntensity
        const glowSize = Math.max(15, bubble.glowIntensity * 50); // Start with 15px minimum, up to 50px max glow

        return (
          <div
            key={bubble.id}
            onClick={() => handleBubbleClick(bubble.id)}
            onMouseEnter={() => handleMouseEnter(bubble.id)}
            onMouseLeave={() => handleMouseLeave(bubble.id)}
            onTouchStart={(e) => handleTouchStart(e, bubble.id)}
            onTouchEnd={(e) => handleTouchEnd(e, bubble.id)}
            onTouchCancel={(e) => handleTouchCancel(e, bubble.id)}
            onTouchMove={handleTouchMove}
            style={{
              position: "absolute",
              left: bubble.isHovered ? "50%" : `${bubble.x}px`,
              top: bubble.isHovered ? "50%" : `${bubble.y}px`,
              width: bubble.isPopping
                ? `${bubble.visualSize * 1.5}px`
                : displaySize,
              height: bubble.isPopping
                ? `${bubble.visualSize * 1.5}px`
                : displaySize,
              borderRadius: bubble.isHovered ? "8px" : "50%",
              border: bubble.isPopping ? `1px dashed black` : "none",
              background: bubble.isPopping
                ? "transparent"
                : bubble.isHovered
                ? "radial-gradient(circle at center, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 70%)"
                : bubble.isGrowing
                ? `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, ${
                    0.8 + 0.2 * bubble.glowIntensity
                  }), rgba(255, 255, 255, ${0.4 + 0.4 * bubble.glowIntensity}))`
                : "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))",
              boxShadow: bubble.isPopping
                ? "none"
                : bubble.isHovered
                ? "0 0 20px rgba(255, 255, 255, 0.5)"
                : bubble.isGrowing
                ? `0 0 ${glowSize}px ${glowSize / 2}px rgba(255, 255, 255, ${
                    0.7 * bubble.glowIntensity + 0.3
                  })`
                : "0 0 10px rgba(255, 255, 255, 0.3)",
              opacity: bubble.isPopping
                ? bubble.visualSize > 0
                  ? 0.7
                  : 0
                : bubble.isHovered
                ? 1
                : bubble.opacity,
              transform: bubble.isPopping
                ? "scale(1.5)"
                : bubble.isHovered
                ? "translate(-50%, -50%)"
                : "scale(1)",
              transition: bubble.isPopping
                ? "width 0.8s ease-out, height 0.8s ease-out, opacity 0.8s ease-out, transform 0.8s ease-out"
                : bubble.isHovered
                ? "transform 0.3s ease, opacity 0.3s ease, border-radius 0.5s ease, box-shadow 0.3s ease"
                : !bubble.isGrowing
                ? "transform 0.3s ease, opacity 0.3s ease, width 0.5s ease, height 0.5s ease, border-radius 0.5s ease, box-shadow 0.3s ease"
                : "", // Remove transition during growth animation for smooth rendering
              overflow: "hidden",
              maxWidth: bubble.isHovered
                ? "80%"
                : bubble.isGrowing
                ? displaySize
                : `${bubble.size}px`,
              maxHeight: bubble.isHovered
                ? "80vh"
                : bubble.isGrowing
                ? displaySize
                : `${bubble.size}px`,
              margin: bubble.isHovered ? "auto" : "0",
              zIndex: bubble.isHovered || bubble.isGrowing ? 10 : 1,
              cursor:
                !bubble.isHovered && !bubble.isPopping
                  ? "pointer"
                  : bubble.isHovered
                  ? "default"
                  : "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              touchAction: "none", // Disable browser handling of all panning/zooming gestures
            }}
          >
            {/* Pop Icon (only shown when popping) */}
            {bubble.isPopping && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 20,
                  animation: "popFadeIn 0.3s ease-out",
                }}
              >
                <PopIcon size={bubble.size * 0.5} color={bubble.popColor} />
              </div>
            )}

            {/* Content container (only visible when not popping) */}
            {!bubble.isPopping && (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  filter: bubble.isHovered ? "blur(0)" : "blur(3px)",
                  transition: "filter 0.3s ease",
                  paddingTop: bubble.isHovered ? "56.25%" : "0", // 16:9 aspect ratio when expanded
                }}
              >
                {/* Paused state (thumbnail) shown when not hovered */}
                {!bubble.isHovered && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "120%",
                      height: "120%",
                      transform: "translate(-10%, -10%)",
                    }}
                  >
                    <img
                      src={media.thumbnail}
                      alt="Thumbnail"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      draggable="false" // Prevent image dragging
                    />
                  </div>
                )}

                {/* GIF shown when hovered with 100% opacity and no blur */}
                {bubble.isHovered && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <img
                      src={media.gif}
                      alt={media.title || "GIF"}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        opacity: 1, // Full opacity for playing GIFs
                      }}
                      draggable="false" // Prevent image dragging
                    />
                  </div>
                )}

                <div
                  style={{
                    position: "absolute",
                    bottom: "0.5rem",
                    left: "0.5rem",
                    zIndex: 20,
                    opacity: 1,
                    transition: "opacity 0.3s ease",
                    cursor: "pointer",
                  }}
                >
                  {bubble.isHovered && media.githubLink && (
                    <Link
                      rel="noopener noreferrer"
                      target="_blank"
                      href={media.githubLink}
                      style={{
                        position: "relative",
                        width: "1.5rem",
                        height: "1.5rem",
                      }}
                      onClick={(e) => e.stopPropagation()} // Prevent bubble click event
                    >
                      <div className="w-10 h-10  bg-white rounded-full">
                        <GithubLogo className="fill-gray-700 hover:fill-black absolute inset-0 w-10 h-10" />
                      </div>
                    </Link>
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "0.5rem",
                    right: "0.5rem",
                    zIndex: 20,
                    opacity: 1,
                    transition: "opacity 0.3s ease",
                    cursor: "pointer",
                  }}
                >
                  {bubble.isHovered && media.liveLink && (
                    <Link
                      rel="noopener noreferrer"
                      target="_blank"
                      href={media.liveLink}
                      style={{
                        position: "relative",
                        width: "1.5rem",
                        height: "1.5rem",
                      }}
                      onClick={(e) => e.stopPropagation()} // Prevent bubble click event
                    >
                      <div className="w-10 h-10  bg-white rounded-full p-1 flex items-center justify-center">
                        <ExternalLinkIcon className="text-black" />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add CSS for pop animation */}
      <style jsx global>{`
        @keyframes popFadeIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

// Wrapper for Next.js page component
export default function BubblesPage() {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <Bubbles />
    </div>
  );
}
