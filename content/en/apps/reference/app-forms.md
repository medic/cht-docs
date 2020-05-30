---
title: "Defining App Forms"
linkTitle: "App Forms"
weight: 5
description: >
  Instructions and schema for defining App forms
relevantLinks: >
  docs/apps/concepts/workflows
  docs/design/apps
keywords: workflows app-forms
---

App forms are used for care guides within the web app, whether accessed in browser or via the Android app. App forms are defined by the following files:

- A XML form definition using a CHT-enhanced ODK XForm format
- A XLSForm form definition, easier to write and converts to the XForm (optional)
- Meta information in the `{form_name}.properties.json` file (optional)
- Media files in the `{form_name}-media` directory (optional)

## XForm

A CHT-enhanced version of the ODK XForm standard is supported.

Data needed during the completion of the form (eg patient's name, prior information) is passed into the `inputs` group. Reports that have at least one of `place_id`, `patient_id`, and `patient_uuid` at the top level will be associated with that contact. 

{{% see-also page="apps/reference/contact-forms" anchor="care-guides" title="Passing contact data to care guides" %}}

A typical form ends with a summary group (eg `group_summary`, or `group_review`) where important information is shown to the user before they submit the form.

In between the `inputs` and the closing group is the form flow - a collection of questions that can be grouped into pages. All data fields submitted with a form are stored, but often important information that will need to be accessed from the form is brought to the top level. To make sure forms are properly associated to a contact, make sure at least one of `place_id`, `patient_id`, and `patient_uuid` is stored at the top level of the form.

{{% see-also page="design/apps" anchor="content-and-layout" title="Content and Layout" %}}

## XLSForm

Since writing raw XML can be tedious, we suggest creating the forms using the [XLSForm standard](http://xlsform.org/), and using the [medic-conf](https://github.com/medic/medic-conf) command line configurer tool to [convert them to XForm format](#build).

| type | name | label | relevant | appearance | calculate | ... |
|---|---|---|---|---|---|---|
| begin group | inputs | Inputs | ./source = 'user' | field-list |
| hidden | source |
| hidden | source_id |
| begin group | contact |
| db:person | _id | Patient ID |  | db-object |
| string | patient_id | Medic ID |  | hidden |
| string | name | Patient Name |  | hidden |
| end group
| end group
| calculate | _id | | | | ../inputs/contact/_id |
| calculate | patient_id | | | | ../inputs/contact/patient_id |
| calculate | name | | | | ../inputs/contact/name |
| ...
| begin group | group_summary | Summary |  | field-list summary |
| note | r_patient_info | \*\*${patient_name}\*\* ID: ${r_patient_id} |
| note | r_followup | Follow Up \<i class="fa fa-flag"\>\</i\> |
| note | r_followup_note | ${r_followup_instructions} |
| end group |

## CHT XForm Widgets

Some XForm widgets have been added or modified for use in the app:
- **Bikram Sambat Datepicker**: Calendar widget using Bikram Sambat calendar. Used by default for appropriate languages.
- **Countdown Timer**: A visual timer widget that starts when tapped/clicked, and has an audible alert when done. To use it create a `string` field with an `appearance` set to `countdown-timer`. The duration of the timer is the field's value, which can be set in the XLSForm's `default` column. If this value is not set, the timer will be set to 60 seconds.
- **Contact Selector**: Select a contact, such as a person or place, and save their UUID in the report. To use create a field of type `db:{{contact_type}}` (eg `db:person`, `db:clinic`) with appearance `db-object`.
- **Rapid Diagnostic Test capture**: Take a picture of a Rapid Diagnotistic Test and save it with the report. Works with [rdt-capture Android application](https://github.com/medic/rdt-capture/). To use create a string field with appearance `mrdt-verify`.
- **Simprints registration**: Register a patient with the Simprints biometric tool. To include in a form create a `string` field with `appearance` of `simprints-reg`. Requires the Simprints app connected with hardware, or [mock app](https://github.com/medic/mocksimprints). Demo only, not ready for production since API key is hardcoded.

The code for these widgets can be found in the [Medic repo](https://github.com/medic/medic/tree/master/webapp/src/js/enketo/widgets).

## CHT XPath Functions

### `difference-in-months`

Calculates the number of whole calendar months between two dates. This is often used when determining a child's age for immunizations or assessments.

### `z-score`

In Enketo forms you have access to an XPath function to calculate the z-score value for a patient.

## Properties

The meta information in the `{form_name}.properties.json` file defines the form's title and icon, as well as when and where the form should be available.

### `forms/app/{form_name}.properties.json`

| property | description | required |
|---|---|---|
| `title`| The form's title seen in the app. Uses a localization array using the 2-letter code, not the translation keys discussed in the [Localization section](#localization). | yes |
| `icon` | Icon associated with the form. The value is the image's key in the `resources.json` file, as described in the [Icons section](#icons) | yes |
| `context` | The context defines when and where the form should be available in the app | no |
| `context.person` | Boolean determining if the form can be seen in the Action list for a person's profile. This is still subject to the `expression`. | no |
| `context.place` | Boolean determining if the form can be seen in the Action list for a person's profile. This is still subject to the `expression`. | no |
| `context.expression` | A JavaScript expression which is evaluated when a contact profile or the reports tab is viewed. If the expression evaluates to true, the form will be listed as an available action. The inputs `contact`, `user`, and `summary` are available. By default, forms are not shown on the reports tab, use `"expression": "!contact"` to show the form on the Reports tab since there is no contact for this scenario. | no |

### Code sample

In this sample properties file, the associated form would only show on a person's page, and only if their sex is unspecified or female and they are between 10 and 65 years old:

#### `forms/app/pregnancy.properties.json`
```json
  {
    "title": [
      {
        "locale": "en",
        "content": "New Pregnancy"
      },
      {
        "locale": "hi",
        "content": "नई गर्भावस्था"
      }
    ],
    "icon": "pregnancy-1",
    "context": {
      "person": true,
      "place": false,
      "expression": "contact.type === 'person' && (!contact.sex || contact.sex === 'female') && (!contact.date_of_birth || (ageInYears(contact) >= 10 && ageInYears(contact) < 65))"
    }
  }
```

## Build
    
Convert and build the app forms into your application using the `convert-app-forms` and `upload-app-forms` actions in `medic-conf`.

    medic-conf --local convert-app-forms upload-app-forms
