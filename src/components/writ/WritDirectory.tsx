// ============================================================
// FILE: src/components/writ/WritDirectory.tsx
// PURPOSE: Master index of families in the active town.
// ------------------------------------------------------------
// ASCII FLOW:
//   mount -> list_my_towns -> pick first -> list families
//      -> render clickable charter rows
// ============================================================
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { list_my_towns, TownRecord } from "../../lib/db_towns";
import { list_families_in_town, FamilyRecord } from "../../lib/db_families";

export default function WritDirectory() {
  const [town_records_available_to_user, set_town_records_available_to_user] = useState<TownRecord[]>([]);
  const [active_town_identifier, set_active_town_identifier] = useState<string | null>(null);
  const [family_records_in_active_town, set_family_records_in_active_town] = useState<FamilyRecord[]>([]);

  useEffect(() => {
    console.log("[DEBUG][WritDirectory] load towns");
    list_my_towns().then((towns) => {
      set_town_records_available_to_user(towns);
      if (towns[0]) set_active_town_identifier(towns[0].id);
    });
  }, []);

  useEffect(() => {
    if (!active_town_identifier) return;
    console.log("[DEBUG][WritDirectory] load families for town", active_town_identifier);
    list_families_in_town(active_town_identifier).then(set_family_records_in_active_town);
  }, [active_town_identifier]);

  return (
    <div className="parchment-sheet" style={{ maxWidth: 820, margin: "2rem auto" }}>
      <h1>Writ Directory</h1>
      <select value={active_town_identifier ?? ""} onChange={(e) => set_active_town_identifier(e.target.value)}>
        {town_records_available_to_user.map((town_row) => (
          <option key={town_row.id} value={town_row.id}>{town_row.name}</option>
        ))}
      </select>
      <ul>
        {family_records_in_active_town.map((family_row) => (
          <li key={family_row.id} className="candle-hover">
            <Link to={`/writ/${family_row.id}`}>{family_row.name}</Link>
            {" · "}
            <Link to={`/rituals/${family_row.id}`}>rituals</Link>
          </li>
        ))}
      </ul>
      <Link to="/library" className="candle-hover">Enter the Library</Link>
    </div>
  );
}
