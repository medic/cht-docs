---
title: Versioning forms
linkTitle: Versioning
weight: 6
description: >
  Record the version of the form when creating reports
relatedContent: >
  building/features/reports
aliases:
   - /building/guides/forms/versioning
   - /apps/guides/forms/versioning
---

_Added in cht-core 3.15.0 and cht-conf 3.10.0_

When uploading app or contact xforms, cht-conf 3.10.0+ will automatically generate a version and include it in the form doc's
`xmlVersion` property. The version has two properties.

| Property | Description                                                                  |
|----------|------------------------------------------------------------------------------|
| `time`   | The time that the form was uploaded to the server in millis since the epoch. |
| `sha256` | A hash of the xform content.                                                 |

For example:

```json
  "xmlVersion": {
    "time": 1658717177750,
    "sha256": "6f0bbfe5a9a9ebeb25784165879afec5e311b197cbd76ade5698c83c22dd9a8f"
  }
```

When a user fills in a form with an `xmlVersion` property, the version is copied in to the report doc as the `form_version`
property. For example, the snippet above would generate a property like this:

```json
  "form_version": {
    "time": 1658717177750,
    "sha256": "6f0bbfe5a9a9ebeb25784165879afec5e311b197cbd76ade5698c83c22dd9a8f"
  }
```

This can be used to determine the version of the form that was used to submit the report. If you upload multiple
versions of a form over time you can use logic to have the CHT and integrated systems to enable backwards compatibility so
they behave the same regardless of which version of the form was used.

For example, if a property was modified between versions then the logic may look something like this:

```js
let patientName;
if (doc.form_version < 1658717177750) {
  patientName = doc.first_name + ' ' + doc.last_name;
} else {
  patientName = doc.name;
}
```
