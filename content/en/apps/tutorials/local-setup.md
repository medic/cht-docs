---
title: "CHT Local Environment Setup"
linkTitle: Local Setup
weight: 1
description: >
  Setting up a local environment to build and test CHT applications
relatedContent: >
  core/guides/docker-setup
  core/guides/using-windows
---

## Purpose of the Tutorial

This tutorial will take you through setting up a local environment to build and test CHT applications. This includes setting up the necessary tools to download and run the CHT public docker image as well as a command line interface tool to manage and build CHT apps.

By the end of the tutorial you should be able to:

- View the login page to CHT webapp on localhost
- Upload default settings to localhost

## Brief Overview of Key Concepts

*CHT Core Framework* The Core Framework makes it faster to build full-featured, scalable digital health apps by providing a foundation developers can build on. These apps can support most languages, are offline-first, and work on basic phones (via SMS), smartphones, tablets, and computers.

*Medic Project Configurer* a.k.a ***medic-conf*** is command-line interface tool to manage and configure CHT apps.

*Docker* is a tool designed to make it easier to create, deploy, and run applications by using containers.  

*Containers* allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and deploy it as one package.

## Required Resources

Before you begin, you need to have some useful software and tools that are required for things to work.

First off, install [nodejs](https://nodejs.org/en/) 8 or later and [npm](https://www.npmjs.com/get-npm).

You also require Docker for your operating system:

- [Docker for Ubuntu](https://docs.docker.com/engine/install/ubuntu/)
- [Docker for MacOS](https://hub.docker.com/editions/community/docker-ce-desktop-mac)
- [Docker for Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)

## Implementation Steps

Now that you have the dependent tools and software installed, you are ready to set up your CHT local environment.

### 1. Install medic-conf

Using npm on your terminal or command line, install medic-conf globally using the following command;

```zsh
npm install -g medic-conf
```

You can confirm that the installation was successful by typing `medic-conf` in your terminal or command line.

![confirm medic-conf](confirm-medic-conf.png "Confirm medic-conf")

### 2. Install the Core Framework

Download the [docker-compose.yml](https://github.com/medic/cht-core/blob/master/docker-compose.yml) file to a folder of your choice. Be sure to place it in a folder that's easy to find on terminal or command line.

Open your terminal or command line and navigate to the folder where you have your [docker-compose.yml](https://github.com/medic/cht-core/blob/master/docker-compose.yml) file and run the command:

```zsh
docker-compose up
```

Once the command is done running, navigate to `https://localhost` on a Google Chrome browser and login with the default username `medic` and default password `password`.

![medic login](medic-login.png "Medic login")

### 3. Create and Upload a Blank Project

With `medic-conf` you can create a blank project. This provides you a template from which you can begin working on CHT. Just run:

```zsh
mkdir cht-app-tutorials
cd cht-app-tutorials
medic-conf initialise-project-layout
```

![initialise project layout](init-project-layout.png "Initialise project layout")

Then deploy the blank project onto your local test environment with the command:

```zsh
medic-conf --url=https://medic:password@localhost --accept-self-signed-certs
```

`accept-self-signed-certs` tells medic-conf that it’s OK that the server’s certificate isn’t signed properly, which will be the case when using docker locally.

Once you have run the above command it should complete with the message: `INFO All actions completed.`.

![all actions completed](all-actions-completed.png "All actions completed")

### 4. Upload Test Data

By default the CHT will have the [Maternal & Newborn Health Reference Application]({{< ref "apps/examples/anc" >}}) installed. To upload demo data you can use `medic-conf`:

- Check out the [cht-core respository](https://github.com/medic/cht-core) to your local machine, either by using the [Github Desktop app](https://desktop.github.com/) or by running the following command in the directory you want to check the code out into: `git clone https://github.com/medic/cht-core.git`. This will create a `cht-core` directory.
- Navigate your terminal to the `cht-core/config/default` directory. This is where the reference application is stored.
- Run the following `medic-conf` command to compile and upload default test data to your local instance: `medic-conf --url=https://medic:password@localhost --accept-self-signed-certs csv-to-docs upload-docs`.

## Frequently Asked Questions

- [How do I upgrade to a higher version of the webapp?](https://forum.communityhealthtoolkit.org/t/cant-upgrade-to-3-8-version/608)
- [How do I access the instance remotely?](https://forum.communityhealthtoolkit.org/t/unable-to-install-core-framework-in-cloud-instance/533)
