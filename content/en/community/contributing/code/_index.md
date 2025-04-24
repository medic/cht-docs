---
title: "Contributing Code"
linkTitle: "Code"
weight: 3
aliases:
  -    /contribute/code/
---

{{< hextra/hero-subtitle >}}
  How to contribute to code to the CHT
{{< /hextra/hero-subtitle >}}

> [!TIP] 
> See the [CHT Core Developer Setup guide]({{% ref "community/contributing/code/core/dev-environment" %}}) for detailed instructions on how to setup your development environment. 

The Core Framework of the Community Health Toolkit is powered by people like you. Your contributions help us create open source technology for a new model of healthcare that reaches everyone.

The [Development](https://forum.communityhealthtoolkit.org/c/support/development/7) section of the forum is a great place to introduce yourself and ask questions. Or you can also jump right in:

The CHT community welcomes first-time contributors and experts alike. All comments, questions, and ideas are welcome!

## First time contributor?

Be sure to read the [first time contributors guide]({{% ref "community/contributing/first-time-contributors" %}})!

## Reporting a vulnerability?

See the [vulnerability disclosure guide]({{% ref "community/contributing/disclosing-vulnerabilities" %}})!

## Code of Conduct

All maintainers and contributors are required to act according to our [Code of Conduct]({{% ref "../code-of-conduct" %}}). Thank you for your help building a positive community and a safe environment for everyone.

## Quick Start

Before you start coding a new change you suggest to the CHT, [raise an issue](https://github.com/medic/cht-core/issues/new/choose) or [start a conversation](https://forum.communityhealthtoolkit.org) about the change you want to make. Then:

1. Read the CHT [Development Workflow]({{% ref "community/contributing/code/workflow" %}}) and [Code Style Guide]({{% ref "community/contributing/code/style-guide" %}}).
2. Find a good ticket and request it be assigned to you via a comment.
3. [Setup]({{% ref "community/contributing/code/core/dev-environment" %}}) your development environment.
4. Make sure your pull request's (PR) tests all pass. Failures need to be addressed before we can merge your code.
5. Provide detail about the issue you are solving on the PR. Reference any existing issues using `medic/<repo> # <issue number>`.
6. Our CI will automatically schedule a build; monitor the build to ensure it passes.
7. Your PR will be reviewed by a maintainer. Expect at least one change requested - don't be offended if your change doesn't get accepted on the first try!

## License
The software is provided under AGPL-3.0. Contributions to this project are accepted under the same license.

{{< subpages >}}