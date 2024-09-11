---
title: "CHT API"
toc_hide: true
hide_summary: true
aliases:
   - /apps/reference/_partial_cht_api
----
_Introduced in v3.12.0_

Provides CHT-Core Framework's functions to contact summary, targets and tasks. The API is available in the `cht` reserved variable under the `v1` version.

| Function | Arguments | Description |
| -------- | --------- | ----------- |
| hasPermissions(permissions, userRoles, chtPermissionsSettings) | `permissions`: String or array of permission name(s).<br>`userRoles`: (Optional) Array of user roles. Default to the current logged in user.<br>`chtPermissionsSettings`: (Optional) Object of configured permissions in CHT-Core's settings. Default to the current instance's configured permissions. | Returns true if the user has the permission(s), otherwise returns false. |
| hasAnyPermission(permissionsGroups, userRoles, chtPermissionsSettings) | `permissionsGroups`: Array of groups of permission name(s).<br>`userRoles`: (Optional) Array of user roles. Default to the current logged in user.<br>`chtPermissionsSettings`: (Optional) Object of configured permissions in CHT-Core's settings. Default to the current instance's configured permissions. | Returns true if the user has all the permissions of any of the provided groups, otherwise returns false. |
| getExtensionLib(name) | `name`: String of script name | Returns an executable function identified by the given name configured as [extension-libs]({{< ref "extension-libs" >}}).

### CHT API's code samples

```js
const canEdit = cht.v1.hasPermissions('can_edit');
const canManagePlaces = cht.v1.hasPermissions(['can_create_places', 'can_update_places']);
const hasAnyGroup = cht.v1.hasAnyPermission([
    ['can_view_messages', 'can_view_message_action'], 
    ['can_view_reports', 'can_verify_reports']
]);
const averageFn = cht.v1.getExtensionLib('average.js');
```
