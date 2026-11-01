// ============================================================
// FILE: src/lib/db_families.ts
// PURPOSE: CRUD for families, members, larder.
// ------------------------------------------------------------
// ASCII FLOW:
//   list_families_in_town -> select by town_id
//   create_family / update_family / delete_family
//   list_members_of_family / upsert_member / mark_member_vacant
// ============================================================
import { supabase_client_singleton } from "./supabase";

export type FamilyRecord = {
  id: string;
  town_id: string;
  user_id: string;
  name: string;
  background: string | null;
  seal_url: string | null;
  holy_symbol_url: string | null;
  larder: number;
};

export type MemberRecord = {
  id: string;
  family_id: string;
  name: string;
  status: "alive" | "vacant";
  portrait_url: string | null;
  background: string | null;
};

export async function list_families_in_town(town_identifier: string) {
  console.log("[DEBUG][db_families] list_families_in_town");
  const { data: rows, error } = await supabase_client_singleton
    .from("families").select("*").eq("town_id", town_identifier);
  if (error) throw error;
  return (rows ?? []) as FamilyRecord[];
}

export async function create_family(new_family_input: Partial<FamilyRecord>) {
  console.log("[DEBUG][db_families] create_family");
  const { data: inserted_row, error } = await supabase_client_singleton
    .from("families").insert(new_family_input).select().single();
  if (error) throw error;
  return inserted_row as FamilyRecord;
}

export async function update_family(family_identifier: string, patch_input: Partial<FamilyRecord>) {
  console.log("[DEBUG][db_families] update_family");
  const { error } = await supabase_client_singleton
    .from("families").update(patch_input).eq("id", family_identifier);
  if (error) throw error;
}

export async function list_members_of_family(family_identifier: string) {
  console.log("[DEBUG][db_families] list_members_of_family");
  const { data: rows, error } = await supabase_client_singleton
    .from("members").select("*").eq("family_id", family_identifier);
  if (error) throw error;
  return (rows ?? []) as MemberRecord[];
}

export async function upsert_member(member_input: Partial<MemberRecord>) {
  console.log("[DEBUG][db_families] upsert_member");
  const { error } = await supabase_client_singleton.from("members").upsert(member_input);
  if (error) throw error;
}

export async function mark_member_vacant(member_identifier: string) {
  console.log("[DEBUG][db_families] mark_member_vacant");
  const { error } = await supabase_client_singleton
    .from("members").update({ status: "vacant" }).eq("id", member_identifier);
  if (error) throw error;
}
