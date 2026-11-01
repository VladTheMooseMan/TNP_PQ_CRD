// ============================================================
// FILE: src/components/library/Candle.tsx
// PURPOSE: Brightness/contrast slider styled as a candle.
// ------------------------------------------------------------
// ASCII FLOW:
//   slider change -> fire on_brightness_changed(value 0..100)
// ============================================================
import { useState } from "react";

type CandleProps = { on_brightness_changed: (brightness_percent: number) => void };

export default function Candle({ on_brightness_changed }: CandleProps) {
  const [brightness_percent_local_state, set_brightness_percent_local_state] = useState<number>(100);

  function handle_slider_input(e: React.ChangeEvent<HTMLInputElement>) {
    const next_value = Number(e.target.value);
    console.log("[DEBUG][Candle] slider", next_value);
    set_brightness_percent_local_state(next_value);
    on_brightness_changed(next_value);
  }

  return (
    <div>
      <h4>Candle</h4>
      <input type="range" min={30} max={160} value={brightness_percent_local_state} onChange={handle_slider_input} />
      <small>{brightness_percent_local_state}%</small>
    </div>
  );
}
