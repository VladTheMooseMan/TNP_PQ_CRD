// ============================================================
// FILE: src/components/library/ScribeDesk.tsx
// PURPOSE: WYSIWYG editor shell + deck builder + print export.
// ------------------------------------------------------------
// ASCII FLOW:
//   mount -> load master catalog + families
//      -> left: Inkwell, Quill, Candle controls
//      -> center: live ritual card preview
//      -> right: DeckBuilder (drag ritual -> family)
//      -> bottom: StampForPrint
// ============================================================
import { useEffect, useState } from "react";
import { RitualRecord } from "../../lib/db_rituals";
import { FamilyRecord } from "../../lib/db_families";
import { list_my_towns } from "../../lib/db_towns";
import { list_master_catalog_for_town } from "../../lib/db_rituals";
import { list_families_in_town } from "../../lib/db_families";
import Inkwell from "./Inkwell";
import Quill from "./Quill";
import Candle from "./Candle";
import DeckBuilder from "./DeckBuilder";
import StampForPrint from "./StampForPrint";
import RitualCard from "../ritual/RitualCard";

export default function ScribeDesk() {
  const [master_ritual_catalog, set_master_ritual_catalog] = useState<RitualRecord[]>([]);
  const [family_records_in_town, set_family_records_in_town] = useState<FamilyRecord[]>([]);
  const [preview_ritual_record, set_preview_ritual_record] = useState<RitualRecord | null>(null);

  useEffect(() => {
    console.log("[DEBUG][ScribeDesk] bootstrap");
    (async () => {
      const towns_user_belongs_to = await list_my_towns();
      const first_town_identifier = towns_user_belongs_to[0]?.id;
      if (!first_town_identifier) return;
      set_master_ritual_catalog(await list_master_catalog_for_town(first_town_identifier));
      set_family_records_in_town(await list_families_in_town(first_town_identifier));
    })();
  }, []);

  function apply_ink_color_to_preview(selected_color_hex: string) {
    if (!preview_ritual_record) return;
    set_preview_ritual_record({ ...preview_ritual_record, style: { ...preview_ritual_record.style, ink_color: selected_color_hex } });
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 320px", gap: "1rem", padding: "1rem" }}>
      <aside className="parchment-sheet">
        <h3>Scribe's Desk</h3>
        <Inkwell on_ink_color_selected={apply_ink_color_to_preview} />
        <Quill on_font_selected={() => void 0} />
        <Candle on_brightness_changed={() => void 0} />
      </aside>
      <section className="parchment-sheet">
        <h3>Preview</h3>
        {preview_ritual_record ? <RitualCard ritual_record={preview_ritual_record} /> : <p>Pick a ritual from the catalog.</p>}
        <h4>Catalog</h4>
        <ul>
          {master_ritual_catalog.map((ritual_row) => (
            <li key={ritual_row.id} className="candle-hover"
                onClick={() => set_preview_ritual_record(ritual_row)}>{ritual_row.name}</li>
          ))}
        </ul>
      </section>
      <aside className="parchment-sheet">
        <DeckBuilder
          catalog_ritual_records={master_ritual_catalog}
          available_family_records={family_records_in_town}
        />
        <StampForPrint catalog_ritual_records={master_ritual_catalog} />
      </aside>
    </div>
  );
}
