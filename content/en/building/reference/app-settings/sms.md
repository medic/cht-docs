---
title: ".sms"
linkTitle: ".sms"
weight: 5
description: >
  **SMS Settings**: Instructions and schema for defining SMS settings
relevantLinks: >
  building/concepts/workflows
  building/guides/messaging
keywords: workflows sms
---

SMS settings are defined under the `sms` key, as an object supporting the following properties:
## `app_settings.json .sms`
| property         | default       | description                                                                                                                                                                              |
|------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| outgoing_service | medic-gateway | Defines the service to use to send SMS messages. Currently supports "medic-gateway", "africas-talking" or "rapidpro". For more information read the documentation on ["africas-talking" configuration]({{% ref "building/guides/messaging/gateways/africas-talking" %}}) and ["rapidpro" configuration]({{% ref "building/guides/messaging/gateways/rapidpro" %}}). |
| duplicate_limit  | 5             | The number of identical sms message allowed to be sent to the same recipient.

## Code sample

The definition takes the typical form below:

```json
"sms": {
  "outgoing_service": "medic-gateway",
  "duplicate_limit": "2"
}
```

#### Duplicate SMS messages handling

Every time a service (API or Sentinel) creates an SMS, we cache the recipient, and the message content, along with the current timestamp.
When more than `duplicate_limit` messages have been created for the same pair of recipient+content, within the cache time limit, we mark the new message with a "duplicate" status. Such messages are never sent.
The cache is cleared 30 minutes after the last SMS message for a specific pair was generated.
