"use client";
import { GithubLogo } from "@/app/Logos";
import { useBubbles } from "@/app/hooks/bubbles.hook";
import { BubblesProps, bubbleMedia, popIcons } from "@/app/lib/bubbles.util";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

// Function to get a complementary color
const getComplementaryColor = (hexColor: string): string => {
  // Remove the # if present
  hexColor = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);

  // Get complementary RGB values (255 - original)
  const compR = 255 - r;
  const compG = 255 - g;
  const compB = 255 - b;

  // Make it darker and more subtle
  const darkR = Math.floor(compR * 0.3);
  const darkG = Math.floor(compG * 0.3);
  const darkB = Math.floor(compB * 0.3);

  // Convert back to hex
  return `#${darkR.toString(16).padStart(2, "0")}${darkG
    .toString(16)
    .padStart(2, "0")}${darkB.toString(16).padStart(2, "0")}`;
};

const Bubbles: React.FC<BubblesProps> = ({
  minSize = 40,
  maxSize = 100,
  minSpeed = 0.5,
  maxSpeed = 1.5,
  bubbleCount = 50,
  backgroundColor = "linear-gradient(180deg, rgba(75, 0, 130, 0.6) 0%, rgba(138, 43, 226, 0.6) 100%)",
}) => {
  // State for background color
  const [currentBgColor, setCurrentBgColor] = useState<string>(backgroundColor);

  // Custom bubble click handler to update background color
  const customBubbleClickHandler = (
    bubbleId: number,
    popColor: string
  ): void => {
    // Get complementary color of the pop icon color
    const complementaryColor = getComplementaryColor(popColor);
    setCurrentBgColor(complementaryColor);
  };

  const {
    bubbles,
    containerRef,
    handleBubbleClick,
    handleMouseEnter,
    handleMouseLeave,
    handleLinkClick,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    handleTouchCancel,
    linkClickedRef,
  } = useBubbles({
    minSize,
    maxSize,
    minSpeed,
    maxSpeed,
    bubbleCount,
    onBubblePop: customBubbleClickHandler, // Pass custom handler for bubble pop
  });

  return (
    <div
      className="select-none"
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()} // Prevent right-click/long-press menu globally
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: currentBgColor, // Use dynamic background color
        overflow: "hidden",
        touchAction: "none", // Prevent browser handling of touch events
        WebkitTouchCallout: "none", // Disable iOS touch callout
        WebkitUserSelect: "none", // Disable selection on iOS
        userSelect: "none", // Disable text selection
        transition: "background 0.5s ease", // Smooth transition for background changes
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
              borderRadius: bubble.isHovered ? "20px" : "50%",
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
                        WebkitTouchCallout: "none", // Disable iOS touch callout
                        WebkitUserSelect: "none", // Disable selection on iOS
                        userSelect: "none", // Disable text selection
                        pointerEvents: "none", // Pass all pointer events to the parent
                      }}
                      draggable="false" // Prevent image dragging
                      onContextMenu={(e) => e.preventDefault()} // Prevent right-click/long-press menu
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
                        WebkitTouchCallout: "none", // Disable iOS touch callout
                        WebkitUserSelect: "none", // Disable selection on iOS
                        userSelect: "none", // Disable text selection
                        pointerEvents: "none", // Pass all pointer events to the parent
                      }}
                      draggable="false" // Prevent image dragging
                      onContextMenu={(e) => e.preventDefault()} // Prevent right-click/long-press menu
                    />
                  </div>
                )}

                <div
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    left: 0,
                    zIndex: 20,
                    opacity: 1,
                    transition: "opacity 0.3s ease",
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
                        display: "block",
                        pointerEvents: "auto", // Explicitly enable pointer events
                        touchAction: "auto", // Enable default touch behavior for links
                        cursor: "pointer",
                        zIndex: 30,
                      }}
                      onClick={handleLinkClick}
                      onTouchStart={(e) => {
                        // Allow event to propagate but mark as link clicked
                        linkClickedRef!.current = true;
                      }}
                      onTouchEnd={(e) => {
                        // Don't stop propagation or prevent default here
                        // to allow the click/tap to go through
                      }}
                    >
                      <div className="w-10 h-10 bg-white rounded-full">
                        <GithubLogo className="fill-gray-700 hover:fill-black absolute inset-0 w-10 h-10" />
                      </div>
                    </Link>
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "1rem",
                    right: "1rem",
                    zIndex: 20,
                    opacity: 1,
                    transition: "opacity 0.3s ease",
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
                        display: "block",
                        pointerEvents: "auto", // Explicitly enable pointer events
                        touchAction: "auto", // Enable default touch behavior for links
                        cursor: "pointer",
                        zIndex: 30,
                      }}
                      onClick={handleLinkClick}
                      onTouchStart={(e) => {
                        // Allow event to propagate but mark as link clicked
                        linkClickedRef!.current = true;
                      }}
                      onTouchEnd={(e) => {
                        // Don't stop propagation or prevent default here
                        // to allow the click/tap to go through
                      }}
                    >
                      <div className="w-10 h-10 bg-white rounded-full p-1 flex items-center justify-center">
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
