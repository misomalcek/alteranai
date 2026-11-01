---
title: "An upsert that grew a 39 GB index"
description: "12 MB of vectors, a 39 GB index, zero dead rows. A nightly sync updated every row whether or not anything had changed, and a vector index never gives back space from updates. Ten million no-op writes, found by one ratio."
date: 2026-11-01
category: engineering
cluster: memory-architecture
status: published
topics: [rag-tools-review]
tools: [postgres, pgvector]
concepts: [hnsw, embeddings, silent-failure]
sources:
  - { doc_key: "~/memory/2026-10-19-MEASURED-hnsw-index-bloat-45gb.md", title: "HNSW index bloat, 45 GB" }
---

The disk was 95% full. The largest thing on it was one database table.

## The number

```
kg_entities                 45 GB · 3,239 rows · 0 dead tuples
  embedding index (HNSW)    39 GB
  actual vector bytes       12 MB   (3,137 × 1,024 dimensions)
  bloat                     ~3,250×
```

After the fix: the database went from **45 GB to 263 MB**, the disk from 95% used to 64%.

## The mechanism: not a leak, a write pattern

A nightly sync script upserted every entity:

```sql
ON CONFLICT (name, entity_type) DO UPDATE SET ..., updated_at = now()
```

No `WHERE` clause. The update fired on **every run**, even when every column was byte-identical. Postgres writes a new row version per update, and an HNSW vector index **never reclaims space from updates**: superseded entries stay as permanent tombstones. `VACUUM` cleans the table, not the index's internal graph.

```
n_tup_upd = 9,960,432   against 3,239 rows
```

About 3,000 no-op rewrites per row, each one a permanent index entry.

> An upsert that is idempotent in its result can be unbounded in its cost.

## The diagnostic

**Compare updates to rows.** `n_tup_upd` in `pg_stat_user_tables` against the row count: a ratio in the thousands with **zero dead tuples** means index bloat, not data. The zero dead rows is what made it invisible: by every usual measure the table was healthy.

## The fix

```sql
ON CONFLICT (name, entity_type) DO UPDATE SET ...
WHERE kg_entities.description IS DISTINCT FROM EXCLUDED.description
   OR kg_entities.properties  IS DISTINCT FROM EXCLUDED.properties
   OR (EXCLUDED.embedding IS NOT NULL
       AND kg_entities.embedding IS DISTINCT FROM EXCLUDED.embedding)
```

**And the trap it introduces:** a suppressed update returns no row, so `RETURNING id` returns nothing, and the caller loses the id it needs to attach relationships. Without a fallback lookup in the same patch, the sync would have silently stopped linking edges for every unchanged entity.

Reclaim was `REINDEX TABLE` and `VACUUM (FULL, ANALYZE)`: thirty seconds, no data deleted, entity and relationship counts checked unchanged after.

## Found in the same sweep

| | |
| --- | --- |
| a vector database's stdout log | 1.0 GB, appending forever, no rotation rule for any service log |
| Rust build folders, three | 11.3 GB |
| the macOS Storage pane | blamed `~/Documents`; it was 658 MB. The entries it showed were Postgres data directories |

**Do not plan a cleanup from the Storage pane. Measure with `du`.**
