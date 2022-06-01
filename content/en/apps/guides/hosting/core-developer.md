---
title: "CHT Core Developer Hosting"
linkTitle: "CHT Core Developer Hosting"
weight: 40
description: >
  Compile the CHT Core from source when doing Core development
---

{{% alert title="Note" %}} This guide assumes you are a CHT Core developer wanting to compile the CHT Core from source code to make commits to the [public GitHub repository](https://github.com/medic/cht-core). To set up a hosting environment for devoloping apps, see the [app guide]({{< relref "apps/guides/hosting/app-developer.md" >}}). 

To deploy the CHT in production, see either [AWS hosting]({{< relref "apps/guides/hosting/self-hosting.md" >}}) or [Self hosting]({{< relref "apps/guides/hosting/ec2-setup-guide.md" >}}){{% /alert %}}


## Introduction

The CHT Core develop will have you install NodeJS, npm, Grunt and CouchDB (via Docker) on your local workstation. These instructions should work verbatim on Ubuntu 18-22, but may need slight tweaks for MacOS (via brew) or Windows (via WSL2).

## Install NodeJS, npm, grunt and Docker

First, update your current packages:

```shell
sudo apt update&&sudo apt -y dist-upgrade
```

Then install `nvm`, add it to your path and install NodeJS 12:

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.bashrc
nvm install v12
```

Now let's ensure NodeJS 12 and npm 6 were installed. This should output version 12.x.x for NodeJS and 6.x.x for `npm`:

```shell
node -v&&npm -v
```

With NodeJS out of the way, let's install `grunt` via `npm` and supporting tools via `apt`:

```shell
npm install -g grunt-cli
sudo apt -y install xsltproc curl uidmap jq
```

Install Docker with this sweet one liner (note it's directly from docker.com):

```shell
curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh
```

It's easier if you don't always have to run `sudo` for all your Docker calls, so let's set that up:

```shell
dockerd-rootless-setuptool.sh install
echo "export PATH=/usr/bin:$PATH" >> ~/.bashrc
echo "export DOCKER_HOST=unix:///run/user/1000/docker.sock" >> ~/.bashrc
. ~/.bashrc
```

In order for Docker to boot correctly, restart entire machine, which will complete the "Install" Section:

```shell
sudo reboot
```

## CouchDB Setup in Docker

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
echo "export COUCH_NODE_NAME=nonode@nohost">> ~/.bashrc
echo "export COUCH_URL=http://medic:password@localhost:5984/medic">> ~/.bashrc
. ~/.bashrc
echo $COUCH_NODE_NAME&& echo $COUCH_URL
```

### CHT Core cloning and setup

Clone the main CHT Core repo from GitHub and initialize it with an `npm` command. Note this last command may take many minutes. Be patient!

```shell
git clone https://github.com/medic/cht-core ~/cht-core
cd ~/cht-core
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
cd ~/cht-core&&grunt                            
```

Be **very** patient until you see:

> "Waiting..."

Then in a 2nd terminal run:

```shell
cd ~/cht-core&&grunt dev-api
```

Finally, in a 3rd terminal run:

```shell
cd ~/cht-core&&grunt dev-sentinel
```

That's it!  Now when you edit code in your IDE, it should automatically reload.  You can see the CHT running locally here: [http://localhost:5988/](http://localhost:5988/)

When you're done with development you can `ctrl + c` in the three terminals and stop the CouchDB container with `docker stop medic-couchdb`.  When you want to resume development later, run the `docker run...` command above and re-run the three terminal commands

## Prerequisites

If you had issues with following the above steps, check out these links for how to install the prerequisites on your specific platform:

* [Node.js 12.x](https://nodejs.org/)
* [npm 6.x.x](https://npmjs.com/)
* [grunt cli](https://gruntjs.com/using-the-cli)
* xsltproc - `sudo apt install xsltproc`
* [python 2.7](https://www.python.org/downloads/)
* [Docker](https://docs.docker.com/engine/install/)
* [CouchDB](https://docs.couchdb.org/en/2.3.1/install/index.html) - bare-metal instead of in Docker - you **MUST** use CouchDB 2.x! We still strongly recommend using Docker.
