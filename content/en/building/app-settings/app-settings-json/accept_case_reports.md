---
title: ".accept_case_reports"
linkTitle: ".accept_case_reports"
weight: 5
description: >
  **Case Reports**: Defining SMS workflows with schedules and registration of case reports.
relevantLinks: >
  docs/building/concepts/workflows
keywords: workflows
aliases:
   - /building/app-settings/app-settings-json/accept_case_reports
   - /apps/reference/app-settings/accept_case_reports
---

The `accept_case_reports` key contains the actions to take when reports about cases are received.

## `app_settings.json .accept_case_reports[]`

|property|description|required|
|-------|---------|----------|
|`form`|Form ID of the case form.|yes|
|`silence_type`|A comma separated list of schedules to mute.|no|
|`silence_for`|Duration from when the report was submitted for which messages should be muted. It is structured as a string with an integer value followed by a space and the time unit. For instance `8 weeks` or `2 days`. The units available are `seconds`, `minutes`, `hours`, `days`, `weeks`, `months`, `years`, and their singular forms as well. When a message is muted all messages belonging to the same group will be muted, even if it falls outside of this time period. See `messages[].group` in _Schedules_ for related info.|no|
|`validations`|A set of validations to perform on incoming reports. Read more information about [configuring validation rules]({{% ref "building/app-settings/app-settings-json#validations" %}}).|no|
|`validations.join_responses`|A boolean specifying whether validation messages should be combined into one message.|no|
|`validations.list[]`|An array of validation rules a report should pass to be considered valid.|no|
|`validations.list[].property`|Report field for which this validation rule will be applied.|no|
|`validations.list[].rule`|Validation condition to be applied to the property field.|no|
|`validations.list[].translation_key`|Translation key for the message reply to be sent if a report fails this rule.|no|
|`messages`|An array of automated responses to incoming reports.|no|
|`messages[].translation_key`|Translation key for the message text associated with this event|no|
|`messages[].event_type`|An event that will trigger sending of this message. Typical values are: `report_accepted` when the report has been successfully validated, `registration_not_found` when the case ID supplied in the report doesn't match any case ID issued by Medic. Read the [documentation on muting]({{% ref "building/app-settings/app-settings-json/transitions#muting" %}}).|no|
|`messages[].recipient`|Who the message should be sent to. Use `reporting_unit` for the sender of the report, `clinic` for clinic contact, and `parent` for the parent contact.|no|

## Code sample

```json
"accept_case_reports": [{
  "form": "SIGNOFF",
  "validations": {},
  "messages": [{
    "event_type": "report_accepted",
    "bool_expr": "some expression",
    "message": "some message",
    "recipient": "some recipients"
  }]
}]
```
