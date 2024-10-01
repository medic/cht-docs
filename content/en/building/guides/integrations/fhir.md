---
title: "Building Interoperability with FHIR systems"
linkTitle: "Building Interoperability with FHIR systems"
weight:
description: >
   Exchange patients and reports with FHIR compliant systems
keywords: interoperability fhir integrations openmrs
relatedContent: >
  building/concepts/interoperability/
---

## Overview

CHT has an interoperability tool which supports building FHIR workflows.
See [this page](/building/concepts/interoperability) for an overview of this tool; in particular, it supports:
1. sending patient data from the CHT to interoperating systems
2. sending reports as [Encounters](https://build.fhir.org/encounter.html) with [Observations](https://build.fhir.org/observation.html) from the CHT to interoperating systems.
3. sending patient data created in interoperating systems to CHT applications
4. sending health information represented as [Encounters](https://build.fhir.org/encounter.html) with [Observations](https://build.fhir.org/observation.html) from interoperating systems to CHT applications.

To send data created in a CHT application to an interoperating system, use [outbound push](/building/reference/app-settings/outbound/) to configure which documents should be sent and at what point.
A [mediator](http://openhim.org/docs/configuration/mediators/) then converts these documents to FHIR resources and orchestrates sending them to interoperating systems.
The default mediator makes any resources sent to it queryable via a FHIR api using [HAPI](https://hapifhir.io/).

To receive data from an interoperating system in a CHT application, configure [forms](/building/reference/app-settings/forms/) and [transitions](/building/reference/app-settings/transitions/) to map the incoming data to CHT documents.
A [mediator](http://openhim.org/docs/configuration/mediators/) is responsible for getting these resources from an interoperating system (either by exposing API endpoints or pulling them from an API), and converting from FHIR resources to a format that can be submitted to [the records API](/building/reference/api/#records).

## Outbound Patients

To send patient data collected from CHT to an interoperating system, first identify which documents represent patients. In the example below, a patient is a document with type person and role 'patient'. This may not apply to all CHT applications.
Use the `relevant_to` field in outbound push config; then whenever these documents are created or updated they will be sent to the url configured in base and path; this hould be openhim.

The fields in the patient document need to be mapped to the FHIR format.
It is possible to convert the document to a FHIR patient resource in outbound push config (an example can be found in the [reference application](https://github.com/medic/cht-interoperability/blob/6318b9f0fba8d8293dfec890004e18e489af538c/cht-config/app_settings.json#L445).
This can be difficult to configure correctly, so the default mediator also accepts a shorter form which is the `id`, `name`, `phone`, `date_of_birth` and `patient_id` fields from the document itself.

|Field|Description|
|--|--|
|`_id`|CouchDB's unique identifier of the record. This will be converted to an [Identifier](https://build.fhir.org/datatypes.html#identifier) with type `CHT Document Id`|
|`name`| Patients name|
|`phone`| Patients phone number|
|`date_of_birth`| patients date of birth|
|`sex`| patient's sex|
|`patient_id`| If a separate `patient_id` is generated, it can be sent here. This will be converted to an [Identifier](https://build.fhir.org/datatypes.html#identifier) with type `CHT Patient Id`|

This example outbound push config selects documents where `patient_id` exists, and `doc.role === patient`
```json
{
  "patient": {
    "relevant_to": "doc.type === 'person' && doc.patient_id && doc.role === 'patient'",
    "destination": {
      "base_url": "http://openhim-core:5001",
      "path": "/mediator/cht/patient",
      "auth": {
        "type": "basic",
        "username": "interop-client",
        "password_key": "openhim1"
      }
    },
    "mapping": {
      "doc._id": "doc._id",
      "doc.name": "doc.name",
      "doc.phone": "doc.phone",
      "doc.date_of_birth": "doc.date_of_birth",
      "doc.sex": "doc.sex",
      "doc.patient_id": "doc.patient_id"
    }
  }
}
```

## Outbound Reports

To send reports from the CHT to an interoperating system, an [Encounter](https://build.fhir.org/encounter.html) resource is created to represent the [Encounter](https://build.fhir.org/encounter.html) between the patient and the CHW. Any data in the report that is sent to the interoperating system is represented as [Observations](https://build.fhir.org/observation.html) linked to the [Encounter](https://build.fhir.org/encounter.html).

[Encounters](https://build.fhir.org/encounter.html) have a reference to patients, so setting up outbound patients is a requirement for outbound reports.

Similarly to patients, create an outbound push configuration with the `relevant_to` field having `doc.type === 'data_record' && doc.form === '{{the form to be sent}}'`
The fields in the form that need to be exchanged need to be mapped to a format that a mediator can convert to [Observations](https://build.fhir.org/observation.html).
[Observations](https://build.fhir.org/observation.html) need to have a [Code](https://build.fhir.org/datatypes.html#code) that is understood by the interoperating system, and the response values may need to be converted to a different format.

For example a yes/no question may need to be converted to the presence (if yes) or absence (if no) of an observation with a code.
'Does the patient show signs of fever?' can be converted to an observation with the code for fever if the answer was yes, or be omitted entirely if the answer was no.
Another example is multiple choice questions, which can be converted to a coded question where each of the choices is assigned a code
'Which danger signs does the patient show?' can be converted to [Observations](https://build.fhir.org/observation.html) with the code for pregnancy danger signs, and for each danger sign selected, the `valueCode` is the code of the danger sign.

The mapping field in outbound push config contains the following fields.
|Field|Description|
|--|--|
|`id`|CouchDB's unique identifier of the record. This will be converted to an [Identifier](https://build.fhir.org/datatypes.html#identifier) with type `CHT Document Id`.|
|`patient_uuid`| document uuid of the patient document that is the subject of the report.|
|`reported_date`| date when the report was made.|
|`observations`| a list of the form fields to be converted to [Observations](https://build.fhir.org/observation.html), with format `observations.{{number}}.code` and `observations.{{number}}.{{value}}` where value can be one of `valueCode`, `valueDateTem` and `valueString`|
|`observation.n.code`| for each form field to convert to observations, a code for the observation.|
|`observation.n.valueCode`| for multiple choice questions with valueCoded responses, the code for the response value. If `false`, the observation will be omitted.|
|`observation.n.valueDateTime`| for datetiem questions, the date for the value.|
|`observation.n.valueString`| for string questions, the value|

In this example, a 'danger signs' question is converted into [Observations](https://build.fhir.org/observation.html) where 'danger signs' has code '17a57368-5f59-42c8-aaab-f2774d21501e', and the yes/no questions `fever` and `breathlessness` with codes `43221561-0600-410e-8932-945665533510` and `070dca86-c275-4369-b405-868904d78156` are present if the response was 'yes' or absent if the response was 'no'.
```json
{
  "relevant_to": "doc.type === 'data_record' && doc.form === 'pregnancy'",
  "destination": {
    "base_url": "http://openhim-core:5001",
    "path": "/mediator/cht/encounter",
    "auth": {
      "type": "basic",
      "username": "interop-client",
      "password_key": "openhim1"
    }
  },
  "mapping": {
    "id": "doc._id",
    "patient_uuid": "doc.fields.inputs.contact._id",
    "reported_date": "doc.reported_date",
    "observations.0.code": {
      "expr": "\"17a57368-5f59-42c8-aaab-f2774d21501e\""
    },
    "observations.0.valueCode": {
      "expr": "doc.fields.danger_signs.fever == \"yes\" ? \"43221561-0600-410e-8932-945665533510\" : false"
    },
    "observations.1.code": {
      "expr": "\"17a57368-5f59-42c8-aaab-f2774d21501e\""
    },
    "observations.1.valueCode": {
      "expr": "doc.fields.danger_signs.breathlessness == \"yes\" ? \"070dca86-c275-4369-b405-868904d78156\" : false"
    },
    "observations.2.code": {
      "expr": "\"1427AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\""
    },
    "observations.2.valueDateTime": "doc.fields.lmp_date",
    "observations.3.code": {
      "expr": "\"5596AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\""
    },
    "observations.3.valueDateTime": "doc.fields.expected_date",
    "observations.4.code": {
      "expr": "\"13179cce-a424-43d7-9ad1-dce7861946e8\""
    },
    "observations.4.valueString": "doc.fields.danger_signs.other_any"
  }
}
```

## Inbound Patients

It is also possbile to create Patients in the CHT from patients that were created in external systems.
Patients in CHT applications are represented as contacts, and require a parent to be assigned to a CHW, facility, or other location. This requires a mediator to have the ids of contacts in CHT and currently cannot be done automatically by the default mediator. A custom mediator needs to be created which assigns a field to use as the `parent_id`.

To create data in CHT, a mediator converts a FHIR patients to a json object that it submits as a request to [the records API](/building/reference/api/#records).
This requires a [form](/building/reference/app-settings/forms/) to be configured in the CHT; the incoming data will be saved as a report.
Then, the actual patient document is created by assigning a [create patient transition](/building/reference/app-settings/transitions/#add_patient) to the form.
Because the patient creation form is a CHT form like an other, messages, validations and other transitions can be assigned to it to build more complex workflows.

This example form allows an interoperating system to create a patient with some common fields: `patient_name`, `age_in_days`, `phone_number`, and an `id` in the external system.
In this example, `location_id` is used as the `parent_id` field; this field will usually have to be configured in a customer mediator.

|Field|Description|
|--|--|
|`patient_name`| Patients name|
|`phone_number`| Patients phone number|
|`age_in_days`| patients age, in days.|
|`sex`| patient's sex|
|`external_id`| this preferred identifier from the external system|

```json
{
  "OPENMRS_PATIENT": {
    "meta": {
      "code": "openmrs_patient",
      "translation_key": "forms.n.title",
      "icon": "medic-person"
    },
    "fields": {
      "age_in_days": {
        "labels": {
          "tiny": {
            "en": "Age in Days"
          },
          "short": {
            "en": "Age in Days"
          }
        },
        "position": 0,
        "type": "integer",
        "required": true
      },
      "patient_name": {
        "labels": {
          "tiny": {
            "en": "patient_name"
          },
          "short": {
            "en": "Patient Name"
          }
        },
        "position": 1,
        "type": "string",
        "length": [
          1,
          40
        ],
        "required": true
      },
      "phone_number": {
        "labels": {
          "tiny": {
            "en": "patient phone"
          },
          "short": {
            "en": "patient Phone"
          }
        },
        "position": 2,
        "flags":{
          "allow_duplicate": false
        },
        "type": "phone_number",
        "required": true
      },
      "location_id": {
        "labels": {
          "tiny": {
            "en": "location_id"
          },
          "short": {
            "en": "location_id"
          }
        },
        "position": 3,
        "type": "string",
        "length": [
          1,
          60
        ],
        "required": true
      },
      "external_id": {
        "labels": {
          "tiny": {
            "en": "OpenMRS ID"
          },
          "short": {
            "en": "OpenMRS ID"
          }
        },
        "position": 4,
        "type": "string",
        "length": [
          1,
          60
        ],
        "required": true
      }
    },
    "public_form": true
  }
}
```

Using the above example form, this transition will create a patient document and add a birth_date field using patient_age_in_days.

```json
{
  "form": "openmrs_patient",
  "events": [
    {
      "name": "on_create",
      "trigger": "add_birth_date",
      "params": "",
      "bool_expr": "doc.patient_name"
    },
    {
      "name": "on_create",
      "trigger": "add_patient",
      "params": {
        "parent_id": "location_id"
      },
      "bool_expr": "doc.patient_name"
    }
  ]
}
```

## Inbound Reports

[Encounters](https://build.fhir.org/encounter.html) and [Observations](https://build.fhir.org/observation.html) created by interoperating systems can be sent to the CHT to be visible to CHT users.
Similarly to patients, a mediator converts the FHIR resources to a json format that is submitted to the records API.
Reports need to be linked to patients using a `patient_id` field which is the uuid of the patient document in CHT. The mediator extracts this id from the 'CHT Document ID' identifier of the fhir patient. 
For patients created by CHT, they need to have been sent to the interoperating system before receiving any reports. For patients created by the interoperating system, the 'CHT Docuemnt ID' needs to have been set; see the section below on Patient IDS.

A CHT form needs to be configured to receive the reports via the records API.
In the form configuration, the names of fields which should be extracted from [Observations](https://build.fhir.org/observation.html) should be the codes of the [Observations](https://build.fhir.org/observation.html). Human readable labels can be added for display.
Because these forms are CHT forms like an other, messages, validations and other transitions can be assigned to it to build more complex workflows.

This example configures the form for a typical antenatal care form.
```json
{
  "OPENMRS_ANC": {
    "meta": {
      "code": "openmrs_anc",
      "translation_key": "forms.openmrs_anc.title",
      "icon": "icon-anc-followup"
    },
    "fields": {
      "patient_id": {
        "labels": {
          "tiny": {
            "en": "id"
          },
          "short": {
            "en": "Patient Id"
          }
        },
        "position": 0,
        "type": "string",
        "length": [
          1,
          13
        ],
        "required": true
      },
      "17a57368-5f59-42c8-aaab-f2774d21501e": {
        "labels": {
          "short": {
            "en": "Danger signs screening"
          }
        },
        "position": 1,
        "type": "string",
        "length": [
          1,
          20
        ],
        "required": false
      },
      "1427aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa": {
        "labels": {
          "short": {
            "en": "Date of last menstrual period"
          }
        },
        "position": 2,
        "type": "string",
        "length": [
          1,
          60
        ],
        "required": false
      },
      "5596aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa": {
        "labels": {
          "short": {
            "en": "Estimated date of delivery"
          }
        },
        "position": 3,
        "type": "string",
        "length": [
          1,
          60
        ],
        "required": false
      }
    },
    "public_form": true
  }
}
```

## Populating ids.

When patients from an interoperating system are sent to a CHT application, the mediator needs to maintain a link between the CHT Patient and the external patient by saving the document and patient ids from CHT, and forwarding them back to the interoperating system. Because the patient docuemnt is created aynschronously with the request to create the patient, the mediator exposes a callback endpoint to add these ids asynchronously. 

To use this endpoint, create another outbound push config with `patient_id` and `external_id`.
relevant to should be `doc.type === 'data_record' && doc.form === {{the code of the patient creation form}}`
mapping contains three fields, `id`, `patient_id`, and `external_id`.

|Field|Description|
|--|--|
|`_id`| Id of the report document that created the patient. This is used to retrieve the patient document, but is not directly the CHT document ID that will be used. |
|`patient_id`| `patient_id`|
|`external_id`| The external id which will be used to create the link between the cht and external patient|

```json
{
  "patient_id": {
    "relevant_to": "doc.type === 'data_record' && doc.form === 'OPENMRS_PATIENT'",
    "destination": {
      "base_url": "http://openhim-core:5001",
      "path": "/mediator/cht/patient_ids",
      "auth": {
        "type": "basic",
        "username": "interop-client",
        "password_key": "openhim1"
      }
    },
    "mapping": {
      "doc._id": "doc._id",
      "doc.patient_id": "doc.patient_id",
      "doc.external_id": "doc.fields.external_id"
    }
  }
}
```
