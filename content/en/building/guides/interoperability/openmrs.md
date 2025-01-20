---
title: "OpenMRS Interoperability"
linkTitle: "OpenMRS"
weight: 4
description: >
   Exchange data with systems based on OpenMRS using FHIR APIs
keywords: openmrs interoperability
relatedContent: >
  building/guides/interoperability/cht-config
  building/concepts/interoperability
  building/guides/interoperability/openhim
---

[OpenMRS](https://openmrs.org) is an open-source electronic medical record system used in dozens of countries. Integrating CHT apps with OpenMRS can open up opportunities to improve health outcomes for patients by promoting better coordination of care. For example, referrals by CHWs in the community can be sent electronically to health facilities using OpenMRS so that nurses and clinicians can prepare for their visit and have full access to the assessment done by a CHW.

Integrating CHT apps with OpenMRS can be achieved using the CHT's [Interoperability Tools]({{< ref "building/guides/interoperability/openhim" >}}) and following the guidance in the [Building interoperability with FHIR APIs documentation]({{< ref "building/guides/interoperability/cht-config" >}}). 

## Overview

The CHT's interoperability tools support interoperability with OpenMRS in a variety of ways:

1. Sending patient and patient contact data.
1. Sending reports data (encounters and observations).
1. Receiving reports data (encounters and observations) from OpenMRS.

The steps to create an OpenMRS interoperability workflow are:

1. Profile the workflow in terms of what data needs to be exchanged between OpenMRS and the CHT application.
1. Set up a test environment including an OpenMRS instance, a CHT instance, and OpenHIM. The [interoperability project](https://github.com/medic/cht-interoperability) has docker compose files so that you can set this up locally by running `./startup.sh up-openmrs` in the interoperability project.
1. Create or find [concepts](https://guide.openmrs.org/configuration/managing-concepts-and-metadata/)  in OpenMRS that represent any data that needs to be exchanged.
1. [Configure outbound push and forms]({{< ref "building/guides/interoperability/cht-config" >}}) in the CHT application to match the interoperability workflow.
1. Test and debug any configuration issues in the test environment.
1. Once the configuration is confirmed to be working as expected, start deploying to production by uploading the CHT configuration to production.
1. Add any OpenMRS concepts or forms to production.
1. [Set OpenMRS credentials and CHT credentials](#starting-the-interop-project)  in the interoperability project, and start it in a production deployment.

## Technical Overview

It may be useful to have a general understanding of how CHT and OpenMRS can interoperate.
* Outbound push is used to send CHT documents to the CHT Mediator, which converts them into FHIR resources, and stores a copy on a FHIR Server using [HAPI](https://hapifhir.io/).
This intermediate storage is used to link patients and encounters from OpenMRS and CHT with identifiers from both CHT and OpenMRS and to store additional FHIR metadata.
* An OpenMRS mediator polls the OpenMRS FHIR API periodically (the default is every minute) and synchronizes resources between the FHIR server and OpenMRS.
Synchronizing involves comparing the resources from the FHIR server and OpenMRS and forwarding any new or updated data from one to the other.
This is used both to create CHT data in OpenMRS and to create OpenMRS data in a CHT application.

## Profiling

The first step is to profile the workflow.

1. Which patients should be sent to OpenMRS, and how is a patient defined in the CHT application?
2. Which forms should be sent to OpenMRS?
3. Which fields on those forms should be sent to OpenMRS, and which concepts do they map to?
5. Which forms or other data from OpenMRS should be sent back to CHT?

## Configuring CHT And OpenMRS

Depending on what data needs to be exchanged, [outbound push]({{< ref "building/reference/app-settings/outbound" >}}) configurations and JSON forms need to be added to CHT.

### Sending patients CHT->OpenMRS

When sending patient data to OpenMRS, configure an outbound push mapping as described in the [CHT FHIR config documentation]({{< ref "building/guides/interoperability/cht-config#outbound-patients" >}}).
Patients synced to OpenMRS will have two new [identifier types](https://guide.openmrs.org/getting-started/openmrs-information-model/#patient-identifier): `CHT Document Id`, the uuid of the document that is sent, and `CHT Patient ID`, if there is a `patient_id` field on the patient document.
These identifier types are created automatically when the OpenMRS Channel is registered.

After setting up the outbound push config, test that it works in the test environment by creating a patient in the CHT application.
Log in to OpenHIM and view the transaction log. You should see:
1. A request from the CHT application to the CHT Mediator, containing the patient document.
    ![](cht-post-patient.png)
    ```json
    {
      "doc": {
        "_id": "75905106a4bc2a9046ed28df070016ce",
        "name": "John Test",
        "phone": "+2548277217095",
        "date_of_birth": "1980-06-06",
        "sex": "male",
        "patient_id": "13985"
      }
    }
    ```
1. A request from the CHT mediator to the FHIR Server, using a PUT request to upsert a FHIR patient created from the CHT patient document.
    ![](fhir-put-patient.png)
    ```json
    {
      "resourceType": "Patient",
      "id": "75905106a4bc2a9046ed28df070016ce",
      "meta": {
        "versionId": "1",
        "lastUpdated": "2024-10-31T04:53:44.026+00:00"
      },
      "text": {
        "status": "generated",
        "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><div class=\"hapiHeaderText\">John <b>TEST </b></div><table class=\"hapiPropertyTable\"><tbody><tr><td>Identifier</td><td>13985</td></tr><tr><td>Date of birth</td><td><span>06 June 1980</span></td></tr></tbody></table></div>"
      },
      "identifier": [
        {
          "use": "official",
          "type": {
            "text": "CHT Patient ID"
          },
          "value": "13985"
        },
        {
          "use": "secondary",
          "type": {
            "text": "CHT Document ID"
          },
          "value": "75905106a4bc2a9046ed28df070016ce"
        }
      ],
      "name": [
        {
          "family": "Test",
          "given": [
            "John"
          ]
        }
      ],
      "telecom": [
        {
          "value": "+2548277217095"
        }
      ],
      "gender": "male",
      "birthDate": "1980-06-06"
    }
    ```
1. After a maximum of 1 minute, a polling request from the OpenMRS mediator, and related GET requests to the FHIR server and OpenMRS. The results from the FHIR server should include the newly created patient.
    ![](openmrs-sync-patient.png)
1. A POST request to OpenMRS containing the newly created patient.
    ![](openmrs-post-patient.png)
1. A PUT request to the FHIR server updating the patient with the corresponding id from OpenMRS.
    ![](fhir-put-patient.png)

If all the above look OK, you should now be able to search in OpenMRS for the patient by name, phone number, or patient id.

```bash
curl -X GET localhost:8090/openmrs/ws/fhir2/R4/Patient/?identifier=[identifier] -H "Authorization: Basic $(echo -n admin:Admin123 | base64)"
```

This sequence diagrams shows the entire flow including the OpenMRS Mediator and the intermediate FHIR Server.
![](cht-outgoing-patients.png)

### Sending forms CHT->OpenMRS

Any data sent from CHT to OpenMRS needs to map to a [concept](https://wiki.openmrs.org/display/docs/Concept+Dictionary+Basics) in OpenMRS. Each concept has a code which will be used to identify the concept in the CHT Application, the FHIR Server, and OpenMRS.
For any fields to send to OpenMRS, first find or create matching concepts in OpenMRS.
Then, using the appropriate codes, configure an outbound push as described in the [CHT FHIR config documentation]({{< ref "building/guides/interoperability/cht-config#outbound-reports" >}}).

In OpenMRS, all form submissions are represented as `Home Visit` encounter types, with a `Visit Note` encounter.
Any fields in the outbound push config are converted to FHIR observations, which are linked to the `Visit Note`.

After setting up the outbound push, test that it works in the test environment by submitting a report to the form in the CHT application.
Log in to OpenHIM and view the transaction log. You should see: 
1. A request from the CHT application to the CHT Mediator, containing all the fields from the form that were mapped to concepts.
    ![](cht-post-encounter.png)
    ```json
    {
      "id": "442b0937-a32f-443e-8d28-7d9a7552fda2",
      "patient_uuid": "75905106a4bc2a9046ed28df070016ce",
      "reported_date": 1730355950419,
      "observations": [
        {
          "code": "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "valueQuantity": {
            "value": 175,
            "unit": "cm"
          },
          "label": "Height in cm"
        },
        {
          "code": "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "valueQuantity": {
            "value": 60,
            "unit": "kg",
          },
          "label": "Weight in kg"
        }
      ]
    }
    ```
1. A PUT request to the FHIR server to create an encounter, and one request for each observation contained in that encounter.
    ![](openhim-put-encounter.png)
1. After a maximum of 1 minute, a polling request from the OpenMRS mediator, and related GET requests to the FHIR server and OpenMRS. The results from the FHIR server should include an encounter to represent the form submission, and observations for any fields that were mapped to concepts.
    ![](openmrs-sync-encounter.png)
1. Requests to OpenMRS to create a `Home Visit` encounter, a `Visit Note` encounter, and one request for each observation.
    ![](openmrs-post-observation.png)
1. A request to the FHIR server updating the encounter with the corresponding id from OpenMRS.

If all the above look OK, you should now be able to see the encounter in OpenMRS.

```bash
curl -X GET localhost:8090/openmrs/ws/fhir2/R4/Encounter/?identifier=[identifier] -H "Authorization: Basic $(echo -n admin:Admin123 | base64)"
```

This sequence diagrams shows the entire flow including the OpenMRS Mediator and the intermediate FHIR Server.
![](cht-form-submission.png)

### Sending forms OpenMRS->CHT

When sending form data to CHT, first find, create, or import the [https://guide.openmrs.org/configuration/managing-concepts-and-metadata/](concepts in OpenMRS), and create the forms in OpenMRS.
Then create a form in CHT to receive the reports [as described in the CHT interop config documentation]({{< ref "building/guides/interoperability/cht-config#outbound-reports" >}}); the codes from OpenMRS are the field names, and labels can be added for human readability.
When a visit is completed in OpenMRS, the mediator will sync it to the FHIR Server.

After setting up the forms, test that it works in the test environment by submitting the form in OpenMRS.
Log in to OpenHIM and view the transaction log. You should see:
1. After a maximum of 1 minute, a polling request from the OpenMRS mediator. The results from OpenMRS should include an encounter to represent the visit when the form was submitted, and any observations that were a part of that form.
    ```json
    {
      "resourceType": "Encounter",
      "status": "unknown",
      "class": {
        "system": "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        "code": "AMB"
      },
      "type": [
        {
          "coding": [
            {
              "system": "http://fhir.openmrs.org/code-system/encounter-type",
              "code": "67a71486-1a54-468f-ac3e-7091a9a79584",
              "display": "Vitals"
            }
          ]
        }
      ],
      "subject": {
        "reference": "Patient/30ddc566-a136-4eed-9e20-1840e7d22667",
        "type": "Patient",
        "display": "John Test (CHT Patient ID: 13985)"
      },
      "participant": [
        {
          "individual": {
            "reference": "Practitioner/f9badd80-ab76-11e2-9e96-0800200c9a66",
            "type": "Practitioner",
            "identifier": {
              "value": "UNKNOWN"
            },
            "display": "Super User (Identifier: UNKNOWN)"
          }
        }
      ],
      "period": {
        "start": "2024-11-08T11:07:57+00:00"
      },
      "location": [
        {
          "location": {
            "reference": "Location/b1a8b05e-3542-4037-bbd3-998ee9c40574",
            "type": "Location",
            "display": "Inpatient Ward"
          }
        }
      ],
      "partOf": {
        "reference": "Encounter/b7f9242f-b8b0-4f37-a24c-89ca917435dd",
        "type": "Encounter"
      }
    }
    ```
    ```json
    [
      {
        "resourceType": "Observation",
        "status": "final",
        "code": {
          "coding": [
            {
              "code": "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "display": "Height (cm)"
            }
          ]
        },
        "subject": {
          "reference": "Patient/30ddc566-a136-4eed-9e20-1840e7d22667",
          "type": "Patient",
          "display": "John Test (CHT Patient ID: 13985)"
        },
        "encounter": {
          "reference": "Encounter/8d5e7ddb-1669-4b34-9804-dfae5a15e6a2",
          "type": "Encounter"
        },
        "effectiveDateTime": "2024-11-08T11:07:57+00:00",
        "issued": "2024-11-08T11:07:57.000+00:00",
        "valueQuantity": {
          "value": 175,
          "unit": "cm"
        }
      },
      {
        "resourceType": "Observation",
        "status": "final",
        "code": {
          "coding": [
            {
              "code": "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
              "display": "Weight (kg)"
            }
          ]
        },
        "subject": {
          "reference": "Patient/30ddc566-a136-4eed-9e20-1840e7d22667",
          "type": "Patient",
          "display": "John Test (CHT Patient ID: 13985)"
        },
        "encounter": {
          "reference": "Encounter/8d5e7ddb-1669-4b34-9804-dfae5a15e6a2",
          "type": "Encounter"
        },
        "effectiveDateTime": "2024-11-08T11:07:57+00:00",
        "issued": "2024-11-08T11:07:57.000+00:00",
        "valueQuantity": {
          "value": 60,
          "unit": "kg"
        }
      }
    ]
    ```
1. A request to the records API in the CHT application with any observations mapped to codes.

If all the above look OK, you should now be able to see the data submitted in the CHT.

This sequence diagrams shows the entire flow including the OpenMRS Mediator and the intermediate FHIR Server.
![](cht-incoming-forms.png)

## Starting the interop project

Once the CHT and OpenMRS configs are ready, set up OpenHIM and install the mediators by following the instructions [here]({{< ref "building/guides/interoperability/openhim" >}}).
Set `OPENMRS_URL`, `OPENMRS_PORT`, and `OPENMRS_HOST` in .env to configure the necessary channel automatically.
| Name                      | Description                                                                                     |
|---------------------------|-------------------------------------------------------------------------------------------------|
| `OPENMRS_HOST`            | hostname of OpenMRS instance                                                                    |
| `OPENMRS_PORT`            | port where OpenMRS FHIR API is listening                                                        |
| `OPENMRS_PASSWORD`        | OpenMRS password to use for basic authentication                                                |
| `OPENMRS_USERNAME`        | OpenMRS password to use for basic authentication. Should be a special system or integration user |

When these variables are set, a channel for OpenMRS will automatically be created on startup.

### OpenHIM resources

The interoperability project will automatically create the following resources
* The CHT Mediator is used to convert CHT documents to FHIR resources and store them on the FHIR Server.
* The OpenMRS mediator is used to send FHIR Resources from the FHIR Server to OpenMRS. It contains only one endpoint, `sync`.

![](mediators.png)

* The CHT Mediator Channel contains routes to the CHT Mediator.
* The FHIR Channel contains routes to the FHIR Server. Although it is not used by this integration, it can be used to expose any CHT documents sent to it as a FHIR API.
* The OpenMRS Channel contains routes to the FHIR API of an external deployment of OpenMRS.
* The OpenMRS Polling Channel is a [polling channel](https://openhim.org/docs/user-guide/polling-channels/) that triggers the sync.

![](channels.png)

When running `./startup.sh up-openmrs`, a cht instances with a sample configuration is created for testing.
This includes:
* A sample outbound push configuration for patients.
* A sample outbound push configuration for encounters with a form `openmrs_height`.
* A sample form `HEIGHT_WEIGHT` for outgoing encounters.
* A sample form `OPENMRS_INCOMING` for incoming encounters.

### Troubleshooting

In case of errors when setting up the OpenHIM project please see the [Troubleshooting guide]({{< ref "building/guides/interoperability/openhim#troubleshooting" >}}).

If the openhim project starts up correctly but something else does not work as expected, it can be helpful to first check the transaction log page of OpenHIM to see which requests were sent, and the request and response bodies.
See the sequence diagrams above for the expected requests/responses.

![](transaction_log.png)

### CHT->OpenMRS
* No outbound push sent: check outbound push config, and logs for sentinel
* Outbound push request sent, but returned error: check mediator logs and outbound push config; is it using the right endpoint and request has the expected data? What is the error in the mediator logs?
* Outbound push request sent and succeed, sync to OpenMRS returned error: check OpenMRS logs for more detail.

### OpenMRS->CHT
* Sync finds new patients/forms, error when saving to the FHIR server.
* Outbound push request sent, but returned error: check mediator logs and outbound push config; is it using the right endpoint and request has the expected data? What is the error in the mediator logs?
* Outbound push request sent and succeed, sync to OpenMRS returned error: check OpenMRS logs for more detail.

