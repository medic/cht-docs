---
title: "Development Workflow"
linkTitle: "Workflow"
weight: 6
description: >
  Overview of the development workflow
---

## Code

### Writing

Where possible, follow our [coding style guide]({{< ref "contribute/code/style-guide" >}}).

Aim for self-documenting code. Where code cannot be made self-documenting add commenting. Usually comments are useful when they explain why some code exists, and should not be explaining what some code is doing. 

### Pushing Code & Opening Pull Requests

Never push commits directly to the main branch (`main` or `master`). Always use a pull request.

- If your code is in a regular pull request, it is assumed to be done and only needing a review and testing as checks before merging. It is best to request a reviewer, but otherwise anyone may freely review your PR.
- If your code is in a draft PR, it is assumed to be a work-in-progress where collaboration is welcome, but best to communicate about specifics before assuming anything is complete.
- If you have pushed code to a remote branch without a pull request, it is assumed to be a work-in-progress where collaboration is unexpected.

A good workflow would be to work locally, pushing to a remote branch as you make progress, possibly open a draft PR for some initial collaboration on tricky parts, and once everything is done, convert the draft PR to a regular PR to be reviewed.

Once your pull request has been approved, it can be merged to the main branch by anyone with write access to the repository. When merging a PR, avoid the "Create a merge commit" option. Merge commits in the main branch cause the history of the branch to be non-linear and make it more difficult to understand exactly when a code change was introduced. Instead, use the "Squash and merge" option to combine the commits in the PR into a single commit on the main branch. Alternatively, you can use the "Rebase and merge" option if you want _all_ the commits in the PR to be preserved in the main branch (this should only be used in special cases). See below for instructions on [how to format your commit messages]({{< ref "#commit-message-format" >}}). 

### Code reviews

#### Guidelines

The author and reviewer should use this [guide to code reviewing](https://google.github.io/eng-practices/review/developer/).

#### Suggestions

When doing a code review aim to be extremely clear. This helps things move quickly and avoids lost time in misunderstandings. One especially useful GitHub feature for doing this is suggesting a change. Consider the following example code:

```javascript
contacts.map( (c) => { return c.id });
``` 

The function body can be abbreviated. In a review you can leave a comment asking for the change, which would likely involve writing up a comment trying to have the author change it to the following:

```javascript
contacts.map( c => c.id);
``` 
That means leaving a comment, having the author read and understand it, and then making and pushing up a change, hopefully matching your review expectations.

To be clear and save all that back-and-forth though, you can make a code suggestion directly in your review, which will let the author simply click a button to accept the change (and have it automatically applied as a commit by GitHub).

![GitHub review suggest change](gh-review-suggestion.png)

#### Timeliness

Timely code reviews are important to getting improvements into the hands of users faster and allowing developers to stay focused on the task at hand and see it through to production.

Code reviews should be completed within 24 hours of assignment (excluding weekends and holidays). In some cases, a code review may not be possible if a larger discussion needs to be had for design choices or solution objectives, but even in cases like those, some feedback is still to be expected within 24 hours.

### Updating The Issue With What You Actually Did

Add [labels](https://github.com/medic/cht-core/labels) to the GitHub issue as needed. At this stage, the two to look out for are:
- `Breaking change`
- `UI/UX`

Add a comment to the GitHub issue with what the final change actually was. This is important for multiple cases including:
- Non-technical people may not understand the conversation thread on the issue. GitHub is a place that developers work, but it is also common to send non-technical people links to issues in GitHub.
- The QA team should have a quick way to know where to start testing.
- Issues with a lot of discussion of alternative solutions need a clear resolution and indication of which route was taken.

Options for doing this:
- Attach a short video - these are usually very well received and can often help people understand what happened much more clearly than a text description.
- Screenshots - pictures with big arrows on them can quickly convey important things to look at. If you start to need multiple screenshots consider the video option instead.
- Write up a few sentences - be sure to consider a non-technical audience when writing this.

An example of a good thorough comment/template is as follows:

```
### Testing

1. Install branch `81-do-great-things`
2. [a specific thing to be sure it has been set up correctly]
3. ...


### What was actually built

[video|screenshots|text]


### Documentation

- [link](url)

```

### Testing

Reach out to the Quality Assurance Engineers with the work to be done as early as possible in the development process to ensure they are informed and can guide development (see more in the [Quality Assistance]({{< ref "contribute/medic/product-development-process/quality-assistance" >}}) dedicated page).

Before asking for testing support from the QA Engineers, you should test your work after performing it. Correcting a small code error, such as a typo, or adding a missing step in the testing instructions could save QA Engineers hours of work. Also, by testing your code, you may get a better sense of why you make certain common mistakes, and learn to avoid repeating them in the future.

All features and bug fixes must have at least one unit test. All features must have at least one end-to-end test.

The CHT has a [fully automated end-to-end testing suite](https://github.com/medic/cht-core/tree/master/tests/e2e) which is executed in CI and must pass before any change is merged. This means you can have reasonable confidence that all code merged to the main branch is safe and ready for release without further regression testing. The suite isn't fully comprehensive but it is being constantly improved and expanded.

From time to time QA Engineers will perform smoke tests, scalability tests, performance tests, and penetration tests to pick up on gradual regressions that may have crept in. The ultimate goal is that these tests will eventually be automated and added to the CI suite as well.

### Migrating

When the schema is changed you must also provide a migration so when instances are upgraded existing data is compatible with the new code.

## Commits

The main branch is `main` (or `master`) which must be kept stable so as not to impact other developers and so a release branch can be created as needed. To achieve this (almost) all development should be done in a branch and submitted via a PR for code review. This means the CI runs and another developer has signed off on the change before it hits the `main` branch.

### Commit message format

The commit format should follow this [conventional-changelog angular preset](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular). This means that some of the release process can be automated. See the list of commit types and examples below:

Type | Description | Example commit message | Release type
-- | -- | -- | --
Bug fixes | Change code that wasn't working as intended. | fix(#123): infinite spinner when clicking contacts tab twice | patch
Performance | A code change that improves performance. Measure the performance improvement to inform the community. | perf(#789): lazily loaded angular modules | patch
Features | A new feature or improvement that users will notice. | feat(#456): add home tab | minor
Non-code | A change that user won't notice, like a change in a README file, adding e2e tests, updating dependencies, removing unused code, etc. | chore(#123): update README | none

{{% alert title="Note" %}} 
Breaking changes should be explained under the commit type (feat, fix and perf) using the prefix `BREAKING CHANGE`. 
Consider the following example:

```
  perf(#2): remove reporting rates feature
  BREAKING CHANGE: reporting rates no longer supported
``` 

Any other further information should be provided in the second line of the commit message, respecting 79 character line widths. Using `git commit -v` is recommended to review your diff while you write your commit message.
{{% /alert %}}

See tips on [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) and add your favorites here.

Never force push remote. Prefer rebasing over merging as it makes for a cleaner history.

Commit reformats and refactors separately from actual code changes to make reviewing easier.

Read more about [using git](https://git-scm.com/doc/ext).

## Branches

- The main branch is `main` or `master` and is the github default branch and contains the latest code.
- Release branches have the form `<major>.<minor>.x` and should be stable.
- Feature branches have the form `<issue-number>-<issue-description>` and are work in progress.

{{% alert title="Note" %}} When backporting changes to an earlier release branch you should `git cherry-pick` the appropriate commit(s) from the main branch into the release branch. Then use a pull request to make sure tests pass on CI before merging (you do not need to get the pull request approved if there were no conflicts when cherry-picking). {{% /alert %}}

## Issues

Issues are managed in Github. Issues should be created in the repository where the changes need to be made. If it is not clear in which repo to open an issue the default should be the `cht-core` repository. If it is a security or sensitive issue it should be opened in the private `medic-projects` repository.

When creating issues add the appropriate [Priority](https://github.com/medic/medic/labels?utf8=%E2%9C%93&q=Priority%3A+) and [Type](https://github.com/medic/medic/labels?utf8=%E2%9C%93&q=Type%3A+) labels.

### Regressions

When a bug is found that impacts functionality that worked in a previous version, it's important that these are labelled properly so someone who is planning to upgrade can find it. To flag this, add the "Regression" label, and a labels in the form "Affects: {{version}}" (e.g.: "Affects: 3.14.0") for each version where this bug exists. It's likely that the label for this specific version doesn't exist so you may have to create it. This ensures that issue is listed as a Known Issue in the Release Notes for that version.

## Project States

When the issue is scheduled for development it will be added to the [Product Team Activities project](https://github.com/orgs/medic/projects/134). Each column in the project represents the state the issue is in.

### Todo

Issues in this column have been prioritised and are ready for development. The issue has all the detail needed to begin development and it is free for anyone to start work on. If you start work on an issue, assign it to yourself and move it to "In progress".

### In progress

Issues in this column are being actively worked on, which includes development, design, code reviews, and testing.

Any code should be in a branch in each of the repositories you update. The name of the branch should be in the form `<issue-number>-<readable-name>`, for example `1104-inclusive-export`. Follow the [Quality Assistance]({{< ref "contribute/medic/product-development-process/quality-assistance" >}}) process to take full ownership of what you are building.

Use the following template for QA feedback throughout the development.

{{< tabpane persistLang=false lang="markdown">}}
{{< tab header="Test passed" >}}

### Test details

**Config:** <Default/standard>
**Environment:** <Local>
**Platform:** <WebApp>
**Browser:** <Chrome>

---

### Test scenario:
Description of the scenario - This is not required for all the tests

### Reproducible on `master`
A small description of how it was reproduced, and images or videos that support the comment.

<details>
<summary>Image/video attached</summary>
</details>

### Fixed on `####-branch-name`
A small description, and images or videos that support the comment.

<details>
<summary>Image/video attached</summary>
</details>

---

Test passed successfully. :white_check_mark:
The ticket is ready to merge.
@<developer's name>

{{< /tab >}}
{{< tab header="Test failed" >}}
### Test details

**Config:** <Default/standard>
**Environment:** <Local>
**Platform:** <WebApp>
**Browser:** <Chrome>

---

### Test scenario:
Description of the scenario - This is not required for all the tests

### Reproducible on `master`
A small description of how it was reproduced, and images or videos that support the comment.

<details>
<summary>Image/video attached</summary>
</details>

### Not working on `####-branch-name`
A small description, and images or videos that support the comment.

<details>
<summary>Image/video attached</summary>
</details>

---

Test failed :x:
The ticket needs further development.
@<developer's name>

{{< /tab >}}
{{< /tabpane >}}

A great way to facilitate discussion and collaboration is with a Draft PR.

Once you're confident that the change is complete and ready to be merged:

1. Submit a PR for each of the repositories. Each PR message and description will become the commit message and description so keep the message concise, describe what and why rather than how, and link to the issue in the description (eg: "medic/cht-core#123").
1. Wait for the builds to succeed and ensure there are no conflicts with the the main branch so the PR can be merged.
1. Pick one Reviewer for the PR and work with them until the code passes review. In some special cases more than one Reviewer may be necessary, but be specific about additional Reviewers and ensure you really need each of their additional reviews for a good reason. Remember, anyone can collaborate on PRs even if they aren't an official Reviewer. If you add a QA Engineer as a Reviewer, briefly comment in the ticket about what kind of testing review you expect from that engineer.

Once all PRs have been approved:

1. Write a useful commit message in the PR using the [commit message format]({{< ref "#commit-message-format" >}}).
2. Click the button to "Squash and Merge" the PR.
3. If a backport is required cherry-pick the merged commit back to the release branches it's required in.
4. Ensure the issue is added to the appropriate release milestone, which is the earliest semver version the change will be released in. This ensures it will be included in the release notes.
5. Once all PRs have been merged, close the issue. This will automatically move it to "Done".

### Done

Issues in this column are complete, all code has been merged into the main branch and/or release branches, and are ready for release.
