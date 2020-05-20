---
title: Building Workflows
linkTitle: "Workflows"
menu:
  docs:
    parent: 'docs'
    weight: 1
description: >
  An open source technology for a new model of healthcare that reaches everyone
---

Forms are the main building block of workflows, because they can be configured to initiate a schedule of tasks, such as follow-up visits for the CHW or a referral to be completed by a nurse. 

Data submitted in one form can generate several tasks at once, e.g., multiple ANC visits following one pregnancy registration. Some workflows involve a series of sequential forms and tasks, e.g., a child health assessment form, a follow up task scheduled 48 hours later, a referral form (only if the child’s condition hasn’t improved), and then a referral follow up task. Tasks are accessible on the Tasks tab, as well as the Tasks section of profiles. 

Workflows can also include SMS notifications and interactions with CHWs, nurses, supervisors, and patients. A submitted form can trigger an SMS to be sent immediately or upon a set schedule. Responses via SMS or the app can update the workflows.

## Developer Guide

<!-- TODO: Revise this to be about workflows and forms -->
Whether using your application in the browser or via an Android app, all Contact creation/edit forms, care guides for decision support, and surveys are defined using [ODK XForms](https://opendatakit.github.io/xforms-spec/) -- a XML definition of the structure and format for a set of questions. Since writing raw XML can be tedious, we suggest creating the forms using the [XLSForm standard](http://xlsform.org/), and using the [medic-conf](https://github.com/medic/medic-conf) command line configurer tool to convert them to XForm format. The instructions on this site assume some knowledge of XLSForm, and distinguish between Contact forms (those used to create and edit contacts), other App forms (which are used for care guides and surveys). Information about Medic-specific XForm features, and form definitions for Medic Collect and SMS can be found in the broader [Forms documentation](https://github.com/medic/medic-docs/blob/master/configuration/forms.md). <!-- TODO: Link to migrated content on Contact forms, App forms, and JSON forms-->

### Building workflows with Tasks

Tasks in the app can drive a workflow, ensuring that the right actions are taken for people at the right time. Tasks indicate a recommended action to the user. They indicate who the user should perform the action with and the recommended timeframe of that action. When the user taps the task, they are directed to a form where the details of the action are captured.

Tasks can be triggered by a set of conditions, such as contact details or submitted reports. Tasks are accessible in the Tasks tab and the profile in the Contact tab, and initiate a follow up action to complete a form. More information on building app workflows is available in the [Tasks section]().

### Building workflows with SMS

The Medic platform can be set up to send automated messages at specificied times in the future. To set this up a form must be defined in `app_settings.json` as a registration form, then trigger a particular set of scheduled messages. Forms can also be configured to clear the schedule, or silence it for a period of time.

#### Scheduled messages

Scheduled messages are defined under the `schedules` key as an array of schedule objects. The definition takes the typical form below:

```json
  "schedules": [
    {
      "name": "ANC Visit Reminders",
      "summary": "",
      "description": "",
      "start_from": "lmp_date",
      "start_mid_group": true,
      "messages": [
        {
          "translation_key": "messages.schedule.registration.followup_anc_pnc",
          "group": 1,
          "offset": "4 weeks",
          "send_day": "monday",
          "send_time": "09:00",
          "recipient": "reporting_unit"
        }
      ]
    }
]
```

|property|description|required|
|-------|---------|----------|
|`name`|A unique string label that is used to identify the schedule. Spaces are allowed.|yes|
|`summary`|Short description of the of the schedule.|no|
|`description`|A narrative for the schedule.|no|
|`start_from`|The base date from which the `messages[].offset` is added to determine when to send individual messages. You could specify any property on the report that contains a date value. The default is `reported_date`, which is when the report was submitted.|no|
|`start_mid_group`|Whether or not a schedule can start mid-group. If not present, the schedule will not start mid-group. In other terms, the default value is `false`|no|
|`messages`|Array of objects, each containing a message to send out and its properties.|yes|
|`messages[].translation_key`|The translation key of the message to send out. Available in 2.15+.|yes|
|`messages[].messages`| Array of message objects, each with `content` and `locale` properties. From 2.15 on use `translation_key` instead.|no|
|`messages[].group`|Integer identifier to group messages that belong together so that they can be cleared together as a group by future reports. For instance a series of messages announcing a visit, and following up for a missed visit could be grouped together and cleared by a single visit report. |yes|
|`messages[].offset`| Time interval from the `start_from` date for when the message should be sent. It is structured as a string with an integer value followed by a space and the time unit. For instance `8 weeks` or `2 days`. The units available are `seconds`, `minutes`, `hours`, `days`, `weeks`, `months`, `years`, and their singular forms as well. Note that although you can specify `seconds`, the accuracy of the sending time will be determined by delays in the processing the message on the server and on the gateway.|yes|
|`messages[].send_day`| String value of the day of the week on which the message should be sent. For instance, to send a message at the beginning of the week setting it to `"Monday"` will make sure the message goes out on the closest Monday _after_ the `start_date` + `offset`. |no|
|`messages[].send_time`| Time of day that the message should be sent in 24 hour format.|no|
|`messages[].recipient`| Recipient of the message. It can be set to `reporting_unit` (sender of the form), `clinic` (clinic that the sender of the form is attached to), `parent` (parent of the sender of the form), or a specific phone number.|no|

#### Registrations

Under the `registrations` key in app_settings, we can setup triggers for scheduled messages. A trigger for the schedule above can be defined as shown below:

```json

"registrations": [
  {
    "form": "PR",
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

|property|description|required|
|-------|---------|----------|
|`form`|Form ID that should trigger the schedule.|yes|
|`events`|An array of event object definitions of what should happen when this form is received.|yes|
|`event[].name`|Name of the event that has happened. The only supported event is `on_create` which happens when a form is received.|yes|
|`event[].trigger`|What should happen after the named event. `assign_schedule` will assign the schedule named in `params` to this report. Similarly `clear_schedule` will permanently clear all messages for a patient that are part of schedules listed in the `params` field. The full set of trigger configuration directives are described [here](https://github.com/medic/medic-docs/blob/master/configuration/transitions.md#triggers).|yes|
|`event[].params`|Any useful information for the event. In our case, it holds the name of the schedule to be triggered.|no|
|`event[].bool_expr`|A JavaScript expression that will be cast to boolean to qualify execution of the event. Leaving blank will default to always true. CouchDB document fields can be accessed using `doc.key.subkey`. Regular expressions can be tested using `pattern.test(value)` e.g. /^[0-9]+$/.test(doc.fields.last_menstrual_period). In our example above, we're making sure the form has an LMP date.|no|
|`validations`|A set of validations to perform on incoming reports. More information about validation rules can be found [here](app-settings-validations.md).|no|
|`validations.join_responses`|A boolean specifying whether validation messages should be combined into one message.|no|
|`validations.list[]`|An array of validation rules a report should pass to be considered valid.|no|
|`validations.list[].property`|Report field for which this validation rule will be applied.|no|
|`validations.list[].rule`|Validation condition to be applied to the property field. More information about rules can be found [here](app-settings-validations.md#rules).|no|
|`validations.list[].translation_key`|Translation key for the message reply to be sent if a report fails this rule.|no|
|`messages`|An array of automated responses to incoming reports.|no|
|`messages[].translation_key`|Translation key for the message text associated with this event.|no|
|`messages[].event_type`|An event that will trigger sending of this message. Typical values are: `report_accepted` when the report has been successfully validated and `registration_not_found` when the patient ID supplied in the report doesn't match any patient ID issued by Medic.|no|
|`messages[].recipient`|Who the message should be sent to. Use `reporting_unit` for the sender of the report, `clinic` for clinic contact, and `parent` for the parent contact.|no|

#### Patient Reports

Under the `patient_reports` key in app_settings, we can setup actions to take for other form submissions. A patient report can be defined as shown below:

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

|property|description|required|
|-------|---------|----------|
|`form`|Form ID of the patient form.|yes|
|`name`|Descriptive name of the form. This is not currently used in the app, but can be a helpful annotation.|no|
|`format`|Guide of how the form can be used. This is not currently used in the app, but can be a helpful annotation.|no|
|`silence_type`|A comma separated list of schedules to mute.|no|
|`silence_for`|Duration from when the report was submitted for which messages should be muted. It is structured as a string with an integer value followed by a space and the time unit. For instance `8 weeks` or `2 days`. The units available are `seconds`, `minutes`, `hours`, `days`, `weeks`, `months`, `years`, and their singular forms as well. When a message is muted all messages belonging to the same group will be muted, even if it falls outside of this time period. See `messages[].group` in _Schedules_ for related info.|no|
|`fields`|Descriptive list of form fields. This is not currently used in the app, but can be a helpful annotation.|no|
|`validations`|A set of validations to perform on incoming reports. More information about validation rules can be found [here](app-settings-validations.md).|no|
|`validations.join_responses`|A boolean specifying whether validation messages should be combined into one message.|no|
|`validations.list[]`|An array of validation rules a report should pass to be considered valid.|no|
|`validations.list[].property`|Report field for which this validation rule will be applied.|no|
|`validations.list[].rule`|Validation condition to be applied to the property field. More information about rules can be found [here](app-settings-validations.md#rules).|no|
|`validations.list[].translation_key`|Translation key for the message reply to be sent if a report fails this rule.|no|
|`messages`|An array of automated responses to incoming reports.|no|
|`messages[].translation_key`|Translation key for the message text associated with this event|no|
|`messages[].event_type`|An event that will trigger sending of this message. Typical values are: `report_accepted` when the report has been successfully validated, `registration_not_found` when the patient ID supplied in the report doesn't match any patient ID issued by Medic. `on_mute` and `on_unmute` are used in the context of muting as described [here](transitions.md#muting)|no|
|`messages[].recipient`|Who the message should be sent to. Use `reporting_unit` for the sender of the report, `clinic` for clinic contact, and `parent` for the parent contact.|no|

### Building workflows via interoperability 

Workflows can incorporate other digital tools, such as a facility-based electronic medical record system for referral workflows. These can be configured using the [outbound push]() feature, and data can be received as reports using the [CHT API]()
<!-- TODO: link to outbound push -->
