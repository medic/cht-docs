# Things you need to note about muting



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
