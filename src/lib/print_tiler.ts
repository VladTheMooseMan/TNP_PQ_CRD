// ============================================================
// FILE: src/lib/print_tiler.ts
// PURPOSE: Tile Writs/Ritual cards onto 8.5x11 with bleed+cuts.
// ------------------------------------------------------------
// ASCII FLOW:
//   collect card nodes -> build print layout window
//      -> inject @page css + cut-line svg -> window.print()
// ============================================================
export type PrintTilingOptions = {
  page_width_inches: number;
  page_height_inches: number;
  bleed_inches: number;
  card_width_inches: number;
  card_height_inches: number;
};

export const default_print_tiling_options: PrintTilingOptions = {
  page_width_inches: 8.5,
  page_height_inches: 11,
  bleed_inches: 0.125,
  card_width_inches: 2.5,
  card_height_inches: 3.5,
};

export function open_print_window_with_tiled_cards(
  rendered_card_html_strings: string[],
  tiling_options: PrintTilingOptions = default_print_tiling_options
) {
  console.log("[DEBUG][print_tiler] open_print_window_with_tiled_cards count=", rendered_card_html_strings.length);
  const print_window_handle = window.open("", "_blank", "width=900,height=1100");
  if (!print_window_handle) throw new Error("Pop-up blocked. Allow pop-ups to print.");

  const print_sheet_stylesheet = `
    @page { size: ${tiling_options.page_width_inches}in ${tiling_options.page_height_inches}in; margin: 0.25in; }
    body { margin: 0; font-family: Georgia, serif; }
    .sheet { display: grid; grid-template-columns: repeat(3, ${tiling_options.card_width_inches}in);
             grid-auto-rows: ${tiling_options.card_height_inches}in; gap: 0.1in; }
    .card { position: relative; overflow: hidden;
            width: ${tiling_options.card_width_inches}in; height: ${tiling_options.card_height_inches}in;
            outline: 1px dashed #000; }
    .card::before, .card::after {
      content: ""; position: absolute; background: #000;
    }
  `;

  const assembled_html = `<!doctype html><html><head><style>${print_sheet_stylesheet}</style></head>
    <body><div class="sheet">
    ${rendered_card_html_strings.map((card_html) => `<div class="card">${card_html}</div>`).join("")}
    </div><script>window.onload=()=>window.print();</script></body></html>`;

  print_window_handle.document.open();
  print_window_handle.document.write(assembled_html);
  print_window_handle.document.close();
}
