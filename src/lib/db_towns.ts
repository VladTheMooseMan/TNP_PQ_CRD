// ============================================================
// FILE: src/lib/db_towns.ts
// PURPOSE: Town membership + invite flows.
// ------------------------------------------------------------
// ASCII FLOW:
//   list_my_towns -> town_members join
//   create_town / create_invite / list_invites
// ============================================================
import { supabase_client_singleton } from "./supabase";

export type TownRecord = { id: string; name: string; created_by: string; created_at: string };
export type InviteRecord = { code: string; town_id: string; uses_left: number; expires_at: string | null };

export async function list_my_towns() {
  console.log("[DEBUG][db_towns] list_my_towns");
  const { data: rows, error } = await supabase_client_singleton
    .from("towns").select("*, town_members!inner(user_id)");
  if (error) throw error;
  return (rows ?? []) as TownRecord[];
}

export async function create_town(town_name_input: string) {
  console.log("[DEBUG][db_towns] create_town");
  const { data: inserted_row, error } = await supabase_client_singleton
    .from("towns").insert({ name: town_name_input }).select().single();
  if (error) throw error;
  return inserted_row as TownRecord;
}

export async function create_invite(town_identifier: string, max_uses_allowed: number) {
  console.log("[DEBUG][db_towns] create_invite");
  const { data: inserted_row, error } = await supabase_client_singleton
    .from("invites").insert({ town_id: town_identifier, uses_left: max_uses_allowed }).select().single();
  if (error) throw error;
  return inserted_row as InviteRecord;
}

export async function list_invites(town_identifier: string) {
  console.log("[DEBUG][db_towns] list_invites");
  const { data: rows, error } = await supabase_client_singleton
    .from("invites").select("*").eq("town_id", town_identifier);
  if (error) throw error;
  return (rows ?? []) as InviteRecord[];
}
