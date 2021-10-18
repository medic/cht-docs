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
  design/best-practices#anatomy-of-a-task

---

Tasks prompt users to complete activities on a programmatic schedule. This _Configuring Tasks_ tutorial series is a practical guide to the creation and management of tasks.

{{% pageinfo %}}
This guide will explain how to write a task which prompts CHW users to complete an _assessment_ [app form]{{< ref "apps/tutorials/app-forms" >}} for new patients within 7 days of registration.

- Creating a straight-forward task
- Running and testing that task
{{% /pageinfo %}}

## Prerequisites

* Complete the [App Forms Tutorial]({{< ref "apps/tutorials/app-forms" >}}) - Tasks prompt users to _complete activities_ by opening an app form. The app forms tutorial produces an _assessment_ app form which we will use here. You can also elect to substitute that with any [example app form](https://github.com/medic/cht-core/tree/master/config/default/forms/app).
* Complete the [Contact and User Management - Part 1 Tutorial]({{< ref "apps/tutorials/contact-and-users-2" >}}) to create a hierarchy of contacts and an offline CHW user. 

## A simple task

The appearance, behaviour, and schedule of tasks are all controlled through the JavaScript in the `tasks.js` file. Let's start in that file with a simple first task:

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
* `title` - This is controlling the "Task title" as defined in the [anatomy of a task]({{< ref "design/best-practices#anatomy-of-a-task" >}}).
* `appliesTo` - We will be looking at this in-depth in [Configuring Tasks - Part 2]({{ < ref "apps/tutorials/tasks-2" >}}). For now, we use `contacts` because we want one task _per contact_.
* `actions` - Actions control what happens when the user "selects" the task (clicks on it or touches it). We want to have the single option of completing the _assessment form_.
* `events` - This controls the task's schedule. We want a single event because this is a one-time follow-up. 
* `events[0].days` - The task event is due 7 days after the contact's creation date.
* `events[0].start` - The task event should appear 7 days before the due date, or immediately when the contact is created.
* `events[0].end` - The task event should disappear the day after the due date.

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

Tasks are only available to [offline users]({{< ref "apps/concepts/users#offline-users" >}}). To view and test this simple task, you'll need to login as an offline user like the CHW-level user created in the [Contact and User Management - Part 1 Tutorial]({{< ref "apps/tutorials/contact-and-users-2" >}}). Once logged in, sync to make sure you have the latest configuration. You may be prompted to reload the application. 

Create a new contact in the hierarchy and navigate to the `Tasks` tab. You should see the new `assessment-after-registration` task!

![first-task](first-task.jpg "First Assessment Task")

Next, test a few of the expected behaviours for the task:

* Confirm that clicking on the task causes the _assessment app form_ to load.
* Confirm that completing the _assessment app form_ causes the task to disappear.
* Move your system clock forward 7 days and reload the tasks tab. You should see that the task is now "Due Today".
* Move your system clock forward 8 days and reload the tasks tab. The task should disappear since the 7 day window has expired.

Hint: Remember to reset your system clock to be accurate when you are done testing.

## Up Next
While you're testing, you might notice a few edge case bugs. In [Part 2]({{< ref "apps/tutorials/tasks-2" >}}), we will build a deeper understanding of the tasks system to fix these bugs.

## Frequently Asked Questions

- ["Error fetching tasks" - Tasks not appearing](https://forum.communityhealthtoolkit.org/t/error-fetching-tasks-tasks-not-appearing/537)
- [Tasks for online users](https://forum.communityhealthtoolkit.org/t/tasks-for-online-users/574)
- [How can I debug task rules?](https://forum.communityhealthtoolkit.org/t/how-can-i-debug-task-rules/108)
