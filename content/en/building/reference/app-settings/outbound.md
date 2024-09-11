---
title: ".outbound"
linkTitle: ".outbound"
weight: 5
description: >
  **Outbound Push**: Exchanging data between CHT applications and other tools
relevantLinks: >
aliases:
   - /apps/reference/app-settings/outbound
----

*Outbound is only available in CHT Core 3.5.0 and above*

Outbound push allows configurers to have the creation or editing of CouchDB documents trigger outbound REST requests using the data in that document. For example, upon receiving a referral report you could send that referral to an external facility system that will manage and process that event.

These triggers can apply to all document types (not just common types such as reports or contacts) and as such care should be taken to only send the documents you intend (see configuration of `relevant_to` below).

## Configuration

For outbound pushes to occur, you must [enable the `mark_for_outbound` transition in config]({{% ref "building/reference/app-settings/transitions#available-transitions" %}}):
```json
{
  "transitions": {
    "mark_for_outbound": true
  }
}
```

The rest of the configuration is against the `outbound` configuration property, which allows you to configure as many outbound pushes as you like, keyed off a unique name:

```json
{
  "outbound": {
    "first config": {
      "relevant_to": "...",
      "destination": {},
      "mapping": {},
      "cron": "..."
    },
    "second config": { }
  }
}
```

Each outbound push configuration contains the following properties: `relevant_to`, `destination` and `mapping`.

### relevant_to

An "expression" (some JS code that resolves to a truthy or falsy value) that determines whether this configuration is relevant to a document. The document is passed to the expression as `doc`, and if relevant is fully hydrated before being passed (i.e. the attached contact, its parents etc are fully attached instead of just being stubs).

Example: you want to send a referral to a facility's EMR system when a CHW refers a patient:

```json
{
  "relevant_to": "doc.type === 'data_record' && doc.form === 'referral'"
}
```

**Note:** all documents that Sentinel processes can be picked up by your configuration, so it's important to correctly configure `relevant_to`. Checking the document type as shown above is probably a good start.

### destination

A complex property that defines the details of the connection to the external service. It currently supports several authentication types: basic authentication, HTTP authorization request header, and a custom authentication mode for Muso SIH.

Basic auth example:

```json
{
  "destination": {
    "base_url": "https://example.com",
    "auth": {
      "type": "basic",
      "username": "admin",
      "password_key": "example.com"
    },
    "path": "/api/v1/referral"
  }
}
```

Here `password_key` is a key used to find the password in CHT credentials. For more information about how to store credentials, refer to the [API documentation](/building/reference/api#put-apiv1credentials).

If you don't provide an authentication parameter then the request will be sent without authentication.

As of 3.9, the `header` type is also supported, which sends authentication credentials via a HTTP request header: `Authorization: '<value>'`. The value is set in CHT credentials configuration, and referred to by the `value_key`, similarly to the `password_key`. The value must match the credentials needed for the third party tool, and is generally formatted as `<type> <credentials>`. For instance, to send data to RapidPro, the value in the configuration would be set to the complete RapidPro API Token: eg `Token 123456789abcdef`.

Header auth example:
```json
{
  "destination": {
    "base_url": "https://example.com",
    "auth": {
      "type": "header",
      "name": "Authorization",
      "value_key": "example.com"
    },
    "path": "/api/v1/referral"
  }
}
```

### mapping

A complex property that declares how the payload to be sent to the `destination` should be created.

Each key is a string [object path](https://github.com/mariocasciaro/object-path#user-content-usage) to a location in the payload, and each value is either:
 - a string object path to the location of the source data in the report being processed, where the value is required to exist
 - an object with either a `path` property that represents a string object path as above, or an `expr` property which is an expression similar to `relevant_to` to determine the resulting value. If you wish for the value to be optional (that is to say it's OK if `path` or `expr` evaluate to `undefined`) you may also set `optional` to `true`

#### A mapping example

Given the following example (incomplete) report:
```json
{
  "id": "abc-1234",
  "type": "data_record",
  "form": "referral",
  "reported_date": 1555069530966,
  "fields": {
    "patient_id": "12345",
    "patient_temp_deg_F": 100,
    "danger_signs": ["V", "BL", "D", "IG"]
  },
  "contact": {
    "_id": "def-5678",
    "name": "Jane CHW",
    "parent": {
      "_id": "hij-9012",
      "name": "..."
    }
  }
}
```

The following mapping configuration:
```json
{
  "mapping": {
    "patient_id": "doc.fields.patient_id",
    "chw_id": "doc.contact._id",
    "event.temp_c": {
      "expr": "((doc.fields.patient_temp_deg_F - 32) * (5.0/9.0)).toFixed(2)"
    },
    "event.in_danger": {
      "expr": "doc.fields.danger_signs.length >= 3 ? true : undefined",
      "optional": true
    },
    "event.additional_notes": {
      "path": "doc.fields.notes",
      "optional": true
    }
  }
}
```

Would create the following JSON payload to send:
```json
{
  "patient_id": "12345",
  "chw_id": "def-5678",
  "event": {
    "temp_c": 37.78,
    "in_danger": true
  }
}
```

This example makes a few points:
 - The report that is being used to generate the outbound push is referenced as `doc` in both `path` and `expr` properties
 - To define a property that is itself an object, you can make the mapping key a JSON path.
 - If you define a property as `optional`, it won't exist at all in the payload if the resulting value is `undefined`, either because that is the result of executing the `expr`, or the `path` doesn't exist. Note that if the `event.in_danger` expression was instead `doc.fields.danger_signs.length >= 3` the property `in_danger` would always exist and would either be `true` or `false`

### cron
An optional cron expression for setting the cron rule in the outbound object.
A cron expression is a string consisting of five fields that describe individual details of the schedule:

`<minute> <hour> <day-of-month> <month> <day-of-week>`

The transition verifies if a cron field exists in the configuration. If a cron field is present, it checks if the document is due for push. If it is due, the new document is pushed. If it is not yet due for push, the document is added to the outbound queue. If the cron field isn’t present, then it goes ahead with the previous flow.

Example: you want the system to send outbound pushes based on a cron schedule every day at 1:05.

```json
{
  "cron": "5 1 * * *"
}
```

**Note:** Schedule Outbound is only available in CHT Core 4.5.0 and above.

#### Other Notes

 - Your report will be hydrated before being passed to the mapper. This gives you access to the contact and its parents
 - object paths that may have undefined properties need to be dealt with differently depending on if you are using a `path` or an `expr`. Given `doc.foo.bar.smang` as a path where any of those properties may not exist in the doc:
  - If you're using `path` just use the path as is, if any part of the path is `undefined` the resulting value will safely be `undefined`
  - However, in `expr` you **do** need to handle this situation: `doc.foo && doc.foo.bar && doc.foo.bar.smang`
- If any of your `expr` expressions throw an exception (for example because you didn't handle potentially `undefined` properties as noted above) your push will fail
- If any of your `path` declarations result in an `undefined` value and you have not also declared that property optional your push will fail

#### Troubleshooting

By default, Sentinel will log a message each time an outbound request is sent indicating if the request was successful or not. If you are having trouble getting your outbound requests to work, you can [enable debug logging]({{< relref "hosting/4.x/logs#setting-log-level" >}}) to get more information about the exact contents of the request/response.

## How Outbound messages are sent

Send semantics have changed over the course of developing this feature, and are important to understand for your deployment to be successful.

### In 3.10 and above

 - Outbound messages are sent immediately
 - If there is an error in sending it will be added to a send queue to be retried every 5 minutes.
   - If you update your outbound configuration while messages are present in the send queue, only the messages that match with _the new configuration_ will be retried.
 - When it does finally send it will include any new changes to the document that have occurred in that time.
 - **Documents can be sent again**, as long as the resulting payload (as defined in the configuration's `mapping` property) is different from the most recent outbound push performed for this document and configuration.

It's important to understand that if your `mapping` configuration produces a different result every time it's run you may experience Outbound sending the "same" data many more times than you'd expect.

For example, if you want a timestamp in your payload you could configure it like this:

```json
{
  "timestamp": {"expr": "new Date()"}
}
```

Outbound may send your request multiple times even if the user just hit save once. If this is a problem for your deployment, consider using values on the document itself that will not change every time your mapping is executed:

```json
{
  "timestamp": "doc.timestamp"
}
```

### In 3.9

 - Outbound messages are sent immediately
 - If there is an error in sending it will be added to a send queue to be retried every 5 minutes.
 - When it does finally send it will include any new changes to the document that have occurred in that time.
 - **Documents are only ever sent once for configuration**

### In 3.4-3.8

 - Outbound messages are added to a send queue that is executed once every 5 minutes or so.
 - If there is an error in sending it will be kept in the queue to be retried in another 5 minutes.
 - When it does finally send it will include any new changes to the document that have occurred in that time.
 - Once the document has successfully sent if the document is changed again it will be sent again, using the same rules as above.

## Inbound?

The outbound feature is used for sending data to an external service. If you are looking to **receive** data from an external service, take a look at [the records api]({{< relref "building/reference/api#records" >}}).
