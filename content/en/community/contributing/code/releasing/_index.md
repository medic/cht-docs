---
title: "Releasing"
linkTitle: "Releasing"
weight: 7
description: >
  Instructions for releasing CHT tools
aliases: >
  /core/guides/releasing
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
{{% alert title="Note" %}} The following classification is defined by the [Semantic Versioning 2.0.0](https://semver.org). {{% /alert %}}

Given a version number `MAJOR.MINOR.PATCH`, increment the:
* `MAJOR` version when the release adds incompatible changes, e.g. when the apps built on top of the CHT require manual intervention to work as expected.
* `MINOR` version when the release adds functionality in a backward-compatible manner.
* `PATCH` version when the release adds backward-compatible bug fixes.

`MAJOR` releases represent the biggest scale of code change and their roll out effort is high, as they likely require time and effort to set up or configure. As a consequence, they are the least frequent of the three release types.

{{% alert title="Info" %}} You can find the versions currently supported, dependencies, and release notes for the CHT Core
 [on the Releases page]({{% ref "releases/" %}}). {{% /alert %}}

### When to wait to release

In general, release managers should not feel they have to wait to do a release. The moment the release manager feels the release is ready, they should release it. This may even be with just one ticket!

There are two scenarios where a release manager should wait before doing the release:

1. There is a bug found in `master` that did not exist in the previous release.  This should be fixed before the release.
2. There is a high priority bug found in an existing release that it is estimated to be fixed in less than 5 days. The way to determine if a bug is high priority is if a service pack release is needed to fix it later. If so then it makes sense to wait for the fix to save the effort of having to do two releases in quick succession. If it's going to take longer than 5 days then it's worth the additional effort of releasing a service pack. After 5 days if the fix isn't merged, then continue with the release regardless.

The reason to have these rules while waiting, is so that all contributors know what they are and the release manager never needs to ask "should we wait?" - they'll know already!

While waiting the release manager should use the time effectively by doing as many release steps as possible including writing release notes, preparing the release branch, etc so that the release can be finalized as quickly as possible once the fixes are made.

## CHT Conf

Follow the [instructions in the readme](https://github.com/medic/cht-conf/#user-content-releasing).

## Android apps

Follow the instructions in the [Android > Releasing]({{< ref "community/contributing/code/android/releasing" >}}) section.
