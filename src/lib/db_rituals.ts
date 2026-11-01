// ============================================================
// FILE: src/lib/db_rituals.ts
// PURPOSE: CRUD for ritual cards, lineage, style.
// ------------------------------------------------------------
// ASCII FLOW:
//   list_rituals_for_family -> select by family_id
//   create_ritual / update_ritual / delete_ritual
//   list_master_catalog -> all rituals in town (for Deck Builder)
// ============================================================
import { supabase_client_singleton } from "./supabase";

export type RitualIconFlags = {
  cast_type: "touch" | "ranged" | "verbal" | "self";
  cast_time: "instant" | "short" | "long";
  secrecy: "open" | "restricted" | "forbidden";
};

export type RitualStyleFlags = {
  border_variant: "plain" | "thorn" | "bone" | "ivy";
  ink_color: string;
  condition_variant: "pristine" | "blood" | "burn" | "water";
};

export type RitualRecord = {
  id: string;
  family_id: string;
  name: string;
  image_url: string | null;
  mechanics: string;
  effects: string;
  learned_date: string | null;
  taught_by: string | null;
  icons: RitualIconFlags;
  style: RitualStyleFlags;
};

export async function list_rituals_for_family(family_identifier: string) {
  console.log("[DEBUG][db_rituals] list_rituals_for_family");
  const { data: rows, error } = await supabase_client_singleton
    .from("rituals").select("*").eq("family_id", family_identifier);
  if (error) throw error;
  return (rows ?? []) as RitualRecord[];
}

export async function list_master_catalog_for_town(town_identifier: string) {
  console.log("[DEBUG][db_rituals] list_master_catalog_for_town");
  const { data: rows, error } = await supabase_client_singleton
    .from("rituals").select("*, families!inner(town_id)")
    .eq("families.town_id", town_identifier);
  if (error) throw error;
  return (rows ?? []) as RitualRecord[];
}

export async function create_ritual(new_ritual_input: Partial<RitualRecord>) {
  console.log("[DEBUG][db_rituals] create_ritual");
  const { data: inserted_row, error } = await supabase_client_singleton
    .from("rituals").insert(new_ritual_input).select().single();
  if (error) throw error;
  return inserted_row as RitualRecord;
}

export async function update_ritual(ritual_identifier: string, patch_input: Partial<RitualRecord>) {
  console.log("[DEBUG][db_rituals] update_ritual");
  const { error } = await supabase_client_singleton
    .from("rituals").update(patch_input).eq("id", ritual_identifier);
  if (error) throw error;
}

export async function delete_ritual(ritual_identifier: string) {
  console.log("[DEBUG][db_rituals] delete_ritual");
  const { error } = await supabase_client_singleton
    .from("rituals").delete().eq("id", ritual_identifier);
  if (error) throw error;
}
