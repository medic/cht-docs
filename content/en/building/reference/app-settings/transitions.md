---
title: ".transitions"
linkTitle: ".transitions"
weight: 5
description: >
  **Sentinel Transitions**: functions executed when database documents change
relatedContent: >
  building/reference/app-settings/_index.md#sms-recipient-resolution
aliases:
   - /apps/reference/app-settings/transitions
   - /technical-overview/transitions/
---

When sentinel detects a document has changed it runs transitions against the doc. These transitions can be used to generate a short form patient id or assign a report to a facility.

## How transitions work

A transition is a Javascript code that runs when a document is changed.  A transition can edit the changed doc or do anything server-side code can do for that matter.

Transitions are run in series, not in parallel:

* For a given change, you can expect one transition to be finished before the next runs.

* You can expect one change to be fully processed by all transitions before the next starts being processed.

Transitions obey the following rules:

* has a `filter({ id, doc, info })` function that accepts the changed document as an argument and returns `true` if it needs to run/be applied.

* a `onMatch({ id, doc, info })` function that will run on changes that pass the filter. Should return true when the transition has run successfully.

* can have an `init()` function to do any required setup and throw Errors on invalid configuration.

* It is not necessary for an individual transition to save the changes made to `doc` to the DB, the doc will be saved once all the transitions have been edited.
  If an individual transition saves the document provided at `doc`, it takes responsibility for re-attaching the newly saved document (with new seq etc) at `doc`

* guarantees the consistency of a document.

* runs serially and in specific order.  A transition is free to make async calls but the next transition will only run after the previous transition's match function executed. If your transition is dependent on another transition, it should be sorted so it runs after the dependee transition. 

* is repeatable, it can run multiple times on the same document without negative effect.  You can use the `transitions` property on a document's infodoc to determine if a transition has run.

Regardless of whether the doc is saved or not, the transitions will all be run (unless one crashes).

When your transition encounters an error, there are different ways to deal with it. You can :
- finish your transition by throwing an error that has a truthy `changed` property. This will save the error to `doc`.
- finish your transition by throwing an error. The error will be logged to the sentinel log. This will not save the error on the `doc`, so there will be no record that this transition ran. That particular `change` will not go through transitions again, but if the same doc has another change in the future since there is no record of the erroring transition having run, it will be rerun.
- crash sentinel. When sentinel restarts, since that `change` did not record successful processing, it will be reprocessed. Transitions that did not save anything to the `doc` will be rerun.


## Configuration

By default all transitions are disabled. They can be enabled by configuring the `transitions` property to have a key with the transitions name and a `truthy` value. 
As of version 3.12.0 some transitions will partially run on the client for offline users. To opt out from client-side transitions, add a `"client_side: false"` property to the transition configuration.

```json
{
  "transitions": {
    "a": { },
    "b": true,
    "c": { "disable": false },
    "d": { "disable": true },
    "e": { "client_side": false }
  }
}
```

In the example above, the `d` transition will not be applied, `a`, `b` `c` will be applied on the server and on the client, while `e` will only be applied on the server. 

## Available transitions

The following transitions are available and executed in order.

| Key | Description |
|---|---|
| maintain_info_document | Records metadata about the document such as when it was replicated. Enabled by default. |
| [update_clinics](#update_clinics) | Adds a contact's info to a new data record. This is used to attribute an incoming SMS message or report to the appropriate contact. The `rc_code` value on the contact is used to match to the value of the form field set as the `facility_reference` in the [JSON form definition]({{< ref "building/reference/app-settings/forms#app_settingsjson-forms" >}}). This matching is useful when reports are sent on behalf of a facility by unknown or various phone numbers. If `facility_reference` is not set for a form, the contact match is attempted using the sender's phone number. If a form is not public and a match is not found then the `sys.facility_not_found` error is raised. A message will be sent out whenever this error is raised. |
| [registration](#registration) | For registering a patient or place to a schedule. Performs some validation and creates the patient document if the patient does not already exist. Can create places (as of 3.8.x). Can assign schedules to places (as of 3.11.x) |
| [accept_patient_reports](#accept-patient-reports) | Validates reports about a patient or place and silences relevant reminders. |
| [accept_case_reports](#accept-case-reports) | Validates reports about a case, assigns the associated place_uuid, and silences relevant reminders. Available since 3.9.0 |
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
| [muting](#muting) | Implements muting/unmuting actions of people and places. Available since 3.2.x. Is partially applied on the client, as of 3.12.0. |
| [mark_for_outbound]({{% ref "building/reference/app-settings/outbound" %}}) | Enables outbound pushes. Available since 3.5.x |
| [self_report](#self_report) | Maps patient to sender. Available since 3.9.x |
| [create_user_for_contacts](#create_user_for_contacts) | Allows for automatically creating or replacing users based on data from their associated contact. Available since 4.1.x  | |

Below are guides to setup specific transitions.

## multi_report_alerts

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

##### Configuration

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

## death_reporting

Updates patient documents with a `date_of_death` field which updates how the patient is displayed in the UI.

##### Configuration

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

## registration

Configuration is held at `app_settings.registrations`, as a list of objects connecting forms to validations, events and messages.

#### Events

Lists different events.

##### `on_create`

This is the only supported event.

#### Triggers

##### `add_patient`

Sets the `patient_id` on the root of the registration document and creates the person doc if required. Can be configured to either use a provided ID or generate a new unique one.

###### External Patient ID

If you are providing the patient ID instead of having Sentinel generate you one, name the field in a `patient_id_field` key in `"params"`:

```json
{
    "name": "on_create",
    "trigger": "add_patient",
    "params": "{\"patient_id_field\": \"external_id\"}",
    "bool_expr": ""
}
```

In this example the provided ID would be in `fields.external_id` on the registration document. This field **must not** be called `patient_id`.

> [!NOTE]
> The JSON passed in `"params"` should be a string. Support for raw JSON as shown below exists, but is in beta and may not always work correctly in all situations, because kanso.json does not support it:
> 
> ```json
> {
>     "params": {"patient_id_field": "external_id"},
> }
> ```

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

##### `add_case` *as of 3.9.0*

Sets the `case_id` on the root of the registration document.

## generate_shortcode_on_contacts

There is no custom configuration for `generate_shortcode_on_contacts`.

## generate_patient_id_on_people

**Deprecated since 3.8.x** in favor of `generate_shortcode_on_contacts`

There is no custom configuration for `generate_patient_id_on_people`.


## update_notifications

**Deprecated in favor of [Muting](#muting)**

##### Configuration

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

## muting

Implements muting/unmuting of persons and places. Supports multiple forms for each action, for webapp and sms workflows.
### Muting action 

Updates the target contact and all its descendants, setting the `muted` property equal to the current date in ISO format.

#### Client-side

*Added in 3.12.0*

Client-side muting runs offline on a user's device. Only the contacts and reports available on the device will be updated.

- Sets the `muted` property on the target contact and all its descendants to the device's current `date` (the moment the report is processed). 
- Adds/updates the [`muting_history` property]({{< ref "#client-side-muting-history" >}}) on every updated contact, to keep track of all the updates that have been processed client-side, as well as the last known server-side state of the contact and sets the `last_update` property to `client_side`
- Updates the report doc to add a `client_side_transitions` property to track which transitions have run client-side

#### Server-side

Server-side muting runs as a typical Sentinel transition. Contacts that are already in the correct state are skipped. This applies to updates to the contact itself, updates to the Sentinel `muting_history` and to the connected registrations (registrations of a contact that is already in the correct state will not be updated).

- Sets the `muted` property on the target contact and all its descendants to the moment Sentinel processed the muting action.
  - If the contact was already muted by a client, the `muted` date will be overwritten. The [client-side `muting_history`]({{< ref "#client-side-muting-history" >}}) will have a copy of the client-side muting date.
- Adds a [`muting_history` entry]({{< ref "#server-side-muting-history" >}}) to Sentinel `info` docs for every updated contact
- Updates all connected registrations (for the target contact and descendants), changing the state of all unsent `scheduled_tasks` to `muted`
  - Unsent `scheduled_tasks` have either a `scheduled` or `pending` state
- Updates the contact's client-side `muting_history` to set the `last_update` property to `server_side` and update the `server_side` section with the current date and muted state. 
- If the report was processed client-side, all "following" muting/unmuting events that have affected the same contacts will be replayed. This means the transition _could_ end up running multiple times over the same report. 
  - Replaying is required due to how PouchDB <-> CouchDB synchronization does not respect the order in which the documents have been created, to ensure that contacts end up in the correct muted state.

### Unmuting action

Updates the target contact's topmost muted ancestor and all its descendants, removing the `muted` property. Because the muted state is inherited, unmuting cascades upwards to the highest level muted ancestor. If none of the ancestors is muted, unmuting cascades downwards only.

#### Client-side

*Added in 3.12.0*

Client-side unmuting runs offline on a user's device. Only the contacts and reports available on the device will be updated.

- Adds/updates the [`muting_history` property]({{< ref "#client-side-muting-history" >}}) on every updated contact, sets the last known server-side state of the contact and sets the `last_update` property to `client_side`
- Updates the report doc to add a `client_side_transitions` property to track which transitions have run client-side

#### Server-side

Server-side unmuting runs as a typical Sentinel transition. Contacts that are already in the correct state are skipped. This applies to updates to the contact itself, updates to the Sentinel `muting_history` and to the connected registrations (registrations of a contact that is already in the correct state will not be updated).

- Adds a [`muting_history` entry]({{< ref "#server-side-muting-history" >}}) to Sentinel `info` docs for every updated contact
- Updates all connected registrations (for the target contact and descendants), changing the state of all present/future `scheduled_tasks` (ones due today or in the future) with the `muted` state to have the `scheduled` state.
  - All `scheduled_tasks` with a due date in the past will remain unchanged.
- Updates the contact's [client-side `muting_history`]({{< ref "#client-side-muting-history" >}}) to set the `last_update` property to `server_side` and update the `server_side` section with the current date and muted state.
- If the report was processed client-side, all "following" muting/unmuting events that have affected the same contacts will be replayed. This means the transition _could_ end up running multiple times over the same report.
  - Replaying is required due to how PouchDB <-> CouchDB synchronization does not respect the order in which the documents have been created, to ensure that contacts end up in the correct muted state.

### Muting history

#### Server-side muting history

Each time the `muted` state of a contact changes, an entry is added to a `muting_history` list saved in Sentinel `info` docs (stored as an array property with the same name).
Entries in `muting_history` contain the following information:

| Property | Description |
| --- | --- |
| muted | Boolean representing the muted state |
| date | Date in ISO Format |
| report_id | An `_id` reference to the report that triggered the action |

#### Client-side muting history

*Added in 3.12.0*

Each time the client changes the `muted` state of a contact, an entry is added to a `muting_history` property on the contact's doc. The `last_update` entry is also changed to `client_side`.
The `muting_history` property contains the following information:

| Property | Values | Description | 
| --- | ---- | ---- |
| last_update | `server_side` or `client_side` | Updated every time a service updates the contact, with the corresponding value | 
| server_side | Object |  |
| server_side.muted | `true` or `false` | Last known server-side muting state |
| server_side.date | Date in ISO format | Last known server-side muting/unmuting date | 
| client_side | Array | Client-side muting/unmuting events list. <br> New events are pushed at the end of this list and it should never be re-ordered. <br>The list represents the "chronological" order in which the reports that triggered muting were created. | 
| client_side[].muted | `true` or `false` | Client-side muting state | 
| client_side[].date | Date in ISO format | Client-side muting/unmuting date |
| client_side[].report_id | uuid | The uuid  of the muting/unmuting report that triggered the update |

##### Configuration
Configuration is stored in the `muting` field of `app_settings.json`.

| Property | Description |
|---|---|
| `mute_forms` | An array of form codes which will trigger muting. **Required** |
| `unmute_forms` | An array of form codes which will trigger unmuting. Optional. |
| `validations` | List of form fields validations. All mute & unmute forms will be subjected to these validation rules. Invalid forms will not trigger muting/unmuting actions. Optional. |
| `messages` | List of tasks/errors that will be created, determined by `event_type`. Optional. |

> [!IMPORTANT]
> Contact forms cannot trigger muting or unmuting, but any `data_record` that has a `form` property (typically a [Report]({{< ref "technical-overview/concepts/db-schema#reports" >}})) can.


Supported `events_types` are:

| Event Type | Trigger |
|---|---|
| `mute` | On successful `mute` action |
| `unmute` | On successful `unmute` action |
| `already_muted` | On `mute` action, when target contact is already muted |
| `already_unmuted` | On `unmute` action, when target contact is already unmuted |
| `contact_not_found` | Either mute or unmute actions when target contact is not found |


> [!NOTE]
> When muting events are processed both client-side and server-side, there is no guarantee that the state of the database will be the same between the two processing events. Some possible cases where the data is changed in significant ways, that will affect the final muting state are:  
> - updated muting settings between client and server processing of the same report / contact
> - editing the muting/unmuting reports before they are synced, but after the transition ran locally, that either change the target contact or change the validity of the report
> - deleting muting/unmuting reports before they are synced   
> - validation rules that depend on database data (for example using the "exists" rule, which will run over different data sets, a report could be valid for the client but invalid for the server and the other way around).
> - conflicts that overwrite `muting_history` for contacts
> - delayed sync for some docs (either contacts or reports) could exacerbate the above because of the "replay" behavior.

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

## accept_patient_reports

Allow reporting about patient and place centric workflows by
- validating the report
- assigning the relevant subject (patient or place) to the report if a registration with the given shortcode (patient_id or place_id) exists
- clearing messages on the registration
- generating response messages on the report

##### Example

```json
"transitions": {
  "accept_patient_reports": true
},
"registrations": [{
  "form": "P",
  "events": [{
    "name": "on_create",
    "trigger": "assign_schedule",
    "params": "ANC Reminders",
    "bool_expr": "!doc.fields.last_menstrual_period || !(/^[0-9]+$/.test(doc.fields.last_menstrual_period))"
  }]
}],
"schedules": [{
  "name": "ANC Reminders",
  "translation_key": "schedule.anc_no_lmp",
  "summary": "",
  "description": "",
  "start_from": "reported_date",
  "messages": []
}],
"patient_reports": [{
  "form": "pregnancy_visit",
  "silence_type": "ANC Reminders",
  "silence_for": "8 days",
  "fields": [],
  "validations": {},
  "messages": [{
    "translation_key": "messages.pregnancy_visit",
    "event_type": "report_accepted",
    "recipient": "clinic"
  }]
}]
```

## accept_case_reports

Allow reporting about case centric workflows by
- validating the report configuration documentation,
- assigning the relevant place to the report if a registration with the given case_id exists,
- clearing messages on the registration, and
- generating response messages on the report.

##### Example

```json
"registrations": [{
  "form": "8",
  "events": [{
    "name": "on_create",
    "trigger": "add_case"
  }]
}],
"accept_case_reports": [{
  "form": "SIGNOFF",
  "validations": {},
  "messages": [{
    "event_type": "report_accepted",
    "bool_expr": "some expression",
    "message": "some message",
    "recipient": "some recipients"
  }]
}]
```

## self_report

Updates a `data_record` to set its patient to its sender. The resulting doc will have `fields.patient_uuid` and `fields.patient_id` filled with the sender's information. Provides hydrated patient information to subsequent transitions.
The `sender` is the contact associated with the phone number that sent the original SMS.  
If a doc already contains a `patient` field, does not have a sender or its `form` is not configured to be enabled for this transition, it will be ignored.

##### Configuration
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

## update_clinics
Adds a contact’s info to a data record so as to attribute an incoming SMS message or report to the appropriate contact. 

##### Configuration
As of version 3.12 you can add configuration to send a message whenever a contact match fails while running this transition. Configuration is stored in the `update_clinics` field of app_settings.json as a list of objects connecting forms to messages. Every object should have this structure:

| Property | Description |
|---|---|
| `form` | Form code. |
| `messages` | List of tasks/errors that will be created, determined by `event_type`. | 

Supported `events_types` are:

| Event Type | Trigger |
|---|---|
| `sys.facility_not_found` | Facility not found |

If this configuration is not set then the message defaults to what is set in the `messages.generic.sys.facility_not_found` key.

##### Example
```json
"update_clinics": [
  {
    "form": "FORM",
    "messages": [
      {
        "event_type": "sys.facility_not_found",
        "recipient": "reporting_unit",
        "translation_key": "sys.facility_not_found"
      }
    ]
  },
  {
    "form": "OTHER",
    "messages": [
      {
        "event_type": "sys.facility_not_found",
        "recipient": "reporting_unit",
        "translation_key": "messages.other.facility_not_found"
      }
    ]
  }
]
```

## create_user_for_contacts

Users are automatically created for certain contacts.  Both creating a new user for a new contact and replacing an existing user with a new user are supported.

##### Configuration

Several configurations are required in `app_settings` to enable the `create_user_for_contacts` transition.

[Login by SMS]({{< ref "building/reference/api#login-by-sms" >}}) must be enabled by setting the `token_login` configuration.

The [`app_url` property]({{< ref "building/reference/app-settings#app_settingsjson" >}}) must be set to the URL of the application. This is used to generate the token login link for the new user.

##### Example
```json
"app_url": "https://demo.app.medicmobile.org",
"token_login": {
  "enabled": true,
  "translation_key": "sms.token.login.help"
},
"transitions": {
  "create_user_for_contacts": true
}
```

When adding a new person contact, the `create_user_for_contacts` transition can be triggered to create a new user associated with that contact. _Available since 4.2.x._

##### Example scenario

A supervisor can onboard a CHW just by creating a new person contact for the CHW with a "create contact" form.

Once the new contact is synced with the server and has been processed by Sentinel, a user will be automatically created and the new CHW will receive an SMS message (at the phone number specified in the contact) containing a token login link. This link will allow them to login as the newly created user. For security reasons, the token login link is valid for only one use and can only be used within 24 hours.

##### Form Configuration

When the `create_user_for_contacts` transition is enabled, Sentinel will attempt to create a user for any _newly created_ `person` contacts with the `user_for_contact.create` field set to `'true'`. So, `contact` forms and `app` forms for adding persons that should trigger new user creation need to include a `user_for_contact` group that contains a `create` field. The calculation for the value of the `create` field should evaluate to `'true'` when a new user is desired.  Any other value for that field will not trigger user creation.

Once Sentinel has generated a user for the contact, the `user_for_contact.create` field will be automatically removed from the contact document.

Users are only generated for newly created contacts.  Editing an existing contact will not trigger user creation regardless of the value set for the `user_for_contact.create` field.

###### Required contact fields

The new person contacts _must_ have the following fields set:

- `name`
- `phone` - must be set to a valid number
- `roles` - must contain the desired roles for the new user _(if just a single role is needed, the `role` field on the contact may be used instead)_

See the `person-create` contact form provided in the [Default config](https://github.com/medic/cht-core/tree/master/config/default) as an example. This form will trigger the creation of a new user for the contact when the role is set to `chw` or `chw_supervisor` and a phone number is provided.

### Replace User

An existing offline user can be replaced on a device so that a new user can use that device without needing to immediately sync with the server. _Available since 4.1.x._

##### Example scenario

Imagine a CHW is leaving the program, and the CHW's device is returned to their supervisor. The supervisor wants to transfer the device to a new CHW immediately without having the device online to sync with the server.

To do this, when the `create_user_for_contacts` transition is enabled, the supervisor would submit a configured user replacement form for the original user's contact on the device. This form can create a new contact for the new CHW and will trigger a client-side transition to mark the original contact as replaced. After that, the supervisor can give the device to the new CHW, and they can begin using it.

Subsequent reports submitted on the device by the new CHW will be associated with the new contact. When the device is eventually able to synchronize with the server, it will be automatically logged out so the transition to the new user can be completed. A server-side transition will be triggered to initialize the new user for the new CHW. An SMS message containing a token login link will be sent to the new CHW allowing them to login as the initialized user. The password for the original user will be automatically reset by the server-side transition causing any remaining sessions for the original user (e.g. on other devices) to be logged out.

##### Details

This process does not actually delete the original user, but just resets the password to a random value. To recover the original user, a server administrator should update the user's password to a known value or re-issue a token login link for the user (if enabled).

Because the server-side transition immediately invalidates any remaining sessions for the original user, it is not recommended to use this process for replacing users that are logged in on multiple devices simultaneously. The data on the device used to replace the user will always be completely synchronized before the user is replaced. However, un-synced data from other devices can be left on those devices when the user is replaced using a separate device.

##### `replace_forms` Configuration

User replacement via the `create_user_for_contacts` transition is triggered by submitting a configured `app` form for the original user's contact.

The IDs of the `app` forms that should trigger the transition must be configured in the `create_user_for_contacts.replace_forms` array in the `app_settings`.

Then, the actual forms must set the `replacement_contact_id` property to the id of the contact that should be associated with the new user.

These forms should only be submitted for the _original user's contact_. You can control the form visibility by including `user._id === contact._id` in the form properties expression.

These forms should only be accessible to offline users (replacing online users is not currently supported). This is the default in the example app form properties file ([see `replace_user.properties.json`](https://github.com/medic/cht-core/blob/master/config/default/forms/app/replace_user.properties.json)).

You can prevent a user from being replaced multiple times by including `!contact.user_for_contact || !contact.user_for_contact.replace` in the form properties expression.  _(This expression is not recommended for situations where multiple users can be associated with the same contact since replacing one of the users would prevent any of the other users for that contact from accessing the form.)_

See the `replace_user` app form provided in the [Default config](https://github.com/medic/cht-core/tree/master/config/default) as an example.

##### Example `app_settings`
```json
"create_user_for_contacts": {
  "replace_forms": [
    "replace_user"
  ]
}
```

## Troubleshooting

Configuration is validated when Sentinel starts. Issues with the configuration will be show in the Sentinel logs.

Errors occurring during the client-side transition will be recorded in the browser's console. This is where problems with processing reports from the replace forms will be logged. 

Errors occurring during the server-side transition will be recorded in the Sentinel logs and on the contact doc for the original user. So, if the client-side transition marks the original user for replacement, but Sentinel fails to create the new user, the failure will be recorded on the original contact doc in the `errors` array.
