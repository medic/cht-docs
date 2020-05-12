---
title: "User Roles"
weight: 4
date: 2017-01-05
description: >
  Defining the user types to grant different permissions
---

The app uses roles and permissions to determine who has access to what data. User roles are general categories we use to assign a collection of broad permissions to users. There are two classes of roles: online and offline. Generally speaking, CHWs are usually offline users, while managers and nurses are usually online users. SMS users do not use the app, and thus do not have a user role.

### Online Roles

Online roles are for users who need access to a lot of data and need to maintain the system or update system settings. An internet connection is required.

### Offline Roles

Offline roles are for users who need to be able to access data on the go in the field, don’t need to maintain the system, and don’t have a reliable internet connection. All the data they have access to will be synced to their device.

#### Defining User Roles

Each user is assigned one of the defined roles. Roles can be defined using the App Management app, which is represented by the `roles` object of the `app-settings.json` file. Each role is defined by an identifier as the key, and an object with the following properties:

|Property|Description|Required|
|-------|---------|----------|
| `name` | The translation key for this role | Yes |
| `offline` | Determines if user will be an online or offline user. Set to `false` for users to be "online" users.  | No, default `true` |


### Sample Hierarchy "B"

Some people in the app will also be app users. Differing levels of access and permissions are assigned to each persona. A user role is created to provide them with access to the information they need. Offline and online access, storage limitations, and data privacy are taken into account.

| Persona         | Hierarchy                                      | Device    | Permissions                                                                                                                                                                                                                                              |
| :-------------- | :--------------------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Program Officer | Logs in as Admin                               | Computer  | Admin users, usually Program Officers, are online-only admin users not associated to a particular level. They have access to all people, places, and records in the app, but since they are online-only users, they cannot view any tasks or targets.    |
| CHW Supervisors | Logs in at Health Facility level               | Tablet    | User at this level have offline access to view CHWs, fill out reports about them, and view tasks and targets related to them. Due to storage limitations, they aren’t able to view households or submit reports and review tasks and targets about them. |
| CHWs            | Logs in at CHW Area level                      | Phone     | Users at this level have offline access to view households and family members, submit reports about them, and view tasks and targets about them.                                                                                                         |
| Family members  | Registered at Household level, does not log in | Messaging | Family members might include fathers, mothers, children, and other adults. The program model determines which family members should be registered in the app. However, they are not users of the app, and do not log in themselves.                      |
