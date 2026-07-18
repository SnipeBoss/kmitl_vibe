#!/usr/bin/env bash
# kmitl_vibe installer — no npm required. Idempotent: safe to re-run.
#   curl -fsSL https://raw.githubusercontent.com/SnipeBoss/kmitl_vibe/main/install.sh | bash
# Flags: --no-teams  skip enabling CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS
set -u

NAME="kmitl_vibe"
REPO="SnipeBoss/kmitl_vibe"
NO_TEAMS=0
for a in "$@"; do [ "$a" = "--no-teams" ] && NO_TEAMS=1; done

# --- KMITL orange banner (#E35205; 256-color fallback) ---
if [ -n "${NO_COLOR:-}" ]; then O=""; B=""; D=""; R=""
elif printf '%s' "${COLORTERM:-}" | grep -qi 'truecolor\|24bit'; then
  O=$'\033[38;2;227;82;5m'; B=$'\033[1m'; D=$'\033[2m'; R=$'\033[0m'
else
  O=$'\033[38;5;208m'; B=$'\033[1m'; D=$'\033[2m'; R=$'\033[0m'
fi

printf '%s\n' "${O}${B}"
cat <<'EOF'
██╗  ██╗███╗   ███╗██╗████████╗██╗
██║ ██╔╝████╗ ████║██║╚══██╔══╝██║
█████╔╝ ██╔████╔██║██║   ██║   ██║
██╔═██╗ ██║╚██╔╝██║██║   ██║   ██║
██║  ██╗██║ ╚═╝ ██║██║   ██║   ███████╗
╚═╝  ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝   ╚══════╝
EOF
printf '%s\n' "${R}${O}${B}  ${NAME}${R}${D} — ISO-referenced Scrum for Vibe Coders${R}"
printf '%s\n\n' "${D}  ISO/IEC 29110 · 25010 · 29119 · 27034/OWASP · 23894${R}"

ok()   { printf '%s✔ %s%s\n' "$O" "$R" "$1"; }
inf()  { printf '%s  %s%s\n' "$D" "$1" "$R"; }
warn() { printf '⚠ %s\n' "$1"; }

manual() {
  printf '\nManual install (inside a Claude Code session):\n'
  inf "/plugin marketplace add $REPO"
  inf "/plugin install ${NAME}@${NAME}"
  inf "and set env CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 for teammate mode"
}

if ! command -v claude >/dev/null 2>&1; then
  warn "claude CLI not found — install Claude Code first: npm i -g @anthropic-ai/claude-code"
  manual
  exit 1
fi

# --- enable teammate mode (agent teams) ---
if [ "$NO_TEAMS" = "1" ]; then
  inf "skipped agent-teams setup (--no-teams)"
else
  SETTINGS="$HOME/.claude/settings.json"
  if command -v node >/dev/null 2>&1; then
    node -e '
      const fs = require("fs"), p = process.argv[1];
      let s = {};
      try { if (fs.existsSync(p)) s = JSON.parse(fs.readFileSync(p, "utf8")); }
      catch { console.error("unparseable"); process.exit(3); }
      s.env = s.env || {};
      if (s.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS === "1") process.exit(2);
      if (fs.existsSync(p)) fs.copyFileSync(p, p + ".kmitl_vibe.bak");
      s.env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS = "1";
      fs.mkdirSync(require("path").dirname(p), { recursive: true });
      fs.writeFileSync(p, JSON.stringify(s, null, 2) + "\n");
    ' "$SETTINGS"
    case $? in
      0) ok "enabled agent teams in $SETTINGS (backup: settings.json.kmitl_vibe.bak)" ;;
      2) ok "agent teams (teammate mode) already enabled" ;;
      *) warn "could not update $SETTINGS — set CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 manually" ;;
    esac
  else
    warn "node not found — set CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 in $SETTINGS manually"
  fi
fi

# --- marketplace: add or update (idempotent) ---
if claude plugin marketplace list 2>/dev/null | grep -q "$NAME"; then
  if claude plugin marketplace update "$NAME"; then
    ok "marketplace already present — updated from $REPO"
  else
    warn "marketplace update failed — continuing with the cached version"
  fi
else
  if claude plugin marketplace add "$REPO"; then
    ok "marketplace added: $REPO"
  else
    warn "could not add marketplace $REPO — check network/repo access"
    manual
    exit 1
  fi
fi

# --- plugin: install or update (idempotent) ---
if claude plugin list 2>/dev/null | grep -q "${NAME}@${NAME}"; then
  if claude plugin update "${NAME}@${NAME}"; then
    ok "plugin already installed — updated to the latest version (restart Claude Code to apply)"
  else
    warn "plugin update failed — try inside Claude Code: /plugin update ${NAME}@${NAME}"
  fi
else
  if claude plugin install "${NAME}@${NAME}"; then
    ok "plugin installed"
  else
    warn "plugin install failed — try inside a Claude Code session: /plugin install ${NAME}@${NAME}"
  fi
fi

printf '\n%sReady.%s Next steps:\n' "${O}${B}" "$R"
inf "1. cd <your-project> && claude"
inf "2. /${NAME}:start  <describe what you want to build>"
inf "3. approve the backlog, then /${NAME}:sprint"
