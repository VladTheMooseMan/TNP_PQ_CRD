// ============================================================
// FILE: src/components/ritual/RitualIcons.tsx
// PURPOSE: Quick-reference glyph row (cast type, time, secrecy).
// ------------------------------------------------------------
// ASCII FLOW:
//   icon_flags -> map to emoji/text glyphs -> row
// ============================================================
import { RitualIconFlags } from "../../lib/db_rituals";

const cast_type_glyph_lookup: Record<RitualIconFlags["cast_type"], string> = {
  touch: "✋", ranged: "🏹", verbal: "🗣", self: "👁",
};
const cast_time_glyph_lookup: Record<RitualIconFlags["cast_time"], string> = {
  instant: "⚡", short: "⏳", long: "⌛",
};
const secrecy_glyph_lookup: Record<RitualIconFlags["secrecy"], string> = {
  open: "📖", restricted: "🔒", forbidden: "🚫",
};

type RitualIconsProps = { icon_flags: RitualIconFlags };

export default function RitualIcons({ icon_flags }: RitualIconsProps) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", fontSize: "1.1rem" }}>
      <span title={`Cast: ${icon_flags.cast_type}`}>{cast_type_glyph_lookup[icon_flags.cast_type]}</span>
      <span title={`Time: ${icon_flags.cast_time}`}>{cast_time_glyph_lookup[icon_flags.cast_time]}</span>
      <span title={`Secrecy: ${icon_flags.secrecy}`}>{secrecy_glyph_lookup[icon_flags.secrecy]}</span>
    </div>
  );
}
