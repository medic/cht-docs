---
title: "Building SMS Schedules"
linkTitle: SMS Schedules
weight: 6
description: >
  Building CHT application SMS schedules
relatedContent: >
  building/reference/app-settings/schedules
  building/cht-forms
  building/features/messaging
  building/guides/messaging

aliases:
   - /apps/tutorials/sms-schedules
---

SMS schedules allow you to send reminder messages at predetermined times. These reminders serve as useful prompts for end-users to take specific actions.

{{% pageinfo %}}
This tutorial takes you through how to set up SMS schedules for CHT applications. It uses a pregnancy registration workflow and follow-up reminders for a Community Health Worker as an example. The same methodology can be applied to other workflows and reminders as needed.
{{% /pageinfo %}}

## Brief Overview of Key Concepts

*[SMS schedules]({{< ref "building/reference/app-settings/schedules" >}})* are a series of SMS messages that are to be sent to specific contacts at future dates and times. They are defined in either the `base_settings.json` or the `app_settings/schedules.json` file and compiled into the *[app_settings.json]({{< ref "building/reference/app-settings" >}})* file with the `compile-app-settings` action in the `cht-conf` tool.

SMS schedules can be triggered by *[SMS forms]({{< ref "building/tutorials/sms-forms" >}})* or *[App forms]({{< ref "building/cht-forms/app" >}})*.

## Required Resources

You should have [built a pregnancy SMS form]({{< ref "building/tutorials/sms-forms#4-define-a-report-submission-form" >}}).

## Implementation Steps

SMS schedules are defined [using JSON]({{< ref "building/reference/app-settings/schedules#app_settingsjson-schedules" >}}) in the `app_settings.json` file.

### 1. Define a Pregnancy Follow Up Schedule

To set the pregnancy follow up schedule, edit the array corresponding to the `schedules` key in `app_settings.json`. Add an object within the array as shown. This will set a schedule of reminders that will be sent after a time interval (`offset`) relative to a base date (`start_from`).

```json
schedules: [
  {
    "name": "Pregnancy Follow Up Reminders",
    "summary": "",
    "description": "",
    "start_from": "fields.lmp_date",
    "messages": [
      {
        "message": [
          {
            "content": "Hello {{contact.name}}, please remind {{patient_name}} ({{patient_id}}) to go for her clinic visit this week.",
            "locale": "en"
          }
        ],
        "group": 1,
        "offset": "23 days",
        "send_day": "",
        "send_time": "09:00",
        "recipient": "reporting_unit"
      },
      {
        "message": [
          {
            "content": "Hello {{contact.name}}, please remind {{patient_name}} ({{patient_id}}) to go for her clinic visit this week.",
            "locale": "en"
          }
        ],
        "group": 2,
        "offset": "51 days",
        "send_day": "",
        "send_time": "09:00",
        "recipient": "reporting_unit"
      },
      {
        "message": [
          {
            "content": "Hello {{contact.name}}, please remind {{patient_name}} ({{patient_id}}) to go for her clinic visit this week.",
            "locale": "en"
          }
        ],
        "group": 3,
        "offset": "79 days",
        "send_day": "",
        "send_time": "09:00",
        "recipient": "reporting_unit"
      },
      {
        "message": [
          {
            "content": "Hello {{contact.name}}, please remind {{patient_name}} ({{patient_id}}) to go for her clinic visit this week.",
            "locale": "en"
          }
        ],
        "group": 4,
        "offset": "107 days",
        "send_day": "",
        "send_time": "09:00",
        "recipient": "reporting_unit"
      }
    ]
  }
]
```

{{< see-also page="building/reference/app-settings/schedules" title="Schedule properties" >}}

### 2. Assign the Schedule

In the `registrations` array where you have defined the pregnancy registration events, add an event to assign the `Pregnancy Follow Up Reminders` schedule. This will assign a new schedule for every pregnancy that is registered.

```json
{
  "name": "on_create",
  "trigger": "assign_schedule",
  "params": "Pregnancy Follow Up Reminders",
  "bool_expr": "doc.fields.lmp && /^[0-9]+$/.test(doc.fields.lmp)"
}
```

The final result should look like this:

```json
"registrations": [
  {
    "form": "P",
    "events": [
      {
        "name": "on_create",
        "trigger": "add_expected_date",
        "params": "lmp_date",
        "bool_expr": "doc.fields.lmp && /^[0-9]+$/.test(doc.fields.lmp)"
      },
      {
        "name": "on_create",
        "trigger": "assign_schedule",
        "params": "Pregnancy Follow Up Reminders",
        "bool_expr": "doc.fields.lmp && /^[0-9]+$/.test(doc.fields.lmp)"
      }
    ],
    "validations": {
      "join_responses": false,
      "list": [
        {
          "property": "patient_id",
          "rule": "regex('^[0-9]{5,13}$')",
          "translation_key": "messages.validation.patient_id"
        },
        {
          "property": "lmp",
          "rule": "lenMin(1) ? (integer && between(4,42)) : optional",
          "translation_key": "messages.p.validation.weeks_since_last_lmp"
        }
      ]
    },
    "messages": [
      {
        "event_type": "report_accepted",
        "translation_key": "messages.p.report_accepted",
        "recipient": "reporting_unit"
      },
      {
        "event_type": "registration_not_found",
        "translation_key": "messages.validation.woman_id",
        "recipient": "reporting_unit"
      }
    ]
  }
]
```

### 3. Upload App Settings

To upload app settings to your local instance, run the following command:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs upload-app-settings
```

{{% alert title="Note" %}} Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance. {{% /alert %}}

## Frequenty Asked Questions

- [Can you schedule SMS based on date field in report?](https://forum.communityhealthtoolkit.org/t/can-you-schedule-sms-based-on-date-field-in-report/87)
- [Can SMS schedules be cleared based on a field in a form?](https://forum.communityhealthtoolkit.org/t/can-sms-schedules-be-cleared-based-on-a-field-in-a-form/651)
