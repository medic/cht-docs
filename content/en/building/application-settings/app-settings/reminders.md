---
title: ".reminders"
linkTitle: ".reminders"
weight: 5
description: >
  Configure SMS reminders to users
relevantLinks: >
---

Configure SMS reminders to notify primary contacts to submit reports for their places.

## `app_settings.js .reminders[]`

| Property | Type | Description | Required |
|---|---|---|---|
`form` | `string` | If a report with this ID is submitted for this place then the SMS will not be sent. | Yes
`translation_key` | `string` | The translation key to use to look up the SMS message content. | Yes
`message` | `array` or `string` | _Deprecated_. The SMS content. Use translation_key instead. | No
`text_expression` | `string` | The [later text expression](http://bunkat.github.io/later/parsers.html#text) to use to set the frequency of this reminder. | Yes (unless cron is defined)
`cron` | `string` | The [cron expression](https://en.wikipedia.org/wiki/Cron) to use to set the frequency of this reminder | Yes (unless text_expression is defined)
| 
`contact_types` | `array` | All contact type IDs that should receive the SMS. Defaults to the lowest level places. _Added in 3.10.0_ | No

## Code samples

### `app_settings.js`

```json
"reminders": [
  {
    "form": "stock",
    "translation_key": "sms.reminder.stock",
    "text_expression": "on the first day of the week",
    "contact_types": [ "health_center", "hospital" ]
  }
],
```
