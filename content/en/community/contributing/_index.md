---
title: "Contributing code and documentation"
linkTitle: "Contributing"
weight: 8
description: >
  
---



## Quick Start

### Code

Before you start to coding, [raise an issue](https://github.com/medic/cht-core/issues/new/choose) or [start a conversation](https://forum.communityhealthtoolkit.org) about the change you want to make. Then:

1. Read our [Development Workflow]({{% ref "community/contributing/code/workflow" %}}) and [Code Style Guide]({{% ref "community/contributing/code/style-guide" %}}) 
2. [Setup]({{% ref "community/contributing/code/core/dev-environment" %}}) your development environment
3. Make sure your pull request's (PR) tests all pass. Failures need to be addressed before we can merge your code.
4. Provide detail about the issue you are solving on the PR. Please reference any existing issues using medic/<repo>#<issue number>
5. Our CI will automatically schedule a build; monitor the build to ensure it passes.
6. Your PR will be reviewed by a maintainer. Expect at least one change requested - don't be offended if your change doesn't get accepted on the first try!

### Docs

Help us maintain the quality of our documentation by [submitting a PR](https://github.com/medic/cht-docs) with any suggested changes. See the [Documentation Style Guide]({{% ref "community/contributing/docs/style-guide" %}}) then open a pull request with your suggested changes or additions. For simple changes, use the "Edit this page" link shown in the upper right of every page

## First time Contributors Guide

### Who this is for

Documentation exists for everything from how to [compile]({{% ref "community/contributing/code/core/dev-environment" %}}) the CHT from source to how to [build](https://github.com/medic/cht-docs/blob/main/README.md) the docs site locally.  However, where do you start?  What if you've never contributed to an open source project before? This guide helps the newcomer make their first contribution.

If this isn't you, head over to our [Community section]({{% ref "community" %}}) where list out other actions for new community members who are not developers.

### What is the CHT

Before you write a line of code or help improve that documentation, it's important to understand the larger picture of the CHT. Read up on why you [might use the CHT]({{% ref "why-the-cht" %}}) and visit the [CHT home page](https://communityhealthtoolkit.org/). If you've never seen or used the CHT, it can be really helpful to [sign up for a demo](https://communityhealthtoolkit.org/contact).

Diving more into the technical aspects of what the CHT is, see the [technologies and tools]({{% ref "technical-resources" %}}) used by the CHT. Additionally, the [Technology Radar for CHT Contributors](https://docs.communityhealthtoolkit.org/cht-tech-radar-contributors/) gives an overview of the technologies used to build the CHT tools.

The CHT is [open source](https://en.wikipedia.org/wiki/Open_source). Any code you commit will be freely available for other CHT users and they can improve and customize it just as you might choose to do so with the code others have written.

### How code gets written

Over the years the process for writing the CHT has been codified in our [workflow]({{% ref "community/contributing/code/workflow" %}}).  Skim this so you're aware of the basics. Check out our code  [style guide]({{% ref "community/contributing/code/style-guide" %}}) as well. You don't have to memorize everything here, but it's important to know about and refer back to when it the time comes to actually writing code.

A good rule of thumb is mimic the processes you see and the styles already present in the source code.

If you have never used `git` or GitHub, checkout the [Get started using GitHub in less than an hour](https://github.com/skills/introduction-to-github) guide. This will help you set up a GitHub account which you'll need as well. If you haven't worked on a pull request before, check out [How to Contribute to an Open Source Project](https://egghead.io/lessons/javascript-introduction-to-github).

### Development environment

Now that you have an idea of what the CHT is and how code gets written, go set up [your development environment]({{% ref "community/contributing/code/core/dev-environment" %}}).  Move intentionally, being sure to follow each step carefully.  If you get stuck here - or anywhere - [reach out on the forums](https://forum.communityhealthtoolkit.org/)!

Spend some time understanding how to start up and stop the development environment.

### Your first issue

Find an issue marked [Good first issue](https://github.com/medic/cht-core/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22Good%20first%20issue%22). Feel free to pick an issue that looks easy!  Make a comment on the issue asking for the issue to be assigned to you.

**Note** -  [Help Wanted](https://github.com/medic/cht-core/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22Help%20Wanted%22) issues do not have the extra introduction that Good first issues have.  While you're welcome to work on them, they'll be more of a challenge for first time contributors that likely will want some guidance found in the Good first issues.

#### Fork the CHT

tk, but likely copy over the content from this repo! https://github.com/firstcontributions/first-contributions - OH! Or just link to it? 🤔
