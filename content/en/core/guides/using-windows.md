---
title: "Developing on Windows"
linkTitle: "Windows Development"
weight: 15
description: >
  Notes for developing on Windows
---

We don't actively support development on Windows, instead preferring MacOS or Linux.

However, Microsoft has recently been stabilizing their [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about), which appears to work reasonably well for development.

Installation instructions are mostly the same as they written in [the README](https://github.com/medic/cht-core/blob/master/README.md) with a couple of caveats as of time of writing (2019-07-25), noted below.

{{% alert title="Note" %}}
Both the Windows Subsystem for Linux and Medic's support for developing in it is very much in beta. These are advanced instructions, expect some understanding of linux and may not always work. Be patient and raise bugs as you find them!
{{% /alert %}}

## Installing Ubuntu in the Windows Subsystem for Linux.

For the rest of this document we're going to presume that you're using Ubuntu (18.04) in WSL. Medic probably works on all distributions, but Ubuntu is likely the best supported.

First, follow Microsoft's [instructions on enabling and installing linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10). At the end of this process you should have a linux terminal.

{{% alert title="Note" %}}
For the rest of this tutorial **in linux** means code executing or performing actions in the WSL, while **in Windows** means code executing or performing actions in Windows natively.
{{% /alert %}}


## CouchDB

As of writing CouchDB wouldn't autostart (due to systemd not existing?), and wasn't manually starting due to erlang errors.

Luckily, there is a perfectly working CouchDB installation for Windows:
 - Download from [CouchDB](https://couchdb.apache.org/#download) and install the Windows version. This will create a Windows service.
 - Run it either by directly executing `C:\CouchDB\bin\couchdb.cmd` or by starting the service

Then go to `http://localhost:5984/_utils/#/setup` in Windows and do the single node setup. Once done head back to linux and confirm it works:

```bash
$: curl http://localhost:5984/
{"couchdb":"Welcome","version":"2.3.1","git_sha":"c298091a4","uuid":"5f60350abaaa11c0131a5630e83ae979","features":["pluggable-storage-engines","scheduler"],"vendor":{"name":"The Apache Software Foundation"}}
```

## Installing NPM
Start your WSL instance (Ubuntu), not WSL as they take you to two different default directories. 

The default `npm` in linux is really old and doesn't have `npm ci`, which we need.

Instead use [nvm](https://github.com/nvm-sh/nvm) to install  `nvm install 11.3` .


## Checking out the code

We used git that's preinstalled with Ubuntu to check out the code.

You can checkout cht code inside WSL itself. You can checkout anywhere you have write access. We'll checkout inside /home/username/medic directory. 

```bash
$: mkdir ~/medic && cd ~/medic
$: git clone https://github.com/medic/cht-core.git
```

## Setup Environment Variables

Using `.bashrc` works as expected, and so is a good place to put exports:

```bash
# Medic stuff
export COUCH_URL=http://admin:pass@localhost:5984/medic
export COUCH_NODE_NAME=couchdb@localhost
```

## Everything else

`npm ci` should just work once you've installed a latest version of node via nvm as noted above.

You won't have grunt already installed, so install it by executing following command: 

```bash
$: npm i -g grunt-cli
```

Also install xstproc in your WSL:
```bash
$: sudo apt-get update
$: sudo apt-get install xsltproc
```

Now you can build the web app. 

```bash
$: cd ~/medic/cht-core/
$: npm ci
$: grunt
```

From this point, follow the setup guide from `Enabling a secure CouchDB` section in [Development Guide](https://github.com/medic/cht-core/blob/master/DEVELOPMENT.md).


To get multiple linux terminals (so you can run `grunt`, `api` and `sentinel` at the same time) either install and use something like Tmux, or if you click `Ubuntu` in the Windows start menu again it will open up a new terminal in the same linux instance.

Once you're done with the default instructions and have api running, check if it works by going to http://localhost:5988 in Chrome or Firefox.

## Editing Code
If you want to make changes to your code or contribute to our community health toolkit, you can do so by editing code from your favorite editor. If you editor supports UNC path, you can access and edit files inside WSL from `\\wsl$\Ubuntu\<cht-core-location>`. If you use Visual Studio Code, it's even easier to edit your code. Just navigate to where you have checked out cht-core and type `code .` This will download VS Code Server for Ubuntu and open the project in Visual Studio Code in windows. 

```bash
$: cd ~/medic/cht-core
$: code .
```

## Problems?

As none of our code developers use Windows as a development environment daily this solution may not be as stable as directly using MacOS or Linux. If you encounter issues please let a developer know
