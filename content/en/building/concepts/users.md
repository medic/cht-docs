---
title: "Users"
weight: 7
description: >
  Defining the user roles and their permissions
keywords: users user-roles user-permissions
relatedContent: >
  design/personas
  building/tutorials/contact-and-users-1
  building/tutorials/contact-and-users-2
  building/guides/data/users-bulk-load
aliases:
   - /apps/concepts/users
----

Apps built with the Core Framework use roles and permissions to determine who has access to what data. User roles are general categories you can use to assign a collection of broad permissions to users. There are two classes of roles: online and offline. Generally speaking, CHWs are usually offline users, while managers and nurses are usually online users. SMS users do not use the app, and thus do not have a user role.

## Roles

Differing levels of access and permissions are assigned to each persona. A user role is created to provide them with access to the information they need. Offline and online access, storage limitations, and data privacy are taken into account.

| Persona         | Hierarchy                                      | Device    | Permissions                                                                                                                                                                                                                                              |
| :-------------- | :--------------------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Program Officer | Logs in as Admin                               | Computer  | Admin users, usually Program Officers, are online-only admin users not associated to a particular level. They have access to all people, places, and records in the app, but since they are online-only users, they cannot view any tasks or targets.    |
| CHW Supervisors | Logs in at Health Facility level               | Tablet    | User at this level have online and offline access to view CHWs, fill out reports about them, and view tasks and targets related to them. Due to storage limitations, they aren’t able to view households or submit reports and review tasks and targets about them. |
| CHWs            | Logs in at CHW Area level                      | Phone     | Users at this level have online and offline access to view households and family members, submit reports about them, and view tasks and targets about them.                                                                                                         |
| Family members  | Registered at Household level, does not log in | Messaging | Family members might include fathers, mothers, children, and other adults. The program model determines which family members should be registered in the app. However, they are not users of the app, and do not log in themselves.                      |

{{< see-also page="building/reference/app-settings/user-roles" anchor="" title="Defining User Roles" >}}

### Online Users

Online roles are for users who need access to a lot of data and need to maintain the system or update system settings. An internet connection is required.

### Offline Users

Offline roles are for users who need to be able to access data on-the-go in the field and don’t have a reliable internet connection. All the data they have access to will be synced to their device. System administrators cannot be offline users as they won't have access to the app management tools offline.

{{% alert title="Note" %}} Advanced configuration options are available for a specific offline user role to manage what [level of data]({{< ref "building/guides/performance/replication" >}}) is synced to their device. {{% /alert %}}

## Permissions

User Permissions are settings that can be individually toggled on or off to allow users with a particular Role to do a certain action or see a certain thing. CHT app developers and administrators can add as many User Roles as needed to grant permissions to different groups of users.

Viewing permissions determine which page tabs a user sees in the app and which types of data they do and don’t have access to. User action permissions include who can create (e.g., create new users), who can delete (e.g., delete reports), who can edit (e.g., edit profiles), and who can export (e.g., export server logs).

{{< see-also page="building/reference/app-settings/user-permissions" title="Defining User Permissions" >}}

{{< figure src="/building/features/admin/admin-roles.png" link="/building/features/admin/admin-roles.png" class="left col-12 col-lg-10" >}}