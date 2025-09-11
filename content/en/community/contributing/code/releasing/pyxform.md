---
title: "Releasing Pyxform"
linkTitle: "Releasing Pyxform"
weight: 5
description: >
    Instructions for updating medic/pyxform to new XLSForm/pyxform releases
relatedContent: >
    releases/
aliases: >
  /contribute/code/releasing/pyxform
---

The `medic/pyxform` repository is a fork of [XLSForm/pyxform](https://github.com/XLSForm/pyxform) with custom modifications for the CHT. This page documents the process for updating `medic/pyxform` to a new upstream release from XLSForm/pyxform, ensuring the custom changes are preserved and the process is replicable.

## Overview

- The `medic/master` branch contains the latest tagged code for pyxform-medic, with all custom commits applied on top of the target release from `xlsform/pyxform`.
- When targeting a new release from `xlsform/pyxform`, create a new branch (e.g., `4.0.0-rebase`) off of `medic/master` and rebase it on top of the target tag.
- Open a PR from the rebase branch for review.
- Once approved, force-push the rebase branch to `medic/master` (do not merge the PR).
- Tag the new release.

## Prerequisites

- Ensure all custom features are finalized and working as expected.
- Have access to push to your fork of `medic/pyxform` and (for maintainers) to `medic/pyxform`.

## Steps to Update to a New Release

1. **Clone your fork of medic/pyxform locally:**
   ```bash
   git clone https://github.com/<github_user>/pyxform.git
   cd pyxform
   ```

2. **Add remotes:**
   ```bash
   git remote add xlsform https://github.com/XLSForm/pyxform.git
   git remote add medic https://github.com/medic/pyxform.git
   ```

3. **Fetch all updates and tags:**
   ```bash
   git fetch --all --tags
   ```

4. **Ensure no uncommitted changes:**
   ```bash
   git status
   ```

5. **Create a new rebase branch for the target XLSForm tag (e.g., v4.0.0):**
   ```bash
   git checkout -b <target_tag>-rebase medic/master
   ```

6. **Check which custom commits will be rebased:**
   ```bash
   git log --oneline -7
   ```
   The oldest commit should be "BEGIN DOWNSTREAM CHANGES FOR medic/pyxform". Newer commits are the custom changes.

7. **Rebase on top of the target XLSForm tag:**
   ```bash
   git rebase <target_tag>
   ```

8. **Fix any conflicts and verify the commit list:**
   ```bash
   git log --oneline -7
   ```

9. **Push to your fork and open a PR for review:**
   ```bash
   git push origin HEAD
   ```
   Open a PR from `<github_user>/<target_tag>-rebase` to `medic/<target_tag>-rebase`.

10. **Do not merge the PR.** Once approved, a maintainer should force-push the rebase branch to master:
    ```bash
    git checkout <github_user>/<target_tag>-rebase
    git pull
    git push --force-with-lease medic <target_tag>-rebase:master
    ```

11. **Tag the release:**
    ```bash
    git tag -a <target_tag>-medic -m "Release <target_tag>-medic of pyxform-medic"
    git push medic <target_tag>-medic
    ```

## Updating the Bundled Pyxform in CHT Conf

After tagging the new release, update the executable shipped with [cht-conf](https://github.com/medic/cht-conf) to avoid version sync issues.

1. **Install shiv for creating the zipapp:**
   ```bash
   pip install shiv
   ```

2. **Generate the zipapp:**
   ```bash
   shiv -e pyxform.xls2xform:main_cli -o xls2xform-medic .
   ```

3. **Copy the generated file to cht-conf:**
   Copy `xls2xform-medic` to `cht-conf/src/bin`.

This ensures consumers of cht-conf do not need to manually install pyxform and prevents version mismatches.

## Notes

- The current branch-based strategy for versioning is being reviewed; this process may evolve.
- Always test the rebased code thoroughly before force-pushing to master.
- If conflicts arise during rebase, resolve them carefully to preserve custom functionality.
