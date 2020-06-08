# Documentation for the Community Health Tookit

## About

This repo contains documentation for the Community Health Toolkit (CHT), and how to build digital health applications with [CHT Core](https://github.com/medic/cht-core).

The documentation is built using Markdown pages, which can be converted into a navigatable website using a static-site-generator. The Hugo static-site-generator is being used with the Docsy theme. To maintain portability content should be written in plain Markdown with limited use of HTML, custom shortcodes, and modifications to the theme. Contributions should align with the [documentation style guide](content/en/docs-style-guide.md).

## Installing Hugo

The documentation site uses [Hugo](https://gohugo.io/), and specifically uses features found in the extended version of Hugo, v0.53 and later.

To install, follow the [installation instructions for your Operating System](https://gohugo.io/getting-started/installing/), and be sure to get the extended version.

## Building the Documentation

1. Get local copies of the project submodules so you can build and run your site locally:
   - `git submodule update --init --recursive`

2. Build your site:
   - `hugo server`
   - If there are any errors, check that you have the latest version of Hugo, and are using the extended version.

3. Preview your site in your browser at: http://localhost:1313/

## Continuous Deployment

All changes to `master` branch run a [GitHub action](.github/workflows/ci.yml) to deploy the documentation site: [docs.communityhealthtoolkit.org](https://docs.communityhealthtoolkit.org)

![CHT Documentation Site Build](https://github.com/medic/cht-docs/workflows/CHT%20Documentation%20Site%20Build/badge.svg)
