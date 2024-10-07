---
title: "OpenMRS"
linkTitle: "OpenMRS"
weight:
description: >
   Exchange patient-level data with systems based on the OpenMRS platform
keywords: openmrs
relatedContent: >
  building/features/integrations/custom
  building/features/integrations/openmrs
aliases:
   - /apps/guides/integrations/openmrs
---

[OpenMRS](https://openmrs.org) is an open source electronic medical record system used in dozens of countries. Integrating CHT apps with OpenMRS can open up opportunities to improve health outcomes for patients by promoting better coordination of care. For example, referrals by CHWs in the community can be sent electronically to health facilities using OpenMRS so that nurses and clinicians can prepare for their visit and have full access to the assessment done by a CHW.

Integrating CHT apps with OpenMRS can be achieved using the [OpenMRS REST API](https://rest.openmrs.org/) and following the guidance in the [Custom Integrations]({{< ref "building/features/integrations/custom" >}}) documentation. 

## Overview

The CHT Core Framework supports integrations with OpenMRS in a variety of ways:

1. Sending patient and patient contacts data
2. Sending reports (encounters and observations) data
3. Exposing an API for OpenMRS developers to pull data from CHT Core
4. Receiving data from OpenMRS

Sending patients, patient contacts, and reports data can be achieved using the [Outbound push]({{< ref "building/reference/app-settings/outbound" >}}). Receiving data from OpenMRS can be achieved using the CHT Core Web [API](https://docs.communityhealthtoolkit.org/building/reference/api/).

Common OpenMRS use cases include:

1. **Linkage to care**: Completion of medical visits after diagnosis
2. **Contact tracing**: OpenMRS generates a list of contacts to be followed up
3. **Care coordination**: Reminding patients to self-report or health-care givers to complete follow ups on patients of interest

## Prerequisites

As you design your usecases, bear in mind that at the heart of OpenMRS is the [Concept Dictionary](https://wiki.openmrs.org/display/docs/Concept+Dictionary+Basics). Every contact, relationship, encounter or observation metadata exists first, which guides the definition of the forms in the CHT. Therefore, you need to have good understanding of what data maps to what concept.

## Getting started

The [CHT API]({{< ref "building/reference/api" >}}) and [OpenMRS API](https://rest.openmrs.org/#openmrs-rest-api) are used for integration. However, the APIs do not do data cleaning and formatting out-of-the-box. Therefore, both systems require custom solutions that ochestrate the functionality to transform exchanged data to be accepted. In the following sections, we focus more on the general procedure for setting up custom modules and services. 

### CHT to OpenMRS

This section focuses on a simple process and the best practices to send data to OpenMRS.

#### Mapping forms

The first thing is to define forms to capture data. Forms can be contact or app, which translate to patient and encounter (for example, observation, lab request, and referral) respectively. Forms are defined using the XLS Form standard.
Some of the best practices here include adopting a convention that results in minimum disruption (or that would require minimal processing) of the concept dictionary.

1. **Defining contact forms**

Here, you need to capture the basic details required for registering a patient or a patient contact in OpenMRS. Below is a sample naming convention for demographic details such as a person's name (under field name):

`patient_familyName` for family_name, 
`patient_firstName` for first_name,
`patient_middleName` for middle_name

Another example of patient identifiers could take the form `_IdentifierType_humanReadableName_IdentifierTypeUuid`. For example, national Id identifier type definition would be, `patient_identifierType_nationalId_49af6cdc-7968-4abb-bf46-de10d7f4859f`.

A sample form definition could be as follows:

| type                          | name              | label                              | required | relevant            | appearance | constraint | constraint_message  | calculation | choice_filter  | hint | default |
| ----------------------------- | ----------------- | ---------------------------------- | -------- | ------------------- | ---------- | ---------- | ------------------- | ----------- | -------------- | ---- | ------- |
| begin group                   | patient_demographics  | Demographic details                         |          |                     |            |            |                     |             |                |      |         |
| string     | patient_familyName             | Family name | yes      |                     |            |            |                     |             |                |      |         |
| string   | patient_firstName    | First name     | yes      |     |            |            |                     |             |                |      |         |
| string   | patient_middleName    | Middle name     | yes      |     |            |            |                     |             |                |      |         |
| string   | patient_identifierType_nationalId_49af6cdc-7968-4abb-bf46-de10d7f4859f    | National ID     | yes      |     |            |            |                     |             |                |      |         |
| end group                     |                   |                                    |          |                     |            |            |                     |             |                |      |         |


A sample payload would be as follows:


```text
{
    ...,
    "patient_demographics": {
      "patient_familyName": "Doe",
      "patient_firstName": "John",
      "patient_middleName": "Test",
      "patient_identifierType_nationalId_49af6cdc-7968-4abb-bf46-de10d7f4859f": "38839128",
      "patient_identifierType_clinicNumber_000f85aa-a460-46d1-87be-daabe7bd9d99": "1271891"
    }
}
```

Such convention makes it easier to process the payload for queueing handling.

2. **Defining app forms**

An encounter form consists of input and observation groups in the XForm. `form_uuid` and `encounter_type_uuid` define the uuids for the encounter form and encounter type respectively. Please note that these are defined within the general `input` group provided by CHT.

The `observation` group is used to define the clinical observation variables to be collected by the form. This group is equivalent to the group of `<obs>` in OpenMRS html form entry module. In OpenMRS, an observation construct has concept ID (with inherent concept type), label, and answer options if it requires. In Xforms, one needs to define the following:

 - Observation type (field type of the xlsform)
 - Name - this will be used as `key` in the generated JSON payload for the form data. Using the adopted convention above, `_conceptID_humanReadableConceptName_99DCT`, we could have:

    `_5089_weight_99DC` for weight.
 
   For multi-select (obs group in OpenMRS), we can easily append `MULTISELECT` to the `humanReadableConceptName` for example:
 `_162558_disabilityTypeMULTISELECT_99DCT` for diability type with the options `blind, dumb, ...`

- A label which is displayed to the user during form entry

Here is a sample form snippet followed by sample select list in the choices worksheet.

##### Data fields

| type                          | name              | label                              | required | relevant            | appearance | constraint | constraint_message  | calculation | choice_filter  | hint | default |
| ----------------------------- | ----------------- | ---------------------------------- | -------- | ------------------- | ---------- | ---------- | ------------------- | ----------- | -------------- | ---- | ------- |
| calculate  | form_uuid   | NO_LABEL | yes      |                     |            |            |            _99DCT         |             |                |      |         |
| calculate  | encounter_type_uuid   | NO_LABEL | yes      |                     |            |            |                     |             |                |      |         |
| begin group                   | group_assessment  | Assessment                         |          |                     |            |            |                     |             |                |      |         |
| select_one client_consented             | _1710_clientConsented_99DCT             | Has ${patient_name} consented? | yes      |                     |            |            |                     |             |                |      |         |
| select_multiple disability_type   | _162558_disabilityTypeMULTISELECT_99DCT    | Disability type     | yes      |     |            |            |                     |             |                |      |         |
| text   | _160632_Specify_99DCT    | Specify (Other)     | yes      | ${_162558_disabilityTypeMULTISELECT_99DCT} = 'other'    |            |            |                     |             |                |      |         |
| end group                     |                   |                                    |          |                     |            |            |                     |             |                |      |         |

##### Choices

| list_name         | name | label           |
| ----------------- | ---- | --------------- |
| client_consented            | _1065_Yes_99DCT  | Yes             |
| client_consented            | _1066_No_99DCT   | No              |
| disability_type            | _1058_vision_99DCT   | Vision              |
| disability_type            | _1059_hearing_99DCT   | Hearing              |
| disability_type            | _1060_mental_99DCT   | Mental              |
| disability_type            | _1061_other_99DCT   | Other              |

Remember to convert and upload your forms
```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs convert-contact-forms upload-contact-forms convert-app-forms upload-app-forms
```

{{% alert title="Note" %}}Remember to setup the [Outbound push]({{< ref "building/reference/app-settings/outbound" >}}) modules to send data to OpenMRS. {{% /alert %}}


#### Handling the data

After collecting data using the forms defined above, the next step is to process and persist it in OpenMRS. Processing includes: 

1. **Cleaning**

First, the data has to be transformed to an OpenMRS-compatible format before it is queued. This means that you need to define custom RESTful endpoints if not already existing, that would be utilized by the Outbound push modules configured above. Transformation basically involves extracting form data into an object. Most importantly, `discriminators`, which are like flags appended to form data to inform the type of data being processed. For example, a `registration` discriminator implies that we're dealing with demographic details. A sample transformed payload is shown below:

```text
{
    "patient": {
      "patient.family_name": "Doe",
      "patient.first_name": "John",
      "patient.middle_name": "Test",
      "patient.other_identifier": [
        {
          "identifier_type_uuid": "49af6cdc-7968-4abb-bf46-de10d7f4859f",
          "identifier_type": "38839128",
          "identifier_type_name": "National ID",
        },
        {
          "identifier_type_uuid": "000f85aa-a460-46d1-87be-daabe7bd9d99",
          "identifier_type": "1271891",
          "identifier_type_name": "Clinic Number",
        }
      ]
    },
    "observation": {
      "1710^CLIENT CONSENTED^99DCT": "1065^Yes^99DCT",
      "1542^OCCUPATION^99DCT": "1538^Farmer^99DCT"
    },
    "discriminator": {
      "discriminator": "registration"
    }
}
```

2. **Queueing**

This step involves adding a transformed payload, now objects, to a queue. This is important because it helps to capture errors that occur during processing and the data can be corrected and re-queued. A queue will have both registration and encounter objects.

You need to define a queue processor that will be consuming the queue and push each object to the rightful handler.

3. **Data handlers**

Data handlers are responsible for persisting the data in OpenMRS. The handler can also be used to trigger feedback to submitters of the data (this can be a brief summary such as number of synced documents and success rate). The following steps apply:

 - Define handlers for each object type (e.g. person / patient, trace report.
 - Create a scheduler to start the queue processor above. The queue processor shall get to the handler for processing.
 - Closely monitor the errors log for prompt action where necessary.

You may want to further configure a service that relays feedback to the CHT. Feel free to utilize in-app text messages, which can be triggered via the [sms endpoint](https://docs.communityhealthtoolkit.org/building/reference/api/#post-apisms) of CHT. The health workers would receive these feedback messages on their phones as well as access via the Messages tab in-app.

#### Error Handling

Exceptions thrown during processing can be added to a queue and presented on an interface for action. The erring data may then be re-queued. You need to consider what works best at this point. For convenience, it makes sense for a backend user to resolve such errors.

Sample OpenMRS handler scripts include:
1. [PIH Malawi's EMR handler](https://github.com/PIH/openmrs-module-emr)
2. [KenyaEMR handler](https://github.com/palladiumkenya/openmrs-module-afyastat)

### OpenMRS to CHT

#### Scheduled tasks

This includes defining a scheduler and a task that will be compiling the payload to be pushed to the CHT on specific intervals. Remember that the CHT expects data in JSON format. 
The CHT API can be used to process incoming reports. For custom payloads, the [{db}/bulk_docs](https://docs.couchdb.org/en/stable/api/database/bulk-api.html#db-bulk-docs) can be utilized to save multiple payloads concurrent
#### Listener script in the CHT

This is a service that would help shift information in the CHT [hierarchy]({{< ref "building/reference/app-settings/hierarchy" >}}) to support the usecases of interest. Through {db}/bulk_docs, OpenMRS posts a data record that contains data objects such as observations and contact list (if available) details. The service obtains the record, and unpacks it into a contact in CHT and parented under the correct hierarchy level based on the metadata received from OpenMRS. The script should:
1. Do patient matching to avoid duplicate details. Querying can be achieved via available endpoints such as `contacts_by_phone` [endpoint]({{< ref "building/reference/api#get-apiv1contacts-by-phone" >}}) and `hydrate` [endpoint]({{< ref "building/reference/api#get-apiv1hydrate" >}}) among others/
2. If the incoming data matches what exists, update the contact found in CHT.
3. Process all reports payloads and append them to the linked contact’s profile. Note that the `<report type>` xml or JSON form has to be defined in the CHT. 
4. Delete the payload that is received from OpenMRS after it is processed since it will have been used to create CHT data structures.
5. Monitor and log failed transactions

Once you have configured the above for data exchange, the data flow will be like this:

![CHT - OpenMRS Data Flow](cht-openmrs.jpeg)
