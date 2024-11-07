---
title: "OpenMRS Interoperability"
linkTitle: "OpenMRS Interoperability"
weight:
description: >
   Exchange patient-level data with systems based on the OpenMRS using FHIR APIs
keywords: openmrs interoperability
relatedContent: >
  building/guides/interoperability/cht_config
  building/concepts/interoperability
  building/guides/interoperability/openhim
---

[OpenMRS](https://openmrs.org) is an open-source electronic medical record system used in dozens of countries. Integrating CHT apps with OpenMRS can open up opportunities to improve health outcomes for patients by promoting better coordination of care. For example, referrals by CHWs in the community can be sent electronically to health facilities using OpenMRS so that nurses and clinicians can prepare for their visit and have full access to the assessment done by a CHW.

Integrating CHT apps with OpenMRS can be achieved using the CHT's [Interoperability Tools]({{< ref "building/guides/interoperability/openhim" >}}) and following the guidance in the [Building interoperability with FHIR APIs documentation]({{< ref "building/guides/interoperability/cht_config" >}}). 

## Overview

The CHT's interoperability tools support integrations with OpenMRS in a variety of ways:

1. Sending patient and patient contact data
2. Sending reports data (encounters and observations)
3. Receiving patient and patient contact data from OpenMRS
4. Receiving reports data (encounters and observations) from OpenMRS

The steps to create an OpenMRS interoperability flow are:

1. Profile the workflow in terms of what data needs to be exchanged between OpenMRS and CHT.
1. set up a test environment
1. Set up OpenMRS, or get Basic Authentication credentials from an existing OpenMRS deployment. 
1. Create or find concepts in OpenMRS that represent any data that needs to be exchanged.
1. Configure outbound push and forms in CHT to match the interoperability workflow.
1. Set OpenMRS credentials and CHT credentials in the interoperability project.
1. Start the interoperability project with docker compose and install the Mediator channels
1. Test and debug any configuration issues

## Technical Overview

It may be useful to have a general understanding of how CHT and OpenMRS can interoperate.
* Outbound push is used to send CHT documents to the CHT Mediator, which converts them into FHIR resources, and stores a copy on a FHIR Server using [HAPI](https://hapifhir.io/).
This intermediate storage is used to link patients and encounters from OpenMRS and CHT with identifiers from both CHT and OpenMRS and to store additional FHIR metadata.
* An OpenMRS mediator polls the OpenMRS FHIR API periodically (the default is every minute) and synchronizes resources between the FHIR server and OpenMRS.
Synchronizing involves comparing the resources from the FHIR server and OpenMRS and forwarding any new or updated data from one to the other.
This is used both to create CHT data in OpenMRS and to create OpenMRS data in a CHT application.

## Environments

run `./starup.sh up-test` to create a test environment with a sample openmrs and cht config. 
You can edit the cht config to test it before deploying to production

## Profiling

The first step is to profile the workflow.

1. Which patients should be sent to OpenMRS, and how is a patient defined in the CHT application?
2. Which forms should be sent to OpenMRS?
3. Which fields on those forms should be sent to OpenMRS, and which concepts do they map to?
4. Should patients from OpenMRS be sent back to CHT? If so, what will be used to assign them to CHWs or CHW areas?
5. Which forms or other data from OpenMRS should be sent back to CHT?

## Configuring CHT And OpenMRS

Depending on what data needs to be exchanged, outbound push configurations and JSON forms need to be added to CHT.

### Sending patients CHT->OpenMRS

When sending patient data to OpenMRS, configure an outbound push mapping as described in the [CHT FHIR config documentation]({{< ref "building/guides/interoperability/cht_config#outbound-patients" >}}).
Patients synced to OpenMRS will have two new [identifier types](https://guide.openmrs.org/getting-started/openmrs-information-model/#patient-identifier): `CHT Document Id`, the uuid of the document that is sent, and `CHT Patient ID`, if there is a `patient_id` field on the patient document.
These identifier types are created automatically when the OpenMRS Channel is registered.

After setting up the putbound push, test that it works in the test environment by cerating a patient in the CHT.
Log in to OpenHIM and view the transaction log. You should see:
1. a request from CHT to the CHT Mediator
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
1. a request from the CHT mediator to the FHIR Server, PUTing the newly created FHIR resource
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
1. After a maximum of 1 minute, a polling request from the OpenMRS mediator to the FHIR server. The results should include the newly created patient.
    ![](openmrs-sync-patient.png)
1. A request to OpenMRS containing the newly created patient.
    ![](openmrs-post-patient.png)
1. A request to the FHIR server updating the patient with the corresponding id from OpenMRS.
    ![](fhir-put-patient.png)

If all the above look OK, you should now be able to search in OpenMRS for the patient.

This sequence diagrams shows the entire flow including the OpenMRS Mediator and the intermediate FHIR Server.
![](cht-outgoing-patients.png)

### Sending forms CHT->OpenMRS

Any data sent from CHT to OpenMRS needs to map to a [concept](https://wiki.openmrs.org/display/docs/Concept+Dictionary+Basics) in OpenMRS. Each concept has a code which will be used to identify the concept in the CHT Application, the FHIR Server, and OpenMRS.
For any fields to send to OpenMRS, first find or create matching concepts in OpenMRS.
Then, using the appropriate codes, configure an outbound push as described in the [CHT FHIR config documentation]({{< ref "building/guides/interoperability/cht_config#outbound-reports" >}}).

In OpenMRS, all form submissions are represented as `Home Visit` Encounter types, with a `Visit Note` Encounter.
Any fields in the outbound push config are converted to FHIR Observations, which are linked to the `Visit Note`.

After setting up the putbound push, test that it works in the test environment by cerating a patient in the CHT.
Log in to OpenHIM and view the transaction log. You should see: 
1. a request from CHT to the CHT Mediator
    ![](cht-post-encounter.png)
    ```json
    {
      "id": "442b0937-a32f-443e-8d28-7d9a7552fda2",
      "patient_uuid": "75905106a4bc2a9046ed28df070016ce",
      "reported_date": 1730355950419,
      "observations": [
        {
          "code": "5090AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "valueQuantity": 175,
          "valueUnit": "cm",
          "label": "Height in cm"
        },
        {
          "code": "5089AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
          "valueQuantity": 60,
          "valueUnit": "kg",
          "label": "Weight in kg"
        }
      ]
    }
    ```
1. Requests to FHIR server to create a FHIR Encounter, and one request for each Observation contained in that Encounter
    ![](openhim-put-encounter.png)
1. After a maximum of 1 minute, a polling request from the OpenMRS mediator to the FHIR server. The results should an Encounter to represent the form submission, and several Observation resources for any fields that were mapped to Codes.
    ![](openmrs-sync-encounter.png)
1. Requests to OpenMRS for a `Home Visit` Encounter, a `Visit Note` encounter, and one request for each `Observation`.
    ![](openmrs-post-observation.png)
1. A request to the FHIR server updating the encounter with the corresponding id from OpenMRS.

If all the above look OK, you should now be able to see the Encounter on OpenMRS

This sequence diagrams shows the entire flow including the OpenMRS Mediator and the intermediate FHIR Server.
![](cht-form-submission.png)

### Sending patients OpenMRS->CHT

Receiving patient and form data from OpenMRS in CHT is possible, but requires some additional configuration to assign patients to a CHW or CHW Area.
All patients in CHT applications require a parent, which is assumed to be a CHW area or equivalent and defines which CHW the patient is assigned to.
For interoperability with OpenMRS, this means that patients created by OpenMRS must be matched to CHT locations.

A default implementation is provided which uses the [OpenMRS address add on](https://addons.openmrs.org/show/org.openmrs.module.addresshierarchy) to match locations in OpenMRS to contacts in CHT.
This can be complicated to set up and maintain; an alternative is to customize the OpenMRS mediator for specific applications.
If using the default implementation
1. Install the address hierarchy add-on.
2. Download the contact hierarchy from the CHT application.
3. Upload these contacts to OpenMRS: address 5 should be a CHW area, or the direct parent of the patient. If address 5 is not specified, the mediator will use address 4. 
4. The mediator will attempt to find CHT locations by using a place id formatted like `[12345]` at the end of the address string. `place_id` must match a CHT place id. If `place_id` is not included in the OpenMRS addresses, the mediator will attempt to match by the place name. This is not as reliable since the name must match exactly, and changes to either the CHT or OpenMRS will 

Patients that do not have an address or otherwise cannot be assigned a parent in CHT will be queryable in the FHIR Server and linked to OpenMRS Patients, but will not be sent to CHT.

After setting up the forms, test that it works in the test environment by creating a patient in OpenMRS.
Log in to OpenHIM and view the transaction log. You should see:
1. After a maximum of 1 minute, a polling request from the OpenMRS mediator to the FHIR server. The results should include the newly created Patient.
1. A request to the patient creation form.
1. A request from CHT to the patient_ids endpoint in the mediator
1. A request to the FHIR server updating the patient with the corresponding id from CHT.
1. A request to OpenMRS with the CHT id.

If all the above look OK, you should now be able to see the Patient in CHT.

This sequence diagrams shows the entire flow including the OpenMRS Mediator and the intermediate FHIR Server.
![](cht-incoming-patients.png)

### Sending forms OpenMRS->CHT

When sending form data to CHT, first find, create, or import the concepts in OpenMRS, and create the forms in OpenMRS.
Then a form in CHT to receive the reports [as described in the CHT interop config documentation]({{< ref "building/guides/interoperability/cht_config#outbound-reports" >}}); the codes from OpenMRS are the field names, and labels can be added for human readability.
When a Visit is completed in OpenMRS, the mediator will sync it to the FHIR Server.

After setting up the forms, test that it works in the test environment by submitting the form in OpenMRS
Log in to OpenHIM and view the transaction log. You should see 
1. After a maximum of 1 minute, a polling request from the OpenMRS mediator to the FHIR server. The results should include an Encounter to represent the visit when the form was submitted. submission, and any Observations that were a part of that form.
1. A request to the records API with any Observations mapped to Codes.

If all the above look OK, you should now be able to see the data submitted in the CHT.

This sequence diagrams shows the entire flow including the OpenMRS Mediator and the intermediate FHIR Server.
![](cht-incoming-forms.png)

## Starting the interop project

Once the CHT and OpenMRS configs are ready, [Interoperability Tools]({{< ref "building/guides/interoperability/openhim" >}}).
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

* The CHT Mediator Channel contains routes to the CHT Mediator
* The FHIR Channel contains routes to the FHIR Server. Although it is not used by this integration, it can be used to expose any CHT documents sent to it as a FHIR API.
* The OpenMRS Channel contains routes to the FHIR API of an external deployment of OpenMRS
* The OpenMRS Polling Channel is a [polling channel](https://openhim.org/docs/user-guide/polling-channels/) that triggers the sync

![](channels.png)

### Troubleshooting

In case of errors when setting up the OpenHIM project please see the [Troubleshooting guide]({{< ref "building/guides/interoperability/troubleshooting" >}}).

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

