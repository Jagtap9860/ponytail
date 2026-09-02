#!/usr/bin/env node
// DeepSeek Harness (DSH) support is a real native plugin, not just copied
// rules: .dsh-plugin/ must be an installable bundle (cordis.patch.yml + dsh
// manifest entry), register the six slash commands and a skill provider
// whose candidates/definitions satisfy the host registry's validation.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const pkgDir = path.join(root, '.dsh-plugin');
const commands = ['ponytail', 'ponytail-review', 'ponytail-audit', 'ponytail-debt', 'ponytail-gain', 'ponytail-help'];
const skillDirs = fs.readdirSync(path.join(root, 'skills'))
  .filter((name) => fs.existsSync(path.join(root, 'skills', name, 'SKILL.md')))
  .sort();

function loadPlugin() {
  // lib/index.mjs is ESM; node:test runs as CJS.
  return import(path.join(pkgDir, 'lib', 'index.mjs'));
}

test('DSH bundle declares its patch layer and self-describes as a dsh bundle', () => {
  const patch = fs.readFileSync(path.join(pkgDir, 'cordis.patch.yml'), 'utf8');
  const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));

  assert.equal(pkg.dsh?.bundle?.patch, './cordis.patch.yml');
  assert.equal(pkg.name, 'dsh-plugin-ponytail');
  assert.equal(pkg.version, JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version);

  // One insert mounting exactly the plugin id; nothing overrides built-in rows.
  assert.match(patch, /- insert:\s*\n\s*- id:\s*dsh-plugin-ponytail\s*\n\s*name:\s*'?dsh-plugin-ponytail'?/);
  assert.doesNotMatch(patch, /customSkillDirs/, 'must not target the host skill-filesystem row (disabled under the web profile)');
});

test('bundled skills are byte-identical copies of the repo-root source of truth', () => {
  for (const skill of skillDirs) {
    assert.equal(
      fs.readFileSync(path.join(pkgDir, 'skills', skill, 'SKILL.md'), 'utf8'),
      fs.readFileSync(path.join(root, 'skills', skill, 'SKILL.md'), 'utf8'),
      `.dsh-plugin/skills/${skill} drifted — run: node .dsh-plugin/scripts/sync-skills.mjs`,
    );
  }
});

// Drive every registered command, capturing the messages they steer. The
// handler lazy-imports @deepseek-ai/dsh-llm from the booted profile (resolvable
// in an installed plugin; see dsh-git-rollback's peerDependencies); in a bare
// repo checkout without the host on the resolution path, the import fails, so
// tests assert the briefing text directly and treat the steer only where the
// host package is reachable.
async function driveCommands(mod, rawFor) {
  const registered = [];
  mod.apply({
    commands: { register: (def) => registered.push(def) },
    skills: { registerProvider: () => {} },
    logger: { warn: () => {} },
  });
  const steered = [];
  const results = [];
  for (const cmd of registered) {
    const agent = { steer: (msg) => steered.push({ cmd: cmd.name, msg }) };
    results.push({ name: cmd.name, result: await cmd.handler({ agent, rawInput: rawFor(cmd), attachments: [] }) });
  }
  return { registered, steered, results };
}

test('plugin registers the six commands; every handler steers the agent and returns a briefing', async () => {
  const mod = await loadPlugin();
  assert.equal(mod.name, 'dsh-plugin-ponytail');
  assert.deepEqual([...mod.inject].sort(), ['commands', 'skills']);

  const { registered, steered, results } = await driveCommands(
    mod,
    (cmd) => (cmd.name === 'ponytail' ? 'ultra' : '  '),
  );

  assert.deepEqual(registered.map((c) => c.name).sort(), [...commands].sort());
  // Each command opens a model turn by steering the agent with a user text
  // message (command result text alone never enters model history).
  assert.equal(steered.length, commands.length);
  for (const s of steered) {
    assert.equal(s.msg.role, 'user');
    assert.ok(typeof s.msg.id === 'string' && s.msg.id.length > 0, 'steered message needs an id (host inbox requires it)');
    assert.ok(s.msg.content.some((c) => c.type === 'text' && c.text.length > 40));
  }
  for (const r of results) {
    assert.equal(r.result.kind, 'success');
    assert.ok(r.result.text.length > 40, `/${r.name} briefing must not be empty`);
  }
});

test('/ponytail off steers a deactivation instruction, not "ponytail off mode"', async () => {
  const mod = await loadPlugin();
  let registered;
  mod.apply({
    commands: { register: (def) => { if (def.name === 'ponytail') registered = def; } },
    skills: { registerProvider: () => {} },
    logger: { warn: () => {} },
  });
  const steered = [];
  const result = await registered.handler({ agent: { steer: (m) => steered.push(m) }, rawInput: 'off', attachments: [] });
  assert.equal(result.kind, 'success');
  const text = steered[0].content.find((c) => c.type === 'text').text;
  assert.match(text, /OFF/i);
  assert.doesNotMatch(text, /ponytail off mode/);
  // And a normal level steers the activation ladder, not the off text.
  const on = [];
  await registered.handler({ agent: { steer: (m) => on.push(m) }, rawInput: 'ultra', attachments: [] });
  const onText = on[0].content.find((c) => c.type === 'text').text;
  assert.match(onText, /ultra/);

  // Case-insensitive: /ponytail OFF must still deactivate, not "Switch to ponytail OFF".
  const upper = [];
  await registered.handler({ agent: { steer: (m) => upper.push(m) }, rawInput: 'OFF', attachments: [] });
  const upperText = upper[0].content.find((c) => c.type === 'text').text;
  assert.match(upperText, /OFF/i);
  assert.doesNotMatch(upperText, /Switch to ponytail OFF/);

  // Unknown level falls back to full instead of echoing garbage.
  const junk = [];
  await registered.handler({ agent: { steer: (m) => junk.push(m) }, rawInput: 'nonsense', attachments: [] });
  const junkText = junk[0].content.find((c) => c.type === 'text').text;
  assert.match(junkText, /ponytail full mode/);
  assert.doesNotMatch(junkText, /nonsense/);
});

test('skill provider candidates satisfy the DSH registry contract (name/description/invocation/source/rank/provider)', async () => {
  const mod = await loadPlugin();
  let provider;
  mod.apply({
    commands: { register: () => {} },
    skills: { registerProvider: (create) => { provider = create({ signal: new AbortController().signal, invalidate() {} }); } },
  });

  assert.equal(provider.name, 'dsh-plugin-ponytail');
  const observation = await provider.list();
  assert.equal(observation.complete, true);
  assert.deepEqual(observation.candidates.map((c) => c.name).sort(), [...skillDirs].sort());

  for (const candidate of observation.candidates) {
    // The shape @deepseek-ai/dsh-skill validateCandidate() enforces.
    assert.match(candidate.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(typeof candidate.description, 'string');
    assert.ok(candidate.description.length > 0);
    assert.deepEqual(candidate.invocation, { modelInvocable: true, userInvocable: true });
    assert.equal(typeof candidate.source, 'string');
    assert.equal(typeof candidate.rank, 'number');
    assert.equal(candidate.provider, 'dsh-plugin-ponytail');
    // Packaged roots must be the LOWEST precedence so user/project overrides win
    // (BUNDLED_SKILL_RANK = 600 in @deepseek-ai/dsh-skill).
    assert.equal(candidate.rank, 600);

    const full = await provider.get(candidate);
    assert.equal(full.name, candidate.name);
    assert.equal(typeof full.content, 'string');
    assert.ok(full.content.length > 100, `${candidate.name} body missing`);
    assert.ok(fs.existsSync(candidate.path));
    // The shared definition must be frozen so a consumer can't corrupt it for
    // other agents.
    assert.ok(Object.isFrozen(full), `${candidate.name} definition should be frozen`);
  }
});

test('a SKILL.md with an invalid (non-kebab) name is skipped with a warning, not surfaced', async () => {
  const mod = await loadPlugin();
  const fsx = require('node:fs');
  const os = require('node:os');
  const tmp = fsx.mkdtempSync(path.join(os.tmpdir(), 'ponytail-badskill-'));
  fsx.mkdirSync(path.join(tmp, 'good'));
  fsx.writeFileSync(path.join(tmp, 'good', 'SKILL.md'), '---\nname: good-skill\ndescription: a fine skill\n---\nbody\n');
  fsx.mkdirSync(path.join(tmp, 'bad'));
  fsx.writeFileSync(path.join(tmp, 'bad', 'SKILL.md'), '---\nname: Bad_Name\ndescription: an illegal name\n---\nbody\n');
  const warnings = [];
  const provider = new mod.BundledSkillProvider(tmp, (m) => warnings.push(m));
  const names = (await provider.list()).candidates.map((c) => c.name);
  assert.deepEqual(names, ['good-skill']);
  assert.ok(warnings.some((w) => /invalid skill name/.test(w)));
  fsx.rmSync(tmp, { recursive: true, force: true });
});

test('CRLF line endings in a SKILL.md still parse (Windows checkouts)', async () => {
  const mod = await loadPlugin();
  const fsx = require('node:fs');
  const os = require('node:os');
  const tmp = fsx.mkdtempSync(path.join(os.tmpdir(), 'ponytail-crlf-'));
  fsx.mkdirSync(path.join(tmp, 'crlf-skill'));
  // Same content as a normal SKILL.md but with Windows CRLF line endings.
  fsx.writeFileSync(
    path.join(tmp, 'crlf-skill', 'SKILL.md'),
    '---\r\nname: crlf-skill\r\ndescription: >\r\n  A skill checked out with CRLF line endings on Windows, which must still\r\n  be discovered rather than silently dropped.\r\n---\r\nBody text.\r\n',
  );
  const provider = new mod.BundledSkillProvider(tmp, () => {});
  const names = (await provider.list()).candidates.map((c) => c.name);
  assert.deepEqual(names, ['crlf-skill']);
  const full = await provider.get({ name: 'crlf-skill' });
  assert.match(full.description, /CRLF/);
  assert.match(full.content, /Body text/);
  fsx.rmSync(tmp, { recursive: true, force: true });
});

test('missing skill dir degrades to an empty provider with a warning instead of throwing', async () => {
  const mod = await loadPlugin();
  const warnings = [];
  // A root that cannot exist: under a definitely-missing path.
  const provider = new mod.BundledSkillProvider(path.join(pkgDir, 'no-such-skills'), (m) => warnings.push(m));
  const observation = await provider.list();
  assert.equal(observation.complete, true);
  assert.deepEqual(observation.candidates, []);
  assert.equal(warnings.length, 1);
  assert.match(warnings[0], /skill dir not readable/);
  assert.equal(await provider.get({ name: 'ponytail' }), undefined);
});

test('folded-block description does not bleed into later frontmatter keys', async () => {
  const mod = await loadPlugin();
  let provider;
  mod.apply({
    commands: { register: () => {} },
    skills: { registerProvider: (create) => { provider = create({ signal: new AbortController().signal, invalidate() {} }); } },
  });

  // skills/ponytail/SKILL.md has `argument-hint`/`license` AFTER the folded
  // description; a parser that keeps appending past the unindented key line
  // swallows them into the description.
  const candidates = (await provider.list()).candidates;
  const main = candidates.find((c) => c.name === 'ponytail');
  assert.ok(main);
  assert.doesNotMatch(main.description, /argument-hint|license/i);
  assert.ok(main.description.length > 100);
});
