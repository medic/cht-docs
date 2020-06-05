---
title: ".transitions"
linkTitle: ".transitions"
weight: 5
description: >
  **Sentinel Transitions**: functions executed when database documents change
relevantLinks: >
---

When sentinel detects a document has changed it runs transitions against the doc. These transitions can be used to generate a short form patient id or assign a report to a facility.

## Configuration

By default all transitions are disabled. They can be enabled by configuring the `transitions` property to have a key with the transitions name and a `truthy` value, eg:

```json
{
  "transitions": {
    "a": { },
    "b": true,
    "c": { "disable": false },
    "d": { "disable": true }
  }
}
```

In this example the `d` transition will not be applied, but the other three will be.

## Available transitions

The following transitions are available and executed in order.

| Key | Description |
|---|---|
| maintain_info_document | Records metadata about the document such as when it was replicated. Enabled by default. |
| update_clinics | Adds a contact's info to a new data record. This is used to attribute an incoming SMS message or report to the appropriate contact. The `rc_code` value on the contact is used to match to the value of the form field set as the `facility_reference` in the [JSON form definition]({{< ref "apps/reference/app-settings/forms#app_settingsjson-forms" >}}). This matching is useful when reports are sent on behalf of a facility by unknown or various phone numbers. If `facility_reference` is not set for a form, the contact match is attempted using the sender's phone number. |
| [registration](#registration) | For registering a patient to a schedule. Performs some validation and creates the patient document if the patient does not already exist. Can create places (as of 3.8.x).|
| accept_patient_reports | Validates reports about a patient and silences relevant reminders. |
| [generate_shortcode_on_contacts](#generate-shortcode-on-contacts) | Automatically generates the `patient_id` on all person documents and the `place_id` on all place documents. Available since 3.8.x. |
| [generate_patient_id_on_people](#generate-patient-id-on-people) | **Deprecated in 3.8.x** Automatically generates the `patient_id` on all person documents. As of 3.8.x, also generates the `place_id` on all place documents and is an alias for `generate_shortcode_on_contacts`. |
| default_responses | Responds to the message with a confirmation or validation error. |
| update_sent_by | Sets the sent_by field of the report based on the sender's phone number. |
| update_sent_forms | **Deprecated in 3.7.x** Update sent_forms property on facilities so we can setup reminders for specific forms. *As of 3.7.x, reminders no longer require this transition*|
| [death_reporting](#death_reporting) | Updates the deceased status of patients. |
| conditional_alerts | Executes the configured condition and sends an alert if the condition is met. |
| [multi_report_alerts](#multi_report_alerts) | Similar to conditional_alerts, with more flexible configuration, including using different form types for the same alert. |
| [update_notifications](#update_notifications) | **Deprecated in 3.2.x** Mutes or unmutes scheduled messages based on configuration. |
| update_scheduled_reports | If a report has a month/week/week_number, year and clinic then look for duplicates and update those instead. |
| resolve_pending | Sets the state of pending messages to sent. It is useful during builds where we don't want any outgoing messages queued for sending. |
| [muting](#muting) | Implements muting/unmuting actions of people and places. Available since 3.2.x. |
| [mark_for_outbound](./outbound.md) | Enables outbound pushes. Available since 3.5.x |
| [self_report](#self_report) | Maps patient to sender. Available since 3.9.x |

## Transition Configuration Guide

Guides for how to setup specific transitions.

### multi_report_alerts

Send alert messages by SMS when specific conditions are received through reports. More flexible than simple Alerts.

Example: send SMS to the district manager when 2 CHWs within the same district report cholera or diarrhea symptoms within the last week.

Understanding the different types of reports used in the configuration:

```
             previous suspected_cholera alert was sent
             |
             |           latest_report comes in, suspected_cholera alert is sent
             |           |
             v           v
---[---*-o---*--*--o-o---*]------->    time
                1        0
```

`[]` : time window

`*` and `o` : `reports` : any report that came in to the server.

`*` : `counted_reports` : reports that came in that passed the `is_report_counted` filter function.

`0`, `1` : `new_reports` : `counted_reports` that came in since the previous alert was sent. They haven't been messaged about yet.

#### Configuration

```
"multi_report_alerts" : [
  {
    "name": "suspected_cholera",
    "is_report_counted": "function(report, latest_report) {  return latest_report.contact.parent.parent._id === report.contact.parent.parent._id; }",
    "num_reports_threshold": 2,
    "message": "{{num_counted_reports}} patients with {{alert_name}} in {{time_window_in_days}} days reported at {{new_reports.0.contact.parent.name}}. New reports from: {{new_reports.0.contact.name}}, {{new_reports.1.contact.name}}, {{new_reports.2.contact.name}}.",
    "recipients": [
      "+123456",
      "new_report.contact.phone", // sender of each report in new_reports
      "new_report.contact.parent.parent.contact.phone", // contact person for the parent place of the sender of each report in new_reports.
      // If it's the same for several reports, only one message will be sent (recipient phone numbers are deduplicated before generating messages).
    ],
    "time_window_in_days": 7,
    "forms": ["C", "D"] // Only Cholera and Diarrhea forms.
  }
]
```

Note that we are using Mustache templates for our message templates (anything with `{{}}`), and they use a `.` notation to access items in an array (e.g. `new_reports.1`) rather than a `[]` notation as in conventional javascript (`new_reports[1]`).

For performance reasons the `num_reports_threshold` cannot exceed 100.

### death_reporting

Updates patient documents with a `date_of_death` field which updates how the patient is displayed in the UI.

#### Configuration

Configuration is stored in the `death_reporting` field of the settings.

| Property | Description |
|---|---|
| `mark_deceased_forms` | An array of form codes which will cause patients to be recorded as deceased. |
| `undo_deceased_forms` | An array of form codes which will remove the deceased date from the patient. Optional. |
| `date_field` | The path to the field in the report document which has the date the patient died. Optional: if not configured it defaults to the reported_date of the report. |

##### Example

```json
"death_reporting": {
  "mark_deceased_forms": [ "death" ],
  "undo_deceased_forms": [ "undo-death" ],
  "date_field": "fields.death_date"
}
```

### Registration

Configuration is held at `app_settings.registrations`, as a list of objects connecting forms to validations, events and messages.

#### Events

Lists different events.

##### `on_create`

This is the only supported event.

#### Triggers

##### `add_patient`

Sets the `patient_id` on the root of the registration document and creates the person doc if required. Can be configured to either use a provided ID or generate a new unique one.

###### External Patient ID

If you are providing the patient id instead of having Sentinel generate you one, name the field in a `patient_id_field` key in `"params"`:

```json
{
    "name": "on_create",
    "trigger": "add_patient",
    "params": "{\"patient_id_field\": \"external_id\"}",
    "bool_expr": ""
}
```

In this example the provided id would be in `fields.external_id` on the registration document.

**NB:** this field must not be called `patient_id`.
**NB:** the JSON passed in `"params"` should still be a string. Support for raw JSON as shown below exists, but is in beta and may not always work correctly in all situations, because kanso.json does not support it:

```json
{
    "params": {"patient_id_field": "external_id"},
}
```


###### Alternative Name Location

To provide an alternative location for the patient name, either provide a `patient_name_field` in `"params"` or provide it directly into the `"params"` field as a String:

```json
{
    "params": "{\"patient_name_field\": \"full_name\"}",
}
```
```json
{
    "params": "full_name",
}
```

The first format is required if you wish to also provide other params:

###### Contact Type

If you have changed from the default contact hierarchy you will need to specify which type of contact the registration should create.

```json
{
    "params": "{ \"contact_type\": \"patient\" }"
}
```

###### Specific Parent *as of 3.8.0*

By default, the newly created person will have the same parent as the report submitter. 
A different parent may be selected by providing a location for the parent id. This field should
contain the `place_id` of the place in question. 
If the selected parent is invalid - does not exist or does not respect the configured hierarchy
 - the report is rejected as invalid and the person document is not created. As such
 , `report_accepted` event should check if the report has a `patient` property (or similar).

```json
 {
     "params": "{ \"parent_id\": \"parent_id\" }"
 }
```

###### Events

* `parent_field_not_provided` - triggered when the report does not have the required parent_id field
* `parent_invalid` - triggered when selected parent is invalid (parent document is found and
 either does not have a configured type or its type is not configured to be a parent to the
  person type to be created)
* `parent_not_found` - triggered when selected parent is not found 

The selected parent (if found) can be accessed by using the `parent` path in error messages: 
```Cannot create a person type "patient" under parent {{parent.place_id}}({{parent.contact_type}})```

##### `add_patient_id`

**Deprecated in favour of `add_patient`.** Previously this only added a `patient_id` to the root of the registration form. This functionality has been merged into `add_patient`. Now, using this event will result in the same functionality as described in `add_patient` above.

##### `add_expected_date`
##### `add_birth_date`
##### `assign_schedule`
##### `clear_schedule`

##### `add_place` *as of 3.8.0*

Sets the `place_id` on the root of the registration document and creates the place doc with the
provided type.

By default, the created place would have the same parent as the submitter. If such a combination is
invalid - for example a contact under a "clinic" attempts to create a new "health_center" - the
report will be rejected as errored and the place document will not be created. As such, 
`report_accepted` event should check if the report has a `place` property (or similar).
    
The created place does not have a primary contact.
The created place can be accessed by the `place` path in messages: 
```Place {{place.name}}({{place.place_id}}) added to {{place.parent.name}}({{place.parent.place_id}})```
 
###### Contact Type
 
Specifying the contact type is required, even if not using configurable hierarchies.
The selected contact type must be a configured place type. 

```json
{
    "params": "{ \"contact_type\": \"clinic\" }"
}
```

###### Specific Parent 

By default, the newly created place will have the same parent as the report submitter. 
A different parent may be selected by providing a location for the parent id. This field should
contain the `place_id` of the place in question. 
If the selected parent is invalid - does not exist or is not an acceptable parent to the
selected type in the configured hierarchy - the report will be rejected as errored. 

```json
 {
     "params": "{ \"parent_id\": \"parent_id\" }"
 }
 ```

###### Events

* `parent_field_not_provided` - triggered when the report does not have the required parent_id field
* `parent_invalid` - triggered when selected parent is invalid (parent document is found and
either does not have a configured type or its type is not configured to be a parent to the
place type to be created)
* `parent_not_found` - triggered when selected parent is not found 

The selected parent (if found) can be accessed by using the `parent` path in error messages: 
```'Cannot create a place type "health_center" under parent {{parent.place_id}}({{parent.contact_type}})'```

###### Alternative Name Location

The created place's name is provided in the `place_name` field by default.
To provide an alternative location for the place name, provide a `place_name_field` in
 `"params"`:

```json
{
    "params": "{\"place_name_field\": \"clinic_name\"}",
}
```

### Generate Shortcode on Contacts

No custom configuration for `generate_shortcode_on_contacts`.

### Generate Patient ID On People

**Deprecated since 3.8.x** in favor of `generate_shortcode_on_contacts`

No custom configuration for `generate_patient_id_on_people`.


### update_notifications

**Deprecated in favor of [Muting](#muting)**

#### Configuration

```
"notifications": {
    "off_form": "OFF",
    "on_form": "ON",
    "validations": {
      "join_responses": true,
      "list": []
    },
    "messages": [
      {
        "translation_key": "",
        "event_type": "on_mute",
        "recipient": "reporting_unit"
      },
      {
       "translation_key": "",
        "event_type": "on_unmute",
        "recipient": "reporting_unit"
      },
      {
        "translation_key": "",
        "event_type": "patient_not_found",
        "recipient": "reporting_unit"
      }
    ]
  }
```

### Muting

Implements muting/unmuting of persons and places. Supports multiple forms for each action, for webapp and sms workflows.

Muting action:

- updates target contact and all its descendants<sup>[1]</sup>, setting the `muted` property equal to the current `date` in ISO format<sup>[2]</sup>
- adds a `muting_history` entry to Sentinel `info` docs for every updated contact<sup>[7]</sup>
- updates all connected registrations<sup>[3]</sup>, changing the state of all unsent<sup>[4]</sup> `scheduled_tasks` to `muted`

Unmuting action:

- updates target contact's topmost muted ancestor<sup>[1][5]</sup> and all its descendants, removing the `muted` property
- adds a `muting_history` entry to Sentinel `info` docs for every updated contact<sup>[7]</sup>
- updates all connected registrations<sup>[3]</sup>, changing the state of all present/future<sup>[6]</sup> `muted` `scheduled_tasks` to `scheduled`

[1] Contacts that are already in the correct state are skipped. This applies to updates to the contact itself, updates to the Sentinel `muting_history` and to the connected registrations (registrations of a contact that is already in the correct state will not be updated).
[2] The date represents the moment Sentinel has processed the muting action
[3] target contact and descendants' registrations
[4] `scheduled_tasks` being in either `scheduled` or `pending` state
[5] Because the muted state is inherited, unmuting cascades upwards to the highest level muted ancestor. If none of the ancestors is muted, unmuting cascades downwards only.
[6] `scheduled_tasks` which are due today or in the future. All `scheduled_tasks` with a due date in the past will remain unchanged.

##### [7] Muting history
Each time the `muted` state of a contact changes, an entry is added to a `muting_history` list saved in Sentinel `info` docs (stored as an array property with the same name).
Entries in `muting_history` contain the following information:

| Property | Description |
| --- | --- |
| muted | Boolean representing the muted state |
| date | Date in ISO Format |
| report_id | An `_id` reference to the report that triggered the action |

#### Configuration
Configuration is stored in the `muting` field of `app_settings.json`.

| Property | Description |
|---|---|
| `mute_forms` | An array of form codes which will trigger muting. **Required** |
| `unmute_forms` | An array of form codes which will trigger unmuting. Optional. |
| `validations` | List of form fields validations. All mute & unmute forms will be subjected to these validation rules. Invalid forms will not trigger muting/unmuting actions. Optional. |
| `messages` | List of tasks/errors that will be created, determined by `event_type`. Optional. |

Supported `events_types` are:

| Event Type | Trigger |
|---|---|
| `mute` | On successful `mute` action |
| `unmute` | On successful `unmute` action |
| `already_muted` | On `mute` action, when target contact is already muted |
| `already_unmuted` | On `unmute` action, when target contact is already unmuted |
| `contact_not_found` | Either mute or unmute actions when target contact is not found |


##### Example

```
"muting": {
    "mute_forms": ["mute_person", "mute_clinic"],
    "unmute_forms": ["unmute_person", "unmute_clinic"],
    "validations": {
      "join_responses": true,
      "list": []
    },
    "messages": [
      {
        "translation_key": "",
        "event_type": "mute",
        "recipient": "reporting_unit"
      },
      {
        "translation_key": "",
        "event_type": "unmute",
        "recipient": "reporting_unit"
      },
      {
        "translation_key": "",
        "event_type": "already_muted",
        "recipient": "reporting_unit"
      },
      {
        "translation_key": "",
        "event_type": "already_unmuted",
        "recipient": "reporting_unit"
      },
      {
        "translation_key": "",
        "event_type": "contact_not_found",
        "recipient": "reporting_unit"
      }
    ]
  }
```

### self_report

Updates a `data_record` to set its patient to its sender. The resulting doc will have `fields.patient_uuid` and `fields.patient_id` filled with the sender's information. Provides hydrated patient information to subsequent transitions.
The `sender` is the contact associated with the phone number that sent the original SMS.  
If a doc already contains a `patient` field, does not have a sender or its `form` is not configured to be enabled for this transition, it will be ignored.

#### Configuration
Configuration is stored in the `self_report` field of `app_settings.json` as a list of objects connecting forms to messages.
Every object should have this structure:

| Property | Description |
|---|---|
| `form` | Form code. **Required** |
| `messages` | List of tasks/errors that will be created, determined by `event_type`. Optional. | 

Supported `events_types` are:

| Event Type | Trigger |
|---|---|
| `report_accepted` | On successful sender updating |
| `sender_not_found` | Sender not found |

##### Example

```json
"self_report": [
  {
    "form": "FORM",
    "messages": [
      {
        "event_type": "report_accepted",
        "recipient": "reporting_unit",
        "translation_key": "messages.form.report_accepted"
      },
      {
        "event_type": "sender_not_found",
        "recipient": "reporting_unit",
        "translation_key": "messages.form.sender_not_found"
      }
    ]
  },
  {
    "form": "OTHER",
    "messages": [
      {
        "event_type": "report_accepted",
        "recipient": "reporting_unit",
        "translation_key": "messages.other.report_accepted"
      },
      {
        "event_type": "sender_not_found",
        "recipient": "reporting_unit",
        "translation_key": "messages.other.sender_not_found"
      }
    ]
  }
]
```
