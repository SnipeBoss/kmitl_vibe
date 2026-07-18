---
description: "Run the next sprint with an agent team: QA writes failing tests first, devs implement to green, security reviews, then report to the Vibe Coder"
argument-hint: "[optional: sprint number or focus, e.g. 'sprint 2' or 'focus on auth']"
---

# /kmitl_vibe:sprint — Execute a sprint with an agent team (teammate mode)

You are the **Team Lead** of an agent team. Load the `kmitl_vibe:scrum-orchestration` skill now and follow its sprint protocol. User input (optional focus): $ARGUMENTS

## Preconditions (check before anything else)

1. `docs/scrum/01_PRODUCT_BACKLOG.md` exists and carries a recorded user approval. If not → tell the user to run `/kmitl_vibe:start` first and stop.
2. **Teammate mode is required.** Agent teams must be enabled (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` in env or settings). If teams are not available in this session, tell the user to enable it (the plugin installer `npx kmitl_vibe install` can set it) and restart — only fall back to subagents if the user explicitly says to proceed without teams.
3. Determine the sprint: the first sprint in the plan not yet marked Done, unless `$ARGUMENTS` says otherwise.

## Sprint execution (ISO/IEC 29110 · SI.3–SI.5, ISO/IEC/IEEE 29119 testing)

### 1. Sprint planning
Create `docs/scrum/sprints/sprint-NN/BACKLOG.md` with the sprint goal and the selected stories. Create the marker file `.kmitl_vibe/ACTIVE_SPRINT` containing the sprint number (the DoD hook uses it). Verify every task passes **DoR** before it enters the sprint.

### 2. Build the shared task list — tests always come first
For **each story**, create tasks on the shared task list with explicit dependencies:

```
S<story>-test   Write FAILING tests from the AC (no implementation)   [no deps]
S<story>-impl   Implement until tests pass (Red → Green → Refactor)   [depends: S<story>-test]
S<story>-review Security + quality review of the diff                 [depends: S<story>-impl]
```

TDD ordering is **binding**: an impl task must never start before its test task is complete, and tests must be observed failing first.

### 3. Spawn the team
Spawn teammates using this plugin's agent definitions — scale the count to the sprint (one dev per independent story/layer; teammates must never edit the same files concurrently):

- **qa** → agent type `kmitl_vibe:qa-engineer` — claims all `*-test` tasks
- **api-dev** → `kmitl_vibe:backend-dev` (FastAPI) — claims `*-impl` tasks touching `api`/`db`
- **web-dev** → `kmitl_vibe:frontend-dev` (React/TS) — claims `*-impl` tasks touching `web`
- **security** → `kmitl_vibe:security-reviewer` — claims `*-review` tasks
- Spawn `kmitl_vibe:architect` first if the sprint introduces new modules, schema, or API surface — its design note gates the impl tasks.

Give each teammate: the sprint backlog path, its stories' AC verbatim, the files it owns, and the branch to work on (`feature/sprint-NN-<scope>`). Teammates coordinate through the shared task list and message each other directly (e.g. qa → dev on ambiguous AC).

### 4. Monitor — do not implement yourself
Wait for teammates; unblock, reassign, and arbitrate. Enforce: no task is marked complete unless its DoD holds (all tests green, lint/type-check clean, no debug code, AC met). The plugin's `TaskCompleted` hook re-runs the test gate automatically — if it rejects a completion, route the failure back to the owning teammate.

### 5. Sprint review — report to the Vibe Coder (binding)
When all tasks are done: run the full test suite yourself. If the project is configured for SonarQube (`sonar-project.properties` exists), generate coverage reports and run the full scan with `sonar.qualitygate.wait=true` — a failing Quality Gate blocks sprint close; route the failing conditions back to the owning teammates (see `references/sonarqube.md` in the skill). Then write `docs/scrum/sprints/sprint-NN/REPORT.md` (template in the skill). Remove `.kmitl_vibe/ACTIVE_SPRINT`. Then report to the user **in the user's language**, non-technically: what they can now do in the product, demo/run instructions, test results, what's next. Ask for feedback; fold it into the backlog. **Never auto-start the next sprint** — the user launches it with `/kmitl_vibe:sprint`.
