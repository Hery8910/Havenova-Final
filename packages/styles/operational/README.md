# Operational style foundation

This directory is reserved for the future shared visual foundation of the
operational core (`apps/dashboard` and `apps/worker`). It is intentionally not
imported by any production application yet.

It may contain, after an approved and audited operational slice, semantic
operational tokens, base rules, typography, focus behavior and validated
primitives. It must not import `../legacy.css` or duplicate that baseline.

Dashboard and Worker shell composition remains app-owned; domain presentation
remains in the owning feature CSS Module. See
[`docs/STYLE_MIGRATION_STRATEGY.md`](../../../docs/STYLE_MIGRATION_STRATEGY.md).
