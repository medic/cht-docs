---
title: "SMS message recipients"
linkTitle: "SMS Recipients"
weight: 1
description: >
  Overview of the possible SMS recipient resolutions
relatedContent: >
  apps/features/messaging
  apps/reference/app-settings/sms
  apps/guides/data/hydration
keywords: messaging
---

An outgoing SMS message configuration has the following fields:

|property|description|required|
|-------|---------|----------|
|`translation_key`|The translation key of the message to send out. Available in 2.15+.|yes|
|`messages`| Array of message objects, each with `content` and `locale` properties. From 2.15 on use `translation_key` instead.|no|
|`recipient`| Recipient of the message.|no|

### `recipient` values and resolutions:

|value|resolves to|
|-----|-----------|
|*empty*| submitter |
|reporting_unit| submitter | 
|parent| primary contact of the patient's/submitter's place's parent (`patient.parent.parent.contact`) | 
|grandparent| primary contact of the patient's/submitter's place's grandparent (`patient.parent.parent.parent.contact`) |
|clinic| primary contact of the `clinic` in the patient's/submitter's lineage | 
|health_center| primary contact of the `health_center` in the patient's/submitter's lineage | 
|district| primary contact of the `district_hospital` in the patient's/submitter's lineage |
|`ancestor:<contact_type>`| primary contact of the place of the requested type in the patient's/submitter's lineage |
|`link:<tag>`| Linked doc that has requested `tag` in the patient's / submitter's lineage (direct mapping, not to primary contact). *As of 3.10.x*| 
|`link:<contact_type>`| primary contact of the place of the requested `contact_type` in the patient's/submitter's lineage. *As of 3.10.x* | 
| *custom object path* | a direct object path in the **context object** eg: `patient.parent.contact.other_phone` | 
| *valid phone number* | requested phone number |

#### The message context object consists of:

|property|value description|
|--------|-----------------|
|*every property from the original report* | unchanged unless specified below |
|*every `fields` property from the original report* | eg: if the report has `fields.test = 'test'` then `context.test = 'test'` |
| patient | deeply hydrated patient contact (resolved from `patient_id`, `fields.patient_id` or `fields.patient_uuid`) |
| patient_name | patient's name |  
| place | deeply hydrated place document (resolved from `place_id`) - *only available in `registration` transition, when creating the place via SMS* |
| contact | deeply hydrated submitter contact | 
| parent | deeply hydrated `health_center` type document from the patient's or submitter's lineage |
| grandparent | deeply hydrated `district_hospital` type document from the patient's or submitter's lineage |
| clinic | deeply hydrated `clinic` type document from the patient's or submitter's lineage |
| health_center | deeply hydrated `health_center` type document from the patient's or submitter's lineage |
| district_hospital | deeply hydrated `district_hospital` type document from the patient's or submitter's lineage |

#### Nota bene
- if `recipient` resolution does not yield a phone number, we will default to submitter's phone number
- if there is no submitter phone number available, the actual `recipient` property value will be used
- when mapping a contact phone number, `patient` lineage and linked_docs take precedence over `submitter` lineage and linked_docs. 
- except for `link:<tag>`, phone numbers are resolved to the primary contacts of the requested places. `linked_docs` hydration is shallow, so the primary contact of the linked doc will not be available.
