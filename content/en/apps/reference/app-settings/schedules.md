---
title: ".schedules"
linkTitle: ".schedules"
weight: 5
description: >
  **SMS Schedules**: Defining SMS workflows with schedules, registration, and patient reports.
relatedContent: >
  apps/concepts/workflows
  apps/reference/sms-recipients
keywords: workflows
---

The `schedules` key contains an array of schedule objects, each representing the messages to send based on a registration.

## `app_settings.json .schedules[]`

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
|`messages[].recipient`| Recipient of the message. It can be set to `reporting_unit` (sender of the form), `clinic` (clinic that the sender of the form is attached to), `parent` (parent of the sender of the form), or a specific phone number. [See SMS Recipients]({{< relref "apps/reference/sms-recipients" >}})|no|

## Code Sample

This sample shows a schedule with a single message, which will be sent on Monday 9am 4 weeks after the LMP date on the report that triggers this schedule:

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
