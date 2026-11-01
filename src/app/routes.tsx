// ============================================================
// FILE: src/app/routes.tsx
// PURPOSE: Route map for Writ, Rituals, Library, Directory.
// ------------------------------------------------------------
// ASCII FLOW:
//   / -> Dashboard
//   /writ/:family_id -> WritView
//   /rituals/:family_id -> RitualDeck
//   /library -> ScribeDesk
//   /directory -> WritDirectory
// ============================================================
import { Routes, Route, Navigate } from "react-router-dom";
import WritView from "../components/writ/WritView";
import WritDirectory from "../components/writ/WritDirectory";
import RitualDeck from "../components/ritual/RitualDeck";
import ScribeDesk from "../components/library/ScribeDesk";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/directory" replace />} />
      <Route path="/directory" element={<WritDirectory />} />
      <Route path="/writ/:family_id" element={<WritView />} />
      <Route path="/rituals/:family_id" element={<RitualDeck />} />
      <Route path="/library" element={<ScribeDesk />} />
    </Routes>
  );
}
