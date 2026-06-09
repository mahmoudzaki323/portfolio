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
      <div
        aria-hidden="true"
        data-pattern-background="static"
        className={cn(
          "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(185,155,87,0.12),transparent_22rem),radial-gradient(circle_at_82%_12%,rgba(244,234,216,0.055),transparent_18rem),linear-gradient(rgba(185,155,87,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(185,155,87,0.055)_1px,transparent_1px)] bg-[size:auto,auto,72px_72px,72px_72px] opacity-70",
          patternClassName
        )}
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
