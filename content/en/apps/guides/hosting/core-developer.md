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

First, update your existing list of packages:

```shell
sudo apt update&&sudo apt -y dist-upgrade
```

Then install `nvm`, add it to your path and install node 12:

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.bashrc
nvm install v12
```

Now let's ensure NodeJS 12 and npm 6 were installed:

```shell
node -v&&npm -v
```

With NodeJS out of the way, let's install `grunt` via `npm` and supporting tools via `apt`:

```shell
npm install -g grunt-cli
sudo apt -y install xsltproc curl uidmap jq
```

The second to last step in installation is Docker:

```shell
curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh
```

In order for docker to boot correctly, restart entire machine:

```shell
sudo reboot
```

## Docker Config and CouchDB Setup in Docker

### let docker run rootless
dockerd-rootless-setuptool.sh install
echo "export PATH=/usr/bin:$PATH" >> ~/.bashrc
echo "export DOCKER_HOST=unix:///run/user/1000/docker.sock" >> ~/.bashrc
. ~/.bashrc

### test docker works
docker run hello-world

### start couchdb container
docker run -d -p 5984:5984 -p 5986:5986 --name medic-couchdb -e COUCHDB_USER=medic -e COUCHDB_PASSWORD=password -v ~/cht-docker/local.d:/opt/couchdb/data -v ~/cht-docker/local.d:/opt/couchdb/etc/local.d apache/couchdb:2

### double check node name - should show "nonode@nohost" in JSON
curl -X GET "http://medic:password@localhost:5984/_membership" | jq

### set couch exports,  source bash file and ensure they're set
echo "export COUCH_NODE_NAME=nonode@nohost">> ~/.bashrc
echo "export COUCH_URL=http://medic:password@localhost:5984/medic">> ~/.bashrc
. ~/.bashrc
echo $COUCH_NODE_NAME&& echo $COUCH_URL

### clone cht-core repo, cd into and install npm requirements
git clone https://github.com/medic/cht-core
cd cht-core
npm ci   # warning - may take a looooooong time - 5+ minutes - be patient!

### harden couchdb
grunt secure-couchdb
curl -X PUT "http://medic:password@localhost:5984/_node/$COUCH_NODE_NAME/_config/httpd/WWW-Authenticate" -d '"Basic realm=\"administrator\""' -H "Content-Type: application/json"

### start CHT in development mode
grunt                               # in current terminal - wait 5+ min, then at "Waiting..."  proceed
cd cht-core&&grunt dev-api          # in 2nd terminal
cd cht-core&&grunt dev-sentinel     # in 3rd terminal

### todo - add nginx-local-ip steps?

### test it!
xdg-open  http://localhost:5988/
