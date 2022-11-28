---
title: "Muting families"
weight: 1
description: >
   Muting families
---

## How to mute a family
* To mute a family, navigate to the family profile, open up the action window, and select the “Mute” form
* If accessing the “Mute” form from the Reports tab, you first need to choose a contact to mute from a dropdown list
* A question on the form asks “What is the reason for muting?” and provides options (exact form questions and options are configurable)
* If the project has not been configured to require a manager verification step, the family will be muted as soon as the user clicks the “Submit” button (assuming the user is connected to the server)
* If the partner does require manager verification, a task will be sent to the manager to confirm the muting status change. The family will remain active until the manager confirms the muting.

## How muted families appear in the main list

* A family that has been muted remains in its original location in the main contacts list (either sorted alphabetically or by date last visited.)
* The styling of the muted family row updates to a grey icon to reflect the muted status

## How a muted family will appear in the stored data

* Muting is persistent. When a family is muted, a “muted” property is stored in its CouchDB document
* The “muted” property contains a date in ISO format which represents the moment the muting action was processed by Sentinel
* When the action of muting a family is processed , all family members are also muted (including saving the “muted” property in their CouchDB docs and adding a “muting\_history” entry in their Sentinel info doc). Also, all registrations about the family or any family members are updated, changing the state of all “pending” or “scheduled” SMS schedules to “muted”.
* When muting an already muted family, the “muted” property is not updated, retaining its initial value (this also applies to already muted family members and registrations about already muted family members)

## Changes to muted family profiles

The UI of muted family profiles updates to make the muted status clear and easily recognizable.

* The family icon turns grey
* A status of “Muted” displays on the second line below the family name
* Each of the family members in the people card are also styled as muted, (grey icons and “Muted” labels). Any actions that were previously available on the family remain available on the profile.
* Instead of the “Mute” form, there is now “Unmute”
* If an action is begun on a muted family, there will be a warning message saying “This family is currently muted. Are you sure you want to proceed?”
* A user may add a new person to a muted household. If they do, and choose to leave the family muted, the new person will be automatically muted once created.

## Changes to a muted family member's profile

The UI of muted family member profiles also updates to make their muted status clear and easily recognizable.

* The family icon turns grey
*   A status of “Muted” displays on the second line belowthe person’s name
* Any condition cards that were previously on the profile, such as Pregnancy or Immunization, remain
* Any actions that were previously available on the person’s profile remain available. Any actions that were previously available on the family remain available on the profile.
* Instead of the “Mute” form, there is now an “Unmute” form
* If an action is begun on a muted person, there will be a warning message saying “This person is currently muted. Are you sure you want to proceed?”

## How to unmute a family

* Families can be unmuted by submitting an “Unmute” form from the main family profile or from any family member profile. The unmute form can also be accessed via the Reports page.
* The Unmute form asks about the reason for unmuting (exact questions and options configurable).
* When a family is unmuted, all individuals in the family will be unmuted at the same time.
* Unmuting an individual person in a muted family works essentially the same way, unmuting the entire family and all other family members in it (because we don’t allow unmuted individuals underneath a muted household).
* Any unmuted family schedules should pick up right on track

## How an unmuted family is stored in the data

* An unmuted family does not have a “muted” property present in its CouchDB document
*   When the action of unmuting a family is processed , all family members are also unmuted (including removing the “muted” property in the CouchDB docs and adding a “muting\_history” entry in their Sentinel info doc). All registrations about the family or any family members are updated, changing the state of all present or future “muted” SMS schedules to “scheduled.  Also schedules that are past their due date retain the “muted” state.

