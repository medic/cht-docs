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

### SMS

Configures outgoing SMS settings.

| Property         | Default value | Description                                                                                                                                                                              |
|------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| outgoing_service | medic-gateway | Defines the service to use to send SMS messages. Currently supports "medic-gateway" and "africas-talking". Read more about "africas-talking" configuration [here](./africas-talking.md). |
| duplicate_limit  | 5             | The number of identical sms message allowed to be sent to the same recipient.

#### Duplicate SMS messages handling

Every time a service (API or Sentinel) creates an SMS, we cache the recipient, and the message content, along with the current timestamp.
When more than `duplicate_limit` messages have been created for the same pair of recipient+content, within the cache time limit, we mark the new message with a "duplicate" status. Such messages are never sent.
The cache is cleared 30 minutes after the last SMS message for a specific pair was generated.
