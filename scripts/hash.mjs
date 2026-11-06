// usage: node scripts/hash.mjs owner/repo <40-char-commit> [folder-name] [extra/file.js ...]
import { createHash } from "node:crypto";

const [repo, commit, folder, ...extra] = process.argv.slice(2);
if (!repo || !commit) {
    console.error("usage: node scripts/hash.mjs owner/repo <commit-sha> [folder-name] [extra files...]");
    process.exit(1);
}
const prefix = folder && folder !== "-" ? `${folder}/` : "";
const paths = [`${prefix}manifest.json`, `${prefix}index.js`, ...extra];
const files = {};
let manifest = {};
for (const p of paths) {
    const res = await fetch(`https://raw.githubusercontent.com/${repo}/${commit}/${p}`);
    if (!res.ok) { console.error(`Could not fetch ${p} (HTTP ${res.status})`); process.exit(1); }
    const buf = Buffer.from(await res.arrayBuffer());
    files[p] = createHash("sha256").update(buf).digest("hex");
    if (p.endsWith("manifest.json")) manifest = JSON.parse(buf.toString("utf8"));
}
console.log(JSON.stringify({
    id: manifest.id,
    name: manifest.name,
    description: manifest.description ?? "",
    author: manifest.author ?? repo.split("/")[0],
                           repo,
                           commit,
                           version: manifest.version ?? "1.0.0",
                           icon: "🧩",
                           permissions: manifest.permissions ?? [],
                           files,
}, null, 2));
