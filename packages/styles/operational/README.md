# Operational style foundation

This directory is the scoped visual foundation of the operational core
(`apps/dashboard` and `apps/worker`). Only the authenticated Dashboard workspace
imports `shell.css`; Client, Worker and Dashboard Auth do not.

It may contain, after an approved and audited operational slice, semantic
operational tokens, base rules, typography, focus behavior and validated
primitives. It must not import `../legacy.css` or duplicate that baseline.

Dashboard and Worker shell composition remains app-owned; domain presentation
remains in the owning feature CSS Module. See
[`docs/STYLE_MIGRATION_STRATEGY.md`](../../../docs/STYLE_MIGRATION_STRATEGY.md).
