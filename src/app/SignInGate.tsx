// ============================================================
// FILE: src/app/SignInGate.tsx
// PURPOSE: Email magic-link sign-in + town invite redemption.
// ------------------------------------------------------------
// ASCII FLOW:
//   enter email -> send magic link -> click link
//      -> auth session -> enter invite code -> join town
// ============================================================
import { useState } from "react";
import { send_magic_link, redeem_invite_code } from "../lib/auth";

export default function SignInGate() {
  const [email_entered_by_user, set_email_entered_by_user] = useState("");
  const [invite_code_entered_by_user, set_invite_code_entered_by_user] = useState("");
  const [status_message_for_user, set_status_message_for_user] = useState("");

  async function handle_send_magic_link_click() {
    console.log("[DEBUG][SignInGate] send magic link");
    try {
      await send_magic_link(email_entered_by_user);
      set_status_message_for_user("A sealed letter was sent to your inbox.");
    } catch (unexpected_error) {
      set_status_message_for_user(String(unexpected_error));
    }
  }

  async function handle_redeem_invite_click() {
    console.log("[DEBUG][SignInGate] redeem invite");
    try {
      await redeem_invite_code(invite_code_entered_by_user);
      set_status_message_for_user("You are now bound to the town.");
    } catch (unexpected_error) {
      set_status_message_for_user(String(unexpected_error));
    }
  }

  return (
    <div className="parchment-splash">
      <div className="parchment-sheet" style={{ width: 420 }}>
        <h2>Enter the Town</h2>
        <input value={email_entered_by_user} onChange={(e) => set_email_entered_by_user(e.target.value)} placeholder="your@email" />
        <button className="candle-hover" onClick={handle_send_magic_link_click}>Send Sealed Letter</button>
        <hr />
        <input value={invite_code_entered_by_user} onChange={(e) => set_invite_code_entered_by_user(e.target.value)} placeholder="Invite code" />
        <button className="candle-hover" onClick={handle_redeem_invite_click}>Redeem Invite</button>
        <p>{status_message_for_user}</p>
      </div>
    </div>
  );
}
