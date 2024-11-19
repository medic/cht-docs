---
title: "OpenHIM Mediators"
linkTitle: "OpenHIM Mediators"
weight:
description: >
   Guide to running OpenHIM and Mediators with Docker Compose
keywords: openmrs interoperability
relatedContent: >
  building/guides/interoperability/cht_config
  building/guides/interoperability/ltfu_reference_workflow
  building/guides/interoperability/troubleshooting
  building/concepts/interoperability/
  building/guides/integrations/openmrs/
---

#### Overview

The components and reference information for interoperability used in this project are:

- [OpenHIE](https://ohie.org/) defines the architecture for an interoperability layer.
- [OpenHIM](http://openhim.org/) is a middleware component designed to ease interoperability between systems.
- [HL7 FHIR](https://www.hl7.org/fhir/index.html) is a messaging format to allow all systems to understand the format of the message.

#### CHT

The structure of documents in the CHT database reflect the configuration of the system, and therefore do not map directly to a FHIR message format. To achieve interoperability Medic used a middleware to convert the CHT data structure into a standardized form so the other systems can read it. Below is the standard data workflow:

![](flow.png)

This project uses OpenHIM as the middleware component with [Mediators](http://openhim.org/docs/configuration/mediators/) to do the conversion. [Outbound Push](https://docs.communityhealthtoolkit.org/apps/reference/app-settings/outbound/) is configured to make a request to the middleware when relevant documents are created or modified in the CHT. A Mediator then creates a FHIR resource which is then routed to OpenHIM. OpenHIM routes the resource to any other configured systems.

Conversely, to bring data into the CHT, OpenHIM is configured to route the updated resource to the Mediator, which then calls the relevant [CHT APIs](https://docs.communityhealthtoolkit.org/apps/reference/api/) to update the document in the CHT database. This will then be replicated to users’ devices as per usual.

See more information on the [CHT interoperability](https://docs.communityhealthtoolkit.org/apps/concepts/interoperability/) page on the CHT documentation site.

### Prerequisites

- `docker`
- `Postman` or similar tool for API testing. This will play the role of the `Requesting System` from the sequence diagram above.

### Troubleshooting

Users getting errors when running the following installation steps, please see the [Troubleshooting guide]({{< ref "building/guides/interoperability/troubleshooting" >}}).

### Install & First Time Run

1. Run `./startup.sh init` to start-up the docker containers on the first run or after calling `./startup.sh destroy`. Use `./startup.sh up` for subsequent runs after calling `init` without calling `destroy`.

### OpenHIM Admin Console

1. Visit the OpenHIM Admin Console at http://localhost:9000 and login with the following credentials: email - `interop@openhim.org` and password - `interop-password`. The default User username for OpenHIM is `interop@openhim.org` and password is `interop-password`. The default Client username is `interop-client` and password is `interop-password`.

1. Once logged in, visit [http://localhost:9000/#!/mediators](http://localhost:9000/#!/mediators) and select the only mediator with the `Name` 'Loss to Follow Up Mediator'.

1. Select the green `+` button to the right of the default channel to add the mediator.

1. You can test the mediator by running:

```bash
curl -X GET http://localhost:5001/mediator -H "Authorization: Basic $(echo -n interop-client:interop-password | base64)"
```

You should get as a response:

```json
{ "status": "success" }
```

If everything is successful you should see this:

<img src="good-client-screen.png" width="600">

### Shutdown the servers

- To shut-down the containers run `./startup.sh down` to stop the instances.
- To then restart the containers, run `./startup.sh up`. You do not need to run `init` again like you did in the initial install above.
- To shut-down and delete _everything_, run `./startup.sh destroy`. You will have to subsequently run `./startup.sh init` if you wish to start the containers.

