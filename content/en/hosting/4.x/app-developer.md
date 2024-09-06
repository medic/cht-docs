---
title: "App Developer Hosting in CHT 4.x"
linkTitle: "App Developer Hosting"
weight: 40
aliases:
  - /apps/guides/hosting/4.x/app-developer
  - /apps/guides/hosting/app-developer
description: >
  Hosting the CHT when developing apps
---

{{% pageinfo %}} 
This guide assumes you are a CHT app developer wanting to either run concurrent instances of the CHT, or easily be able to switch between different instances without losing any data while doing so. To do development on the CHT Core Framework itself, see the [development guide]({{< relref "contribute/code/core/dev-environment" >}}).

To deploy the CHT 3.x in production, see either [AWS hosting]({{< relref "hosting/3.x/ec2-setup-guide.md" >}}) or [Self hosting]({{< relref "hosting/3.x/self-hosting.md" >}}). 4.x production hosting guides are coming soon!
{{% /pageinfo %}}


## Getting started

Be sure to meet the [CHT hosting requirements]({{< relref "hosting/requirements" >}}) first. To avoid conflicts, ensure that all other CHT 4.x instances are stopped. To stop ALL containers, you can use

```shell
docker kill $(docker ps -q)
````

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

This may take some minutes to fully start depending on the speed of the internet connection and speed of the host. This is because docker needs to download all the storage layers for all the containers and the CHT needs to run the first run set up. After downloads and setup has completed, the CHT should be accessible on [https://localhost](https://localhost). You can log in with username `medic` and password `password`.

When connecting to a new dev CHT instance for the first time, an error will be shown, "Your connection is not private" with `NET::ERR_CERT_AUTHORITY_INVALID` (see [screenshot](/apps/tutorials/local-setup/privacy.error.png)). To get past this, click "Advanced" and then click "Proceed to localhost".

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

To run projects concurrently open a second terminal and start the second project so you don't have to cancel and `stop` the first project.  Remember to avoid port conflicts!

## CHT Docker Helper for 4.x

{{% alert title="Note" %}} This is for CHT 4.x.  To use a CHT 3.x version, see the earlier [CHT Docker Helper page]({{< relref "hosting/3.x/app-developer#cht-docker-helper" >}}){{% /alert %}}

The `cht-docker-compose.sh` scripts downloads 3 compose files and builds an `.env` file used above. This greatly eases starting your first CHT instance with a simple text based GUI which works on Windows (WSL2), macOS (both x86 and Apple Silicon) and Linux.

![The cht-docker-compose.sh script showing the URL and version of the CHT instance as well as number of containers launched, global container count, medic images downloaded count and OS load average. Finally a "Successfully started my_first_project" message is shown and denotes the login is "medic" and the password is "password".](cht-docker-helper.png)

This script brings a lot of benefits with it:
* You only have to download one bash script
* All compose files and images will be downloaded automatically for you
* All networks, storage volumes and containers will be created 
* A valid TLS certificate will be installed, allowing you to easily test on with CHT Android natively on a mobile device
* An unused port is automatically chosen for you when creating a new project.  No more manually looking at your existing `.env` files!

### Installing

To get started using it:
1. Clone the [CHT Core](https://github.com/medic/cht-core/) repo
2. When you want to check for updates, just run `git pull origin` in the `cht-core` directory.

If you want a more stand-alone version, you can `curl` the bash script directly, but you can't use `git` to easily update it then:

```shell
curl -s -o cht-docker-compose.sh https://raw.githubusercontent.com/medic/cht-core/master/scripts/docker-helper-4.x/cht-docker-compose.sh
```

### Usage

Always run the script from the directory where it lives.  If you launch it from a different directory, relative paths will fail:

| Do | Don't |
|---|---|
| `./cht-docker-compose.sh`|`./docker-helper-4.x/cht-docker-compose.sh`|

#### Launching

Run the script with:

```
./cht-docker-compose.sh
```

The first time you run, you will be prompted to create a new project.  Here's what that looks like:

```shell
./cht-docker-compose.sh
Would you like to initialize a new project [y/N]? y
How do you want to name the project? 4 OH The First
Downloading compose files ... done 

Creating network "4_oh_the_first-cht-net" with the default driver
Creating my_first_cht_project-dir_cht-upgrade-service_1 ... done
Starting project "4_oh_the_first". First run takes a while. Will try for up to five minutes........

 -------------------------------------------------------- 

  Success! "4_oh_the_first" is set up:

    https://127-0-0-1.local-ip.medicmobile.org:10444/ (CHT)
    https://127-0-0-1.local-ip.medicmobile.org:10444/_utils/ (Fauxton)

    Login: medic
    Password: password

 -------------------------------------------------------- 

Start existing project
    ./cht-docker-compose.sh ENV-FILE.env

Stop and keep project:
    ./cht-docker-compose.sh ENV-FILE.env stop

Stop and destroy all project data:
    ./cht-docker-compose.sh ENV-FILE.env destroy

https://docs.communityhealthtoolkit.org/apps/guides/hosting/4.x/app-developer/


 Have a great day! 
```

If you have many existing projects, you can specify them to launch them directly. If you had a project called `4_oh_the_first` you would run:

```shell
./cht-docker-compose.sh 4_oh_the_first.env
```

#### Stopping

When you're done with a project, it's good to stop all the containers to reduce load on your computer.  Do this by specifying the project and the `stop` command. This command will simply stop the active Docker containers, and not delete any data. Using our existing example `4_oh_the_first` project, you would call:

```shell
./cht-docker-compose.sh 4_oh_the_first.env stop
```

#### Destroying

When you want to **permanently delete all files and all data** for a project, specify the project and the `destroy` command. Using our existing example `4_oh_the_first` project, you would call:

```shell
./cht-docker-compose.sh 4_oh_the_first.env destroy
```

Be sure you want to do this, there is no "are you sure?" prompt and it will delete all your data.

Also note that this command will use the `sudo` command when deleting the CouchDB data, so it may prompt for your password.

#### Debugging

To get debug output while running the docker helper, you can prepend the `DEBUG=true` flag like this:

```shell
DEBUG=true ./cht-docker-compose.sh
```

This shows load average, CHT container count, global container count, and a table of services with their status like this:

```
---DEBUG INFO---
Load: 3.75 2.92 2.93    
CHT Containers: 7                                                                                
Global Containers 15                     

Service              Status   Container                               Image     
cht-upgrade-service  running  400_deleteme-dir-cht-upgrade-service-1  public.ecr.aws/s5s3h4s7/cht-upgrade-service:latest
haproxy              NA       NA                                      public.ecr.aws/medic/cht-haproxy:4.4.0-8229-outbound-push
healthcheck          running  400_deleteme_healthcheck_1              public.ecr.aws/medic/cht-haproxy-healthcheck:4.4.0-8229-outbound-push
api                  running  400_deleteme_api_1                      public.ecr.aws/medic/cht-api:4.4.0-8229-outbound-push
sentinel             running  400_deleteme_sentinel_1                 public.ecr.aws/medic/cht-sentinel:4.4.0-8229-outbound-push
nginx                running  400_deleteme_nginx_1                    public.ecr.aws/medic/cht-nginx:4.4.0-8229-outbound-push
couchdb              running  400_deleteme_couchdb_1                  public.ecr.aws/medic/cht-couchdb:4.4.0-8229-outbound-push
```

#### Troubleshooting
When you are starting a CHT Core instance using Docker Helper 4.x and don't have any containers created, images downloaded, or storage volumes created - the `*.local-ip.medicmobile.org` TLS certificate fails to install, which leads to a browser `Your connection is not private` message.

To solve this issue, follow the steps below:

1. First, find the name of the `nginx` container with: `docker ps --filter "name=nginx" --format '{{ .Names }}'`.
2. After cloning the [CHT Core repo](https://github.com/medic/cht-core), `cd` into the `scripts` directory: `cd ./cht-core/scripts`.
3. Using the container name from the first command, call the script to update the certificate: `./add-local-ip-certs-to-docker-4.x.sh CONTAINER_NAME`.

These three steps look like as following assuming that `CONTAINER_NAME` is equal to `4_3_0_nginx_1`. Note that `CONTAINER_NAME` will be different for each instance of CHT you run with Docker Helper:

```
$ docker ps --filter "name=nginx"  --format '{{ .Names }}'
4_3_0_nginx_1

$ cd Documents/MedicMobile/cht-core/scripts/   

scripts $ ./add-local-ip-certs-to-docker-4.x.sh 4_3_0_nginx_1
4_3_0_nginx_1

If just container name is shown above, a fresh local-ip.medicmobile.org certificate was downloaded fresh local-ip.medicmobile.org.
```

### File locations

The bash script keeps files in two places:

* **`*.env` files** -  the same directory as the bash script. 
* **`~/medic/cht-docker/` files** - in your home directory, a sub-directory is created for each project.  Within each project directory, a `compose` directory has the two compose files and the `couch` directory has the CouchDB datafiles.

While you can manually remove any of these, it's best to use the `destroy` command above to ensure all related data files are deleted too.

### Video 

Here is a video of the helper being run on 1 Dec 2022. The video references `lazydocker` which is [a great way](https://github.com/jesseduffield/lazydocker) to monitor and control your local docker environment:

{{< youtube hrcy8JlJP9M >}}

-------
