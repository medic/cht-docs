---
title: "User Roles"
linkTitle: "User Roles"
weight: 5
description: >
  Defining the roles that can be assigned to users.
relevantLinks: >
  docs/apps/concepts/user-roles
  docs/apps/concepts/user-permissions
---

### `app_settings.json .roles{}`

|Property|Description|Required|
|-------|---------|----------|
| `name` | The translation key for this role | Yes |
| `offline` | Determines if user will be an online or offline user. Set to `false` for users to be "online" users.  | No, default `true` |
