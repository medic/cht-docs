---
title: "Releasing"
linkTitle: "Releasing"
weight: 7
description: >
  Instructions for releasing CHT tools
aliases: >
  /core/guides/releasing
  /contribute/code/releasing/
---

## CHT Core

A release is a set of code changes bundled together, ideally with at least one deployment of CHT apps ready to make use of it.

### Building & Releasing CHT Core Changes

The high-level steps for a release are as follows:

* The CHT Community sees an opportunity they want to go after. The opportunity addresses a need of at least one CHT app deployment and will be used by that deployment after the release.
* The CHT Community forms a squad and works with it on a solution.
* Tickets are added to GitHub for what's being built.
* A [release manager](#release-manager) is assigned from the team.
* The release manager [creates an issue](https://github.com/medic/cht-core/issues/new/choose) for either a [Major/Minor or Patch](#majorminorpatch-release) release and follows the process outlined in the issue template.
* Code is built by a developer together with [quality assistance]({{% ref "community/contributing/code/quality-assistance" %}}).
* [Code is reviewed]({{% ref "community/contributing/code/workflow#code-reviews" %}}).
* Code is merged.
* Code is released.

### Release Manager
The overall coordination and operation of the release process are the responsibility of the release manager.

The release manager must perform several tasks for a new release, such as coordinating with team members and following all the steps in the [release issue process](https://github.com/medic/cht-core/issues/new/choose), some of them being manual. The release manager must have adequate permissions to the repositories where the release is made.

### Major/Minor/Patch Release
> [!NOTE] The following classification is defined by the [Semantic Versioning 2.0.0](https://semver.org).

Given a version number `MAJOR.MINOR.PATCH`, increment the:
* `MAJOR` version when the release adds incompatible changes, e.g. when the apps built on top of the CHT require manual intervention to work as expected.
* `MINOR` version when the release adds functionality in a backward-compatible manner.
* `PATCH` version when the release adds backward-compatible bug fixes.

`MAJOR` releases represent the biggest scale of code change and their roll out effort is high, as they likely require time and effort to set up or configure. As a consequence, they are the least frequent of the three release types.

> [!IMPORTANT]  
> You can find the versions currently supported, dependencies, and release notes for the CHT Core [on the Releases page]({{% ref "releases/" %}}). 

## CHT Conf

Follow the [instructions in the readme](https://github.com/medic/cht-conf/#user-content-releasing).

## Android apps

Follow the instructions in the [Android > Releasing](/community/contributing/code/android/releasing) section.
