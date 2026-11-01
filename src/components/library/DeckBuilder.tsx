// ============================================================
// FILE: src/components/library/DeckBuilder.tsx
// PURPOSE: Drag ritual from catalog onto a family writ.
// ------------------------------------------------------------
// ASCII FLOW:
//   dragstart on ritual -> dataTransfer id
//   drop on family -> update_ritual({family_id})
// ============================================================
import { RitualRecord, update_ritual } from "../../lib/db_rituals";
import { FamilyRecord } from "../../lib/db_families";

type DeckBuilderProps = {
  catalog_ritual_records: RitualRecord[];
  available_family_records: FamilyRecord[];
};

export default function DeckBuilder({ catalog_ritual_records, available_family_records }: DeckBuilderProps) {
  function handle_drag_start_on_ritual(event_object: React.DragEvent, ritual_identifier: string) {
    console.log("[DEBUG][DeckBuilder] dragstart", ritual_identifier);
    event_object.dataTransfer.setData("text/ritual-id", ritual_identifier);
  }

  async function handle_drop_on_family(event_object: React.DragEvent, family_identifier: string) {
    const dragged_ritual_identifier = event_object.dataTransfer.getData("text/ritual-id");
    console.log("[DEBUG][DeckBuilder] drop", dragged_ritual_identifier, "->", family_identifier);
    if (!dragged_ritual_identifier) return;
    await update_ritual(dragged_ritual_identifier, { family_id: family_identifier });
  }

  return (
    <div>
      <h4>Deck Builder</h4>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        <div>
          <strong>Rituals</strong>
          {catalog_ritual_records.map((ritual_row) => (
            <div key={ritual_row.id}
                 draggable
                 onDragStart={(e) => handle_drag_start_on_ritual(e, ritual_row.id)}
                 className="candle-hover"
                 style={{ padding: 4, border: "1px solid #000" }}>
              {ritual_row.name}
            </div>
          ))}
        </div>
        <div>
          <strong>Families</strong>
          {available_family_records.map((family_row) => (
            <div key={family_row.id}
                 onDragOver={(e) => e.preventDefault()}
                 onDrop={(e) => handle_drop_on_family(e, family_row.id)}
                 className="candle-hover"
                 style={{ padding: 4, border: "1px dashed #000", minHeight: 32 }}>
              {family_row.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
