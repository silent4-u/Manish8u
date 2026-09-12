/*
 * Checks that the agent definitions stay honest.
 *
 * An agent file is instructions, not code, so nothing breaks loudly when it
 * goes out of date — it just quietly tells the agent to run a script that was
 * renamed, or to edit a file that moved, and the agent improvises. That is the
 * worst failure mode for a steward whose whole job is not to improvise. So
 * every path and every npm script an agent file names is checked to exist.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const agentDir = join(repoRoot, '.claude/agents');
const commandDir = join(repoRoot, '.claude/commands');
const pkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8')) as {
  scripts: Record<string, string>;
};

let failures = 0;

function check(label: string, ok: boolean, detail = '') {
  if (ok) {
    console.log(`  ok    ${label}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${label}${detail ? `\n        ${detail}` : ''}`);
  }
}

/** Markdown files directly in a directory, ignoring companion subdirectories. */
function markdownIn(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .filter((name) => statSync(join(dir, name)).isFile());
}

const agents = markdownIn(agentDir);
console.log('agent definitions');
check('at least one agent is defined', agents.length > 0);

for (const file of agents) {
  const text = readFileSync(join(agentDir, file), 'utf8');
  const label = `.claude/agents/${file}`;

  // Frontmatter: the harness reads name and description out of it.
  const frontmatter = /^---\n([\s\S]*?)\n---\n/.exec(text);
  check(`${label} opens with frontmatter`, frontmatter !== null);
  if (!frontmatter) continue;

  const fields = new Map<string, string>();
  for (const line of frontmatter[1].split('\n')) {
    const m = /^([a-zA-Z_]+):\s*(.*)$/.exec(line);
    if (m) fields.set(m[1], m[2].trim());
  }
  check(`${label} declares a name`, (fields.get('name') ?? '').length > 0);
  check(
    `${label} name matches its filename`,
    fields.get('name') === file.replace(/\.md$/, ''),
    `name "${fields.get('name')}" vs file "${file}"`,
  );
  // The description is what the harness matches a request against, so a thin
  // one means the agent never gets picked for the work it was written for.
  check(`${label} description says when to use it`, (fields.get('description') ?? '').length >= 80);

  const body = text.slice(frontmatter[0].length);

  // Every npm script the file tells the agent to run must exist.
  const scripts = [...body.matchAll(/npm run ([a-z:]+)/g)].map((m) => m[1]);
  for (const script of new Set(scripts)) {
    check(`${label} → npm run ${script} exists`, script in pkg.scripts);
  }

  // Every repo path it names must exist. Backticked, slash-bearing, and not a
  // command line or a URL.
  const paths = [...body.matchAll(/`([^`\s]+\/[^`\s]*)`/g)]
    .map((m) => m[1])
    .filter((candidate) => !candidate.includes('://') && !candidate.startsWith('*'))
    // A placeholder is not a path: `steward-YYYY-MM-DD`, `<paper-id>/notes`.
    .filter((candidate) => !/YYYY|MM-DD|<[a-z-]+>/.test(candidate));
  for (const candidate of new Set(paths)) {
    // A glob stands for its directory.
    const target = candidate.includes('*') ? dirname(candidate) : candidate;
    check(`${label} → ${candidate} exists`, existsSync(join(repoRoot, target)));
  }
}

console.log('\nslash commands');
for (const file of markdownIn(commandDir)) {
  const text = readFileSync(join(commandDir, file), 'utf8');
  const label = `.claude/commands/${file}`;
  check(`${label} opens with frontmatter`, /^---\n[\s\S]*?\n---\n/.test(text));
  for (const script of new Set([...text.matchAll(/npm run ([a-z:]+)/g)].map((m) => m[1]))) {
    check(`${label} → npm run ${script} exists`, script in pkg.scripts);
  }
  // A command that spawns an agent has to name one that exists.
  for (const named of new Set([...text.matchAll(/`([a-z][a-z-]{3,})`\s+agent/g)].map((m) => m[1]))) {
    check(`${label} → agent "${named}" is defined`, agents.includes(`${named}.md`));
  }
}

console.log(failures === 0 ? '\nAll agent checks passed.' : `\n${failures} agent check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
