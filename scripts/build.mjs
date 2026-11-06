import { readdir, readFile, writeFile } from "node:fs/promises";

const names = (await readdir("plugins")).filter((n) => n.endsWith(".json"));
const plugins = [];
for (const n of names) plugins.push(JSON.parse(await readFile(`plugins/${n}`, "utf8")));
plugins.sort((a, b) => a.name.localeCompare(b.name));
await writeFile(
    "registry.json",
    JSON.stringify({ version: 1, generated: new Date().toISOString(), plugins }, null, 2)
);
console.log(`registry.json: ${plugins.length} plugins`);
