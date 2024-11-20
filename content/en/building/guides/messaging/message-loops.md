---
title: "Message Loops"
linkTitle: "Message Loops"
weight: 90
description: >
  How to avoid messaging loops
relatedContent: >
  building/forms/configuring/app-form-sms
  building/guides/messaging/sms-states
  building/guides/messaging/shortcodes
aliases:
   - /apps/guides/messaging/message-loops
---
Endless messaging loops can between the webapp and a mobile number via the gateway due to autoreplies from the webapp.

See the [Github Issue](https://github.com/medic/cht-core/issues/750).

**Solution:** Add the offending number(e.g `800` or `SAFARICOM`) to the `Outgoing Deny List` in the webapp's `app_settings` configuration file.

```
  "multipart_sms_limit": 10,
  "outgoing_deny_list": "800, SAFARICOM",
  "contact_summary": ""

```
