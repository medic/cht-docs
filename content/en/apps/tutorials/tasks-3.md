---
title: "Configuring Tasks - Part 3"
linkTitle: Tasks 3
weight: 9
description: >
  Configuring some more advanced tasks
relatedContent: >
  apps/features/tasks
  apps/reference/tasks
  apps/concepts/workflows
  design/best-practices/#anatomy-of-a-task

---

Tasks prompt users to complete activities on a programmatic schedule. This _Configuring Tasks_ tutorial series is a practical guide to the creation and management of tasks.

{{% pageinfo %}}
This tutorial will guide you through the development of an advanced task.

- Create a task with a complex follow-up schedule
- Use a 3rd party JavaScript library `luxon` to make Date/Time calculations easier
- Pass information from the task into the task's action _app form_ with `modifyContent`
- Custom logic for resolving a task
{{% /pageinfo %}}

## Prerequisites

* [Configuring Tasks - Part 1]({{< ref "apps/tutorials/tasks-1" >}})
* [Configuring Tasks - Part 2]({{< ref "apps/tutorials/tasks-2" >}})
* [Maternal and Newborn Health Reference App]({{< ref "apps/examples/anc" >}})

## Scenario

This scenario is loosely based on the _Pregnancy Visit Task_ from the [Maternal and Newborn Health Reference App]({{< ref "apps/examples/anc" >}}). 

The task should:

1. Appear only on CHW devices
2. Appear for any pregnant patient with a last mentral period estimation
3. Appear eight times on a schedule based off the last mentrual period (LMP).
4. Task schedules should be skipped if an _assessment followup_ is completed within the scheduled time.

## Developing the task

This solution relies on the library [luxon](https://moment.github.io/luxon) for parsing and manipulating dates and times. Let's start by installing it locally:

```zsh
npm install --save-dev luxon
```

And then in `tasks.js` we can analyse this solution:

```javascript
const { DateTime } = require('luxon');

module.exports = {
  name: 'pnc_followup',
  icon: 'icon-follow-up',
  title: 'task.pnc_followup',
  appliesTo: 'contacts',
  appliesToType: ['patient'],
  appliesIf: function (contact) => {
    const userIsChw = user.parent && user.parent.contact_type === 'chw_area';
    const isDead = contact.contact.date_of_death;
    const isMuted = contact.contact.muted;

    if (userIsChw && !isDead && !isMuted) {
      const mostRecentPregnancy = Utils.getMostRecentReport(contact.reports, 'pregnancy');
      const calculatedLmp = mostRecentPregnancy && Utils.getField(mostRecentPregnancy, 'g_details.estimated_lmp');
      this.lmp = calculatedLmp && DateTime.fromFormat(calculatedLmp, 'yyyy-MM-dd')
      
      return this.lmp && this.lmp.isValid;
    }
  },
  events: [12, 20, 26, 30, 34, 36, 38, 40] // follow-up weeks after LMP
    .map(weekAfterLmp => ({
      id: `pnc-week${week}`,
      start: weekAfterLmp > 30 ? 6 : 7,
      end: weekAfterLmp > 30 ? 7 : 14,
      dueDate: function (event, contact, report) {
        return this.lmp.plus({ weeks: weekAfterLmp }).toJsDate();
      }
    })),
  resolvedIf: function (contact, report, event, dueDate) {
    const start = Utils.addDate(dueDate, -event.start).getTime();
    const end = Utils.addDate(dueDate, event.end + 1).getTime();
    const pncInWindow = Utils.isFormSubmittedInWindow(contact.reports, 'pnc_followup', start, end);
    const assessmentInWindow = Utils.isFormSubmittedInWindow(contact.reports, 'assessment_followup', start, end);
    return pncInWindow || assessmentInWindow;
  },
  actions: [{
    form: 'pnc_followup',
    modifyContent: function (content, contact, report, event) {
      const followupCount = this.definition.events.findIndex(e => event.id === e.id) + 1;
      content.t_followup_count = followupCount.toString();
    }
  }],
};
```

## What is this code doing?

### AppliesIf
```
Appear for any pregnant patient with a last mentral period estimation
```

This function starts with the standard stuff from [Configuring Tasks - Part 2]({{< ref "apps/tutorials/tasks-2" >}}). We want to confirm the user is a CHW, and the patient is alive and unmuted.

Then, the code searches through the contact's reports to find the most recent (_newest_) pregnancy report using the [Utils helper library]({{< ref "apps/reference/_partial_utils" >}}). It gets that report's value for `report.fields.g_details.estimated_lmp`, which is a date string value calculated by the app form. It parses that string using the luxon library and returns true if the parse was valid.

Defining `lmp` as a property of `this`, _stores_ the LMP DateTime and we will use that value later in the `dueDate` calculation.

### Events
```
Appear eight times on a schedule based off the last mentrual period (LMP)
```

This is a recurring task, unlike the one-time task we wrote in [Configuring Tasks - Part 1]({{< ref "apps/tutorials/tasks-1" >}}). This task is going to appear once 12 weeks after the estimated LMP date, again after 20 weeks, and again 8 more times. The `dueDate` on the event says that the task event is due _a variable number of weeks after the estimated LMP_. We're using the `lmp` value which we saved from `appliesIf`. And because the schedule get closer together toward the end of the pregnancy, the time the CHW has to complete the follow-up is shorter.

## ResolvedIf
```
Task schedules should be skipped if an _assessment followup_ is completed within the scheduled time
```

`resolvedIf` captures the conditions when the task should disappear because it is being marked as _complete_. Since we want the task schedule to appear if the user completes an _assessment followup_ instead of the _pnc followup_, we can't use the [default resolvedIf definition]({{< ref "apps/reference/tasks/#default-resolvedif-method" >}}). So this function calculates timestamps for the start and end of each events, and uses the same Utils helper library to see if _either_ a _pnc_ or an _assessment_ followup is present within those timestamps.

We will be looking at `resolvedIf` in-depth in [Configuring Tasks - Part 4]({{ < ref "apps/tutorials/tasks-4" >}}).

## Actions
The `modifyContent` attribute allows the task to pass data from the task (in JavaScript) into the app form (XLSX). In this case, we are passing in a number indicating which follow-up is being completed by the app form. So the first task event (after 12 weeks) is followup 1, and the task event after 34 weeks is followup 5. 

This sort of data passing allows for rich experiences in the action app form - for example, the _anc followup_ form in this example can change the questions which are asked in the final weeks of the pregnancy, or add an additional page of questions on the first follow-up.

The `content` object is the object which binds to the `inputs` section in the app form. You can pass data into the app form by assigning values onto this object. 

In this sample `survey` from an app from, the value of `t_followup_count` is bound in the inputs section and receives the value from the task. An example calculation `is_first_followup` demonstrates how to use the value in the form's logic.

| type        | name               | label                       | required | relevant          | appearance | constraint | constraint_message  | calculation                                |
| ----------- | ------------------ | --------------------------- | -------- | ----------------- | ---------- | ---------- | ------------------- | ------------------------------------------ |
| begin group | inputs             |                             |          |                   | field-list |            |                     |                                            |
| hidden      | t_followup_count   | Data from task              |          |                   |            |            |                     |                                            |
| end group   |                    |                             |          |                   |            |            |                     |                                            |
| calculate   | is_first_followup  |                             |          |                   |            |            |                     | if(${t_follow_up_count}='1',true,false)   |

## Resources

* [Task.js Schema]({{< ref "apps/reference/tasks#tasksjs" >}})* details a set of properties for tasks.
* [Utils helper library]({{< ref "apps/reference/_partial_utils" >}})
* [Maternal and Newborn Health Reference App]({{< ref "apps/examples/anc" >}})
