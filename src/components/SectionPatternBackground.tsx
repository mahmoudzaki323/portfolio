import { FallingPattern } from "@/components/ui/falling-pattern";
import { cn } from "@/lib/utils";

type SectionPatternBackgroundProps = {
  patternClassName?: string;
  veilClassName?: string;
};

export function SectionPatternBackground({
  patternClassName,
  veilClassName,
}: SectionPatternBackgroundProps) {
  return (
    <>
      <FallingPattern
        aria-hidden="true"
        data-pattern-background="falling"
        color="color-mix(in srgb, var(--color-accent) 88%, var(--color-primary))"
        backgroundColor="oklch(0 0 0)"
        duration={128}
        blurIntensity="0.55em"
        density={1}
        className={cn("pointer-events-none absolute inset-0 opacity-85", patternClassName)}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(185,155,87,0.12),transparent_28rem),linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.68)_100%)]",
          veilClassName
        )}
      />
    </>
  );
}
