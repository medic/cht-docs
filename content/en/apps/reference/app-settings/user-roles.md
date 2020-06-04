---
title: ".roles"
linkTitle: ".roles"
weight: 5
description: >
  **User Roles**: Defining the roles that can be assigned to users.
relevantLinks: >
  docs/apps/concepts/user-roles
  docs/apps/concepts/user-permissions
keywords: user-roles user-permissions
---

Each user is assigned one of the defined roles. Roles can be defined using the App Management app, which is represented by the `roles` object of the `app-settings.json` file. Each role is defined by an identifier as the key, and an object with the following properties:

### `app_settings.json .roles{}`

|Property|Description|Required|
|-------|---------|----------|
| `name` | The translation key for this role | Yes |
| `offline` | Determines if user will be an online or offline user. Set to `false` for users to be "online" users.  | No, default `true` |
