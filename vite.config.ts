// ============================================================
// FILE: vite.config.ts
// PURPOSE: Vite build config for GitHub Pages deployment.
// ------------------------------------------------------------
// ASCII FLOW:
//   vite dev/build
//       |
//       v
//   react plugin -> output /dist (base path = repo name)
// ============================================================
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Repo: https://github.com/VladTheMooseMan/TNP_PQ_CRD
const github_pages_repo_base_path = "/TNP_PQ_CRD/";

export default defineConfig({
  base: github_pages_repo_base_path,
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
