---
title: "CHT Conf installation"
linkTitle: "CHT Conf installation"
weight: 1
description: >
  Installing the CHT Conf in your local environment.
---

# Requirements
- nodejs 18 or later
- python 3
- Docker(optional)

# Installation

## Operating System Specific

{{< tabpane persistLang=false lang=shell >}}
{{< tab header="Linux (Ubuntu)" >}}
npm install -g cht-conf
sudo python -m pip install git+https://github.com/medic/pyxform.git@medic-conf-1.17#egg=pyxform-medic
{{< /tab >}}
{{< tab header="macOS" >}}
npm install -g cht-conf
pip install git+https://github.com/medic/pyxform.git@medic-conf-1.17#egg=pyxform-medic
{{< /tab >}}
{{< tab header="Windows (WSL2)" >}}
# As Administrator:
npm install -g cht-conf
python -m pip install git+https://github.com/medic/pyxform.git@medic-conf-1.17#egg=pyxform-medic --upgrade
{{< /tab >}}
{{< /tabpane >}}

## Using Docker
CHT Conf can also be run from within a Docker container. This is useful if you are already familiar with Docker and do not wish to configure the various dependencies required for developing CHT apps on your local machine. The necessary dependencies are pre-packaged in the Docker image.

### Using the image
The Docker image can be used as a [VS Code Development Container](https://code.visualstudio.com/docs/devcontainers/containers) (easiest) or as a standalone Docker utility.

Install [Docker](https://www.docker.com/). If you are using Windows, you also need to enable the [Windows Subsystem for Linux (WSL2)](https://learn.microsoft.com/en-us/windows/wsl/install) to perform the following steps.

#### VS Code Development Container
If you want to develop CHT apps with VS Code, you can use the Docker image as a Development Container. This will allow you to use the `cht-conf` utility and its associated tech stack from within VS Code (without needing to install dependencies like NodeJS on your host system).

Look through [Developing with VS Code Dev Container Documentation](https://docs.communityhealthtoolkit.org/apps/tutorials/local-setup/#developing-with-vs-code-dev-container) to get more information .

#### Standalone Docker utility
If you are not using VS Code, you can use the Docker image as a standalone utility from the command line. Instead of using the `cht ...` command, you can run `docker run -it --rm -v "$PWD":/workdir medicmobile/cht-app-ide ....` This will create an ephemeral container with access to your current directory that will run the given cht command. (Do not include the `cht` part of the command, just your desired actions/parameters.)

Run the following command inside the project directory to bootstrap your new CHT project:
```shell
docker run -it --rm -v "$PWD":/workdir medicmobile/cht-app-ide initialise-project-layout
```

### Note on connecting to a local CHT instance
When using `cht-conf` within a Docker container to connect to a CHT instance that is running on your local machine (e.g. a development instance), you cannot use the `--local` flag or `localhost` in your `--url` parameter (since these will be interpreted as "local to the container").

It is recommended to run a local CHT instance using the [CHT Docker Helper script](https://docs.communityhealthtoolkit.org/apps/guides/hosting/4.x/app-developer/). You can connect to the resulting `...my.local-ip.co` URL from the Docker container (or the VS Code terminal). Ensure the port your CHT instance is hosted on is not blocked by your firewall.

## Bash completion
To enable tab completion in bash, add the following to your `.bashrc`/`.bash_profile`:
```shell
eval "$(cht-conf --shell-completion=bash)"
```

## Upgrading
To upgrade to the latest version, run the command below. To view changes made to CHT Conf, view the [CHANGELOG](https://docs.communityhealthtoolkit.org/apps/guides/updates/preparing-for-4/#cht-conf).
```shell
npm update -g cht-conf
```

# Usage
`cht` will upload the configuration **from your current directory**.

## Specifying the server to configure
If you are using the default actionset, or performing any actions that require a CHT instance to function (e.g. `upload-xyz` or `backup-xyz` actions) you must specify the server you'd like to function against.

### localhost
For developers, this is the instance defined in your `COUCH_URL` environment variable.
```shell
cht --local
```

### A specific Medic-hosted instance
For configuring Medic-hosted instances.
```shell
cht --instance=instance-name.dev
```

Username `admin` is used. A prompt is shown for entering password.
If a different username is required, add the `--user` switch:
```shell
--user user-name --instance=instance-name.dev
```

### An arbitrary URL
```shell
cht --url=https://username:password@example.com:12345
```
**NB** - When specifying the URL with `--url`, be sure not to specify the CouchDB database name in the URL. The CHT API will find the correct database.

### Using a session token for authentication
CHT Conf supports authentication using a session token by adding `--session-token` parameter:
```shell
cht --url=https://example.com:12345 --session-token=*my_token*
``` 

### Into an archive to be uploaded later
```shell
cht --archive
```
The resulting archive is consumable by CHT API >v3.7 to create default configurations.

## Perform specific action(s)
```shell
cht <--archive|--local|--instance=instance-name|--url=url> <...action>
```
The list of available actions can be seen via `cht --help`.

## Perform actions for specific forms
```shell
cht <--local|--instance=instance-name|--url=url> <...action> -- <...form>
```

## Protecting against configuration overwriting
_Added in v3.2.0_
In order to avoid overwriting someone else's configuration cht-conf records the last uploaded configuration snapshot in the `.snapshots` directory. The `remote.json` file should be committed to your repository along with the associated configuration change. When uploading future configuration if cht-conf detects the snapshot doesn't match the configuration on the server you will be prompted to overwrite or cancel.

