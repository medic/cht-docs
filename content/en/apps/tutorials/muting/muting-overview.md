
---
title: "Muting overview"
weight: 1
description: >
   An overview of what muting means and scenarios when it is applicable
---

# Overview

{{% pageinfo %}}

**What is muting?:** Muting is a way of temporarily quieting a person/household.This is accomplished by submitting a form.This form is accessible from the people/place profiles on the People page or from the Reports page.

{{% /pageinfo %}}

## Scenarios where muting is applicable

* As a CHW, I want to mute a particular family if they move from the area or refuse services so that I don’t continue to receive tasks that can never be fulfilled and poorly affect my performance
* As a CHW, I want the ability to silence notifications for an entire family so that I do not have to silence all schedules individually.
* As a CHW, I want the ability to unmute the entire family and resume services if the family returns so that I don’t have to re-register everyone individually.
* As a CHW, I want to mute all schedules for an individual person if they move from the area so that I don’t receive tasks for them but can resume service if they move back to the area.
* As a nurse, I want to take an action on a person belonging to a family that has been muted by a CHW so that if they show up at my clinic, I can help them.


## Things you need to note about muting:

* Muting is temporary thus the muted people/places are not deleted and all historical data for all muted people/places remains in the app.
* The form is accessible from people/place profiles on the People page or from the Reports page.
* Muting a place (family, clinic, district, etc) mutes all the people/places at that place AND all the people/places below it in the hierarchy.
* Users won’t receive new tasks or SMS reminders for muted contacts. Any open schedules aren’t deleted or paused, merely quieted.
* Forms can still be submitted while the contact is muted. The user will see a warning that no tasks will be generated for this person/place unless they are first unmuted.
* Muted people/places can be unmuted at any time. Any schedules the person/place was enrolled in will resume on track.
* Muting can be done offline.If the version you are using is above 3.12.0 then you are able to mute offline.Previously, muting and unmuting were performed only on the server which meant that offline users would not see the results of submitting mute/unmute reports until they were synced and processed by the server.
* Muting works for both web-app and SMS workflows .Note: we aren't managing families over SMS yet, but might some day.
* Manager approval is configurable. Manager approval is not required for muting, but, like death reporting, it can be made a configurable option for partners that want it. If desired, this just requires an additional form for confirmation that the manager will submit which is set as the muting form.
* Muting can happen at any place level in a hierarchy. This feature has been built generically enough to support muting any place level. Muting a place mutes all the people/places at that place and below in the hierarchy. For example, muting a family serves as a shortcut to muting all individuals in a household.
* There is no such thing as an unmuted person in a muted place.Whenever muting is set at the place level, it always applies to all people/places beneath that place. Unmuting a person/place will automatically unmute any muted parent places. If a person in a muted family is unmuted, the entire family is unmuted.


## Muting Technical Overview(DB Updates)

* Mute state is stored on person and place documents. When a contact is muted, a ‘muted’ key will be added to all relevant contacts. The value of that key will be set to the date that the mute form was synced to the server, not the date that the mute form was submitted. This is because muting is achieved through sentinel transitions and transitions only run on the server. Unmuting a contact will entirely remove the muted key from the contact. To check if a contact is currently muted, you can simply check for the existence of the muted key.
* Mute history is stored on the corresponding -info doc in medic-sentinel. While the mute state is stored on the relevant contact and can tell you the contact’s current mute state, it doesn’t tell you the periods of time the contact was muted. You can see the history of muting and unmuting from the -info doc for the contact. -info docs are stored in the medic-sentinel database in Couch.
* Muting an already muted contact will not update anything. Since we want to know when the contact started to be muted, muting an already muted contact will not update the timestamp on their mute state, nor will it update the mute history. The same is true for unmuting a contact that is not currently muted... we will not update the last unmute timestamp.

## Muting vs Death Reporting

A project may support both death reporting and muting - they are not mutually exclusive. Death reporting moves the deceased person to a different part of the family members list and does not allow actions. Muting keeps the person in the family members list and allows actions, just not schedules.

|   Death reporting                                                                                        | Muting                                                                                         |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| <p></p><ul><li>Permanent state</li></ul>                                                                 | <ul><li>Temporary state</li></ul>                                                              |
| <p></p><ul><li>Only allowed at the individual level</li></ul>                                            | <ul><li>Place, family, or individual level</li></ul>                                           |
| <p></p><ul><li>Removes schedules</li></ul>                                                               | <ul><li>“Quiets” notifications for schedules</li></ul>                                         |
| <p></p><ul><li>A deceased individual is removed from the family list</li></ul>                           | <ul><li>A muted individual is not removed from the family list<br></li></ul>                   |
| <p></p><ul><li><p>No new actions can be performed</p><p>except for one - reverse the death</p></li></ul> | <ul><li>New actions may be performed, but no tasks or notifications will be sent<br></li></ul> |
| <p></p><ul><li>Manager confirmation configurable</li></ul>                                               | <p></p><ul><li>Manager confirmation configurable</li></ul>                                     |

