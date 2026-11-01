// ============================================================
// FILE: src/components/writ/WritView.tsx
// PURPOSE: Charter-styled family profile sheet.
// ------------------------------------------------------------
// ASCII FLOW:
//   route /writ/:family_id
//      -> load family + members
//      -> render seal, name, background, stability, larder
// ============================================================
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FamilyRecord, MemberRecord, list_members_of_family } from "../../lib/db_families";
import { supabase_client_singleton } from "../../lib/supabase";
import FamilyStability from "./FamilyStability";
import LarderTracker from "./LarderTracker";
import WaxSealSave from "../fx/WaxSealSave";

export default function WritView() {
  const { family_id } = useParams<{ family_id: string }>();
  const [loaded_family_record, set_loaded_family_record] = useState<FamilyRecord | null>(null);
  const [loaded_member_records, set_loaded_member_records] = useState<MemberRecord[]>([]);

  useEffect(() => {
    console.log("[DEBUG][WritView] load", family_id);
    if (!family_id) return;
    (async () => {
      const { data: family_row } = await supabase_client_singleton
        .from("families").select("*").eq("id", family_id).single();
      set_loaded_family_record(family_row as FamilyRecord);
      set_loaded_member_records(await list_members_of_family(family_id));
    })();
  }, [family_id]);

  if (!loaded_family_record) return <div className="parchment-splash">Unfurling the writ...</div>;

  return (
    <div className="parchment-sheet" style={{ maxWidth: 820, margin: "2rem auto" }}>
      <header style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {loaded_family_record.seal_url && <img src={loaded_family_record.seal_url} alt="seal" width={64} height={64} />}
        <div>
          <h1>{loaded_family_record.name}</h1>
          <p>{loaded_family_record.background}</p>
        </div>
        {loaded_family_record.holy_symbol_url && <img src={loaded_family_record.holy_symbol_url} alt="holy symbol" width={48} height={48} />}
      </header>
      <section>
        <h3>Family Stability</h3>
        <FamilyStability member_records_in_family={loaded_member_records} />
      </section>
      <section>
        <h3>Larder</h3>
        <LarderTracker current_larder_count={loaded_family_record.larder} family_identifier={loaded_family_record.id} />
      </section>
      <WaxSealSave />
    </div>
  );
}
