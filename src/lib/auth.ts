// ============================================================
// FILE: src/lib/auth.ts
// PURPOSE: Auth helpers: magic link, session, invite redemption.
// ------------------------------------------------------------
// ASCII FLOW:
//   send_magic_link -> supabase otp email
//   get_current_session -> cached session
//   subscribe_to_auth_state -> listener
//   redeem_invite_code -> rpc join_town_by_invite
// ============================================================
import { supabase_client_singleton } from "./supabase";

export async function send_magic_link(email_address: string) {
  console.log("[DEBUG][auth] send_magic_link");
  const { error: unexpected_error } = await supabase_client_singleton.auth.signInWithOtp({ email: email_address });
  if (unexpected_error) throw unexpected_error;
}

// ------------------------------------------------------------
// Dev-only password sign-in. Guarded by VITE_DEV_LOGIN_ENABLED
// so the button never ships to prod unless you explicitly set
// that flag at build time. The user still has to exist in
// Supabase Auth with a real password.
// ------------------------------------------------------------
export async function dev_sign_in_with_password(email_address: string, password_string: string) {
  console.log("[DEBUG][auth] dev_sign_in_with_password");
  const { error: unexpected_error } = await supabase_client_singleton.auth.signInWithPassword({
    email: email_address,
    password: password_string,
  });
  if (unexpected_error) throw unexpected_error;
}

export async function sign_out_current_session() {
  console.log("[DEBUG][auth] sign_out_current_session");
  const { error: unexpected_error } = await supabase_client_singleton.auth.signOut();
  if (unexpected_error) throw unexpected_error;
}

export async function get_current_session() {
  console.log("[DEBUG][auth] get_current_session");
  const { data: session_wrapper } = await supabase_client_singleton.auth.getSession();
  return session_wrapper.session;
}

export function subscribe_to_auth_state(listener_fn: (session: unknown) => void) {
  console.log("[DEBUG][auth] subscribe_to_auth_state");
  const { data: subscription_wrapper } = supabase_client_singleton.auth.onAuthStateChange((_e, next_session) => {
    listener_fn(next_session);
  });
  return () => subscription_wrapper.subscription.unsubscribe();
}

export async function redeem_invite_code(invite_code_string: string) {
  console.log("[DEBUG][auth] redeem_invite_code");
  const { error: unexpected_error } = await supabase_client_singleton.rpc("join_town_by_invite", {
    invite_code_input: invite_code_string,
  });
  if (unexpected_error) throw unexpected_error;
}
