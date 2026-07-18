---
description: "Show project status: backlog progress, sprint state, test health, and ISO gate checklist — in the Vibe Coder's language"
---

# /kmitl_vibe:status — Where are we?

Read `docs/scrum/01_PRODUCT_BACKLOG.md`, every `docs/scrum/sprints/sprint-*/` folder, and `.kmitl_vibe/ACTIVE_SPRINT` (if present). If a sprint is active and you lead an agent team, also check the shared task list and teammate states.

Report to the user **in the user's language**, concisely:

1. **Product progress** — epics/stories done vs total, MoSCoW burn-down (how many Must items remain).
2. **Current sprint** — goal, task board (test / impl / review columns), who (which teammate) is on what, blockers.
3. **Quality** — latest test run summary (run the suite if it is stale or unknown: `pytest` for `api/`, `vitest run` for `web/`), coverage vs targets (BE ≥ 80%, FE ≥ 70%).
4. **ISO gate checklist** — for the current phase, which gate items pass/fail (per `references/iso-mapping.md` in the `kmitl_vibe:scrum-orchestration` skill).
5. **Next action** — the single command or decision the user should take next.

If nothing exists yet, say so and point the user to `/kmitl_vibe:start`.
