---
title: "CHT App Configurer"
linkTitle: "CHT Conf"
weight: 4
description: >
  Instructions for setting up and contributing to CHT Conf
aliases: >
   /contribute/code/cht-conf
---

[CHT Conf](https://github.com/medic/cht-conf) is a command-line interface tool to manage and configure apps built using the [CHT Core Framework](https://github.com/medic/cht-core).

## Requirements
- nodejs 18 or later
- python 3
- Docker(optional)

## Installation

### Operating System Specific

{{< tabs items="Linux (Ubuntu),macOS,Windows (WSL2)" >}}

  {{< tab >}}
```shell
  npm install -g cht-conf
  sudo python -m pip install git+https://github.com/medic/pyxform.git@medic-conf-1.17#egg=pyxform-medic
```
  {{< /tab >}}
  {{< tab >}}
```shell
  npm install -g cht-conf
  pip install git+https://github.com/medic/pyxform.git@medic-conf-1.17#egg=pyxform-medic
```
  {{< /tab >}}
  {{< tab >}}
```shell
  # As Administrator:
  npm install -g cht-conf
  python -m pip install git+https://github.com/medic/pyxform.git@medic-conf-1.17#egg=pyxform-medic --upgrade
```
  {{< /tab >}}

{{< /tabs >}}

### Using Docker
CHT Conf can also be run from within a Docker container. This is useful if you are already familiar with Docker and do not wish to configure the various dependencies required for developing CHT apps on your local machine. The necessary dependencies are pre-packaged in the Docker image.

#### Using the image
The Docker image can be used as a [VS Code Development Container](https://code.visualstudio.com/docs/devcontainers/containers) (easiest) or as a standalone Docker utility.

Install [Docker](https://www.docker.com/). If you are using Windows, you also need to enable the [Windows Subsystem for Linux (WSL2)](https://learn.microsoft.com/en-us/windows/wsl/install) to perform the following steps.

##### VS Code Development Container
If you want to develop CHT apps with VS Code, you can use the Docker image as a Development Container. This will allow you to use the `cht-conf` utility and its associated tech stack from within VS Code (without needing to install dependencies like NodeJS on your host system).

Look through [Developing with VS Code Dev Container Documentation](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/#developing-with-vs-code-dev-container) to get more information .

##### Standalone Docker utility
If you are not using VS Code, you can use the Docker image as a standalone utility from the command line. Instead of using the `cht ...` command, you can run `docker run -it --rm -v "$PWD":/workdir medicmobile/cht-app-ide ....` This will create an ephemeral container with access to your current directory that will run the given cht command. (Do not include the `cht` part of the command, just your desired actions/parameters.)

Run the following command inside the project directory to bootstrap your new CHT project:
```shell
docker run -it --rm -v "$PWD":/workdir medicmobile/cht-app-ide initialise-project-layout
```

#### Note on connecting to a local CHT instance
When using `cht-conf` within a Docker container to connect to a CHT instance that is running on your local machine (e.g. a development instance), you cannot use the `--local` flag or `localhost` in your `--url` parameter (since these will be interpreted as "local to the container").

It is recommended to run a local CHT instance using the [CHT Docker Helper script](https://docs.communityhealthtoolkit.org/apps/guides/hosting/4.x/app-developer/). You can connect to the resulting `...my.local-ip.co` URL from the Docker container (or the VS Code terminal). Ensure the port your CHT instance is hosted on is not blocked by your firewall.

### Bash completion
To enable tab completion in bash, add the following to your `.bashrc`/`.bash_profile`:
```shell
eval "$(cht-conf --shell-completion=bash)"
```

### Upgrading
To upgrade to the latest version, run the command below. To view changes made to CHT Conf, view the [CHANGELOG](https://docs.communityhealthtoolkit.org/apps/guides/updates/preparing-for-4/#cht-conf).
```shell
npm update -g cht-conf
```

## Usage
`cht` will upload the configuration **from your current directory**.

### Specifying the server to configure
If you are using the default actionset, or performing any actions that require a CHT instance to function (e.g. `upload-xyz` or `backup-xyz` actions) you must specify the server you'd like to function against.

#### localhost
For developers, this is the instance defined in your `COUCH_URL` environment variable.
```shell
cht --local
```

#### A specific Medic-hosted instance
For configuring Medic-hosted instances.
```shell
cht --instance=instance-name.dev
```

Username `admin` is used. A prompt is shown for entering password.
If a different username is required, add the `--user` switch:
```shell
--user user-name --instance=instance-name.dev
```

#### An arbitrary URL
```shell
cht --url=https://username:password@example.com:12345
```
**NB** - When specifying the URL with `--url`, be sure not to specify the CouchDB database name in the URL. The CHT API will find the correct database.

#### Using a session token for authentication
CHT Conf supports authentication using a session token by adding `--session-token` parameter:
```shell
cht --url=https://example.com:12345 --session-token=*my_token*
```

The `my_token` can be obtained by doing a POST request to `/_session` [endpoint](https://docs.couchdb.org/en/stable/api/server/authn.html#cookie-authentication) with `name` and `password` as form parameters.  

For example, if your CHT instance is `my.cht.com`, you could use this `curl` call to specify your user `medic` and your password `secret123` to retrieve the header with the `AuthSession` value which is the token:

```shell
curl -v  -H 'Content-Type: application/json' -d '{"name":"medic","password":"secret123"}'  https://my.cht.com/_session 2>&1 | grep AuthSession 
< set-cookie: AuthSession=bWVkaWM6NjdBRTM4MkE6EguRnzpSiK0t8wFaOQ_jgkZE8UWcgNWgpyStzbbHreI; Version=1; Expires=Fri, 13-Feb-2026 18:21:30 GMT; Max-Age=31536000; Path=/; HttpOnly
```

#### Into an archive to be uploaded later
```shell
cht --archive
```
The resulting archive is consumable by CHT API >v3.7 to create default configurations.

### Perform specific action(s)
```shell
cht <--archive|--local|--instance=instance-name|--url=url> <...action>
```
The list of available actions can be seen via `cht --help`.

### Perform actions for specific forms
```shell
cht <--local|--instance=instance-name|--url=url> <...action> -- <...form>
```

### Protecting against configuration overwriting
_Added in v3.2.0_
In order to avoid overwriting someone else's configuration cht-conf records the last uploaded configuration snapshot in the `.snapshots` directory. The `remote.json` file should be committed to your repository along with the associated configuration change. When uploading future configuration if cht-conf detects the snapshot doesn't match the configuration on the server you will be prompted to overwrite or cancel.

## Development
To develop a new command that is part of cht-conf, or improve an existing one. For more information check ["Actions" doc](https://github.com/medic/cht-conf/blob/main/src/fn/README.md).


### Testing

#### Unit tests
Execute `npm test` to run static analysis checks and the test suite. Requires Docker to run integration tests against a CouchDB instance.

#### End-to-end tests
Run `npm run test-e2e` to run the end-to-end test suite against an actual CHT instance locally. These tests rely on [CHT Docker Helper](https://docs.communityhealthtoolkit.org/hosting/4.x/app-developer/#cht-docker-helper-for-4x) to spin up and tear down an instance locally.

The code interfacing with CHT Docker Helper lives in [`test/e2e/cht-docker-utils.js`](https://github.com/medic/cht-conf/blob/main/test/e2e/cht-docker-utils.js). You should rely on the API exposed by this file to orchestrate CHT instances for testing purposes. It is preferable to keep the number of CHT instances orchestrated in E2E tests low as it takes a non-negligible amount of time to spin up an instance and can quickly lead to timeouts.

### Executing your local branch
1. Clone the project locally
2. Make changes to cht-conf or checkout a branch for testing
3. Test changes
    1. To test CLI changes locally you can run `node <project_dir>/src/bin/index.js`. This will run as if you installed via npm.
    2. To test changes that are imported in code run `npm install <project_dir>` to use the local version of cht-conf.

### Releasing
1. Create a pull request with prep for the new release.
2. Get the pull request reviewed and approved.
3. When doing the squash and merge, make sure that your commit message is clear and readable and follows the strict format described in the commit format section below. If the commit message does not comply, automatic release will fail.
4. In case you are planning to merge the pull request with a merge commit, make sure that every commit in your branch respects the format.

#### Commit format
The commit format should follow this [conventional-changelog angular preset](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular). Examples are provided below.

| Type        | Example commit message                                                                              | Release type |
|-------------|-----------------------------------------------------------------------------------------------------|--------------|
| Bug fixes   | fix(#123): infinite spinner when clicking contacts tab twice                                        | patch        |
| Performance | perf(#789): lazily loaded angular modules                                                           | patch        |
| Features    | feat(#456): add home tab                                                                            | minor        |
| Non-code    | chore(#123): update README                                                                          | none         |
| Breaking    | perf(#2): remove reporting rates feature <br/> BREAKING CHANGE: reporting rates no longer supported | major        |

#### Releasing betas
1. Checkout the default branch, for example `main`
2. Run `npm version --no-git-tag-version <major>.<minor>.<patch>-beta.1`. This will only update the versions in `package.json` and `package-lock.json`. It will not create a git tag and not create an associated commit.
3. Run `npm publish --tag beta`. This will publish your beta tag to npm's beta channel.

To install from the beta channel, run `npm install cht-conf@beta`.

### Build status
Builds brought to you courtesy of GitHub actions.
{{< figure src="build-status.png" link="build-status.png" class=" center col-4 col-lg-4" >}}
