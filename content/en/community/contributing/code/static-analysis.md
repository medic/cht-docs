---
title: "Static Analysis"
linkTitle: "Static Analysis"
weight: 11
description: >
  Guidelines for static analysis of CHT code
aliases: >
  /contribute/code/static-analysis
---

## Zizmor

[Zizmor](https://github.com/woodruffw/zizmor) is a static analysis tool for GitHub Actions workflows. It catches security issues that code-focused linters miss, including:

- **Unpinned action references** — actions pinned by tag (for example, `actions/checkout@v4`) can silently change if the tag is moved; pinning to a full 40-character commit SHA prevents this
- **Missing or overly permissive `permissions` blocks** — restricting each workflow's token permissions limits the blast radius of a compromised workflow
- **Script injection** — GitHub context values (for example, `${{ github.event.pull_request.title }}`) used directly in `run:` steps can be exploited; moving them to environment variables neutralises the risk
- **Cache poisoning** — workflows triggered by pull requests that use caching can be exploited by a malicious fork PR to poison the cache

### CI workflow

Zizmor runs automatically on every pull request and push to `master`:

| Trigger | Mode | Output |
|---------|------|--------|
| Pull request | `--offline` (no GitHub API calls) | Workflow annotations |
| Push to `master` | Online | SARIF report uploaded to the repository **Security** tab |

The CI configuration lives in `.github/workflows/zizmor.yml` and the suppression config in `.github/zizmor.yml`.

### Keeping action hashes current

All action references in CHT Core are pinned to a full 40-character commit SHA with the human-readable version in a comment, for example:

```yaml
- uses: actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5  # v4
```

[Dependabot](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot) keeps these hashes current automatically. It is configured in `.github/dependabot.yml` for the `github-actions` ecosystem and opens pull requests on a weekly schedule (Saturdays) when new action versions are released. A cooldown is configured so patch updates are applied after 3 days, minor after 7 days, and major after 14 days — all Dependabot PRs go through normal code review before merging.

### Running locally

```bash
pip install zizmor
zizmor --offline .github/workflows/
```

Running in `--offline` mode does not require a GitHub token and is sufficient to catch most issues.

### Handling findings

When zizmor flags an issue in your pull request:

1. **If the issue is a genuine concern**: fix it before merging. Common fixes are:
   - Pin an action to a commit SHA (see [Keeping action hashes current](#keeping-action-hashes-current))
   - Add a `permissions` block scoped to only what the job needs
   - Move a `${{ github.* }}` expression to an `env:` variable so it is never interpolated directly in a shell command
1. **If the finding is an accepted low-risk exception**, suppress it using one of two methods:
   - **Inline comment** (preferred for a single line): add `# zizmor: ignore[rule-name]` at the end of the flagged line in the workflow file
   - **Config file** (preferred for an entire file): add an entry to `.github/zizmor.yml` under the relevant rule's `ignore:` list

   In both cases, add a comment explaining why the finding is acceptable and the date the risk was accepted, so the reasoning is preserved for future reviewers.

## ESLint

All code must pass an eslint check which runs early in the CI cycle and uses the [standard Medic ESLint configuration](https://github.com/medic/eslint-config).

### Linting

You should always lint your code locally before pushing it up the GitHub. Choose one of:

* ESLint has [plugins/integrations](https://eslint.org/docs/latest/use/integrations) for many IDEs that will report linting issues in real-time.
* CHT Core has a script to run at the command line, by calling `npm run lint` while in the `cht-core` repository.  Be sure you've run the [Core dev setup first](/community/contributing/code/core/dev-environment)! Note that the first time you run this it might be slow, as it needs to download and cache some files.  Subsequent runs should be quite fast.

## Sonar

[Sonar](https://www.sonarsource.com/) static analysis supports development by providing feedback on code quality and security issues. Sonar analysis must pass on all _new code_.

[SonarCloud](https://www.sonarsource.com/products/sonarcloud/) can be enabled on any public repo in the `medic` organization.

### Workflow

#### During development

While writing code, the [SonarLint](https://www.sonarsource.com/products/sonarlint/) plugin can be used to get real-time code analysis in your IDE. This is useful to avoid committing code with Sonar issues in the first place.

#### PR Analysis

SonarCloud is integrated with the CHT GitHub repositories and runs on every pull request. The results are posted as a comment on the pull request. If the Sonar analysis fails the quality check, the pull request will be blocked from merging.

##### What should I do if Sonar finds an issue?

When Sonar flags an issue with the code in your pull request, use this decision tree to determine the proper mitigation:

1. If the issue is a genuine concern that should be addressed:
   1. Fix it and push the updated code to your PR. The PR will automatically be unblocked once the Sonar analysis succeeds.
1. If the issue is a "false-positive" (i.e. Sonar has flagged some particular code as violating a rule, but it does not make sense to apply the rule in that context):
   1. If the rule is one that should not be applied to any CHT code:
      1. [Remove the rule](#removing-a-rule) from the default Quality Profile.
   1. If it does not make sense to apply the rule to this particular code, you can do one of the following:
      1. Completely ignore Sonar issues [on that line of code](https://docs.sonarsource.com/sonarqube-server/latest/user-guide/issues/managing/) by adding the `// NOSONAR` comment to the end of the line.
      1. Completely ignore Sonar issues for [that block of code](#ignoring-all-rules-for-a-block-of-code).
      1. Update the `.sonarcloud.properties` to [ignore _that rule_ for that particular file](#ignoring-a-specific-rule-for-a-file).
      1. Update the `.sonarcloud.properties` to [ignore _all rules_ for that particular file](#ignoring-all-rules-for-a-file) (useful if the file has been copied from an external dependency).

### Adding a new repo to SonarCloud

1. Add a `.sonarcloud.properties` file to the repository with your desired [repo-level configuration](#ignoring-all-rules-for-a-file).
2. In the GitHub UI, navigate to the settings for the [`medic` org > Third-party Access > GitHub Apps](https://github.com/organizations/medic/settings/installations)
3. Find SonarCloud and click the `Configure` button.
4. In the Repository access section, select your desired repository from the drop-down and click `Save`.
5. You will be automatically redirected to the SonarCloud UI where you can configure the repo-level settings.
6. Use the `+` button and choose `Analyze new project`.
7. Select the repo from the list and click `Set Up`.
8. In the SonarCloud configuration, [disable summary comments in GitHub PRs](https://github.com/medic/cht-sync/pull/68#issuecomment-1935677776).

#### New Code Definition

When setting up a new repository in SonarCloud, you will be asked to define what is considered to be "new code". This is used to determine which code in the default branch is considered "new" (affects reporting of issues, etc). The new code definition is not applied to Sonar analysis of a PR. In that case, only the changes in the PR are considered "new".

Consult [the documentation](https://docs.sonarsource.com/sonarqube-cloud/standards/about-new-code/) for more details on the options available. For projects that do not use Gradle or Maven for version management, the `Number of days` option is recommended (since `Previous version` would require maintaining a version number in the `.sonarcloud.properties` file).

If you are using the `CHT Way` quality gate (or a similar zero-tolerance quality gate) it is recommended to set `Number of days = 1`. With a zero-tolerance quality gate, only issue-free code can be merged to the default branch. So, there is no need to check for issues accumulated over time. Also, having a higher `Number of days` opens up a greater opportunity for Sonar to introduce a _new rule_ that will fail some code previously added to the default branch (code that is only included in the latest analysis because of the configured `Number of days`).

### Sonar Configuration

Broadly speaking, Sonar configuration is separated into repo-level and org-level configuration.

#### Repo-level configuration

Each repository can include a `.sonarcloud.properties` file in the root directory.

This file must specify the path to the source code in the repository as well as which source files should be considered to be test code. See [the documentation](https://docs.sonarsource.com/sonarqube-cloud/managing-your-projects/project-analysis/setting-analysis-scope/introduction/) for more details.

```properties
# Path to sources
sonar.sources=.
# Can have multiple comma-separated entries
sonar.exclusions=**/test*/**/*

# Path to tests
sonar.tests=.
# Can have multiple comma-separated entries
sonar.test.inclusions=**/test*/**/*
```

Additionally, the `.sonarcloud.properties` file can contain configuration regarding ignoring certain rules.

##### Ignoring all rules for a block of code

You can ignore all the rules for a block of code by telling Sonar to [ignore the block](https://docs.sonarsource.com/sonarqube-cloud/managing-your-projects/project-analysis/setting-analysis-scope/advanced-exclusions/). First, make sure your `.sonarcloud.properties` file has the following configuration:

```properties
sonar.issue.ignore.block=e1
sonar.issue.ignore.block.e1.beginBlockRegexp=NOSONAR_BEGIN
sonar.issue.ignore.block.e1.endBlockRegexp=NOSONAR_END
```

Then simply put `//NOSONAR_BEGIN` before the block to ignore and `//NOSONAR_END` after the block.

##### Ignoring all rules for a file

Use the following properties to completely ignore all rules for one or more files:

```properties
sonar.issue.ignore.allfile=r1
sonar.issue.ignore.allfile.r1.fileRegexp=**/openrosa2html5form.xsl
```

##### Ignoring a specific rule for a file
Use the following properties to ignore a specific rule for one or more files:

```properties
sonar.issue.ignore.multicriteria=e1,e2
sonar.issue.ignore.multicriteria.e1.ruleKey=javascript:S6582
sonar.issue.ignore.multicriteria.e1.resourceKey=**/auth.js
sonar.issue.ignore.multicriteria.e2.ruleKey=javascript:S2699
sonar.issue.ignore.multicriteria.e2.resourceKey=**/config.js
```

#### Org-level configuration

Organization-level configuration must be made by an authorized user in the [SonarCloud UI](https://sonarcloud.io/projects).

##### Quality Gates

Quality gates are used to define the criteria that must be met for a Sonar analysis to be considered "passing". The [`Sonar way` quality gate](https://docs.sonarcloud.io/improving/quality-gates/#how-quality-gates-are-defined) provides an example of a useful configuration. However, this gate config is not ideal for CHT code. Instead, the default quality gate for the `Medic` organization is the `CHT Way`.  It has the following [metrics](https://docs.sonarsource.com/sonarqube/latest/user-guide/metric-definitions/):


| Metric                     | Operator        | Value |
|----------------------------|-----------------|-------|
| Duplicated Lines (%)       | is greater than | 6.0%  |
| Issues                     | is greater than | 0     |
| Reliability Rating         | is worse than   | A     |
| Security Hotspots Reviewed | is less than    | 100%  |
| Security Rating            | is worse than   | A     |

##### Quality Profiles

The quality profiles are the lists of rules that will be applied for the various supported languages. By default, we use the `Sonar Way` quality profile for each language as it provides sensible defaults and is actively maintained receiving updates with new rules and bug fixes as they are added to Sonar.

###### Modifying rule parameters

To modify a rule parameter (e.g. change the allowed level of complexity for a function [according to `javascript:S3776`](https://web.archive.org/web/20250720035236/https://rules.sonarsource.com/javascript/RSPEC-3776/)):

1. Open a cht-docs PR to record your rule modification in the list below. This allows us to track the history of rule changes and record for posterity the discussions about them.
1. If not already using a custom quality profile, use the SonarCloud UI to create one that _extends_ the `Sonar Way` profile.
    1. Make sure to set the new quality profile as the default for that language, if desired.
1. Open the rule in question in the SonarCloud UI and use the `Change` button associated with your quality profile to set your custom parameter value for the rule.

###### Adding a rule

To include a new rule in the code analysis, add it to the quality profile:

1. Open a cht-docs PR to record your rule addition in the list below. This allows us to track the history of rule changes and record for posterity the discussions about them.
1. If not already using a custom quality profile, use the SonarCloud UI to create one that _extends_ the `Sonar Way` profile.
    1. Make sure to set the new quality profile as the default for that language, if desired.
1. Open the rule in question in the SonarCloud UI and use the `Activate` button to activate the rule in your quality profile

###### Removing a rule

Removing a rule should only be done as a last resort. It is not possible to remove a rule inherited from the `Sonar Way` profile while at the same time still _extending_ that profile. So, future updates to the `Sonar Way` profile will not be applied to your custom profile after a rule has been removed.

1. Open a cht-docs PR to record your rule removal in the list below. This allows us to track the history of rule changes and record for posterity the discussions about them.
1. If not already using a custom quality profile, use the SonarCloud UI to _copy_ (not extend) the `Sonar Way` profile into a new profile.
    1. Make sure to set the new quality profile as the default for that language, if desired.
1. Open the rule in question in the SonarCloud UI and use the `Activate` button to activate the rule in your quality profile

###### Custom CHT Quality Profiles

Java:

- **CHT Way**  _(default)_ extends **Sonar Way**
  - Modified:
    - [`S107`](https://web.archive.org/web/20251113054741/https://rules.sonarsource.com/javascript/RSPEC-107/) - Functions should not have too many parameters
      - `threshold` 7 -> 4
    - [`S3776`](https://web.archive.org/web/20250720035236/https://rules.sonarsource.com/javascript/RSPEC-3776/) - Cognitive Complexity of functions should not be too high
      - `threshold` 15 -> 5

JavaScript:

- **CHT Way**  _(default)_ extends **Sonar Way**
   - Modified:
      - [`S107`](https://web.archive.org/web/20251113054741/https://rules.sonarsource.com/javascript/RSPEC-107/) - Functions should not have too many parameters
         - `threshold` 7 -> 4
      - [`S3776`](https://web.archive.org/web/20250720035236/https://rules.sonarsource.com/javascript/RSPEC-3776/) - Cognitive Complexity of functions should not be too high
         - `threshold` 15 -> 5
   - Disabled
      - [`S2699`](https://web.archive.org/web/20251017003858/https://rules.sonarsource.com/javascript/RSPEC-2699/) - Tests should include assertions
         - Disabled due of rigidity of the rule when detecting `expect` imports and calls to imported functions that have assertions
      - [`S7728`](https://community.sonarsource.com/t/use-for-of-instead-of-foreach-typescript-s7728/151980/5) - Use "for...of" loops instead of "forEach" method calls
          - Disabled because the readability benefits of `forEach` typically outweigh the downsides (especially when chaining with `map` and `filter`)

Python:

- **CHT Way**  _(default)_ extends **Sonar Way**
   - Modified:
      - [`S107`](https://web.archive.org/web/20251113054741/https://rules.sonarsource.com/javascript/RSPEC-107/) - Functions should not have too many parameters
         - `threshold` 7 -> 4
      - [`S3776`](https://web.archive.org/web/20250720035236/https://rules.sonarsource.com/javascript/RSPEC-3776/) - Cognitive Complexity of functions should not be too high
         - `threshold` 15 -> 5

TypeScript:

- **CHT Way**  _(default)_ extends **Sonar Way**
   - Modified:
      - [`S107`](https://web.archive.org/web/20251113054741/https://rules.sonarsource.com/javascript/RSPEC-107/) - Functions should not have too many parameters
         - `threshold` 7 -> 4
      - [`S3776`](https://web.archive.org/web/20250720035236/https://rules.sonarsource.com/javascript/RSPEC-3776/) - Cognitive Complexity of functions should not be too high
         - `threshold` 15 -> 5
   - Disabled
       - [`S7728`](https://community.sonarsource.com/t/use-for-of-instead-of-foreach-typescript-s7728/151980/5) - Use "for...of" loops instead of "forEach" method calls
           - Disabled beacuse the readability benefits of `forEach` typically outweigh the downsides (especially when chaining with `map` and `filter`)
