---
title: "Build commands"
linkTitle: "Build Commands"
weight: 2
aliases: >
  /contribute/code/core/build-commands
---

{{< hextra/hero-subtitle >}}
  All commands available for executing to build, test, and deploy CHT Core Framework
{{< /hextra/hero-subtitle >}}

## CHT Core build commands

These commands are defined in the `package.json` and can be executed with `npm run <command>` from the cht-core repository directory.

### Development build commands

For developers (humans) to execute to build `cht-core`.

| Command                 | Description                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------|
| `build-ddocs`           | Compiles all the DDocs and outputs them into `/api/build/ddocs` ready for deployment.             |
| `build-dev`             | Updates dependencies and builds all the applications.                                             |
| `build-dev-watch`       | Same as `build-dev`, but keeps watching for any code changes and automatically deploys on change. |
| `build-documentation`   | Executes jsdoc on all the applications.                                                           |
| `build-webapp-dev`      | Compiles the `/webapp` application.                                                               |
| `build-cht-form`        | Compiles the `cht-form` web component.                                                            |
| `copy-api-resources`    | Copies the static api files into the `api` build directory ready for deployment.                  |
| `dev-api`               | Sets up and runs the `api` server, and automatically deploys source changes.                      |
| `dev-sentinel`          | Sets up and runs the `sentinel` server, and automatically deploys source changes.                 |
| `local-images`          | Builds the docker images and updates the docker compose files.                                    |
| `update-service-worker` | Updates the service worker file for deployment.                                                   |

### Development test commands

For developers to execute to test `cht-core`.

| Command                       | Description                                                                             |
|-------------------------------|-----------------------------------------------------------------------------------------|
| `integration-all-local`       | Compiles the app and executes the integration test suite except for the sentinel tests. |
| `integration-api`             | Compiles the app and executes the api integration test suite.                           |
| `integration-sentinel-local`  | Compiles the app and executes the sentinel integration test suite.                      |
| `lint`                        | Performs static analysis checks on the codebase.                                        |
| `test`                        | Same as running `lint`, `unit`, and `integration-api`.                                  |
| `unit`                        | Executes unit test suites for all applications.                                         |
| `unit-admin`                  | Executes the unit test suite on `admin`.                                                |
| `unit-api`                    | Executes the unit test suite on `api`.                                                  |
| `unit-sentinel`               | Executes the unit test suite on `sentinel`.                                             |
| `unit-shared-lib`             | Executes the unit test suite on all `shared-lib` modules.                               |
| `unit-webapp`                 | Executes the unit test suite on `webapp`.                                               |
| `unit-webapp-continuous`      | Executes the unit test suite on `webapp`, and re-runs on code change.                   |
| `wdio-default-mobile-local`   | Compiles the app and executes the mobile e2e test suite.                                |
| `wdio-local`                  | Compiles the app and executes the default e2e test suite.                               |
| `wdio-standard-local`         | Compiles the app and executes the standard e2e test suite.                              |
| `wdio-cht-form`               | Executes the default e2e test suite on code change.                                     |

### CI commands

For Continuous Integration (robots) to run to build and test `cht-core`.

| Command                       | Description |
| ----------------------------- | -- |
| `build`                       | Compiles, minifies, bundles the code, and builds the DDocs for publishing. |
| `ci-compile`                  | Builds, does static analysis, and runs unit tests for all applications. |
| `ci-e2e-integration`          | Executes the integration e2e test suite. |
| `ci-webdriver-default`        | Executes the default e2e test suite. |
| `ci-webdriver-default-mobile` | Executes the mobile e2e test suite. |
| `ci-webdriver-standard`       | Executes the standard e2e test suite. |
| `publish-for-testing`         | Builds docker images and publishes to the staging server for use in e2e test builds. |
| `test-config-default`         | Executes the default config test suite. |
| `test-config-standard`        | Executes the standard config test suite. |
| `upgrade-wdio`                | Executes the upgrade e2e test suite. |
