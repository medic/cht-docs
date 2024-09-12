---
title: "Setting up Multi-facility users"
linkTitle: Multi Facility Users
weight: 6
description: >
  Creating and assigning users to multiple places in the CHT UI
relatedContent: >
  building/concepts/users
  building/reference/app-settings
  building/tutorials/contact-and-users-1
aliases:
   - /apps/tutorials/multi-facility-users
---

{{% pageinfo %}}
This tutorial will take you through how to create and assign users to multiple places in the CHT UI. Assigning users to multiple places is only available from **CHT 4.9.0**.

This tutorial covers;

- Creating contacts and their associated users
- Creating places and assign contacts to those places
- Assigning users to multiple places

The [CHT application settings]({{< relref "building/tutorials/application-settings" >}}) allows you to both persist information that is critical to the application outside the code, and to create profiles that store the preferences for project deployments.
{{% /pageinfo %}}

## Brief Overview of Key Concepts

*[Permissions]({{< relref "building/concepts/users#permissions" >}})* are settings that control access to specific app features and functionality.

*[Roles]({{< relref "building/concepts/users#roles" >}})* define permissions for users to access a group of app features and functionality.

*[Contacts]({{< relref "building/features/contacts" >}})*  are people or places that are created in the CHT application.

*[People]({{< relref "building/features/contacts" >}})* are both patients in the system and users of the system, such as CHWs or Nurses.

*[Places]({{< relref "building/features/contacts" >}})* represent either an actual physical location such as a health facility, clinic, or a grouping such as a household or CHW Area.

## Pre-requisites

- You should be familiar with contact and user management. View detailed tutorial on [How to create contacts and their associated users]({{% ref "building/tutorials/contact-and-users-1" %}}) 
- You should be familiar with managing CHT application settings. Read [How to manage CHT application settings]({{% ref "building/tutorials/application-settings" %}}) 


## Implementation Steps

In this tutorial, you will work with the default contact forms and the default hierarchy.

The default `app_settings.json` in the CHT found in the `/config/default` folder has an existing `chw_supervisor` role and the `"can_have_multiple_places": []` permission. 

While logged in as an admin user, you will create two Health Facilities, CHW Supervisor, and CHW Area. You will then create the user for the CHW Supervisor so that they can log in and see the facilities, and the CHW Areas they supervise.

### Creating multi-facility user using the CHT default config. 

#### 1. Create New Health Facility. 

<br clear="all">

{{< figure src="new-facility/select-new-facility.png" link="new-facility/select-new-facility.png" class="right col-6 col-lg-8" >}}

While logged into the CHT application, go to the **People tab** and select **New Health Facility**

<br clear="all">

{{< figure src="new-facility/select-primary-contact.png" link="new-facility/select-primary-contact.png" class="right col-6 col-lg-8" >}}

Select the option that lets you create a new person within the form. This person will automatically become the primary contact for the created place.

<br clear="all">

<br clear="all">

{{< figure src="new-facility/select-role.png" link="new-facility/select-role.png" class="right col-6 col-lg-8" >}}

When filling in the required fields select **CHW Supervisor** as the role. 

Once you have filled the required fields, click **Next** to go to the next section.


<br clear="all">

{{< figure src="new-facility/enter-facility-name.png" link="new-facility/enter-facility-name.png" class="right col-6 col-lg-8" >}}

Select the option that lets you name the facility manually. Enter the **Name** of the Health Facility and submit the form.

<br clear="all">

{{< figure src="new-facility/created-facility.png" link="new-facility/created-facility.png" class="right col-6 col-lg-8" >}}

You should see the newly created Health Facility appear on the left-hand side and when you select it, you should see the Health Facility name and the primary contact of the Health Facility.

<br clear="all">

*****

### 2. Create CHW Area and CHW

We will now create a CHW Area within the Health Facility that we previously created.

<br clear="all">

{{< figure src="new-chw-area/new-chw-area.png" link="new-chw-area/new-chw-area.png" class="right col-6 col-lg-8" >}}

Select the **Health Facility** on the left-hand side. Click on the **Blue Action Button** and select **New Area**.

<br clear="all">

{{< figure src="new-chw-area/create-new-person.png" link="new-chw-area/create-new-person.png" class="right col-6 col-lg-8" >}}

Select the option that lets you create a new person within the form. This person will automatically become the primary contact for the created place.

When filling in the required fields select **CHW** as the role. 

Once you have filled the required fields, click **Next** to go to the next section.

<br clear="all">

{{< figure src="new-chw-area/name-after-primary-contact.png" link="new-chw-area/name-after-primary-contact.png" class="right col-6 col-lg-8" >}}

You will get an option to name the Place after the created contact person or name it yourself. If you select **Yes**, the new place will be named `<contact-name>'s Area`. For example `Jane Doe's Area`.

<br clear="all">

{{< figure src="new-chw-area/created-chw-area.png" link="new-chw-area/created-chw-area.png" class="right col-6 col-lg-8" >}}

Once you submit, a new CHW Area will be created. On the right-hand you should see the CHW Area name, the primary contact of the CHW Area, and the Health Facility that the CHW Area belongs to.

<br clear="all">

*****

#### 3. Create Second Health Facility. 

<br clear="all">

{{< figure src="new-facility/skip-primary-contact.png" link="new-facility/skip-primary-contact.png" class="right col-6 col-lg-8" >}}

For the second Health Facility, we will skip creating or assigning a primary contact and focus on creating the second Health Facility.

<br clear="all">

{{< figure src="new-facility/enter-second-facility-name.png" link="new-facility/enter-second-facility-name.png" class="right col-6 col-lg-8" >}}

Enter the details of the Health Facility and submit the form.

<br clear="all">

{{< figure src="new-facility/multiple-facilities.png" link="new-facility/multiple-facilities.png" class="right col-6 col-lg-8" >}}

You should see the two Health Facilities appear on the left-hand side.

<br clear="all">

### 4. Create the CHW Supervisor User

Let's create a CHW Supervisor user who's linked to the CHW Supervisor contact we created earlier.

<br clear="all">

{{< figure src="new-chw-supervisor/app-settings.png" link="new-chw-supervisor/app-settings.png" class="right col-6 col-lg-8" >}}

Go to the **hamburger menu** and select **App Management**.

<br clear="all">

{{< figure src="new-chw-supervisor/add-user.png" link="new-chw-supervisor/add-user.png" class="right col-6 col-lg-8" >}}

When you are on the **App Management** page, select **Users** on the left-hand side and then select **Add User** on the right-hand side.

<br clear="all">

{{< figure src="new-chw-supervisor/fill-user-details.png" link="new-chw-supervisor/fill-user-details.png" class="right col-6 col-lg-8" >}}

You should now see an **Add User Form**. Fill in the user name, then select the role as **CHW Supervisor**. 

In the **Place** field, search for the first Health Facility by typing the first few letters of the Health Facility name. Once you have selected the first Health Facility, type the name of the Second Facility and select it as well.

Once that is done, under the **Associate Contact** field select the name of the CHW Supervisor whose user you are creating. Finally, input a password and hit **Submit**. 

<br clear="all">

Once this is done, you have created a supervisor who is assigned to multiple Health Facilities. You can logout and log into the app using the `username` and `password` that you just created.


{{% alert title="Note" %}} - The new multi-facility feature be applied to any `role` in a hierarchy. It can also be applied to multiple roles in a hierarchy. You need to add the role to the array with the key `"can_have_multiple_places"`.

```json
  "permissions": {
    ...

    "can_have_multiple_places": [
      "program_officer",
      "chw_supervisor",
    ],

    ...
  }
```
- The multi-facility feature supports a Contact belonging to Multiple Places. For instance, it is meant to support a CHW Supervisor belonging to multiple facilities. It is not meant to support One Facility having multiple CHW Supervisors. {{% /alert %}}

## Frequently Asked Questions

- [Compiling default app settings](https://forum.communityhealthtoolkit.org/t/default-config-do-not-compile/536)
- [Documentation for role permissions](https://forum.communityhealthtoolkit.org/t/documentation-for-role-permissions/502)
- [Where can I get more information about this feature](https://forum.communityhealthtoolkit.org/t/support-for-supervisors-who-need-to-manage-multiple-areas/3497)
