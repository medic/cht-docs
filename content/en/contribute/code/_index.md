---
title: "Contributing Code"
linkTitle: "Code"
weight: 1
description: >
  How to contribute to code to the CHT
---

{{% alert title="Setup development environment" %}}
See the [CHT Core Developer Setup guide]({{% ref "contribute/code/core/dev-environment" %}}) for detailed instructions on how to setup your development environment. 
{{% /alert %}}

The Core Framework of the Community Health Toolkit is powered by people like you. Your contributions help us create open source technology for a new model of healthcare that reaches everyone.

The [Development](https://forum.communityhealthtoolkit.org/c/support/development/7) section of the forum is a great place to introduce yourself and ask questions. Or you can also jump right in:

The CHT community welcomes first-time contributors and experts alike. All comments, questions, and ideas are welcome!

## Ways to contribute

### First time contributor?

Be sure to read the [first time contributors guide]({{% ref "community/first-time-contributors" %}})!

### Submitting code

**Note:** We recommend you raise an issue on Github or start a conversation on our [Community Forum](https://forum.communityhealthtoolkit.org) about the change you want to make before you start on code.

1. Read our [Development Workflow]({{% ref "workflow" %}}) to understand how we work, and review our [Code Style Guide]({{% ref "style-guide" %}}) before you begin.
2. [Setup]({{% ref "contribute/code/core/dev-environment" %}}) your development environment
3. Before you submit a pull request, please make sure your contribution passes all tests. Test failures need to be addressed before we can merge your contribution.
3. Provide detail about the issue you are solving in the pull request description. Note: If your pull request addresses a specific issue, please reference it using medic/<repo>#<issue number>
4. Our CI will automatically schedule a build; monitor the build to ensure it passes.
5. Your PR will be reviewed by one of the repository's maintainers. Most PRs have at least one change requested before they're merged so don't be offended if your change doesn't get accepted on the first try!

**Working on your first Pull Request?** Check out [How to Contribute to an Open Source Project on GitHub](https://egghead.io/lessons/javascript-introduction-to-github)

### Improving our documentation

**Note:** [cht-docs](https://github.com/medic/cht-docs) does not involve release management and acceptance testing. Help us maintain the quality of our documentation by submitting a pull request (PR) with any suggested changes.

Is our documentation up to date? Have we covered everything we should? Could our wording be improved? Read our [Documentation Style Guide]({{% ref "contribute/docs/style-guide" %}}) then open a pull request with your suggested changes or additions.
Want to talk about Documentation generally? Join our [Community Forum](https://forum.communityhealthtoolkit.org)!

### Translations

If you are a translator but not a developer, we understand that you may need extra help to follow the [process of translatingsoftware for the first time. If that is the case, please open an issue on the GitHub repo or start a topic on the community forum.

### Disclosing vulnerabilities

We take the security of our systems seriously, and we value the security community. The disclosure of security vulnerabilities helps us ensure the security and privacy of our users.

#### Guidelines

We require that all researchers:

- Make every effort to avoid privacy violations, degradation of user experience, disruption to production systems, and destruction of data during security testing;
- Refrain from using any in-scope compromise as a platform to probe or conduct additional research, on any other system, regardless of scope;
- Perform research only within the scope set out below;
- Use the identified communication channels to report vulnerability information to us; and
- Keep information about any vulnerabilities you've discovered confidential between yourself and Medic until all production systems have been patched.

If you follow these guidelines when reporting an issue to us, we commit to:

- Not pursue or support any legal action related to your research;
- Work with you to understand and resolve the issue quickly (including an initial confirmation of your report within 72 hours of submission);
- Recognize your contribution on our Security Researcher Hall of Fame, if you are the first to report the issue and we make a code or configuration change based on the issue.

#### Scope

A local CHT instance is included in the scope. Follow the [manual instructions]({{< relref "hosting/4.x/app-developer" >}}) to set up a CHT instance. 

#### Out of scope

Any services hosted by 3rd party providers and any and all other services hosted on or beneath the medicmobile.org and hopephones.org domains are excluded from scope.

In the interest of the safety of our users, staff, the Internet at large and you as a security researcher, the following test types are excluded from scope:

- Findings from physical testing such as office access (e.g. open doors, tailgating)
- Findings derived primarily from social engineering (e.g. phishing, vishing)
- Findings from applications or systems not listed in the ‘Scope' section
- UI and UX bugs and spelling mistakes
- Network level Denial of Service (DoS/DDoS) vulnerabilities

Things we do not want to receive:

- Personally identifiable information (PII)
- Any exploits or proofs-of-concept in binary format (e.g. ELF)

#### How to report a security vulnerability?

If you believe you've found a security vulnerability in one of our products or platforms please send it to us by emailing dev@medic.org. Please include the following details with your report:

- Description of the location and potential impact of the vulnerability;
- A detailed description of the steps required to reproduce the vulnerability (proof of concept source code, screenshots, and compressed screen captures are all helpful to us); and
- Your name/handle and a link for recognition in our [Hall of Fame]({{% ref "community/hall-of-fame" %}}).

### Code of Conduct

All maintainers and contributors are required to act according to our [Code of Conduct]({{% ref "../code-of-conduct" %}}). Thank you for your help building a positive community and a safe environment for everyone.

#### License
The software is provided under AGPL-3.0. Contributions to this project are accepted under the same license.
