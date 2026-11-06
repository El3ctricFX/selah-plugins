## Submitting a plugin
1. Publish your plugin in your own public GitHub repo (`manifest.json` + `index.js` at the root).
2. Note the exact commit you want published: `git rev-parse HEAD`
3. Fork this repo and run:
   `node scripts/hash.mjs yourname/your-plugin <commit-sha>`
4. Save the output as `plugins/<id>.json`.
5. Open a pull request. CI re-downloads your files and checks the hashes.
6. A maintainer reviews your code. Once merged, it shows up in Selah within minutes.

## Updating a plugin
Push your changes, then open a PR editing your `plugins/<id>.json` with the new commit,
version and hashes. Users are never moved to new code without a reviewed PR.

node scripts/hash.mjs El3ctricFX/selah-flowtide d9f7de73c2ad816ae1c2338bd7233e9318796d47
