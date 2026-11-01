// ============================================================
// FILE: src/components/fx/WaxSealSave.tsx
// PURPOSE: Wax-seal save confirmation animation + audio.
// ------------------------------------------------------------
// ASCII FLOW:
//   click Seal button -> play wax_sizzle.mp3 -> animate blob -> fade
// ============================================================
import { useState } from "react";
import { play_one_shot_sound_effect } from "../../lib/audio_ambience";

export default function WaxSealSave() {
  const [is_wax_seal_animating, set_is_wax_seal_animating] = useState<boolean>(false);

  function trigger_wax_seal_save_animation() {
    console.log("[DEBUG][WaxSealSave] trigger");
    play_one_shot_sound_effect("assets/audio/wax_sizzle.mp3");
    set_is_wax_seal_animating(true);
    setTimeout(() => set_is_wax_seal_animating(false), 1200);
  }

  return (
    <div style={{ position: "relative", marginTop: "1rem" }}>
      <button className="candle-hover" onClick={trigger_wax_seal_save_animation}>Seal the Writ</button>
      {is_wax_seal_animating && (
        <div style={{
          position: "absolute", right: 0, top: -20, width: 72, height: 72,
          background: "radial-gradient(circle at 40% 35%, #a51818, #4a0b0b)",
          borderRadius: "50%", boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
          animation: "wax_drip 1.2s ease-out",
        }} />
      )}
      <style>{`
        @keyframes wax_drip {
          0% { transform: translateY(-40px) scale(0.4); opacity: 0; }
          40% { transform: translateY(0) scale(1.1); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
