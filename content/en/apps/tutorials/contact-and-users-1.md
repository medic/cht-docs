---
title: "Contact and User Management - Part 1"
linkTitle: Contacts + Users 1
weight: 2
description: >
  Creating and editing contacts and users in the CHT UI
relatedContent: >
  apps/concepts/users
  core/overview/db-schema/#users
  core/guides/users-bulk-load 
---

## Purpose of the tutorial

In this tutorial you will learn how to create and edit contacts and their associated users in the CHT application using the default contact creation forms. This will help you get familiar with the UI of the webapp as well as some features and functionality. If you are already comfortable with this, you can skip to [manipulating contacts and their associated documents using medic conf](creating-and-managing-users-and-contacts-with-medic-conf.md).

## Brief overview of key concepts

**Contacts** are people or places that are created in the CHT application.

**People** are both patients in the system and users of the system, such as CHWs or Nurses.

**Places** represent either an actual physical location such as a health facility, clinic, or a grouping such as a household or CHW area.

**Contact forms** are forms in the CHT app that are used to create people or places.

**CHT app hierarchy** is often modeled after the health system, health program or community structure.  All people who are registered in the app must be associated with a place. These places are located in a hierarchy with other places. For instance, a Family Member is part of a Household. A Household and CHWs are part of a CHW Area. A CHW Area and nurses are part of a Health Facility. Additional levels may be added as needed. The Admin level operates outside of the hierarchy and gives access to all levels and people.

![app hierarchy](app-hierarchy.jpg "Default app hierarchy")

**Users** represent credentials and roles / permissions for accessing the application. This can either be:

- People who can log into the application, such as CHWs or Nurses or
- Credentials granting external software restricted permissions to perform certain tasks, such as allowing an external service permission to write reports via the api.

## Required resources

You should have a functioning CHT instance with contact forms configured. Read [How to set up a CHT local configuration environment](setting_up_local_configuration_environment.md)

## Implementation steps

In this tutorial, you will work with the default contact forms and the default hierachy. The default hierarchy is illustrated above as part of the overview of key concepts.

While logged in as an admin user, you will first create the Health Facility, CHW Supervisor, CHW Area, and CHW. You will then create the users for the CHW so that they can log in and create households and household members.

### 1. Create the Health Facility, CHW Supervisor, CHW Area, and CHW

#### Create new Health facility

While logged into the CHT application, go to the people tab and select `New health facility`

![new health facility](new-facility/select-new-facility.png "New health facility")

There are 2 options for assigning a primary contact for the new facility:

- Creating a new contact as you are creating the new facility
- Selecting a primary contact from already created contacts

For now we will skip creating or assigning a primary contact so that we can focus on creating the new facility.

![skip primary contact](new-facility/skip-primary-contact.png "Skip primary contact")

Enter the details of the facility and submit the form.

![enter facility details](new-facility/enter-facility-name.png "Enter facility details")

You should see the newly created facility appear on the left hand side and when you select it, you will see details of the facility appear on the right hand side.

![created facility](new-facility/created-facility.png "Created facility")

#### Create CHW Area and CHW

We will now create a place and the primary contact for the place within one form. We want to create a CHW area within the facility that we previously created.

Select the Health facility on the left hand side. You will then select `New area` on the right hand side.

![new chw area](new-chw-area/new-chw-area.png "New CHW area")

Select the option that lets you create a new person within the form. This person will automatically become the primary contact for the created place.

![create new person](new-chw-area/create-new-person.png "Create a new person")

Fill in the required fields and go to the next section.

![fill fields](new-chw-area/fill-required-fields.png "Fill required fields")

You will get an option to name the place after the created contact person or name it yourself. If you select `Yes`, the new place will be named `<contact-name>'s Area`. For example `Jane Doe's Area`.

![name after contact](new-chw-area/name-after-primary-contact.png "Name after contact")

Once you submit, a new CHW area will be created. You should see on the right hand, the CHW Area name, the primary contact of the CHW Area, and the facility that the CHW area belongs to.

![created area](new-chw-area/created-chw-area.png "Created CHW Area")

#### Create CHW Supervisor

To create a primary contact for an existing place (in this case, for the facility that we created without a primary contact); select the place and the select the `New person` action.

![new person](new-chw-supervisor/new-person.png "New person")

A new person form will appear with an option to change the place the new person will belong to. Once you submit this form, a new contact will be created in the Facility.

![belongs to](new-chw-supervisor/belongs-to.png "Belongs to")

Finally, we will set the newly created person as a primary contact for the Facility they belong to. To do this, select the facility and then select the `Edit` action.

![edit facility](new-chw-supervisor/edit-facility.png "Edit facility")

You should see an edit form from which you can set the primary contact of the facility and submit to apply the changes.

![set primary contact](new-chw-supervisor/set-primary-contact.png "Set primary contact")

### 2. Create the CHW user

With the CHW and CHW Supervisor contacts created, you may want to log in as a CHW and perform some actions. To do this, let's create a CHW user that's linked to the CHW contact we created earlier.

Go to the hamburger menu and select `App Settings`.

![app settings](new-chw-user/app-settings.png "App settings")

When you are on the `App Settings` page, select `Users` on the right hand side and then select `Add user`.

![add user](new-chw-user/add-user.png "Add user")

You should now see an `Add user` form. Fill in the user name, the select the role as `CHW` or `Regional admin`. In the `Place` field, select the name of the CHW area whose CHW you want to create a user for (you can search by typing the first few letters of the CHW area name). Once that is done, under the `Associate contact` field select the name of the CHW whose user you are creating. Finally, input a password and hit submit.

![user details](new-chw-user/fill-user-details.png "Fill user details")

Once this is done, you can logout and log into the app using the username and password that you just created.

## Frequently Asked Questions

- [Is there any downside of creating too many users?](https://forum.communityhealthtoolkit.org/t/is-there-any-downside-of-creating-too-many-users/531)
- [For offline users, how often does the app try to refresh if there is an available internet connection?](https://forum.communityhealthtoolkit.org/t/for-offline-users-how-often-does-the-app-try-to-refresh-if-there-is-an-available-internet-connection/503)
- [Can one person belong to multiple places in the same hierarchy?](https://forum.communityhealthtoolkit.org/t/can-one-person-belong-to-multiple-places-in-the-same-hierarchy/101)
