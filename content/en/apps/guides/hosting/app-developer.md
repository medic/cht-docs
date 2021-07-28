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

Be sure to meet the [CHT hosting requirements]({{< relref "apps/guides/hosting/requirements" >}}) first. As well, if any other `medic-os` instances using [the main `docker-compose.yml` file](https://github.com/medic/cht-core/blob/master/docker-compose.yml) are running locally, stop them otherwise port, storage volume and container name conflicts may occur.

After meeting these requirements, download the developer YAML file in the directory you want to store them:

```shell script
curl -o docker-compose-developer.yml https://raw.githubusercontent.com/medic/cht-core/master/docker-compose-developer.yml
```

To start the first developer CHT instance, run `docker-compose` and specify the file that was just download:

```shell script
docker-compose -f docker-compose-developer.yml up
```

This may take some minutes to fully start depending on the speed of the Internet connection and speed of the bare-metal host.  After it has completed, the CHT should be accessible on [https://localhost](https://localhost).

When connecting to a new dev CHT instance for the first time, an error will be shown, "Your connection is not private" (see [screenshot](/apps/tutorials/local-setup/privacy.error.png)). To get past this, click "Advanced" and then click "Proceed to localhost".

## Running the Nth CHT instance

After running the first instance of the CHT, it's easy to run as many more as are needed.  This is achieved by specifying different:

* port for `HTTP` redirects (`CHT_HTTP`)
* port for `HTTPS` traffic (`CHT_HTTPS`)
* project to for the docker compose call (`-p PROJECT`)

Assuming you want to start a new project called `the_second` and  start the instance on `HTTP` port `8081` and `HTTPS` port `8443`, this would be the command:

```shell script
CHT_HTTP=8081 CHT_HTTPS=8443 docker-compose -p the_second -f docker-compose-developer.yml up
```

The second instance is now accessible at  [https://localhost:8443](https://localhost:8443).

## The `.env` file 

Often times it's convenient to use revision control, like GitHub, to store and publish changes in a CHT app.  A nice compliment to this is store the specifics on how to run the `docker-compose` command for each app. By using a shared `docker-compose` configuration for all developers on the same app, it avoids any port collisions and enables all developers to have a unified configuration.

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
docker-compose --env-file ../the_second/.env-docker-compose -f docker-compose-developer.yml up
```

## Switching & concurrent projects

The easiest way to switch between projects is to stop the first set of containers and start the second set. Cancel the first project running in the foreground with `ctrl + c`. Then start the second project using either the `.env` file or use the explicit command with ports and project name as shown above.

To run projects concurrently, instead of cancelling the first one, open a second terminal and start the second project.  

To read more about how `docker-compose` works, be sure to read the [helpful docker-compose commands]({{< relref "core/guides/docker-setup#helpful-docker-commands" >}}) page. 

## Cookie collisions

The CHT stores its cookies based on the domain.  This means if you're running two concurrent instances on `https://localhost` and `https://localhost:8443`, the CHT would store the cookie under the same `localhost` domain. When logging out of one instance, you would get logged out of both and other consistencies.

To avoid this collision of cookies, you can use different IP addresses to access the instances.  This works because the IPs that are available to reference `localhost` are actually a `/8` netmask, meaning [there are 16 million addresses](https://en.wikipedia.org/wiki/Localhost#Name_resolution) to choose from!  

Using the above two configurations, these URLs could work to avoid the cookie colission: 

* [https://127.0.0.1](https://127.0.0.1)
* [https://127.0.0.2:8443](https://127.0.0.2:8443)

This would result in the domains being `127.0.0.1` and `127.0.0.2` from the CHT's perspective.

Another work around is to use incognito mode, [browser containers](https://support.mozilla.org/en-US/kb/containers) or different browsers.