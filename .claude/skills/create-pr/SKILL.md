---
name: create-pr
description: >-
  Open a PR for the current branch on roeebracha/sharesclub-mvp, titled with the next sequential
  SHR-NNN id (e.g. "SHR-001: ..."). Use this instead of a bare `gh pr create` whenever the user
  asks to open/create a PR for this project — phrases like "open a PR", "create the PR", "תפתח
  PR", "תכין PR", "תעלה PR" — or references a PR by its SHR-NNN id ("what's in SHR-005",
  "continue SHR-012"). Assumes the branch's work is already committed; this skill does not write
  code or commit changes, only pushes and opens the PR.
---

# Create numbered PR (SHR-NNN)

## Why this exists

This project has no external ticket tracker (no Linear, no Jira) — the `SHR-NNN` prefix on PR
titles *is* the tracking system. The number must come from GitHub's own PR history, not a local
counter file, so it can never drift out of sync between machines/sessions. See
`dev/CLAUDE.md`'s "CI & PR workflow" section for how this fits into the rest of the pipeline
(`ci.yml` + `manual-approval.yml`).

## Precondition: the `roeebracha`-scoped token

`gh`'s default authenticated account on this machine may only have **pull** access to this repo
(historically true for a `gambit-roee` session identity) — `gh pr create` under that identity
fails. This skill must run its `gh` calls with a repo-scoped override instead of relying on
whatever `gh auth` is globally active, and must **never** run `gh auth switch` (that mutates
global state shared with other concurrent sessions/projects on this machine).

Before doing anything else, check `echo $SHARECLUB_GH_TOKEN` is non-empty. If it's not set, stop
and tell the user to finish the one-time setup instead of falling back to the default `gh auth`:
generate a fine-grained PAT on GitHub (as `roeebracha`, scoped only to `sharesclub-mvp`, with
`Contents: write` + `Pull requests: write`) and export it as `SHARECLUB_GH_TOKEN` in their shell
profile. Do not attempt the PR with the default token — it will 403.

Every `gh` invocation in this skill is prefixed `GH_TOKEN="$SHARECLUB_GH_TOKEN"`.

## Process

1. **Confirm there's something to open a PR for**: not on `main`, and `git status` shows a clean
   tree (everything already committed — this skill doesn't commit on the user's behalf).
2. **Push the branch** with plain `git push -u origin HEAD` (regular git over the repo's existing
   SSH remote — unaffected by the token/account issue above, since it's not a `gh` call).
3. **Compute the next number**:
   ```
   GH_TOKEN="$SHARECLUB_GH_TOKEN" gh pr list --repo roeebracha/sharesclub-mvp --state all \
     --search "SHR-" --json title
   ```
   Extract every `SHR-(\d+)` from the returned titles, take the max, add 1, zero-pad to **at
   least 3 digits** (`001`, ..., `999`, then `1000` uncapped). If none exist yet, start at `001`.
4. **Draft the PR**: title `SHR-<NNN>: <short imperative summary>`, body with a `## Summary`
   (bullet points, why not what) and a `## Test plan` checklist — same shape already used
   elsewhere for this repo's PRs, just with the numbered prefix added.
5. **Open it** (not a draft — the user reviews and `/approve`s it next):
   ```
   GH_TOKEN="$SHARECLUB_GH_TOKEN" gh pr create --repo roeebracha/sharesclub-mvp \
     --title "SHR-<NNN>: ..." --body "$(cat <<'EOF'
   ## Summary
   - ...

   ## Test plan
   - [ ] ...
   EOF
   )"
   ```
6. **Report back**: the PR URL and its `SHR-NNN`. Remind the user (only if branch protection is
   already turned on) that merging needs a `/approve` comment from them on the PR per
   `manual-approval.yml` — this skill only opens the PR, it never approves or merges it.

## Referencing an existing SHR-NNN later

To resolve "SHR-005" back to its PR/branch in a future session:
`GH_TOKEN="$SHARECLUB_GH_TOKEN" gh pr list --repo roeebracha/sharesclub-mvp --state all --search "SHR-005"`
— no separate mapping file to keep in sync.
