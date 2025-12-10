---
title: Nepal DoIT Centralized SMS gateway
linkTitle: "Nepal DoIT"
weight: 20
description: >
  Integration for sending SMS via Nepal DoIT Centralized SMS gateway
relatedContent: >
  building/reference/app-settings/sms
  building/forms/configuring/app-form-sms
  building/messaging/sms-states
  building/messaging/message-loops
  building/messaging/shortcodes
---


From CHT version 4.22.0, SMS messages can be sent using the [Nepal DoIT](https://sms.doit.gov.np) service.

## Nepal DoIT configuration

Log in to the [Nepal DoIT Gateway dashboard](https://sms.doit.gov.np) and get your "API Key" that you will use as the `nepal-doit-api-key`.

Next, save the `nepal-doit-api-key` in your CHT Core configuration as covered below.

## CHT Core configuration

### API keys

The integration uses the CHT Credentials service to retrieve the API key using the ID `nepal_doit_sms:outgoing`.

Use the [CHT credentials API](/building/reference/api/#put-apiv1credentials) to securely store the credentials by running the commands below. Be sure to replace a valid `user`, `pass` and `hostname` in the command:

```sh
curl -X PUT -H "Content-Type: text/plain" https://<user>:<pass>@<hostname>/api/v1/credentials/nepal_doit_sms:outgoing -d 'nepal-doit-api-key'`
```
### App settings

Update your app settings as follows.

```json
{
  "sms": {
    "outgoing_service": "nepal-doit-sms",
    "nepal_doit_sms": {
      "url": "https://sms.doit.gov.np/api/sms"
    }
  }
}
```

## Testing

Nepal DoIT SMS gateway does not provide a sandbox environment for testing. Once you get your API key, you can test your integration by sending a message to a valid phone number.