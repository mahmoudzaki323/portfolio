import { useEffect, useState } from "react";
import { gsap } from "gsap";

interface PageLoaderProps {
  onLoadComplete?: () => void;
}

export function PageLoader({ onLoadComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const loadingLabel =
    progress < 30
      ? "Loading selected work"
      : progress < 60
        ? "Preparing project visuals"
        : progress < 85
          ? "Tuning interactions"
          : progress < 100
            ? "Opening portfolio"
            : "Ready";

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
    <div className="loader-bg fixed inset-0 z-[10000] overflow-hidden bg-background flex items-center justify-center">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at top, rgba(59,130,246,0.16), transparent 35%), radial-gradient(circle at 80% 20%, rgba(45,212,191,0.12), transparent 30%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="loader-content relative flex w-full max-w-md flex-col items-center gap-8 px-6 text-center">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
          <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/45">
            Mahmoud Zaki
          </span>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/35">
            Selected Work
          </p>
          <h2 className="text-4xl font-display font-bold tracking-tight text-white">
            Portfolio
          </h2>
          <p className="text-sm leading-relaxed text-white/45">
            {loadingLabel}
          </p>
        </div>

        <div className="w-full space-y-3">
          <div className="h-px overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            <span>Loading</span>
            <span>{Math.floor(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
