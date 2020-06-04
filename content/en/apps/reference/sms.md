---
title: "SMS settings"
linkTitle: "SMS settings"
weight: 5
description: >
  Instructions and schema for defining SMS settings
relevantLinks: >
  docs/apps/concepts/workflows
  docs/design/apps
  docs/apps/guides/africas-talking
keywords: workflows sms
---

SMS settings are defined under the `sms` key, as an object supporting the following properties:
## `app_settings.json .sms`
| property         | default       | description                                                                                                                                                                              |
|------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| outgoing_service | medic-gateway | Defines the service to use to send SMS messages. Currently supports "medic-gateway" and "africas-talking". Read more about "africas-talking" configuration [here](../../guides/africas-talking). |
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
