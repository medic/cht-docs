---
title: "Development Workflow"
linkTitle: "Workflow"
weight: 1
description: >
  Overview of the development workflow
aliases:
   - /contribute/code/workflow
---

{{< callout type="warning" icon="book-open" >}}
Before starting to write code for the CHT, take some time to familiarize yourself with the [Code of Conduct](/community/contributing/code-of-conduct) and the [AI Assistance Guidelines](/community/contributing/ai-guidelines).
{{< /callout >}}

## Writing code

Where possible, follow the [coding style guide](/community/contributing/code/style-guide).

Aim for self-documenting code. Where code cannot be made self-documenting add commenting. Usually comments are useful when they explain why some code exists, and should not be explaining what some code is doing. 

### Code Quality

Several [static analysis tools](/community/contributing/code/static-analysis) are used to support code quality. These tools are run automatically on every pull request and will fail the build if they find any issues.

For a more efficient feedback loop, developers should run linting scripts locally before pushing code to the repository. Additionally, both [ESLint](/community/contributing/code/static-analysis#eslint) and [Sonar](/community/contributing/code/static-analysis#during-development) have IDE plugins that show code issues in real-time. 

## Issues

Issues are managed in GitHub. Issues should be created in the repository where the changes need to be made. If it is not clear in which repo to open an issue the default should be the `cht-core` repository. If it is a security or sensitive issue, reach out privately to the [CHT maintainers](https://github.com/orgs/medic/teams/development-team) so they can open an issue in the private `medic-projects` repository.

When creating issues add the appropriate [Priority](https://github.com/medic/medic/labels?utf8=%E2%9C%93&q=Priority%3A+) and [Type](https://github.com/medic/medic/labels?utf8=%E2%9C%93&q=Type%3A+) labels.

### Regressions

When a bug is found that impacts functionality that worked in a previous version, it's important that this is labelled properly so someone who is planning to upgrade can find it. To flag this, add the "Regression" label, and a label in the form "Affects: {{version}}" (e.g.: "Affects: 3.14.0") for each version where this bug exists. It's likely that the label for this specific version doesn't exist so you may have to create it. This ensures that issue is listed as a Known Issue in the Release Notes for that version.

### Issue Status

When the issue is scheduled for development it can be added to a project. When linked to a GitHub project, the issue has a status property that represents the state the issue is in.

#### To do

Issues in this column have been prioritised and are ready for development. The issue has all the detail needed to begin development and it is free for anyone to start work on. If you start work on an issue, assign it to yourself and move it to "In progress".

#### In progress

Issues in this column are being actively worked on, which includes development, design, documentation, code reviews, and testing.

#### Done

Issues in this column are complete, all code has been merged into the main branch and/or release branches, and are ready for release. 

## Development

### Branches

The main branch is `main` (or `master`) which must be kept stable so as not to impact other developers and so a release branch can be created as needed. To achieve this, development should be done in a branch (only possible for maintaners) or fork and submitted via a PR for code review. This means the CI runs and another developer has signed off on the change before it is included in the `main` branch.

Create a branch following the guideline below and push [commits](#commits) at least once a day to a remote repository. This ensures that the code is always backed up and safe, protects against accidental deletes, and allows community members to see the latest changes and work together more effectively.

- The main branch is `main` or `master` and is the GitHub default branch and contains the latest code.
- Release branches have the form `<major>.<minor>.x` and should be stable.
- Feature branches have the form `<issue-number>-<issue-description>` and are work in progress.

> [!NOTE] 
> When backporting changes to an earlier release branch you should `git cherry-pick` the appropriate commit(s) from the main branch into the release branch. Then use a pull request to make sure tests pass on CI before merging (you do not need to get the pull request approved if there were no conflicts when cherry-picking).

### Commits

#### Commit message format

The commit format should follow the [conventional-changelog angular preset](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular). This means that some of the release process can be automated. See the list of commit types and examples below:

Type | Description | Example commit message | Release type
-- | -- | -- | --
Bug fixes | Change code that wasn't working as intended. | fix(#123): infinite spinner when clicking contacts tab twice | patch
Performance | A code change that improves performance. Measure the performance improvement to inform the community. | perf(#789): lazily loaded angular modules | patch
Features | A new feature or improvement that users will notice. | feat(#456): add home tab | minor
Non-code | A change that user won't notice, like a change in a README file, adding e2e tests, updating dependencies, removing unused code, etc. | chore(#123): update README | none

> [!NOTE]
> Breaking changes should be explained under the commit type (feat, fix and perf) using the prefix `BREAKING CHANGE`. 
> onsider the following example:
> 
> ```
>   perf(#2): remove reporting rates feature
>   BREAKING CHANGE: reporting rates no longer supported
> ``` 
> 
> Any other further information should be provided in the second line of the commit message, respecting 79 character line widths. Using `git commit -v` is recommended to review your diff while you write your commit message.

See tips on [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/) and add your favorites here.

Never force push remote. Prefer rebasing over merging as it makes for a cleaner history.

Commit reformats and refactors separately from actual code changes to make reviewing easier.

Read more about [using git](https://git-scm.com/doc/ext).

### Pull Requests

Never push commits directly to the main branch (`main` or `master`). Always use a pull request.

- If your code is in a regular pull request, it is assumed to be done and only needing a review and testing as checks before merging. It is best to request a reviewer, but otherwise anyone may freely review your PR.
- If your code is in a draft PR, it is assumed to be a work-in-progress where collaboration is welcome, but best to communicate about specifics before assuming anything is complete.
- If you have pushed code to a remote branch without a pull request, it is assumed to be a work-in-progress where collaboration is unexpected.

A good workflow would be to work locally, pushing to a remote branch as you make progress, possibly open a draft PR for some initial collaboration on tricky parts, and once everything is done, convert the draft PR to a regular PR to be reviewed.

Once your pull request has been approved, it can be merged to the main branch by anyone with write access to the repository. 

When merging a PR, avoid the "Create a merge commit" option. Merge commits in the main branch cause the history of the branch to be non-linear and make it more difficult to understand exactly when a code change was introduced. Instead, use the "Squash and merge" option to combine the commits in the PR into a single commit on the main branch. Alternatively, you can use the "Rebase and merge" option if you want _all_ the commits in the PR to be preserved in the main branch (this should only be used in special cases). 

See above for instructions on [how to format your commit messages](#commit-message-format). 

#### Opening Pull Requests 

Create a Draft Pull Request to facilitate discussion and collaboration with quality assistance engineers and developers.

Once you are confident that the change is complete and ready to be merged:

1. Change the Pull Request from `Draft` to `Ready for review`.
2. The Pull Request title will be the commit message, it is important to follow the [commit message format](#commit-message-format) to name the Pull Request title properly. 
3. Add a Pull Request description:

   - Add a description of changes, decisions, backstory, thinking process, and any extra information to facilitate the review process and reduce follow-ups. 
   - Add videos or screenshots of the tests you did before submitting the Pull Request. This increases understanding of the work and allows the reviewers to catch any uncovered case.
   - Add the issue number, for example: `medic/cht-core#123`.

4. Do a self-code review before asking for a review. This is a good practice, as you will almost always find things to fix. It saves a lot of time for you and the reviewers.
5. Pick one reviewer for the PR and work with them until the code passes review. It is okay to include one additional reviewer who has more experience in a particular subject. 
   
   - Coordinate with a QA engineer and add them as reviewers when you need specific quality/testing support. For example, when major changes or new features are introduced to the codebase, security-related changes are made, and substantial user experience improvements are required. The QA engineer can advise whether that needs to be considered in the current e2e suite, they can advise on edge cases or other scenarios to consider for testing.
   
6. Follow up on your PR to keep momentum; the review should happen in 24h business days. If you haven't received feedback from the reviewers after that time, check if they are available. Otherwise, it's okay to request a review from another person.
7. Once the PR has been approved, wait for the GitHub Actions to succeed and ensure there are no conflicts with the main branch.
8. Double-check the [commit message format](#commit-message-format) is correct. Make sure to recognize collaboration in the commit description: `Co-authored-by: <GitHub user>`.
9. Merge your work by selecting `Squash and merge`. This will compress all the commits into one, keeping the repository's commit history clean.
   - If a backport is required, cherry-pick the merged commit back to the release branches it is required in.

### Code reviews

#### Guidelines

The author and reviewer should use [this guide to code reviewing](https://google.github.io/eng-practices/review/developer/).

##### Labeling review comments

The reviewer should prefix labels in the review comments wherever possible which clarify the intention of the comment and remove any misunderstanding that might happen. This helps prioritizing the comments that the author need to address.
 
The following labels taken from [conventional: comments](https://conventionalcomments.org/):

* **praise** - Praises highlight something positive. Try to leave at least one of these comments per review. Do not leave false praise (which can actually be damaging). Do look for something to sincerely praise.
* **nitpick** - Nitpicks are trivial preference-based requests. These should be non-blocking by nature.
* **suggestion** - Suggestions propose improvements to the current subject. It’s important to be explicit and clear on what is being suggested and why it is an improvement. Consider using patches and the blocking or non-blocking [decorations](https://conventionalcomments.org/#decorations) to further communicate your intent.
* **issue** - Issues highlight specific problems with the subject under review. These problems can be user-facing or behind the scenes. It is strongly recommended to pair this comment with a suggestion. If you are not sure if a problem exists or not, consider leaving a question.
* **todo** - TODO’s are small, trivial, but necessary changes. Distinguishing todo comments from issues: or suggestions: helps direct the reader’s attention to comments requiring more involvement.
* **question** - Questions are appropriate if you have a potential concern but are not quite sure if it’s relevant or not. Asking the author for clarification or investigation can lead to a quick resolution.
* **thought** - Thoughts represent an idea that popped up from reviewing. These comments are non-blocking by nature, but they are extremely valuable and can lead to more focused initiatives and mentoring opportunities.
* **chore** - Chores are simple tasks that must be done before the subject can be “officially” accepted. Usually, these comments reference some common process. Try to leave a link to the process description so that the reader knows how to resolve the chore.
* **note** - Notes are always non-blocking and simply highlight something the reader should take note of.


Sample comments:

{{< figure src="issue-comment.png" link="issue-comment.png" caption="Issue comment" >}}

{{< figure src="suggestion-comment.png" link="suggestion-comment.png" caption="Suggestion comment" >}}

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

{{< figure src="gh-review-suggestion.png" link="gh-review-suggestion.png" caption="GitHub review suggest change" >}}

#### Timeliness

Timely code reviews are important to getting improvements into the hands of users faster and allowing developers to stay focused on the task at hand and see it through to production.

Code reviews should be completed within 24 hours of assignment (excluding weekends and holidays). In some cases, a code review may not be possible if a larger discussion needs to be had for design choices or solution objectives, but even in cases like those, some feedback is still to be expected within 24 hours.

### Testing

Reach out to the Quality Assurance Engineers with the work to be done as early as possible in the development process to ensure they are informed and can guide development (see more in the [Quality Assistance](/community/contributing/code/quality-assistance) dedicated page).

Before asking for testing support from the QA Engineers, you should test your work after performing it. Correcting a small code error, such as a typo, or adding a missing step in the testing instructions could save QA Engineers hours of work. Also, by testing your code, you may get a better sense of why you make certain common mistakes, and learn to avoid repeating them in the future.

All features and bug fixes must have at least one unit test. All features must have at least one end-to-end test.

The CHT Core has a [fully automated end-to-end testing suite](https://github.com/medic/cht-core/tree/master/tests/e2e) which is executed in CI and must pass before any change is merged. This means you can have reasonable confidence that all code merged to the main branch is safe and ready for release without further regression testing. The suite isn't fully comprehensive but it is being constantly improved and expanded.

From time to time QA Engineers will perform smoke tests, scalability tests, performance tests, and penetration tests to pick up on gradual regressions that may have crept in. The ultimate goal is that these tests will eventually be automated and added to the CI suite as well.

Use the following template for QA feedback throughout the development.

{{< tabs items="Test passed,Test failed" >}}

  {{< tab >}}
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
  {{< tab >}}
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

{{< /tabs >}}

### Migrating

When the schema is changed you must also provide a migration so when instances are upgraded existing data is compatible with the new code.

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

```markdown
### Testing

1. Install branch `81-do-great-things`
2. [a specific thing to be sure it has been set up correctly]
3. ...


### What was actually built

[video|screenshots|text]


### Documentation

- [link](url)

```

### Closing an Issue
An issue is considered complete when:

 - The documentation is finalized.
   - It includes merged updates in CHT Docs, updated README files, and necessary code comments.
   - This is especially important as the CHT community can always access up-to-date documentation.  
 - Unit tests, e2e tests and/or integration tests are written.
 - The static checks like linting and Sonar should pass successfully as part of the quality process, and any issues should be fixed. 
 - The reviewers have approved the Pull Request.
 - All code has been merged into the main branch and/or release branches and are ready for release.
 - The issue is added to the appropriate release milestone, which is the earliest semver version the change will be released in. This ensures it will be included in the release notes.
 - Lastly, the issue status is updated to `Done`.
