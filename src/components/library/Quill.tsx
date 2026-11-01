// ============================================================
// FILE: src/components/library/Quill.tsx
// PURPOSE: Font picker as quill selector.
// ------------------------------------------------------------
// ASCII FLOW:
//   choose font -> fire on_font_selected
// ============================================================
const available_font_family_options: string[] = [
  "'IM Fell English', Georgia, serif",
  "'UnifrakturCook', serif",
  "'Luminari', fantasy",
  "'Cormorant Garamond', serif",
];

type QuillProps = { on_font_selected: (css_font_family: string) => void };

export default function Quill({ on_font_selected }: QuillProps) {
  return (
    <div>
      <h4>Quill</h4>
      <select onChange={(e) => { console.log("[DEBUG][Quill] pick", e.target.value); on_font_selected(e.target.value); }}>
        {available_font_family_options.map((font_family_value) => (
          <option key={font_family_value} value={font_family_value}>{font_family_value}</option>
        ))}
      </select>
    </div>
  );
}
