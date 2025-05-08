---
title: "CHT Product Repository Checklist"
linkTitle: "Repository Checklist"
weight: 8
aliases: >
  /contribute/code/repository-checklist
---

{{< hextra/hero-subtitle >}}
  Checklist to consider when creating CHT Product repositories
{{< /hextra/hero-subtitle >}}

## Repository Creation Checklist
When creating a new CHT Product repository under [Medic's GitHub organization](https://github.com/medic), the contributor(s) should use the [cht-repo-template](https://github.com/medic/cht-repo-template) repository containing the following configurations:

### Source Control
- [ ] The `main` branch is locked via [branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule).
- [ ] Merges are done through PRs.
- [ ] Automatically delete head branches.
- [ ] Issue templates exist.
- [ ] PR template exists.
- [ ] PRs reference related issues.
- [ ] Commit formats follow the [guidelines]({{< ref "workflow/#commits" >}}). 
- [ ] Secrets are not part of the commit history or made public.
- [ ] The following files exist:
    - `LICENSE` specifying AGPL-3.0 ([example](https://github.com/medic/cht-core/blob/master/LICENSE))
    - `README.md`.
- [ ] `main` branch is always shippable.

### Code Reviews
- [ ] The PR template contains a code review checklist.
- [ ] A reviewer for a PR merge is enforced by policy.
- [ ] A [linter](https://github.com/medic/eslint-config) is set up.

The PR and issue template content can be adjusted according to the product's purpose.

Additionally, the person who creates the repository might need to share repository access with appropriate teams (this may require admin access).

## Items to consider when developing the CHT Product
To ensure quality, the CHT Products should also follow the guidelines below:

### CI/CD
- [ ] Repository runs GitHub Actions CI with automated build and test on each PR.
- [ ] When using `semantic-release` (or a similar technology) to automate releases, configure the `medic-ci` bot to have permission to update the repository.
    - In the repository settings, go to "Collaborators and teams" > "Add people" and add the `medic-ci` bot with `admin` permissions.

### Testing
- [ ] Unit tests and successful builds for PR merges are set up.
- [ ] Unit tests cover the majority of the code.
- [ ] If applicable, integration tests run to test the solution e2e.

### Observability
- [ ] Application faults and errors are logged.
- [ ] Logging configuration can be modified without code changes (eg: verbose mode).

## Medic GitHub repository FAQ

{{% details title="Q: Who can create a repository?" %}}

A: Anyone under Medic GitHub organization.

{{% /details %}}

{{% details title="Q: Is it OK to create a CHT/Medic-related work repository under a personal GitHub account?" %}}

A: If what you are working on is temporary and just for you then it is fine to create a repository under your personal account (it is the equivalent of having a script on your local machine), as long as it contains an Open-Source Software License. However, default to the Medic account so the other team members can collaborate on it.

{{% /details %}}

{{% details title="Q: When to make a repo public vs private?" %}}

A: Repositories should be public unless there is very good reason to make it private (e.g. the repository contains partner details that cannot be disclosed to public). Always keep in mind that it is much easier to start public than change to public later.

{{% /details %}}

{{% details title="Q: When to create a new repository vs adding a directory in existing (monolithic)?" %}}

A: It depends on the nature of the code. Some things to consider are: is the new code and the old code dependent, don't make sense on their own, must be versioned together, etc. If not, default to a new repo to reduce complexity.

{{% /details %}}

{{< callout >}}
  This policy was inspired by [Microsoft's Engineering Fundamentals Checklist](https://microsoft.github.io/code-with-engineering-playbook/engineering-fundamentals-checklist/).
{{< /callout >}}