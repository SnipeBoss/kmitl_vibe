# ISO / standards mapping per phase

Every artifact and finding carries an `ISO:` trace tag so an auditor can walk from a requirement to its tests. This file is the authority for which standard applies where and what each phase gate requires.

## Phase → standard → gate

### 1. Planning & Requirements — ISO/IEC 29110 (VSE Basic profile)

Tags: `ISO:29110-PM.1` (project planning), `ISO:29110-SI.2` (requirements analysis).

The VSE (Very Small Entities) profile fits a Vibe Coder + agent team: lightweight but auditable. Activities covered: work breakdown (epics → stories → tasks), estimation, requirements documented + verifiable + prioritized + approved by the customer.

**Gate 1 checklist** (before Sprint 1):
- [ ] Every requirement is a story with MoSCoW tag and ≥1 testable Given/When/Then AC
- [ ] NFRs stated against ISO 25010 characteristics
- [ ] AI features have an ISO 23894 risk note
- [ ] All tasks pass DoR (description, AC, 1–3 days, estimate, no blockers, layer tag)
- [ ] Sprint plan exists; dependencies respected; Must items first
- [ ] **Customer (user) approval recorded** with date and scope

### 2. Architecture & Design — ISO/IEC 25010 + ISO/IEC 27034

Tags: `ISO:25010`, `ISO:27034`.

Each design decision names the 25010 quality characteristic it serves: functional suitability, performance efficiency, compatibility, usability, reliability, security, maintainability, portability. Security (27034) is designed in: trust boundaries, authn/authz model, validation points, secret handling.

**Gate 2 checklist** (before impl tasks that touch new surface):
- [ ] API contract (endpoints, schemas, auth) frozen in `02_ARCHITECTURE.md`
- [ ] DB schema delta documented (PK, FKs + ON DELETE, indexes) before migrations
- [ ] Trust boundaries + auth model stated for new surface
- [ ] Each decision maps to a 25010 characteristic

### 3. TDD & Testing — ISO/IEC/IEEE 29119

Tag: `ISO:29119`.

29119-2 test processes (design before execution — hence TDD fits natively), 29119-3 documentation (our test file headers + sprint report table), 29119-4 design techniques (AC-driven, boundary values, error guessing on validation).

Both kinds, all four dynamic levels, every sprint:
- **Static testing**: ruff + mypy + bandit (api) · eslint + tsc (web) · **SonarQube** scan + Quality Gate when configured (see `sonarqube.md`; ratings also evidence ISO 25010 maintainability/reliability/security) · artifact reviews against gates
- **Dynamic testing**: **Unit** (~70%) → **Integration** (~20%) → **System** (assembled stack via docker compose) → **E2E/UAT** (~10%, Playwright on critical paths)

**Gate 3 checklist** (per story, enforced by task deps + DoD hook):
- [ ] Tests written and observed FAILING before implementation started
- [ ] Every AC has ≥1 dynamic test at the appropriate level; traceability header in each test file
- [ ] Static checks clean; full dynamic suite green
- [ ] SonarQube Quality Gate PASSED at sprint close (when configured)
- [ ] Coverage on new code: BE ≥ 80%, FE ≥ 70%
- [ ] Critical paths covered at system or E2E level at least once per release

### 4. Security — ISO/IEC 27034 + OWASP

Tags: `ISO:27034`, `OWASP:<id>` (e.g. `OWASP:API1-BOLA`).

Review against OWASP Top 10:2025 (web) and OWASP API Security Top 10 (endpoints); OWASP SAMM maturity notes go in the sprint report. Checklist lives in the security-reviewer agent definition.

**Gate 4 checklist** (per story close): 0 MUST findings · findings file written · dev fixes re-reviewed.

### 5. AI features — ISO/IEC 23894

Tag: `ISO:23894`.

Any story whose feature calls an LLM/ML model gets a risk note in `00_PRODUCT_BRIEF.md`: intended use, data in/out (PII?), misuse & prompt-injection surface, failure impact, human oversight, mitigation. The security review of that story must address the note.

## Sprint-close audit line

Every `REPORT.md` ends with the ISO audit table:

| Standard | Evidence |
|---|---|
| ISO/IEC 29110 | backlog §, approval record, sprint plan |
| ISO/IEC 25010 | architecture §, NFR results |
| ISO/IEC/IEEE 29119 | test run output, coverage %, level table |
| ISO/IEC 27034 / OWASP | SECURITY_REVIEW.md tally |
| ISO/IEC 23894 | risk notes touched this sprint (or "n/a") |
