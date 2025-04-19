---
title: "Loss To Follow-Up reference workflow"
linkTitle: "Loss To Follow-Up"
weight: 4
description: >
   Guide to testing the Loss to Follow-Up (LTFU) reference workflow
keywords: openmrs interoperability
relatedContent: >
  building/interoperability/cht-config
aliases:
  - /building/guides/interoperability/ltfu
---

## Workflow Testing

This section outlines the steps for testing the Loss To Follow-Up (LTFU) workflow, in addition to documenting the various endpoints available on the mediator. It provides a comprehensive guide on navigating the LTFU workflow and utilizing the endpoints to facilitate the necessary actions.

## Environments

The section includes placeholders for URLs. Replacing these placeholders with the appropriate endpoints for your specific environment is essential to utilize the guide correctly. Below are the endpoints provided for each available environment. It is important to note that if your setup differs from the documentation provided, you may need to use different endpoints. By ensuring that the correct endpoints are used, you can be confident in successfully implementing and utilizing the LTFU workflow.

### Docker - Local Setup

- **Mediator (`${MEDIATOR_ENDPOINT}`)** - http://localhost:5001/mediator
- **OpenHIM Admin Console** - http://localhost:9000/
- **CHT with LTFU configuration** - http://localhost:5988/

## Steps

The following steps assume you have running OpenHIM and CHT instances you successfully logged into.
See the [OpenHIM guide]({{< ref "building/interoperability/openhim" >}}) for instructions to set up a local development instance of OpenHIM.

1.  Create an **Endpoint** and an **Organization**

    1. **HTTP Request** - Use Postman to create an `Endpoint` Resource in the Mediator. You can view the API documentation for creating an `Endpoint` [here](#endpoint-resource). Once you send the request, the Mediator will return a JSON response containing the `id` of the newly created endpoint. Save this `id` for the next step.

    1. **HTTP Request** - Create an `Organization` Resource in the Mediator using as `endpoint.reference` the example value replacing `${ENDPOINT_ID}` with the actual `id` of the `Endpoint` you created in the previous step. Once you send the request, the Mediator will return a JSON response containing the `id` of the newly created `Organization`. You can view the API documentation for creating an `Organization` [here](#organization-resource).

> It is important to note that you only need to create an `Organization` once, which you can use for future requests. So, after creating the `Organization`, you can save the `organization.identifier[0].value` value and use it for all future `ServiceRequest` requests.


2.  Create a **Patient**

    1. **CHT** - Log in to the CHT platform using the credentials for the `chw` user. If the `chw` user does not already exist, you can [create one]({{< ref "building/contact-management/contact-and-users-1#4-create-the-chw-user" >}}).
    1. **CHT** - Navigate to the `People` tab in the CHT dashboard. From there, select a Facility where you want to create a new `Person`. Click on the `New Person` button and fill in the required details for the Person. Make sure to select `Patient` as the `Person`'s role for this flow.
    1. **CHT** - Once you have created the new `Person`, you need to retrieve their unique identifier from the browser's URL. You can do this by copying the alphanumeric string that appears after `person/` in the URL. Keep this identifier safe as you will need it for the next steps.
    1. **OpenHIM Admin Console** - To verify that the `Patient` creation was successful, navigate to the `Transaction Log` in the OpenHIM Admin Console. You should see two successful API calls recorded in the log, one to `/mediator/patient/` and one to `/fhir/Patient/`.
    {{< figure src="instance-patient.png" link="instance-patient.png" >}}

3.  Request the LTFU for the Patient

    1. **HTTP Request** - To trigger the LTFU process for the newly created patient, you need to create a `ServiceRequest`. You can refer to the API documentation available [here](#servicerequest-resource) to learn how to create a `ServiceRequest`. Replace the `requester.reference` and the `subject.reference` with the `Organization` and `Patient` identifiers respectively. Once the `ServiceRequest` is received by the mediator, it will initiate the LTFU workflow for the patient, which includes reminders for follow-up appointments and check-ins. 

    1. **HTTP Request** - Verify that the `ServiceRequest` was successful in both OpenHIM Mediator & FHIR Resource. Navigate to the `Transaction Log` in the Admin Console. You should see three successful API calls, as in the image below:
    {{< figure src="./instance-service-request.png" link="./instance-service-request.png" >}}

4.  Handle LTFU Task

    1. **CHT** - Navigate to the `Tasks` tab. There should be an automatically created `Task` for the Patient. If it is not the case, sync data via `Sync now` option. The `Task` should look like in the image below:

        <img src="task.png" width="500">

    1. **CHT** - Select an option (Yes or No) and submit the `Tasks`.
    1. **OpenHIM Admin Console** - Verify that the Encounter creation was successful in both OpenHIM Mediator & FHIR Resource. Navigate to the `Transaction Log` in the Admin Console. You should see two successful API calls, one to `/mediator/encounter/` and one to `/fhir/Encounter/`, as in the image below.
    {{< figure src="instance-encounter.png" link="instance-encounter.png" >}}

    1. If your callback URL test service was set up correctly, you should receive a notification from the mediator.


An API test collection that can be used with Postman or similar tools can be found under `/docs/local-test` in the [cht-interoperability repository](https://github.com/medic/cht-interoperability/tree/main/docs/local-test). This collection allows testing the LTFU flow while running the instances locally.

## Resources

The following [FHIR Resources](https://www.hl7.org/fhir/resource.html) are used to implement the flow above:

- [Patient](https://www.hl7.org/fhir/patient.html)
- [Encounter](https://build.fhir.org/encounter.html)
- [Subscription](https://build.fhir.org/subscription.html)
- [Organization](https://build.fhir.org/organization.html)
- [Endpoint](https://build.fhir.org/endpoint.html)

The payload samples in the documentation contain placeholder values you must replace with the actual content. To do so, replace the entire `${}` placeholder with the appropriate value. Be aware that some placeholder keys have the format `_\_IDENTIFIER` and refer to the value in the `Resource.identifier[0].value` field. These keys differ from the `_\_ID` placeholders used in the request, which refer to the `Resource.id` field. It is important to make this distinction, as using the wrong value may cause unexpected behavior in the system. Therefore, always ensure you use the right value in the right context to avoid errors.


> **Note:** The payload only contains the required fields or a subset of the possible options. Please refer to the appropriate FHIR resource specifications to view all the available fields.


### `ServiceRequest` Resource

The FHIR `ServiceRequest` resource represents a request for a healthcare service to be performed, such as a diagnostic test or a treatment. It contains information about the requested service, including the **type of service**, the **patient** for whom the service is requested, the **date/time the service is requested**, and the **healthcare provider or organization** making the request. In the context of the LTFU workflow, this resource is used to request a CHW follow-up in the CHT.

#### `POST ${MEDIATOR_ENDPOINT}/service-request`

This endpoint triggers the creation of a `record` on `CHT` and a `Subscription` resource on FHIR. The endpoint associated with the `Organization` resource in the requester is used as the callback URL for the `Subscription` which gets called when FHIR receives an `Encounter` resource with matching `Patient` identifier. The callback endpoint receives a FHIR `Subscription` response as its payload whenever the request is fulfilled. To learn more about FHIR
subscriptions, you can visit the official documentation [here](https://build.fhir.org/subscription.html).

##### Request

```http
POST ${MEDIATOR_ENDPOINT}/service-request
```
```json
{
    "intent": "order",
    "subject": {
        "reference": "Patient/${PATIENT_IDENTIFIER}"
    },
    "requester": {
        "reference": "Organization/${ORGANIZATION_IDENTIFIER}"
    }
    ,
    "status": "active"
}
```

##### Response

```json
{
  "resourceType": "Subscription",
  "id": "4",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2023-04-19T04:41:17.656+00:00",
    "tag": [
      {
        "system": "http://hapifhir.io/fhir/StructureDefinition/subscription-matching-strategy",
        "code": "IN_MEMORY",
        "display": "In-memory"
      }
    ]
  },
  "status": "requested",
  "reason": "Follow up request for patient",
  "criteria": "Encounter?identifier=003b24b5-2396-4d95-bcbc-5a4c63f43ff0",
  "channel": {
    "type": "rest-hook",
    "endpoint": "https://callback.com",
    "payload": "application/fhir+json",
    "header": ["Content-Type: application/fhir+json"]
  }
}
```

### `Endpoint` Resource

The FHIR `Endpoint` resource describes the network address of a system or service where messages or payloads can be exchanged. It defines the communication characteristics for sending and receiving messages, such as the **transport protocol**, the **payload format**, and the **messaging endpoint's address**. The `Endpoint` resource can specify where to send data for specific purposes, such as notifications, alerts, or reports. It can be used in various contexts, such as clinical care, public health, or research, where different systems or services need to exchange data seamlessly.

#### `POST ${MEDIATOR_ENDPOINT}/endpoint`

In the LTFU workflow, the `Endpoint` is crucial in creating a `ServiceRequest`. It is obtained from the `Organization` attached to the `ServiceRequest` as the requester. The `Endpoint` represents the destination where the FHIR server sends notifications about matching `Encounter` resources. When the FHIR server receives a matching `Encounter` resource, it sends a notification to the endpoint. The endpoint is used as a **callback URL** for the FHIR server to notify the requester about the status of the `ServiceRequest`. Therefore, ensuring that the endpoint is accurate and valid for successful communication between the FHIR server and the requesting system is important.

- **ENDPOINT_ID:** _(Optional)_ A preferred `id` for the `Endpoint`. By default, the mediator will generate an `id` for the `Endpoint`.
- **ENDPOINT_IDENTIFIER:** An identifier for the `Endpoint` that can be used when querying the FHIR database in the future.
- **ORG_CALLBACK_URL:** A callback URL that the mediator can use to contact the requesting system (`Organization`) in the future when a `ServiceRequest` has been fulfilled.

> **NOTE** The FHIR `Subscription` that will be created ulteriorly requires `ORG_CALLBACK_URL` to accept HTTP `PUT` requests matching this path `${ORG_CALLBACK_URL}/:resourceType/:resourceId` and return a 200. In this workflow, the callback should expect to receive an `Encounter` resource sent back to the requesting system on `${ORG_CALLBACK_URL}/Encounter/:id`.

##### Request


```http
POST ${MEDIATOR_ENDPOINT}/endpoint
```
```json
{
    "id": "${ENDPOINT_ID}",
    "identifier": [
        {
            "system": "official",
            "value": "${ENDPOINT_IDENTIFIER}"
        }
    ],
    "connectionType": {
        "system": "http://terminology.hl7.org/CodeSystem/endpoint-connection-type",
        "code": "hl7-fhir-rest"
    },
    "payloadType": [
        {
            "text": "application/json"
        }
    ],
    "address": "${ORG_CALLBACK_URL}",
    "status": "active"
}
```

##### Response


```json
{
  "resourceType": "Endpoint",
  "id": "1",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2023-04-19T04:40:44.401+00:00"
  },
  "identifier": [
    {
      "system": "official",
      "value": "ENDPOINT_ID"
    }
  ],
  "status": "active",
  "connectionType": {
    "system": "http://terminology.hl7.org/CodeSystem/endpoint-connection-type",
    "code": "hl7-fhir-rest"
  },
  "payloadType": [
    {
      "text": "application/json"
    }
  ],
  "address": "https://callback.com"
}
```

### `Patient` Resource

The FHIR `Patient` resource represents an individual receiving or awaiting healthcare services. It includes **patient demographics**, **clinical observations**, and **medical history**. It is a foundational resource in healthcare and can be used to track patient progress, manage care plans, and facilitate communication between healthcare providers.

#### `POST ${MEDIATOR_ENDPOINT}/patient`

This endpoint creates a `Patient` in the LFTU workflow. Patients are created by CHT automatically whenever a new Patient is added to the system.

##### Request

```http
POST ${MEDIATOR_ENDPOINT}/patient
```
```json
{
    "identifier": [
        {
            "system": "official",
            "value": "${PATIENT_IDENTIFIER}"
        }
    ],
    "name": [
        {
            "family": "Doe",
            "given": [
                "John"
            ]
        }
    ],
    "gender": "male",
    "birthDate": "2000-01-01"
}
```

##### Response


```json
{
  "resourceType": "Patient",
  "id": "3",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2023-04-19T04:41:01.217+00:00"
  },
  "text": {
    "status": "generated",
    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><div class=\"hapiHeaderText\">John <b>DOE </b></div><table class=\"hapiPropertyTable\"><tbody><tr><td>Identifier</td><td>003b24b5-2396-4d95-bcbc-5a4c63f43ff0</td></tr><tr><td>Date of birth</td><td><span>01 January 2000</span></td></tr></tbody></table></div>"
  },
  "identifier": [
    {
      "system": "official",
      "value": "003b24b5-2396-4d95-bcbc-5a4c63f43ff0"
    }
  ],
  "name": [
    {
      "family": "Doe",
      "given": ["John"]
    }
  ],
  "gender": "male",
  "birthDate": "2000-01-01"
}
```

### `Encounter` Resource

The FHIR `Encounter` resource represents a clinical interaction between a patient and a healthcare provider. It contains information about the **patient's visit**, such as the **location**, the **reason for the visit**, and any relevant **procedures** or **diagnoses**. 

#### `POST ${MEDIATOR_ENDPOINT}/encounter`

The `Encounter` resource is an essential part of the LTFU workflow, which is automatically created by the CHT system after a CHW completes the workflow. It triggers FHIR to send a `Subscription` response to the requesting system when there is a match with the `Encounter` resource. This allows for efficient monitoring and follow-up care of patients in the LTFU workflow.


**ENCOUNTER_IDENTIFIER:** An identifier for the encounter that can be used when querying the FHIR database in the future. Ideally, it should point to a document on the source system (CHT) that represents this encounter.

> NOTE: The `ENCOUNTER_IDENTIFIER` should be the same as the `PATIENT_IDENTIFIER`. The FHIR Subscription won't be resolved properly if they don't match. Updating an existing `Encounter` will also trigger pending `Subscription` that matches the `Encounter` document, which is one of the downsides of using this method. You can learn more about it by visiting [Official FHIR Subscription Resource Scope](https://build.fhir.org/subscription.html#scope).


##### Request


```http
POST ${MEDIATOR_ENDPOINT}/encounter
```
```json
{
    "resourceType": "Encounter",
    "identifier": [
        {
            "system": "cht",
            "value": "${ENCOUNTER_IDENTIFIER}"
        }
    ],
    "status": "finished",
    "class": "outpatient",
    "type": [
        {
            "text": "Community health worker visit"
        }
    ],
    "subject": {
        "reference": "Patient/${PATIENT_IDENTIFIER}"
    },
    "participant": [
        {
            "type": [
                {
                    "text": "Community health worker"
                }
            ]
        }
    ]
}
```

##### Response


```json
{
  "resourceType": "Encounter",
  "id": "5",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2023-04-19T05:00:18.031+00:00"
  },
  "identifier": [
    {
      "system": "cht",
      "value": "003b24b5-2396-4d95-bcbc-5a4c63f43ff0"
    }
  ],
  "status": "finished",
  "type": [
    {
      "text": "Community health worker visit"
    }
  ],
  "subject": {
    "reference": "Patient/3"
  },
  "participant": [
    {
      "type": [
        {
          "text": "Community health worker"
        }
      ]
    }
  ]
}
```

### `Organization` Resource

The FHIR `Organization` resource represents a group of people or entities with a common purpose or focus. It contains the organization's **name**, **type**, and **contact details**. This resource is often used in healthcare settings to represent healthcare providers, hospitals, clinics, and other organizations involved in patient care. In the LTFU workflow, it represents the **Requesting System**, and it points to its `callback URL`.

#### `POST ${MEDIATOR_ENDPOINT}/organization`

The `Organization` resource in the LTFU workflow represents the Requesting System. Before creating an `Organization`, an `Endpoint` must be created. The `${ORGANIZATION_IDENTIFIER}` is intended to be randomly assigned by the requesting system. It is important to take note of this identifier, as it will be used in future `ServiceRequest`'s to identify the requesting system.

##### Request


```http
POST ${MEDIATOR_ENDPOINT}/organization
```
```json
{
    "identifier": [
        {
            "system": "official",
            "value": "${ORGANIZATION_IDENTIFIER}"
        }
    ],
    "name": [
        "Athena"
    ],
    "endpoint": [
        {
            "reference": "Endpoint/${ENDPOINT_ID}"
        }
    ]
}
```

##### Response


```json
{
  "resourceType": "Organization",
  "id": "2",
  "meta": {
    "versionId": "1",
    "lastUpdated": "2023-04-19T04:40:48.663+00:00"
  },
  "identifier": [
    {
      "system": "official",
      "value": "003b24b5-2396-4d95-bcbc-5a4c63f43ff0"
    }
  ],
  "name": "Athena",
  "endpoint": [
    {
      "reference": "Endpoint/1"
    }
  ]
}
```
