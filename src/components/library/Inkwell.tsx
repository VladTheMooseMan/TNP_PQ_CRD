// ============================================================
// FILE: src/components/library/Inkwell.tsx
// PURPOSE: Ink color picker disguised as an inkwell.
// ------------------------------------------------------------
// ASCII FLOW:
//   click swatch -> fire on_ink_color_selected
// ============================================================
const available_ink_color_swatches: string[] = ["#1a140d", "#6a0e0e", "#2a3f1f", "#1e2a4a", "#5a3a0e"];

type InkwellProps = { on_ink_color_selected: (hex: string) => void };

export default function Inkwell({ on_ink_color_selected }: InkwellProps) {
  return (
    <div>
      <h4>Inkwell</h4>
      <div style={{ display: "flex", gap: "0.3rem" }}>
        {available_ink_color_swatches.map((swatch_hex) => (
          <button key={swatch_hex} className="candle-hover"
            aria-label={`ink ${swatch_hex}`}
            onClick={() => { console.log("[DEBUG][Inkwell] pick", swatch_hex); on_ink_color_selected(swatch_hex); }}
            style={{ width: 24, height: 24, background: swatch_hex, border: "1px solid #000" }} />
        ))}
      </div>
    </div>
  );
}
