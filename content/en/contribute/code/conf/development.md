---
title: "Development"
linkTitle: "Development"
weight: 1
description: >
  To develop a new action or improve an existing one, check the ["Actions" doc](https://github.com/medic/cht-conf/blob/main/src/fn/README.md).
---

# Testing

## Unit tests
Execute `npm test` to run static analysis checks and the test suite. Requires Docker to run integration tests against a CouchDB instance.

## End-to-end tests
Run `npm run test-e2e` to run the end-to-end test suite against an actual CHT instance locally. These tests rely on [CHT Docker Helper](https://docs.communityhealthtoolkit.org/hosting/4.x/app-developer/#cht-docker-helper-for-4x) to spin up and tear down an instance locally.

The code interfacing with CHT Docker Helper lives in [`test/e2e/cht-docker-utils.js`](https://github.com/medic/cht-conf/blob/main/test/e2e/cht-docker-utils.js). You should rely on the API exposed by this file to orchestrate CHT instances for testing purposes. It is preferable to keep the number of CHT instances orchestrated in E2E tests low as it takes a non-negligible amount of time to spin up an instance and can quickly lead to timeouts.

# Executing your local branch
1. Clone the project locally
2. Make changes to cht-conf or checkout a branch for testing
3. Test changes
    1. To test CLI changes locally you can run `node <project_dir>/src/bin/index.js`. This will run as if you installed via npm.
    2. To test changes that are imported in code run `npm install <project_dir>` to use the local version of cht-conf.

# Releasing
1. Create a pull request with prep for the new release.
2. Get the pull request reviewed and approved.
3. When doing the squash and merge, make sure that your commit message is clear and readable and follows the strict format described in the commit format section below. If the commit message does not comply, automatic release will fail.
4. In case you are planning to merge the pull request with a merge commit, make sure that every commit in your branch respects the format. 

## Commit format
The commit format should follow this [conventional-changelog angular preset](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular). Examples are provided below.

| Type        | Example commit message                                                                              | Release type |
|-------------|-----------------------------------------------------------------------------------------------------|--------------|
| Bug fixes   | fix(#123): infinite spinner when clicking contacts tab twice                                        | patch        |
| Performance | perf(#789): lazily loaded angular modules                                                           | patch        |
| Features    | feat(#456): add home tab                                                                            | minor        |
| Non-code    | chore(#123): update README                                                                          | none         |
| Breaking    | perf(#2): remove reporting rates feature <br/> BREAKING CHANGE: reporting rates no longer supported | major        |

## Releasing betas
1. Checkout the default branch, for example `main`
2. Run `npm version --no-git-tag-version <major>.<minor>.<patch>-beta.1`. This will only update the versions in `package.json` and `package-lock.json`. It will not create a git tag and not create an associated commit.
3. Run `npm publish --tag beta`. This will publish your beta tag to npm's beta channel.

To install from the beta channel, run `npm install cht-conf@beta`.

# Build status
Builds brought to you courtesy of GitHub actions.

<img src="https://github.com/medic/cht-conf/actions/workflows/build.yml/badge.svg">
