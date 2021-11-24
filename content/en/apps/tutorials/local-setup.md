---
title: "CHT Local Environment Setup"
linkTitle: Local Setup
weight: 1
description: >
  Setting up a local environment to build and test CHT applications
relatedContent: >
  core/guides/docker-setup
  core/guides/using-windows
  apps/guides/hosting/self-hosting
  apps/guides/hosting/ec2-setup-guide
---

{{% pageinfo %}}
This tutorial will take you through setting up a local environment to build and test CHT applications on CHT version 3.9.1. This includes setting up the necessary tools to download and run the CHT public docker image as well as a command line interface tool to manage and build CHT apps.

By the end of the tutorial you should be able to:

- View the login page to CHT webapp on localhost
- Upload default settings to localhost
{{% /pageinfo %}}


## Brief Overview of Key Concepts

*CHT Core Framework* The Core Framework makes it faster to build full-featured, scalable digital health apps by providing a foundation developers can build on. These apps can support most languages, are offline-first, and work on basic phones (via SMS), smartphones, tablets, and computers.

*CHT Project Configurer* a.k.a ***cht-conf*** is command-line interface tool to manage and configure CHT apps.

*Docker* is a tool designed to make it easier to create, deploy, and run applications by using containers.  

*Containers* allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and deploy it as one package.

To read more about these concepts, see our [Docker Setup guide]({{< relref "core/guides/docker-setup" >}}).

## Required Resources

Before you begin, you need to have some useful software and tools that are required for things to work:

* [nodejs](https://nodejs.org/en/) from version 8 to 12
* [npm](https://www.npmjs.com/get-npm)
* [git](https://git-scm.com/downloads) or the [Github Desktop](https://desktop.github.com/)
* [docker and docker-compose]({{< relref "apps/guides/hosting/requirements#docker" >}}).

## Implementation Steps

Now that you have the dependent tools and software installed, you are ready to set up your CHT local environment.



### 1. Install the Core Framework

Check out the [cht-core respository](https://github.com/medic/cht-core) to your local machine. This can be done either by using the [Github Desktop app](https://desktop.github.com/) or by running the following command in the directory where you want the CHT code: `git clone https://github.com/medic/cht-core.git`. Checking out the repo will create a `cht-core` directory.  

Open your terminal and navigate to the `cht-core` directory, where you should see the `docker-compose.yml` file. Run the command:

```shell
docker-compose up
```

{{< figure src="medic-login.png" link="medic-login.png" class="right col-6 col-lg-8" >}}

Once the command is done running, navigate to [https://localhost](https://localhost) with the Google Chrome browser and login with the default username `medic` and default password `password`. You will get an error "Your connection is not private" (see [screenshot](./privacy.error.png)). Click "Advanced" and then click "Proceed to localhost".
If you are using Mac you will not be able to find the "Proceed to localhost" link in Chrome, to bypass that error just click anywhere on the denial page and type "thisisunsafe".
This error can be fixed in step 5 below.

If you encounter an error `bind: address already in use`, see the [Port Conflicts section]({{< relref "core/guides/docker-setup#port-conflicts" >}}) in our Docker Setup guide.

This CHT instance is empty and has no data in it.  While you're free to explore and add your own data, in step 3 below we'll upload sample data.  Proceed to step 2 to install `cht-conf` which is needed to upload the test data.

<br clear="all">

 *****

### 2. Install cht-conf

Using npm and python on your terminal, install cht-conf and pyxform globally using the following commands:

```shell
npm install -g cht-conf
sudo python -m pip install git+https://github.com/medic/pyxform.git@cht-conf-1.17#egg=pyxform-medic
```

{{< figure src="confirm-cht-conf.png" link="confirm-cht-conf.png" class="right col-6 col-lg-8" >}}

You can confirm that the installation was successful by typing `cht` in your terminal.

If you have trouble installing `cht-conf`, see the application's [GitHub repository](https://github.com/medic/cht-conf) for more information.

 <br clear="all">

*****

### 3. Upload Test Data

By default, the CHT will have the [Maternal & Newborn Health Reference Application]({{< ref "apps/examples/anc" >}}) installed. To upload demo data you can use `cht-conf`:

{{< figure src="test.data.png" link="test.data.png" class="right col-3 col-lg-6" >}}

- Navigate your terminal to the `cht-core/config/default` directory. This is where the reference application is stored.
- Run the following `cht-conf` command to compile and upload default test data to your local instance:

```shell  
cht --url=https://medic:password@localhost --accept-self-signed-certs csv-to-docs upload-docs`.
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

{{< figure src="all-actions-completed.png" link="all-actions-completed.png" class="right col-6 col-lg-8" >}}


`accept-self-signed-certs` tells cht-conf that it’s OK that the server’s certificate isn’t signed properly, which will be the case when using docker locally.

Once you have run the above command it should complete with the message: `INFO All actions completed.`.

<br clear="all">

 *****

### 5. Optional: Install Valid TLS Certificate  

{{< figure src="local-ip.TLS.png" link="local-ip.TLS.png" class="right col-6 col-lg-8" >}}

With the blank project deployed to your CHT instance, you're ready to start writing your first app.  A big part of authoring an app is testing it on a mobile device, likely using the unbranded version of [CHT Android](https://github.com/medic/cht-android).  In order to test in the APK, your CHT instance needs a valid TLS certificate which the default docker version does not have.

To install a valid certificate, open a terminal in the `cht-core` directory. Ensure the `medic-os` container is running and make this call:

```shell
./scripts/add-local-ip-certs-to-docker.sh
```

To see what a before and after looks like, note the screenshot to the left which uses `curl` to test the certificate validity.  

The output of `add-local-ip-certs-to-docker.sh` looks like this:

```
Debug: Service 'medic-core/nginx' exited with status 143
Info: Service 'medic-core/nginx' restarted successfully
Success: Finished restarting services in package 'medic-core'

If no errors output above, certificates successfully installed.
```

The IP of your computer is used in the URL of the CHT instance now.  For example if your IP is `192.168.68.40` then the CHT URL with a valid TLS certificate is `192-168-68-40.my.local-ip.co`.  See the [local-ip.co](http://local-ip.co/) site to read more about these free to use certificates.

When using `cht-conf` you can now drop the use of `--accept-self-signed-certs`. Further, update the URL to be based on your IP.  Using the example IP above, this would be `--url=https://medic:password@192-168-68-40.my.local-ip.co`. As well, you can now use this URL to test with the CHT Android app.

## Frequently Asked Questions

- [How do I upgrade to a higher version of the webapp?](https://forum.communityhealthtoolkit.org/t/cant-upgrade-to-3-8-version/608)
- [How do I access the instance remotely?](https://forum.communityhealthtoolkit.org/t/unable-to-install-core-framework-in-cloud-instance/533)
