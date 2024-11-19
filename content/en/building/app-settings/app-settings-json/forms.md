---
title: ".forms"
linkTitle: ".forms"
weight: 5
description: >
  **JSON Forms**: Instructions and schema for defining JSON forms used for handling reports from SMS and external tools
relevantLinks: >
  docs/building/concepts/workflows
  docs/building/features/interop
keywords: workflows interop json-forms
aliases:
   - /building/app-settings/app-settings-json/forms
   - /apps/reference/app-settings/forms
---

JSON forms are defined in either the `base_settings.json` or the `app_settings/forms.json` file and compiled in to the `app_settings.json` file with the `compile-app-settings` action in the `cht-conf` tool. JSON Forms are used for parsing reports from formatted SMS, SIM applications, and Medic Collect. JSON form definitions are also used for interoperability with third-party systems. Each form is defined as an JSON form object according to the following schema. The key for each object must be unique and all characters must be uppercase. 

## `app_settings.json .forms{}`

| property | type | description | required |
|---|---|---|---|
| `meta` | object | Information about the report. | yes |
| `meta.code` | string | The unique form identifier, which will be sent with all reports of this form. Must be the same as the form's key. | yes |
| `meta.icon` | string | Name of the icon resource shown in the app. | no |
| `meta.translation_key` | string | Name of the form shown in the app. | no |
| `meta.subject_key` | string | A translation key to display in the report list instead of the subject name (default). The translation is provided with a summary of the report which can be used for evaluation, eg: `Case registration {{case_id}}`. Useful properties available in the summary include: `from` (the phone number of the sender), `phone` (the phone number of the report contact), `form` (the form code), `subject.name` (the name of the subject), and `case_id` (the generated case id). Added in 3.9.0 | no |
| `fields`| object | Collection of field objects included in the form. | yes |
| `fields.${field}` | object | Field that is part of the form. | yes |
| `fields.${field}.type` | string | Data type of field:<br>  - `"integer"`: a whole number<br> - `"string"`: any collection of characters<br> - `"date"`: a date in the format `YYYY-mm-dd`, for example "2019-01-28"<br> - `"bsDate"`: a Bikram Sambat date in the form `YYYY-mm-dd`, for example "2078-02-32"<br> - `"bsYear"`: a Bikram Sambat year in the form `YYYY`, for example "2078"<br> - `"bsMonth"`: a Bikram Sambat month, for example "9"<br> - `"bsDay"`: a Bikram Sambat day, for example "8"<br> - `"boolean"`: true or false, represented by the digit `1` and `0` respectively (native JSON booleans are also supported if sending via JSON)<br> - `"custom"`: Only possible for JSON forms that are passed as actual JSON (not an SMS that gets parsed into JSON). Effectively any non-specific data structure, which will be taken without validation. | yes |
| `fields.${field}.labels` | object | | no |
| `fields.${field}.labels.short` | string, object with `translation_key` field, or translation object | Label shown for field in the app, seen when report is viewed in Reports tab. If missing, label will default to a translation key of `report.${form_name}.${field_name}` (eg `report.f.patient_id`) which can be translated in the app languages. | no |
| `fields.${field}.labels.tiny` | string | Unique identifier within the form for this field. Used in form submission to bind values to fields. Not required for all submission formats. | no |
| `fields.${field}.position` | integer | Zero based order of this field for incoming reports. | no |
| `fields.${field}.flags` | object | Additional instructions that could be used by form renderers. For instance `{ "input_digits_only": true }` indicated to SIM applications to show the number keyboard. Obsolete. | no |
| `fields.${field}.length` | array with two integers | Inclusive range accepted for length of the field. | no |
| `fields.${field}.required` | boolean | Determines if a report without this field is considered valid. | no |
| `public_form` | boolean | Determines if reports will be accepted from phone numbers not associated to a contact. Set to false if you want to reject reports from unknown senders. Default: true. | no |
| `facility_reference` | string | The form field whose value is to be used to match the incoming report to a contact's `rc_code`. Useful when reports are sent on behalf of a facility by unknown or various phone numbers. Requires the [`update_clinics` transition]({{% ref "building/app-settings/app-settings-json/transitions#available-transitions" %}}). | no |

## Code Sample

The following form has two fields, one for the patient ID, another for notes.

### `app_settings.json`
```json
"forms": {
  "F": {
    "meta": {
      "code": "F",
      "icon": "risk",
      "translation_key": "form.flag.title" // displayed in the webapp
    },
    "fields": {
      "patient_id": { // this is used for the property name when the report doc is created
        "labels": {
          "short": {
            "translation_key": "form.flag.patient_id.short"
          }, // displayed in the webapp
          "tiny": "pid" // used in form submission to bind values to fields - not required for all submission formats
        },
        "position": 0, // specifies where in the SMS this value should be
        "type": "string",
        "length": [
          5,
          13
        ],
        "required": true
      },
      "notes": {
        "labels": {
          "short": {
            "translation_key": "form.flag.notes.short"
          },
          "tiny": "form.flag.notes.tiny"
        },
        "position": 1,
        "type": "string",
        "length": [
          1,
          100
        ],
        "required": false
      }
    },
    "public_form": true
  }
}

```
