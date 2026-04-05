import { useEffect, useRef } from "react";
import Lenis from "lenis";

const SCROLL_LOCK_EVENT = "portfolio:scroll-lock";

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    const handleScrollLock = (event: Event) => {
      const customEvent = event as CustomEvent<{ locked?: boolean }>;
      if (customEvent.detail?.locked) {
        lenis.stop();
        return;
      }

      lenis.start();
    };

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        return;
      }

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(raf);
      }
    };

    rafRef.current = requestAnimationFrame(raf);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener(SCROLL_LOCK_EVENT, handleScrollLock as EventListener);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener(SCROLL_LOCK_EVENT, handleScrollLock as EventListener);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
