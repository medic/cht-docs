---
title: "Input data available in forms"
linkTitle: "Form Inputs"
weight: 
description: >
  Data accessible from within CHT forms
relatedContent: >
  apps/reference/contact-page
  apps/guides/tasks/pass-data-to-form
  
---

CHT forms have access to varying amounts of input data depending on the type of form and its source.

## `contact` forms

Available data:

- [`inputs` data for contact]({{< ref "apps/guides/forms/form-inputs#inputs-data-for-contact-in-contact-forms" >}})
- [`inputs` data for user]({{< ref "apps/guides/forms/form-inputs#user-data" >}}) 
- [Contact data via contact selector]({{< ref "apps/guides/forms/form-inputs#contact-selector" >}})

### `inputs` data for contact in `contact` forms

Forms for adding contacts have access to a small group of fields nested in the `inputs` group.  These fields are contained in a group that is named for the contact_type id of the contact being added (so `person`, `clinic`, etc).

{{% alert title="Note" %}}
This group of fields is also available at the top level (not nested in the `inputs` group).
{{% /alert %}}

| type        | name          | label        | hint                                                          |
|-------------|---------------|--------------|---------------------------------------------------------------|
| begin group | inputs        | NO_LABEL     |                                                               |
| begin group | person        | NO_LABEL     |                                                               |
| hidden      | parent        | Parent Id    | Contains the doc id for the new contact's parent contact doc. |
| hidden      | contact_type  | Contact Type | The contact_type id of the contact.                           |
| end group   |               |              |                                                               |
| end group   |               |              |                                                               |

---

## `app` forms

Available data:

- [`inputs` data for source]({{< ref "apps/guides/forms/form-inputs#form-source" >}})
- [`inputs` data for contact]({{< ref "apps/guides/forms/form-inputs#inputs-data-for-contact-in-app-forms" >}})
- [`contact-summary` data]({{< ref "apps/guides/forms/form-inputs#contact-summary-data" >}})
- [`inputs` data from task]({{< ref "apps/guides/forms/form-inputs#inputs-data-from-task" >}})
- [`inputs` data for user]({{< ref "apps/guides/forms/form-inputs#user-data" >}})
- [Contact data via contact selector]({{< ref "apps/guides/forms/form-inputs#contact-selector" >}})

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

`app` forms with a contact in context can access the contact-summary data associated with the contact. This is done by referencing an instance named `contact-summary`. E.g. `instance('contact-summary')/context/${variable}`.  See [the reference documentation]({{< ref "apps/reference/contact-page#care-guides" >}}) for more information.

{{% alert title="Note" %}}
Contact summary data is not available in `contact` forms or in forms created from the "Reports" tab.
{{% /alert %}}

### `inputs` data from task

`app` forms created via a task have access to any data [supplied by the task]({{< ref "apps/guides/tasks/pass-data-to-form" >}}) in the `inputs` group. 

---

## `user` data

Both `app` and `contact` forms can access the current user's data at `inputs/user`.  The data provided is simply the [CouchDB doc for the user](https://docs.couchdb.org/en/stable/intro/security.html?highlight=org.couchdb.user#users-documents) (e.g. `org.couchdb.user:username`) plus an additional `language` field that contains the user's currently selected language code.

{{% alert title="Note" %}}
The CouchDB doc for the user is _NOT_ the same as the CHT _contact_ doc for the user.
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

While the `inputs/user` group does not contain the user's contact data, it does contain the user's `contact_id` which can be used to load the contact doc via a [contact selector]({{< ref "apps/guides/forms/form-inputs#contact-selector" >}}).

## Contact selector

Using a contact selector allows you to load data from the selected contact (person or place). The contact's id can be provided by the form or the user can search for an existing contact.

{{% alert title="Warning" %}}
The data loaded by the contact selector will overwrite any existing data in fields that are in the same group as the contact selector and share the same name as a field on the selected contact. Data will not be written into matching fields if `bind-id-only` is included in the appearance.
{{% /alert %}}

To select a contact in a form, create a field with the type `string` and set the appearance to `select-contact type-{{contact_type_1}} type-{{contact_type_2}} ...`. Setting multiple contact_type ids allows the user to search among multiple types of contacts. If no contact type appearance is specified then all contact types will be queried when searching.

{{% alert title="Note" %}}
For CHT version `v3.9.x` and below, contacts must be selected by setting the field type to `db:{{contact_type}}` and the appearance to `db-object` (instead of using `string` and `select-contact`).
{{% /alert %}}

The contact selector can be used to link reports to the person or place in context when the form was created. Getting the values for `_id` or `patient_id` and setting them to `patient_id` or `patient_uuid` on the final report will link that report to the contact. Then the report will be displayed on the contact's summary page.

| type        | name         | label        | appearance                 | calculate             |
|-------------|--------------|--------------|----------------------------|-----------------------|
| begin group | inputs       | NO_LABEL     |                            |                       |
| begin group | contact      | NO_LABEL     |                            |                       | 
| string      | _id          | Patient ID   | select-contact type-person |                       |
| string      | patient_id   | Medic ID     | hidden                     |                       |
| end group   |              |              |                            |                       | 
| end group   |              |              |                            |                       |
| calculate   | patient_uuid | Patient UUID |                            | ../contact/_id        |
| calculate   | patient_id   | Patient ID   |                            | ../contact/patient_id |

