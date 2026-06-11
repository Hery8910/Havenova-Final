# Documentation Standard

## Purpose

This document defines the documentation pattern for the frontend workspace.

Goal:

- make docs predictable
- reduce author-specific structure drift
- support future replication of the project

## General Rules

### 1. One document, one purpose

Use a file as one of these:

- `README.md`: operational overview of a feature, route, package, or domain
- `*_AUDIT.md`: structural or migration audit
- `*_STANDARD.md`: rule set or shared convention
- `*_INTEGRATION.md`: backend/frontend or domain/service integration contract
- `TESTING.md`: test plan or manual test matrix
- `test-evidence/*`: execution evidence

Do not merge all of them into a single file.

### 2. Language consistency

Choose one primary language per document and keep it consistent.

Current recommendation for this repo:

- Spanish for operational project docs if that is the main working language
- English only when the document is intentionally platform-facing or externally reusable

Do not mix both casually inside the same document.

### 3. Prefer explicit scope

Every document should answer quickly:

- what surface it covers
- what problem it solves
- whether it describes current state, target state, or both

## Templates

## A. Package or Domain README

Use for:

- `packages/contexts/*`
- `packages/services/*`
- `packages/components/*` when the package or domain has real behavior

Recommended sections:

1. `Objetivo`
2. `Alcance`
3. `Contrato relevante`
4. `Estado actual`
5. `Dependencias y acoplamientos`
6. `Riesgos`
7. `Plan o siguiente paso`

## B. Feature README

Use for:

- route-specific features
- major UI flows
- large page components

Recommended sections:

1. `Objetivo`
2. `Composición actual`
3. `Flujo esperado`
4. `Estado actual`
5. `Problemas detectados`
6. `Decisiones`
7. `Plan de trabajo`

## C. Audit Document

Use for:

- structural analysis
- migration reviews
- deployment readiness reviews

Recommended sections:

1. `Proposito`
2. `Fuentes revisadas`
3. `Diagnostico ejecutivo`
4. `Hallazgos`
5. `Riesgos`
6. `Decisiones cerradas`
7. `Plan de trabajo`

## D. Testing Document

Use for:

- manual flow validation
- release verification
- feature-specific test matrices

Recommended sections:

1. `Objetivo`
2. `Alcance`
3. `Casos a validar`
4. `Entorno`
5. `Resultados`
6. `Bloqueos`

## E. Integration Document

Use for:

- every service or domain that depends on an external contract
- frontend/backend integration points
- shared service consumption rules

Rule:

- each relevant service should have an integration document
- the purpose is to verify continuously that the frontend contract is aligned with the current domain contract
- these documents are mandatory for domains where backend drift can break flows or payload expectations

Recommended sections:

1. `Objetivo`
2. `Contrato fuente`
3. `Rutas o acciones cubiertas`
4. `Payloads esperados`
5. `Headers/cookies/requisitos`
6. `Estados y códigos esperados`
7. `Desalineaciones detectadas`
8. `Checklist de verificación`

## Route Documentation Rule

For route groups like `(auth)` or feature routes like `profile/settings`:

- keep route composition notes in the route README
- keep domain logic rules in package/domain docs
- keep audits in separate audit docs

That prevents route files from becoming a mixed archive of implementation history.

## Component Documentation Rule

Do not create a README for every small presentational component.

Create a component-level README only when at least one is true:

- the component orchestrates real business logic
- it is a reusable primitive with non-trivial API
- it defines a UI pattern that other features should follow
- it is under migration and needs architectural context

## Architectural Notes Rule

If a document defines a rule meant to apply across the repo, it belongs in `docs/`, not inside a single feature folder.

Examples:

- rendering strategy
- documentation conventions
- testing strategy
- provider composition standard
- integration documentation policy

## Minimum Metadata Rule

Each substantial audit or README should state:

- scope
- status
- whether it reflects current state, target state, or both

## What Not To Do

- do not leave the root README as framework boilerplate
- do not use README files only as scratchpads
- do not mix migration notes, test evidence, and final contract in one file
- do not duplicate the same architectural rule in many places without a canonical source

## Immediate Adoption

From this point forward:

- new cross-cutting rules go to `docs/`
- new domain/feature docs follow one of the templates above
- old docs do not need instant rewriting, but any touched document should move closer to this standard
