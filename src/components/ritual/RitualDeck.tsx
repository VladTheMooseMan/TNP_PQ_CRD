// ============================================================
// FILE: src/components/ritual/RitualDeck.tsx
// PURPOSE: Grid of all ritual cards belonging to a family.
// ------------------------------------------------------------
// ASCII FLOW:
//   route /rituals/:family_id -> list_rituals_for_family
//      -> map to <RitualCard/> grid
// ============================================================
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { list_rituals_for_family, RitualRecord } from "../../lib/db_rituals";
import RitualCard from "./RitualCard";

export default function RitualDeck() {
  const { family_id } = useParams<{ family_id: string }>();
  const [ritual_records_in_deck, set_ritual_records_in_deck] = useState<RitualRecord[]>([]);

  useEffect(() => {
    console.log("[DEBUG][RitualDeck] load", family_id);
    if (!family_id) return;
    list_rituals_for_family(family_id).then(set_ritual_records_in_deck);
  }, [family_id]);

  return (
    <div style={{ maxWidth: 1100, margin: "2rem auto", display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "1rem" }}>
      {ritual_records_in_deck.map((ritual_row) => (
        <RitualCard key={ritual_row.id} ritual_record={ritual_row} />
      ))}
    </div>
  );
}
