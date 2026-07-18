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

const args = process.argv.slice(2);
const cmd = args[0] || 'install';

const ok = (m) => console.log(ORANGE + '✔ ' + RESET + m);
const info = (m) => console.log(DIM + '  ' + m + RESET);
const warn = (m) => console.log('⚠ ' + m);

function hasClaude() {
  try {
    execFileSync('claude', ['--version'], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function claude(argv) {
  execFileSync('claude', argv, { stdio: 'inherit' });
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
    fs.copyFileSync(settingsPath, settingsPath + '.kmitl_vibe.bak');
  }
  settings.env = settings.env || {};
  if (settings.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS === '1') {
    ok('agent teams (teammate mode) already enabled');
    return;
  }
  settings.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = '1';
  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n');
  ok(`enabled agent teams in ${settingsPath} (backup: settings.json.kmitl_vibe.bak)`);
}

function install() {
  if (!hasClaude()) {
    warn('claude CLI not found — install Claude Code first: npm i -g @anthropic-ai/claude-code');
    printManual();
    process.exit(1);
  }
  if (!args.includes('--no-teams')) enableAgentTeams();
  else info('skipped agent-teams setup (--no-teams)');

  try {
    claude(['plugin', 'marketplace', 'add', REPO]);
    ok(`marketplace added: ${REPO}`);
  } catch {
    warn('marketplace may already exist — continuing');
  }
  try {
    claude(['plugin', 'install', 'kmitl_vibe@kmitl_vibe']);
    ok('plugin installed');
  } catch {
    warn('plugin install failed — try inside a Claude Code session: /plugin install kmitl_vibe@kmitl_vibe');
  }

  console.log('\n' + ORANGE + BOLD + 'Ready.' + RESET + ' Next steps:');
  info('1. cd <your-project> && claude');
  info('2. /kmitl_vibe:start  <describe what you want to build>');
  info('3. approve the backlog, then /kmitl_vibe:sprint');
}

function printManual() {
  console.log('\nManual install (inside a Claude Code session):');
  info(`/plugin marketplace add ${REPO}`);
  info('/plugin install kmitl_vibe@kmitl_vibe');
  info('and set env CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 for teammate mode');
}

switch (cmd) {
  case 'install':
    install();
    break;
  case 'banner':
    break; // banner already printed on require
  default:
    console.log(`Usage: npx kmitl_vibe [install|banner] [--no-teams]`);
    printManual();
}
