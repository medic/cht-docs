---
title: Muting
weight: 10
description: >
   Temporarily silence tasks and SMS schedules
keywords: muting
relatedContent: >
  apps/reference/app-settings/transitions/#muting
---




Muting can be done when a particular family or person moves from an area or refuses services provided by a CHW. This ensures that tasks related to a person or place that is muted, are not generated.

With muting, notifications are silenced for the entire family or place rather than silencing all schedules individually.

Unmuting enables the CHW to resume services for a person if they move back to the area or if they accept services provided by the CHW.It also enables nurses to take an action on a person who visits the clinic even if they belong to a family that is muted.

### How it is done

To mute a person or a family, navigate to their profile, open the action window, and select the “Mute” form. The form can also be accessed from the Reports tab by choosing a contact to mute from a dropdown list. 

<div class="container">
  <div class="row">
{{< figure src="muted_person.png" link="muted_person.png" class="col-9 col-lg-6" >}}
{{< figure src="muting-family-form.png" link="muting-family-form.png" class="col-6 col-lg-4" >}}
  </div>
</div>

Some changes are observed in the UI when a family or a person is muted to make the muted status clear and easily recognizable. The person's or family's icon turns grey  and a status of “Muted” displays on the second line below the person's or family's name. Any actions that were previously available on the family or person remain available on the profile.

{{< figure src="muted-family-appearance-on-list.png" link="muted-family-appearance-on-list.png" class="col-3 col-lg-6" >}}

For the cases where families are muted, each of the family members in the people card are also styled as muted, (grey icons and “Muted” labels).A user may add a new person to a muted household. If they do, and choose to leave the family muted, the new person will be automatically muted once created. When a family is unmuted, all individuals in the family will be unmuted at the same time. 

Unmuting an individual person in a muted family works essentially the same way, the action unmutes the entire family because unmuted individuals  are not allowed underneath a muted household.

### Configuration

Through [configuration]({{< relref "apps/reference/app-settings/transitions" >}}), you can specify which form mutes and unmutes, form availability, form questions and options, manager verification and labels used for display and warning messages.

### Muting vs Death Reporting

A project may support both death reporting and muting - they are not mutually exclusive. Death reporting moves the deceased person to a different part of the family members list and does not allow actions. Muting keeps the person in the family members list, allows actions and disables schedules.

|   Death reporting                                                                                        | Muting                                                                                         |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| <p></p><ul><li>Permanent state</li></ul>                                                                 | <ul><li>Temporary state</li></ul>                                                              |
| <p></p><ul><li>Only allowed at the individual level</li></ul>                                            | <ul><li>Place, family, or individual level</li></ul>                                           |
| <p></p><ul><li>Removes schedules</li></ul>                                                               | <ul><li>“Quiets” notifications for schedules</li></ul>                                         |
| <p></p><ul><li>A deceased individual is removed from the family list</li></ul>                           | <ul><li>A muted individual is not removed from the family list<br></li></ul>                   |
| <p></p><ul><li><p>No new actions can be performed</p><p>except for one - reverse the death</p></li></ul> | <ul><li>New actions may be performed, but no tasks or notifications will be sent<br></li></ul> |
| <p></p><ul><li>Manager confirmation configurable</li></ul>                                               | <p></p><ul><li>Manager confirmation configurable</li></ul>                                     |





