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

/* Woodcut-style corner fleuron. One SVG, flipped by CSS. */
function CornerOrnament({ corner_position_class_name }: { corner_position_class_name: string }) {
  return (
    <svg
      className={`corner-ornament ${corner_position_class_name}`}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M2 2 L2 14 M2 2 L14 2" />
      <path d="M6 6 Q10 6 10 10 Q10 14 14 14 M14 14 Q14 10 10 10" />
      <circle cx="14" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}

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
      <div className="parchment-sheet" style={{ width: 480, maxWidth: "92vw" }}>
        <CornerOrnament corner_position_class_name="tl" />
        <CornerOrnament corner_position_class_name="tr" />
        <CornerOrnament corner_position_class_name="bl" />
        <CornerOrnament corner_position_class_name="br" />

        <h1 className="charter-title">Enter the Town</h1>
        <p className="charter-subtitle">A Writ of Passage</p>
        <hr className="charter-rule" />

        <label className="charter-field-label" htmlFor="email_input">Letter of Introduction</label>
        <div className="form-row">
          <input
            id="email_input"
            className="charter-input"
            value={email_entered_by_user}
            onChange={(e) => set_email_entered_by_user(e.target.value)}
            placeholder="your name at some house"
            type="email"
            autoComplete="email"
          />
          <button className="iron-button primary" onClick={handle_send_magic_link_click}>
            Send Sealed Letter
          </button>
        </div>

        <hr className="charter-rule" />

        <label className="charter-field-label" htmlFor="invite_input">Token of Welcome</label>
        <div className="form-row">
          <input
            id="invite_input"
            className="charter-input"
            value={invite_code_entered_by_user}
            onChange={(e) => set_invite_code_entered_by_user(e.target.value)}
            placeholder="invite code from a founder"
          />
          <button className="iron-button" onClick={handle_redeem_invite_click}>
            Redeem Invite
          </button>
        </div>

        <p className="status-line">{status_message_for_user}</p>
      </div>
    </div>
  );
}
