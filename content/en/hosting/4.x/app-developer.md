---
title: "App Developer Hosting in CHT 4.x"
linkTitle: "App Developer Hosting"
weight: 10
aliases:
  - /apps/guides/hosting/4.x/app-developer
  - /apps/guides/hosting/app-developer
description: >
  Hosting the CHT when developing apps
---

{{% pageinfo %}} 
This guide assumes you are a CHT app developer wanting to either run concurrent instances of the CHT, or easily be able to switch between different instances without losing any data while doing so. To do development on the CHT Core Framework itself, see the [development guide]({{< relref "contribute/code/core/dev-environment" >}}).

To deploy the CHT 3.x in production, see either [AWS hosting]({{< relref "hosting/3.x/ec2-setup-guide.md" >}}) or [Self hosting]({{< relref "hosting/3.x/self-hosting.md" >}}). To deploy 4.x in production see the [4.x documentation]({{< relref "hosting/4.x/production" >}}).
{{% /pageinfo %}}


## Getting started

First, decide which way to run the CHT: Docker Helper or manually it via `docker compose`. Since they both achieve the same result, **it is recommended to use Docker Helper** as shown in the next section as it's very easy to run.  Alternately, the manual process is covered at the [bottom of the page](#manual-docker-compose-method).  


## CHT Docker Helper for 4.x

{{% alert title="Note" %}} This is for CHT 4.x.  To use a CHT 3.x version, see the earlier [CHT Docker Helper page]({{< relref "hosting/3.x/app-developer#cht-docker-helper" >}}){{% /alert %}}

The `cht-docker-compose.sh` scripts downloads 3 compose files and builds an `.env` file. This greatly eases starting your first CHT instance with a simple text based GUI which works on Windows (WSL2), macOS (both x86 and Apple Silicon) and Linux.

![The cht-docker-compose.sh script showing the URL and version of the CHT instance as well as number of containers launched, global container count, medic images downloaded count and OS load average. Finally a "Successfully started my_first_project" message is shown and denotes the login is "medic" and the password is "password".](cht-docker-helper.png)

This script brings a lot of benefits with it:
* You only have to download one bash script
* All compose files and images will be downloaded automatically for you
* All networks, storage volumes and containers will be created
* A valid TLS certificate will be installed, allowing you to easily test on with CHT Android natively on a mobile device
* An unused port is automatically chosen for you when creating a new project.  No more manually looking at your existing `.env` files!

### Installing

To get started using it:
1. Meet all [CHT hosting requirements]({{< relref "hosting/requirements" >}})
2. Clone the [CHT Core](https://github.com/medic/cht-core/) repo
3. When you want to check for updates, just run `git pull origin` in the `cht-core` directory.

An alternate to steps 2 and 3 above, if a more stand-alone version is desired, the bash script can be `curl`ed directly, but you can't use `git` to easily update it then:

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

## Manual `docker compose` method

This process achieves the same result as Docker Helper, but is a more manual process. Be sure the [CHT hosting requirements]({{< relref "hosting/requirements" >}}) are all met first.

To avoid conflicts, ensure that all other CHT 4.x instances are stopped. To stop ALL containers, you can use

```shell
docker kill $(docker ps -q)
````

After meeting these requirements, create a directory and download the developer YAML files in the directory you want to store them. This example uses `~/cht-4-app-developer` as the directory. If you don't know which to use, use Single Node CouchDB:

{{< tabpane persist=false lang=shell >}}
{{< tab header="Single Node CouchDB" >}}
mkdir -p ~/cht_4_app_developer-dir/{compose,couchdb} && cd ~/cht_4_app_developer-dir
curl -s -o ./compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml
curl -s -o ./compose/cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic%3Amedic%3Amaster/docker-compose/cht-core.yml
curl -s -o ./compose/cht-couchdb.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic%3Amedic%3Amaster/docker-compose/cht-couchdb.yml
{{< /tab >}}
{{< tab header="Multi-Node CouchDB" >}}
mkdir -p ~/cht_4_app_developer-dir/{compose,couchdb} && cd ~/cht_4_app_developer-dir
curl -s -o ./compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml
curl -s -o ./compose/cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic%3Amedic%3Amaster/docker-compose/cht-core.yml
curl -s -o ./compose/cht-couchdb.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic%3Amedic%3Amaster/docker-compose/cht-couchdb-clustered.yml
{{< /tab >}}
{{< /tabpane >}}

You should now have 3 compose files and 2 directories which we can check with `ls -R`:

```shell
compose  compose.yml  couch

./compose:
cht-core.yml  cht-couchdb.yml

./couch:
```

To prepare for the first developer CHT instance, write all environment variables to the `.env` file with this code. Be sure to use the same single or multi-node as above. If you don’t know which to use, use Single Node CouchDB:

{{< tabpane persist=false lang=shell >}}
{{< tab header="Single Node CouchDB" >}}
cat > ~/cht_4_app_developer-dir/.env << EOF
NGINX_HTTP_PORT=8080
NGINX_HTTPS_PORT=8443
COUCHDB_USER=medic
COUCHDB_PASSWORD=password
CHT_COMPOSE_PROJECT_NAME=cht_4_app_developer
DOCKER_CONFIG_PATH=${HOME}/cht_4_app_developer-dir
COUCHDB_SECRET=19f3b9fb1d7aba1ef4d1c5ed709512ee
COUCHDB_UUID=e7122b1e463de4449fb05b0c494b0224
COUCHDB_DATA=${HOME}/cht_4_app_developer-dir/couchdb
CHT_COMPOSE_PATH=${HOME}/cht_4_app_developer-dir/compose
CHT_NETWORK=cht_4_app_developer
EOF
{{< /tab >}}
{{< tab header="Multi-Node CouchDB" >}}
cat > ~/cht_4_app_developer-dir/.env << EOF
NGINX_HTTP_PORT=8080
NGINX_HTTPS_PORT=8443
COUCHDB_USER=medic
COUCHDB_PASSWORD=password
CHT_COMPOSE_PROJECT_NAME=cht_4_app_developer
DOCKER_CONFIG_PATH=${HOME}/cht_4_app_developer-dir
COUCHDB_SECRET=19f3b9fb1d7aba1ef4d1c5ed709512ee
COUCHDB_UUID=e7122b1e463de4449fb05b0c494b0224
CHT_COMPOSE_PATH=${HOME}/cht_4_app_developer-dir/compose
CHT_NETWORK=cht_4_app_developer
DB1_DATA=/var/home/mrjones/Documents/medicmobile/multi-couch-test/couchdb/srv1
DB2_DATA=/var/home/mrjones/Documents/medicmobile/multi-couch-test/couchdb/srv2
DB3_DATA=/var/home/mrjones/Documents/medicmobile/multi-couch-test/couchdb/srv3
COUCHDB_SERVERS=couchdb-1.local,couchdb-2.local,couchdb-3.local
EOF
{{< /tab >}}
{{< /tabpane >}}


Start the first CHT instance by calling `docker`:

```shell script
cd ~/cht_4_app_developer-dir && docker compose up -d
```

This may take some minutes to fully start depending on the speed of the internet connection and speed of the host. Docker needs to download all the container images and first setup needs to run on the CHT. You can check the status with:

```shell
docker ps --filter "name=cht_4_app_developer" --format "{{.Status}} {{.Names}}"
```

Which should look like this:

{{< tabpane persist=false lang=shell >}}
{{< tab header="Single Node CouchDB" >}}
Up 47 seconds cht_4_app_developer-nginx-1
Up 48 seconds cht_4_app_developer-sentinel-1
Up 48 seconds cht_4_app_developer-api-1
Up 48 seconds cht_4_app_developer-haproxy-1
Up 48 seconds cht_4_app_developer-healthcheck-1
Up 48 seconds cht_4_app_developer-couchdb-1
Up 49 seconds cht_4_app_developer-dir-cht-upgrade-service-1
{{< /tab >}}
{{< tab header="Multi-Node CouchDB" >}}
Up 2 seconds cht_4_app_developer-nginx-1
Up 3 seconds cht_4_app_developer-api-1
Up 3 seconds cht_4_app_developer-sentinel-1
Up 4 seconds cht_4_app_developer-couchdb-1.local-1
Up 4 seconds cht_4_app_developer-couchdb-2.local-1
Up 4 seconds cht_4_app_developer-haproxy-1
Up 4 seconds cht_4_app_developer-couchdb-3.local-1
Up 4 seconds cht_4_app_developer-healthcheck-1
Up 4 seconds cht_4_app_developer-dir-cht-upgrade-service-1
{{< /tab >}}
{{< /tabpane >}}

After running the above `docker ps` command and you see your containers running, the CHT is accessible on [https://localhost:8443](https://localhost:8443). The username is `medic` and password is `password`.

The first time you connect in a browser, an error will be shown, "Your connection is not private" with `NET::ERR_CERT_AUTHORITY_INVALID` (see [screenshot](/building/local-setup/privacy.error.png)). To get past this, click "Advanced" and then click "Proceed to localhost".

To stop this instance run:

```shell
docker stop $(docker ps -q --filter "name=cht_4_app_developer")
```

## Running the Nth CHT instance

After running the first instance of the CHT, it's easy to run as many more as are needed.  This is achieved by specifying different:

* port for `HTTP` redirects (`CHT_HTTP`)
* port for `HTTPS` traffic (`NGINX_HTTP_PORT`)
* directory for storing the compose files and CouchDB files

Assuming you want to start a new project called `the_second` and  start the instance on `HTTP` port `8081` and `HTTPS` port `8443`, we would first create a new directory and download the same files:

```shell 
mkdir -p ~/cht_4_app_developer-2nd-dir/{compose,couchdb} && cd ~/cht_4_app_developer-2nd-dir
curl -s -o ./compose.yml https://raw.githubusercontent.com/medic/cht-upgrade-service/main/docker-compose.yml
curl -s -o ./compose/cht-core.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic%3Amedic%3Amaster/docker-compose/cht-core.yml
curl -s -o ./compose/cht-couchdb.yml https://staging.dev.medicmobile.org/_couch/builds_4/medic%3Amedic%3Amaster/docker-compose/cht-couchdb.yml
```

Then, we would create an `.env` file like before

```sh
cat > ~/cht_4_app_developer-2nd-dir/.env << EOF
NGINX_HTTP_PORT=8081
NGINX_HTTPS_PORT=8444
COUCHDB_USER=medic
COUCHDB_PASSWORD=password
CHT_COMPOSE_PROJECT_NAME=cht_4_app_developer-2nd
DOCKER_CONFIG_PATH=${HOME}/cht_4_app_developer-2nd-dir
COUCHDB_SECRET=19f3b9fb1d7aba1ef4d1c5ed709512ee
COUCHDB_UUID=e7122b1e463de4449fb05b0c494b0224
COUCHDB_DATA=${HOME}/cht_4_app_developer-2nd-dir/couch
CHT_COMPOSE_PATH=${HOME}/cht_4_app_developer-2nd-dir/compose
CHT_NETWORK=cht_4_app_developer-2nd
EOF
```

And finally use the same `docker compose` command as above:

```shell script
cd ~/cht_4_app_developer-2nd-dir && docker compose up
```

The second instance is now accessible at  [https://localhost:8444](https://localhost:8444) and again using username `medic` and password `password` to login.

## Switching & concurrent projects

The easiest way to switch between projects is to stop the first set of containers and start the second set. Cancel the first project running in the foreground with `ctrl + c` and `stop` all the project's services. Here any container named `cht_4_app_developer-2nd*` is stopped:

```shell
docker stop $(docker ps -q --filter "name=cht_4_app_developer-2nd*")
```

Alternately, you can stop ALL containers (even non-CHT ones!) with `docker kill $(docker ps -q)`. Then start the other CHT project using either the `.env` file or use the explicit command with ports and other environment variables as shown above.

To run projects concurrently open a second terminal and start the second project so you don't have to cancel and `stop` the first project.  Remember to avoid port conflicts!
