---
title: "Hierarchies"
weight: 3
date: 2017-01-05
description: >
  Organizing people and places, and their relationship to one-another
---

The Core Framework requires a hierarchy to organize the app. It is often based on the hierarchy of a health system. These levels might have different titles depending on a particular health system’s configuration. 

A user logging into their app will see a custom set of people, tasks, reports, and analytics based on the hierarchy level that they belong to. This allows appropriate data sharing based on the role of the user in the health system. 

Note that each place in a hierarchy must have a primary contact person assigned to it. Other program staff working at the same level can be registered but there is only ever one primary contact. Supporting more flexible hierarchies is on the Core Framework development roadmap.  

### Sample Hierarchy "A"

This is an example of a hierarchy that includes district, health center, and CHW areas as the three levels which serve as “places,” or units of organizing people. User roles can be assigned to log in at any of these levels. For example, it would be customary for a CHW to log in at the CHW Area level and view the people, i.e. patients, who belong there.

This is the typical setup for a project that prioritizes district-level overview and aggregation. In this hierarchy, patients are often created under the “CHW Area” level, and are not organized by household.

### Sample Hierarchy "B"

This is an example of a hierarchy that includes health center, CHW area, and families as the three levels which serve as “places” or units of organizing people. User roles can be assigned to log in at any of these levels. For example, it would be customary for a CHW to log in at the CHW Area level and view the families, and below that the people, i.e. patients or family members, who belong there.

This is the typical setup for a project that requires family-level views.

<!-- Visual page 23 -->

The app hierarchy can be modeled after the health system, health program or the community.  All people are associated with a place and these places can be associated to each other. For instance, a Family Member is part of a Household. A Household and CHWs are part of a CHW Area. A CHW Area and nurses are part of a Health Facility. Additional levels may be added as needed. The Admin level operates outside of the hierarchy and gives access to all levels and people.

<!-- Visual page 24 -->

## Defining Hierarchy

From 3.7.0 it is possible to configure what types of places and people are available by modifying the `contact_types` array in the app settings. Each type has the following properties.

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
 
