---
title: "App Developer Hosting"
linkTitle: "App Developer Hosting"
weight: 40
description: >
  Hosting the CHT when developing apps
---

{{% alert title="Note" %}} This guide assumes you are a CHT app developer wanting to either run concurrent instances of the CHT, or easily be able to switch between different instances without loosing any data while doing so. To do development on the CHT core itself, see the [development guide](https://github.com/medic/cht-core/blob/master/DEVELOPMENT.md). 

To deploy the CHT in production, see either [AWS hosting]({{< relref "apps/guides/hosting/self-hosting.md" >}}) or [Self hosting]({{< relref "apps/guides/hosting/ec2-setup-guide.md" >}}){{% /alert %}}


## Getting started

Be sure to meet the [CHT hosting requirements]({{< relref "apps/guides/hosting/requirements" >}}) first. As well, if any other `medic-os` instances using [the main `docker-compose.yml` file](https://github.com/medic/cht-core/blob/master/docker-compose.yml) are running locally, stop them. Otherwise port, storage volume and container name conflicts may occur.

After meeting these requirements, download the two developer YAML files in the directory you want to store them:

```shell script
curl -o docker-compose-developer-base.yml https://raw.githubusercontent.com/medic/cht-core/master/docker-compose-developer-base.yml
curl -o docker-compose-developer-storage.yml https://raw.githubusercontent.com/medic/cht-core/master/docker-compose.yml
```

To start the first developer CHT instance, run `docker-compose` and specify the two files that were just download:

```shell script
docker-compose -f docker-compose-developer-base.yml -f docker-compose-developer-storage.yml up
```

This script may take some minutes to fully start depending on the speed of the Internet connection speed of the bare metal host.  After it has completed, the CHT should be accessible on [https://localhost](https://localhost).

## Running the Nth CHT instance

After running the first instance of the CHT, it's easy to run as many more as are needed.  This is achieved by specifying different:

* ports for `HTTP` and `HTTPS` traffic (`CHT_HTTP` and `CHT_HTTPS`)
* storage volume to keep all the CHT data (`CHT_DATA`)
* project to for the docker compose call (`-p PROJECT`)

Assuming you want to start a new project called `the_second`, copy the volume YAML file to a new one then replace the volume name inside it with sed:

```shell script
cp docker-compose-developer-storage.yml docker-compose-developer-the_second-storage.yml`
sed -e 's/medic-data/the_second/' -i docker-compose-developer-the_second-storage.yml
```

Now start the instance on `CHT_HTTP` and `CHT_HTTPS` ports, a new project, and  the same `CHT_DATA` volume name used in the `sed` command above:

```shell
CHT_DATA=the_second CHT_HTTP=8081 CHT_HTTPS=8443 docker-compose -p the_second -f docker-compose-developer-base.yml -f docker-compose-developer-the_second-storage.yml up
```

The second instance is now accessible at  [https://localhost:8443](https://localhost:8443).

## The `.env` file 

TBD WIP

## Switching between projects

TBD WIP

## Cookie collisions

TBD WIP but cover 127.0.0.1 vs 127.0.1.1 , or change examples above and explain why?
