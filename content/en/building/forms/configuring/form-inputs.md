---
title: "Input data available in forms"
linkTitle: "Form Inputs"
weight: 
description: >
  Data accessible from within CHT forms
relatedContent: >
  building/forms
  building/contact-summary/contact-summary-templated
  building/tasks/managing-tasks/pass-data-to-form  
aliases:
   - /building/guides/forms/form-inputs
   - /apps/guides/forms/form-inputs
---

CHT forms have access to varying amounts of input data depending on the type of form and its source.

## `contact` forms

Available data:

- [initial contact data]({{< ref "#initial-contact-data-in-contact-forms" >}})
- [`inputs` data for user]({{< ref "#user-data" >}}) 
- [Contact data via contact selector]({{< ref "#contact-selector" >}})

### Initial contact data in `contact` forms

#### Create forms

Forms for adding contacts have access to a small group of fields contained in a top-level group that is named for the contact_type id of the contact being added (so `person`, `clinic`, etc). (This is the same group used to create the contact document when the form is completed.)

| type        | name          | label        | hint                                                          |
|-------------|---------------|--------------|---------------------------------------------------------------|
| begin group | person        | NO_LABEL     |                                                               |
| hidden      | parent        | Parent Id    | Contains the doc id for the new contact's parent contact doc. |
| hidden      | contact_type  | Contact Type | The contact_type id of the contact.                           |
| end group   |               |              |                                                               |

#### Edit forms

Forms for editing contacts have access to _all the contact's current data_. These fields are contained in a top-level group that is named for the contact_type id of the contact being added (so `person`, `clinic`, etc). If fields in the top-level group are [edited by the form]({{< ref "building/forms/contact" >}}), these changes will be saved to the contact's doc.

In addition, the contact's `parent` data is hydrated so that the form has access to the data stored on the parent contact doc in the `parent` group.

| type        | name   | label       | hint                                                    |
|-------------|--------|-------------|---------------------------------------------------------|
| begin group | person | NO_LABEL    |                                                         |
| begin group | parent | Parent      | Contains the data for the contact's parent contact doc. |
| hidden      | name   | Parent name | The name of the parent contact                          |
| end group   | parent |             |                                                         |
| end group   |        |             |                                                         |

---

## `app` forms

Available data:

- [`inputs` data for source]({{< ref "#form-source" >}})
- [`inputs` data for contact]({{< ref "#inputs-data-for-contact-in-app-forms" >}})
- [`contact-summary` data]({{< ref "#contact-summary-data" >}})
- [`inputs` data from task]({{< ref "#inputs-data-from-task" >}})
- [`inputs` data for user]({{< ref "#user-data" >}})
- [Contact data via contact selector]({{< ref "#contact-selector" >}})

### Form source

If a form is created from the "People" tab, `inputs/source` will be set to "contact". If a form is created from a task, `inputs/source` will be set to "task".

{{% alert title="Note" %}}
The `source` field is also available at the top level (not nested in the `inputs` group).
{{% /alert %}}

### `inputs` data for contact in `app` forms

`app` forms with a contact in context have access to that contact's data in the `inputs/contact` group.

{{% alert title="Note" %}}
The `contact` group is also available at the top level (not nested in the `inputs` group).
{{% /alert %}}

The `contact` group contains all the fields from the doc of the contact in context. If a _place_ is in context, the primary person for that place will be hydrated in the `inputs/contact/contact` group. Alternatively, when a _person_ is in context, the parent place for the person will be hydrated in `inputs/contact/parent`.

{{% alert title="Note" %}}
Contact data is not available in forms created from the "Reports" tab.
{{% /alert %}}

### `contact-summary` data

`app` forms with a contact in context can access the contact-summary data associated with the contact. This is done by referencing an instance named `contact-summary`. E.g. `instance('contact-summary')/context/${variable}`.  See [the reference documentation]({{< ref "building/contact-summary/contact-summary-templated#care-guides" >}}) for more information.

{{% alert title="Note" %}}
Contact summary data is not available in `contact` forms or in forms created from the "Reports" tab.
{{% /alert %}}

### `inputs` data from task

`app` forms created via a task have access to any data [supplied by the task]({{< ref "building/tasks/managing-tasks/pass-data-to-form" >}}) in the `inputs` group. 

Additionally, these forms have access to the [contact data]({{< ref "#inputs-data-for-contact-in-app-forms" >}}) for the contact associated with the task.

The following fields will also be available in the `inputs` group:

- `task_id`: The unique identifier of the task in context.
- `source_id`: For tasks with `appliesTo: 'contacts`, this is the id of the contact for the task. For tasks with `appliesTo: 'reports'`, this is the id of the report which triggered the task.

---

## `user` data

Both `app` and `contact` forms can access the current user's data at `inputs/user`.  The data provided is simply the [`user-settings` doc for the user]({{< ref "core/overview/db-schema#users" >}}) (e.g. `org.couchdb.user:username`) plus an additional `language` field that contains the user's currently selected language code.

{{% alert title="Note" %}}
The `user-settings` doc for the user is _NOT_ the same as the CHT _contact_ doc for the user.
{{% /alert %}}

### Example of saving `user` data as metadata on a report

| type        | name                   | label                                | calculation                |
|-------------|------------------------|--------------------------------------|----------------------------|
| begin group | inputs                 | NO_LABEL                             |                            |
| begin group | user                   | NO_LABEL                             |                            |
| string      | contact_id             | User's contact id                    |                            |
| string      | facility_id            | Id for user's facility               |                            |
| name        | name                   | Username                             |                            |
| end group   |                        |                                      |                            |
| end group   |                        |                                      |                            |
| calculate   | created_by             | Username that created report         | ../inputs/user/name        |
| calculate   | created_by_person_uuid | UUID that created report             | ../inputs/user/contact_id  |
| calculate   | created_by_place_uuid  | Facility of user that created report | ../inputs/user/facility_id |

### Loading the user's contact data

While the `inputs/user` group does not contain the user's contact data, it does contain the user's `contact_id` which can be used to load the contact doc via a [contact selector]({{< ref "#loading-contact-data-for-use-in-other-expressions" >}}).

## Contact selector

Using a contact selector allows you to load data from the selected contact (person or place). The contact's id can be provided by the form or the user can search for an existing contact.

To select a contact in a form, create a field with the type `string` and set the appearance to `select-contact type-{{contact_type_1}} type-{{contact_type_2}} ...`. Setting multiple contact_type ids allows the user to search among multiple types of contacts. If no contact type appearance is specified then all contact types will be queried when searching.

{{% alert title="Note" %}}
For CHT version `v3.9.x` and below, contacts must be selected by setting the field type to `db:{{contact_type}}` and the appearance to `db-object` (instead of using `string` and `select-contact`).
{{% /alert %}}

### Searching for a contact

When a contact selector question is visible in a form, the user can search for a contact by typing in the search box.

A value can be pre-selected for the search box via a `calculate` expression. By default, the user can change the selected value, but this can be prevented by setting `read_only = true`.

| type        | name         | label        | appearance                 | calculate                    |
|-------------|--------------|--------------|----------------------------|------------------------------|
| string      | person_id    | Person ID    | select-contact type-person |                              |
| string      | household_id | Household ID | select-contact type-clinic | ../inputs/contact/parent/_id |

### Loading descendants of the current contact

Use the appearance `descendant-of-current-contact` to load the current contact's descendants when opening an app form or contact form from the "People" tab.

| type        | name              | label               | appearance                                                |
|-------------|-------------------|---------------------|-----------------------------------------------------------|
| string      | household_members | Household's members | select-contact type-person descendant-of-current-contact  |

### Loading additional contact data 

Additional data about the contact can be loaded by adding fields to the same group as the contact selector. The field name must match the name of a field on the contact doc. The data will be loaded when the contact is selected and will overwrite any existing data in the field.

{{% alert title="Warning" %}}
The data loaded by the contact selector will overwrite any existing data in fields that are in the same group as the contact selector and share the same name as a field on the selected contact. Data will not be written into matching fields if `bind-id-only` is included in the appearance.
{{% /alert %}}

| type        | name            | label                   | appearance                 |
|-------------|-----------------|-------------------------|----------------------------|
| begin group | selected_person | NO_LABEL                |                            |
| string      | person_id       | Person ID               | select-contact type-person |
| string      | name            | Name of selected person |                            |
| end group   | selected_person |                         |                            |

#### Loading contact data for use in other expressions

One powerful way to use the contact selector is to automatically load data about an existing contact for usage in various expressions within the form. This can be done with a combination of functionality we have already seen!

In the following example, we are loading the name of the current user from the associated contact doc:

| type        | name         | label                 | appearance                        | calculate            |
|-------------|--------------|-----------------------|-----------------------------------|----------------------|
| begin group | inputs       | NO_LABEL              |                                   |                      |
| begin group | user         | NO_LABEL              |                                   |                      |
| hidden      | contact_id   | User's Contact ID     |                                   |                      |
| end group   | user         |                       |                                   |                      |
| end group   | inputs       |                       |                                   |                      |
| begin group | intro        | NO_LABEL              | field-list                        |                      |
| begin group | current_user | NO_LABEL              |                                   |                      | 
| string      | _id          | User's Contact ID     | hidden select-contact type-person | ${contact_id}        |
| string      | name         | User's name           | hidden                            |                      |
| end group   | current_user |                       |                                   |                      | 
| calculate   | user_name    | Supervisor name       |                                   | ../current_user/name |
| note        | welcome      | Welcome ${user_name}! |                                   |                      |
| end group   | intro        |                       |                                   |                      |

{{% alert title="Note" %}}
When loading "hidden" contact data, it is recommended to nest the group inside an existing page (created by a group with the `field-list` appearance). This is because there is [a known issue](https://github.com/medic/cht-core/issues/8226) that results in an empty page being added to the form when a top-level group had no visible questions.
{{% /alert %}}

### Conditionally selecting/loading contact data for the current contact

[As noted above]({{< ref "#app-forms" >}}), when opening an `app` form with a contact in context (e.g. when opening the form from the "People" tab), the contact's data will be available in the `inputs/contact` group. However, this data _is not available_ when opening the form from the "Reports" tab since there is no contact in context.

A common pattern for enabling consistent form behavior in this case is to use a contact selector in the `inputs/contact` group and make the `inputs` group only relevant when the default `source` value is not overridden (the `source` field is populated with specific values when the form is opened [from the "People" tab or from a task]({{< ref "#form-source" >}})). With this pattern, the contact selector will only be visible when the form is opened from the "Reports" tab and the user can select the contact they want to report on. This will ensure that the `inputs/contact` data is always available regardless of how the form is opened.

Then, this contact data can be used to link the report created from the form to the person or place in context (or the person selected when opening the form). Getting the values for `_id` or `patient_id` and setting them to `patient_id` or `patient_uuid` on the final report will link that report to the contact. Then the report will be displayed on the contact's summary page.

| type        | name         | label        | appearance                 | calculate             | relevant           | default |
|-------------|--------------|--------------|----------------------------|-----------------------|--------------------|---------|
| begin group | inputs       | NO_LABEL     | field-list                 |                       | ./source = 'user'  |         |
| hidden      | source       | Source       |                            |                       |                    | user    |
| begin group | contact      | NO_LABEL     |                            |                       |                    |         | 
| string      | _id          | Patient ID   | select-contact type-person |                       |                    |         |
| string      | patient_id   | Medic ID     | hidden                     |                       |                    |         |
| end group   | contact      |              |                            |                       |                    |         | 
| end group   | inputs       |              |                            |                       |                    |         |
| calculate   | patient_uuid | Patient UUID |                            | ../contact/_id        |                    |         |
| calculate   | patient_id   | Patient ID   |                            | ../contact/patient_id |                    |         |
