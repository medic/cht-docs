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

- Synthesizes facts about CHT applications which are relevant to developing tasks
- Provides a deep-dive into the task system's algorithm and the noteable `appliesTo` attribute
- Details some practical limits and constraints of the task system
{{% /pageinfo %}}

## Prerequisites

* In [Configuring Tasks - Part 1]({{< ref "apps/tutorials/tasks-1" >}}) we created a simple task setting a task's appearance, behaviour, and schedule.

## Synthesising some facts about CHT Applications
Before we can continue writing tasks, there are several relevant facts to ensure are clear about CHT applications:

1. All contacts in a CHT application are organised into hierarchies. For more information, read [Contact and User Management Tutorial]({{< ref "apps/tutorials/contact-and-users-1" >}}) or [schema for contact documents](< ref "core/overview/db-schema/#contacts-persons-and-places" >).
2. All `reports` in the system are linked to one (and only one) contact through the report's subject id (`patient_id`, `patient_uuid`, `place_id`, or `place_uuid`). For more information, read [App Forms Tutorial]({{< ref "apps/tutorials/app-forms" >}}) or the [schema for report documents](< ref "core/overview/db-schema/#reports" >).
3. Documents are stored [minified]({{< ref "apps/guides/data/hydration" >}}) (not hydrated).
4. The code in `tasks.js` runs on the user's device (not on a server) because tasks need to function for users while they are completely offline.
5. Different users are exposed to different parts of the hierarchy on their device. So in the figure below, `CHW Fatou` sees one part of the hierarchy on her device (highlighted in yellow), while `Supervisor Fadimata` sees a different part of the hierarchy on (highlighted in blue). `tasks.js` serves tasks for both users on both devices.

![app-hierarchy-by-user](app-hierarchy-by-user.jpg "Default app hierarchy")

## The task system algorithm and the noteable appliesTo attribute

The [task.js schema]({{< ref "apps/reference/tasks#tasksjs" >}}) includes the noteworthy attribute `appliesTo` which has two options: `contacts` and `reports`. This attribute is important! It changes the algorithm used to process the task, and the meaning of other attributes in the schema! 

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

## Facts about the Tasks system

* Every contact and every report on the user's device is processed by the Tasks system. But this happens **one contact at a time**. 
* Tasks cannot make calculations requiring data which is linked to multiple contacts. So for example, a task cannot trigger to have a CHW visit for John because Sally has become pregnant.
* All data that is passed into the Tasks system is minified, except the `user` object which is hydrated.

A task cannot determine the answer to questions like:

* Is the sibling of this contact ill?
* Does this family have patients in it?
* Is there tuberculosis in a neighboring household?

The design of workflows may need to be altered to ensure that the information required for task logic is collected together under one contact. You may find creativity to be an asset :) 

## Resources

* [Task.js Schema]({{< ref "apps/reference/tasks#tasksjs" >}})* details a set of properties for tasks.
* [Data Hydration]({{< ref "apps/guides/data/hydration" >}})
* [Schema for contact documents](< ref "core/overview/db-schema/#contacts-persons-and-places" >)
* [Schema for report documents](< ref "core/overview/db-schema/#reports" >)

## Frequently Asked Questions

- [Tasks for online users](https://forum.communityhealthtoolkit.org/t/tasks-for-online-users/574)
- [How can I debug task rules?](https://forum.communityhealthtoolkit.org/t/how-can-i-debug-task-rules/108)
