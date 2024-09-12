---
title: ".contact_types"
linkTitle: ".contact_types"
weight: 5
description: >
  **Hierarchy**: Setting the types of places and people in the hierarchy
relevantLinks: >
  docs/apps/concepts/hierarchy
keywords: hierarchy contacts
aliases:
   - /apps/reference/app-settings/hierarchy
---

From 3.7.0 it is possible to configure what types of places and people are available by modifying the `contact_types` array in the app settings. Each type has the following properties.

{{% alert title="Note" %}}
Prior to version 3.7.0, CHT Core supported 4 contact types - 3 place types (`clinic`, `health_center`, `district_hospital`) and one person type (`person`).
{{% /alert %}}

### `app_settings.json .contact_types[]`

|Property|Description|Required|
|-------|---------|----------|
| `id` | String identifier for the type. At times this will be used to sort the contacts in the UI so it is recommended to using a number prefix with gaps between numbers, eg: `10-district`, `20-region`, etc. | Yes. |
| `name_key` | The translation key used for the title for the contact profile. | No, defaults to 'contact.profile'. |
| `group_key` | The translation key used for the title of a list of contacts of this type. | Yes. |
| `create_key` | The translation key used on the button for creating new contacts of this type. | Yes. |
| `edit_key` | The translation key used on the button for editing contacts of this type. | Yes. |
| `primary_contact_key` | The translation key used to identify a person as the primary contact of contacts of this type. | No, defaults to 'Primary contact'. |
| `parents` | An array of strings of IDs of parent types. If more than one then this type can appear in different places in the hierarchy. If more than one type lists the same type as a parent then a user will get a dropdown of places to create. If no parents then contacts of this type will be at the top of the hierarchy and cannot be added as a child of any contact. | No, defaults to no parents. |
| `icon` | The string ID for the icon to show beside contacts of this type. | Yes. |
| `create_form` | The string ID for the xform used to create contacts of this type. | Yes. |
| `edit_form` | The string ID for the xform used to edit contacts of this type. | No, defaults to the create_form. |
| `count_visits` | Whether or not to show a count of visits for contacts of this type. Requires UHC to be enabled. | No, defaults to `false`. |
| `sort_by_dob`         | Whether or not to sort contacts by date of birth in the contact detail page. By default, contacts are sorted alphabetically. | No, defaults to `false`. |
| `person` | Whether this is a person type or a place type. | No, defaults to `false`. |
 
### Forms

When creating contacts the type will be automatically assigned based on the button the user clicked. However if the form also creates sibling or child contacts these nested sections must specify a `type` field with a hardcoded value of "contact" and a `contact_type` field with the ID of the desired contact type.

### Changing the configuration

You can change any contact type configuration easily except for the IDs. To change the ID of a contact type in configuration of a project which already has contact data the contact docs will also have be updated to have a `type` of "contact" and a `contact_type` with the new ID of the contact type.

### Migration

If you already have person and place documents, switching from using the fixed hierarchy requires that you also update all the existing docs. Each contact and report holds the IDs of ancestors in their hierarchy so they will all need to be updated to be consistent with the changes you've made. You can use the cht-conf `move-contacts` command to help with this migration.
