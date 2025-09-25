---
title: "OpenIMIS Interoperability"
linkTitle: "OpenIMIS"
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
    following [outbound config](http://localhost:1313/building/reference/app-settings/outbound/) was added.
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
