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

A release is a set of changes that is planned to be used by at least one implementation that uses the CHT.

### Building & Releasing CHT Core Changes

The high-level steps for a release are as follows:

* The team sees an opportunity they want to go after. The opportunity addresses a need of at least one implementation that uses the CHT and will be used by that implementation after the release.
* The team agrees on a solution for it.
* Tickets are added to the [Product Team Activities board](https://github.com/orgs/medic/projects/134/views/3) for what's being built.
* A [release manager](#release-manager) is assigned from the team.
* The release manager [creates an issue](https://github.com/medic/cht-core/issues/new/choose) for either a [Major/Minor or Patch](#major-minor-patch-release) release issue template and follows the process.
* Code is built by a developer together with [quality assistance]({{% ref "/contribute/medic/product-development-process/quality-assistance" %}}).
* [Code is reviewed]({{% ref "/contribute/code/workflow#code-reviews" %}}).
* Code is merged.
* Code is released.

### Release Manager
The overall coordination and operation of the release process are the responsibility of the release manager.

The release manager must perform several tasks for new release, such as coordinating with team members and following all the steps in the [release issue process](https://github.com/medic/cht-core/issues/new/choose), some of them being manual. The release manager must have adequate permissions to the repositories where the release is made.

### Major/Minor/Patch Release
{{% alert title="Note" %}} The following classification is defined by the [Semantic Versioning 2.0.0](https://semver.org). {{% /alert %}}

Given a version number `MAJOR.MINOR.PATCH`, increment the:
* `MAJOR` version when the release adds incompatible API changes
* `MINOR` version when the release adds functionality in a backward-compatible manner
* `PATCH` version when the release adds backward-compatible bug fixes

## CHT Conf

Follow the [instructions in the readme](https://github.com/medic/cht-conf/#user-content-releasing).

## Android apps

Follow the instructions in the [Android > Releasing]({{< ref "contribute/code/android/releasing" >}}) section.
