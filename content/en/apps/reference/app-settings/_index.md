---
title: "app_settings.json"
linkTitle: "app_settings.json"
weight: 5
description: >
  **Settings**: The primary location of settings for CHT applications
keywords: settings
---

The settings which control CHT apps are defined in the `app_settings.json` file, and stored in the `settings` doc in the database. Some settings can be modified in the [**App Management**]({{% ref "apps/features/admin" %}}) app, which updates the same settings file in the database. 

The `app_settings.json` file can be manually edited to modify individual settings. The code for some components, like tasks and targets, gets compiled into this file with the `compile-app-settings` action in the `medic-conf` tool. 

Most sections are described on their own in the [Reference Documentation]({{< ref "apps/reference" >}}).

## Build

To include your settings into your app, you must compile them to include modular components, then upload them to your instance.

```sh
medic-conf --local compile-app-settings backup-app-settings upload-app-settings
```


## Optional Settings

The following settings do not need to be specified. They should only be defined when the default implementation needs to be changed.

### `app_settings.json`

| Setting              | Description | Default | Version |
|----------------------|---------|---------|---------|
| phone_validation     | <ul><li>"full": full validation of a phone number for a region using length and prefix information.</li><li>"partial": quickly guesses whether a number is a possible phone number by using only the length information, much faster than a full validation.</li><li>"none": allows almost any values but still fails for any phone that contains a-z chars.</li></ul> | "full" | 3.1.0   |
| uhc.contacts_default_sort | <ul><li>"alpha": Sort contacts alphanumerically</li><li>"last_visited_date": sort contacts by the date they were most recently visited.</li></ul> | "alpha" | 2.18.0 |
| uhc.visit_count.month_start_date | The date of each month when the visit count is reset to 0. | 1 |2.18.0 |
| uhc.visit_count.visit_count_goal | The monthly visit count goal. | 0 | 2.18.0 |
| outgoing_deny_list | All outgoing messages will be denied (unsent) if the recipient phone number starts with an entry in this list. A comma delimited list. (eg. `outgoing_deny_list="253,ORANGE"` will deny all messages sent to `253 543 4448` and `ORANGE NET`) | "" | |
| outgoing_deny_shorter_than | Deny all messages to recipient phone numbers which are shorter than this value. Intended to avoid [message loops]({{% ref "apps/guides/messaging/message-loops" %}}) with short codes used by gateways (eg. `60396`). An integer. | 6 | 3.3.0 |
| outgoing_deny_with_alphas | When `true`, deny all messages to recipient phone numbers containing letters (eg. `Safaricom`). Intended to avoid [message loops]({{% ref "apps/guides/messaging/message-loops" %}}) with non-numeric senders used by gateways. A boolean. | true | 3.3.0 |
| outgoing_deny_with_alphas | When `true`, deny all messages to recipient phone numbers containing letters (eg. `Safaricom`). Intended to avoid [message loops]({{% ref "apps/guides/messaging/message-loops" %}}) with non-numeric senders used by gateways. A boolean. | true | 3.3.0 |
| task_day_limit | The number of days before a task is due to show the due date. | 4 | 3.9.0 |
| app_url | The URL of the app, eg: "https://demo.app.medicmobile.org" | | 3.10.0 |

## SMS Workflows

Workflows involving SMS are configured by defining [schedules]({{% relref "schedules" %}}), [registrations]({{% relref "registrations" %}}), [patient reports]({{% relref "patient_reports" %}}), and [case reports]({{% relref "accept_case_reports" %}}). Schedules of automated messages can be sent from the server at specificied times in the future, and reports can be associated to contacts.Forms can also be configured to clear the schedule, or silence it for a period of time.

## SMS recipient resolution

An outgoing SMS message configuration has the following fields:

|property|description|required|
|-------|---------|----------|
|`translation_key`|The translation key of the message to send out. Available in 2.15+.|yes|
|`messages`| (**deprecated**) Array of message objects, each with `content` and `locale` properties. From 2.15 on use `translation_key` instead.|no|
|`recipient`| Recipient of the message.|no|

### `recipient` values and resolutions:

|value|resolves to|
|-----|-----------|
|*empty*| submitter |
|`reporting_unit`| submitter | 
|`parent`| primary contact of the patient's/submitter's place's parent (`patient.parent.parent.contact`) | 
|`grandparent`| primary contact of the patient's/submitter's place's grandparent (`patient.parent.parent.parent.contact`) |
|`clinic`| primary contact of the `clinic` in the patient's/submitter's lineage | 
|`health_center`| primary contact of the `health_center` in the patient's/submitter's lineage | 
|`district`| primary contact of the `district_hospital` in the patient's/submitter's lineage |
|`ancestor:<contact_type>`| primary contact of the place of the requested type in the patient's/submitter's lineage |
|`link:<tag>`| Linked doc that has requested `tag` in the patient's / submitter's lineage (direct mapping, not to primary contact). *As of 3.10.x*| 
|`link:<contact_type>`| primary contact of the place of the requested `contact_type` in the patient's/submitter's lineage. *As of 3.10.x* | 
| *custom object path* | a direct object path in the [message context object](#message-context) eg: `patient.parent.contact.other_phone` | 
| *valid phone number* | requested phone number |

{{% alert title="Note" %}} 
- if `recipient` resolution does not yield a phone number, it will default to submitter's phone number
- if there is no submitter phone number available, the actual `recipient` property value will be used
- when mapping a contact phone number, `patient` lineage and `linked_docs` take precedence over `submitter` lineage and `linked_docs`. 
- except for `link:<tag>`, phone numbers are resolved to the primary contacts of the requested places. `linked_docs` hydration is shallow, so the primary contact of the linked doc will not be available. 
{{% /alert %}}


### Message context
The message context object consists of:

|property|value description|
|--------|-----------------|
|*every property from the original report* | unchanged unless specified below |
|*every `fields` property from the original report* | eg: if the report has `fields.test = 'test'` then `context.test = 'test'` |
| patient | deeply hydrated patient contact (resolved from `patient_id`, `fields.patient_id` or `fields.patient_uuid`) |
| patient_name | patient's name |  
| place | deeply hydrated place document (resolved from `place_id`) - *only available in `registration` transition, when creating the place via SMS* |
| contact | deeply hydrated submitter contact | 
| parent | deeply hydrated `health_center` type document from the patient's or submitter's lineage |
| grandparent | deeply hydrated `district_hospital` type document from the patient's or submitter's lineage |
| clinic | deeply hydrated `clinic` type document from the patient's or submitter's lineage |
| health_center | deeply hydrated `health_center` type document from the patient's or submitter's lineage |
| district_hospital | deeply hydrated `district_hospital` type document from the patient's or submitter's lineage |


## Variables

Outgoing messages can use [Mustache templating](https://mustache.github.io/mustache.5.html) to insert variables and specify data formats.
All [message context fields](#message-context) are available as variables.

### Code sample

The following translation label includes the `name` field of `contact`, along with the submitted `patient_name` field, and the generated `patient_id` field.

#### `translations/messages-en.properties`
```
messages.registration.report_accepted = Thank you {{contact.name}} for registering {{patient_name}}. Their ID is {{patient_id}}.
```

### Date Format Filters
The following filter functions are available for formating dates.

|filter|description|
|-------|---------|
|`date` | Displays dates according to the `date_format` specified in app_settings. See [doc for Moment.js format](https://momentjs.com/docs/#/parsing/string-format/) for details.|
|`datetime` | Displays dates according to the `reported_date_format` specified in app_settings. See [doc for Moment.js format](https://momentjs.com/docs/#/parsing/string-format/) for details.|
|`bikram_sambat_date` | Displays dates in Bikram Sambat calendar (most commonly used calendar in Nepal). Currently display format is hardcoded to e.g. "१५ चैत २०७३".|


## Validations
Validation rules are code fragments used to determine if some input is valid. For example, to say a field is only valid if the value has at least five characters, you would use the lenMin(5). They are used in `registrations[].validations.list[].rule` and `patient_reports[].validations.list[].rule` to determine if an incoming report is accepted. A report is accepted as valid only if all rules return `true`. If any validation rule returns `false` then the report is marked as invalid, and a message is automatically sent to the submitter. The content for the message is set in the `translation_key` associated to each rule. If a report fails multiple validations then each message will be sent. These can be combined into a single SMS by specifying `"*.validations.join_responses" : true`.

### Operators
The available operators are:

| Operator | Description |
|----|----|
| && |and |
| \|\| |or |
| ! |not |
| a ? b : c | ternary, ie: if 'a' is true, then check 'b', otherwise check 'c' |
| () | nested blocks, eg: 'a && (b || c)' |

### Rules
Validation settings may consist of Pupil.js rules and rules specific to Medic Mobile.
These two types of rules cannot be combined as part of the same rule.

Not OK:
`rule: "regex(\d{5}) && unique('patient_id')"`

OK:
`rule: "regex(\d{5}) && max(11111)"`
     
If for example you want to validate that patient_id is 5 numbers and it
is unique (or some other custom validation) you need to define two
validation configs/separate rules in your settings. Example validation
settings:

```
[
	{
		property: "patient_id",
		rule: "regex(\d{5})",
		message: [{
		    content: "Patient ID must be 5 numbers.",
		    locale: "en"
	}]
	},
	{
		property: "patient_id",
		rule: "unique('patient_id')",
		message: [{
		    content: "Patient ID must be unique.",
		    locale: "en"
		}]
	}
]
```

`validate()` modifies the property value of the second item to
`patient_id_unique` so that pupil.validate() still returns a valid
result.  Then we process the result once more to extract the custom
validation results and error messages.

#### Pupil.js validation functions

Available validation functions are available at https://www.npmjs.com/package/pupil#validation-functions

The following functions are available by default:

| Function | Description |
|----|----|
| `equals` |  Comparison |
| `iEquals` |  Case insensitive comparison |
| `sEquals` |  Type sensitive equals |
| `siEquals` |  Type sensitive case insensitive equals |
| `lenMin` |  Minimum length |
| `lenMax` |  Maximum length |
| `lenEquals` |  Exact length |
| `min` |  Minimum value |
| `max` |  Maximum value |
| `between` |  Minimum and maximum value |
| `in` |  One of the provided values |
| `required` |  Must have a value |
| `optional` |  Always valid |
| `numeric` |  Numbers only |
| `integer` |  Integer numbers only |
| `alpha` |  Letters only |
| `alphaNumeric` |  Numbers and letters only |
| `email` |  Email address format |
| `regex` |  A custom regular expression |
| `equalsTo` | Compare to another field by its key |

##### Sample usage

For case-insensitive comparison `iEquals` function in Pupil, 
And you can use `||` for logical OR : https://www.npmjs.com/package/pupil#rule-strings

So you can do this : 
`rule: 'iEquals("mary") || iEquals("john")'`
matches "mary", "Mary", "john", "John", "JOhN", etc. Not "maryjohn"

#### CHT validation functions
| Function | Description |
|----|----|
| `unique(*fields)` | Returns `true` if no existing valid report has the same value for all of the listed fields. Fields are compared to those at the top level and within `fields` for every report doc. To include the form type use `'form'` as one of the fields. Eg `unique('form', 'patient_id')` checks that this form was never submitted for this patient. |
| `uniqueWithin(*fields, time_period)` | Same as `unique` but the last argument is the time period in which to search. Eg `uniqueWithin('form', 'patient_id', '1 week')` checks that the same form wasn't submitted for this patient in the past week. |
| `exists(form_id, field)` | Returns `true` if a report matches the `form_id` and value for `field`. This is useful to check that a patient was registered for a service before reporting about it. Eg `exists('REG', 'patient_id')` checks that a `REG` form was already submitted for a patient. As of 2.12 most uses of this function are obsolete because checking for a valid `patient_id` is done automatically by the `accept_patient_report` transition using `registration_not_found` in the `messages.event_type`. |
| `isISOWeek(weekFieldName[, yearFieldName])` | Returns `true` if the current report has a week value that is less or equal to the number of ISO weeks of the current year or the year value of the same report. The first parameter is the field name for the week and the second parameter is the field name for the year: `isISOWeek('week', 'year')`. If the second parameter is not specified, then the current year is used: `isISOWeek('week')`. |
