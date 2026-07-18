# kmitl_vibe 🟠

**ISO-referenced Scrum plugin for Claude Code.** A Vibe Coder types requirements in natural language; an agent team (teammate mode) turns them into Epics → User Stories → Tasks, then delivers them sprint by sprint with **tests always written before code** — and reports back after every sprint.

Stack: **FastAPI** (backend) + **React / TypeScript** (frontend) + PostgreSQL, containerized.

```
██╗  ██╗███╗   ███╗██╗████████╗██╗
██║ ██╔╝████╗ ████║██║╚══██╔══╝██║
█████╔╝ ██╔████╔██║██║   ██║   ██║        kmitl_vibe
██╔═██╗ ██║╚██╔╝██║██║   ██║   ██║        ISO/IEC 29110 · 25010 · 29119
██║  ██╗██║ ╚═╝ ██║██║   ██║   ███████╗   27034/OWASP · 23894
╚═╝  ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝   ╚══════╝
```

## Install

**From GitHub (recommended — shows the KMITL banner, enables teammate mode, installs the plugin). Idempotent: safe to re-run any time, an existing install is updated.**

```bash
# option A — npx (always pass -y, see troubleshooting below)
npx -y github:SnipeBoss/kmitl_vibe install

# option B — no npm needed (best for cloud workspaces, e.g. Coder)
curl -fsSL https://raw.githubusercontent.com/SnipeBoss/kmitl_vibe/main/install.sh | bash
```

**Manually inside Claude Code:**

```
/plugin marketplace add SnipeBoss/kmitl_vibe
/plugin install kmitl_vibe@kmitl_vibe
```

Teammate mode (agent teams) is required for sprints — the installer sets `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in `~/.claude/settings.json` (skip with `--no-teams`).

### Troubleshooting install

- **`npx` exits silently, no banner, nothing installed** (common in cloud/web terminals like Coder): npm's interactive `Ok to proceed?` prompt can swallow your `y` and npm then quits without output. Fix: pass `-y` (`npx -y github:SnipeBoss/kmitl_vibe install`) or use the `curl | bash` installer, which never prompts.
- **`npm error spawn git`**: git isn't installed — `sudo apt-get install -y git` (or use the `curl | bash` installer).
- **`claude CLI not found`**: install Claude Code first (`npm i -g @anthropic-ai/claude-code`), then re-run.
- Still stuck? Run `npx -y --loglevel=info github:SnipeBoss/kmitl_vibe install` and read the log it prints.

## Use

| Command | What it does |
|---|---|
| `/kmitl_vibe:start <requirements>` | Intake → Epics → Stories (MoSCoW + AC) → Tasks (DoR) → sprint plan → **waits for your approval** |
| `/kmitl_vibe:sprint` | Runs the next sprint with an agent team, TDD-first, then reports to you |
| `/kmitl_vibe:status` | Progress, task board, test health, ISO gate checklist |

## How a sprint works (teammate mode)

```
you approve backlog
        │
lead plans sprint ──► shared task list:  S1-test ──► S1-impl ──► S1-review
        │                                (qa)        (api/web-dev)  (security)
spawns teammates ──► qa writes FAILING tests first (Red)
        │            devs implement to green (Green → Refactor)
        │            security reviews (OWASP / ISO 27034)
TaskCompleted hook re-runs static + dynamic tests on every completion (DoD gate)
        │
lead runs full suite ──► REPORT.md ──► tells YOU what you can now do ──► you decide next sprint
```

Testing covers **static** (ruff/mypy/bandit · eslint/tsc · **SonarQube**) and **dynamic** at all levels (ISO/IEC/IEEE 29119): **Unit → Integration → System → E2E → Performance**, with a fixed tool mandate — Functional: **pytest · JUnit · TestNG** · E2E: **Playwright** · Performance: **JMeter · k6 · Locust · Gatling** (P95 < 2s on critical paths).

**SonarQube** is optional but binding once configured: add a `sonar-project.properties` (+ `SONAR_HOST_URL`/`SONAR_TOKEN`, or the bundled docker-compose service) and the SonarQube **Quality Gate must PASS before a sprint can close**; the security reviewer also clears new Security Hotspots per story. Setup guide: `skills/scrum-orchestration/references/sonarqube.md`.

## Standards traceability

| Phase | Standard |
|---|---|
| Planning & requirements | ISO/IEC 29110 (VSE — PM.1, SI.2) |
| Architecture & design | ISO/IEC 25010 + ISO/IEC 27034 |
| Frontend design | org design standard (agent-skill): `references/design/` — Style_Apple + Brand_Guideline, **read before any UI work (binding)** |
| TDD & testing | ISO/IEC/IEEE 29119 |
| Security review | ISO/IEC 27034 + OWASP Top 10:2025 / API Top 10 / SAMM |
| AI features | ISO/IEC 23894 |

Every artifact carries `ISO:` trace tags; every sprint report ends with an ISO audit table.

## Layout

```
kmitl_vibe/
├── .claude-plugin/{plugin,marketplace}.json   # installable from GitHub
├── commands/{start,sprint,status}.md          # /kmitl_vibe:* slash commands
├── agents/                                    # teammate/subagent role definitions
│   product-owner · architect · qa-engineer · backend-dev · frontend-dev · security-reviewer
├── skills/scrum-orchestration/                # operating model + references/ (ISO map, templates)
├── hooks/hooks.json + scripts/dod-gate.sh     # TaskCompleted DoD quality gate
└── bin/{cli,banner}.js                        # npx installer with KMITL orange banner
```

Inspired by the BMAD-METHOD (specialized agile agents), built on Claude Code agent teams, aligned with the GS Battery sopify-sdlc SOP (adapted for FastAPI: Pydantic ⇄ Zod, service layering, DoR/DoD, phase gates).

## License

MIT
