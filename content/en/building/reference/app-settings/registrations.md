---
title: ".registrations"
linkTitle: ".registrations"
weight: 5
description: >
  **Registrations**: Defining SMS workflows with schedules, registration, and patient reports.
relatedContent: >
  building/workflows/workflows-overview
  building/reference/app-settings/_index.md#sms-recipient-resolution
keywords: workflows
aliases:
   - /apps/reference/app-settings/registrations
---

The `registrations` key contains actions that need to be performed for incoming reports of the specified form.

## `app_settings.json .registrations[]`

|property|description|required|
|-------|---------|----------|
|`form`|Form ID that should trigger the schedule.|yes|
|`events`|An array of event object definitions of what should happen when this form is received.|yes|
|`event[].name`|Name of the event that has happened. The only supported event is `on_create` which happens when a form is received.|yes|
|`event[].trigger`|What should happen after the named event. `assign_schedule` will assign the schedule named in `params` to this report. Similarly `clear_schedule` will permanently clear all messages for a patient or place that are part of schedules listed in the `params` field. The full set of trigger configuration directives are described [here]({{% ref "building/reference/app-settings/transitions#triggers" %}}).|yes|
|`event[].params`|Any useful information for the event. In our case, it holds the name of the schedule to be triggered.|no|
|`event[].bool_expr`|A JavaScript expression that will be cast to boolean to qualify execution of the event. Leaving blank will default to always true. CouchDB document fields can be accessed using `doc.key.subkey`. Regular expressions can be tested using `pattern.test(value)` e.g. /^[0-9]+$/.test(doc.fields.last_menstrual_period). In our example above, we're making sure the form has an LMP date.|no|
|`validations`|A set of validations to perform on incoming reports. More information about validation rules can be found [here]({{% ref "building/reference/app-settings#validations" %}}).|no|
|`validations.join_responses`|A boolean specifying whether validation messages should be combined into one message.|no|
|`validations.list[]`|An array of validation rules a report should pass to be considered valid.|no|
|`validations.list[].property`|Report field for which this validation rule will be applied.|no|
|`validations.list[].rule`|Validation condition to be applied to the property field. More information about rules can be found [here]({{% ref "building/reference/app-settings#rules" %}}).|no|
|`validations.list[].translation_key`|Translation key for the message reply to be sent if a report fails this rule.|no|
|`messages`|An array of automated responses to incoming reports.|no|
|`messages[].translation_key`|Translation key for the message text associated with this event.|no|
|`messages[].event_type`|An event that will trigger sending of this message. Typical values are: `report_accepted` when the report has been successfully validated and `registration_not_found` when the shortcode (patient ID or place ID) supplied in the report doesn't match any shortcode issued by Medic.|no|
|`messages[].recipient`|Who the message should be sent to. Use `reporting_unit` for the sender of the report, `clinic` for clinic contact, and `parent` for the parent contact. [See SMS Recipients](/building/reference/app-settings/_index.md#sms-recipient-resolution)|no|

## Code sample

This sample shows how a schedule would be triggered by a `pregnancy` report if the `last_menstrual_period` value is set.  

```json

"registrations": [
  {
    "form": "pregnancy",
    "events": [
      {
        "name": "on_create",
        "trigger": "assign_schedule",
        "params": "ANC Visit Reminders",
        "bool_expr": "doc.fields.last_menstrual_period"
      }
    ],
    "validations": {},
    "messages": []
  }
]

```
