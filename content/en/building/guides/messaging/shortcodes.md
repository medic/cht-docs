---
title: "Short Contact Identifiers"
linkTitle: "Contact IDs"
weight: 30
description: >
 Using unique short codes to identify places and people via messaging
relatedContent: >
  building/reference/app-settings/sms
  building/guides/messaging/sms-states
aliases:
   - /apps/guides/messaging/shortcodes
---

Short unique identifiers for contacts are often used to identify contacts in messaging workflows. Unique short codes  are generated on `doc.patient_id` against any document of a `person` `type`, and on every `doc.place_id` against any document of a `place` `type`. By default, these IDs start at 5 numeric digits long, and will increase in length as deemed necessary by the generation algorithm.

If the length is increased, this increase is stored in a CouchDB documented called `shortcode-id-length`:

```json
{
    "_id": "shortcode-id-length",
    "current_length": 6
}
```

## Configuring a minimum length

If you wish to change the minimum length of the generated identifiers, create or edit the `shortcode-id-length` document in CouchDB. For example, if you wish for the minimum length to be 7:

```json
{
    "_id": "shortcode-id-length",
    "current_length": 7
}
```

If this file already exists be sure to include the existing `_rev` property.

{{% alert title="Note" %}}
If you are changing this document and want to make it relevant straight away, **you must restart Sentinel.** Otherwise there may be a collection of cached already accepted IDs of the previous length that Sentinel will work through first. 
{{% /alert %}}


## Configuring a maximum length, locking down an exact length etc

It is not possible to either alter the maximum length of IDs, to stop it automatically increasing, or to tweak when it decides to automatically increase. IDs automatically increasing in length when required is important to the continual correct functioning of Sentinel.

## Valid sizes

The shortcode identifiers can be between 5 and 13 digits long. Due to the last digit being a checksum digit, there are at most 10,000 5 digit ids, and at most 1,000,000,000,000 13 digit IDs.
