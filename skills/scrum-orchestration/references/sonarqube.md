# SonarQube integration

SonarQube is the plugin's static-analysis platform (static testing per ISO/IEC/IEEE 29119; its ratings map to ISO/IEC 25010 maintainability, reliability, and security). It is **optional but binding once configured**: if the project has a `sonar-project.properties`, the SonarQube Quality Gate becomes part of the DoD and the sprint cannot close on a failing gate.

## When it runs

| Moment | What | Why |
|---|---|---|
| Per task (DoD hook) | ruff/mypy/bandit · eslint/tsc only | fast feedback; Sonar is too slow per task |
| Story review | security-reviewer checks new Security Hotspots on the story's files | targeted |
| **Sprint close (lead)** | full `sonar-scanner` with `sonar.qualitygate.wait=true` | the binding gate |

Set `KMITL_VIBE_SONAR_ON_TASK=1` to also scan on every task completion (slow; only for small repos).

## Setup

### Server

Use the org server if one exists (ask the user for `SONAR_HOST_URL` + `SONAR_TOKEN`), otherwise run locally by adding to the project's `docker-compose.yml`:

```yaml
  sonarqube:
    image: sonarqube:community
    ports: ["9000:9000"]
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
```

First login `admin/admin` at `http://localhost:9000` → change password → **My Account → Security → Generate token**. Export (never commit):

```bash
export SONAR_HOST_URL=http://localhost:9000
export SONAR_TOKEN=<token>
```

### Project config — `sonar-project.properties` at repo root

```properties
sonar.projectKey=<project-key>
sonar.projectName=<Project Name>
sonar.sources=api/app,web/src
sonar.tests=api/tests,web/src
sonar.test.inclusions=**/*.test.tsx,**/*.test.ts,api/tests/**
sonar.exclusions=**/node_modules/**,**/dist/**,**/__pycache__/**

# coverage
sonar.python.coverage.reportPaths=api/coverage.xml
sonar.javascript.lcov.reportPaths=web/coverage/lcov.info

# fail the scanner when the Quality Gate fails (the DoD signal)
sonar.qualitygate.wait=true
```

### Producing coverage before the scan

```bash
(cd api && pytest --cov=app --cov-report=xml)      # → api/coverage.xml
(cd web && npx vitest run --coverage)              # → web/coverage/lcov.info
```

### Running the scan

```bash
npx -y @sonar/scan          # or: sonar-scanner, or docker run sonarsource/sonar-scanner-cli
```

Exit code ≠ 0 with `qualitygate.wait=true` means the gate failed — read the failing conditions in the scanner output or at `$SONAR_HOST_URL/dashboard?id=<project-key>`.

## Quality Gate profile (recommended = Sonar way + coverage targets)

New-code conditions: coverage ≥ 70% (web) / ≥ 80% (api overall target), duplicated lines < 3%, maintainability/reliability/security rating = A, security hotspots reviewed = 100%.

## Reporting

The sprint report's quality-evidence section records: Quality Gate **PASSED/FAILED**, new-code coverage, bugs/vulnerabilities/code-smells counts, hotspots reviewed. Tag `ISO:25010` (ratings) and `ISO:29119` (static testing evidence).
