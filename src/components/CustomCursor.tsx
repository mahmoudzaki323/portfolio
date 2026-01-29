import { useEffect, useRef, useState, useCallback } from "react";

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Use refs for position to avoid re-renders
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const rafId = useRef<number | null>(null);
  const isRunning = useRef(false);

  const updateCursor = useCallback(() => {
    if (!isRunning.current) return;
    
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) {
      rafId.current = requestAnimationFrame(updateCursor);
      return;
    }

    // Smooth lerp for ring
    const ease = 0.12;
    ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
    ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;

    // Apply transforms directly (no React state)
    const scale = isHovering ? 1.6 : 1;
    ring.style.transform = `translate(${ringPos.current.x - 20}px, ${ringPos.current.y - 20}px) scale(${scale})`;
    dot.style.transform = `translate(${mousePos.current.x - 4}px, ${mousePos.current.y - 4}px)`;

    rafId.current = requestAnimationFrame(updateCursor);
  }, [isHovering]);

  useEffect(() => {
    // Only on desktop
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
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
      setIsHovering(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);

    // Start animation loop
    isRunning.current = true;
    rafId.current = requestAnimationFrame(updateCursor);

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      isRunning.current = false;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [updateCursor, isVisible]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      {/* Ring - starts off-screen */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center border border-white/60 transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isHovering ? "bg-white/10" : ""}`}
        style={{ 
          transform: "translate(-100px, -100px)",
          willChange: "transform",
        }}
      />
      
      {/* Dot - starts off-screen */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference hidden md:block transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isHovering ? "opacity-0" : "opacity-100"}`}
        style={{ 
          transform: "translate(-100px, -100px)",
          willChange: "transform",
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
