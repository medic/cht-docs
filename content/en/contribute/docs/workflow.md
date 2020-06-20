---
title: "Documentation Workflow"
linkTitle: "Workflow"
weight: 1
description: >
  How to contribute to the CHT tools and documentation
---

## Getting Started

Anyone can contribute to CHT documentation by opening an issue in the [`cht-docs`](https://github.com/medic/cht-docs/issues) repo or by using the “Edit this page” or “Create documentation issue” links in the upper right corner of your window.

### Basics

* It is helpful to be comfortable with [git]({{< ref "core/guides/using-git" >}}) and [GitHub](https://lab.github.com/) to contribute to the CHT community.
* The documentation source is in [GitHub](https://github.com/medic/cht-docs). The content pages are in the `/content/en/` directory.
* Documentation is written in [Markdown](https://www.markdownguide.org/). 
* The CHT site build uses [Hugo](https://gohugo.io/). You can also setup a [local clone](https://github.com/medic/cht-docs/blob/master/README.md#installing-hugo). 

## Writing Documentation

A high degree of importance is put on consistency and usability of CHT documentation so that it is accessible and understood by a wide audience. The CHT [documentation style guide]({{< ref "contribute/docs/style-guide" >}}) will help to write documentation in the most consistent and useful way.

## Commits to GitHub

The main branch is `master` which must be kept stable since it is deployed to the doc site. All documentation changes should be done in a branch with a Pull Request when ready for review. This means that a maintainer has signed off on the change before it hits the master branch.

Format your commit messages according to the Git convention where the first line should be a short title/summary (50 characters or so) with more details in a separate paragraph (if needed).

{{% alert title="Note" %}} Every commit message should be able to complete the following sentence:
When applied, this commit will: {YOUR COMMIT MESSAGE} {{% /alert %}} 

## Creating a Pull Request

When your branch is ready for review, create a [Pull Request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request). If you know who you'd like to review the PR, you can assign them directly. If you are unsure, you can leave it to the maintainers to handle the PR. 

{{% alert title="Note" %}}If the PR is part of an open issue in cht-core, add the [`Blocked: waiting on AT` label](https://github.com/medic/cht-docs/labels/Blocked%3A%20waiting%20on%20AT) so that the PR isn't accidentally merged prematurely, before the issue is acceptance tested and complete.{{% /alert %}} 

## Reviewing Pull Requests

Documentation reviewers are automated by the [code owners](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/about-code-owners) mechanism. In general, reviewers should:

1. Read the PR description to understand the changes made, as well as any linked issues
2. Review any comments by other reviewers
3. Select the **Files changed** tab to see the files and lines changed
4. Click the **+** beside the line you want to comment on. To select multiple lines at once, click the **+** of the top line of the selection, drag down to the bottom line, and release.
5. Add any comments you have about the line and click either **Add single comment** (if you want to post the comment without a review) or **Start a review** (if you have multiple comments to make).
6. When finished, click **Review changes** at the top of the page. Here, you can add a summary of your review, approve the PR, comment or request changes as needed.
7. Once all comments have been resolved, or changes are satisfactory, **Merge pull request** to complete the updates, and delete the branch.

{{% alert title="Note" %}} Additional Tips for Reviewers:
* Use the [Style Guide]({{< ref "contribute/docs/style-guide" >}}) to maintain documentation consistency
* Be empathetic to the author, commenting on positive aspects of PRs as well as changes
* Ask clarifying questions where needed to avoid further confusion
{{% /alert %}} 
