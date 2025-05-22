---
title: "Mapping Users on the CHT Hierarchy"
linkTitle: Mapping Hierarchy
weight: 4
description: >
  Mapping users on the CHT hierarchy
aliases:
   - /design/guides/mapping-hierarchy
---

This section will take you through mapping of users on CHT hierarchy, including:

- defining the hierarchy (reporting structure)
- defining user roles
- mapping user personas to the CHT hierarchy

## Brief Overview of Key Concepts

A *[user persona]({{< ref "design/personas" >}})* is a generalized character that embodies a particular type of user.

*User roles* are the activities that the user personas are expected to carry out.

A *hierarchy* represents the reporting structure.

## Prerequisites/Required Resources

[Personas.]({{< ref "design/personas" >}})

## Steps

### 1. Define the Hierarchy

Identify the reporting structure of the user personas in order to have a flawless flow of data from one level to another.

{{< figure src="app-hierarchy.jpg" link="app-hierarchy.jpg" class="right col-6 col-lg-8" >}}

For instance, family members belong to a household. Households and CHWs belong to a CHW area. CHW areas and nurses belong a health facility. Additional levels may be added as needed. The administrator level operates outside of the hierarchy and gives access to all levels and people.

{{< figure src="user-hierarchy.png" link="user-hierarchy.png" class="right col-6 col-lg-8" >}}

The app hierarchy is often modeled after the health system, health program or community structure. All people who are registered in the app must be associated with a place. These places are located in a hierarchy to other places.

### 2. Define the User Roles

Determine all the actors within the system in terms of who will be doing what.

{{< figure src="user-roles.png" link="user-roles.png" >}}

### 3. Map User Personas to the Hierarchy

{{< figure src="mapped-personas.png" link="mapped-personas.png" >}}
