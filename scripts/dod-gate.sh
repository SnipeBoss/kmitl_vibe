#!/usr/bin/env bash
# kmitl_vibe DoD gate — runs on TaskCompleted while a sprint is active.
# Exit 2 blocks the task completion and sends stderr back to the agent (see
# Claude Code hooks docs). Static tests (lint/type-check) + dynamic unit &
# integration suites must be green before any task may be marked complete.
set -u

ROOT="${CLAUDE_PROJECT_DIR:-$PWD}"
cd "$ROOT" || exit 0

# Gate only applies during an active kmitl_vibe sprint.
[ -f "$ROOT/.kmitl_vibe/ACTIVE_SPRINT" ] || exit 0
# Escape hatch for debugging the gate itself.
[ "${KMITL_VIBE_SKIP_GATE:-0}" = "1" ] && exit 0

fail() {
  echo "kmitl_vibe DoD gate FAILED — $1" >&2
  echo "Fix the failure (or reassign to the owning teammate) before marking this task complete." >&2
  exit 2
}

run() { # run <label> <dir> <cmd...>
  local label="$1" dir="$2"; shift 2
  ( cd "$dir" && "$@" ) >/tmp/kmitl_vibe-gate.log 2>&1 || {
    tail -n 30 /tmp/kmitl_vibe-gate.log >&2
    fail "$label"
  }
}

# ---- Backend (FastAPI) ----
if [ -d "$ROOT/api" ] && [ -f "$ROOT/api/pyproject.toml" ]; then
  command -v ruff >/dev/null 2>&1 && run "static: ruff (api)" "$ROOT/api" ruff check .
  command -v mypy >/dev/null 2>&1 && run "static: mypy (api)" "$ROOT/api" mypy .
  if command -v pytest >/dev/null 2>&1 && [ -d "$ROOT/api/tests" ]; then
    run "dynamic: pytest (api unit+integration)" "$ROOT/api" pytest -x -q
  fi
fi

# ---- SonarQube (opt-in per task — full scan normally runs at sprint close) ----
if [ "${KMITL_VIBE_SONAR_ON_TASK:-0}" = "1" ] && [ -f "$ROOT/sonar-project.properties" ]; then
  if command -v sonar-scanner >/dev/null 2>&1; then
    run "static: sonarqube quality gate" "$ROOT" sonar-scanner -Dsonar.qualitygate.wait=true
  else
    echo "kmitl_vibe gate: sonar-scanner not found — skipped SonarQube (see skill references/sonarqube.md)." >&2
  fi
fi

# ---- Frontend (React/TS) ----
if [ -f "$ROOT/web/package.json" ]; then
  if [ -d "$ROOT/web/node_modules" ]; then
    grep -q '"lint"' "$ROOT/web/package.json" && run "static: eslint (web)" "$ROOT/web" npm run -s lint
    [ -f "$ROOT/web/tsconfig.json" ] && run "static: tsc (web)" "$ROOT/web" npx tsc --noEmit
    grep -q '"test"' "$ROOT/web/package.json" && run "dynamic: vitest (web unit)" "$ROOT/web" npx vitest run --reporter=dot
  else
    echo "kmitl_vibe gate: web/node_modules missing — skipped web checks (run npm install)." >&2
  fi
fi

exit 0
