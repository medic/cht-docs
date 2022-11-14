---
title: "App Developer Hosting in CHT 4.x"
linkTitle: "App Developer Hosting"
weight: 40
aliases:
- /apps/guides/hosting/app-developer
description: >
  Hosting the CHT when developing apps
---

{{% alert title="Note" %}} This guide assumes you are a CHT app developer wanting to either run concurrent instances of the CHT, or easily be able to switch between different instances without losing any data while doing so. To do development on the CHT Core Framework itself, see the [development guide]({{< relref "apps/guides/hosting/core-developer.md" >}}).

To deploy the CHT 3.x in production, see either [AWS hosting]({{< relref "apps/guides/hosting/3.x/self-hosting.md" >}}) or [Self hosting]({{< relref "apps/guides/hosting/3.x/ec2-setup-guide.md" >}}). 4.x production hosting guides are coming soon!{{% /alert %}}


## Getting started

Be sure to meet the [CHT hosting requirements]({{< relref "apps/guides/hosting/requirements" >}}) first. As well, if any other CHT 4.x instances using Docker Compose are running locally, stop them otherwise port, storage volume and container name conflicts may occur. To stop ALL containers, you can use `docker kill $(docker ps -q)`.

After meeting these requirements, create a directory and download the developer YAML files in the directory you want to store them. This example uses `~/cht-4-app-developer` as the directory:

```shell 
mkdir  ~/cht-4-app-developer && cd ~/cht-4-app-developer
curl -s -o docker-compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml
curl -s -o cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic%3Amedic%3Amaster/docker-compose/cht-core.yml
curl -s -o cht-couchdb.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic%3Amedic%3Amaster/docker-compose/cht-couchdb.yml
```

You should now have 3 compose files which we can check with `ls`:

```shell
ls
cht-core.yml  cht-couchdb.yml  docker-compose.yml
```

To start the first developer CHT instance, run `docker-compose`, prepending the needed environment variables:

```shell script
CHT_COMPOSE_PROJECT_NAME=app-devl COUCHDB_SECRET=foo DOCKER_CONFIG_PATH=${PWD} COUCHDB_DATA=${PWD}/couchd CHT_COMPOSE_PATH=${PWD} COUCHDB_USER=medic COUCHDB_PASSWORD=password docker-compose up
```

This may take some minutes to fully start depending on the speed of the Internet connection and speed of the bare-metal host. This is because docker needs to download all the storage layers for all the containers and the CHT needs to run the first run set up. After downloads and setup has completed, the CHT should be accessible on [https://localhost](https://localhost). You can log in with username `medic` and password `password`.

When connecting to a new dev CHT instance for the first time, an error will be shown, "Your connection is not private" (see [screenshot](/apps/tutorials/local-setup/privacy.error.png)). To get past this, click "Advanced" and then click "Proceed to localhost".

## Running the Nth CHT instance

After running the first instance of the CHT, it's easy to run as many more as are needed.  This is achieved by specifying different:

* port for `HTTP` redirects (`CHT_HTTP`)
* port for `HTTPS` traffic (`NGINX_HTTP_PORT`)
* directory for storing the compose files and CouchDB files

Assuming you want to start a new project called `the_second` and  start the instance on `HTTP` port `8081` and `HTTPS` port `8443`, we would first create a new directory and download the same files:

```shell 
mkdir  ~/the_second && cd ~/the_second
curl -s -o docker-compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml
curl -s -o cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic%3Amedic%3Amaster/docker-compose/cht-core.yml
curl -s -o cht-couchdb.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic%3Amedic%3Amaster/docker-compose/cht-couchdb.yml
```


Then, we would use the same `docker-compose` command as above, but this time specify the ports:

```shell script
NGINX_HTTP_PORT=8081 NGINX_HTTPS_PORT=8444 CHT_COMPOSE_PROJECT_NAME=app-devl COUCHDB_SECRET=foo DOCKER_CONFIG_PATH=${PWD} COUCHDB_DATA=${PWD}/couchd CHT_COMPOSE_PATH=${PWD} COUCHDB_USER=medic COUCHDB_PASSWORD=password docker-compose up
```

The second instance is now accessible at  [https://localhost:8444](https://localhost:8444) and again using username `medic` and password `password` to login.

## The `.env` file

Often times it's convenient to use revision control, like GitHub, to store and publish changes in a CHT app.  A nice compliment to this is to store the specifics on how to run the `docker-compose` command for each app. By using a shared `docker-compose` configuration for all developers on the same app, it avoids any port collisions and enables all developers to have a unified configuration.

Using the above `the_second` sample project, we can create a file `~/the_second/.env` with this contents:

```shell
NGINX_HTTP_PORT=8081 
NGINX_HTTPS_PORT=8444 
CHT_COMPOSE_PROJECT_NAME=second 
COUCHDB_SECRET=foo 
DOCKER_CONFIG_PATH=./
COUCHDB_DATA=./couchd 
CHT_COMPOSE_PATH=./
COUCHDB_USER=medic 
COUCHDB_PASSWORD=password
```

Now it's easy to boot this environment:

```shell
cd ~/the_second
docker-compose up
```

## Switching & concurrent projects

The easiest way to switch between projects is to stop the first set of containers and start the second set. Cancel the first project running in the foreground with `ctrl + c` and `stop` all the project's services:

```shell
docker stop second_api_1 second_cht-upgrade-service_1 second_couchdb_1 second_haproxy_1 second_healthcheck_1 second_nginx_1 second_sentinel_1
```

Alternately, you can stop ALL containers (even non-CHT ones!) with `docker kill $(docker ps -q)`. Then start the other CHT project using either the `.env` file or use the explicit command with ports and other environment variables as shown above.

To run projects concurrently, instead of cancelling and `stop`ing the first one, open a second terminal and start the second project.  Be careful you don't have port conflicts!

To read more about how `docker-compose` works, be sure to read the [helpful docker-compose commands]({{< relref "core/guides/docker-setup#helpful-docker-commands" >}}) page.

## CHT Docker Helper for 4.x

{{% alert title="Note" %}} CHT Docker Helper for CHT 4.x is in Beta.  Please use with care! 

To use a stable version with CHT 3.x, see the earlier [CHT Docker Helper page]({{< relref "apps/guides/hosting/3.x/app-developer#cht-docker-helper" >}}){{% /alert %}}

The `cht-docker-compose.sh` scripts downloads 3 compose files and builds an `.env` file used above. This greatly eases starting your first CHT instance with a simple text based GUI:

![The cht-docker-compose.sh script showing the URL and version of the CHT instance as well as number of containers launched, global container count, medic images downloaded count and OS load average. Finally a "Successfully started my_first_project" message is shown and denotes the login is "medic" and the password is "password".](cht-docker-helper.png)

This script brings a lot of benefits with it:
* You only have to download one bash script
* It has been tested to work on Windows, macOS and Linux
* All compose files and images will be downloaded automatically for you
* All networks, storage volumes and containers will be created 
* A valid TLS certificate will be installed, allowing you to easily test on with CHT Android natively on a mobile device

Currently, the CHT Docker Helper for 4.0 is in beta, and comes with some caveats:
* it is not yet available in `master`
* it does not account for port conflicts, so you need to manually resolve them yourself by editing the `*.env` files
* upgrades are not yet support
* concurrently running multiple instances is not yet supported

To get started using it:
1. Clone the [CHT Core](https://github.com/medic/cht-core/) repo
2. Checkout the `7852-cht-4.x-docker-helper` branch
3. `cd` into the `cht-core/scripts/docker-helper-4.x/` directory
4. Run the script with `./cht-docker-compose.sh`

Here is a video of the beta version being run on 8 Nov 2022. The video references `lazydocker` which is [a great way](https://github.com/jesseduffield/lazydocker) to monitor and control your local docker environment:

{{< youtube -x9zr8R2hP4 >}}

-------
