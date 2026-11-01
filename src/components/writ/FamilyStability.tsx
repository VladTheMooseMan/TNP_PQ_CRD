// ============================================================
// FILE: src/components/writ/FamilyStability.tsx
// PURPOSE: Vacancy-slot visual of family survivors.
// ------------------------------------------------------------
// ASCII FLOW:
//   props.members -> map -> alive niche OR vacant cross
// ============================================================
import { MemberRecord } from "../../lib/db_families";

type FamilyStabilityProps = { member_records_in_family: MemberRecord[] };

export default function FamilyStability({ member_records_in_family }: FamilyStabilityProps) {
  console.log("[DEBUG][FamilyStability] render", member_records_in_family.length);
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {member_records_in_family.map((individual_member_record) => (
        <div key={individual_member_record.id}
             className="candle-hover"
             style={{
               width: 56, height: 72,
               border: "1px solid var(--woodcut-stroke)",
               background: individual_member_record.status === "alive" ? "var(--parchment-base)" : "var(--ink-black)",
               color: individual_member_record.status === "alive" ? "var(--ink-black)" : "var(--ink-bone)",
               display: "grid", placeItems: "center", textAlign: "center",
               fontSize: "0.7rem",
             }}>
          {individual_member_record.status === "alive" ? individual_member_record.name : "†"}
        </div>
      ))}
    </div>
  );
}
