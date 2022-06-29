---
title: ".permissions"
linkTitle: ".permissions"
weight: 5
description: >
  **User Permissions**: Assigning fine grained settings for user roles
relevantLinks: >
  docs/apps/concepts/user-permissions
  docs/apps/concepts/user-roles
keywords: user-roles user-permissions
---

Permissions are defined by the `permissions` object in the `base_settings.json` file. Permissions can also be configured using the App Management app.
Each permission is defined as an array of user role identifiers that have the permission granted.

{{< see-also page="apps/reference/app-settings/user-roles" title="User roles" >}}

### `app_settings.json .permissions{}`

|Property|Description|
|-------|---------|
| `can_access_gateway_api` | Allows access to gateway API |
| `can_aggregate_targets` | Allows access to Target Aggregates page |
| `can_bulk_delete_reports` | Allows users to select multiple reports and delete |
| `can_configure` | Allows update of configuration parameters |
| `can_upgrade` | Allows upgrades of the CHT Core Framework version via the API or admin interface |
| `can_create_people` | Allows creation & editing of person contacts |
| `can_create_places` | Allows creation & editing of place contacts |
| `can_create_records` | Allows creation of reports |
| `can_create_users` | Allows creation of user logins |
| `can_delete_contacts` | Allows deletion of people and places |
| `can_delete_messages` | Allows deletion of messages |
| `can_delete_reports` | Allows deletion of reports |
| `can_delete_users` | Allows deletion of users |
| `can_edit` | Allows editing of documents in CouchDB. Note that even without this permission set to true a user can still edit reports in their app, yet the changes will not be replicated. See [issue]([url](https://github.com/medic/cht-core/issues/6215)) for more details. |
| `can_edit_profile` | Allows editing of their own user profile |
| `can_edit_verification` | Allows updating of report verification status |
| `can_export_all` | Allows export of data including data they do not have access to |
| `can_export_contacts` | Allows export of contacts |
| `can_export_dhis` | Allows export of DHIS2 metrics |
| `can_export_feedback` | Allows export of user feedback |
| `can_export_messages` | Allows export of reports and messages |
| `can_log_out_on_android` |	Displays logout menu item in hamburger menu for android users and can be used to log out form the application |
| `can_update_places` | Allows editing of place documents |
| `can_update_reports` | Allows editing of report documents |
| `can_update_users` | Allows editing of user documents |
| `can_verify_reports` | Allows update of report verification status |
| `can_view_analytics` | Allows access to in-app analytics |
| `can_view_analytics_tab` | Displays analytics tab on the application |
| `can_view_call_action` | Displays a button to call the selected person |
| `can_view_contacts` | Allows viewing contacts |
| `can_view_contacts_tab` |	Displays the contacts tab in the application |
| `can_view_last_visited_date` | Enable display of the date a family was last visited |
| `can_view_message_action` |	Displays a button to send a message to the selected contact |
| `can_view_messages` | Allows viewing messages |
| `can_view_messages_tab` |	Displays the messages tab in the application |
| `can_view_outgoing_messages` | Allows viewing outgoing messages when logged in as an administrator |
| `can_view_reports` | Allows viewing reports |
| `can_view_reports_tab` | Displays the reports tab in the application |
| `can_view_tasks` | Allows viewing tasks |
| `can_view_tasks_tab` | Displays tasks tab in the application |
| `can_view_uhc_stats` | Allows users to view UHC metrics |
| `can_view_unallocated_data_records` | Allows viewing reports that have no associated contact |
| `can_view_users` | Allows viewing all user accounts |
| `can_write_wealth_quintiles` | Allows updating contacts with wealth quintile information |
