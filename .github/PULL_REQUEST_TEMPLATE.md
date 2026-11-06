## Plugin submission

- Plugin repo:
- Commit SHA:
- What it does:

### Contributor checklist
- [ ] I only added or changed ONE file in `plugins/`
- [ ] I generated the entry with `node scripts/hash.mjs`
- [ ] The commit is a full SHA, not a branch or tag
- [ ] The plugin repo has a LICENSE and a README
- [ ] I declared every capability the plugin uses in `permissions`

### Maintainer review (don't tick as contributor)
- [ ] Read all of index.js at the pinned commit
- [ ] No network calls, eval, or access outside the plugin's own folder and vault, unless declared and justified
- [ ] Submitter is the owner of the plugin repo (for new entries and updates)
- [ ] Nothing obfuscated or minified without source available
