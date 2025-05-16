---
title: "CHT Application Settings"
linkTitle: Application Settings
weight: 6
description: >
  Managing CHT application settings
relatedContent: >
  building/reference/app-settings
  building/guides/performance/replication
  building/reference/app-settings/transitions 
aliases:
   - /apps/tutorials/application-settings
---

 
This tutorial will take you through how to manage the CHT application settings, including;

- Setting user roles and permissions
- Enabling and disabling transitions
- Configuring contact hierarchy and configuring replication.

App settings allow you to both persist information that is critical to the application outside the code, and to create profiles that store the preferences for project deployments.
  

## Brief Overview of Key Concepts

The settings which control CHT apps are defined in the *[app_settings.json]({{< relref "building/reference/app-settings" >}})* file, and stored in the settings doc in the database.

*[Permissions]({{< relref "building/concepts/users#permissions" >}})* are settings that control access to specific app features and functionality.

*[Roles]({{< relref "building/concepts/users#roles" >}})* define permissions for users to access a group of app features and functionality.

*[Replication]({{< relref "building/guides/performance/replication" >}})* is when users download a copy of the data on to their device. *Replication depth* refers to the number of levels within a hierarchy a specific user role is able to replicate.

*[Transitions]({{< relref "building/reference/app-settings/transitions" >}})* are Javascript code that run when a document is changed. A transition can edit the changed doc or do anything server side code can do for that matter.

## Required Resources

You should have a functioning CHT instance and have cht-conf installed locally. {{< see-also page="building/local-setup" title="How to set up a CHT local configuration environment" >}}

## Implementation Steps

In this section, you will define a new role, set permissions for the role, set transitions, configure a hierarchy, and upload your modified app settings file to your local environment.

### 1. Set Roles and Permissions

To add a new role, edit the object corresponding to `"roles"` key in `app_settings.json`. Add the new role as a key and within it, have an object with key/value pairs indicating the translation key of the role and whether it is an online or offline role. 

Configure a CHW role by adding the following snippet to the `"roles"` object:

```json
  "chw": {
    "name": "usertype.chw",
    "offline": true
  }
```

{{< see-also page="building/reference/app-settings/user-roles" title="Roles" >}}

Set permissions for the new role by adding the role to the relevant permission in the `"permissions"` object.

For instance, to grant the CHW role permission to create people, add the role to the array with the key `"can_create_people"`.

```json
  "permissions": {
    ...

    "can_create_people": [
      "program_officer",
      "chw_supervisor",
      "chw"
    ],

    ...
  }
```

{{< see-also page="building/reference/app-settings/user-permissions" title="Permissions" >}}

### 2. Set Transitions

To enable or disable a transition, edit the object corresponding to the `"transitions"` key in `app_settings.json`. Enable the `transition` by setting its corresponding value to `true`, disable it by settings its value to `false`. {{< see-also page="building/reference/app-settings/transitions" title="Transitions" >}}

```json
  "transitions": {
    "accept_patient_reports": false,
    "conditional_alerts": false,
    "default_responses": false,
    "update_sent_by": false,
    "registration": false,
    "update_clinics": false,
    "update_notifications": false,
    "update_scheduled_reports": false,
    "update_sent_forms": false,
    "generate_patient_id_on_people": true,
    "death_reporting": true
  }
```

In this example, the `generate_patient_id_on_people` and `death_reporting` transitions are enabled while the rest are disabled.

### 3. Set Hierarchy

You can configure hierarchies by editing the object corresponding to the `"contact_types"` key in `app_settings.json`. The following code sample represents the default hierarchy configuration. You can modify existing contact types by editing the objects within the array. 

When configuring a new deployment, it's important to plan your hierarchy well.  While there are no limits in the CHT to the hierarchical depth or breadth it will support, there are some trade-offs and caveats:
* While it is possible to [update the hierarchy configuration]({{< relref "building/contact-management/moving-contacts" >}}) after launch it can be difficult and potentially disruptive to users. Try and avoid this by planning ahead as best as possible.
* If your hierarchy is too shallow, users will download more docs than are necessary for their work which will impact the performance of the app. Taking the time to get the hierarchy configuration right makes it easy to give users access to only the docs they need.

**Important Note on Creating and Editing Contacts:** The ability to create and edit contacts in the CHT, including person entities, is dependent on the presence of corresponding forms in the `forms/contact` directory. Each contact type, such as "person", "clinic", "health_center", etc., must have associated `create` and `edit` forms defined. Without these forms, the functionality to add or modify these contact types in the CHT application will not be available. Ensure that the necessary forms are created and correctly referenced in the `app_settings.json` file under their respective contact type definitions. For guidance on creating these contact forms, refer to the [CHT documentation on contact forms](https://docs.communityhealthtoolkit.org/building/reference/forms/contact/).
For an example of where all the forms are represented in the default configuration, see the [default config directory](https://github.com/medic/cht-core/tree/master/config/default/).


{{< see-also page="building/reference/app-settings/hierarchy" title="Hierarchy" >}}

```json
  "contact_types": [
    {
      "id": "district_hospital",
      "name_key": "contact.type.district_hospital",
      "group_key": "contact.type.district_hospital.plural",
      "create_key": "contact.type.district_hospital.new",
      "edit_key": "contact.type.place.edit",
      "icon": "medic-district-hospital",
      "create_form": "form:contact:district_hospital:create",
      "edit_form": "form:contact:district_hospital:edit"
    },
    {
      "id": "health_center",
      "name_key": "contact.type.health_center",
      "group_key": "contact.type.health_center.plural",
      "create_key": "contact.type.health_center.new",
      "edit_key": "contact.type.place.edit",
      "parents": [
        "district_hospital"
      ],
      "icon": "medic-health-center",
      "create_form": "form:contact:health_center:create",
      "edit_form": "form:contact:health_center:edit"
    },
    {
      "id": "clinic",
      "name_key": "contact.type.clinic",
      "group_key": "contact.type.clinic.plural",
      "create_key": "contact.type.clinic.new",
      "edit_key": "contact.type.place.edit",
      "parents": [
        "health_center"
      ],
      "icon": "medic-clinic",
      "create_form": "form:contact:clinic:create",
      "edit_form": "form:contact:clinic:edit",
      "count_visits": true
    },
    {
      "id": "person",
      "name_key": "contact.type.person",
      "group_key": "contact.type.person.plural",
      "create_key": "contact.type.person.new",
      "edit_key": "contact.type.person.edit",
      "primary_contact_key": "clinic.field.contact",
      "parents": [
        "district_hospital",
        "health_center",
        "clinic"
      ],
      "icon": "medic-person",
      "create_form": "form:contact:person:create",
      "edit_form": "form:contact:person:edit",
      "person": true
    }
  ]
```

### 4. Set Replication Depth

To configure replication depth for a specific role, edit the object corresponding to the `"replication_depth"` key in `app_settings.json`.

```json
{
  "replication_depth": [
    { "role": "district_manager", "depth": 1 },
    { "role": "national_manager", "depth": 2 }
  ]
}
```

Configure the CHW role's depth to 2 by adding the following key/value pairs to the array above.

```json
{ "role": "chw", "depth": 2 }
```

{{< see-also page="building/guides/performance/replication" title="Replication Depth" >}}

### 5. Upload App Settings

To upload app settings to your local instance, run the following command:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs upload-app-settings
```

> [!IMPORTANT]
> Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance.

## Frequently Asked Questions

- [Compiling default app settings](https://forum.communityhealthtoolkit.org/t/default-config-do-not-compile/536)
- [Documentation for role permissions](https://forum.communityhealthtoolkit.org/t/documentation-for-role-permissions/502)
- [Is it possible to prevent editing for some forms but allow it for others?](https://forum.communityhealthtoolkit.org/t/is-it-possible-to-prevent-editing-for-some-forms-but-allow-it-for-others/93)
- [Can one person belong to multiple places in the same hierarchy?](https://forum.communityhealthtoolkit.org/t/can-one-person-belong-to-multiple-places-in-the-same-hierarchy/101/2)
