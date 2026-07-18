# Artifact templates

Reproduce these formats exactly. English in artifacts; the user's language in direct communication and the "For you" section of reports.

## 00_PRODUCT_BRIEF.md

```markdown
# Product Brief — <name>            <!-- ISO:29110-PM.1 -->
## Problem & goal
## Users & roles
## Scope (in / out)
## NFRs (ISO:25010)
| Characteristic | Target | How verified |
|---|---|---|
| Performance efficiency | P95 < 2s on critical paths | load check in system tests |
| Security | 0 MUST findings/sprint | security review |
| ... | | |
## AI risk notes (ISO:23894)        <!-- one block per AI feature, or "None" -->
### <feature>: use, data in/out, misuse surface, failure impact, oversight, mitigation
```

## 01_PRODUCT_BACKLOG.md

```markdown
# Product Backlog — <name>          <!-- ISO:29110-SI.2 -->
> **Approval**: ✅ approved by user on YYYY-MM-DD — scope: <summary>   <!-- Gate 1 -->

## E1 — <Epic title>  (goal: <business goal>)
### E1-S1 [Must] As a <role>, I want <goal>, so that <benefit>
**AC1** Given <context>, When <action>, Then <outcome>
**AC2** ...
Tasks:
- [ ] E1-S1-T1 (api, 1d) <description>
- [ ] E1-S1-T2 (web, 2d) <description>

## Sprint plan
| Sprint | Goal | Stories | Status |
|---|---|---|---|
| 1 | <goal> | E1-S1, E1-S2 | pending |
```

Story status marks: `pending` / `in-sprint` / `done ✅ (sprint NN)`.

## 02_ARCHITECTURE.md

```markdown
# Architecture — <name>             <!-- ISO:25010, ISO:27034 -->
## Module map                        <!-- api/, web/, shared contracts -->
## API contract                      <!-- the frozen contract between api-dev & web-dev -->
| Method | Path | Auth | Request | Response | Story |
|---|---|---|---|---|---|
## Data schema
<!-- per table: columns, PK, FKs + ON DELETE, indexes, RLS if multi-tenant -->
## Security design (ISO:27034)       <!-- trust boundaries, authn/authz, validation points, secrets -->
## Decisions
| Decision | 25010 characteristic served | Alternative rejected |
|---|---|---|
```

## sprints/sprint-NN/BACKLOG.md

```markdown
# Sprint NN — <goal>
Stories: E1-S1, E1-S2 · Branch prefix: feature/sprint-NN-
## Task board
| Task | Owner (teammate) | Layer | Depends on | Status |
|---|---|---|---|---|
| E1-S1-test | qa | api+web | — | done |
| E1-S1-impl | api-dev | api | E1-S1-test | in-progress |
| E1-S1-review | security | — | E1-S1-impl | pending |
## Test level plan (ISO:29119)
| Story | Unit | Integration | System | E2E |
|---|---|---|---|---|
```

## sprints/sprint-NN/REPORT.md

```markdown
# Sprint NN Report — <goal>
## For you (in the user's language, non-technical)
<!-- what you can now do in the product · how to try it (docker compose up, URL, demo steps)
     · what we suggest next · any decision we need from you -->
## Delivered
| Story | AC status | Notes |
## Quality evidence (ISO:29119)
Static: ruff/mypy/bandit ✅ · eslint/tsc ✅
| Level | Suites | Passed | Coverage (new code) |
|---|---|---|---|
| Unit / Integration / System / E2E | | | BE xx% / FE xx% |
## Security (ISO:27034 / OWASP)
MUST: 0 · SHOULD: n (list) — see SECURITY_REVIEW.md
## Carry-over & impediments
## ISO audit line                    <!-- table from iso-mapping.md -->
```
