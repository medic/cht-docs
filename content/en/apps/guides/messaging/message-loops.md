---
title: "Message Loops"
linkTitle: "Message Loops"
weight: 
description: >
  How to avoid messaging loops
relatedContent: >
  apps/guides/forms/app-form-sms
  apps/guides/messaging/sms-states
  apps/guides/messaging/shortcodes
---
Endless messaging loops can between the webapp and a mobile number via the gateway due to autoreplies from the webapp.

See the [Github Issue](https://github.com/medic/medic/issues/750).

**Solution:** Add the offending number(e.g `800` or `SAFARICOM`) to the `Outgoing Deny List` in the webapp's `app_settings` configuration file.

```
  "multipart_sms_limit": 10,
  "outgoing_deny_list": "800, SAFARICOM",
  "contact_summary": ""

```
