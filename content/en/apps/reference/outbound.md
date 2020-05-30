---
title: Outbound push [beta]
linkTitle: Outbound
weight: 5
description: >
  Exchanging data between CHT applications and other tools
relevantLinks: >
---

*Outbound is only available in Medic 3.5.0 and above*

Outbound push allows configurers to have the creation or editing of CouchDB documents trigger outbound REST requests using the data in that document. For example, upon receiving a referral report you could send that referral to an external facility system that will manage and process that event.

These triggers can apply to all document types (not just common types such as reports or contacts) and as such care should be taken to only send the documents you intend (see configuration of `relevant_to` below).

This feature is experimental, and may be replaced by some third party technology over time as we discover the feature-set we're looking for.

## Configuration

For outbound pushes to occur, you must [enable the `mark_for_outbound` transition in config](./transitions.md#Configurations):
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
      "mapping": {}
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

Here `password_key` is a key used to find the password in CouchDB's node-based configuration. See Credentials section below.

If you don't provide an authentication parameter then the request will be sent without authentication.

As of 3.9, the `header` type is also supported, which sends authentication credentials via a HTTP request header: `Authorization: '<value>'`. The value is set in the CouchDB configuration, and referred to by the `value_key`, similarly to the `password_key`. The value must match the credentials needed for the third party tool, and is generally formatted as `<type> <credentials>`. For instance, to send data to RapidPro, the value in the configuration would be set to the complete RapidPro API Token: eg `Token 123456789abcdef`. 

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

Each key is a string [object path](https://github.com/mariocasciaro/object-path#usage) to a location in the payload, and each value is either:
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

#### Other Notes
 - Your report will be hydrated before being passed to the mapper. This gives you access to the contact and its parents
 - object paths that may have undefined properties need to be dealt with differently depending on if you are using a `path` or an `expr`. Given `doc.foo.bar.smang` as a path where any of those properties may not exist in the doc:
  - If you're using `path` just use the path as is, if any part of the path is `undefined` the resulting value will safely be `undefined`
  - However, in `expr` you **do** need to handle this situation: `doc.foo && doc.foo.bar && doc.foo.bar.smang`
- If any of your `expr` expressions throw an exception (for example because you didn't handle potentially `undefined` properties as noted above) your push will fail
- If any of your `path` declarations result in an `undefined` value and you have not also declared that property optional your push will fail

## Credentials

To securely store credentials, we'll be using CouchDB's [config storage](https://docs.couchdb.org/en/stable/api/server/configuration.html), as this is a convenient location that only CouchDB administrators can access.

Passwords are stored under the `medic-credentials` section, under the key declared in config.

In the following example:

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

We have our key configured to `example.com`. This means that in CouchDB's admin config we would expect to find a password at `medic-credentials/example.com`.

To add the credential to the admin config you need to either [PUT the value using curl](https://docs.couchdb.org/en/stable/api/server/configuration.html#put--_node-node-name-_config-section-key) or similar:

```sh
curl -X PUT https://<user>:<pass>@<domain>/_node/couchdb@127.0.0.1/_config/medic-credentials/example.com -d '"the-real-password"'
```

_(Note that `couchdb@127.0.0.1` is the local node name, and may be different for you depending on your setup.)_

You can also add it via Fauxton:
 - Navigate to [the Config screen](http://localhost:5984/_utils/#/_config)
 - Click `Add Option`
 - The `Section` should be `medic-credentials`, the `Name` should be (in this example) `example.com` and the value should be the password
 - Click `Create`
 - You should then be able to see your credential in the list of configuration shown\

## Flow

Outbound pushes happen in two stages:
 - Sentinel picks up the report and runs transitions over it. Any outbound configuration that is relevant (via executing the `relevant_to` expression) will be added to a task queue
 - Every 5 minutes sentinel will check its task queue. For each outbound push that is queued, sentinel will perform the mapping and attempt to send the resulting payload (via POST) to the configured web address
   - If the push succeeds it will be taken out of the task queue
   - If the push fails (i.e. the response is not 2xx) it remains in the task queue, to be tried again in 5 minutes

## Inbound?

The outbound feature is used for sending data to an external service. If you are looking to **receive** data from an external service, take a look at [the records api](https://github.com/medic/medic/tree/master/api#post-apiv2records).
