---
title: "Contact and User Management - Part 1"
linkTitle: Contacts + Users 1
weight: 2
description: >
  Create and edit contacts and users in the CHT UI
relatedContent: >
  building/concepts/users
  technical-overview/concepts/db-schema
  building/guides/data/users-bulk-load
aliases:
   - /building/tutorials/contact-and-users-1/
   - /apps/tutorials/contact-and-users-1
---

In this tutorial you will learn how to create and edit contacts and their associated users in and application built with the CHT using the default contact creation forms. This will help you get familiar with the UI of the webapp as well as some features and functionality. If you are already comfortable with this, you can skip to [part 2, which covers manipulating contacts and their associated documents using cht-conf]({{% ref "building/contact-management/contact-and-users-2" %}}).

## Brief Overview of Key Concepts

*Contacts* are people or places that are created in the CHT application.

*People* are both patients in the system and users of the system, such as CHWs or Nurses.

*Places* represent either an actual physical location such as a health facility, clinic, or a grouping such as a household or CHW Area.

*Contact forms* are forms in the CHT app that are used to create people or places.

*CHT App Hierarchy* is often modeled after the health system, health program or community structure.  All people who are registered in the app must be associated with a Place. These Places are located in a hierarchy with other Places. For instance, a Family Member is part of a Household. A Household and CHWs are part of a CHW Area. A CHW Area and nurses are part of a Health Facility. Additional levels may be added as needed. The Admin level operates outside of the hierarchy and gives access to all levels and people.

{{< figure src="app-hierarchy.jpg" link="app-hierarchy.jpg" caption="Default app hierarchy" >}}

*Users* represent credentials and roles / permissions for accessing the application. This can either be:

- People who can log into the application, such as CHWs or Nurses or
- Credentials granting external software restricted permissions to perform certain tasks, such as allowing an external service permission to write reports via the api.

## Required Resources

You should have a functioning CHT instance with contact forms configured. Read [How to set up a CHT local configuration environment]({{% ref "building/local-setup" %}})

## Implementation Steps

In this tutorial, you will work with the default contact forms and the default hierarchy, which is illustrated above in the overview of key concepts.

While logged in as an admin user, you will first create the Health Facility, CHW Supervisor, CHW Area, and CHW. You will then create the users for the CHW so that they can log in and create households and household members.


### 1. Create New Health Facility

{{< figure src="new-facility/select-new-facility.png" link="new-facility/select-new-facility.png" class="right col-6 col-lg-8 bordered-figure" >}}

While logged into the CHT application, go to the **People tab** and select **New Health Facility**


{{< figure src="new-facility/skip-primary-contact.png" link="new-facility/skip-primary-contact.png" class="right col-6 col-lg-8 bordered-figure" >}}

For now we will skip creating or assigning a primary contact so that we can focus on creating the new Health Facility.


{{< figure src="new-facility/enter-facility-name.png" link="new-facility/enter-facility-name.png" class="right col-6 col-lg-8 bordered-figure" >}}

Enter the details of the Health Facility and submit the form.


{{< figure src="new-facility/created-facility.png" link="new-facility/created-facility.png" class="right col-6 col-lg-8 bordered-figure" >}}

You should see the newly created Health Facility appear on the left-hand side and when you select it, you will see details of the Health Facility appear on the right-hand side.


### 2. Create CHW Area and CHW

We will now create a Place and the primary contact for it within one form. We want to create a CHW Area within the Health Facility that we previously created.


{{< figure src="new-chw-area/new-chw-area-fab.png" link="new-chw-area/new-chw-area-fab.png" class="right col-6 col-lg-8 bordered-figure" >}}

Select the **Health Facility** on the left-hand side. You will then select the Floating Action Button (FAB) that opens a menu with all actions.

{{< figure src="new-chw-area/new-chw-area.png" link="new-chw-area/new-chw-area.png" class="right col-6 col-lg-8 bordered-figure" >}}

In the FAB menu select **New Area**.

{{< figure src="new-chw-area/create-new-person.png" link="new-chw-area/create-new-person.png" class="right col-6 col-lg-8 bordered-figure" >}}

Select the option that lets you create a new person within the form. This person will automatically become the primary contact for the created place.


{{< figure src="new-chw-area/fill-required-fields.png" link="new-chw-area/fill-required-fields.png" class="right col-6 col-lg-8 bordered-figure" >}}

Fill in the required fields and go to the next section.


{{< figure src="new-chw-area/name-after-primary-contact.png" link="new-chw-area/name-after-primary-contact.png" class="right col-6 col-lg-8 bordered-figure" >}}

You will get an option to name the Place after the created contact person or name it yourself. If you select **Yes**, the new place will be named `<contact-name>'s Area`. For example `Jane Doe's Area`.


{{< figure src="new-chw-area/created-chw-area.png" link="new-chw-area/created-chw-area.png" class="right col-6 col-lg-8 bordered-figure" >}}

Once you submit, a new CHW Area will be created. On the right-hand you should see the CHW Area name, the primary contact of the CHW Area, and the Health Facility that the CHW Area belongs to.


### 3. Create CHW Supervisor

{{< figure src="new-chw-supervisor/new-person.png" link="new-chw-supervisor/new-person.png" class="right col-6 col-lg-8 bordered-figure" >}}

To create a primary contact for an existing Place (in this case, for the Health Facility that we created without a primary contact); select the Place and then select the Floating Action Button (FAB) that opens a menu with all actions, in the menu select the **New Person** action.

{{< figure src="new-chw-supervisor/belongs-to.png" link="new-chw-supervisor/belongs-to.png" class="right col-6 col-lg-8 bordered-figure" >}}

A *new person form* will appear with an option to change the Place the new person will belong to. A new contact will be created in the Health Facility when you submit this form.


{{< figure src="new-chw-supervisor/edit-facility.png" link="new-chw-supervisor/edit-facility.png" class="right col-6 col-lg-8 bordered-figure" >}}

Finally, we will set the newly created person as a primary contact for the Health Facility they belong to. To do this, select the Health Facility and then in the More Options (⋮) menu select the **Edit** action.


{{< figure src="new-chw-supervisor/set-primary-contact.png" link="new-chw-supervisor/set-primary-contact.png" class="right col-6 col-lg-8 bordered-figure" >}}

You should see an edit form from which you can set the primary contact of the Health Facility. Click **Submit** to apply the changes.

### 4. Create the CHW User

You may want to log in as a CHW and perform some actions now that the CHW and CHW Supervisor contacts are created; let's create a CHW user who's linked to the CHW contact we created earlier.


{{< figure src="new-chw-user/app-settings.png" link="new-chw-user/app-settings.png" class="right col-6 col-lg-8 bordered-figure" >}}

Go to the **hamburger menu** and select **App Settings**.


{{< figure src="new-chw-user/add-user.png" link="new-chw-user/add-user.png" class="right col-6 col-lg-8 bordered-figure" >}}

When you are on the **App Settings** page, select **Users** on the left-hand side and then select **Add User** on the right-hand side.

{{< figure src="new-chw-user/fill-user-details.png" link="new-chw-user/fill-user-details.png" class="right col-6 col-lg-8 bordered-figure" >}}

You should now see an **Add User Form**. Fill in the user name, then select the role as **CHW** or **Regional Admin**. In the **Place** field, select the name of the CHW Area whose CHW you want to create a user for (you can search by typing the first few letters of the CHW Area name). Once that is done, under the **Associate Contact** field select the name of the CHW whose user you are creating. Finally, input a password and hit **Submit**.

Once this is done, you can logout and log into the app using the username and password that you just created.


## Frequently Asked Questions

- [Is there any downside of creating too many users?](https://forum.communityhealthtoolkit.org/t/is-there-any-downside-of-creating-too-many-users/531)
- [For offline users, how often does the app try to refresh if there is an available internet connection?](https://forum.communityhealthtoolkit.org/t/for-offline-users-how-often-does-the-app-try-to-refresh-if-there-is-an-available-internet-connection/503)
- [Can one person belong to multiple places in the same hierarchy?](https://forum.communityhealthtoolkit.org/t/can-one-person-belong-to-multiple-places-in-the-same-hierarchy/101)
