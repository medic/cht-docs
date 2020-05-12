---
title: "Defining JSON Forms"
linkTitle: "JSON Forms"
weight: 2
date: 2017-01-05
description: >
  Instructions and schema for defining JSON forms
---

JSON Forms are used for parsing reports from formatted SMS, SIM applications, and Medic Collect. JSON form definitions are also used for interoperability with third-party systems. Each form is defined as an JSON form object according to the following schema. 

| property | type | description | required |
|---|---|---|---|
| `meta` | object | Information about the report. | yes |
| `meta.code` | string | The unique form identifier, which will be sent with all reports of this form. Must be the same as the form's key. | yes |
| `meta.icon` | string | Name of the icon resource shown in the app. | no |
| `meta.translation_key` | string | Name of the form shown in the app. | no |
| `fields`| object | Collection of field objects included in the form. | yes |
| `fields.${field}` | object | Field that is part of the form. | yes |
| `fields.${field}.type` | string | Data type of field:<br>  - `"integer"`: a whole number<br> - `"string"`: any collection of characters<br> - `"date"`: a date in the format `YYYY-mm-dd`, for example "2019-01-28"<br> - `"boolean"`: true or false, represented by the digit `1` and `0` respectively (native JSON booleans are also supported if sending via JSON)<br> - `"custom"`: Only possible for JSON forms that are passed as actual JSON (not an SMS that gets parsed into JSON). Effectively any non-specific data structure, which will be taken without validation. | yes |
| `fields.${field}.labels` | object | | no |
| `fields.${field}.labels.short` | string, object with `translation_key` field, or translation object | Label shown for field in the app, seen when report is viewed in Reports tab. If missing, label will default to a translation key of `report.${form_name}.${field_name}` (eg `report.f.patient_id`) which can be translated in the app languages. | no |
| `fields.${field}.labels.tiny` | string | Unique identifier within the form for this field. Used in form submission to bind values to fields. Not required for all submission formats. | no |
| `fields.${field}.position` | integer | Zero based order of this field for incoming reports. | no |
| `fields.${field}.flags` | object | Additional instructions that could be used by form renderers. For instance `{ "input_digits_only": true }` indicated to SIM applications to show the number keyboard. Obsolete. | no |
| `fields.${field}.length` | array with two integers | Inclusive range accepted for length of the field. | no |
| `fields.${field}.required` | boolean | Determines if a report without this field is considered valid. | no |
| `public_form` | boolean | Determines if reports will be accepted from phone numbers not associated to a contact. Set to false if you want to reject reports from unknown senders. Default: true. | no |
| `facility_reference` | string | The form field whose value is to be used to match the incoming report to a contact's `rc_code`. Useful when reports are sent on behalf of a facility by unknown or various phone numbers. Requires the [`update_clinics` transition](transitions.md#available-transitions). | no |
