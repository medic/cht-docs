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

* The [Focused Working Group]({{% ref "/contribute/medic/product-development-process/focused-groups" %}}) sees an opportunity they want to go after. The opportunity addresses a need of at least one CHT app deployment and will be used by that deployment after the release.
* The Focused Working Group agrees on a solution for it.
* Tickets are added to the [Product Team Activities board](https://github.com/orgs/medic/projects/134/views/3) for what's being built.
* A [release manager](#release-manager) is assigned from the team.
* The release manager [creates an issue](https://github.com/medic/cht-core/issues/new/choose) for either a [Major/Minor or Patch](#majorminorpatch-release) release and follows the process outlined in the issue template.
* Code is built by a developer together with [quality assistance]({{% ref "/contribute/medic/product-development-process/quality-assistance" %}}).
* [Code is reviewed]({{% ref "/contribute/code/workflow#code-reviews" %}}).
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
 [on the Releases page]({{% ref "core/releases" %}}). {{% /alert %}}

## CHT Conf

Follow the [instructions in the readme](https://github.com/medic/cht-conf/#user-content-releasing).

## Android apps

Follow the instructions in the [Android > Releasing]({{< ref "contribute/code/android/releasing" >}}) section.
