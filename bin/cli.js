#!/usr/bin/env node
'use strict';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { ORANGE, BOLD, DIM, RESET } = require('./banner'); // printing the banner happens on require

const pkg = require('../package.json');
const REPO = (pkg.repository && pkg.repository.url || '')
  .replace(/^git\+/, '').replace(/\.git$/, '')
  .replace('https://github.com/', '');
const NAME = pkg.name; // kmitl_vibe

const args = process.argv.slice(2);
const cmd = args[0] || 'install';

const ok = (m) => console.log(ORANGE + '✔ ' + RESET + m);
const info = (m) => console.log(DIM + '  ' + m + RESET);
const warn = (m) => console.log('⚠ ' + m);

function claude(argv, opts = {}) {
  return execFileSync('claude', argv, { stdio: opts.quiet ? 'pipe' : 'inherit', encoding: 'utf8' });
}

function claudeQuiet(argv) {
  try {
    return claude(argv, { quiet: true }) || '';
  } catch (e) {
    return (e.stdout || '') + (e.stderr || '');
  }
}

function hasClaude() {
  try {
    execFileSync('claude', ['--version'], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function enableAgentTeams() {
  const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');
  let settings = {};
  if (fs.existsSync(settingsPath)) {
    try {
      settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    } catch {
      warn(`could not parse ${settingsPath} — set CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 manually.`);
      return;
    }
  }
  settings.env = settings.env || {};
  if (settings.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS === '1') {
    ok('agent teams (teammate mode) already enabled');
    return;
  }
  if (fs.existsSync(settingsPath)) fs.copyFileSync(settingsPath, settingsPath + `.${NAME}.bak`);
  settings.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = '1';
  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
  ok(`enabled agent teams in ${settingsPath} (backup: settings.json.${NAME}.bak)`);
}

function install() {
  if (!hasClaude()) {
    warn('claude CLI not found — install Claude Code first: npm i -g @anthropic-ai/claude-code');
    printManual();
    process.exit(1);
  }
  if (!args.includes('--no-teams')) enableAgentTeams();
  else info('skipped agent-teams setup (--no-teams)');

  // Idempotent: safe to re-run — an existing marketplace/plugin is updated, never an error.
  const marketplaces = claudeQuiet(['plugin', 'marketplace', 'list']);
  if (marketplaces.includes(NAME)) {
    try {
      claude(['plugin', 'marketplace', 'update', NAME]);
      ok(`marketplace already present — updated from ${REPO}`);
    } catch {
      warn('marketplace update failed — continuing with the cached version');
    }
  } else {
    try {
      claude(['plugin', 'marketplace', 'add', REPO]);
      ok(`marketplace added: ${REPO}`);
    } catch {
      warn(`could not add marketplace ${REPO} — check network/repo access`);
      printManual();
      process.exit(1);
    }
  }

  const PLUGIN_ID = `${NAME}@${NAME}`;
  const installed = claudeQuiet(['plugin', 'list']);
  if (installed.includes(PLUGIN_ID)) {
    try {
      claude(['plugin', 'update', PLUGIN_ID]);
      ok('plugin already installed — updated to the latest version (restart Claude Code to apply)');
    } catch {
      warn(`plugin update failed — try inside Claude Code: /plugin update ${PLUGIN_ID}`);
    }
  } else {
    try {
      claude(['plugin', 'install', PLUGIN_ID]);
      ok('plugin installed');
    } catch {
      warn(`plugin install failed — try inside a Claude Code session: /plugin install ${PLUGIN_ID}`);
    }
  }

  console.log('\n' + ORANGE + BOLD + 'Ready.' + RESET + ' Next steps:');
  info('1. cd <your-project> && claude');
  info(`2. /${NAME}:start  <describe what you want to build>`);
  info(`3. approve the backlog, then /${NAME}:sprint`);
}

function printManual() {
  console.log('\nManual install (inside a Claude Code session):');
  info(`/plugin marketplace add ${REPO}`);
  info(`/plugin install ${NAME}@${NAME}`);
  info('and set env CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 for teammate mode');
}

switch (cmd) {
  case 'install':
    install();
    break;
  case 'banner':
    break; // banner already printed on require
  default:
    console.log(`Usage: npx ${NAME} [install|banner] [--no-teams]`);
    printManual();
}
