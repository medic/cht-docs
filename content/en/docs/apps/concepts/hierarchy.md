---
title: "Hierarchies"
weight: 3
description: >
  Organizing people and places, and their relationship to one-another
keywords: hierarchy
---

The Core Framework requires a hierarchy to organize the app. It is often based on the hierarchy of a health system. These levels might have different titles depending on a particular health system’s configuration. 

A user logging into their app will see a custom set of people, tasks, reports, and analytics based on the hierarchy level that they belong to. This allows appropriate data sharing based on the role of the user in the health system. 

Note that each place in a hierarchy must have a primary contact person assigned to it. Other program staff working at the same level can be registered but there is only ever one primary contact.

{{% see-also page="docs/apps/reference/hierarchy" title="Defining Hierarchy" %}}


### Sample Hierarchy "A"

This is an example of a hierarchy that includes district, health center, and CHW areas as the three levels which serve as “places,” or units of organizing people. User roles can be assigned to log in at any of these levels. For example, it would be customary for a CHW to log in at the CHW Area level and view the people, i.e. patients, who belong there.

This is the typical setup for a project that prioritizes district-level overview and aggregation. In this hierarchy, patients are often created under the “CHW Area” level, and are not organized by household.

### Sample Hierarchy "B"

This is an example of a hierarchy that includes health center, CHW area, and families as the three levels which serve as “places” or units of organizing people. User roles can be assigned to log in at any of these levels. For example, it would be customary for a CHW to log in at the CHW Area level and view the families, and below that the people, i.e. patients or family members, who belong there.

This is the typical setup for a project that requires family-level views.

<!-- Visual page 23 -->

The app hierarchy can be modeled after the health system, health program or the community.  All people are associated with a place and these places can be associated to each other. For instance, a Family Member is part of a Household. A Household and CHWs are part of a CHW Area. A CHW Area and nurses are part of a Health Facility. Additional levels may be added as needed. The Admin level operates outside of the hierarchy and gives access to all levels and people.

<!-- Visual page 24 -->
