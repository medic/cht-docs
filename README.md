# Documentation for the Community Health Toolkit

[![CHT Documentation Site Build](https://github.com/medic/cht-docs/workflows/CHT%20Documentation%20Site%20Build/badge.svg)](https://github.com/medic/cht-docs/actions)

## About

This repo contains documentation for the Community Health Toolkit (CHT), including how to build digital health applications with [CHT Core](https://github.com/medic/cht-core). This repository powers the CHT documentation site at [docs.communityhealthtoolkit.org](https://docs.communityhealthtoolkit.org).

The documentation is built using Markdown pages, which can be converted into a navigable website using a static-site-generator. The Hugo static-site-generator is being used with the [Hextra theme](https://themes.gohugo.io/themes/hextra/). To maintain portability, content should be written in plain Markdown with limited use of HTML, custom shortcodes, and modifications to the theme. Contributions should align with the [documentation style guide](https://docs.communityhealthtoolkit.org/contribute/docs/style-guide/).

## Build dependencies

The documentation site uses [Hugo](https://gohugo.io/) including the extended version of Hugo (see `.tool-versions` [file](https://github.com/medic/cht-docs/blob/main/.tool-versions) for specific version).

To proceed, choose one of the three options below of Docker, native packages or using `asdf` then proceed to ["Run Hugo" below](#run-hugo) to start your local instance.

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

## Link Checking

We have automatic link validation built into Hugo that checks all internal markdown links at build time, plus two optional external link checking tools:

* **Automatic internal link validation** - Hugo validates all markdown links during build (enabled by default)
* **All links** - tests all links within docs and outbound using Muffet
* **Internal links** - takes all internal links from [production site](https://docs.communityhealthtoolkit.org/) and tests them on your branch

### Automatic Internal Link Validation

The site uses a custom Hugo render hook that automatically validates all internal markdown links during the build process. This ensures that links to other pages, headings, and resources are correct before deployment.

#### Configuration

Link validation is controlled by two parameters in `hugo.toml`:

```toml
[params]
linkErrorLevel = "ERROR"    # ERROR, WARNING, or IGNORE
highlightBroken = true      # true or false (default: false)
```

**`linkErrorLevel`** - Controls what happens when a broken link is found:
- `"ERROR"` - Build fails with an error message. This project uses ERROR for production/CI.
- `"WARNING"` - Build succeeds but shows warning messages. Use this during development.
- `"IGNORE"` - Broken links are silently ignored (this is the render hook's default, but not recommended).

**`highlightBroken`** - When enabled, broken links are visually highlighted in development:
- Only works when `linkErrorLevel = "WARNING"` AND running in development mode
- Broken links get a yellow background with red border
- Makes it easy to spot broken links while fixing them

#### Development Workflow for Fixing Broken Links

When fixing multiple broken links, use this workflow to avoid restarting Hugo after each fix:

1. **Enable warning mode** in `hugo.toml`:
   ```toml
   [params]
   linkErrorLevel = "WARNING"
   highlightBroken = true
   ```

> ⚠️ **Never commit `linkErrorLevel = "WARNING"` to the main branch!** The CI build should always fail on broken links to maintain link integrity. Always revert to `"ERROR"` before committing.

2. **Start Hugo** (if not already running):
   ```bash
   docker compose up
   # or
   hugo server
   ```
   - Observe the terminal output - you'll see WARN messages for each broken link
   - The build will complete successfully despite the warnings

3. **Visit your local site** at http://localhost:1313/
   - Broken links will have a yellow background with red border
   - Hugo will continue running despite broken links

4. **Fix the links** in your markdown files:
   - Hugo will automatically reload as you save changes
   - The yellow highlighting will disappear as links are fixed
   - No need to restart Hugo between fixes

5. **Verify all links are fixed**:
   - Check that no yellow-highlighted links remain
   - Review the terminal output for any remaining warnings

6. **Revert to error mode** in `hugo.toml`:
   ```toml
   [params]
   linkErrorLevel = "ERROR"
   highlightBroken = true
   ```

> ⚠️ **Don't forget this step!** The build must fail on broken links in CI to maintain link integrity.

7. **Test the build**:
   - Restart Hugo to verify the build succeeds with no errors
   - If the build fails, return to step 3

8. **Commit your changes**

### All links, including outbound 

We validate that all links on the docs site work (do not 404) using a tool called [Muffet](https://github.com/raviqqe/muffet) along with [Actions](https://github.com/features/actions). If you're creating a lot of new links, or editing a lot of existing links, you may optionally run Muffet locally before pushing your commits. Running Muffet locally can save time by exposing broken links before pushing a build since you can avoid waiting for the Action to run, finding you have a broken link, fixing it, and pushing a new change.

#### Running

1. Start the docker container: `docker compose up -d`
2. Test the links with the [`muffet.sh`](https://github.com/medic/cht-docs/blob/main/.github/scripts/muffet.sh) script: `docker exec cht-hugo sh -c "cd .github/scripts/; ./muffet.sh"`
  
It can take many minutes depending on your Internet connection. If Muffet returns no output, you have no broken links, congrats! 

> [!NOTE] 
> The `muffet.sh` script here is the identical script we run on GitHub. If you simply run `muffet http://localhost:1313` you will hit GitHub's rate limiting and get lots of [429's](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429). Our script intentionally reduces concurrency and excludes some repetitive GitHub URLs.

#### Example

Note that you may see transient errors as shown here with lookup errors:


```shell
$ docker exec  cht-hugo sh -c "cd .github/scripts/; ./muffet.sh" 

http://localhost:1313/hosting/4.x/production/docker/adding-tls-certificates/
        lookup letsencrypt.org: i/o timeout     https://letsencrypt.org/
http://localhost:1313/technical-overview/concepts/offline-first/
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

> [!NOTE] 
> Note there is also a minimum version of Hugo required to deploy the site specified via `module.hugoVersion` in the [`hugo.toml`](./hugo.toml) file.

See the [Hugo Release Notes](https://github.com/gohugoio/hugo/releases) for documentation regarding what has changed in the new versions.

### Hextra

The current version of Hextra is pinned in the [`go.mod`](./go.mod) file. See the [Hextra Releases](https://github.com/imfing/hextra/releases) for documentation regarding what has changed in the new versions.
