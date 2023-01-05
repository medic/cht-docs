---
title: "CHT 4.x Local Environment Setup"
linkTitle: Local Setup
weight: 1
description: >
  Setting up a local environment to build and test CHT 4.x applications
relatedContent: >
  core/overview/docker-setup
  contribute/code/core/using-windows
  apps/guides/hosting/3.x/self-hosting
  apps/guides/hosting/3.x/ec2-setup-guide
---

{{% pageinfo %}}
This tutorial will take you through setting up a local environment to build and test CHT applications on CHT version 4.x. This includes setting up the necessary tools to download and run the CHT public docker image as well as a command line interface tool to manage and build CHT apps.

By the end of the tutorial you should be able to:

- View the login page to CHT webapp on localhost
- Upload default settings to localhost
{{% /pageinfo %}}

{{% alert title="Note" %}} 
This guide will only work with CHT 4.x instances.  See the 
[3.x App Developer Hosting]({{< ref "apps/guides/hosting/3.x/app-developer" >}}) for setting up comparable 3.x instances.
{{% /alert %}}

## Brief Overview of Key Concepts

The *CHT Core Framework* makes it faster to build full-featured, scalable digital health apps by providing a foundation developers can build on. These apps can support most languages, are [Offline-First]({{< ref "core/overview/offline-first" >}}), and work on basic phones (via SMS), smartphones, tablets, and computers.

*CHT Project Configurer* also known as ***cht-conf*** is command-line interface tool to manage and configure CHT apps.

*Docker* is a tool designed to make it easier to create, deploy, and run applications by using containers.

*Containers* allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and deploy it as one package.

To read more about these concepts, see our [Docker Setup guide]({{< relref "core/overview/docker-setup" >}}).

## Required Resources

Before you begin, you need to have some useful software and tools that are required for things to work:

- [nodejs](https://nodejs.org/en/) version 12
- [npm](https://www.npmjs.com/get-npm)
- [git](https://git-scm.com/downloads) or the [Github Desktop](https://desktop.github.com/)
- [docker and docker-compose]({{< relref "apps/guides/hosting/requirements#docker" >}}).

## Implementation Steps

Now that you have the dependent tools and software installed, you are ready to set up your CHT local environment.

### 1. Create Docker compose files

Open your terminal and run these commands which will create a directory, download the three Docker Compose files and prepare the evironment variables file. You should just be able select all and paste on a command line:

```shell
mkdir -p ~/cht-local-setup/couch-data/ && mkdir -p ~/cht-local-setup/core-couch/ && mkdir -p ~/cht-local-setup/upgrade/
cd ~/cht-local-setup
curl -s -o ./core-couch/cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.0.1/docker-compose/cht-core.yml && curl -s -o ./core-couch/cht-couchdb.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic:medic:4.0.1/docker-compose/cht-couchdb.yml && curl -s -o ./upgrade/docker-compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml
cat > ${HOME}/cht-local-setup/upgrade/.env << EOF
DOCKER_CONFIG_PATH=${HOME}/cht-local-setup/core-couch/
COUCHDB_DATA=${HOME}/cht-local-setup/data/couch-data 
CHT_COMPOSE_PATH=${HOME}/cht-local-setup/core-couch/
COUCHDB_USER=medic
COUCHDB_PASSWORD=password
EOF
```

Run the following command to start your CHT instance using Docker Compose:

```shell
cd ~/cht-local-setup/upgrade/
docker-compose up
```
Note that the first time you run your CHT instance it may take a while. In case you run into issues running your docker file, ensure that the following setting in Docker is checked.
>> Settings >> General >> Use Docker Compose V2


{{< figure src="medic-login.png" link="medic-login.png" class="right col-6 col-lg-8" >}}

Once the command is finished, navigate to [https://localhost](https://localhost) with the Google Chrome browser and login with the default username `medic` and default password `password`. 

You might get an error "Your connection is not private" (see [screenshot](./privacy.error.png)). Click "Advanced" and then click "Proceed to localhost".

If you are using Mac you will not be able to find the "Proceed to localhost" link in Chrome, to bypass that error just click anywhere on the denial page and type "thisisunsafe".

This error can be fixed in step 5 below.

If you encounter an error `bind: address already in use`, see the [Port Conflicts section]({{< relref "core/overview/docker-setup#port-conflicts" >}}) in the Docker Setup guide.

This CHT instance is empty and has no data in it. While you're free to explore and add your own data, in step 3 below we will upload sample data. Proceed to step 2 to install `cht-conf` which is needed to upload the test data.

<br clear="all">

 *****

### 2. Install cht-conf

Using npm on your terminal, install cht-conf globally using the command below. 
```shell
npm install -g cht-conf
```
Using python on your terminal, install pyxform globally using the command below. 
```shell
sudo python -m pip install git+https://github.com/medic/pyxform.git@medic-conf-1.17#egg=pyxform-medic
```
If you encounter the error `npm ERR! gyp ERR verb find Python Python is not set` while installing pyxform and are running macOS, see [this troubleshooting section]({{< relref "contribute/code/core/dev-environment#macos--123" >}}).

{{< figure src="confirm-cht-conf.png" link="confirm-cht-conf.png" class="right col-6 col-lg-8" >}}

You can confirm that the installation was successful by typing `cht` in your terminal.

If you have trouble installing `cht-conf`, see the application's [GitHub repository](https://github.com/medic/cht-conf) for more information.

 <br clear="all">

*****

### 3. Upload Test Data

By default, the CHT will have the [Maternal & Newborn Health Reference Application]({{< ref "apps/examples/anc" >}}) installed. To upload demo data you can use `cht-conf`:

{{< figure src="test.data.png" link="test.data.png" class="right col-3 col-lg-6" >}}

- Clone `cht-core` on your computer using the following command:

```shell
git clone https://github.com/medic/cht-core.git
```

- Navigate your terminal to the `cht-core/config/default` directory. This is where the reference application is stored.
- Run the following `cht-conf` command to compile and upload default test data to your local instance:

```shell
cht --url=https://medic:password@localhost --accept-self-signed-certs csv-to-docs upload-docs
```

With the test data uploaded, log back into your CHT instance and note the "Test Health Facility" and related data.

<br clear="all">

*****

### 4. Create and Upload a Blank Project

{{% alert title="Note" %}} This step will erase the default Maternal & Newborn Health Reference Application. {{% /alert %}}

With `cht-conf` you can also create a blank project. This provides you a template from which you can begin working on CHT. To do so, run the following commands:

```shell
mkdir cht-app-tutorials
cd cht-app-tutorials
cht initialise-project-layout
```

Then deploy the blank project onto your local test environment with the command:

```shell
cht --url=https://medic:password@localhost --accept-self-signed-certs
```

If the above command shows an error similar to this one `ERROR Error: Webpack warnings when building contact-summary` you will need to install all the dependencies and libraries it needs, then you need to restart the docker-compose and try again.

```shell
npm ci
docker-compose restart
cht --url=https://medic:password@localhost --accept-self-signed-certs
```

{{< figure src="all-actions-completed.png" link="all-actions-completed.png" class="right col-6 col-lg-8" >}}

`accept-self-signed-certs` tells cht-conf that it’s OK that the server’s certificate isn’t signed properly, which will be the case when using docker locally.

Once you have run the above command it should complete with the message: `INFO All actions completed.`.

<br clear="all">

*****

### 5. Optional: Install Valid TLS Certificate

{{< figure src="local-ip.TLS.png" link="local-ip.TLS.png" class="right col-6 col-lg-8" >}}

With the blank project deployed to your CHT instance, you're ready to start writing your first app.  A big part of authoring an app is testing it on a mobile device, likely using the unbranded version of [CHT Android](https://github.com/medic/cht-android).  In order to test in the APK, your CHT instance needs a valid TLS certificate which the default docker version does not have.

To install a valid certificate, open a terminal in the `cht-core` directory. Ensure the CHT instance is running and make this call:

```shell
./scripts/add-local-ip-certs-to-docker-4.x.sh cht_nginx_1
```
If you are using an older version of cht-core, ensure that the  `add-local-ip-certs-to-docker.sh` file is available under the scripts folder.

To see what a before and after looks like, note the screenshot to the left which uses `curl` to test the certificate validity.

The output of `add-local-ip-certs-to-docker.sh` looks like this:

```text
cht_nginx_1

If just container name is shown above, a fresh local-ip.co certificate was downloaded.

```

The IP of your computer is used in the URL of the CHT instance now.  For example if your IP is `192.168.68.40` then the CHT URL with a valid TLS certificate is `192-168-68-40.my.local-ip.co`.  See the [local-ip.co](http://local-ip.co/) site to read more about these free to use certificates.

When using `cht-conf` you can now drop the use of `--accept-self-signed-certs`. Further, update the URL to be based on your IP.  Using the example IP above, this would be `--url=https://medic:password@192-168-68-40.my.local-ip.co`. As well, you can now use this URL to test with the CHT Android app.

## Frequently Asked Questions

- [How do I upgrade to a higher version of the webapp?](https://forum.communityhealthtoolkit.org/t/cant-upgrade-to-3-8-version/608)
- [How do I access the instance remotely?](https://forum.communityhealthtoolkit.org/t/unable-to-install-core-framework-in-cloud-instance/533)
- [Error 'No module named pip' when installing cht-conf](https://forum.communityhealthtoolkit.org/t/installing-cht-conf/1593)
- [CouchDB failed to start properly](https://forum.communityhealthtoolkit.org/t/couchdb-failed-to-start-properly/1683)
- [Enable adding contacts in a blank project](https://forum.communityhealthtoolkit.org/t/enable-adding-contacts-in-a-blank-project-deployed-onlocal-test-environment-for-cht-instance/1652)
