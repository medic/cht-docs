---
title: "Configuring Tasks - Part 1 - A Simple Task"
linkTitle: Tasks 1
weight: 9
description: >
  Writing and testing a simple task
relatedContent: >
  apps/features/tasks
  apps/reference/tasks
  apps/concepts/workflows
  design/best-practices/#anatomy-of-a-task

---

Tasks prompt users to complete activities on a programmatic schedule. The appearance, behaviour, and schedule of tasks are all controlled through the JavaScript in the `tasks.js` file.

{{% pageinfo %}}
This guide will explain how to write a task which prompts users to complete an _assessment_ [app form]{{< ref "apps/tutorials/app-forms" >}} for all new patients within 7 days of registration.

- Creating a straight-forward task
- Running and testing that task
{{% /pageinfo %}}

## Prerequisites

* Complete the [Building App Forms Tutorial]({{< ref "apps/tutorials/app-forms" >}}) - Tasks prompt users to _complete activities_ by opening an app form. The app forms tutorial produces an _assessment_ app form which we will use here. You can also use an [example app form](https://github.com/medic/cht-core/tree/master/config/default/forms/app).
* Complete the [Contact and User Management - Part 1 Tutorial]({{< ref "apps/tutorials/contact-and-users-2" >}}) to create a hierarchy of contacts and an offline CHW user. 

## A simple task

Let's start with a simple first task:

```javascript
module.exports = [{
  name: 'assessment-after-registration',
  title: 'First Assessment',
  appliesTo: 'contacts',
  actions: [{ form: 'assessment' }],
  events: [{
    start: 7,
    days: 7,
    end: 0,
  }],
}];
```

**What is this code doing?**

The `tasks.js` file follows the JavaScript ES6 Module syntax and _exports_ an array of objects matching the [task.js schema]({{< ref "apps/reference/tasks#tasksjs" >}})*. In the code above, the `tasks.js` file is exporting one task object with the following:

* `name` - This is used exclusively in the task's backend data. The _name_ isn't controlling any element of the tasks's behaviour, appearance, or schedule. We will look at this more in [Configuring Tasks - Part 4]({{ < ref "apps/tutorials/tasks-4" >}}).
* `title` - This is controlling the "Task title" as defined in the [anatomy of a task]({{< ref "design/best-practices/#anatomy-of-a-task" >}}).
* `appliesTo` - We will be looking at this in-depth in [Configuring Tasks - Part 2]({{ < ref "apps/tutorials/tasks-4" >}}). For now, we use `contacts` because we want one task _per contact_.
* `actions` - Actions control what happens when the user "selects" the task (clicks on it or touches it). We want to have the single option of completing the _assessment form_.
* `events` - This controls the task's schedule. We want a single event because this is a one-time follow-up. 
* `events[0].days` - The task is due 7 days after the contact's creation date.
* `events[0].start` - The task should appear 7 days before the due date, or immediately when the contact is created.
* `events[0].end` - The task should disappear the day after the due date.

## Uploading the task

To run the `tasks.js` code, you'll need to load the code into your running CHT application. 

```zsh
cht --url=https://<username>:<password>@localhost
```

or for a faster experience, compile and upload only the relevant changes:

```zsh
cht --url=https://<username>:<password>@localhost compile-app-settings upload-app-settings
```

## Testing the task

Tasks are only available to [offline users]({{< ref "apps/concepts/users/#offline-users" >}}). To view and test this simple task, you'll need to login as an offline user like the CHW-level user created in the [Contact and User Management - Part 1 Tutorial]({{< ref "apps/tutorials/contact-and-users-2" >}}). Once logged in, sync to make sure you have the latest configuration. You may be prompted to reload the application. 

Create a new contact in the hierarchy and navigate to the `Tasks` tab. You should see the new `assessment-after-registration` task!

{{< figure src="simple-task.png" link="simple-task.png" class="right col-6 col-lg-8" >}}

Next, test a few of the expected behaviours for the task:

* Confirm that clicking on the task causes the _assessment app form_ to load.
* Confirm that completing the _assessment app form_ causes the task to disappear.
* Move your system clock forward 7 days and reload the tasks tab. You should see that the task is now "Due Today".
* Move your system clock forward 8 days and reload the tasks tab. The task should disappear since the 7 day window has expired.

Hint: Remember to reset your system clock to be accurate when you are done testing.

## Making some minor improvements

Problems:

1. The task looks plain. This is maybe fine when there is only one task in the system, but it becomes useful to visually differentiate tasks with an icon.
2. The task triggers for every contact in the hierarchy including the _CHW Areas_, the _CHW_, and _Health Clinics_. It doesn't make sense for the CHW to do a "first assessment" for a place, to do a "first assessment" of themselves.
3. The task triggers for muted and dead contacts

```javascript
module.exports = [{
  name: 'assessment-after-registration',
  title: 'First Assessment',
  icon: 'icon-healthcare',
  appliesTo: 'contacts',
  appliesToType: ['patient'],
  appliesIf: c => !c.contact.date_of_death && !c.contact.muted,
  actions: [{ form: 'assessment' }],
  events: [{
    start: 7,
    days: 7,
    end: 0,
  }],
}];
```
**What is this code doing?**

* `icon` - The icon can be set to the handle of any available [resource]({{< ref "apps/reference/resources" >}}).
* `appliesToType` - The task should only show for contacts with `contact_type` equal to `patient`.
* `appliesIf` - The task's event schedule will be created only if this JavaScript function returns true. We don't want the task to ever appear for dead or muted contacts. See the [death reporting tutorial]({{< ref "apps/tutorials/../../death-reporting" >}}) for more details.

As an exercise, try to upload and test these changes to the task.

## Resources

* [Task Features]({{< ref "apps/features/tasks" >}})* gives an overview of tasks.
* [Anatomy of a Task]({{< ref "design/best-practices/#anatomy-of-a-task" >}})* takes you through how a user experiences a task. We will be controlling the visual anatomy
* [Task.js Schema]({{< ref "apps/reference/tasks#tasksjs" >}})* details a set of properties for tasks.

## Frequently Asked Questions

- ["Error fetching tasks" - Tasks not appearing](https://forum.communityhealthtoolkit.org/t/error-fetching-tasks-tasks-not-appearing/537)
- [Tasks for online users](https://forum.communityhealthtoolkit.org/t/tasks-for-online-users/574)
- [How can I debug task rules?](https://forum.communityhealthtoolkit.org/t/how-can-i-debug-task-rules/108)
