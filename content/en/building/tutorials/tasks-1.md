---
title: "Building A Simple Task"
linkTitle: Tasks
weight: 9
description: >
  Writing and testing a simple task
relatedContent: >
  building/features/tasks
  building/reference/tasks
  building/concepts/workflows
  design/best-practices#anatomy-of-a-task

aliases:
   - /apps/tutorials/tasks-1
---

{{% pageinfo %}}
Tasks prompt users to complete activities on a programmatic schedule. This guide will explain how to write a task which prompts CHW users to complete an _assessment_ [app form]({{< ref "building/tutorials/app-forms" >}}) for new patients within 7 days of registration.

- Creating a straight-forward task
- Running and testing that task
{{% /pageinfo %}}

## Prerequisites

* Complete the [App Forms Tutorial]({{< ref "building/tutorials/app-forms" >}}) - Tasks prompt users to _complete activities_ by opening an app form. The app forms tutorial produces an _assessment_ app form which we will use here. You can also elect to substitute that with any [example app form](https://github.com/medic/cht-core/tree/master/config/default/forms/app).
* Complete the [Contact and User Management - Part 1 Tutorial]({{< ref "building/contact-management/contact-and-users-2" >}}) to create a hierarchy of contacts and an offline CHW user. 
* Read [Understanding the data available in tasks and targets]({{< ref "building/guides/tasks/task-schema-parameters" >}})

## Implementation Steps

Create a `tasks.js` file (this may have already been created by the `initialise-project-layout` command).

### 1. Define a Simple Task

The appearance, behaviour, and schedule of tasks are all controlled through the JavaScript in the `tasks.js` file. Let's start in that file with a simple first task:

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

The `tasks.js` file follows the JavaScript ES6 Module syntax and _exports_ an array of objects matching the [task.js schema]({{< ref "building/reference/tasks#tasksjs" >}})*. In the code above, the `tasks.js` file is exporting one task object with the following:

* `name` - This is used exclusively in the task's backend data. The _name_ isn't controlling any element of the tasks's behaviour, appearance, or schedule.
* `title` - This is controlling the "Task title" as defined in the [anatomy of a task]({{< ref "design/best-practices#anatomy-of-a-task" >}}).
* `icon` - This references a [resource]({{< ref "building/reference/resources" >}}) to be used as the task's icon. Refer to [anatomy of a task]({{< ref "design/best-practices#anatomy-of-a-task" >}}).
* `appliesTo` - We use `contacts` because we want one task _per contact_. For more details, read [Understanding the data available in tasks and targets]({{< ref "building/guides/tasks/task-schema-parameters" >}}).
* `appliesToType` - The task should only show for contacts with `contact_type` equal to `patient`. This `appliesToType` is a _short-hand_ equivalent to `appliesIf: c => c.contact.contact_type === 'patient'`.
* `appliesIf` - A predicate which gates the creation of the task's event schedule. For more details, read [Understanding the data available in tasks and targets]({{< ref "building/guides/tasks/task-schema-parameters" >}}).
  * `user.parent.contact_type` - The user is a CHW iff their parent is of type `chw_area`. The user object is hydrated.
  * `!c.contact.date_of_death` - The contact must be alive
  * `!c.contact.muted` - The contact must be unmuted
* `actions` - Actions control what happens when the user "selects" the task (clicks on it or touches it). We want to have the single option of completing the _assessment form_.
* `events` - This controls the task's schedule. We want a single event because this is a one-time follow-up. 
* `events[0].days` - The task event is due 7 days after the contact's creation date.
* `events[0].start` - The task event should appear 7 days before the due date, or immediately when the contact is created.
* `events[0].end` - The task event should disappear the day after the due date.

### 2. Uploading the Task

To run the `tasks.js` code, you'll need to load the code into your running CHT application. 

```zsh
cht --url=https://<username>:<password>@localhost
```

or for a faster experience, compile and upload only the relevant changes:

```zsh
cht --url=https://<username>:<password>@localhost compile-app-settings upload-app-settings
```

### 3. Testing the Task

Tasks are only available to [offline users]({{< ref "building/concepts/users#offline-users" >}}). To view and test this simple task, you'll need to login as an offline user like the CHW-level user created in the [Contact and User Management - Part 1 Tutorial]({{< ref "building/contact-management/contact-and-users-1" >}}). Once logged in, sync to make sure you have the latest configuration. You may be prompted to reload the application. 

Create a new contact in the hierarchy and navigate to the `Tasks` tab. You should see the new `assessment-after-registration` task!

{{< figure src="first-task.png" link="first-task.png" >}}

Next, test a few of the expected behaviours for the task:

* Confirm that clicking on the task causes the _assessment app form_ to load.
* Confirm that completing the _assessment app form_ causes the task to disappear.
* Move your system clock forward 7 days and reload the tasks tab. You should see that the task is now "Due Today".
* Move your system clock forward 8 days and reload the tasks tab. The task should disappear since the 7 day window has expired.
* Login as a supervisor user. You should not be able to see the task.
* The task should not appear only for patients - not for places or CHWs.
* If you mute a contact or [report the contact dead]({{< ref "building/tutorials/death-reporting" >}}), the task should disappear.

{{% alert title="Note" %}} Remember to reset your system clock to be accurate when you are done testing. {{% /alert %}}

## Frequently Asked Questions

- ["Error fetching tasks" - Tasks not appearing](https://forum.communityhealthtoolkit.org/t/error-fetching-tasks-tasks-not-appearing/537)
- [Tasks for online users](https://forum.communityhealthtoolkit.org/t/tasks-for-online-users/574)
- [How can I debug task rules?](https://forum.communityhealthtoolkit.org/t/how-can-i-debug-task-rules/108)
