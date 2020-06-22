---
title: "Development Workflow"
linkTitle: "Workflow"
weight: 6
description: >
  Overview of the developement workflow
---

## Code

### Writing

Where possible, follow our [coding style guide]({{< ref "contribute/code/style-guide" >}}).

Aim for self-documenting code. Where code cannot be made self-documenting add commenting. Usually comments are useful when they explain why some code exists, and should not be explaining what some code is doing. 

### Reviewing

The author and reviewer should use this [guide to code reviewing](https://google.github.io/eng-practices/review/developer/).

### Testing

All features and bug fixes must have at least one unit test. All features must have at least one end-to-end test.

### Migrating

When the schema is changed you must also provide a migration so when instances are upgraded existing data is compatible with the new code.

## Commits

The main branch is `master` which must be kept stable so as not to impact other developers and so we can take a release branch as needed. To achieve this we do (almost) all development in a branch and submit a PR for code review. This means the CI runs and another developer has signed off on the change before it hits the `master` branch.

Format your commit messages according to Git standards. First line should be a short title/summary (50 characters or so) with more details in a separate paragraph, respecting 79 character line widths. Using `git commit -v` is recommended to review your diff while you write your commit message.

See tips on [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) and add your favorites here.

> Every good commit message should be able to complete the following sentence:
>
> When applied, this commit will: {{YOUR COMMIT MESSAGE}}

Never force push remote. Prefer rebasing over merging as it makes for a cleaner history.

Commit reformats and refactors separately from actual code changes to make reviewing easier.

For more help with Git see: [Using Git](./using-git.md).

## Branches

- The main branch is `master` and is the github default branch and contains the latest code.
- Release branches have the form `<major>.<minor>.x` and should be stable.
- Feature branches have the form `<issue-number>-<issue-description>` and are work in progress.

{{% alert title="Note" %}} When backporting changes to an earlier release branch you should `git cherry-pick` the appropriate commit(s) from `master` into the release branch. Then use a pull request to make sure tests pass on Travis before merging (you do not need to get the pull request approved if there were no conflicts when cherry-picking). {{% /alert %}}

## Issues

Issues are managed in Github. Issues should be created in the repository where the changes need to be made. If it is not clear in which repo to open an issue the default should be the `medic` repository. If it is a security or sensitive issue it should be opened in the private `medic-projects` repository.

When creating issues add the appropriate [Priority](https://github.com/medic/medic/labels?utf8=%E2%9C%93&q=Priority%3A+) and [Type](https://github.com/medic/medic/labels?utf8=%E2%9C%93&q=Type%3A+) labels.

## Project States

When the issue is scheduled for development it will be added to the appropriate [organisation project](https://github.com/orgs/medic/projects?query=is%3Aopen+sort%3Aname-asc) named after the webapp version it will be released with. Each column in the project represents the state the issue is in.

### To do

Issues in this column have been scheduled to be released with this webapp version. The issue has all the detail needed to begin design and development and it is free for anyone to start work on. If you start work on an issue assign it to yourself and move it to "In progress".

### In progress

Issues in this column are being actively worked on, which includes development, design, and code reviews.

Any code should be in a feature branch in each of the repositories you update. The name of the feature branch should be in the form `<issue-number>-<readable-name>`, for example `1104-inclusive-export`. Once you're satisfied with your changes:

1. Submit a PR for each of the repositories. Each PR message and description will become the commit message and description so keep the message consise, describe what and why rather than how, and link to the issue in the description (eg: "medic/cht-core#123").
2. If AT is required update the issue with AT instructions.
3. Wait for the builds to succeed and ensure there are no conflicts with the `master` branch so the PR can be merged.
4. Pick at least one Reviewer for the PR and work with them until the code passes review.
5. If the issue requires AT then move the issue to "Ready for AT" for QA to test. Otherwise merge the PR, delete the branch, and close the issue.

### Ready for AT

Issues in this column are ready to be acceptance tested by a Quality Assurance engineer. When picking up an issue for AT:

1. Check that the PR has no merge conflicts with `master` and all required builds have passed. If not, notify the original developer to fix the branch and find another issue to AT.
2. Assign it to yourself.
3. Move it to the "AT in progress" column

### AT in progress

Issues in this column are in the process of being acceptance tested by a Quality Assurance engineer. To complete AT:

1. Install the PR branch to test against.
2. If the issue fails AT then notify the original developer and move the issue back to "In progress".
3. Once the issue passes AT move the issue to "Ready to merge" the notify the original developer to merge the PR.

### Ready to merge

Issues in this column have passed AT and can be merged as soon as possible. The original developer will then:

1. Write a useful commit message in the PR.
2. Click the button to "Squash and Merge" the PR.
3. Delete the PR branch.
4. If a backport is required cherry-pick the merged commit back to the release branches it's required in.
5. Close the issue. This will automatically move it to "Done".

### Done

Issues in this column have passed acceptance testing and been merged into `master` and/or release branches ready for release.

## Triaging old issues

We periodically run a [script](https://github.com/medic/github-issue-roulette) against medic issues. We do this to catch two situations:
 - Issues that do not have the three labels they need (Type, Priority and Status)
 - Issues that have not been touched in 90 days
 
The plan is to keep cruft in our issue DB to a minimum, and have them curated into a colletion of detailed clear issues that can and should be actionable in the near to mid future.

You will occasionally get assigned issues and asked to deal with one or both of the above problems.

### What do I do when I get one of these issues?

Use your judgement (or someone else's, feel free to pull in others either directly on the issue or via Slack etc) to decide:
 - Is its description too vague? Is it detailed enough to be actionable?
 - Is this something we want to do **in the near future**? Does it fit with our product etc?
 - If this is an older issue, do you think it is still relevant? Is there still interest? (If there is no interest it can be closed: it can always be re-opened or re-written in the future)
 - Is this covered by existing issues, or existing plans?
 - If it's a bug, does it have: steps to reproduce; expected behaviour; actual behaviour; server info, browser info, screenshots etc where applicable?

From this decide if you need to go back to the issue creator for more information, or close the issue (using one of the `Won't Fix` labels), or keep it.

Additionally, if there are missing labels:
 - Type should be reasonably obvious: which of those labels most fits the issue
 - Status should almost certainly be `Status: 1 - Triaged`
 - Priority is dependent on the severity of the problem: if it's a production issue it's probably high, if it's a minor thing it's probably low, medium for everything else (but use your judgement)
 
### Anything else?

Regardless of what you do with the issue, please:
 - Remove the `Needs Triage` label once triage is complete
 - Document the reasoning by commenting in the issue. This will help reduce mistakes, as the reasoning will be available for everyone to read, and any mistakes there can be rectified.
 
