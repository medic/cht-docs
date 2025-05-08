---
title: "Contacts and Users"
linkTitle: "Contacts"
weight: 1
aliases:
   - /building/features/contacts/
   - /apps/features/contacts/
---
<!-- ## Contacts: Person and Family Profiles -->
<!-- TODO Refine screenshots, and add desktop view. -->

{{< hextra/hero-subtitle >}}
  Overview of contacts and users
{{< /hextra/hero-subtitle >}}

“People” is the generic name used for individuals in apps built with the Core Framework. They can be patients, family members, nurses or health workers. Anyone with a profile in your app is a person.

“Places” is the generic name that represents a level in the [hierarchy]({{< ref "building/workflows/hierarchy" >}}). “People” belong to “places”, and “places” belong to other higher level “places” in the hierarchy. A “place” could be a geographic area, like a district with the "people" associated to it being health officers. A "place" could also be a structure in the health system, such as a health facility, and the "people" associated to it being nurses. In deployments with CHWs, the lowest "place" in the hierarchy often represents individual households or families, and the individual members of that household are the "people" associated to it.

Users can access their “people” and “places” from the **People** tab. The permissions set for your role and your placement in the hierarchy will determine which contacts you’re able to see. Advanced configuration options are available for a specific offline user role to manage what [level of contact data]({{< ref "building/guides/performance/replication#contact-depth" >}}) is downloaded and stored on their device.

{{< cards rows="2" >}}
{{< card link="people-mobile.png" image="people-mobile.png"  method="resize">}}
{{< card link="people-desktop.png" image="people-desktop.png"  method="resize">}}
{{< /cards >}}

## Main List

{{< cards rows="2" >}}
{{< card link="sort-dropdown.png" image="sort-dropdown.png"  method="resize">}}
{{< card link="people-mobile.png" image="people-mobile.png"  method="resize">}}
{{< /cards >}}


The list view on the leftmost screenshot is what a logged-in CHW would see when they access the “People” tab on a small screen.

The item at the top of the list is the “place” the user belongs to. Below that is a list of the “places” they serve, represented by families. Individual “people” are not shown here, but will appear in search results.

Because this list defaults to show the “places” below the user in the hierarchy, a CHW supervisor would see a different view. Instead of families, they might see a list of CHW Areas they manage.

New “places” can be added to this level of the hierarchy by clicking on the “Add new +” button at the bottom of the screen. This allows a CHW to add a new family to their list, or a CHW supervisor to add a new Area they manage.

With the [_UHC Mode_]({{< relref "building/features/uhc-mode" >}}) configured, the main list of households is displayed as shown on the rightmost screenshot to help health workers ensure that all households are visited regularly.

## Searching

{{< cards rows="1" >}}
{{< card link="search-mobile.png" image="search-mobile.png"  method="resize">}}
{{< /cards >}}

Click on the search icon at the top of the screen to search for a “person” or “place”. The freetext search works on all fields included in the “person” or “place” document such as patient name or patient ID. The exact fields depends on which information you’ve configured your app to collect.

After typing a search term, press the "Enter" key on your keyboard, then the list filters to show matching items. Searching will only return items that are lower than you in the hierarchy and that you have permission to view.

To clear the search and return to the default view, click on the arrow icon located to the left of the search box.

## Profiles

Clicking an item on the main list will open a profile where you can see detailed information about that person or place. At the top is general information like name and phone number.

If you’re viewing a place profile, you’ll see a list of people or places that belong to this place in the app hierarchy, such as family members. The star signifies the primary contact.

Beneath that, you will find tasks for this person or place. At the very bottom is a history of submitted reports for this person or place.

{{< cards rows="4" >}}
{{< card link="profile1.png" image="profile1.png"  method="resize">}}
{{< card link="profile2.png" image="profile2.png"  method="resize">}}
{{< card link="profile3.png" image="profile3.png"  method="resize">}}
{{< card link="profile4.png" image="profile4.png"  method="resize">}}
{{< /cards >}}

From profiles, users can edit contact information, take actions, and, if viewing a place profile, add new people and assign a primary contact person. If a place is not at the bottom of the hierarchy, a user can add new places to the level below this.

## Fields

### Contact Summary

The top card on all profiles contains general information for the contact. All the fields shown in this summary card are configurable.

{{< cards rows="4" >}}
{{< card link="bio1.png" image="bio1.png"  method="resize">}}
{{< card link="bio2.png" image="bio2.png"  method="resize">}}
{{< /cards >}}


{{< see-also page="contact-summary-templated" anchor="contact-summary" title="Defining Contact Summary" >}}

### Condition Cards

A “condition” card displays data on a profile that’s been submitted in a report about that person or place. Data can be pulled from one report or summarize many reports.

Condition cards can be permanent or conditional; set to appear only when a specific type of report is submitted. They can also be set to disappear when a condition is resolved or a certain amount of time has passed. You can have as many condition cards as you like, though we recommend keeping the user’s experience in mind.

Configurable elements include:
- Title
- Label for each data point displayed
- Data point for the field
- Icon for the field, if desired
- Conditions under which to display

{{< cards rows="4" >}}
{{< card link="condition-card1.png" image="condition-card1.png"  method="resize">}}
{{< card link="condition-card2.png" image="condition-card2.png"  method="resize">}}
{{< /cards >}}

{{< see-also page="contact-summary-templated" anchor="condition-cards" title="Defining Condition Cards" >}}


## Care Guides
<!-- todo: Resolve Care Guides vs Actions -->

{{< cards rows="4" >}}
{{< card link="care-guides.png" image="care-guides.png"  method="resize">}}
{{< /cards >}}


“Care Guides” are dynamic forms that you can fill out for a person or place. You can access Care Guides by clicking on the + button at the bottom of a profile. For more info, see the [Care Guides overview page]({{% ref care-guides %}}).

You’ll see different forms here depending on which person or place you’re viewing. For example, forms for families might include a “Family Survey.” Forms for adult women might include “New Pregnancy.” Forms for adult women who have had a pregnancy report, and no delivery yet reported, would also see “ANC visit.” Forms for children might include “Under-5 Assessment” or “Growth Monitoring.”

Health workers can use these Care Guides at any time. If the app has scheduled a care visit or follow up, it will be listed under “Tasks.”

{{< see-also page="contact-summary-templated" anchor="care-guides" title="Defining Care Guides" >}}


## Creating and Editing Contacts

Contacts are created/modified via [contact forms]({{< relref "building/forms/contact" >}}). These forms are highly configurable and allow for specifying detailed workflows for capturing information about contacts.

### Duplicate Contact Detection

_(Added in CHT `4.19.0`)_

{{< cards rows="4" >}}
{{< card link="duplicate-contact-screenshot.png" image="duplicate-contact-screenshot.png"  method="resize">}}
{{< /cards >}}

One major challenge when collecting contact data is ensuring users do not inadvertently enter duplicate records for the same contact. It is important to train users on the [searching]({{< ref "#searching" >}}) functionality described above as this will allow them to find the desired profile of a previously recorded contact instead of creating a duplicate record for the same person or place.

 The CHT also supports automatically detecting when a contact being created or edited by a user matches an existing contact record. If a duplicate contact is detected, the user will be given the option of proceeding to the profile of the existing contact. Alternatively, the user can choose to override the duplicate detection logic and continue creating/editing the contact as originally intended.

The matching logic for duplicate detection is [configurable]({{< relref "building/forms/contact#properties" >}}) and can be tuned to the specific needs and data structures of a particular project. The algorithm compares the created/edited contact _to its sibling contacts._ These are other contacts of the same type that share the same parent contact. By default, contacts are considered duplicates if they have very similar names AND (for persons) if they are the same age (in years). This default logic can be overridden with custom logic for each type of contact.


