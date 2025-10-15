---
title: "openIMIS Interoperability"
linkTitle: "openIMIS"
weight: 5
description: >
    Interoperability process between CHT and OpenIMIS for managing claims and their feedback.
keywords: openimis interoperability
relatedContent: >
    building/interoperability/cht-config
    building/interoperability/openhim
    building/interoperability/openmrs
aliases:
    - /building/guides/interoperability/openimis

---

[OpenIMIS](https://openimis.org/) is an open-source software for the administration
of social protection, e.g. health insurance, occupational accident
insurance, voucher systems, cash transfers and social registries.

#### Use-Case

OpenIMIS is a specialized system used by Nepal's social security division, which
manages health insurance coverage. The goal of this interoperability project is
to create an interoperable system that uses CHT's form feedback feature to gather
information on the quality of healthcare patients receive on their insurance.

#### Data exchange standard

Data exchange between the systems has been done using [HL7 FHIR standard](https://www.hl7.org/fhir/).

### Overview

This section describes the workflow for the data exchange and integration between
CHT and OpenIMIS.

1. CHT mediator subscribes to OpenIMIS for Resource type `Claim` using the FHIR standard
   `Subscription` endpoint. This means that for every new `Claim` Resource that
   is created at OpenIMIS, it is also sent to CHT.
1. When a `Claim` is created at OpenIMIS, a `ClaimResponse` resource type is sent
   to CHT. CHT mediator extracts the Claim's UUID, Claim's ID, the Patient's ID,
   Claim Date and sends the data to CHT's records API(`/api/v2/records`) which
   creates the patient and also creates a task for the respective CHW as well.

   _NOTE: right now for each `ClaimResponse`, a new patient is created to minimize_
   _the effort required because the work is still in POC stage._

1. The task for the CHW requires the CHW to get input from the patient on the
   on their experience with the insurance which is done through the CHT's feedback
   form. When the form is submitted, CHT mediator sends the questionnaire data back
   to OpenIMIS.

   {{< figure src="openimis_workflow.png" link="openimis_workflow.png" >}}

#### Configuration

##### Environment variables

The CHT mediator needs to be setup with the following environment variables for
a successful communication with OpenIMIS.

| Name                             | Description                                                                                             |
|----------------------------------|---------------------------------------------------------------------------------------------------------|
| `OPENIMIS_API_URL`               | URL of OpenIMIS instance                                                                                |
| `OPENIMIS_USERNAME`              | OpenIMIS username for authentication                                                                    |
| `OPENIMIS_PASSWORD`              | OpenIMIS password for authentication                                                                    |
| `CHT_OPENIMIS_CALLBACK_ENDPOINT` | The OpenIMIS server sends `ClaimResponse` data to this CHT mediator endpoint after a `Claim` is created |

##### CHT Config

1. Add form for processing the `ClaimResponse` data in CHT. The form below is an example.
    ```json
   {
        "meta": {
            "code": "OP",
            "translation_key": "forms.op.title",
            "icon": "icon-follow-up"
        },
        "fields": {
            "patient_id": {
                "labels": {
                    "tiny": {
                        "en": "patient_id"
                    },
                    "short": {
                        "en": "Patient Id"
                    }
                },
                "position": 0,
                "type": "string",
                "length": [
                    5,
                    13
                ],
                "required": true
            },
            "op_claim_id": {
                "labels": {
                    "tiny": {
                        "en": "openImis Claim Id"
                    },
                    "short": {
                        "en": "openImis Claim Id"
                    }
                },
                "position": 1,
                "type": "string",
                "required": true
            },
            "op_claim_uuid": {
                "labels": {
                    "tiny": {
                        "en": "openImis Claim UUID"
                    },
                    "short": {
                        "en": "openImis Claim UUID"
                    }
                },
                "position": 2,
                "type": "string",
                "required": true
            },
            "op_year": {
                "labels": {
                    "tiny": {
                        "en": "OP_Y"
                    },
                    "short": {
                        "en": "OP Year"
                    }
                },
                "position": 3,
                "type": "bsYear",
                "required": true
            },
            "op_month": {
                "labels": {
                    "tiny": {
                        "en": "OP_M"
                    },
                    "short": {
                        "en": "OP Month"
                    }
                },
                "position": 4,
                "type": "bsMonth",
                "required": true
            },
            "op_day": {
                "labels": {
                    "tiny": {
                        "en": "OP_D"
                    },
                    "short": {
                        "en": "OP Day"
                    }
                },
                "position": 5,
                "type": "bsDay",
                "required": true
            },
            "op_date": {
                "labels": {
                    "tiny": {
                        "en": "OP_DATE"
                    },
                    "short": {
                        "en": "OP Date"
                    }
                },
                "position": 6,
                "type": "bsAggreDate",
                "required": false
            }
        },
        "public_form": true
    }
    ```

1. Store mediator password in CHT's secrets, if not already.
   ```shell
   curl -X PUT -H "Content-Type: text/plain" https://admin:password@localhost/api/v1/credentials/<interop-key> -d '<interop-password>' -k
   ```

1. Outbound
   
    To have the CHT send data to mediator when the feedback form is submitted, the
    following [outbound config]({{< ref "building/reference/app-settings/outbound" >}}) was added.
    It filter out all the documents with the form type to be `claims_feedback` and extracts the answers from
    the form and sends it to OpenIMIS through the CHT mediator.

   ```json
   {
        "relevant_to": "doc.form === 'claims_feedback'",
        "destination": {
            "base_url": "http://openhim-core:5001",
            "path": "/mediator/claims-feedback",
            "auth": {
                "type": "basic",
                "username": "interop-client",
                "password_key": "<interop-key>"
            }
        },
        "mapping": {
            "doc._id": "doc._id",
            "care_rendered": "doc.fields.claim_feedback_group.care_rendered",
            "payment_asked": "doc.fields.claim_feedback_group.payment_asked",
            "drug_prescribed": "doc.fields.claim_feedback_group.drug_prescribed",
            "drug_received": "doc.fields.claim_feedback_group.drug_received",
            "assessment_rating": "doc.fields.claim_feedback_group.assessment_rating",
            "claimuuid": "doc.fields.inputs.op_claim_uuid",
            "insureeuuid": "doc.fields.inputs.openimis_id"
        }
   } 
   ``` 

#### Sample workflow

The following screenshots show a sample workflow of the interoperability between CHT and OpenIMIS.

1. **Subscribe to OpenIMIS for `Claim` Resource type:**

    The first step is to subscribe to OpenIMIS for `Claim` Resource type using the `Subscription` endpoint.
    This is done by sending a `POST` request to the `Subscription` endpoint.
    ```bash
   curl --location 'https://<openimis-server>/api/api_fhir_r4/Subscription/' \
    --header 'Content-Type: application/json' \
    --header 'Authorization: Basic QWRtaW46YWRtaW4xMjM=' \
    --data '{
    "resourceType": "Subscription",
    "status": "active",
    "end": "2029-12-31T23:59:59Z",
    "reason": "Claim",
    "criteria": "Claim",
    "channel": {
    "type": "rest-hook",
    "endpoint": "https://localhost:9000/mediator/claim-response",
    "header": [
    "{\"Content-Type\": \"application/json\", \"Accept\": \"application/json\", \"Authorization\": \"Basic aW50ZXJvcC1jbGllbnQ6aW50ZXJvcC1wYXNzd29yZA==\"}"
    ]
    }
    }'
    ```

   {{< figure src="openimis_subcribe.png" link="openimis_subcribe.png" >}}

1. **Claim Request**
    
    When a `Claim` is created at OpenIMIS, a `POST` request is sent to CHT mediator's
    callback endpoint with the `ClaimResponse` data.
    
    {{< figure src="openimis_claim_request.png" link="openimis_claim_request.png" >}}
    
    Sample Request Body:
    ```json
    {
      "resourceType": "ClaimResponse",
      "id": "d3256498-ad16-4482-a2d2-4a6d9c78ba81",
      "identifier": [
        {
          "type": {
            "coding": [
              {
                "system": "https://openimis.github.io/openimis_fhir_r4_ig/CodeSystem/openimis-identifiers",
                "code": "UUID"
              }
            ]
          },
          "value": "d3256498-ad16-4482-a2d2-4a6d9c78ba81"
        },
        {
          "type": {
            "coding": [
              {
                "system": "https://openimis.github.io/openimis_fhir_r4_ig/CodeSystem/openimis-identifiers",
                "code": "Code"
              }
            ]
          },
          "value": "CHT979"
        }
      ],
      "status": "active",
      "type": {
        "coding": [
          {
            "system": "https://openimis.github.io/openimis_fhir_r4_ig/CodeSystem/claim-visit-type",
            "code": "O",
            "display": "Other"
          }
        ]
      },
      "use": "claim",
      "patient": {
        "reference": "Patient/7b00e6ec-e0f5-4d07-a8e0-ec00a4160e73",
        "type": "Patient",
        "identifier": {
          "type": {
            "coding": [
              {
                "system": "https://openimis.github.io/openimis_fhir_r4_ig/CodeSystem/openimis-identifiers",
                "code": "UUID"
              }
            ]
          },
          "value": "7b00e6ec-e0f5-4d07-a8e0-ec00a4160e73"
        }
      },
      "created": "2025-08-25",
      "insurer": {
        "reference": "openIMIS"
      },
      "requestor": {
        "reference": "Practitioner/c60bacae-2aac-4bbf-bdad-7258ebb75f1f",
        "type": "Practitioner",
        "identifier": {
          "type": {
            "coding": [
              {
                "system": "https://openimis.github.io/openimis_fhir_r4_ig/CodeSystem/openimis-identifiers",
                "code": "UUID"
              }
            ]
          },
          "value": "c60bacae-2aac-4bbf-bdad-7258ebb75f1f"
        }
      },
      "request": {
        "reference": "ClaimV2/d3256498-ad16-4482-a2d2-4a6d9c78ba80",
        "type": "ClaimV2",
        "identifier": {
          "type": {
            "coding": [
              {
                "system": "https://openimis.github.io/openimis_fhir_r4_ig/CodeSystem/openimis-identifiers",
                "code": "UUID"
              }
            ]
          },
          "value": "d3256498-ad16-4482-a2d2-4a6d9c78ba80"
        }
      },
      "outcome": "queued",
      "item": [
        {
          "extension": [
            {
              "url": "https://openimis.github.io/openimis_fhir_r4_ig/StructureDefinition/claim-item-reference",
              "valueReference": {
                "reference": "ActivityDefinition/488d8bcb-5b88-438c-9077-f177f6f32626",
                "type": "ActivityDefinition",
                "identifier": {
                  "type": {
                    "coding": [
                      {
                        "system": "https://openimis.github.io/openimis_fhir_r4_ig/CodeSystem/openimis-identifiers",
                        "code": "UUID"
                      }
                    ]
                  },
                  "value": "488d8bcb-5b88-438c-9077-f177f6f32626"
                },
                "display": "A1"
              }
            }
          ],
          "itemSequence": 1,
          "adjudication": [
            {
              "category": {
                "coding": [
                  {
                    "system": "https://openimis.github.io/openimis_fhir_r4_ig/CodeSystem/claim-status",
                    "code": "1",
                    "display": "rejected"
                  }
                ]
              },
              "reason": {
                "coding": [
                  {
                    "system": "https://openimis.github.io/openimis_fhir_r4_ig/CodeSystem/claim-rejection-reasons",
                    "code": "0",
                    "display": "ACCEPTED"
                  }
                ]
              },
              "amount": {
                "value": 999,
                "currency": "$"
              },
              "value": 1
            }
          ]
        }
      ],
      "total": [
        {
          "category": {
            "coding": [
              {
                "system": "https://openimis.github.io/openimis_fhir_r4_ig/CodeSystem/claim-status",
                "code": "2",
                "display": "entered"
              }
            ]
          },
          "amount": {
            "value": 0,
            "currency": "$"
          }
        }
      ]
    } 
    ```

1. A person is created using the form created in the CHT config section above.

   {{< figure src="openimis_claim_form.png" link="openimis_claim_form.png" >}}
   {{< figure src="openimis_new_person_created.png" link="openimis_new_person_created.png" >}}

1. A task is also created for the CHW to get feedback from the patient.

   {{< figure src="openimis_task_created.png" link="openimis_task_created.png" >}}

1. Once the feedback form is submitted, the data is sent to OpenIMIS through the CHT mediator.

   {{< figure src="openimis_task_submitted.png" link="openimis_task_submitted.png" >}}

This completes the interoperability process between CHT and OpenIMIS for managing claims.
