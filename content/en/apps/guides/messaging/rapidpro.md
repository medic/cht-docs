---
title: RapidPro Messaging Gateway
linkTitle: "RapidPro"
weight:
description: >
    Integration for sending and receiving messages
relatedContent: >
    apps/reference/app-settings/sms
    apps/guides/forms/app-form-sms
    apps/guides/messaging/sms-states
    apps/guides/messaging/message-loops
    apps/guides/messaging/shortcodes
---


As of v3.11.0, messages can be sent and received using [RapidPro]({{% ref "apps/features/integrations/rapidpro" %}}) as an messaging gateway. 

## RapidPro configuration

### Store globals

Generate a long unique key to use as the `cht_api_key`.

Log in to your RapidPro dashboard, go to the globals page (`/global/`) and create two globals with the following data:

- name: `cht_url`, value: `https://<your-cht-instance-host>/api/v1/sms/radpidpro/incoming-messages`. For security the instance host **must not** include basic authentication.
- name: `cht_api_key`, value: `<cht_api_key>`

The names of these two global variables are arbitrary, but in this document we will keep referring to the names defined above. 

Then visit the RapidPro workspace settings page (`/org/home/`) and check your RapidPro API token (we'll refer to this as the `rapidpro_api_key`).

### Create a new flow

In your RapidPro dashboard, visit the flows page (`/flow/`) and create a new flow. It only needs to contain a webhook, to relay the message to your CHT Core instance and handle possible errors. 

![flow_overview](flow_overview.png)

Configure the new webhook:
- to `POST` to the `cht_url` you configured earlier: 

![flow_webhook_host](flow_webhook_host.png)

- set the authorization and content-type headers

![flow_webhook_headers](flow_webhook_headers.png)

- set the body to relay the message to CHT in the expected format: 
```json
@(json(object(
  "id", run.uuid,
  "from", replace(urns.tel,"tel:+", "+"),
  "content", input.text
)))
```

![flow_webhook_body](flow_webhook_body.png)


### Create a new trigger
Create a trigger (`/trigger/`) to start the new flow when a message is not handled elsewhere. 

![trigger_select](trigger_select.png)

For more details about RapidPro configuration, please consult the [RapidPro integration documentation]({{% ref "apps/guides/integrations/rapidpro" %}}). 

## CHT Core configuration

### API keys

The API keys should be treated as securely as a password as anyone with access to them will be able to send messages using your account. Therefore, we store them in the CouchDB configuration.

To add the credentials to the admin config you need to either [PUT the value using curl](https://docs.couchdb.org/en/stable/api/server/configuration.html#put--_node-node-name-_config-section-key) or similar:

```sh
curl -X PUT https://<user>:<pass>@<domain>/_node/couchdb@127.0.0.1/_config/medic-credentials/rapidpro:incoming -d '"<cht_api_key>"'
curl -X PUT https://<user>:<pass>@<domain>/_node/couchdb@127.0.0.1/_config/medic-credentials/rapidpro:outgoing -d '"<rapidpro_api_key>"'
```

{{% alert title="Note" %}}
`couchdb@127.0.0.1` is the local node name, and may be different for you depending on your setup.
{{% /alert %}}

You can also add it via Fauxton:
- Navigate to [the Config screen](http://localhost:5984/_utils/#/_config)
- Click `Add Option`
- The `Section` should be `medic-credentials`, the `Name` should be `rapidpro:incoming` or `rapidpro:outgoing`, and the value should be the relevant API key.
- Click `Create`
- You should then be able to see your credential in the list of configuration shown

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

{{% alert title="Rate limiting" %}}
The RapidPro API endpoints, which this integration relies on, are rate-limited. The number of messages that can be sent and the number of status updates that can be requested is limited. Check [RapidPro API reference](https://rapidpro.io/api/v2/) for more details.

If an action (sending a message or retrieving a status update) fails, it will be retried again later.
{{% /alert %}}

{{% alert title="Caveat when switching outgoing message services" %}}
When switching from another outgoing message service to RapidPro, or switching between RapidPro accounts or hosts, make sure that all of the outgoing messages on your instance, that have been relayed through the previous service, are in a final state ("delivered", "failed", "denied", "cleared"). CHT Core will request state updates for non-final messages from RapidPro, which will fail on every retry and consume your request quota.
{{% /alert %}}
