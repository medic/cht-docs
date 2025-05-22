---
title: RapidPro Messaging Gateway
linkTitle: "RapidPro"
weight: 20
description: >
    Integration for sending and receiving messages
aliases:
  -    /apps/guides/messaging/rapidpro
relatedContent: >
    building/reference/app-settings/sms
    building/forms/configuring/app-form-sms
    building/messaging/sms-states
    building/messaging/message-loops
    building/messaging/shortcodes
aliases:
   - /apps/guides/messaging/gateways/rapidpro
---


As of v3.11.0, messages can be sent and received using [RapidPro]({{% ref "building/integrations/rapidpro" %}}) as a messaging gateway.

## RapidPro configuration

### Store globals

Generate a long unique key to use as the `cht_api_key`.

Log in to your RapidPro dashboard, go to the globals page (`/global/`) and create two globals with the following data:

- name: `cht_url`, value: `https://<your-cht-instance-host>/api/v2/sms/rapidpro/incoming-messages`. For security the instance host **must not** include basic authentication. (NB: This endpoint was added in CHT 4.1.0. If integrating with an earlier version you will need to use the earlier version with a typo in the URL: `https://<your-cht-instance-host>/api/v1/sms/radpidpro/incoming-messages`)
- name: `cht_api_key`, value: `<cht_api_key>`

The names of these two global variables are arbitrary, but in this document we will keep referring to the names defined above.

Then visit the RapidPro workspace settings page (`/org/home/`) and check your RapidPro API token (we'll refer to this as the `rapidpro_api_key`).

### Create a new flow

In your RapidPro dashboard, visit the flows page (`/flow/`) and create a new flow. It only needs to contain a webhook, to relay the message to your CHT Core instance and handle possible errors.

{{< figure src="flow_overview.png" link="flow_overview.png" caption="flow_overview" >}}

Configure the new webhook:
- to `POST` to the `cht_url` you configured earlier:

{{< figure src="flow_webhook_host.png" link="flow_webhook_host.png" caption="flow_webhook_host" >}}

- set the authorization and content-type headers

{{< figure src="flow_webhook_headers.png" link="flow_webhook_headers.png" caption="flow_webhook_headers" >}}

- set the body to relay the message to CHT in the expected format:
```json
@(json(object(
  "id", run.uuid,
  "from", replace(urns.tel,"tel:+", "+"),
  "content", input.text
)))
```

{{< figure src="flow_webhook_body.png" link="flow_webhook_body.png" caption="flow_webhook_body" >}}

### Create a new trigger
Create a trigger (`/trigger/`) to start the new flow when a message is not handled elsewhere.

{{< figure src="trigger_select.png" link="trigger_select.png" caption="trigger_select" >}}

For more details about RapidPro configuration, consult the [RapidPro integration documentation]({{% ref "building/integrations/rapidpro" %}}).

## CHT Core configuration

### API keys

The RapidPro integration uses the CHT Credentials service to retrieve the API keys using the IDs `rapidpro:incoming` and `rapidpro:outgoing`. Use the [CHT credentials API](/building/reference/api#put-apiv1credentials) to securely store the credentials.  
`rapidpro:incoming` should contain the value of the long unique key generated earlier `<cht_api_key>` to verify incoming requests from RapidPro.  
`rapidpro:outgoing` should contain your RapidPro API token `<rapidpro_api_key>` to authenticate requests made against RapidPro's API.

### App settings

Update your app settings as follows.

```json
{
  "sms": {
    "outgoing_service": "rapidpro",
    "rapidpro": {
      "url": "<RapidPro instance url>"
    }
  }
}
```

> [!IMPORTANT]
> The RapidPro API endpoints are rate-limited, meaning that requests to send or check the status of messages beyond a certain number per hour will be blocked. The limit is currently 2500 actions per hour, and may change without notice. Check out the [RapidPro API reference](https://rapidpro.io/api/v2/#rate-limiting) for more details. If sending a message or retrieving a status update fails, it will be retried automatically again later.
> 
> When the outgoing message service is set to RapidPro or the host/account are changed, CHT Core will request state updates for all messages that aren't in one of the final states: `delivered`, `failed`, `denied`, or `cleared`. Each of these request counts towards your quota. Since the messages are unlikely to exist on the new RapidPro service, these requests will fail on every retry and consume your request quota. It is therefore important that all outgoing messages have a final state before switching RapidPro accounts or hosts. The status can be set to `failed` for messages that should not be resent without user intervention, or to `scheduled` for those that should be automatically sent with the new RapidPro account.

