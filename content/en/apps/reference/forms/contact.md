---
title: "contact"
linkTitle: "contact"
weight: 5
description: >
  **Contact Forms**: Used for creating and editing people and places
relevantLinks: >
  docs/apps/features/contacts
  docs/apps/concepts/hierarchies
relatedContent: >
  apps/guides/forms/form-inputs
  apps/guides/forms/additional-docs
  apps/guides/forms/multimedia
  apps/guides/forms/app-form-sms
keywords: hierarchy contacts contact-forms
---

Contact forms are used to create and edit contacts (persons and places). Each contact-type should ideally have two forms; one for creation, and another for editing.

These forms are stored in the `forms/contact` sub-folder of the project config directory. The naming convention used should be `<contact_type_id-{create|edit}>.xlsx`.

## Form details

### Survey sheet

To collect information about the contact, use a top-level group with the [id of the contact_type]({{< ref "apps/reference/app-settings/hierarchy" >}}) as the `name` of the group (e.g. `person` when adding or editing a person contact). Information in this group will be saved to the contact's document in the database.

| type        | name   | label::en    |
|-------------|--------|--------------|
| begin group | person | NO_LABEL     |
| hidden      | parent | Parent Id    |
| hidden      | type   | Contact Type |
| string      | name   | Full Name    |
| ...         |        |              |
| end group   |        |              |

The `parent`, `type`, and `name` fields are mandatory on forms that are adding contacts. `parent` will be automatically populated with the id of the parent contact. `type` will be automatically set to the contact_type id when saving the new contact. 

{{% alert title="Edit forms" %}}
For edit forms, the name of the top-level group should still match the contact_type id of the contact, but only the relevant fields for editing need to be specified in the form.
{{% /alert %}}

#### Input data

`contact` forms have access to a variety of [input data]({{< ref "apps/guides/forms/form-inputs#app-forms" >}}).

### Settings sheet

The `form_id` should follow the pattern `contact:CONTACT_TYPE_ID:ACTION` where CONTACT_TYPE_ID is the contact_type id for the contact and ACTION is `create` or `edit`. (e.g. `contact:clinic:create`)

### Properties

Starting in cht-core release 3.10, we can now configure property files in contact forms to show or hide them based on an expression or permission as specified in the [app form schema]({{< ref "apps/reference/forms/app#formsappform_namepropertiesjson" >}}).

## Generic contact forms

If your place contact forms are similar across all levels of your specified project hierarchy, you can templatise the form creation process. You will need to create the following files in `forms/contact`: `place-types.json`, `PLACE_TYPE-create.xlsx` and `PLACE_TYPE-edit.xlsx`.

`place-types.json` maps the place contact_type id to a human-readable description that will be shown on the app's user interface.

Both `PLACE_TYPE-create.xlsx` and `PLACE_TYPE-edit.xlsx` will contain two placeholder values `PLACE_TYPE` and `PLACE_NAME` which will be replaced by the keys and values specified in `place-types.json` respectively during form conversion. Also, copies of the different place-type forms will be created (if they don't exist) during the form conversion process with `PLACE_TYPE` being replaced with the keys specified in `place-types.json`.

Convert and build the contact forms into your application using the `convert-contact-forms` and `upload-contact-forms` actions in `cht-conf`.

> `cht --local convert-contact-forms upload-contact-forms`

For examples on how to structure the above files you can have a look at the sample configurations in CHT-core: [default](https://github.com/medic/cht-core/tree/master/config/default/forms/contact) and [standard](https://github.com/medic/cht-core/tree/master/config/standard/forms/contact).

## Creating person and place contacts in the same form

Contact forms for creating a place can also optionally create one or more person-type documents. One of these person contacts can be linked to the created place as the primary contact.

Below is a simple structure of a place form showing all the necessary components.

![Place forms survey sheet](place-contact-form-survey.png)

Section 1 is similar to what has been described earlier for person forms.

Section 2 specifies the contact that will be linked to the place being created. `parent`, `type` and `contact_type` and `name` are mandatory. This also applies to the place-type definition in section 4. `contact` on the other hand is not mandatory for the successful creation of a place. It is usually more convenient to create a place and its primary contact at the same time.

You can also create additional contacts linked to the place being created when you have a structure similar to that shown in section 3.
