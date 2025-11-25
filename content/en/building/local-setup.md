---
title: "Getting Started Building a CHT App"
linkTitle: Getting Started
weight: 2
description: >
  Set up a local environment to build and test CHT applications
relatedContent: >
  community/contributing/code/core/using-windows
  hosting/
aliases:
   - /building/tutorials/local-setup
   - /apps/tutorials/local-setup
---

{{< callout type="info" >}}
  This tutorial is designed for CHT version 4.x and higher.
{{< /callout >}}

This tutorial will take you through setting up a local environment to build and test CHT applications on CHT for version 4.x and higher. This includes setting up the necessary tools to download and run the CHT public docker image as well as a command line interface tool to manage and build CHT apps.

By the end of the tutorial you should be able to:

- View the login page to CHT webapp on localhost
- Upload default settings to localhost

## Brief Overview of Key Concepts

The *CHT Core Framework* makes it faster to build full-featured, scalable digital health apps by providing a foundation developers can build on. These apps can support most languages, are [Offline-First](/technical-overview/concepts/offline-first), and work on basic phones (via SMS), smartphones, tablets, and computers.

[*CHT Project Configurer*](https://github.com/medic/cht-conf) also known as ***cht-conf*** is a command-line interface tool to manage and configure CHT apps.

*Docker* is a tool designed to make it easier to create, deploy, and run applications by using containers.

*Containers* allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and deploy it as one package.

## Setup environment

CHT app development can be done on Linux, macOS, or Windows (using the [Windows Subsystem for Linux (WSL2)](https://learn.microsoft.com/en-us/windows/wsl/install)).

CHT apps can be built on your local system (with the necessary libraries installed and configured) or they can be built from within VS Code Dev Containers.

Before you begin, ensure you have the following tools:

- [git](https://git-scm.com/downloads) or the [Github Desktop](https://desktop.github.com/)
- [docker and docker compose](/hosting/cht/requirements#docker).

### Installing Docker

{{< read-content file="_partial_docker_setup.md" >}}

### Initialize project directory

Using the terminal (or the WSL shell on Windows: _Start > wsl_), run the following commands to create a new project directory for your CHT app:

```shell
mkdir -p ~/cht-project
cd ~/cht-project
```

---

### Developing locally

To build CHT apps on your local system, you need to have some additional tools:

{{< tabs items="Linux (Ubuntu),macOS,Windows (WSL2)" >}}

  {{< tab >}}
```shell
  sudo apt update && sudo apt -y dist-upgrade
  sudo apt -y install python3-pip python3-setuptools python3-wheel xsltproc
  # Use NVM to install NodeJS:
  export nvm_version=`curl -s https://api.github.com/repos/nvm-sh/nvm/releases/latest | jq -r .name`
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/$nvm_version/install.sh | $SHELL
  . ~/.$(basename $SHELL)rc
  nvm install {{< param nodeVersion >}}
```
  {{< /tab >}}
  {{< tab >}}
```shell
  # Uses Homebrew: https://brew.sh/
  brew update
  brew install curl jq pyenv git make node@{{< param nodeVersion >}} gcc openssl readline sqlite3 xz zlib tcl-tk
  # Python no longer included by default in macOS >12.3
  pyenv install 3
  pyenv global 3
  echo "eval \"\$(pyenv init --path)\"" >> ~/.$(basename $SHELL)rc
  . ~/.$(basename $SHELL)rc
```
  {{< /tab >}}
  {{< tab >}}
```shell
  sudo apt update && sudo apt -y dist-upgrade
  sudo apt -y install python3-pip python3-setuptools python3-wheel xsltproc
  # Use NVM to install NodeJS:
  export nvm_version=`curl -s https://api.github.com/repos/nvm-sh/nvm/releases/latest | jq -r .name`
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/$nvm_version/install.sh | $SHELL
  . ~/.$(basename $SHELL)rc
  nvm install {{< param nodeVersion >}}
```
  {{< /tab >}}

{{< /tabs >}}

#### `pyxform`

Using python on your terminal, install `pyxform` globally using the command below. Ensure you create and activate an environment for python3.

```shell
sudo python3 -m pip install git+https://github.com/medic/pyxform.git@medic-conf-1.17#egg=pyxform-medic
```

If you encounter the error `npm ERR! gyp ERR verb find Python Python is not set` while installing pyxform and are running macOS, see [this troubleshooting section](/community/contributing/code/core/dev-environment#macos--123).

#### `cht-conf`

Using npm on your terminal, install `cht-conf` globally using the command below.

```shell
npm install -g cht-conf
```

{{< figure src="confirm-cht-conf.png" link="confirm-cht-conf.png" class="right col-6 col-lg-8" >}}

You can confirm that the installation was successful by typing `cht` in your terminal.

If you have trouble installing `cht-conf`, see the application's [GitHub repository](https://github.com/medic/cht-conf) for more information.

Using the terminal (or the WSL shell on Windows: _Start > wsl_), run the following commands from within your project directory (created above) to bootstrap your new CHT project:

```shell
cd ~/cht-project
cht initialise-project-layout
```

---

### Developing with VS Code Dev Container

If you want to develop CHT apps with VS Code, you can use the `cht-app-ide` Docker image as a [Development Container](https://code.visualstudio.com/docs/devcontainers/containers). This will allow you to use the `cht-conf` utility and its associated tech stack from within VS Code (without needing to install dependencies like NodeJS on your host system).

[Install VS Code](https://code.visualstudio.com/) if you do not have it already.

Using the terminal (or the WSL shell on Windows: _Start > wsl_, or [Git Bash for Windows](https://gitforwindows.org/) without WSL), run the following commands from within your project directory (created above) to download the `.devcontainer.json` config file, install the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers), and open the project directory in VSCode:

```shell
cd ~/cht-project
curl -s https://raw.githubusercontent.com/medic/cht-conf/main/devcontainer.cht-app-ide/.devcontainer.json > .devcontainer.json
code --install-extension ms-vscode-remote.remote-containers
code -n .
```

When opening VS Code, you may be prompted with the question:

> **Do you trust the authors of the files in this folder?**

Choose, "Yes, I trust the authors".

Open the Command Palette in VS Code (_Ctrl+Shift+P_ or _Cmd+Shift+P_) and select `Reopen in Container`. This will open your workspace inside a container based on the `cht-app-ide` image. You can use the `cht` commands by opening a terminal in VS Code (_Ctrl+Shift+\`_ or _Cmd+Shift+\`_). If prompted "Do you trust the authors..." choose "Trust Folder & Continue".

Run the following command in the VS Code terminal to bootstrap your new CHT project:

```shell
cht initialise-project-layout
```

#### Terminal environment

When opening a terminal in VS Code in a development container, the terminal will be running on the _container environment_ by default. This is what gives you access to the various `cht` commands.  However, this also means you do NOT have access, within the default VS Code terminal, to commands from your _host environment_. So, for example, you cannot run `docker` commands since Docker is not installed inside the container.

To open a terminal running on you _host environment_ in VS Code, open the Command Palette (_Ctrl+Shift+P_ or _Cmd+Shift+P_) and select `Create New Integrated Terminal (Local)`. Just remember that you will NOT be able to run `cht` commands from this terminal since cht-conf is not installed on your host machine.

#### Note on connecting to a local CHT instance

When using `cht-conf` within a Docker container to connect to a CHT instance that is running on your local machine (e.g. a development instance), you cannot use the `--local` flag or `localhost` in your `--url` parameter (since these will be interpreted as "local to the container").

It is recommended to run a local CHT instance using the [CHT Docker Helper script](/hosting/cht/app-developer#cht-docker-helper-for-4x). You can connect to the resulting `...local-ip.medicmobile.org` URL from the Docker container (or the VS Code terminal). (Just make sure the port your CHT instance is hosted on is not blocked by your firewall).

---

## Deploy local CHT instance

Now that you have the dependent tools and software installed, you are ready to set up your local CHT environment.

Refer to the [App Developer Hosting Guide](/hosting/cht/app-developer) for instructions on how to deploy a local CHT instance.

Note that the first time you run your CHT instance it may take a while. In case you run into issues running your docker file, ensure that the following setting in Docker is checked.
> Settings >> General >> Use Docker Compose V2

{{< figure src="medic-login.png" link="medic-login.png" class="right col-6 col-lg-8" >}}

Once your instance has started, navigate to [https://localhost](https://localhost) with the Google Chrome browser and login with the default username `medic` and default password `password`.

You might get an error "Your connection is not private" (see [screenshot](./privacy.error.png)). Click "Advanced" and then click "Proceed to localhost".

If you are using macOS you will not be able to find the "Proceed to localhost" link in Chrome, to bypass that error just click anywhere on the denial page and type "thisisunsafe".

This error can be fixed by [installing a TLS certificate](#optional-install-valid-tls-certificate) as described below.

If you encounter an error `bind: address already in use`, check for [port conflicts section](https://scientyficworld.org/how-to-avoid-local-port-conflicts-in-docker/) in the Docker Setup guide.

This CHT instance is empty and has no data in it. While you're free to explore and add your own data, in step 3 below we will upload sample data. Proceed to step 2 to install `cht-conf` which is needed to upload the test data.

### Upload Test Data

By default, the CHT will have the [Maternal & Newborn Health Reference Application](/reference-apps/maternal-newborn) installed. To upload demo data you can use `cht-conf`:

{{< figure src="test.data.png" link="test.data.png" class="right col-3 col-lg-6" >}}

- Clone `cht-core` on your computer using the following command:

```shell
git clone https://github.com/medic/cht-core.git
```

- Navigate your terminal to the `cht-core/config/default` directory. This is where the reference application is stored.
- Run the following `cht-conf` command to compile and upload default test data to your local instance:

```shell
cht --url=https://medic:password@localhost --accept-self-signed-certs
cht --url=https://medic:password@localhost --accept-self-signed-certs csv-to-docs upload-docs
```

With the test data uploaded, log back into your CHT instance and note the "Test Health Facility" and related data.

### Upload a Blank Project

{{< callout type="warning" >}}
  This step will erase the default Maternal & Newborn Health Reference Application. 
{{< /callout >}}

You can also upload the blank project you created above (via the `cht initialise-project-layout` command).

Deploy the blank project onto your local test environment with the following command:

{{< tabs items="Local,Dev Container" >}}

  {{< tab >}}
```shell
  # accept-self-signed-certs bypasses normal SSL certificate verification. This is necessary when connecting to a local CHT instance.
  cht --url=https://medic:password@localhost --accept-self-signed-certs
```
  
  {{< /tab >}}

  {{< tab >}}

```shell
  # Requires instance started with CHT Docker Helper (accessible via a local-ip.medicmobile.org URL)
  cht --url=https://medic:password@<your-local-ip.medicmobile.org-url>
```
  {{< /tab >}}

{{< /tabs >}}

{{< figure src="all-actions-completed.png" link="all-actions-completed.png" class="right col-6 col-lg-8" >}}

If the above command shows an error similar to this one `ERROR Error: Webpack warnings when building contact-summary` you will need to install all the dependencies and libraries it needs (by running `npm ci`) before trying to upload the configuration again with the `cht ...` command.

Once you have run the above command it should complete with the message: `INFO All actions completed.`.

### Optional: Install Valid TLS Certificate

{{< figure src="local-ip.TLS.png" link="local-ip.TLS.png" class="right col-6 col-lg-8" >}}

With the blank project deployed to your CHT instance, you're ready to start writing your first app.  A big part of authoring an app is testing it on a mobile device, likely using the unbranded version of [CHT Android](https://github.com/medic/cht-android).  In order to test in the APK, your CHT instance needs a valid TLS certificate which the default docker version does not have.

To install a valid certificate, open a terminal in the `cht-core` directory. Ensure the CHT instance is running and make this call:

```shell
./scripts/add-local-ip-certs-to-docker.sh cht_nginx_1
```

If `add-local-ip-certs-to-docker-4.x.sh` is not in your scripts directory, be sure to use `git` or GitHub Desktop to update your local repository with the latest changes.  If you can't update for some reason, you can [download it directly](https://raw.githubusercontent.com/medic/cht-core/refs/heads/master/scripts/add-local-ip-certs-to-docker.sh).

To see what a before and after looks like, note the screenshot to the left which uses `curl` to test the certificate validity.

The output of `add-local-ip-certs-to-docker.sh` looks like this:

```text
cht_nginx_1

If just the container name is shown above, a fresh local-ip.medicmobile.org certificate was downloaded.

```

The IP of your computer is used in the URL of the CHT instance now.  For example, if your IP is `192.168.68.40` then the CHT URL with a valid TLS certificate is `192-168-68-40.local-ip.medicmobile.org`.  See the [local-ip.medicmobile.org](https://local-ip.medicmobile.org/) site to read more about these free-to-use certificates.

When using `cht-conf` you can now drop the use of `--accept-self-signed-certs`. Further, update the URL to be based on your IP.  Using the example IP above, this would be `--url=https://medic:password@192-168-68-40.local-ip.medicmobile.org`. As well, you can now use this URL to test with the CHT Android app.

## Frequently Asked Questions

- [How do I upgrade to a higher version of the webapp?](https://forum.communityhealthtoolkit.org/t/cant-upgrade-to-3-8-version/608)
- [How do I access the instance remotely?](https://forum.communityhealthtoolkit.org/t/unable-to-install-core-framework-in-cloud-instance/533)
- [Error 'No module named pip' when installing cht-conf](https://forum.communityhealthtoolkit.org/t/installing-cht-conf/1593)
- [CouchDB failed to start properly](https://forum.communityhealthtoolkit.org/t/couchdb-failed-to-start-properly/1683)
- [Enable adding contacts in a blank project](https://forum.communityhealthtoolkit.org/t/enable-adding-contacts-in-a-blank-project-deployed-onlocal-test-environment-for-cht-instance/1652)
