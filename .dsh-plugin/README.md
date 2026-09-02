# dsh-plugin-ponytail

[Ponytail](https://github.com/DietrichGebert/ponytail) — lazy senior dev mode —
packaged as a native [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness)
plugin: six skills plus six slash commands, zero runtime dependencies.

> He says nothing. He writes one line. It works.

## Install

```sh
# from a checkout of this repo (this directory), linked live:
dsh plugin --profile web add /absolute/path/to/ponytail/.dsh-plugin

# or once published to npm as dsh-plugin-ponytail:
dsh plugin --profile web add dsh-plugin-ponytail
```

Then restart `dsh web`. The plugin reconciles into the profile's bundle list
automatically on install.

## What you get

Six skills (auto-triggered by the model, and listed in the skill catalog):

| Skill | Trigger |
|---|---|
| `ponytail` | any coding task — the YAGNI → stdlib → native → one-line ladder |
| `ponytail-review` | over-engineering review of the current diff |
| `ponytail-audit` | whole-repo over-engineering audit |
| `ponytail-debt` | harvest `ponytail:` deferral comments into a ledger |
| `ponytail-gain` | measured-impact scoreboard from the benchmark |
| `ponytail-help` | quick-reference card |

Six matching slash commands: `/ponytail [lite|full|ultra|off]`,
`/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain`,
`/ponytail-help`. In DSH a command handler runs without opening a model turn
and its result text never enters model history, so each command **steers the
agent** with its briefing as a user message (the same pattern the built-in
`/plan` command uses) — the agent then acts on it. The commands also appear in
the composer's autocomplete.

## How it is wired

- `cordis.patch.yml` — one insert mounting `lib/index.mjs`.
- `lib/index.mjs` — one ~270-line, zero-dependency Cordis plugin that:
  - registers the six commands on `ctx.commands` and steers the agent with
    the command briefing as a user message (a DSH command result alone
    never enters model history — briefings mirror `commands/*.toml`);
  - registers a static bundled-skill provider on `ctx.skills` rooted at the
    package's `skills/` directory. The provider lives in the skill
    registry's global layer, so the skills reach every agent/preset
    (the web profile disables the host `skill-filesystem` row; preset-local
    rows are merged over the global layer).
- `skills/` — copies of the repo-root `skills/*/SKILL.md` (the npm package is
  self-contained; byte-checked against the source by `tests/dsh-plugin.test.js`).

## Publishing to the marketplace

The DSH community catalog ([awesome-dsh-plugin.com](https://awesome-dsh-plugin.com))
indexes GitHub repos carrying the `dsh-plugin` topic. From a repo checkout:

```sh
node .dsh-plugin/scripts/sync-skills.mjs   # refresh skills/ copies
npm test                                   # includes tests/dsh-plugin.test.js
cd .dsh-plugin && npm publish              # name dsh-plugin-ponytail
```

Then add the `dsh-plugin` GitHub topic to DietrichGebert/ponytail so the
catalog indexes it; users install with `dsh plugin --profile web add dsh-plugin-ponytail`.
Bump this package's `version` together with the repo release — `scripts/check-versions.js`
guards it.

## License

MIT © Dietrich Gebert
