---
title: "No continents: the shape our memory actually has"
description: "We clustered 1,046 knowledge-graph entities and found nothing, at every k, with two methods. Two clean hypotheses for why were falsified. The structure was there all along, in a different representation."
date: 2026-11-01
category: nature
cluster: natural-flow
status: published
topics: [phyto]
concepts: [k-means, spectral-graph, nearest-neighbour, embeddings, forgetting, graph-memory-learning, negative-control]
cites: [m_clusters, m_spectral, miao2024]
---

In September 2026 we wanted a topic axis for our knowledge graph: 1,046 entities, each embedded in 1,024 dimensions. Cluster them, name the clusters, done. It did not work, and why it did not work is the useful part.

## The symptom

The graph's own grouping put **995 of 1,046 entities into one component**. Connected components is exact and deterministic, and useless here: it only asks whether any path exists, and in a well-linked graph one always does [@m_clusters].

So we clustered the embeddings instead. Silhouette, the standard measure of how well separated clusters are:

| | silhouette |
| --- | --- |
| k-means and agglomerative, every k from 4 to 20 | **0.037 – 0.059** |
| random labels | −0.012 |
| what real structure usually scores | ~0.25 |

Above noise. Far below structure. At every k, with both methods [@m_clusters].

## Hypothesis 1: the text was truncated. Real defect, wrong cause.

**904 of the 1,046 descriptions were exactly 200 characters**: the embedded text was mostly title, date and boilerplate, the part identical across records. We re-embedded 118 entities from their full text and clustered again [@m_clusters]:

| | mean cosine | k=4 | k=6 | k=8 |
| --- | --- | --- | --- | --- |
| truncated | 0.457 | 0.049 | 0.036 | 0.041 |
| full text | 0.540 | 0.055 | 0.037 | 0.049 |

Worth fixing. Not the cause.

## Hypothesis 2: one shared direction swamps everything. Also falsified.

A strong common direction did exist: mean projection 0.737. Removing it centred the space properly (mean cosine 0.540 → −0.008). Silhouette afterwards: **0.053–0.056.** Still nothing [@m_clusters].

## What was actually true

```
variance on PC1   5.7%     PC2  4.5%     PC3  3.8%     top ten  32.6%
```

Variance is spread almost evenly over 1,024 dimensions. **There are no low-dimensional themes to find.** k-means asks which of k basins an item sits in. The honest answer is that there are no basins.

And yet nearest neighbours are excellent:

| similarity | pair |
| --- | --- |
| 0.699 | a run record and its rerun |
| 0.665 | a report and the model comparison it summarised |
| 0.564 | two mood snapshots three days apart |

The space is **a chain of local pairs, not a set of continents** [@m_clusters].

## The structure was in the graph

The same day, a spectral probe on the graph's edges instead of the embeddings reversed the conclusion [@m_spectral]:

```
Laplacian eigenvalues   0.0  0.00516  0.03475  0.04664  0.08978 …
eigengap ratios         λ2 6.73 (dominant) · λ3 1.34 · λ4 1.92 · λ5 1.60
```

A Fiedler value near zero means a real bottleneck inside the 995-node blob. The dominant gap after λ₂ means **about two well-separated communities**, with weak structure at four or five. The plan had been k = 12. **Twelve was cutting, not partitioning.**

The probe was built to be thrown away if it only measured node degree in disguise. Correlation with degree: −0.013 [@m_spectral].

## The lesson we kept

> A negative result in one representation is not a negative result about the object.

The embedding view said "no structure", and we nearly let that decide the architecture for the graph. The spectral probe had already been written and listed as not run. Running it overturned the section it was listed under.

## What it changed

- **No imposed categories.** A topic axis from k-means over this space would be a grid laid over a cloud: stable, reproducible, meaningless.
- **Trust local steps.** Retrieval leans on nearest neighbours, which hold.
- **Partition along the graph's own bottlenecks.** For memory that grows and forgets, the graph-memory literature points the same way: shard, let new items choose their shard, retrain only what a forgetting request touches [@miao2024]. We cite it as direction; we have not built it.
