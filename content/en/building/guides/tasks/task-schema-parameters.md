---
title: "Understanding the parameters in the Task Schema"
linkTitle: Task Schema Parameters
description: >
  Understanding the data which is passed into Task interfaces
relatedContent: >
  building/reference/tasks
  building/guides/data/hydration
  core/overview/db-schema#contacts-persons-and-places
  core/overview/db-schema#reports
  building/tutorials/tasks-1

aliases:
   - /apps/guides/tasks/task-schema-parameters
---

{{% pageinfo %}}
This guide explains the parameters available in the Task Schema and important constraints governing the design of tasks.

- Useful knowledge if you are stuck writing your first `appliesIf` predicate
- Understanding the data which is available in the task system and important constraints
- Understand the special significance of the appliesTo attribute
{{% /pageinfo %}}

Let's synthesize some knowledge about CHT applications to help clarify what is happening within the task system:

1. All contacts in CHT applications are organised into hierarchies. For more information, read the [Contact and User Management Tutorial]({{< ref "building/tutorials/contact-and-users-1" >}}) or [schema for contact documents]({{< ref "core/overview/db-schema#contacts-persons-and-places" >}}).

2. All reports in the system are linked to one (and only one) contact. For more information, read [App Forms Tutorial]({{< ref "building/tutorials/app-forms" >}}) or the [schema for report documents]({{< ref "core/overview/db-schema#reports" >}}).

3. Documents are stored [minified]({{< ref "building/guides/data/hydration" >}}) (not hydrated). All data that is passed into the tasks system is minified.

4. Settings which control the documents which are available on the user's device are an important considerations to remember (eg [replication depth]({{< ref "building/guides/performance/replication#depth" >}}) or [purging]({{< ref "building/guides/performance/purging" >}})) since both tasks can only process docs which are present on the device.

{{% alert title="Key Point" %}}
The code in `tasks.js` runs on the user's devices, not in the cloud and not on a server.
{{% /alert %}}

## An important constraint of the tasks system
Every contact and every report on the user's device is processed by tasks.  That said, it is important to remember that this processing is scoped to happen **one contact at a time**. The code in `tasks.js` knows about one contact, but it is not possible to simultaneously know about that contact's siblings, descendents, ancestors, etc. 

With this constraint in mind, we can infer that tasks cannot know the answer to questions like:

* Is the sibling of this patient ill?
* Does this family have active patients?
* Are there cases of tuberculosis in a neighbouring household?

## The special significance of the appliesTo attribute

The [task.js schema]({{< ref "building/reference/tasks#tasksjs" >}}) includes the noteworthy attribute `appliesTo` which has two options: `contacts` and `reports`. This attribute is important! It changes the algorithm used to process the task, and the meaning of other attributes in the schema.

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
