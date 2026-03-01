import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Primary: Admin (MASTER) Convex project — same deployment used by Admin-Ted.
// Relative path: scripts/ → customer-app/ → tedytech-Customer-miniapp/ →
//   TedTech/ → Ab/ → D:\ → Abenier/TedyTech Admin/Admin-Ted/convex/_generated
const adminTedSourceDir = path.resolve(
  __dirname,
  "../../../../../Abenier/TedyTech Admin/Admin-Ted/convex/_generated"
);
// Legacy fallback: old standalone Convex project (no longer primary).
const legacySourceDir = path.resolve(__dirname, "../../../convex/_generated");

// Use Admin-Ted source when available; fall through to legacy then committed.
const sourceDir = adminTedSourceDir;
const destinationDir = path.resolve(__dirname, "../src/convex_generated");

async function syncConvexGenerated() {
  // Check whether the source (monorepo root) exists — it won't on Vercel
  // because only the customer-app sub-directory is uploaded.
  let sourceExists = false;
  try {
    const sourceStat = await stat(sourceDir);
    sourceExists = sourceStat.isDirectory();
  } catch {
    // source not present — expected in CI / Vercel environment
  }

  if (!sourceExists) {
    // If the destination is already present (committed to git), use it as-is.
    try {
      const destStat = await stat(destinationDir);
      if (destStat.isDirectory()) {
        console.log(`Convex source not found; using committed convex_generated at ${destinationDir}`);
        return;
      }
    } catch {
      // destination also missing
    }
    throw new Error(`Convex generated source is missing at ${sourceDir} and no committed fallback found at ${destinationDir}`);
  }

  await rm(destinationDir, { recursive: true, force: true });
  await mkdir(destinationDir, { recursive: true });
  await cp(sourceDir, destinationDir, { recursive: true });

  console.log(`Synced Convex generated files to ${destinationDir}`);
}

syncConvexGenerated().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
