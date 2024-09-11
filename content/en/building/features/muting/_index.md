---
title: Muting
weight: 10
description: >
   Temporarily silence tasks and SMS schedules
keywords: muting
relatedContent: >
  building/reference/app-settings/transitions/#muting
aliases:
   - /apps/features/muting/
----

Muting is a way for CHWs to temporarily silence notifications about Contacts (people and places) and is commonly used when a person or family has temporarily relocated or refused services. When a Contact is muted, they will appear differently on the People tab and CHWs will no longer receive tasks or SMS about them.  

To start receiving notifications about a Contact again, CHWs can _unmute_ them. When a Contact is unmuted, tasks and SMS schedules will resume, but notifications that would have been sent while they were muted will not.

### Mute a Contact

To mute a Contact, CHWs typically submit a "Mute" form about them. This can be done either from the People tab or the Reports tab. When a person is muted, in addition to their notifications being silenced, their icon turns grey and a "Muted" status is displayed beneath their name. While a person or place is muted, CHWs and Nurses can still submit other forms about them. 

{{< figure src="muted_person.png" link="muted_person.png" class=" right col-9 col-lg-9" >}}

Some changes are observed in the UI when a family or a person is muted to make the muted status clear and easily recognizable. The person's or family's icon turns grey  and a status of “Muted” displays on the second line below the person's or family's name. Any actions that were previously available on the family or person remain available on the profile.

When a place is muted, all places and people beneath it will automatically be muted as well. For example, if a family is muted, all individuals in that family will automatically be muted. It is not possible to have a muted family with some family members that are not muted. This means that if a new person is added to a muted family, that person will automatically be muted when they are created. 

### Unmute a Contact

To unmute a Contact, CHWs typically submit an "Unmute" form. This will remove the "Mute" styling, resume notifications, and also unmute all places above them in the hierarchy.  For example, if a family member is unmuted, the entire family will automatically be unmuted since it is not possible to have an unmuted person in a muted family. 

### Configurability

While it's most common to have dedicated mute and unmute forms, any form can be set up to mute or unmute a Contact. It's also possible to set up verification flows for muting whereby mute/unmute requires a Supervisor to verify before the mute/unmute happens. And like the rest of the CHT, all text is customizable.  


### Muting vs Death Reporting

A project may support both death reporting and muting - they are not mutually exclusive. Death reporting moves the deceased person to a different part of the family members list and does not allow actions. Muting keeps the person in the family members list, allows actions and disables schedules.

|   Death reporting                                                                                        |     Muting                                                                                         |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| <p></p><ul><li>Permanent state</li></ul>                                                                 | <p></p><ul><li>Temporary state</li></ul>                                                              |
| <p></p><ul><li>Only allowed at the individual level</li></ul>                                            | <p></p><ul><li>Place, family, or individual level</li></ul>                                           |
| <p></p><ul><li>Removes schedules</li></ul>                                                               | <p></p><ul><li>“Quiets” notifications for schedules</li></ul>                                         |
| <p></p><ul><li>A deceased individual is removed from the family list</li></ul>                           | <p></p><ul><li>A muted individual is not removed from the family list<br></li></ul>                   |
| <p></p><ul><li><p>No new actions can be performed</p><p>except for one - reverse the death</p></li></ul> | <p></p><ul><li>New actions may be performed, but no tasks or notifications will be sent<br></li></ul> |
| <p></p><ul><li>Manager confirmation configurable</li></ul>                                               | <p></p><ul><li>Manager confirmation configurable</li></ul>                                     |





