---
title: "App Developer Hosting in CHT 3.x"
linkTitle: "App Developer Hosting"
weight: 3
description: >
  Hosting the CHT when developing apps
aliases:
   - /apps/guides/hosting/3.x/app-developer
   - /apps/guides/hosting/app-developer 
---

{{< callout type="warning" >}}
  CHT 3.x is [End-of-Life]({{< relref "releases/#supported-versions" >}}) and no longer supported. 
{{< /callout >}}

This guide assumes you are a CHT app developer wanting to either run concurrent instances of the CHT, or easily be able to switch between different instances without loosing any data while doing so. To do development on the CHT core itself, see the [development guide]({{< relref "community/contributing/code/core/dev-environment" >}}).

{{< callout >}}
  To deploy the CHT in production, see either [AWS hosting]({{< relref "hosting/3.x/self-hosting.md" >}}) or [Self hosting]({{< relref "hosting/3.x/ec2-setup-guide.md" >}}).
{{< /callout >}}

## Getting started

Be sure to meet the [CHT hosting requirements]({{< relref "hosting/requirements" >}}) first. As well, if any other `medic-os` instances using [the main `docker-compose-developer-3.x-only.yml` file](https://raw.githubusercontent.com/medic/cht-core/master/scripts/docker-helper/docker-compose-developer-3.x-only.yml) are running locally, stop them otherwise port, storage volume and container name conflicts may occur.

After meeting these requirements, download the developer YAML file in the directory you want to store them:

```shell
curl -o docker-compose-developer-3.x-only.yml https://raw.githubusercontent.com/medic/cht-core/master/scripts/docker-helper/docker-compose-developer-3.x-only.yml
```

To start the first developer CHT instance, run `docker compose` and specify the file that was just download:

```shell
docker compose -f docker-compose-developer-3.x-only.yml up
```

This may take some minutes to fully start depending on the speed of the Internet connection and speed of the bare-metal host. This is because docker needs to download all the storage layers for all the containers and the CHT needs to run the first run set up. After downloads and setup has completed, the CHT should be accessible on [https://localhost](https://localhost).

When connecting to a new dev CHT instance for the first time, an error will be shown, "Your connection is not private" (see [screenshot](/building/local-setup/privacy.error.png)). To get past this, click "Advanced" and then click "Proceed to localhost".

## Running the Nth CHT instance

After running the first instance of the CHT, it's easy to run as many more as are needed.  This is achieved by specifying different:

* port for `HTTP` redirects (`CHT_HTTP`)
* port for `HTTPS` traffic (`CHT_HTTPS`)
* project to for the docker compose call (`-p PROJECT`)

Assuming you want to start a new project called `the_second` and  start the instance on `HTTP` port `8081` and `HTTPS` port `8443`, this would be the command:

```shell script
CHT_HTTP=8081 CHT_HTTPS=8443 docker compose -p the_second -f docker-compose-developer-3.x-only.yml up
```

The second instance is now accessible at  [https://localhost:8443](https://localhost:8443).

## The `.env` file 

Often times it's convenient to use revision control, like GitHub, to store and publish changes in a CHT app.  A nice compliment to this is to store the specifics on how to run the `docker compose` command for each app. By using a shared `docker compose` configuration for all developers on the same app, it avoids any port collisions and enables all developers to have a unified configuration.

Using the above `the_second` sample project, we can create another directory to host this project's configuration:

```shell
mkdir ../the_second
```

Create a file `../the_second/.env-docker-compose` with this contents:

```shell
COMPOSE_PROJECT_NAME=the_second
CHT_HTTP=8081
CHT_HTTPS=8443
```

Now it's easy to boot this environment by specifying which `.env` file to use:

```shell
docker compose --env-file ../the_second/.env-docker-compose -f docker-compose-developer-3.x-only.yml up
```

## Switching & concurrent projects

The easiest way to switch between projects is to stop the first set of containers and start the second set. Cancel the first project running in the foreground with `ctrl + c`. Then start the second project using either the `.env` file or use the explicit command with ports and project name as shown above.

To run projects concurrently, instead of cancelling the first one, open a second terminal and start the second project.  

## CHT Docker Helper

The `cht-docker-compose.sh` scripts builds on the `docker-compose-developer-3.x-only.yml` and `.env` files used above by helping start CHT instances with a simple text based GUI:

{{< figure src="cht-docker-helper.png" link="cht-docker-helper.png" >}}
The cht-docker-compose.sh script showing the URL and version of the CHT instance as well as number of containers launched, global container count, medic images downloaded count and OS load average. Finally a "Successfully started my_first_project" message is shown and denotes the login is "medic" and the password is "password".


### Prerequisites

#### OS

This script has been heavily tested on Ubuntu and should work very well there.  It has been lightly tested on WSL2 on Windows 10 and macOS (x86*) - both should likely work as well.

\* It will not work on macOS on Apple Silicon (M1/M2).

#### Software

The script will check and require these commands. All but `docker` and `docker compose` should be installed by default on Ubuntu:

* awk
* curl
* cut
* dirname
* docker (At least version 20.x)
* docker compose  (At least version 2.29.7)
* file
* grep
* head
* nc
* tail
* tr
* wc

Optionally you can install `jq` so that the script can parse JSON and tell you which version of the CHT is running.

#### Docker compose file and helper scripts

An up-to-date clone of [cht-core](https://github.com/medic/cht-core/) has everything you need including:

* `docker-compose-developer-3.x-only.yml`
* `cht-docker-compose.sh`
* `docker-status.sh`

### Using

#### Syntax

The helper script is run by calling `./cht-docker-compose.sh`.  It accepts one required and one optional arguments:

* `-e | --env-file` - path to the environment file. Required
* `-d | --docker_action` - docker action to run: `up`, `down` or `destroy`. Optional, defaults to `up`

#### Nomenclature

Docker containers, networks and volumes are always named after the project you're using.  So if your project is called `my_first_project`, you will see:
* Two containers: `my_first_project_medic-os_1` and `my_first_project_haproxy_1`
* One storage volume: `my_first_project_medic-data`
* One network: `my_first_project_medic-net`

#### First Run

These steps assume:

* the first project is `my_first_project`
* one `.env_docker` environment file per project
* `my_first_project` and `cht-core` directories are next to each other in the same parent directory
* you have Internet connectivity (*See [booting with no connectivity](#booting-with-no-connectivity)*)

Follow these steps to create your first developer instance. You can create as many as you'd like:

1. create `./my_first_project/.env_docker` with the contents:
   ```conf
   COMPOSE_PROJECT_NAME=my_first_project
   CHT_HTTP=8080
   CHT_HTTPS=8443   
   ```
2. Change into the `docker-help` directory: `cd ./cht-core/scripts/docker-helper/`
3. Run the helper script and specify your `.env_docker` file:
   ```shell
   ./cht-docker-compose.sh -e ../../../my_first_project/.env_docker
   ```
4. Your CHT instance will be started when you see the text:
   ```shell
   Successfully started project my_first_project
    ``` 

#### Second Run

When you're done with an instance, be sure to shut it down:

```shell
./cht-docker-compose.sh -e ../../../my_first_project/.env_docker -d down
```

All information will be saved, and it should be quick to start for the Nth time.

To start an existing instance again, just run the command from the "First Run" section:

```shell
./cht-docker-compose.sh -e ../../../my_first_project/.env_docker 
```

This command is safe to run as many times as you'd like if  you forget the state of your project's Docker containers.

#### Last Run

When you're done with a project and want to completely destroy it, run `destroy`:

```shell
./cht-docker-compose.sh -e ../../../my_first_project/.env_docker -d destroy
```

***NOTE*** - Be sure you want to run `destroy`. The script will _not_ prompt "are you sure?" and it will just delete all your project's data.

### Troubleshooting

The main issue you're likely to run into is that the CHT doesn't correctly start up, the very reason this script was created.  If the script either hangs on one step, or fails to start and quits after 5 tries, try these steps:

1. Ensure your Internet is working.
2. Destroy everything by using the `-d destroy` [option](#syntax).  While this will delete any data, if you can't start the CHT instance, you won't be loosing any data you care about ;). This will delete the containers and volumes.  Then run `-d up` and try again.
3. Quit apps that may be causing a high load on your computer.  Possibly consider rebooting and running nothing else.  In one instance this helped!

If you still get stuck review the items below as possible issues you may find workarounds to.  If none of these work, see the debug file which is always output in the same directory as your `env_file`.  File a ticket in this repository and attach this log file. To read more about the contents of the `cht-docker-compose.log` see [the CHT Docker Compose Log section](#cht-docker-composelog).

#### Running without the `ip` utility

If you're on macOS, or other OS without the `ip` utility, your IP address will always show as `127.0.0.1`.  You can not connect to this IP from a mobile client on your LAN because it always references the host it's on, not a foreign host.

To work around this, you can find out your IP on your LAN and just replace the `127-0-0-1` part of the `https://127-0-0-1.local-ip.medicmobile.org:8443` URL to be your IP address.  So if your local IP was `192.168.0.22` your URL would be `https://192-168-0-22.local-ip.medicmobile.org:8443`.

#### Booting with no connectivity

This script can work without connectivity after the initial boot.  However, it needs connectivity to do DNS lookups for the `*.local-ip.medicmobile.org` URLs.  To work around this, when you have no connectivity, add an entry in your `/etc/hosts` for the URL showing up in the script. For example, if you're seeing `https://127-0-0-1.local-ip.medicmobile.org:8443` as your IP, add this line to the top of your `/etc/hosts` file.

```shell script
127.0.0.1   127-0-0-1.local-ip.medicmobile.org
```

_**NOTE**_ - You need connectivity on the initial boot of the VM to connect to `staging.dev.medicmobile.org` to download the base version of the CHT. As well, certificates for `*.local-ip.medicmobile.org` are downloaded. Subsequent boots do not require connectivity as long as you do not run `destroy`.

#### Port conflicts

If you have two `.env_docker` files that have the same ports or re-use the same project name, bad things will happen.  Don't do this.

> [!TIP]
> Set up unique project names and unique ports for each project.  Commit these `.env_docker` files to your app config's revision control so all app developers use the same `.env_docker` files.

#### Slow downloads and wait periods

During testing on an Internet connection with high latency (>1000ms) and packet loss, this script had trouble booting the CHT instance because it was taking too long to download the assets from `staging.dev.medicmobile.org`.  Each version is about 38 MB.

To account for this, the wait time is multiplied times the boot iteration for each time it reboots.  It starts at 100 seconds and then 200, 300, 400 up to the fifth time it will wait 500 seconds.

#### Too many containers

If you're on a resource constrained computer, like a very old or very slow laptop, be sure to watch the total number of containers you're running.  More than one or two projects (2 or 4 containers) and you may notice a slow-down. You can use the `./docker-status.sh` script if you forgot which projects you have running:

{{< figure src="docker-status.png" link="docker-status.png" >}}

The docker-status.sh script showing 4 sections. The top section lists the running CHT containers, their IP, their mapped ports and the state (running time). The second section found on the left is a list of docker networks. The third section is on the top right and lists downloaded docker images. The furth section on the bottom right, shows docker volumes

A word of caution though - for now this script doesn't scale well if you have 10s of containers and volumes.  Content [can scroll off the screen](https://user-images.githubusercontent.com/1608415/137566806-e13b765e-4f95-48be-82e7-c8e6351e14b7.mp4) and seem confusing!

#### Output on macOS is too narrow

There's a known bug with the bash library we're using that causes it to always render at 80 characters wide.  [The fix is](https://github.com/metal3d/bashsimplecurses/issues/51#issuecomment-905914780) to use `brew` to run a more recent version of `ncurses`.


#### "Device '' does not exist'" and "curl: (6) Could not resolve host" errors

If you see either of these errors, you're very likely off-line such that you effectively cannot reach the Internet. The script will not work as is.  See the "Booting with no connectivity" section above for work-arounds.

#### Resetting everything

If you REALLY get stuck and want to destroy _**ALL**_ docker containers/volumes/networks, even those not started by this script, run this (but be  _**extra**_ sure that's what you want to do):

```shell
docker stop $(docker ps -q)&&docker system prune&&docker volume prune
```

### cht-docker-compose.log

This log will be output every time you call the script.  It will be created and appended to in the directory where you specified your environment file (`-e PATH/TO/env_file`).

There are three types of lines in this file. The first line will always be the Start line: `item="start"`. Then there will be a Status line: `item="status"`.  Finally, there will be two lines, one for each docker container: `item="docker_logs"`.

#### Shared head

All lines start with a date, PID and count:

| Name in log | Note | Example |
| --------------- | --------------- | --------------- |
| (none - first item) | value from `date` command with `DAY DATE MONTH YEAR TIME AM/PM` | `Fri 15 Oct 2021 02:19:30 PM` |
| `pid` | process ID of the shell script. Will always be an integer | `398399` |
| `count` | how many times the shell script has looped internally | `2` |

#### item = `start`

When you first call the script, a line is output with generic information about the project. This is only shown once per call:

| Name in log | Note | Example(s) |
| --------------- | --------------- | --------------- |
| `item` | which log item this is | `start` |
| `URL` | the full URL of the instance, with port | `https://192-168-68-17.local-ip.medicmobile.org:443` |
| `IP` | the IP address of the instance | `192.168.68.17` |
| `port_https` | port used for `https` | `443` or `8443` |
| `port_http` | port used for `http` | `80` or `8080` |
| `project_name` | The user specified project name. This will be used in docker container and volume names | `helper_test` |
| `total_containers` | Total docker containers running on the host. Useful for catching high load scenarios. Healthy is under `10`. | `2` |

#### item = `status`

For each internal loop of the script, each one taking 1-5 seconds, a status line is output:

| Name in log | Note | Example(s) |
| --------------- | --------------- | --------------- |
| `item` | which log item this is | `status` |
| `CHT_count` | number of CHT containers running for this project. Healthy is `2` | `2` |
| `port_stat` | Status of the `https` port. Healthy is `open` | `open` or `closed` |
| `http_code` | If the `https` port is open by the web server, what `HTTP` response code is returned for a `GET`. Healthy is `200`. If you see `000`, [see workarounds](#booting-with-no-connectivity). |  `200` or `404` |
| `ssl_verify` | If the `https` port is open by the web server, is the valid `local-ip.medicmobile.org` certificate installed. Healthy is `yes` |  `yes` or `no` |
| `reboot_count` | How many times `docker restart` has been called. Max is `5` |  `3` |
| `docker_call` | The docker action call to the script |  `up` |
| `last_msg` | Last message the user was shown |  `Running "down" then "up"` |
| `load_now` | Load average for the past minute. Healthy can vary, but should be < `10` |  `2.66` |   
| `*_haproxy_1` | Name of container based on `project_name`. Showing the "has booted" status, healthy is `true` |  `false` |
| `*_medic-os_1` | Name of container based on `project_name`. Showing the "has booted" status, healthy is `true` |  `false` |

#### item = `docker_logs`

| Name in log | Note | Example(s) |
| --------------- | --------------- | --------------- |
| `item` | which log item this is | `docker_logs` |
| `container` | Container name based on  `project_name` | `helper_test_medic-os_1` |
| `processes` | Number of process running in the container. Medic OS should have 60-90, Nginx 4-10 | `64` |
| `last_log` | Result from calling `docker logs` on the container. Will never have `"` in them and date may differ from start of line date | `[2021/10/15 19:53:39] Info: Horticulturalist has already bootstrapped` |


#### Sample
```shell
Fri 15 Oct 2021 02:30:26 PM PDT pid="410066" count="1" item="start" URL="https://192-168-68-17.local-ip.medicmobile.org:443" IP="192.168.68.17" port_https="443" port_http="80" project_name="helper_test" total_containers="2"
Fri 15 Oct 2021 02:30:26 PM PDT pid="410066" count="1" item="docker_logs" container="helper_test_medic-os_1" processes="64" last_log="[2021/10/15 19:53:39] Info: Horticulturalist has already bootstrapped"
Fri 15 Oct 2021 02:30:26 PM PDT pid="410066" count="1" item="docker_logs" container="helper_test_haproxy_1" processes="4" last_log="Oct 15 21:30:20 576ca039cd88 haproxy[25]: 172.20.0.3,200,GET,/medic/_design/medic,-,medic,'-',21703,5,21402,'curl/7.68.0'"
Fri 15 Oct 2021 02:30:26 PM PDT pid="410066" count="1" item="status" CHT_count="2" port_stat="open" http_code="200" ssl_verify="yes" reboot_count="0" docker_call="up" last_msg="Initializing" load_now="2.66" helper_test_haproxy_1="true" helper_test_medic-os_1="true" 
Fri 15 Oct 2021 02:30:28 PM PDT pid="410066" count="2" item="docker_logs" container="helper_test_medic-os_1" processes="67" last_log="[2021/10/15 19:53:39] Info: Horticulturalist has already bootstrapped"
Fri 15 Oct 2021 02:30:28 PM PDT pid="410066" count="2" item="docker_logs" container="helper_test_haproxy_1" processes="4" last_log="Oct 15 21:30:27 576ca039cd88 haproxy[25]: 172.20.0.3,200,GET,/medic/_design/medic,-,medic,'-',21703,5,21402,'curl/7.68.0'"
Fri 15 Oct 2021 02:30:28 PM PDT pid="410066" count="2" item="status" CHT_count="2" port_stat="open" http_code="200" ssl_verify="yes" reboot_count="0" docker_call="up" last_msg=" :) " load_now="2.69" helper_test_haproxy_1="true" helper_test_medic-os_1="true"
```

## Cookie collisions

The CHT stores its cookies based on the domain.  This means if you're running two concurrent instances on `https://192-168-68-40.local-ip.medicmobile.org:8443` and `https://192-168-68-40.local-ip.medicmobile.org:8440` (note different ports), the CHT would write the cookie under the same `192-168-68-40.local-ip.medicmobile.org` domain. When logging out of one instance, you would get logged out of both and other consistencies.

To avoid this collision of cookies, you can use different IP addresses to access the instances.  This works because of two reasons:
1. the TLS certificate being used is valid for any subdomain of `*.local-ip.medicmobile.org`. Further, the URL always resolves to the IP passed in the `*` section, so you can use any IP
2. the IPs that are available to reference your `localhost` are actually a `/8` netmask, meaning [there are 16 million addresses](https://en.wikipedia.org/wiki/Localhost#Name_resolution) to choose from!

Using the above two reasons, these URLs could work to avoid the cookie collision:

* `https://127-0-0-1.local-ip.medicmobile.org:8443`
* `https://127-0-0-2.local-ip.medicmobile.org:8440`

This would result in the domains being `127.0.0.1` and `127.0.0.2` from the CHT's perspective. When using a mobile device for testing, you're limited to use the LAN ip output in the helper and can not use the `127.x.x.x` IPs.
