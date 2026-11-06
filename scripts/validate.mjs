import { readdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const DIR = "plugins";
const ID_RE = /^[a-zA-Z0-9_-]+$/;
const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const SHA_RE = /^[0-9a-f]{40}$/;
const HASH_RE = /^[0-9a-f]{64}$/;
const FILE_RE = /^[A-Za-z0-9_-][A-Za-z0-9._-]*(\/[A-Za-z0-9_-][A-Za-z0-9._-]*)*$/;
const MAX_BYTES = 2 * 1024 * 1024;
const RISKY = [
    [/\beval\s*\(/, "eval()"], [/new Function/, "new Function"],
                 [/XMLHttpRequest/, "XMLHttpRequest"], [/WebSocket/, "WebSocket"],
                 [/\bfetch\s*\(/, "fetch()"], [/__TAURI/, "__TAURI access"],
                               [/\binvoke\s*\(/, "invoke()"], [/document\.cookie/, "document.cookie"],
                                              [/localStorage/, "localStorage"], [/import\s*\(/, "dynamic import()"],
];

let failed = false;
const fail = (f, m) => { console.error(`::error file=${f}::${m}`); failed = true; };
const warn = (f, m) => console.warn(`::warning file=${f}::${m}`);

const names = (await readdir(DIR)).filter((n) => n.endsWith(".json"));
const seen = new Set();

for (const name of names) {
    const file = `${DIR}/${name}`;
    let e;
    try { e = JSON.parse(await readFile(file, "utf8")); }
    catch { fail(file, "Not valid JSON"); continue; }

    for (const k of ["id", "name", "description", "author", "repo", "commit", "version"]) {
        if (typeof e[k] !== "string" || !e[k]) fail(file, `Missing string field "${k}"`);
    }
    if (!ID_RE.test(e.id || "")) fail(file, "id must be letters, numbers, - or _");
    if (`${e.id}.json` !== name) fail(file, `Filename must be ${e.id}.json`);
    if (seen.has(e.id)) fail(file, "Duplicate id");
    seen.add(e.id);
    if (!REPO_RE.test(e.repo || "")) fail(file, "repo must be owner/name");
    if (!SHA_RE.test(e.commit || "")) fail(file, "commit must be a full 40-char SHA (not a branch or tag)");
    if (!e.files || typeof e.files !== "object") { fail(file, "files is required"); continue; }
    if (!e.files["manifest.json"] || !e.files["index.js"]) fail(file, "files must include manifest.json and index.js");
    if (failed && (!REPO_RE.test(e.repo) || !SHA_RE.test(e.commit))) continue;

    for (const [path, expected] of Object.entries(e.files)) {
        if (!FILE_RE.test(path)) { fail(file, `Illegal file path: ${path}`); continue; }
        if (!HASH_RE.test(expected)) { fail(file, `Bad sha256 for ${path}`); continue; }
        const url = `https://raw.githubusercontent.com/${e.repo}/${e.commit}/${path}`;
        const res = await fetch(url);
        if (!res.ok) { fail(file, `Cannot fetch ${path} at that commit (HTTP ${res.status})`); continue; }
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > MAX_BYTES) { fail(file, `${path} exceeds 2 MB`); continue; }
        const actual = createHash("sha256").update(buf).digest("hex");
        if (actual !== expected) { fail(file, `Hash mismatch for ${path}: expected ${expected}, got ${actual}`); continue; }

        if (path === "manifest.json") {
            try {
                const m = JSON.parse(buf.toString("utf8"));
                if (String(m.id) !== e.id) fail(file, `manifest.json id "${m.id}" != "${e.id}"`);
                if (m.apiVersion !== undefined && m.apiVersion !== 1) fail(file, "Unsupported apiVersion");
            } catch { fail(file, "manifest.json is not valid JSON"); }
        }
        if (path.endsWith(".js")) {
            const text = buf.toString("utf8");
            for (const [re, label] of RISKY) {
                if (re.test(text)) warn(file, `${path} uses ${label}. Review carefully.`);
            }
        }
    }
}

if (failed) process.exit(1);
console.log(`Validated ${names.length} plugin entries.`);
