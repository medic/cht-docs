---
title: "Muting people"
weight: 1
description: >
   Muting and unmuting people and changes to their profiles
---

## How to mute a person

{{< figure src="muted-person.png" link="muted-person.png" class="right col-7 col-lg-6" >}}

To mute a person, navigate to the person’s profile, open the action window, and select the “Mute” form.

If accessing the “Mute” form from the Reports tab, you first need to choose a contact to mute from a dropdown list.

A question on the form asks “What is the reason for muting?” and provides options (exact form questions and options are configurable).

If the project has not been configured to require a manager verification step, the person will be muted as soon as the user clicks the “Submit” button (assuming the user is connected to the server).
If the partner requires manager verification, a task will be sent to the manager to confirm the muting status change. The person will remain active until the manager confirms the muting.

## Changes to a muted person's profile

The UI of a muted person's profile updates to make the muted status clear and easily recognizable, the following things happen:

* The icon turns grey
* A status of “Muted” displays on the second line below the person’s name
* Any actions that were previously available on the family remain available on the profile.
* Instead of the “Mute” form, there is now “Unmute”
* If an action is begun on a muted person, there will be a warning message saying “This person is currently muted. Are you sure you want to proceed?”

## Muted person in an active family

{{< figure src="muted-person-in-active-family.png" link="muted-person-in-active-family.png" class="right col-3 col-lg-3" >}}

If a single person is muted, but the family they belong to was/is active, the family as a whole remains styled “active” and only the individual person in the muted family members list updates.

* The main family icon remains pink, and there is no label “Muted” underneath the family name, since the entire family is not muted
* The muted individual(s) in the family members list have grey text for their names and display the label “Muted”.

## How to unmute a person

{{< figure src="unmuting-person.png" link="unmuting-person.png" class="right col-7 col-lg-6" >}}

People can be unmuted by submitting an “Unmute” form from the person’s profile. The unmute form can also be accessed via the Reports page.

The Unmute form asks about the reason for unmuting (exact questions and options configurable).

If a person belongs to a muted family or place, unmuting them unmutes the family or place levels above them at the same time.

Any unmuted schedules for the person (such as pregnancy ANC schedule) should pick up on track

## How a muted or unmuted person will appear in the stored data

{{< figure src="muted-or-unmuted-person-in-stored-data.png" link="muted-or-unmuted-person-in-stored-data.png" class="right col-7 col-lg-6" >}}

Muting is persistent. When a person is muted, a “muted” property is stored in its CouchDB document.

The “muted” property contains a date in ISO format which represents the moment the muting action was processed by Sentinel.

When the action of muting a person is processed, all registrations about that person are updated, changing the state of all “pending” or “scheduled” SMS schedules to “muted”.

When muting an already muted person, the “muted” property is not updated, retaining its initial value, also none of the registrations are updated.

When unmuting, the “muted” property is removed, along with updating all registrations about the person, setting present/future “muted” SMS schedules to a “scheduled” state.

## How muting/unmuting changes appear in scheduled SMS messages

{{< figure src="mute_or_unmuting_changes_in_schedules_sms.png" link="mute_or_unmuting_changes_in_schedules_sms.png" class="right col-7 col-lg-6" >}}

When muting/unmuting, related registrations that have “scheduled\_tasks” (SMS messages which are scheduled to be sent) are updated.

The action of muting will update all “scheduled\_tasks” which are in “scheduled” or “pending” state, setting their state to “muted”.

The action of unmuting will update all present or future “muted” “scheduled\_tasks”, setting their state to “scheduled” (messages with a due date in the past will remain “muted”).

## How to view muting history in medic-sentinel database

{{< figure src="muting-history-in-medic-sentinel-database.png" link="muting-history-in-medic-sentinel-database.png" class="right col-7 col-lg-6" >}}

Every time the muted state of a contact (person, family, etc) is updated, an entry is added to their “muting\_history”, the “muting\_history” can be found in the info-docs saved in medic-sentinel database.

Each entry includes the following information; a Boolean “muted” property that describes the new state, an ISO formatted “date” describing when the action was processed and a “report\_id” property which contains the “\_id” of the report that triggered the action.


