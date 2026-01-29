import { useEffect, useState, useRef, useCallback } from "react";

interface ScrollProgressOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useScrollProgress(
  elementRef: React.RefObject<HTMLElement | null>,
  options: ScrollProgressOptions = {}
) {
  // Options destructured for future use (threshold, rootMargin)
  const { threshold: _threshold = 0, rootMargin: _rootMargin = "0px" } = options;
  const [progress, setProgress] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const lastProgressRef = useRef(0);

  const updateProgress = useCallback(() => {
    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementHeight = rect.height;

    // Calculate progress based on element position in viewport
    const startOffset = windowHeight; // When element enters from bottom
    const endOffset = -elementHeight; // When element exits from top
    const totalDistance = startOffset - endOffset;
    const currentPosition = startOffset - rect.top;
    
    const newProgress = Math.max(0, Math.min(1, currentPosition / totalDistance));
    
    // Only update if progress changed significantly
    if (Math.abs(newProgress - lastProgressRef.current) > 0.001) {
      lastProgressRef.current = newProgress;
      setProgress(newProgress);
    }

    const inView = rect.top < windowHeight && rect.bottom > 0;
    setIsInView(inView);
  }, [elementRef]);

  useEffect(() => {
    const handleScroll = () => {
      if (rafIdRef.current) return;
      rafIdRef.current = requestAnimationFrame(() => {
        updateProgress();
        rafIdRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateProgress]);

  return { progress, isInView };
}

export function useInView(
  elementRef: React.RefObject<HTMLElement | null>,
  options: ScrollProgressOptions = {}
) {
  const { threshold = 0.1, rootMargin = "0px" } = options;
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, threshold, rootMargin]);

  return isInView;
}
