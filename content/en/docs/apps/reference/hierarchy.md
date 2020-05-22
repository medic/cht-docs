---
title: "Hierarchy"
linkTitle: "Hierarchy"
weight: 5
description: >
  Setting the types of places and people in the hierarchy
relevantLinks: >
  docs/apps/concepts/hierarchy
---

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
| `person` | Whether this is a person type or a place type. | No, defaults to `false`. |
 
