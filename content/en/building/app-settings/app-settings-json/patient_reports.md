---
title: ".patient_reports"
linkTitle: ".patient_reports"
weight: 5
description: >
  **Patient Reports**: Defining SMS workflows with schedules, registration, and patient reports.
relatedContent: >
  building/workflows/workflows-overview
  building/app-settings/app-settings-json/_index.md#sms-recipient-resolution
keywords: workflows
aliases:
   - /building/app-settings/app-settings-json/patient_reports
   - /apps/reference/app-settings/patient_reports
---

The `patient_reports` key contains the actions to take when reports about people are received.


## `app_settings.json .patient_reports[]`

|property|description|required|
|-------|---------|----------|
|`form`|Form ID of the form.|yes|
|`name`|Descriptive name of the form. This is not currently used in the app, but can be a helpful annotation.|no|
|`format`|Guide of how the form can be used. This is not currently used in the app, but can be a helpful annotation.|no|
|`silence_type`|A comma separated list of schedules to mute.|no|
|`silence_for`|Duration from when the report was submitted for which messages should be muted. It is structured as a string with an integer value followed by a space and the time unit. For instance `8 weeks` or `2 days`. The units available are `seconds`, `minutes`, `hours`, `days`, `weeks`, `months`, `years`, and their singular forms as well. When a message is muted all messages belonging to the same group will be muted, even if it falls outside of this time period. See `messages[].group` in _Schedules_ for related info.|no|
|`fields`|Descriptive list of form fields. This is not currently used in the app, but can be a helpful annotation.|no|
|`validations`|A set of validations to perform on incoming reports. More information about validation rules can be found [here]({{% ref "building/app-settings/app-settings-json#validations" %}}).|no|
|`validations.join_responses`|A boolean specifying whether validation messages should be combined into one message.|no|
|`validations.list[]`|An array of validation rules a report should pass to be considered valid.|no|
|`validations.list[].property`|Report field for which this validation rule will be applied.|no|
|`validations.list[].rule`|Validation condition to be applied to the property field. More information about rules can be found [here]({{% ref "building/app-settings/app-settings-json#rules" %}}).|no|
|`validations.list[].translation_key`|Translation key for the message reply to be sent if a report fails this rule.|no|
|`messages`|An array of automated responses to incoming reports.|no|
|`messages[].translation_key`|Translation key for the message text associated with this event|no|
|`messages[].event_type`|An event that will trigger sending of this message. Typical values are: `report_accepted` when the report has been successfully validated, `registration_not_found` when the shortcode (patient ID or place ID) supplied in the report doesn't match any shortcode issued by Medic. `on_mute` and `on_unmute` are used in the context of muting as described [here]({{% ref "building/app-settings/app-settings-json/transitions#muting" %}})|no|
|`messages[].recipient`|Who the message should be sent to. Use `reporting_unit` for the sender of the report, `clinic` for clinic contact, and `parent` for the parent contact. [See SMS Recipients]({{< relref "building/app-settings/app-settings-json/_index.md#sms-recipient-resolution" >}})|no|

## Code sample

This sample shows a `V` report clearing schedules that have messages within 8 days of the report being received. The sample also defines the response messages if the report is accepted or if the patient is not found.

```json
  "patient_reports": [
    {
      "form": "V",
      "name": "Visit (SMS)",
      "format": "V <patientid>",
      "silence_type": "ANC Reminders, ANC Reminders LMP, ANC Reminders LMP from App",
      "silence_for": "8 days",
      "fields": [
        {
          "field_name": "",
          "title": ""
        }
      ],
      "validations": {
        "join_responses": true,
        "list": [
          {
            "property": "patient_id",
            "rule": "regex('^[0-9]{5,13}$')",
            "translation_key": "messages.generic.validation.patient_id"
          }
        ]
      },
      "messages": [
        {
          "translation_key": "messages.v.report_accepted",
          "event_type": "report_accepted",
          "recipient": "reporting_unit"
        },
        {
          "translation_key": "messages.generic.registration_not_found",
          "event_type": "registration_not_found",
          "recipient": "reporting_unit"
        }
      ]
    }
  ]
```
