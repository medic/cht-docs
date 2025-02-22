# Documentation for the Community Health Toolkit

[![CHT Documentation Site Build](https://github.com/medic/cht-docs/workflows/CHT%20Documentation%20Site%20Build/badge.svg)](https://github.com/medic/cht-docs/actions)

## About

This repo contains documentation for the Community Health Toolkit (CHT), and how to build digital health applications with [CHT Core](https://github.com/medic/cht-core). This repository powers the CHT documentation site at [docs.communityhealthtoolkit.org](https://docs.communityhealthtoolkit.org).

The documentation is built using Markdown pages, which can be converted into a navigable website using a static-site-generator. The Hugo static-site-generator is being used with the [Docsy theme](https://themes.gohugo.io/docsy/). To maintain portability, content should be written in plain Markdown with limited use of HTML, custom shortcodes, and modifications to the theme. Contributions should align with the [documentation style guide](https://docs.communityhealthtoolkit.org/contribute/docs/style-guide/).

## Build dependencies

The documentation site uses [Hugo](https://gohugo.io/) including the extended version of Hugo (see `.tool-versions` [file](https://github.com/medic/cht-docs/blob/main/.tool-versions) for specific version).

To proceed, please choose one of the three options below of Docker, native packages or using `asdf` then proceed to ["Run Hugo" below](#run-hugo) to start your local instance.

For folks using `asdf` and native packages, be sure the correct `hugo` version is installed per `.tool-versions` [file](https://github.com/medic/cht-docs/blob/main/.tool-versions).

### Docker

Running `hugo` locally using Docker is likely the easiest way to update the docs.  You only need to ensure you have [Docker and Docker compose installed](https://docs.docker.com/compose/install/).

The steps below will leave a hugo container on your system.  If you're not going to edit docs for the foreseeable future, you can delete it with `docker rm cht-hugo `.

### Native packages

If you'd like to install packages directly on your workstation, follow the [installation instructions for your Operating System](https://gohugo.io/getting-started/installing/), and be sure to get the extended version. Most users will be able to simply install using their native package manager like `brew`, `apt` or `snap`.

### `asdf` version manager

[asdf](https://asdf-vm.com/guide/getting-started.html) is another way to manage `hugo` and `golang` versions for local development.

After installing `asdf`, run:
```shell
asdf plugin add golang
asdf plugin add hugo
```

### Run Hugo

You can start your local CHT Docs instance by:

1. Clone the `cht-docs` repo
2. From the command line, navigate to the local directory where you cloned the repo
3. To start `hugo` run:
   * `hugo server` for `asdf` and native packages **OR**
   * `docker compose up` for Docker compose
4. Preview your site in your browser at: http://localhost:1313/
5. As you make changes to the site, your browser will automatically reload your changes.

Any users who experience errors running `hugo server`, please see our [Troubleshooting guide](./troubleshooting.md).

## Link Checking [Optional]

We have two types of link checking:

* All links - tests all links within docs and outbound
* Internal links - takes all internal links from [production site](https://docs.communityhealthtoolkit.org/) and tests them on your branch

### All links, including outbound 

We validate that all links on the docs site work (do not 404) using a tool called [Muffet](https://github.com/raviqqe/muffet) along with [Actions](https://github.com/features/actions). If you're creating a lot of new links, or editing a lot of existing links, you may optionally run Muffet locally before pushing your commits. Running Muffet locally can save time by exposing broken links before pushing a build since you can avoid waiting for the Action to run, finding you have a broken link, fixing it, and pushing a new change.

#### Running

1. Start the docker container: `docker compose up -d`
2. Test the links with the [`muffet.sh`](https://github.com/medic/cht-docs/blob/main/.github/scripts/muffet.sh) script: `docker exec cht-hugo sh -c "cd .github/scripts/; ./muffet.sh"`
  
It can take many minutes depending on your Internet connection. If Muffet returns no output, you have no broken links, congrats! 

_Note_: The `muffet.sh` script here is the identical script we run on GitHub. If you simply run `muffet http://localhost:1313` you will hit GitHub's rate limiting and get lots of [429's](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429). Our script intentionally reduces concurrency and excludes some repetitive GitHub URLs.

#### Example

Note that you may see transient errors as shown here with lookup errors:


```shell
$ docker exec  cht-hugo sh -c "cd .github/scripts/; ./muffet.sh" 

http://localhost:1313/hosting/4.x/production/docker/adding-tls-certificates/
        lookup letsencrypt.org: i/o timeout     https://letsencrypt.org/
http://localhost:1313/core/overview/offline-first/
        lookup blog.couchdb.org: i/o timeout    https://blog.couchdb.org/2017/09/19/couchdb-takes-medic-mobile-to-the-front-lines-of-healthcare-work/
http://localhost:1313/hosting/monitoring/production/
        lookup letsencrypt.org: i/o timeout     https://letsencrypt.org/
http://localhost:1313/building/forms/app/
        lookup www.w3.org: i/o timeout  https://www.w3.org/TR/1999/REC-xpath-19991116/ 
```

### Internal links after major re-organization

If you're moving more than ~5 pages around, you should check that they either correctly redirect with the `aliases` [feature](https://hugo-docs.netlify.app/en/content-management/urls/#aliases) or 404 if the page is indeed removed with no replacement.  There's a script that will get all the URLs from the [production site](https://docs.communityhealthtoolkit.org/) and then check your branch for the result of every URL.  If it gets a `200` with no redirect, nothing is shown.  All other results, like `404` or a `200` which results in a redirect are shown.

This is mainly to help preserve SEO and to help folks who bookmark specific pages.  

#### Running

1. Make your changes, for example moving 10s of pages to a new location
2. Check that `hugo` compiles and doesn't complain of any broken links
3. Start the docker container: `docker compose up -d`
4. Test the links with the bash script: `docker exec cht-hugo .github/scripts/check.urls.sh`

#### Example

```shell
$ docker exec  cht-hugo .github/scripts/check.urls.sh           

Are you on a test branch and is hugo running on http://localhost:1313 ?

Fetching URLs from production.

Checking 435 URLs, be patient.  Any non 200 URLs will be listed here:

Successfully checked 435 URLs!
```

## Continuous Deployment

All changes to `main` branch run a [GitHub action](.github/workflows/ci.yml) to first check for any broken links ([per above](#link-checking-optional)) and then deploy to the documentation site: [docs.communityhealthtoolkit.org](https://docs.communityhealthtoolkit.org)

## Upgrading dependencies

### Hugo

The version of Hugo used to deploy the site is specified in `.tool-versions`. 

_(Note there is also a minimum version of Hugo required to deploy the site specified via `module.hugoVersion` in the [`hugo.toml`](./hugo.toml) file.)_

See the [Hugo Release Notes](https://github.com/gohugoio/hugo/releases) for documentation regarding what has changed in the new versions.

### Docsy

The current version of Docsy is pinned in the [`go.mod`](./go.mod) file. To upgrade to a new version of Docsy, use the `hugo mod get` command as described [in the Docsy documentation](https://www.docsy.dev/docs/updating/updating-hugo-module/).

See the [Docsy CHANGELOG](https://github.com/google/docsy/blob/main/CHANGELOG.md) for documentation regarding what has changed in the new versions.
