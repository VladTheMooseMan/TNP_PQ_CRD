// ============================================================
// FILE: src/components/library/StampForPrint.tsx
// PURPOSE: Tile selected ritual cards onto 8.5x11 print sheet.
// ------------------------------------------------------------
// ASCII FLOW:
//   build HTML string per ritual -> open_print_window_with_tiled_cards
// ============================================================
import { RitualRecord } from "../../lib/db_rituals";
import { open_print_window_with_tiled_cards } from "../../lib/print_tiler";

type StampForPrintProps = { catalog_ritual_records: RitualRecord[] };

function serialize_ritual_record_to_card_html(ritual_record_to_render: RitualRecord): string {
  return `
    <div style="padding:0.1in;color:${ritual_record_to_render.style.ink_color};font-family:Georgia,serif">
      ${ritual_record_to_render.image_url ? `<img src="${ritual_record_to_render.image_url}" style="width:100%;height:1.2in;object-fit:cover" />` : ""}
      <h4 style="margin:4px 0">${ritual_record_to_render.name}</h4>
      <p style="font-size:9pt"><b>Instructions:</b> ${ritual_record_to_render.mechanics}</p>
      <p style="font-size:9pt"><b>Results:</b> ${ritual_record_to_render.effects}</p>
      <small>Taught by: ${ritual_record_to_render.taught_by ?? "—"}</small>
    </div>`;
}

export default function StampForPrint({ catalog_ritual_records }: StampForPrintProps) {
  function handle_stamp_for_print_click() {
    console.log("[DEBUG][StampForPrint] stamp", catalog_ritual_records.length);
    const assembled_card_html_strings = catalog_ritual_records.map(serialize_ritual_record_to_card_html);
    open_print_window_with_tiled_cards(assembled_card_html_strings);
  }
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <button className="candle-hover" onClick={handle_stamp_for_print_click}>
        Stamp for Print
      </button>
    </div>
  );
}
