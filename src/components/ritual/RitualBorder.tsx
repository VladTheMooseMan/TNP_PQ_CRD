// ============================================================
// FILE: src/components/ritual/RitualBorder.tsx
// PURPOSE: Border + condition-variant frame wrapper.
// ------------------------------------------------------------
// ASCII FLOW:
//   style_flags -> compute background filter + border svg class
//      -> render children inside themed frame
// ============================================================
import { ReactNode } from "react";
import { RitualStyleFlags } from "../../lib/db_rituals";

const condition_variant_filter_lookup: Record<RitualStyleFlags["condition_variant"], string> = {
  pristine: "none",
  blood: "sepia(0.4) hue-rotate(-20deg) saturate(1.2)",
  burn: "contrast(1.1) brightness(0.85) sepia(0.5)",
  water: "blur(0.3px) sepia(0.3) brightness(0.95)",
};

const border_variant_outline_lookup: Record<RitualStyleFlags["border_variant"], string> = {
  plain: "2px solid var(--woodcut-stroke)",
  thorn: "4px double var(--ink-blood)",
  bone: "3px ridge var(--ink-bone)",
  ivy: "4px groove var(--woodcut-stroke)",
};

type RitualBorderProps = { style_flags: RitualStyleFlags; children: ReactNode };

export default function RitualBorder({ style_flags, children }: RitualBorderProps) {
  return (
    <div className="candle-hover" style={{
      background: "var(--parchment-base)",
      border: border_variant_outline_lookup[style_flags.border_variant],
      filter: condition_variant_filter_lookup[style_flags.condition_variant],
      borderRadius: 6,
      width: 240, minHeight: 336,
    }}>
      {children}
    </div>
  );
}
