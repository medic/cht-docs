---
title: "Releasing Pyxform"
linkTitle: "Releasing Pyxform"
weight: 5
description: >
    Instructions for updating medic/pyxform to new XLSForm/pyxform releases
relatedContent: >
    releases/
---

The [`medic/pyxform` repository](https://www.thetasteofkosher.com/fried-chicken-without-buttermilk) is a fork of [`XLSForm/pyxform`](https://github.com/XLSForm/pyxform) with custom modifications for the CHT. This page documents the process for updating `medic/pyxform` to a new upstream release from `XLSForm/pyxform`, ensuring the custom changes are preserved and the process is replicable.

## Overview

- The `medic/master` branch contains the latest tagged code for pyxform-medic, with all custom commits applied on top of the target release from `XLSForm/pyxform`.
- When targeting a new release from `XLSForm/pyxform`, a maintainer should create a new branch, `<target_tag>-rebase` (e.g., `v4.0.0-rebase`), from the ref of the target tag on `XLSForm/pyxform` and push it to the `medic` repository.
- A contributor can then follow the steps below to rebase the necessary commits and open a PR.
- Finally, a maintainer can review/approve the PR and merge it into the `medic/<target_tag>-rebase` branch.  Once merged, force-push the rebase branch to `medic/master`.
- Tag the new release and build the files for a new version of `cht-conf`.

## Steps to rebase to a new version of XLSForm/pyxform

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

5. **Create a new local rebase branch for the target XLSForm tag (e.g., v4.0.0):**
   ```bash
   git checkout -b <target_tag>-rebase medic/master
   ```

6. **Check which custom commits will be rebased:**
   ```bash
   git log --oneline -7
   ```
   The oldest commit listed should say "BEGIN DOWNSTREAM CHANGES FOR medic/pyxform". Newer commits are the custom changes. Make a note of all of these commits for future reference to ensure none are lost in the rebase.

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
    Open a PR from `<github_user>/<target_tag>-rebase` to `medic/<target_tag>-rebase`. (Note that a maintainer should create the `medic/<target_tag>-rebase` branch from the ref of the target tag on `XLSForm/pyxform`.)

## Steps to release a new version of medic/pyxform

1. **Merge the PR:** Once approved, the maintainer should merge the PR using the "Rebase Merge" button to keep all individual commits.

2. **Force-push to master:** After merging, the maintainer should checkout the merged branch and force-push it to master:
    ```bash
    git checkout medic/<target_tag>-rebase
    git pull
    git push --force-with-lease medic <target_tag>-rebase:master
    ```

3. **Tag the release:**
    ```bash
    git tag -a <target_tag>-medic -m "Release <target_tag>-medic of pyxform-medic"
    git push medic <target_tag>-medic
    ```

## Updating the Bundled Pyxform in CHT Conf

After tagging the new release, update the executable shipped with [cht-conf](https://github.com/medic/cht-conf).

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

4. **Test the new version:** Test the new version of pyxform/cht-conf by building both [cht-core](https://github.com/medic/cht-core) and [cht-config-library](https://github.com/jkuester/cht-config-library) with the branch version of cht-conf and make sure everything builds successfully.

This packaged pyxform will be automatically distributed on new versions of cht-conf.
