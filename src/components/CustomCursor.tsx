import { useEffect, useRef } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const isHoveringRef = useRef(false);
  const isVisibleRef = useRef(false);
  
  // Use refs for position to avoid re-renders
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);
  const isRunning = useRef(false);

  useEffect(() => {
    // Only on desktop
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const syncCursorState = () => {
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (!ring || !dot) return;

      ring.style.opacity = isVisibleRef.current ? "1" : "0";
      ring.style.borderColor = isHoveringRef.current
        ? "rgba(255, 255, 255, 0.92)"
        : "rgba(255, 255, 255, 0.6)";
      dot.style.opacity = isVisibleRef.current && !isHoveringRef.current ? "1" : "0";
    };

    const updateCursor = () => {
      if (!isRunning.current) return;

      const ring = ringRef.current;
      const dot = dotRef.current;
      if (!ring || !dot) {
        rafId.current = requestAnimationFrame(updateCursor);
        return;
      }

      const ease = 0.12;
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

      const scale = isHoveringRef.current ? 1.35 : 1;
      ring.style.transform = `translate3d(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px, 0) scale(${scale})`;
      dot.style.transform = `translate3d(${mousePos.current.x - 4}px, ${mousePos.current.y - 4}px, 0)`;

      rafId.current = requestAnimationFrame(updateCursor);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        syncCursorState();
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = !!(
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.cursor === "pointer"
      );
      if (isHoveringRef.current !== isClickable) {
        isHoveringRef.current = isClickable;
        syncCursorState();
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      syncCursorState();
    };
    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      syncCursorState();
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning.current = false;
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
          rafId.current = null;
        }
        return;
      }

      if (!isRunning.current) {
        isRunning.current = true;
        rafId.current = requestAnimationFrame(updateCursor);
      }

      syncCursorState();
    };

    // Start animation loop
    syncCursorState();
    isRunning.current = true;
    rafId.current = requestAnimationFrame(updateCursor);

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isRunning.current = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Ring - starts off-screen */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 hidden h-10 w-10 items-center justify-center rounded-full border pointer-events-none z-[9999] mix-blend-difference transition-[opacity,border-color] duration-200 md:flex"
        style={{ 
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform, opacity",
          contain: "layout style paint",
          opacity: 0,
          borderColor: "rgba(255, 255, 255, 0.6)",
        }}
      />
      
      {/* Dot - starts off-screen */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 hidden h-2 w-2 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference transition-opacity duration-200 md:block"
        style={{ 
          transform: "translate3d(-100px, -100px, 0)",
          willChange: "transform, opacity",
          contain: "layout style paint",
          opacity: 0,
        }}
      />

      <style>{`
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}
