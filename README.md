# Typosquat Dependency Companion (VS Code)

Flags a `package.json` dependency whose name is a near-miss (edit
distance 1–2) of a much more popular package — a possible typosquat/
dependency-confusion attack. No data leaves your editor.

**v0.1, new niche.** Not a port from the Gap Hunter Labs IntelliJ-
family catalog. Evidence: a real, cited case — *"a typo (@utils_core
instead of @utils-core) quietly pulled in a malicious lookalike
package during a CI/CD run"* — and a well-documented detection
technique (SpellBound, USENIX 2020, *"achieving a 0.5% false positive
rate"*), confirmed absent as a VS Code extension applying edit
distance to a project's own dependency names.

## What it does

Live, on any `package.json`: computes the Levenshtein (edit) distance
between every dependency name and a curated list of well-known
popular packages. A name 1–2 characters off from a popular one (and
not the popular one itself) gets a warning.

**v0.1 scope, honestly noted:** the popular-package list is a static,
hardcoded curated list — this extension makes zero network calls, so
it can't check against the live npm registry, and the list will go
stale over time. Names under 4 characters are skipped entirely (too
many legitimate short names sit within 1–2 edits of something popular
to be a useful signal).

## Privacy

See [PRIVACY.md](PRIVACY.md) — zero network calls, everything runs
against `package.json` already open in your editor.

## Development

```bash
npm install
npm run compile   # or: npm run watch
npm test
```

To build an installable package without publishing:

```bash
npx @vscode/vsce package
```

## License

Apache License 2.0 — see [LICENSE](LICENSE).
