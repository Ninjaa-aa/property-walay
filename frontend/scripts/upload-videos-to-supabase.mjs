/**
 * Uploads all MP4 files from frontend/data/vid/vid into Supabase Storage bucket `videos`
 * at paths `vid/<filename>`.
 *
 * Prerequisites:
 * 1. Run migration 007_create_videos_bucket.sql (supabase db push or SQL Editor).
 * 2. Service role key (Settings → API → service_role). Never expose in client code.
 *
 * Usage (from frontend/):
 *   pnpm upload:videos
 *   # or: node scripts/upload-videos-to-supabase.mjs
 *
 * Required env:
 *   NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.resolve(__dirname, "..");
const SOURCE_DIR = path.join(FRONTEND_ROOT, "data", "vid", "vid");
const BUCKET = "videos";
const PREFIX = "vid";

/** Load `.env.local` if present (does not override existing env). */
function loadEnvLocal() {
  const p = path.join(FRONTEND_ROOT, ".env.local");
  if (!fs.existsSync(p)) return;
  const text = fs.readFileSync(p, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadEnvLocal();

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL) or SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const files = fs
  .readdirSync(SOURCE_DIR)
  .filter((f) => f.toLowerCase().endsWith(".mp4"));

if (files.length === 0) {
  console.error(`No .mp4 files in ${SOURCE_DIR}`);
  process.exit(1);
}

console.log(`Uploading ${files.length} file(s) to ${BUCKET}/${PREFIX}/...`);

for (const name of files) {
  const localPath = path.join(SOURCE_DIR, name);
  const storagePath = `${PREFIX}/${name}`;
  const body = fs.readFileSync(localPath);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, body, {
      contentType: "video/mp4",
      upsert: true,
    });

  if (error) {
    console.error(`Failed ${storagePath}:`, error.message);
    process.exit(1);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  console.log("OK", storagePath, "→", data.publicUrl);
}

console.log("Done.");
