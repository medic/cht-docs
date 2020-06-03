---
title: "App Settings"
linkTitle: "App Settings"
weight: 5
description: >
  The primary location of settings for CHT applications
keywords: settings
---

Much of the configuration of the app is stored in the database in a document with id "settings". Most sections are described on their own in the [Reference Documentation](..).

## Optional Settings

The following settings do not need to be specified. They should only be defined when the default implementation needs to be changed.

### `app_settings.json`

| Setting              | Description | Default | Version |
|----------------------|---------|---------|---------|
| phone_validation     | <ul><li>"full": full validation of a phone number for a region using length and prefix information.</li><li>"partial": quickly guesses whether a number is a possible phone number by using only the length information, much faster than a full validation.</li><li>"none": allows almost any values but still fails for any phone that contains a-z chars.</li></ul> | "full" | 3.1.0   |
| uhc.contacts_default_sort | <ul><li>"alpha": Sort contacts alphanumerically</li><li>"last_visited_date": sort contacts by the date they were most recently visited.</li></ul> | "alpha" | 2.18.0 |
| uhc.visit_count.month_start_date | The date of each month when the visit count is reset to 0. | 1 |2.18.0 |
| uhc.visit_count.visit_count_goal | The monthly visit count goal. | 0 | 2.18.0 |
| outgoing_deny_list | All outgoing messages will be denied (unsent) if the recipient phone number starts with an entry in this list. A comma delimited list. (eg. `outgoing_deny_list="253,ORANGE"` will deny all messages sent to `253 543 4448` and `ORANGE NET`) | "" | |
| outgoing_deny_shorter_than | Deny all messages to recipient phone numbers which are shorter than this value. Intended to avoid [message loops](../troubleshooting/troubleshooting-quick-pointers.md#message-loops) with short codes used by gateways (eg. `60396`). An integer. | 6 | 3.3.0 |
| outgoing_deny_with_alphas | When `true`, deny all messages to recipient phone numbers containing letters (eg. `Safaricom`). Intended to avoid [message loops](../troubleshooting/troubleshooting-quick-pointers.md#message-loops) with non-numeric senders used by gateways. A boolean. | true | 3.3.0 |
| outgoing_deny_with_alphas | When `true`, deny all messages to recipient phone numbers containing letters (eg. `Safaricom`). Intended to avoid [message loops](../troubleshooting/troubleshooting-quick-pointers.md#message-loops) with non-numeric senders used by gateways. A boolean. | true | 3.3.0 |
| task_day_limit | The number of days before a task is due to show the due date. | 4 | 3.9.0 |

## Code Sample
For more details on what you can use in settings, check out the [superset of supported settings](https://github.com/medic/medic/blob/master/config/standard/app_settings.json).

## Build
{{% alert %}}
To include your settings into your app, you must compile them to include modular components, then upload them to your instance.

```sh
medic-conf --local compile-app-settings backup-app-settings upload-app-settings
```
{{% /alert %}}
