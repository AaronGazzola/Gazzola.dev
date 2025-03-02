"use client";

import {
  Bubble,
  BubbleHookProps,
  BubbleHookReturnType,
  bubbleMedia,
  popIcons,
  vibrantColors,
} from "@/app/lib/bubbles.util";
import { useCallback, useEffect, useRef, useState } from "react";

export const useBubbles = ({
  minSize = 40,
  maxSize = 100,
  minSpeed = 0.5,
  maxSpeed = 1.5,
  bubbleCount = 50,
  onBubblePop = undefined,
}: BubbleHookProps): BubbleHookReturnType => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedBubble, setSelectedBubble] = useState<number | null>(null);
  const [activeTouchId, setActiveTouchId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const lastBubbleTime = useRef<number>(0);
  const growTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});
  const growAnimationRef = useRef<Record<number, number>>({});
  const popTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});
  const glowAnimationRef = useRef<Record<number, number>>({});
  const touchBubbleRef = useRef<Record<number, number>>({});
  const linkClickedRef = useRef<boolean>(false);
  const touchStartPositionRef = useRef({ x: 0, y: 0 });
  const touchStartTimeRef = useRef<number>(0);

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
    // Skip bubble popping if a link was clicked
    if (linkClickedRef.current) {
      linkClickedRef.current = false;
      return;
    }

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

      // Call onBubblePop callback if provided
      if (onBubblePop && bubble) {
        onBubblePop(id, bubble.popColor);
      }

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
    // If a link was clicked, don't close the bubble
    if (linkClickedRef.current) {
      return;
    }

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

  // Handle link click for both mouse and touch events
  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    linkClickedRef.current = true;

    // Set a timeout to reset the linkClicked flag after navigation occurs
    setTimeout(() => {
      linkClickedRef.current = false;
    }, 300);
  };

  // Handle touch start event for bubbles
  const handleTouchStart = (event: React.TouchEvent, bubbleId: number) => {
    // Don't prevent default or stop propagation for link elements
    if (event.target instanceof Element && event.target.closest("a")) {
      linkClickedRef.current = true;
      return;
    }

    // Record the touch start position and time for tap detection
    const touch = event.touches[0];
    touchStartPositionRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
    touchStartTimeRef.current = Date.now();

    // Prevent default to avoid scrolling and other default behaviors
    event.preventDefault();
    event.stopPropagation();

    // Only process if we don't already have an active touch
    if (activeTouchId === null) {
      // Save the touch identifier and associated bubble
      setActiveTouchId(touch.identifier);
      touchBubbleRef.current[touch.identifier] = bubbleId;
    }
  };

  // Handle touch end event for bubbles - fix for the tap behavior
  const handleTouchEnd = (event: React.TouchEvent, bubbleId: number) => {
    // Don't prevent default for link elements
    if (event.target instanceof Element && event.target.closest("a")) {
      return;
    }

    // Prevent default behavior
    event.preventDefault();

    // Don't pop if a link was clicked
    if (linkClickedRef.current) {
      linkClickedRef.current = false;
      return;
    }

    // Process any ending touches
    Array.from(event.changedTouches).forEach((touch) => {
      if (touch.identifier === activeTouchId) {
        // Reset the active touch
        setActiveTouchId(null);
        delete touchBubbleRef.current[touch.identifier];

        // Get the touch end position and calculate distance moved
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTimeRef.current;
        const distanceX = Math.abs(
          touch.clientX - touchStartPositionRef.current.x
        );
        const distanceY = Math.abs(
          touch.clientY - touchStartPositionRef.current.y
        );
        const totalDistance = Math.sqrt(
          distanceX * distanceX + distanceY * distanceY
        );

        // If it's a quick tap (short duration and small movement), pop the bubble
        // instead of starting the hover animation
        if (touchDuration < 300 && totalDistance < 10) {
          // This was a tap, so pop the bubble
          handleBubbleClick(bubbleId);
        } else {
          // This was not a tap (dragging or long press), so just end the hover
          handleMouseLeave(bubbleId);
        }
      }
    });
  };

  // Handle touch move to maintain hover state even when moving
  const handleTouchMove = (event: React.TouchEvent) => {
    // Don't prevent default for link elements
    if (event.target instanceof Element && event.target.closest("a")) {
      return;
    }

    // Prevent default to avoid scrolling
    event.preventDefault();
  };

  // Handle touch cancel (e.g., when a system dialog appears)
  const handleTouchCancel = (event: React.TouchEvent, bubbleId: number) => {
    // Don't reset if a link was clicked
    if (linkClickedRef.current) {
      return;
    }

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
      // Skip if a link was clicked
      if (linkClickedRef.current) {
        return;
      }

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

  return {
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
  };
};
