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

{{% show-reference workflows-sms %}}

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

{{% show-reference workflows-registrations %}}

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

{{% show-reference workflows-patient-reports %}}

### Building workflows via interoperability 

Workflows can incorporate other digital tools, such as a facility-based electronic medical record system for referral workflows. These can be configured using the [outbound push]() feature, and data can be received as reports using the [CHT API]()
<!-- TODO: link to outbound push -->
