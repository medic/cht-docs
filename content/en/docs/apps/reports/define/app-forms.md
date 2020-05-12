---
title: "Defining App Forms"
linkTitle: "App Forms"
weight: 1
date: 2017-01-05
description: >
  Instructions and schema for defining App forms
---

App forms are used for care guides within the web app, whether accessed in browser or via the Android app. App forms are defined by the following files:

- A XLSForm form definition, converted to the XForm (optional)
- A XML form definition using the ODK XForm format
- Meta information in the `{form_name}.properties.json` file (optional)
- Media files in the `{form_name}-media` directory (optional)

## XForm

The ODK XForm standard is supported. Data needed during the completion of the form (eg patient's name, prior information) is passed into the `inputs` group. Reports that have at least one of `place_id`, `patient_id`, and `patient_uuid` at the top level will be associated with that contact. Additionally, some custom XLSForm types and appearances are available.

## Additional XForm Widgets

Some XForm widgets have been added or modified for use in the app:
- **Bikram Sambat Datepicker**: Calendar widget using Bikram Sambat calendar. Used by default for appropriate languages.
- **Countdown Timer**: A visual timer widget that starts when tapped/clicked, and has an audible alert when done. To use it create a `string` field with an `appearance` set to `countdown-timer`. The duration of the timer is the field's value, which can be set in the XLSForm's `default` column. If this value is not set, the timer will be set to 60 seconds.
- **Contact Selector**: Select a contact, such as a person or place, and save their UUID in the report. To use create a field of type `db:{{contact_type}}` (eg `db:person`, `db:clinic`) with appearance `db-object`.
- **Rapid Diagnostic Test capture**: Take a picture of a Rapid Diagnotistic Test and save it with the report. Works with [rdt-capture Android application](https://github.com/medic/rdt-capture/). To use create a string field with appearance `mrdt-verify`.
- **Simprints registration**: Register a patient with the Simprints biometric tool. To include in a form create a `string` field with `appearance` of `simprints-reg`. Requires the Simprints app connected with hardware, or [mock app](https://github.com/medic/mocksimprints). Demo only, not ready for production since API key is hardcoded.

The code for these widgets can be found in the [Medic repo](https://github.com/medic/medic/tree/master/webapp/src/js/enketo/widgets).

## Additional XPath Functions

### `difference-in-months`

Calculates the number of whole calendar months between two dates. This is often used when determining a child's age for immunizations or assessments.

### `z-score`

In Enketo forms you have access to an XPath function to calculate the z-score value for a patient.


## App Form Properties

The meta information in the `{form_name}.properties.json` file defines the form's title and icon, as well as when and where the form should be available.

| property | description | required |
|---|---|---|
| `title`| The form's title seen in the app. Uses a localization array using the 2-letter code, not the translation keys discussed in the [Localization section](#localization). | yes |
| `icon` | Icon associated with the form. The value is the image's key in the `resources.json` file, as described in the [Icons section](#icons) | yes |
| `context` | The context defines when and where the form should be available in the app | no |
| `context.person` | Boolean determining if the form can be seen in the Action list for a person's profile. This is still subject to the `expression`. | no |
| `context.place` | Boolean determining if the form can be seen in the Action list for a person's profile. This is still subject to the `expression`. | no |
| `context.expression` | A JavaScript expression which is evaluated when a contact profile or the reports tab is viewed. If the expression evaluates to true, the form will be listed as an available action. The inputs `contact`, `user`, and `summary` are available. By default, forms are not shown on the reports tab, use `"expression": "!contact"` to show the form on the Reports tab since there is no contact for this scenario. | no |