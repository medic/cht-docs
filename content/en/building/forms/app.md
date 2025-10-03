---
title: "app"
linkTitle: "app"
weight: 1
description: >
  **App Forms**: Used to complete reports, tasks, and actions in the app
relatedContent: >
  building/forms/configuring/form-inputs
aliases:
   - /building/reference/forms/app
   - /apps/reference/forms/app
---

App forms are used for care guides within the web app, whether accessed in browser or via the Android app. When a user completes an app form, the contents are saved in the database with the type `data_record`. These docs are known in the app as [Reports]( {{< ref "building/reports" >}}).

App forms are defined by the following files:

- A XML form definition using a CHT-enhanced ODK XForm format
- A XLSForm form definition, easier to write and converts to the XForm (optional)
- Meta information in the `{form_name}.properties.json` file (optional)
- Media files in the `{form_name}-media` directory (optional). How to [include multimedia files]( {{< ref "building/forms/configuring/multimedia" >}}).

## XForm

A CHT-enhanced version of the ODK XForm standard is supported.

Data needed during the completion of the form (eg patient's name, prior information) is passed into the `inputs` group. Reports that have at least one of `place_id`, `patient_id`, and `patient_uuid` at the top level will be associated with that contact.

{{< see-also page="building/contact-summary/contact-summary-templated" anchor="care-guides" title="Passing contact data to care guides" >}}

A typical form ends with a summary group (eg `group_summary`, or `group_review`) where important information is shown to the user before they submit the form.

In between the `inputs` and the closing group is the form flow - a collection of questions that can be grouped into pages. All data fields submitted with a form are stored, but often important information that will need to be accessed from the form is brought to the top level. To make sure forms are properly associated to a contact, make sure at least one of `place_id`, `patient_id`, and `patient_uuid` is stored at the top level of the form.

{{< see-also page="design/best-practices" anchor="content-and-layout" title="Content and Layout" >}}

## XLSForm

Since writing raw XML can be tedious, we suggest creating the forms using the [XLSForm standard](http://xlsform.org/), and using the [cht-conf](https://github.com/medic/cht-conf) command line configurer tool to [convert them to XForm format](#build).

| type        | name | label | relevant | appearance | calculate | ... |
|-------------|---|---|---|---|---|---|
| begin group | inputs | Inputs | ./source = 'user' | field-list |
| hidden      | source |
| hidden      | source_id |
| hidden      | task_id | Task_ID
| begin group | contact |
| string      | _id | Patient ID |  | select-contact type-person |
| string      | patient_id | Medic ID |  | hidden |
| string      | name | Patient Name |  | hidden |
| end group
| end group
| calculate   | _id | | | | ../inputs/contact/_id |
| calculate   | patient_id | | | | ../inputs/contact/patient_id |
| calculate   | name | | | | ../inputs/contact/name |
| ...
| begin group | group_summary | Summary |  | field-list summary |
| note        | r_patient_info | \*\*${patient_name}\*\* ID: ${r_patient_id} |
| note        | r_followup | Follow Up \<i class="fa fa-flag"\>\</i\> |
| note        | r_followup_note | ${r_followup_instructions} |
| end group   |

**Note:** If the form uses a file picker to upload any type of file, and it is accessed by using CHT Android, then include the `READ_EXTERNAL_STORAGE` permission in order to access the files in the device. To enable this permission add the following line in the branded app's `AndroidManifest.xml`.
```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```

### Supported XLSForm Meta Fields
[XLSForm](http://xlsform.org/) has a number of [data type options](https://xlsform.org/en/#metadata) available for meta data collection, of which the following are supported in CHT app forms:

| element | description |
|---|---|
| `start` | A timestamp of when the form entry was started, which occurs when the form is fully loaded. |
| `end` | A timestamp of when the form entry ended, which is when the user hits the Submit button. |
| `today` | Day on which the form entry was started. |

## XPath
Calculations are achieved within app forms using XPath statements in the "calculate" field of XForms and XLSForms. CHT apps support XPath from the [ODK XForm spec](https://getodk.github.io/xforms-spec), which is based on a subset of [XPath 1.0](https://www.w3.org/TR/1999/REC-xpath-19991116/), and is evaluated by [`openrosa-xpath-evaluator`](https://github.com/enketo/enketo/tree/main/packages/openrosa-xpath-evaluator). The ODK XForm documentation provides useful notes about the available [operators](https://getodk.github.io/xforms-spec/#xpath-operators) and [functions](https://getodk.github.io/xforms-spec/#xpath-functions). Additionally, [CHT specific functions](#cht-xpath-functions) are available for forms in CHT apps.

{{< callout type="warning" >}}
  The `+` operator for string concatenation is deprecated and will be removed in a future version. You are strongly encouraged to use the [`concat()`](https://getodk.github.io/xforms-spec/#fn:concat) function instead.
{{< /callout >}}

## CHT XForm Widgets

Some XForm widgets have been added or modified for use in CHT applications. The code for these widgets can be found in the [CHT Core Framework repository](https://github.com/medic/cht-core/tree/master/webapp/src/js/enketo/widgets).

### Bikram Sambat Datepicker

Calendar widget using Bikram Sambat calendar, which is used by default for appropriate languages. The CHT documentation includes a [conversion tool](https://docs.communityhealthtoolkit.org/bikram-sambat/) to check the conversion between Gregorian and Bikram Sambat dates.
{{< see-also page="building/forms/app" title="`to-bikram-sambat` XPath function" anchor="to-bikram-sambat" >}}

### Countdown Timer

A visual timer widget that starts when tapped/clicked, and has an audible alert when done. To use it, first make sure you have the [`namespaces` column](https://getodk.github.io/xforms-spec/#namespaces) in the "settings" tab of your XLSForm populated with a value that includes `cht=https://communityhealthtoolkit.org`. Then, you can add the timer as a `trigger` field with the _appearance_ set to `countdown-timer`. The duration of the timer (in seconds) can be set in a column named _instance::cht:duration_ (the default value is `60`).

| type    | appearance      | instance::cht:duration |
|---------|-----------------|------------------------|
| trigger | countdown-timer | 30                     |

If you want to make the timer mandatory so users must wait for the timer to complete before continuing to the next page or submitting the form, you can populate the _required_ column with an XPath expression as you would do for any other required question. A value of `"OK"` will be set for the `trigger` field when the timer completes.


{{< callout type="info" >}}
  The `trigger` implementation of the countdown timer is only supported for CHT versions `4.7.0+`.  For older CHT versions, the deprecated `note` implementation of the countdown timer can be used. However, it does not support setting a value in the _required_ column. To use the deprecated countdown timer, create a `note` field with the _appearance_ set to `countdown-timer`. The duration of the timer (in seconds) can be set in the `default` column. If this value is not set, the timer will be set to 60 seconds.
{{< /callout >}}

### Contact Selector
A dropdown field to search and select a person or place, and save their UUID in the report. The contact's data will also be mapped to fields with matching names within the containing group. If the contact selector's appearance includes `bind-id-only`, the associated data fields are not mapped. See [the form input guide](/building/forms/configuring/form-inputs#contact-selector) for an example.

### Rapid Diagnostic Test Capture
Take a picture of a Rapid Diagnotistic Test and save it with the report. Works with [rdt-capture Android application](https://github.com/medic/rdt-capture/). To use create a string field with appearance `mrdt-verify`.

### Display Base64 Image
_Available in +3.13.0._

To display an image based on a field containing the Base64 encode value, add the appearance `display-base64-image` to a field type `text`.

### Android App Launcher
_Available in +3.13.0 and in Android device only._

A widget to launch an Android app that receives and sends data back to an app form in CHT-Core.

This widget requires the `cht-android` app in order to work, and will be disabled for users running the CHT in a browser. This widget requires the `READ_EXTERNAL_STORAGE` permission in CHT Android to work properly, to enable this permission add the following line in the branded app's `AndroidManifest.xml`.
```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```

Use the Android App Launcher widget in a form to configure an intent to launch an Android app installed in the mobile device. The widget will send values from input fields type `text` to the app and will assign the app's response into output fields type `text`. The only supported field type is `text`. The widget will automatically display a button to launch the app.

To define the widget, create a `group` with the appearance `android-app-launcher`, then define the [Android intent](https://developer.android.com/reference/android/content/Intent) fields with type `text`. The fields `action`, `category`, `type`, `uri`, `packageName` and `flags` are optional. Every Android app has specific ways of launching with intents, so check the app's documentation and assign the corresponding values in the `default` column. See example below:

| type | name | label | appearance | repeat_count | default | ... |
|---|---|---|---|---|---|---|
| begin group | camera-app | NO_LABEL | android-app-launcher |  |  | ... |
| text | action | NO_LABEL |  |  | android.media.action.IMAGE_CAPTURE | ... |
| text | category | NO_LABEL |  |  |  | ... |
| text | type | NO_LABEL |  |  |  | ... |
| text | uri | NO_LABEL |  |  |  | ... |
| text | packageName | NO_LABEL |  |  |  | ... |
| text | flags | NO_LABEL |  |  |  | ... |
| ... | ... | ... | ... | ... | ... | ... |
| end group | camera-app |  |  |  |  | ... |

To define the widget's input fields and send data as Android Intent's `extras`, create a group inside the widget with the appearance `android-app-inputs`. In order to assign the app's response to the widget's output fields, create a group with the appearance `android-app-outputs`.

> [!IMPORTANT]
> The fields inside the input and the output groups should to match in name and location to what the Android app receives and returns, otherwise the communication between the widget and the Android app won't work properly.

| type | name | label | appearance | repeat_count | default | ... |
|---|---|---|---|---|---|---|
| begin group | camera-app | NO_LABEL | android-app-launcher |  |  | ... |
| text | action | NO_LABEL |  |  | android.media.action.IMAGE_CAPTURE | ... |
| begin group | camera-app-inputs | NO_LABEL | android-app-inputs |  |  | ... |
| text | location | Location |  |  |  | ... |
| text | destination | Destination |  |  |  | ... |
| end group | camera-app-inputs |  |  |  |  | ... |
| begin group | camera-app-outputs | NO_LABEL | android-app-outputs |  |  | ... |
| text | picture | Picture |  |  |  | ... |
| text | date | Date |  |  |  | ... |
| end group | camera-app-outputs |  |  |  |  | ... |
| ... | ... | ... | ... | ... | ... | ... |
| end group | camera-app |  |  |  |  | ... |

To instruct the widget to process nested data objects, create a new group inside the input or the output group with the appearance `android-app-object`. Objects cannot be assigned to a field, it should be a group with fields to map the properties to fields that share the same name.

> [!IMPORTANT]
> The nested group's name should match in name and location to what the Android app receives and returns, otherwise it won't be able to find the nested object.

| type | name | label | appearance | repeat_count | default | ... |
|---|---|---|---|---|---|---|
| begin group | camera-app | NO_LABEL | android-app-launcher |  |  | ... |
| text | action | NO_LABEL |  |  | android.media.action.IMAGE_CAPTURE | ... |
| begin group | camera-app-inputs | NO_LABEL | android-app-inputs |  |  | ... |
| text | location | Location |  |  |  | ... |
| begin group | photo_configuration | NO_LABEL | android-app-object |  |  | ... |
| text | aperture | Aperture |  |  |  | ... |
| text | shutter_speed | Shutter Speed |  |  |  | ... |
| end group | photo_configuration |  |  |  |  | ... |
| end group | camera-app-inputs |  |  |  |  | ... |
| begin group | camera-app-outputs | NO_LABEL | android-app-outputs |  |  | ... |
| text | picture | Picture |  |  |  | ... |
| text | date | Date |  |  |  | ... |
| end group | camera-app-outputs |  |  |  |  | ... |
| ... | ... | ... | ... | ... | ... | ... |
| end group | camera-app |  |  |  |  | ... |

To instruct the widget to process an array of strings or numbers, create a new `repeat` with fix size in the `repeat_count` column and place it inside the input or the output group with the appearance `android-app-value-list`, then create 1 field type `text` to store every array's value, _only 1 field is allowed_. To process an array of objects, use the appearance `android-app-object-list` instead.

> [!IMPORTANT]
> The `repeat`'s name should match in name and location to what the Android app receives and returns, otherwise it won't be able to find the array.

| type | name | label | appearance | repeat_count | default | ... |
|---|---|---|---|---|---|---|
| begin group | camera-app | NO_LABEL | android-app-launcher |  |  | ... |
| text | action | NO_LABEL |  |  | android.media.action.IMAGE_CAPTURE | ... |
| text | flags | NO_LABEL |  |  | 268435456 | ... |
| begin group | camera-app-inputs | NO_LABEL | android-app-inputs |  |  | ... |
| text | location | Location |  |  |  | ... |
| begin repeat | photo_filters | NO_LABEL | android-app-value-list | 2 |  | ... |
| text | filter | Filter |  |  |  | ... |
| end repeat |  |  |  |  |  | ... |
| end group | camera-app-inputs |  |  |  |  | ... |
| begin group | camera-app-outputs | NO_LABEL | android-app-outputs |  |  | ... |
| text | date | Date |  |  |  | ... |
| begin repeat | capture | NO_LABEL | android-app-object-list | 3 |  | ... |
| text | light_percentage | Light |  |  |  | ... |
| text | contrast_percentage | Contrast |  |  |  | ... |
| begin group | patient_details | NO_LABEL | android-app-object |  |  | ... |
| text | picture | Patient picture |  |  |  | ... |
| text | patient_id | Patient ID |  |  |  | ... |
| text | patient_name | Patient name |  |  |  | ... |
| end group | patient_details |  |  |  |  | ... |
| end repeat |  |  |  |  |  | ... |
| end group | camera-app-outputs |  |  |  |  | ... |
| ... | ... | ... | ... | ... | ... | ... |
| end group | camera-app |  |  |  |  | ... |

### Phone number input

When accepting telephone numbers in a form, the phone widget validates the given phone number is valid for the server's configured locale and can optionally check to see if a duplicate contact already exists with the same phone number.

To use the widget, create a `string` field with the appearance `numbers tel`. This will produce a text box input field in the form where the user can enter the phone number. Values entered for this field will be rejected if they are not valid phone numbers for the server's configured `default_country_code` (as determined by the [google-libphonenumber](https://github.com/google/libphonenumber) library).  Additionally, valid input will be normalized to the `E164` format (e.g. `+1234567890`) before storing it in the form data model.

The widget can also reject phone numbers that are already associated with an existing contact. (A contact already exists with the same phone number value in its `phone` field.) To enable this duplicate checking for a particular field, first make sure you have the [`namespaces` column](https://getodk.github.io/xforms-spec/#namespaces) in the "settings" tab of your XLSForm populated with a value that includes `cht=https://communityhealthtoolkit.org`. Then, in the "survey" tab, add a column called `instance::cht:unique_tel` and set the value to `true` for the phone number field.

A validation failure, either for an invalid or duplicate phone number will prevent the form from being submitted. To also display an error message to the user, set `true` in the `constraint` column for the phone number field and enter localized messages in the desired `constraint_message::xx` columns.

| type   | appearance  | instance::cht:unique_tel | constraint | constraint_message::en             |
|--------|-------------|--------------------------|------------|------------------------------------|
| string | numbers tel | true                     | true       | Please enter a valid phone number. |


{{< callout type="info" >}}
Configuring a phone input as a `string` field with the `tel` _appearance_ is only supported for CHT versions `4.11.0+`.  For older CHT versions, a phone input can be configured by setting `tel` in the _type_ column (without any _appearance_ value). This deprecated implementation cannot be configured via the `instance::cht:unique_tel` column and instead will always reject numbers that match the `phone` field on an existing contact.
{{< /callout >}}

## CHT XPath Functions

### `add-date`

_Added in 4.0.0._

Adds the provided number of years/months/days/hours/minutes to a date value.

```
add-date(date, years, months, days, hours, minutes)
```

This function is useful for things like calculating a date that is a specific number of days in the future. For example, the following returns a date that is two weeks from now: `add-date(today(), 0, 0, 14)`.

You can also add negative numbers to get dates in the past. This can be used to calculate a person's birthdate date based on how many years/months old they are: `add-date(today(), 0-${age_years}, 0-${age_months})`.

### `cht:difference-in-days`

_Added in 4.7.0._

Calculates the number of whole days between two dates.

### `cht:difference-in-weeks`

_Added in 4.7.0._

Calculates the number of whole calendar weeks between two dates.

### `cht:difference-in-months`

Calculates the number of whole calendar months between two dates. This is often used when determining a child's age for immunizations or assessments.

{{< callout type="info" >}}
  For CHT versions lower than `4.7.0`, the deprecated `difference-in-months` function (without the `cht` namespace) should be used.
{{< /callout >}}

### `cht:difference-in-years`

_Added in 4.7.0._

Calculates the number of whole calendar years between two dates.

### `cht:extension-lib`

_Added in 4.2.0._

This function invokes a configured [extension library](/extension-libs). The first parameter is a string with the name of the library to execute, and any remaining parameters are passed through as is. For example, to calculate an average of two numbers, the xpath could be: `cht:extension-lib('average.js', /data/first, /data/second )`.

### `cht:strip-whitespace`

_Added in 4.10.0._

Removes all whitespace characters from a string.

### `cht:validate-luhn`

_Added in 4.10.0._

Validate a given number using the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) to help detect typos. Provide the field as the first parameter and optionally include the expected string length in the second parameter. Returns `true` if the number is valid.

### `parse-timestamp-to-date`

_Added in 3.13.0._

Use this function to parse from a timestamp number to a date. This is useful when using other XForm utility functions that receive date type as parameter, see example below:

| type | name | label | calculation | default | ... |
|------|------|-------|-------------|---------|-----|
| string | start_date_time | NO_LABEL |    | 1628945040308 |
| string | start_date_time_formatted | Started on: | format-date-time(**parse-timestamp-to-date(${start_date_time})**, "%e/%b/%Y %H:%M:%S") |  |

### `to-bikram-sambat`

_Added in 3.14.0._

This function converts a `date` to a `string` containing the value of the date formatted according to the [Bikram Sambat](https://en.wikipedia.org/wiki/Vikram_Samvat) calendar.

See also: [Bikram Sambat Datepicker](/building/forms/app#cht-xform-widgets)

### `z-score`

In Enketo forms you have access to an XPath function to calculate the z-score value for a patient. The function accesses table data stored in CouchDB.

The `z-score` function takes four parameters:
- The name of z-score table to use, which corresponds to value of the database document's `_id` attribute.
- Patient's sex, which corresponds to the data object's name. In the example below `male` for this parameter corresponds to `charts[].data.male` in the database document.
- First parameter for the table lookup, such as age. Value maps to the `key` value in the database document.
- Second parameter for the table lookup, such as height. Value is compared against the `points` in the database document.

#### Example Use
[This example XForm form](https://github.com/medic/cht-core/blob/3.13.x/demo-forms/z-score.xml) shows the use of the z-score function. To calculate the z-score for a patient given their sex, age, and weight the XPath calculation is as follows:

`z-score('weight-for-age', ../my_sex, ../my_age, ../my_weight)`

The data used by this function needs to be added to CouchDB. The example below shows the structure of the database document. It creates a `weight-for-age` table, where you can see that a male aged 0 at 2.08kg has a z-score of -3. Your database doc will be substantially larger, so you may find the [conversion script](https://github.com/medic/cht-core/blob/master/scripts/zscore-table-to-json.js) helpful to convert z-score tables to the required doc format.


```json
{
  "_id": "zscore-charts",
  "charts": [{
    "id": "weight-for-age",
    "data": {
      "male": [{
        "key": 0,
        "points": [ 1.701, 2.08, 2.459, 2.881, 3.346, 3.859, 4.419, 5.031, 5.642 ]
      }]
    }
  }]
}
```

## Input data

`app` forms have access to a variety of [input data](/building/forms/configuring/form-inputs#app-forms) depending on the source of the form.

## CHT Special Fields

Some fields in app forms control specific aspects of CHT Apps, either to bring data into forms or for a feature outside of the form.

### Quintiles
The `NationalQuintile` and `UrbanQuintile` fields on a form will be assigned to all people belonging to the place. This is helpful when household surveys have quintile information which could be used to target health services for individuals. {{< see-also prefix="Read More" page="building/forms/configuring/wealth-quintiles" >}}

### UHC Mode
When the `visited_contact_uuid` field is set at the top level of a form, this form is counted as a household visit in [UHC Mode](/building/uhc-mode). This field must be a `calculate` field with the place UUID of the visited contact. You may run into performance issues if you configure this to look at forms submitted very frequently. {{< see-also prefix="Read More" page="building/forms/configuring/uhc-mode" >}}

## Uploading Binary Attachments

Forms can include arbitrary binary data which is submitted and included in the doc as an attachment. If this is an image type it'll then be displayed inline in the report UI.

To mark an element as having binary data add an extra column in the XLSForm called `instance::type` and specify `binary` in the element's row.

## Properties

The meta information in the `{form_name}.properties.json` file defines the form's title and icon, as well as when and where the form should be available.

### `forms/app/{form_name}.properties.json`

| property | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | required |
|---|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---|
| `title`| The form's title seen in the app. Uses a localization array using the 2-letter code, not the translation keys discussed in the [Localization section](/building/translations/localizing).                                                                                                                                                                                                                                                                                                                                      | yes |
| `icon` | Icon associated with the form. The value is the image's key in the `resources.json` file, as described in the [Icons section](/building/branding/resources#icons)                                                                                                                                                                                                                                                                                                                                                              | yes |
| `subject_key` | Override the default report list title with a custom translation key. The translation uses a summary of the report as the evaluation context so you can include report fields in your value, for example: `Case registration {{case_id}}`. Useful properties available in the summary include: `from` (the phone number of the sender), `phone` (the phone number of the report contact), `form` (the form code), `subject.name` (the name of the subject), and `case_id` (the generated case id). Defaults to the name of the report subject. | no |
| `hidden_fields` | Array of Strings of form fields to hide in the view report UI in the app. This is only applied to future reports and will not change how existing reports are displayed.                                                                                                                                                                                                                                                                                                                                                                       | no |
| `context` | The context defines when and where the form should be available in the app                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | no |
| `context.person` | Boolean determining if the form can be seen in the Action list for a person's profile. This is still subject to the `expression`.                                                                                                                                                                                                                                                                                                                                                                                                              | no |
| `context.place` | Boolean determining if the form can be seen in the Action list for a person's profile. This is still subject to the `expression`.                                                                                                                                                                                                                                                                                                                                                                                                              | no |
| `context.expression` | A JavaScript expression which is evaluated when a contact profile or the reports tab is viewed. If the expression evaluates to true, the form will be listed as an available action. The inputs `contact`, `summary`, `user` and `userSummary` (**as of 4.21.0**) are available. By default, forms are not shown on the reports tab, use `"expression": "!contact"` to show the form on the Reports tab since there is no contact for this scenario.                                                                                           | no |
| `context.permission` | String permission key required to allow the user to view and submit this form. If blank, this defaults to allowing all access.                                                                                                                                                                                                                                                                                                                                                                                                                 | no |

### Expression functions

{{< read-content file="_partial_expression_functions.md" >}}

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
    "hidden_fields": [ "private", "internal" ],
    "context": {
      "person": true,
      "place": false,
      "expression": "contact.type === 'person' && (!contact.sex || contact.sex === 'female') && (!contact.date_of_birth || (ageInYears(contact) >= 10 && ageInYears(contact) < 65))",
      "permission": "can_register_pregnancies"
    }
  }
```

## Build

Convert and build the app forms into your application using the `convert-app-forms` and `upload-app-forms` actions in `cht-conf`.

```shell
  cht --local convert-app-forms upload-app-forms
```
