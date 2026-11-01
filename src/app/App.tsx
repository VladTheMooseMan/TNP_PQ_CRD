// ============================================================
// FILE: src/app/App.tsx
// PURPOSE: Shell: routes, auth gate, ambience audio loop.
// ------------------------------------------------------------
// ASCII FLOW:
//   App mount
//      |
//      v
//   check session (supabase) ---no---> <SignInGate/>
//      |yes
//      v
//   <AmbiencePlayer/> + <AppRoutes/>
// ============================================================
import { useEffect, useState } from "react";
import { subscribe_to_auth_state, get_current_session } from "../lib/auth";
import { start_ambience_loop } from "../lib/audio_ambience";
import AppRoutes from "./routes";
import SignInGate from "./SignInGate";

export default function App() {
  const [current_user_is_signed_in, set_current_user_is_signed_in] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("[DEBUG][App] mount: checking session");
    get_current_session().then((existing_session) => {
      set_current_user_is_signed_in(Boolean(existing_session));
    });
    const unsubscribe_from_auth_changes = subscribe_to_auth_state((next_session) => {
      console.log("[DEBUG][App] auth state changed");
      set_current_user_is_signed_in(Boolean(next_session));
    });
    const stop_ambient_soundscape = start_ambience_loop();
    return () => {
      unsubscribe_from_auth_changes();
      stop_ambient_soundscape();
    };
  }, []);

  if (current_user_is_signed_in === null) return <div className="parchment-splash">Lighting the candles...</div>;
  if (!current_user_is_signed_in) return <SignInGate />;
  return <AppRoutes />;
}
