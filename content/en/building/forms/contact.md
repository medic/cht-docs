---
title: "contact"
linkTitle: "contact"
weight: 2
description: >
  **Contact Forms**: Used for creating and editing people and places
relevantLinks: >
  docs/building/features/contacts
  docs/building/concepts/hierarchies
relatedContent: >
  building/forms/configuring/form-inputs
  building/forms/configuring/additional-docs
  building/forms/configuring/multimedia
  building/forms/configuring/app-form-sms
keywords: hierarchy contacts contact-forms
aliases:
   - /building/reference/forms/contact
   - /apps/reference/forms/contact
---

Contact forms are used to create and edit contacts (persons and places). Each contact-type should ideally have two forms; one for creation, and another for editing.

These forms are stored in the `forms/contact` sub-folder of the project config directory. The naming convention used should be `<contact_type_id-{create|edit}>.xlsx`.

## Form details

### Survey sheet

To collect information about the contact, use a top-level group with the [id of the contact_type]({{< ref "building/reference/app-settings/hierarchy" >}}) as the `name` of the group (e.g. `person` when adding or editing a person contact). Information in this group will be saved to the contact's document in the database.

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

`contact` forms have access to a variety of [input data]({{< ref "building/forms/configuring/form-inputs#app-forms" >}}).

### Settings sheet

The `form_id` should follow the pattern `contact:CONTACT_TYPE_ID:ACTION` where CONTACT_TYPE_ID is the contact_type id for the contact and ACTION is `create` or `edit`. (e.g. `contact:clinic:create`)

## Properties

The meta information in the `{contact_type_id}-{create|edit}.properties.json` file defines additional configuration controlling when the form is available and checks that will be performed when submitting the form.

### `forms/contact/{contact_type_id}-{create|edit}.properties.json`

| Property                     | Description                                                                                                                                                                                                                                           | required |
|------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| `context`                    | _Added in `3.10`._ The contact form context defines when the form should be available in the app. Note: this applies only to the contact form, not the contacts themselves.                                                                           | no       |
| `context.expression`         | A JavaScript expression evaluated when a contact profile is viewed. This can limit which users have access to the contact form. [See below]({{< relref "#context-expression" >}}) for more details.                                                   | no       |
| `context.permission`         | String permission key required to allow the user to view and submit this form. If blank, this defaults to allowing all access.                                                                                                                        | no       |
| `duplicate_check`            | _Added in `4.19`._ Allows for configuring or disabling the [duplicate detection logic]({{< ref "building/contact-management/contacts#duplicate-contact-detection" >}}) for a particular contact type.                                                 | no       |
| `duplicate_check.expression` | A JavaScript expression evaluated when submitting the contact form. The expression defines the logic used for determining when a contact is considered to be a duplicate. [See below]({{< relref "#duplicate-check-expression" >}}) for more details. | no       |
| `duplicate_check.disabled`   | Boolean determining if the duplicate check should be run when submitting this contact form. Default is `false`.                                                                                                                                       | no       |

#### Context Expression

The contact form context expression can be used to limit which users have access to the contact form. If the expression evaluates to `true`, the form will be listed as an available action on the proper contact profiles. 

In the expression, the `user` input is available. (Note that unlike in the [app form expressions]({{< ref "building/forms/app#formsappform_namepropertiesjson" >}}), the `contact` and `summary` inputs are [not currently available](https://github.com/medic/cht-core/issues/6612) for contact form expressions.)

#### Duplicate Check Expression

The duplicate check expression is a boolean check executed against each of the _sibling contacts_ of the contact being created/modified. "Sibling contacts" are contacts of the same type that share the same parent contact. When the expression evaluates to `true`, the contact being created/edited will be considered a duplicate of the existing sibling.

In the expression, both the `current` contact doc (the contact currently being created/edited) and the `existing` sibling contact doc are available. The default duplicate expression is:

```js
levenshteinEq(current.name, existing.name, 3) && ageInYears(current) === ageInYears(existing)
```

This expression will consider contacts to be duplicate if the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) between the two names is less than or equal to 3 (meaning the names are very similar or exactly the same) and (for persons) if the contacts have the same age (in years). 

When designing custom duplicate check expressions, consider how the contact data collected might evolve over time. If properties are added/removed/renamed on the contact doc, your duplicate expression logic will need to account for this if it references these properties (e.g. support for falling-back to older properties to ensure broader compatibility).

Always consider the nature and quality of your data. As data quality improves (e.g., consistent naming conventions), duplicate check expressions for some contact types can be refined to reduce both false positives and false negatives.

##### Customizing the duplicate contact error message

The default message shown to the user when a duplicate contact is found [can be modified]({{< ref "building/translations/overview" >}}) by adding a custom translation for the `duplicate_check.contact.duplication_message` key.

Additionally, different messages can be shown for different contact types by setting `duplicate_check.contact.${contact_type_id}.duplication_message` keys. This can be useful if you want to prompt the user with the likely reason the duplicate contacts matched based on your custom duplicate check expression logic.

#### Expression functions

{{< read-content file="_partial_expression_functions.md" >}}

### Code sample

In this sample properties file, the person create form would only be accessible for CHW Supervisors with the `can_export_contacts` permission. Additionally, a new person should not have the exact same name as an existing sibling contact.

#### `forms/contact/person-create.properties.json`

```json
{
  "context": {
    "expression": "user.role === 'chw_supervisor'",
    "permission": "can_export_contacts"
  },
  "duplicate_check": {
    "expression": "current.name === existing.name"
  }
}
```

## Generic contact forms

If your place contact forms are similar across all levels of your specified project hierarchy, you can templatise the form creation process. You will need to create the following files in `forms/contact`: `place-types.json`, `PLACE_TYPE-create.xlsx` and `PLACE_TYPE-edit.xlsx`.

`place-types.json` maps the place contact_type id to a human-readable description that will be shown on the app's user interface.

Both `PLACE_TYPE-create.xlsx` and `PLACE_TYPE-edit.xlsx` will contain two placeholder values `PLACE_TYPE` and `PLACE_NAME` which will be replaced by the keys and values specified in `place-types.json` respectively during form conversion. Also, copies of the different place-type forms will be created (if they don't exist) during the form conversion process with `PLACE_TYPE` being replaced with the keys specified in `place-types.json`.

Convert and build the contact forms into your application using the `convert-contact-forms` and `upload-contact-forms` actions in `cht-conf`.

> `cht --local convert-contact-forms upload-contact-forms`

For examples on how to structure the above files you can have a look at the [default](https://github.com/medic/cht-core/tree/master/config/default/forms/contact) configuration in CHT-core.

## Creating person and place contacts in the same form

Contact forms for creating a place can also optionally create one or more person-type documents. One of these person contacts can be linked to the created place as the primary contact.

Below is a simple structure of a place form showing all the necessary components.

![Place forms survey sheet](place-contact-form-survey.png)

Section 1 is similar to what has been described earlier for person forms.

Section 2 specifies the contact that will be linked to the place being created. `parent`, `type` and `contact_type` and `name` are mandatory. This also applies to the place-type definition in section 4. `contact` on the other hand is not mandatory for the successful creation of a place. It is usually more convenient to create a place and its primary contact at the same time.

You can also create additional contacts linked to the place being created when you have a structure similar to that shown in section 3.
