import { useEffect, useState } from "react";
import { gsap } from "gsap";

interface PageLoaderProps {
  onLoadComplete?: () => void;
}

export function PageLoader({ onLoadComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Non-linear progress for realism
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      // Animate out
      const tl = gsap.timeline({
        onComplete: () => {
          setIsComplete(true);
          onLoadComplete?.();
        },
      });

      tl.to(".loader-content", {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
      }).to(
        ".loader-bg",
        {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut",
        },
        "-=0.2"
      );
    }
  }, [progress, onLoadComplete]);

  if (isComplete) return null;

  return (
    <div className="loader-bg fixed inset-0 z-[10000] bg-background flex items-center justify-center">
      <div className="loader-content flex flex-col items-center gap-8">
        {/* Logo animation */}
        <div className="relative">
          <div className="text-6xl animate-pulse">🌍</div>
          {/* Orbit rings */}
          <div className="absolute inset-0 -m-4">
            <div
              className="w-full h-full border border-white/20 rounded-full animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>
          <div className="absolute inset-0 -m-8">
            <div
              className="w-full h-full border border-white/10 rounded-full animate-spin"
              style={{ animationDuration: "5s", animationDirection: "reverse" }}
            />
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-sm font-mono uppercase tracking-widest text-white/40 mb-2">
            Loading Experience
          </p>
          <p className="text-2xl font-bold tabular-nums">
            {Math.floor(progress)}%
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading messages */}
        <div className="h-6">
          <p className="text-xs text-white/30 animate-pulse">
            {progress < 30 && "Initializing..."}
            {progress >= 30 && progress < 60 && "Loading 3D Assets..."}
            {progress >= 60 && progress < 85 && "Preparing Galleries..."}
            {progress >= 85 && progress < 100 && "Almost Ready..."}
            {progress >= 100 && "Launching..."}
          </p>
        </div>
      </div>
    </div>
  );
}
