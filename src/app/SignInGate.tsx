// ============================================================
// FILE: src/app/SignInGate.tsx
// PURPOSE: Email magic-link sign-in + town invite redemption.
// ------------------------------------------------------------
// ASCII FLOW:
//   enter email -> send magic link -> click link
//      -> auth session -> enter invite code -> join town
// ============================================================
import { useState } from "react";
import { send_magic_link, redeem_invite_code, dev_sign_in_with_password } from "../lib/auth";

const dev_login_is_enabled = import.meta.env.VITE_DEV_LOGIN_ENABLED === "true";

/* Convert any thrown value into a readable sentence for the status line. */
function describe_error(thrown_value_from_catch: unknown): string {
  if (thrown_value_from_catch instanceof Error) return thrown_value_from_catch.message;
  if (typeof thrown_value_from_catch === "string") return thrown_value_from_catch;
  if (thrown_value_from_catch && typeof thrown_value_from_catch === "object") {
    const possibly_message = (thrown_value_from_catch as { message?: string; error_description?: string }).message
      ?? (thrown_value_from_catch as { error_description?: string }).error_description;
    if (possibly_message) return possibly_message;
    try { return JSON.stringify(thrown_value_from_catch); } catch { /* fallthrough */ }
  }
  return "Unknown error.";
}

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
  const [dev_email_entered_by_user, set_dev_email_entered_by_user] = useState("");
  const [dev_password_entered_by_user, set_dev_password_entered_by_user] = useState("");

  async function handle_send_magic_link_click() {
    console.log("[DEBUG][SignInGate] send magic link");
    try {
      await send_magic_link(email_entered_by_user);
      set_status_message_for_user("A sealed letter was sent to your inbox.");
    } catch (unexpected_error) {
      set_status_message_for_user(describe_error(unexpected_error));
    }
  }

  async function handle_redeem_invite_click() {
    console.log("[DEBUG][SignInGate] redeem invite");
    try {
      await redeem_invite_code(invite_code_entered_by_user);
      set_status_message_for_user("You are now bound to the town.");
    } catch (unexpected_error) {
      set_status_message_for_user(describe_error(unexpected_error));
    }
  }

  async function handle_dev_password_sign_in_click() {
    console.log("[DEBUG][SignInGate] dev password sign-in");
    try {
      await dev_sign_in_with_password(dev_email_entered_by_user, dev_password_entered_by_user);
      set_status_message_for_user("Dev session active.");
    } catch (unexpected_error) {
      set_status_message_for_user(describe_error(unexpected_error));
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

        {dev_login_is_enabled && (
          <>
            <hr className="charter-rule" />
            <p className="charter-subtitle" style={{ color: "var(--ink-blood)", margin: 0 }}>
              Scribe's Backdoor
            </p>
            <label className="charter-field-label" htmlFor="dev_email_input" style={{ marginTop: "0.75rem" }}>
              Dev Account
            </label>
            <input
              id="dev_email_input"
              className="charter-input"
              value={dev_email_entered_by_user}
              onChange={(e) => set_dev_email_entered_by_user(e.target.value)}
              placeholder="dev@local"
              type="email"
              autoComplete="email"
              style={{ marginBottom: "0.75rem" }}
            />
            <label className="charter-field-label" htmlFor="dev_password_input">
              Passphrase
            </label>
            <div className="form-row">
              <input
                id="dev_password_input"
                className="charter-input"
                value={dev_password_entered_by_user}
                onChange={(e) => set_dev_password_entered_by_user(e.target.value)}
                placeholder="dev password"
                type="password"
                autoComplete="current-password"
              />
              <button className="iron-button" onClick={handle_dev_password_sign_in_click}>
                Dev Sign In
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
