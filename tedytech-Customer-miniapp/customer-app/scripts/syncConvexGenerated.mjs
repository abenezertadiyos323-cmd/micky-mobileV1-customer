import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, "../../../convex/_generated");
const destinationDir = path.resolve(__dirname, "../src/convex_generated");

async function syncConvexGenerated() {
  try {
    const sourceStat = await stat(sourceDir);
    if (!sourceStat.isDirectory()) {
      throw new Error(`Source is not a directory: ${sourceDir}`);
    }
  } catch (error) {
    throw new Error(`Convex generated source is missing at ${sourceDir}`, { cause: error });
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
