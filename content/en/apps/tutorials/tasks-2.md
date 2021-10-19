---
title: "Configuring Tasks - Part 2 - appliesTo and appliesIf"
linkTitle: Tasks 2
weight: 9
description: >
  A tutorial to fix bugs in the task in Part 1 using the appliesIf predicate function. Builds a deep understanding of the data available within the task system and constraints impacting the design of tasks.
relatedContent: >
  apps/reference/tasks
  apps/guides/data/hydration
  core/overview/db-schema#contacts-persons-and-places
  core/overview/db-schema#reports
  apps/tutorials/tasks-1

---

Tasks prompt users to complete activities on a programmatic schedule. This _Configuring Tasks_ tutorial series is a practical guide to the creation and management of tasks.

{{% pageinfo %}}
This tutorial will guide you through writing your first `appliesIf` predicate function.

- Understanding the data which is available in the task system and important constraints
- Understand the special significance of the appliesTo attribute
- Apply this theory to improve the task from [Part 1]({{< ref "apps/tutorials/tasks-1" >}})
{{% /pageinfo %}}

## Prerequisites

* [Configuring Tasks - Part 1]({{< ref "apps/tutorials/tasks-1" >}})

## Understanding the data which is available in the tasks system
There are several relevant facts about CHT applications which should be clear before writing tasks:

{{% alert title="Key Point" %}}
The code in `tasks.js` runs on the user's devices, not in the cloud and not on a server.
{{% /alert %}}

1. All contacts in CHT applications are organised into hierarchies. For more information, read the [Contact and User Management Tutorial]({{< ref "apps/tutorials/contact-and-users-1" >}}) or [schema for contact documents](< ref "core/overview/db-schema#contacts-persons-and-places" >).
2. All reports in the system are linked to one (and only one) contact. For more information, read [App Forms Tutorial]({{< ref "apps/tutorials/app-forms" >}}) or the [schema for report documents](< ref "core/overview/db-schema#reports" >).
3. Documents are stored [minified]({{< ref "apps/guides/data/hydration" >}}) (not hydrated). All data that is passed into the tasks system is minified.
4. Settings which control the documents which are available on the user's device are an important considerations to remember for tasks (eg [replication depth]("apps/guides/performance/replication#depth") or [purging]({{{< ref "apps/guides/performance/purging" >}})) since the tasks system can only process docs which are present on the device.

### An important constraint of the tasks system
Every contact and every report on the user's device is processed by the tasks system -- but this processing is scoped to happen **one contact at a time**. The code in `tasks.js` knows everything about one contact at a time, but it knows nothing about that contact's siblings, descendents, ancestors, etc. 

With this constraint in mind, we can infer that tasks cannot know the answer to questions like:

* Is the sibling of this patient ill?
* Does this family have active patients?
* Are there cases of tuberculosis in a neighbouring household?

## The special significance of the appliesTo attribute

The [task.js schema]({{< ref "apps/reference/tasks#tasksjs" >}}) includes the noteworthy attribute `appliesTo` which has two options: `contacts` and `reports`. This attribute is important! It changes the algorithm used to process the task, and the meaning of other attributes in the schema.

{{% alert title="Hint" %}}
`appliesTo` is important. When you're ready to write a task, one of the first thing you must decide is the `appliesTo` value.
{{% /alert %}}

The below algorithmic pseudocode explains the relationship between `appliesTo` and the attributes `appliesIf` and `appliesToType`:

### appliesTo: 'contacts'
```pseudocode
algorithm appliesTo is 'contacts'
  for contact of contacts:
    if contact.type is in task.appliesToType:
      if task.appliesIf(contact):
        create task events 
```

* `appliesToType` filters based on the contact document's `contact_type` value
* `appliesIf` predicate is called once per contact (even if that contact has no reports)
* `appliesIf(c)` is passed information about the contact (`c.contact`), and an array of all the contact's reports (`c.reports`)
* `events[].dueDate` defaults to the contact's creation date
* Results in up to one task schedule per contact

### appliesTo: 'reports'
```pseudocode
algorithm appliesTo is 'reports'
  for contact of contacts:
    for report of contact.reports:
      if report.form is in task.appliesToType:
        if task.appliesIf(contact, report):
          create task events
```

* `appliesToType` filters based on the report document's `form` value
* `appliesIf` predicate is called once per report
* `appliesIf(c, report)` is passed information about the contact (`c.contact`), an array of all the contact's reports (`c.reports`), and the current report being iterated on `report`
* `events[].dueDate` defaults to the report's creation date
* Can result in multiple, potentially overlapping task schedules per contact

## Improving the simple task from Part 1

In [Configuring Tasks - Part 1]({{< ref "apps/tutorials/tasks-1" >}}) we created a simple task which prompts users to complete an _assessment_ app form for new patients within 7 days of registration.

With the role of predicates in the tasks system now clarified, we can fix a few of the bugs from Part 1:

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

* `appliesToType` - The task should only show for contacts with `contact_type` equal to `patient`. This `appliesToType` is a _short-hand_ equivalent to `appliesIf: c => c.contact.contact_type === 'patient'`.
* `appliesIf` - A predicate which gates the creation of the task's event schedule
* `user.parent.contact_type` - The user is a CHW iff their parent is of type `chw_area`. The user object is hydrated.
* `!c.contact.date_of_death` - The contact must be alive
* `!c.contact.muted` - The contact must be unmuted

As an exercise:

1. Try to upload and test these changes to the task.
2. Was selecting `appliesTo: 'contacts'` the right choice? Can this task be written with `appliesTo: 'reports'`?

## Up Next
In [Part 3]({{< ref "apps/tutorials/tasks-3" >}}), we will look at an example of a more complex task.

## Frequently Asked Questions

- [Tasks for online users](https://forum.communityhealthtoolkit.org/t/tasks-for-online-users/574)
- [How can I debug task rules?](https://forum.communityhealthtoolkit.org/t/how-can-i-debug-task-rules/108)
