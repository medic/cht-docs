---
title: "CHT Core Developer Setup"
linkTitle: "CHT Core Developer Setup"
weight: 40
description: >
  Getting your local machine ready to to development work on CHT Core.
---

{{% alert title="Note" %}} This guide assumes you are a CHT Core developer wanting to run the CHT Core from source code to make commits to the [public GitHub repository](https://github.com/medic/cht-core). To set up a your environment for developing apps, see the [app guide]({{< relref "apps/guides/hosting/app-developer.md" >}}).

To deploy the CHT in production, see either [AWS hosting]({{< relref "apps/guides/hosting/self-hosting.md" >}}) or [Self hosting]({{< relref "apps/guides/hosting/ec2-setup-guide.md" >}}){{% /alert %}}


## The Happy Path Installation

This CHT Core developer guide will have you install NodeJS, npm, Grunt and CouchDB (via Docker) on your local workstation. These instructions should work verbatim on Ubuntu 18-22, but will need tweaks for MacOS (via `brew`) or Windows (via WSL2).

### Install NodeJS, npm, grunt and Docker

First, update your current Ubuntu packages and install some supporting tools via `apt`:

```shell
sudo apt update && sudo apt -y dist-upgrade
sudo apt -y install xsltproc curl uidmap jq
```

Then install `nvm`, add it to your path and install NodeJS 12:

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | $0
. ~/.$0rc
nvm install 12
```

Now let's ensure NodeJS 12 and npm 6 were installed. This should output version 12.x.x for NodeJS and 6.x.x for `npm`:

```shell
node -v && npm -v
```

With NodeJS out of the way, let's install `grunt` via `npm`:

```shell
npm install -g grunt-cli
```

Install Docker:

```shell
curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh
```

It's easier if you don't always have to run `sudo` for all your Docker calls, so let's set that up:

```shell
dockerd-rootless-setuptool.sh install
echo "export PATH=/usr/bin:$PATH" >> ~/.$0rc
echo "export DOCKER_HOST=unix:///run/user/1000/docker.sock" >> ~/.$0rc
. ~/.$0rc
```

In order for Docker to boot correctly, restart entire machine, which will complete the "Install" Section:

```shell
sudo reboot
```

### CouchDB Setup in Docker

Before we get started, let's run the simple `hello-world` Docker container. This will ensure docker is working as expected and output "Hello from Docker!" as well as some other intro text:

```shell
docker run hello-world
```

Now that we know Docker is set up, let's start our CouchDB container. Note this will run in the background and store its data in `/home/YOUR-USER/cht-docker`. The login for your CHT instance will be `medic` and the password will be `password`:

```shell
docker run -d -p 5984:5984 -p 5986:5986 --name medic-couchdb -e COUCHDB_USER=medic -e COUCHDB_PASSWORD=password -v ~/cht-docker/local.d:/opt/couchdb/data -v ~/cht-docker/local.d:/opt/couchdb/etc/local.d apache/couchdb:2
```

Let's ensure CouchDB is set up with a test `curl` call. This should show "nonode@nohost" in JSON:

```shell
curl -X GET "http://medic:password@localhost:5984/_membership" | jq
```

Every time you run any `grunt` or `node` commands, it will expect `COUCH_NODE_NAME` and `COUCH_URL` environment variables to be set:

```shell
echo "export COUCH_NODE_NAME=nonode@nohost">> ~/.$0rc
echo "export COUCH_URL=http://medic:password@localhost:5984/medic">> ~/.$0rc
. ~/.$0rc
echo $COUCH_NODE_NAME && echo $COUCH_URL
```

### CHT Core Cloning and Setup

Clone the main CHT Core repo from GitHub and change directories into it:

```shell
git clone https://github.com/medic/cht-core ~/cht-core
cd ~/cht-core
```

Install dependencies and perform other setup tasks via an `npm` command. Note this command may take many minutes. Be patient!

```shell
npm ci
```

We need to harden couch with a `grunt` call, required even in development:

```shell
grunt secure-couchdb
curl -X PUT "http://medic:password@localhost:5984/_node/$COUCH_NODE_NAME/_config/httpd/WWW-Authenticate" -d '"Basic realm=\"administrator\""' -H "Content-Type: application/json"
```

### Developing

Now you have everything installed and can begin development! You'll need three separate terminals when doing development. In the first terminal, run:

```shell
cd ~/cht-core && grunt
```

Be **very** patient until you see:

> "Waiting..."

Then in a 2nd terminal run:

```shell
cd ~/cht-core && grunt dev-api
```

Finally, in a 3rd terminal run:

```shell
cd ~/cht-core && grunt dev-sentinel
```

That's it!  Now when you edit code in your IDE, it will automatically reload.  You can see the CHT running locally here: [http://localhost:5988/](http://localhost:5988/)

When you're done with development you can `ctrl + c` in the three terminals and stop the CouchDB container with `docker stop medic-couchdb`.  When you want to resume development later, run `docker start medic-couchdb` and re-run the three terminal commands.

## Other Paths

If you weren't able to follow the happy path above, here are some details about the developer install that may help you troubleshoot what went wrong.

### Prerequisites

If you had issues with following the above steps, check out these links for how to install the prerequisites on your specific platform:

* [Node.js 12.x](https://nodejs.org/)
* [npm 6.x.x](https://npmjs.com/)
* [grunt cli](https://gruntjs.com/using-the-cli)
* [xsltproc](http://www.sagehill.net/docbookxsl/InstallingAProcessor.html) 
* [python 2.7](https://www.python.org/downloads/)
* [Docker](https://docs.docker.com/engine/install/)
* [CouchDB](https://docs.couchdb.org/en/2.3.1/install/index.html) - OS package instead of in Docker - you **MUST** use CouchDB 2.x! We still strongly recommend using Docker.

### CouchDB on Docker Details

Breaking down the command from [the above section]({{< relref "apps/guides/hosting/core-developer#couchdb-setup-in-docker" >}}), here's a generic version that doesn't include hard coded paths:

``shell
docker run -d -p 5984:5984 -p 5986:5986 --name medic-couchdb -e COUCHDB_USER=medic -e COUCHDB_PASSWORD=password -v <data path>:/opt/couchdb/data -v <config path>:/opt/couchdb/etc/local.d apache/couchdb:2
```

Parts of the command:
- `--name` creates a container called `medic-couchdb`. You can name it whatever you want, but this is how you refer to it later
- `-e` sets an environment variable inside the container. Two are set here, for a user and password for the initial admin user.
- `-v` maps where couchdb stores data to your local file system to ensure persistence without depending on the container, using the path *before* the `:` (the path after the colon is the internal path inside the docker image). This should be somewhere you have write access to, and want this data to be stored. The second mounted volume is for the couch configuration, which will retain settings if your container is removed. This is especially important after running the command to secure the instance (done in steps below).
- `apache/couchdb:2` will install the latest package for CouchDB 2.x

Once this downloads and starts, you will need to [initialise CouchDB](http://localhost:5984/_utils/#/setup) as noted in [their install instructions](https://docs.couchdb.org/en/2.3.1/setup/index.html#setup).

You can use `docker stop medic-couchdb` to stop it and `docker start medic-couchdb` to start it again. Remember that you'll need to start it whenever you restart your OS, which might not be the case if you use a normal OS package. `docker rm medic-couchdb` will totally remove the container.

Medic recommends you familiarise yourself with other Docker commands to make docker image and container management clearer.

### Required environment variables

Medic needs the following environment variables to be declared:
- `COUCH_URL`: the full authenticated url to the `medic` DB. Locally this would be  `http://myadminuser:myadminpass@localhost:5984/medic`
- `COUCH_NODE_NAME`: the name of your CouchDB's node. The Docker image default is `nonode@nohost`. Other installations may use `couchdb@127.0.0.1`. You can find out by querying [CouchDB's membership API](https://docs.couchdb.org/en/stable/api/server/common.html#membership)
- (optionally) `API_PORT`: the port API will run on. If not defined we use `5988`
- (optionally) `CHROME_BIN`: only required if `grunt unit` or `grunt e2e` complain that they can't find Chrome.

How to permanently define environment variables depends on your OS and shell (e.g. for bash you can put them `~/.bashrc`). You can temporarily define them with `export`:

```shell
export COUCH_NODE_NAME=nonode@nohost
export COUCH_URL=http://myadminuser:myadminpass@localhost:5984/medic
```

## Tests

Refer to [the testing doc](https://github.com/medic/cht-core/blob/master/TESTING.md) in the GitHub repo.

## nginx-local-ip

[`nginx-local-ip`](https://github.com/medic/nginx-local-ip) is a local proxy that keeps all traffic local, and runs without latency or throttling. If sharing your local CHT instance is not required, it is the recommended method to add a valid SSL certificate (rather than `ngrok` or similar).

1. Clone the repo: `git clone https://github.com/medic/nginx-local-ip.git`
1. `cd` into the new directory: `cd nginx-local-ip`
1. Assuming your IP is `192.168.0.3`, start `nginx-local-ip` to connect to:
  * The CHT API running via `grunt` or `horti`, execute `APP_URL=http://192.168.0.3:5988 docker-compose up` and then access it at [https://192-168-0-3.my.local-ip.co/](https://192-168-0-3.my.local-ip.co/)
  * The CHT API running via `docker`, the ports are remapped, so execute `HTTP=8080 HTTPS=8443 APP_URL=https://192.168.0.3 docker-compose up` and then access it at [https://192-168-0-3.my.local-ip.co:8443/](https://192-168-0-3.my.local-ip.co:8443/)
1. The HTTP/HTTPS ports (`80`/`443`) need to accept traffic from the IP address of your host machine and your local webapp port (e.g. `5988`) needs to accept traffic from the IP address of the `nginx-local-ip` container (on the Docker network). If you are using the UFW firewall (in a Linux environment) you can allow traffic on these ports with the following commands:

(Since local IP addresses can change over time, ranges are used in these rules so that the firewall configuration does not have to be updated each time a new address is assigned.)

```shell
$ sudo ufw allow proto tcp from 192.168.0.0/16 to any port 80,443
$ sudo ufw allow proto tcp from  172.16.0.0/16 to any port 5988
```

## Remote Proxies

`ngrok` and `pagekite` are remote proxies that route local traffic between your client and the CHT via a remote SSL terminator. While easy and handy, they introduce latency and are sometimes throttled.

### ngrok

1. Create an [ngrok account](https://ngrok.com/), download and install the binary, then link your computer to your ngrok account.
1. Start `ngrok` to connect to:
  * The CHT API running via `grunt` or `horti`, execute `./ngrok http 5988`
  * The CHT API running via `docker`, execute `./ngrok http 443`
1. Access the app using the https address shown (e.g. `https://YOUR-NGROK-NAME.ngrok.io`, replacing `YOUR-NGROK-NAME` with what you signed up with).

**Note:** The service worker cache preload sometimes fails due to connection throttling (thereby causing an `ngrok` failure at startup).

### pagekite

1. Create a [pagekite account](https://pagekite.net/signup/), download and install the python script.
1. Start pagekite (be sure to replace `YOUR-PAGEKIT-NAME` with the URL you signed up for) to connect to:
  * The CHT API running via `grunt` or `horti`, execute `python pagekite.py 5988 YOUR-PAGEKIT-NAME.pagekite.me`
  * The CHT API running via `docker`, execute `python pagekite.py 443 YOUR-PAGEKIT-NAME.pagekite.me`
1. Access the app using the https address shown (e.g. `https://YOUR-PAGEKIT-NAME.pagekite.me`).
