---
title: "OpenHIM Mediators"
linkTitle: "OpenHIM Mediators"
weight: 2
description: >
   Guide to running OpenHIM and Mediators with Docker Compose
keywords: openmrs interoperability
relatedContent: >
  building/interoperability/cht-config
  building/interoperability/ltfu
  building/integrations/openmrs
aliases:
   - /building/guides/interoperability/openhim
---

### Overview

The components and reference information for interoperability used in CHT Interoperability project are:

- [OpenHIE](https://ohie.org/) defines the architecture for an interoperability layer.
- [OpenHIM](http://openhim.org/) is a middleware component designed to ease interoperability between systems.
- [HL7 FHIR](https://www.hl7.org/fhir/index.html) is a messaging format to allow all systems to understand the format of the message.

#### Interoperability with the CHT

The structure of documents in the CHT database reflects the configuration of the system, and therefore, does not map directly to a FHIR message format. To achieve interoperability, the CHT uses a middleware to convert the CHT data structure into a standardized form so the other systems can read it. Below is the standard data workflow:

```mermaid
graph LR
cht[CHT]
mediator_a([Mediator])
mediator_b([Mediator])
openhim[OpenHIM]

cht -- Outbound pushfa:fa-arrow-right --- mediator_a
cht -- API requestfa:fa-arrow-left --- mediator_b
mediator_a -- Requestfa:fa-arrow-right --- openhim
mediator_b -- Channelfa:fa-arrow-left --- openhim
```

CHT Interoperability uses OpenHIM as the middleware component with [Mediators](http://openhim.org/docs/configuration/mediators/) to do the conversion. [Outbound Push]({{< ref "building/reference/app-settings/outbound" >}}) is configured to make a request to the middleware when relevant documents are created or modified in the CHT. A Mediator then creates a FHIR resource which is then routed to OpenHIM. OpenHIM routes the resource to any other configured systems.

Conversely, to bring data into the CHT, OpenHIM is configured to route the updated resource to the Mediator, which then calls the relevant [CHT APIs]({{< ref "building/reference/api" >}}) to update the document in the CHT database. This will then be replicated to users’ devices as per usual.

See more information on the [CHT interoperability page]({{< ref "building/interoperability/overview" >}}).

### Prerequisites

- `docker`
- `Postman` or similar tool for API testing.
- [cht-interoperability](https://github.com/medic/cht-interoperability) GitHub repository (can be cloned via `git clone https://github.com/medic/cht-interoperability`).


{{% alert title="Note" %}} 
Users getting errors when running the following installation steps, please see the [Troubleshooting guide]({{< ref "#troubleshooting" >}}).
{{% /alert %}}

### Install & First Time Run

In the cht-interoperability folder, run `./startup.sh init` to start up the docker containers on the first run or after calling `./startup.sh destroy`. Use `./startup.sh up` for subsequent runs after calling `init` without calling `destroy`.

### OpenHIM Admin Console

1. Visit the OpenHIM Admin Console at [http://localhost:9000](http://localhost:9000) and login with the following credentials: email - `interop@openhim.org` and password - `interop-password`. The default User username for OpenHIM is `interop@openhim.org` and password is `interop-password`. The default Client username is `interop-client` and password is `interop-password`.

1. Once logged in, visit [http://localhost:9000/#!/mediators](http://localhost:9000/#!/mediators) and select the mediator named 'CHT Mediator'.

1. Select the green `+` button to the right of the default channel to add the mediator.

1. You can test the CHT mediator by running:

```bash
curl -X GET http://localhost:5001/mediator -H "Authorization: Basic $(echo -n interop-client:interop-password | base64)"
```

You should get as a response similar to this:

```json
{
    "status": "success",
    "osuptime": 74012.24,
    "processuptime": 56940.700039383
}
```

If everything is successful, when visiting [http://localhost:9000/#!/clients](http://localhost:9000/#!/clients) you should see this:

<img src="good-client-screen.png" width="600">

For testing other mediators, replace the URL (http://localhost:5001/mediator) with the appropriate values for the specific mediator you are testing.
For example if using the OpenMRS mediator, you can test it by running:

```bash
curl -X GET localhost:5001/mediator/openmrs/sync -H "Authorization: Basic $(echo -n interop-client:interop-password | base64)"
```

### CHT configuration with Docker

The following steps apply when running CHT via the Docker setup provided in the cht-interoperability repository:

1. CHT can be accessed via [http://localhost:5988](http://localhost:5988), and the credentials are `admin`/`password`.
2. Create a new user in the CHT instance with the username `interop-client` using these [instructions]({{< ref "building/contact-management/contact-and-users-1#4-create-the-chw-user" >}}). For the role you can select `Data entry` and `Analytics` roles. Please note that you can use any username you prefer but you would have to update the config with the new username. You can do that by editing the `cht-config/app_settings.json` file and updating the `username` value in the `outbound` object e.g. on this [line](https://github.com/medic/interoperability/blob/main/cht-config/app_settings.json#L452).
3. Securely save the `interop-client` user's password to the database using the instructions [here]({{< ref "building/reference/api#credentials" >}}). Change the values `mykey` and `my pass` to `openhim1` and your user's password respectively. An example of the curl request is below:

```bash
curl -X PUT -H "Content-Type: text/plain" http://admin:password@localhost:5988/api/v1/credentials/openhim1 -d 'interop-password'
```

### Local setup of CHT Configuration

The following steps apply when running CHT locally in development mode and when making configuration changes locally:

#### CHT Development Environment

1. Set up a local CHT instance using [these instructions]({{< ref "building/local-setup" >}}).
2. Create a new user in the CHT instance with the username `interop-client` using these [instructions]({{< ref "building/contact-management/contact-and-users-1#4-create-the-chw-user" >}}). For the role you can select `Data entry` and `Analytics` roles. Please note that you can use any username you prefer but you would have to update the config with the new username. You can do that by editing the `cht-config/app_settings.json` file and updating the `username` value in the `outbound` object e.g. on this [line](https://github.com/medic/interoperability/blob/main/cht-config/app_settings.json#L452).
3. Securely save the `interop-client` user's password to the database using the instructions [here]({{< ref "building/reference/api#credentials" >}}). Change the values `mykey` and `my pass` to `openhim1` and your user's password respectively. An example of the curls request is below:

```bash
curl -X PUT -H "Content-Type: text/plain" http://medic:password@localhost:5988/api/v1/credentials/openhim1 -d 'interop-password'
```
4. After updating the mediator code or the CHT configuration, you need to run `./startup.sh up-dev` to upload the changes to docker compose.

#### CHT Configuration

1. Go into the `cht-config` directory by running `cd cht-config`.
1. Run `npm install` to install the dependencies.
1. Create a file named `.env` under `/mediator` folder, copy over the contents of `/mediator/.env.template` and update the `CHT_USERNAME` and `CHT_PASSWORD` values with the admin credentials of your CHT instance.
1. Set up a proxy to your local CHT instance by running using something like [nginx-local-ip](https://github.com/medic/nginx-local-ip) or [ngrok](https://ngrok.com/) and update the `CHT_URL` value in the `.env` file with the new URL.
1. Ensure you have [cht-conf](https://www.npmjs.com/package/cht-conf) installed and run `cht --local` to compile and upload the app settings configuration to your local CHT instance.
1. To verify if the configuration is loaded correctly is to create a `Patient` and to access a URL like `https://*****.my.local-ip.co/#/contacts/patientUUID/report/interop_follow_up`. This should retrieve correctly the follow up form.
1. To verify if the configuration in CouchDB, access `http://localhost:5984/_utils/#database/medic/settings`.

### Shutdown the servers

- To shut-down the containers run `./startup.sh down` to stop the instances.
- To then restart the containers, run `./startup.sh up`. You do not need to run `init` again like you did in the initial install above.
- To shut-down and delete _everything_, run `./startup.sh destroy`. You will have to subsequently run `./startup.sh init` if you wish to start the containers.

### Troubleshooting

#### Error "bind: address already in use"
Users encountering:

> Error response from daemon: Ports are not available: exposing port TCP 0.0.0.0:5000 -> 0.0.0.0:0: listen tcp 0.0.0.0:5000: bind: address already in use

when running `./startup.sh init` need to update ports to available values in the `/docker/docker-compose.yml` file, under the `ports` verb.

#### Error when running mediator `curl` request
If the mediator `curl` request fails, visit [http://localhost:9000/#!/clients](http://localhost:9000/#!/clients) and click on the icon the red arrow points to in the image below.

![](bad-client-screen.png)

#### Error "Preset ts-jest is invalid:" when running `npm test`
Users encountering the error below when running `npm test`: 

> Preset ts-jest is invalid:
> The "id" argument must be of type string. Received null
> TypeError [ERR_INVALID_ARG_TYPE]: The "id" argument must be of type string. Received null

need to run `npm i --save-dev ts-jest` before running `npm test`. 

#### Error "unsuccessful npm install" when running `npm install`
Users encountering the error when running `npm install`:

> npm ERR! code EACCES
> npm ERR! syscall unlink
> npm ERR! path /Users/phil/interoperability/cht-config/node_modules/.package-lock.json

need to run `npm install` as root user.
