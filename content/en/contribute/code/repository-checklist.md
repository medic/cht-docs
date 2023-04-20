---
title: "Repository Checklist"
linkTitle: "Repository Checklist"
weight: 5
description: >
  Checklist to consider when creating repositories under Medic's GitHub account
---

## Repository Checklist
When creating a new repository under [Medic's GitHub organization](https://github.com/medic), the contributor(s) should at least do the following:

### Source Control
- [ ] The `main` branch is locked via [branch protection rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule).
- [ ] Merges are done through PRs.
- [ ] Issue templates exist.
- [ ] PR template exists.
- [ ] PRs reference related issues.
- [ ] Commit formats follow the [guidelines]({{< ref "workflow/#commits" >}}). 
- [ ] Secrets are not part of the commit history or made public.
- [ ] For public repositories the `main` branch should contain the following files:
    - `LICENSE` ([example](https://github.com/medic/cht-core/blob/master/LICENSE))
    - `README.md`

### Testing
- [ ] Unit tests cover the majority of the code (>90% if possible).
- [ ] If applicable, integration tests run to test the solution e2e.

### CI/CD
- [ ] Repo runs GitHub Actions CI with automated build and test on each PR.
- [ ] `Main` branch is always shippable.
- [ ] If applicable, repo uses CD to manage deployments to a development environment before PRs are merged.

### Code Reviews
- [ ] The PR template contains a code review checklist.
- [ ] A minimum number of reviewers (usually 2) for a PR merge is enforced by policy.
- [ ] Linters, unit tests and successful builds for PR merges are set up.

### Observability
- [ ] Application faults and errors are logged.
- [ ] Logging configuration can be modified without code changes (eg: verbose mode).

## Medic GitHub repository FAQ

### Q: Who can create a repository?
A: TODO

### Q: When to create a repository?
A: TODO

### Q: Is it OK to create a CHT/Medic-related work repository under a personal GitHub account?
A: TODO

### Q: When to make a repo public vs private vs directory in existing (monolithic)?
A: TODO

## More info

This policy was inspired by [Microsoft's Engineering Fundamentals Checklist](https://microsoft.github.io/code-with-engineering-playbook/ENG-FUNDAMENTALS-CHECKLIST/).