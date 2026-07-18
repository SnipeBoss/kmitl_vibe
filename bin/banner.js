#!/usr/bin/env node
'use strict';

// KMITL brand orange (#E35205) — truecolor with a 256-color fallback.
const ORANGE = process.env.NO_COLOR
  ? ''
  : process.env.COLORTERM && /truecolor|24bit/i.test(process.env.COLORTERM)
    ? '\x1b[38;2;227;82;5m'
    : '\x1b[38;5;208m';
const BOLD = process.env.NO_COLOR ? '' : '\x1b[1m';
const DIM = process.env.NO_COLOR ? '' : '\x1b[2m';
const RESET = process.env.NO_COLOR ? '' : '\x1b[0m';

const KMITL = `
██╗  ██╗███╗   ███╗██╗████████╗██╗
██║ ██╔╝████╗ ████║██║╚══██╔══╝██║
█████╔╝ ██╔████╔██║██║   ██║   ██║
██╔═██╗ ██║╚██╔╝██║██║   ██║   ██║
██║  ██╗██║ ╚═╝ ██║██║   ██║   ███████╗
╚═╝  ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝   ╚══════╝`;

function banner() {
  const version = require('../package.json').version;
  console.log(ORANGE + BOLD + KMITL + RESET);
  console.log(
    ORANGE + BOLD + '  kmitl_vibe' + RESET +
    DIM + ` v${version} — ISO-referenced Scrum for Vibe Coders` + RESET
  );
  console.log(DIM + '  ISO/IEC 29110 · 25010 · 29119 · 27034/OWASP · 23894\n' + RESET);
}

banner();

module.exports = { banner, ORANGE, BOLD, DIM, RESET };
