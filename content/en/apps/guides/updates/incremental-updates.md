---
title: "Rolling out CHT Core updates incrementally"
linkTitle: "Incremental updates"
weight: 
description: >
  How to roll out updates incrementally using permissions
relatedContent: >
  apps/concepts/users
  apps/reference/app-settings/user-permissions
  apps/reference/app-settings/user-roles


---

Some CHT Core updates can be rolled out incrementally rather than all at once. This can be particularly helpful for updates that require training. The updated or "new" version will be the system default, but users can be configured to see the "old" version. If you do nothing when you upgrade, users will automatically start seeing the new version.

{{% alert title="Note" %}} This functionality is intended as a way to phase in changes, the old version will be completely removed in a future release. {{% /alert %}}

## Configuration

If the specific CHT Core feature supports incremental rollouts, users can be configured to see the "old" version by means of a [permission]({{< ref "apps/reference/app-settings/user-permissions" >}}). The permission can be added to existing Roles, or for more granular control and rolling out by cohorts, you can create a new Role with the one permission and add that Role to desired users. It is important to note that currently the user interface of the Admin app does not support assignment of multiple Roles to a single user, but it is possible to do this through the API or in CouchDB directly. Also, the permission will not be included in `app_settings` automatically so if you want it to be selectable from the Admin app user interface, you will need to add it to `app_settings`.


## Roll-out Scenarios

The table below illustrates some potential rollout scenarios and recommended Actions.

Scenario | Actions
-- | -- 
[Default] All users see the "new" version once you upgrade | None, just upgrade.
All users see the "old" version once you upgrade. All users see the "new" version at the same time in the future. | Add the permission to all Roles before you upgrade. When you are ready to transition everyone to the the new version, just remove the permission form all Roles.
All users see the "old" version once you upgrade. Roll out the "new" version in cohorts over time. | Create a new Role with the one permission and add that role to all users. When you are ready to transition a cohort of users, remove the Role from that cohort.
Some cohorts see the "old" version/some see the "new" version once you upgrade.  All cohorts seeing the "old" version start seeing the "new" version at the same time. | Create a new Role with the one permission and add it to selected users. When you are ready to transition all cohorts to the "new" version, remove the Role from all users.
Some cohorts see the "old" version/some see the "new" version once you upgrade. Roll out the "new" version to applicable cohorts over time. | Create a new Role with the one permission and add it to selected users. When you are ready to transition a cohort of users, remove the Role from those users.
