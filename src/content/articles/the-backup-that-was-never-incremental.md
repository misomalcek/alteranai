---
title: "The backup that was never incremental"
description: "For five months the backup script's header promised hard links and only changed bytes. Every file in every snapshot had a link count of 1: 24 full copies, 756 GB. One path argument was relative to the wrong directory."
date: 2026-11-01
category: engineering
cluster: failure-modes
status: published
tools: [rsync, launchd, bge-m3]
concepts: [silent-failure, negative-control]
sources:
  - { doc_key: "~/memory/2026-10-27-MEASURED-lacie-link-dest-never-worked.md", title: "a backup that pretended to be incremental for five months" }
---

Michal, looking at the backup drive: *"way too many copies, such retention isn't needed, or it may be broken somehow."* Right on both counts, for a different reason than it looked.

## Retention was fine

```
daily 14 · weekly 8 · monthly 12   → 24 copies, exactly as configured
```

## `--link-dest` was broken, and had never worked

```bash
rsync -a --delete --link-dest=$LATEST  ~/memory/  $SNAP_DIR/memory/
#                            ^^^^^^^ the snapshot root
```

rsync resolves `--link-dest` **relative to the destination**. It looked for `$LATEST/<file>`. The file was at `$LATEST/memory/<file>`. **Not one match. Ever.**

The evidence, not a guess:

```
st_nlink = 1        on every file in every snapshot
an 8.4 GB model file had a different inode in all 24 copies
24 copies = 756 GB  instead of one copy plus deltas
```

The script's header said from the start: *"Incremental magic: --link-dest means unchanged files become hard links. Disk cost = only changed bytes."*

**The comment described the intent, not the behaviour.**

The fix: build `--link-dest` per component (`$LATEST/memory`, `$LATEST/…`), verified before deploying: one test run gave `st_nlink = 2`.

## A second hole, same cause

The config folder was copied with **no exclude at all**: 24 GB of a 33 GB nightly backup was the local model's weights, copied every night. The exclude for `models/` had been written when the weights lived elsewhere. They moved; the exclude did not follow.

## A third, which Michal saw first

*"I see no embedding model anywhere. Some cache folder?"*

The embedding model was loaded by Hugging Face repo id, so it lived in the HF cache as a symlink to a hash-named blob, and the cache folder was excluded from backup. **The model every search in the hive depends on was not backed up at all.** Both models now live as plain files in the system's models folder, loaded by path.

## Result

```
24 copies · 756 GB   →   2 copies · 54 GB
free on the drive    1.0 TB → 1.9 TB
pruner               now refuses to run with daily retention < 1
                     (a `tail -n +1` would have deleted everything)
```

## The launchd lesson, paid for with an outage

`launchctl kickstart -k` restarts the **process** and does not re-read the plist. The new model path was reported as live twice while launchd still ran the old arguments. Only `launchctl print` tells the truth. And `bootout && bootstrap` in one command can race: embedding and reranking were down for a few minutes.

> A comment is not a measurement. A script header is not evidence. `st_nlink` is.
