// ============================================================
// FILE: src/components/ritual/RitualCard.tsx
// PURPOSE: Unified tarot-sized ritual card renderer.
// ------------------------------------------------------------
// ASCII FLOW:
//   props.ritual_record -> apply style flags -> render:
//     image -> name -> icons -> mechanics -> effects -> lineage
// ============================================================
import { RitualRecord } from "../../lib/db_rituals";
import RitualIcons from "./RitualIcons";
import RitualBorder from "./RitualBorder";

type RitualCardProps = { ritual_record: RitualRecord };

export default function RitualCard({ ritual_record }: RitualCardProps) {
  console.log("[DEBUG][RitualCard] render", ritual_record.id);
  return (
    <RitualBorder style_flags={ritual_record.style}>
      <div style={{ color: ritual_record.style.ink_color, padding: "0.5rem" }}>
        {ritual_record.image_url && <img src={ritual_record.image_url} alt="" style={{ width: "100%", height: 120, objectFit: "cover" }} />}
        <h3 style={{ fontFamily: "var(--font-ritual)", margin: "0.3rem 0" }}>{ritual_record.name}</h3>
        <RitualIcons icon_flags={ritual_record.icons} />
        <p><strong>Instructions:</strong> {ritual_record.mechanics}</p>
        <p><strong>Results:</strong> {ritual_record.effects}</p>
        <small>Learned: {ritual_record.learned_date ?? "—"} · Taught by: {ritual_record.taught_by ?? "—"}</small>
      </div>
    </RitualBorder>
  );
}
