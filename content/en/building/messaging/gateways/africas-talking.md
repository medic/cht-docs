---
title: Africa’s Talking SMS Aggregator
linkTitle: "Africa's Talking"
weight: 20
description: >
  Integration for sending and receiving SMS
aliases:
  - /apps/guides/messaging/africas-talking
  - /apps/guides/messaging/gateways/africas-talking/
relatedContent: >
  building/reference/app-settings/sms
  building/forms/configuring/app-form-sms
  building/messaging/sms-states
  building/messaging/message-loops
  building/messaging/shortcodes
---


As of v3.6.0, SMS messages can be sent and received using the [Africa's Talking](https://africastalking.com) service.

## Africa's Talking configuration

First, run `openssl rand -hex 32` in your terminal to generate a long unique key that you will use as the `cht-api-key`.

Log on to the [Africa's Talking Dashboard](https://account.africastalking.com/auth/login) and configure the two callback URLs as follows.

- Delivery Reports: `https://<hostname>/api/v1/sms/africastalking/delivery-reports?key=<cht-api-key>`
- Incoming Messages: `https://<hostname>/api/v1/sms/africastalking/incoming-messages?key=<cht-api-key>`

Next, in Africa's Talking dashboard, generate an "API Key" that you will use as the `at-api-key`. 

Next, save the `at-api-key` in your CHT Core configuration as covered below.

## CHT Core configuration

### API keys

The Africa's Talking integration uses the CHT Credentials service to retrieve the API keys using the IDs `africastalking.com:incoming` and `africastalking.com:outgoing`. 

Use the [CHT credentials API](/apps/reference/api#put-apiv1credentials) to securely store the credentials by running the commands below.

- `curl -X PUT -H "Content-Type: text/plain" https://<user>:<pass>@<hostname>/api/v1/credentials/africastalking.com:incoming -d 'cht-api-key'`

- `curl -X PUT -H "Content-Type: text/plain" https://<user>:<pass>@<hostname>/api/v1/credentials/africastalking.com:outgoing -d 'at-api-key'`

### App settings

Update your app settings as follows.

```json
{
  "sms": {
    "outgoing_service": "africas-talking",
    "reply_to": "<africa's talking shortcode>",
    "africas_talking": {
      "username": "<africa's talking username>"
    }
  }
}
```

## Testing

To test your integration, set your `username` to `sandbox`, log in to [Africa's Talking](https://account.africastalking.com), and go to the Sandbox app.
