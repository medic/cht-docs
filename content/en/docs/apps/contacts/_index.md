---
date: 2016-04-09T16:50:16+02:00
title: "Contacts"
identifier: "contacts"
weight: 4
description: >
  The people and places that are being cared for
---
<!-- ## Contacts: Person and Family Profiles -->
<!-- TODO Refine screenshots, and add desktop view. -->

“People” is the generic name we use for individuals in the app. They can be patients, family members, nurses or health workers. Anyone with a profile in the app is a person.

“Places” is the generic name that represents a level in the hierarchy. “People” belong to “places” and “places” belong to other higher level “places” in the hierarchy.

Depending on the context, a “place” might be a health facility and the “people” who get created at that level might be nurses. Most often for CHWs, these “places” are families. 

Users can access their “people” and “places” from the People tab. 

## Main List

<img src="/images/contacts-main-list.png" width="23%" align="right" />

The view on the right is what a logged-in CHW would see in when they access the “People” tab on a small screen. 

The item at the top of the list is the “place” the user belongs to. Below that, we see a list of the “places” they serve, represented by families. Individual “people” are not shown here, but they will appear in search results. 

Because this list defaults to show the “places” below the user in the hierarchy, a CHW supervisor would see a different view. Instead of families, they might see a list of CHW Areas they manage. 

New “places” can be added to this level of the hierarchy by clicking on the “Add new +” button at the bottom of the screen. This allows a CHW to add a new family to their list, or a CHW supervisor to add a new Area they manage. 


## Searching

Search for a “person” or “place” by clicking in the search area at the top of the screen. The freetext search works on all fields included in the “person” or “place” document such as patient name or patient ID. The exact fields depends on which information you’ve configured your app to collect.

After entering a search term, the list filters to show matching items. Searching will only return items that are lower than you in the hierarchy and that you have permission to view. 

To clear the search and return the default view, click on the refresh icon located to the right of the search box.

## Profiles

Clicking an item on the main list will open a profile where you can see detailed information about that person or place. At the top is general information like name and phone number.

<p float="left">
  <img src="/images/contacts-profile-1.png" width="23%" />
  <img src="/images/contacts-profile-2.png" width="23%" />
  <img src="/images/contacts-profile-3.png" width="23%" />
  <img src="/images/contacts-profile-4.png" width="23%" />
</p>

If you’re viewing a place profile, you’ll see a list of people or places that belong to this place in the app hierarchy, such as family members. The star signifies the primary contact.

Beneath that, you will find tasks for this person or place. At the very bottom is a history of submitted reports for this person or place.

From profiles, users can edit contact information, take actions, and, if viewing a place profile, add new people and assign a primary contact person. If a place is not at the bottom of the hierarchy, a user can add new places to the level below this.

{{% alert title="Note" %}}

A contact's profile page is defined by the [Fields](contact-summary), [Cards](condition-cards), and [Context](care-guides).

To update the Contact profiles for an app, changes must be compiled into `app-settings`, then uploaded.

Eg `medic-conf --local compile-app-settings backup-app-settings upload-app-settings`
{{% /alert %}}

### Fields
The top card on all profiles contains general information for the contact. All the fields shown in this summary card are configurable.

[Defining Contact Summary](contact-summary)

### Condition Cards

A “condition” card displays data on a profile that’s been submitted in a report about that person or place. Data can be pulled from one report or summarize many reports.

<p float="left">
  <img src="/images/contacts-condition-card-1.png" width="23%" />
  <img src="/images/contacts-condition-card-2.png" width="23%" />
</p>

Condition cards can be permanent or conditional; set to appear only when a specific type of report is submitted. They can also be set to disappear when a condition is resolved or a certain amount of time has passed. You can have as many condition cards as you like, though we recommend keeping the user’s experience in mind.

Configurable elements include: 
- Title 
- Label for each data point displayed
- Data point for the field 
- Icon for the field, if desired
- Conditions under which to display

[Defining Condition Cards](condition-cards)

### Care Guides
<!-- todo: Resolve Care Guides vs Actions -->

<img src="/images/contacts-care-guides.png" width="23%" align="right" />

“Care Guides” are dynamic forms that you can fill out for a person or place. You can access Care Guides by clicking on the + button at the bottom of a profile. For more info, see the "[Decision Support for Care Guides]()" section of this overview. 

You’ll see different forms here depending on which person or place you’re viewing. For example, forms for families might include a “Family Survey.” Forms for adult women might include “New Pregnancy.” Forms for adult women who have had a pregnancy report, and no delivery yet reported, would also see “ANC visit.” Forms for children might include “Under-5 Assessment” or “Growth Monitoring.”

Health workers can use these Care Guides at any time. If the app has scheduled a care visit or follow up, it will be listed under “Tasks.” 

[Defining Care Guides](care-guides)
