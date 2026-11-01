// ============================================================
// FILE: src/components/writ/LarderTracker.tsx
// PURPOSE: Thematic food/survival resource counter.
// ------------------------------------------------------------
// ASCII FLOW:
//   display current count -> +/- buttons -> update_family({larder})
// ============================================================
import { useState } from "react";
import { update_family } from "../../lib/db_families";

type LarderTrackerProps = { current_larder_count: number; family_identifier: string };

export default function LarderTracker({ current_larder_count, family_identifier }: LarderTrackerProps) {
  const [larder_count_local_state, set_larder_count_local_state] = useState<number>(current_larder_count);

  async function change_larder_by_delta(delta_amount: number) {
    console.log("[DEBUG][LarderTracker] change_larder_by_delta", delta_amount);
    const next_larder_count = Math.max(0, larder_count_local_state + delta_amount);
    set_larder_count_local_state(next_larder_count);
    await update_family(family_identifier, { larder: next_larder_count });
  }

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <button className="candle-hover" onClick={() => change_larder_by_delta(-1)}>−</button>
      <span style={{ fontFamily: "var(--font-ritual)", fontSize: "1.3rem" }}>
        {larder_count_local_state} rations
      </span>
      <button className="candle-hover" onClick={() => change_larder_by_delta(+1)}>+</button>
    </div>
  );
}
