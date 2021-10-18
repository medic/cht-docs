---
title: "Configuring Tasks - Part 2 - Deeper understanding of the task system"
linkTitle: Tasks 2
weight: 9
description: >
  Synthesizes facts about CHT applications which are relevant to developing tasks
relatedContent: >
  apps/features/tasks
  apps/reference/tasks
  apps/concepts/workflows
  design/best-practices/#anatomy-of-a-task

---

Tasks prompt users to complete activities on a programmatic schedule. This _Configuring Tasks_ tutorial series is a practical guide to the creation and management of tasks.

{{% pageinfo %}}
This guide 

- Synthesize facts about CHT applications and the tasks system which are relevant to developing tasks
- Apply this knowledge to make some improvements to the task in [Part 1]({{< ref "apps/tutorials/tasks-1" >}})
{{% /pageinfo %}}

## Prerequisites

* [Configuring Tasks - Part 1]({{< ref "apps/tutorials/tasks-1" >}})

## Relevant factors about CHT Applications
Before we can continue writing tasks, there are several relevant facts to ensure are mentioned about CHT applications:

1. The code in `tasks.js` runs on the user's devices, not on a server. Performant code is important.
2. All contacts in CHT applications are organised into hierarchies. For more information, read the [Contact and User Management Tutorial]({{< ref "apps/tutorials/contact-and-users-1" >}}) or [schema for contact documents](< ref "core/overview/db-schema/#contacts-persons-and-places" >).
3. All reports in the system are linked to one (and only one) contact. For more information, read [App Forms Tutorial]({{< ref "apps/tutorials/app-forms" >}}) or the [schema for report documents](< ref "core/overview/db-schema/#reports" >).
4. Documents are stored [minified]({{< ref "apps/guides/data/hydration" >}}) (not hydrated).
5. Settings which documents are available on a user's device will impact task logic (like [replication depth]("apps/guides/performance/replication#depth") or [purging]({{{< ref="apps/guides/performance/purging" >}})). 

## The task system's primary constraint

Every contact and every report on the user's device is processed by the Tasks system. But this processing happens **one contact at a time**. 

All data that is passed into the Tasks system is minified, except the `user` object which is hydrated. So tasks have no knowledge of the contact's ancestors (like in the contact-summary), except for the _ids. Tasks cannot make calculations requiring data which is linked to multiple contacts. 

With this in mind, tasks cannot know the answer to questions like:

* Is the sibling of this patient ill?
* Does this family have active patients in it?
* Are there cases of tuberculosis in a neighbouring household?

This is relevant not just for information required by `appliesIf` (when to show the task), but also `resolvesIf` (when the task should be marked disappear before the end of the schedule).

The design of workflows may need to be altered to ensure that the information required for task logic is collected together under one contact.

## The significance of the appliesTo attribute

The [task.js schema]({{< ref "apps/reference/tasks#tasksjs" >}}) includes the noteworthy attribute `appliesTo` which has two options: `contacts` and `reports`. This attribute is important! It changes the algorithm used to process the task, and the meaning of other attributes in the schema.

{{% alert title="Hint" %}}
`appliesTo` is important. When you're ready to write a task, one of the first thing you must decide is the `appliesTo` value.
{{% /alert %}}

### appliesTo: 'contacts'
```pseudocode
algorithm appliesTo is 'contacts'
  for contact of contacts:
    if contact.type is in task.appliesToType:
      if task.appliesIf(contact):
        create task schedule 
```

* `appliesToType` filters based on the contact document's `contact_type` value
* `appliesIf` is called once per contact (even if that contact has no reports)
* `appliesIf(c)` is passed information about the contact (`c.contact`), and an array of all the contact's reports (`c.reports`)
* Results in up to one task schedule per contact

### appliesTo: 'reports'
```pseudocode
algorithm appliesTo is 'reports'
  for contact of contacts:
    for report of contact.reports:
      if report.form is in task.appliesToType:
        if task.appliesIf(contact, report):
          create task schedule
```

* `appliesToType` filters based on the report document's `form` value
* `appliesIf` is called once per report
* `appliesIf(c, report)` is passed information about the contact (`c.contact`), an array of all the contact's reports (`c.reports`), and the current report being iterated on `report`
* Can result in multiple, potentially overlapping task schedules per contact

## Improving the simple task from Part 1

In [Configuring Tasks - Part 1]({{< ref "apps/tutorials/tasks-1" >}}) we created a simple task which prompts users to complete an _assessment_ app form for new patients within 7 days of registration.

With the constraints clarified above, we should be able to identify a few problems with the task we wrote in Part 1:

1. The task should trigger for patients only. But when testing, you'll notice the task is triggering for every contact in the hierarchy including _CHW Areas_, and the _CHW herself_. 
2. If you login as a supervisor user, you'll see the task but this was only supposed to trigger for CHWs.
3. If you mute a contact or [report the contact dead]({{< ref "apps/tutorials/death-reporting" >}}), the task will remain visible.
4. The task is visually plain. When there are many tasks in the system, it becomes useful to visually differentiate tasks with an icon.

```javascript
module.exports = [{
  name: 'assessment-after-registration',
  title: 'First Assessment',
  icon: 'icon-healthcare',
  appliesTo: 'contacts',
  appliesToType: ['patient'],
  appliesIf: c => user.parent && user.parent.contact_type === 'chw_area' && !c.contact.date_of_death && !c.contact.muted,
  actions: [{ form: 'assessment' }],
  events: [{
    start: 7,
    days: 7,
    end: 0,
  }],
}];
```

**What is this code doing?**

* `icon` - The icon can be set to any available [resource]({{< ref "apps/reference/resources" >}}).
* `appliesIf` - The task's event schedule will be created only if this JavaScript function returns true.
* `user.parent.contact_type` - The user is a CHW iff their parent is of type `chw_area`.
* `!c.contact.date_of_death` - The contact must be alive
* `!c.contact.muted` - The contact must be unmuted
* `appliesToType` - The task should only show for contacts with `contact_type` equal to `patient`. This is a "short-hand" which is equivalent to `appliesIf: c => c.contact.contact_type === 'patient'`.

## Up Next
As an exercise:

1. Try to upload and test these changes to the task.
2. Was selecting `appliesTo: 'contacts'` the right choice? Can this task be written with `appliesTo: 'reports'`?

In [Part 3]({{< ref "apps/tutorials/tasks-3" >}}), we will look at some more advanced tasks.

## Resources

* [Task.js Schema]({{< ref "apps/reference/tasks#tasksjs" >}})* details a set of properties for tasks.
* [Data Hydration]({{< ref "apps/guides/data/hydration" >}})
* [Schema for contact documents](< ref "core/overview/db-schema/#contacts-persons-and-places" >)
* [Schema for report documents](< ref "core/overview/db-schema/#reports" >)

## Frequently Asked Questions

- [Tasks for online users](https://forum.communityhealthtoolkit.org/t/tasks-for-online-users/574)
- [How can I debug task rules?](https://forum.communityhealthtoolkit.org/t/how-can-i-debug-task-rules/108)
