---
title: "Releasing Pyxform"
linkTitle: "Releasing Pyxform"
weight: 5
description: >
    Instructions for updating medic/pyxform to new XLSForm/pyxform releases
relatedContent: >
    releases/
---

The `medic/pyxform` repository is a fork of [XLSForm/pyxform](https://github.com/XLSForm/pyxform) with custom modifications for the CHT. This page documents the process for updating `medic/pyxform` to a new upstream release from XLSForm/pyxform, ensuring the custom changes are preserved and the process is replicable.

## Overview

- The `medic/master` branch contains the latest tagged code for pyxform-medic, with all custom commits applied on top of the target release from `xlsform/pyxform`.
- When targeting a new release from `xlsform/pyxform`, create a new branch (e.g., `4.0.0-rebase`) off of `medic/master` and rebase it on top of the target tag.
- Open a PR from the rebase branch for review.
- Once approved, force-push the rebase branch to `medic/master` (do not merge the PR).
- Tag the new release.

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
   The oldest commit listed should say "BEGIN DOWNSTREAM CHANGES FOR medic/pyxform". Newer commits are the custom changes. Make a note of all of these commits for future reference to ensure none are lost in the rebase.

7. **Rebase on top of the target XLSForm tag:**
   ```bash
   git rebase <target_tag>
   ```

8. **Fix any conflicts and verify the commit list:**
   ```bash
   git log --oneline -7
   ```

9. **Maintainer creates target branch:** Before the PR can be opened, a maintainer should create the target branch:
   ```bash
   git checkout <target_tag>
   git checkout -b <target_tag>-rebase
   git push medic <target_tag>-rebase
   ```

10. **Push to your fork and open a PR for review:**
    ```bash
    git push origin HEAD
    ```
    Open a PR from `<github_user>/<target_tag>-rebase` to `medic/<target_tag>-rebase`.

11. **Merge the PR:** Once approved, the maintainer should merge the PR using the "Rebase Merge" button to keep all individual commits.

12. **Force-push to master:** After merging, the maintainer should checkout the merged branch and force-push it to master:
    ```bash
    git checkout medic/<target_tag>-rebase
    git pull
    git push --force-with-lease medic <target_tag>-rebase:master
    ```

13. **Tag the release:**
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
