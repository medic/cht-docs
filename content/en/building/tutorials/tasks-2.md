---
title: "Building A Complex Task (Optional)"
linkTitle: Complex Tasks
weight: 20
description: >
  Building a more complex task
relatedContent: >
  building/tasks/simple-tasks
  building/reference/tasks
  building/examples/anc

aliases:
   - /apps/tutorials/tasks-2
---

{{% pageinfo %}}
Tasks prompt users to complete activities on a programmatic schedule. This tutorial will guide you through the development of an advanced task. This is an _optional_ tutorial and is not required to _get started_ with CHT Application development.

- Create a task with a complex follow-up schedule
- Use a 3rd party JavaScript library `luxon` to make Date/Time calculations easier
- Pass information from the task into the action _app form_
- Custom logic for resolving a task
{{% /pageinfo %}}

## Prerequisites

* [Building a simple task]({{< ref "building/tasks/simple-tasks" >}})
* [Maternal and Newborn Health Reference App]({{< ref "building/examples/anc" >}})

## Scenario

This scenario is loosely based on the _Pregnancy Visit Task_ from the [Maternal and Newborn Health Reference App]({{< ref "building/examples/anc" >}}). 

We expectations for the task are:

1. Only CHW users should be prompted to complete pregnancy visits
2. Pregnancy visits should appear for pregnant patients after their pregnancy registration
3. Pregnancy visits should be scheduled eight times between the last mentrual period (LMP) and delivery.
4. A pregnancy visit should be skipped if an _assessment followup_ is completed within the scheduled window for the pregancy visit.
5. The first pregnancy visit should prompt the CHW to ask some additional questions

## Developing the task

This solution relies on the library [luxon](https://moment.github.io/luxon) for parsing and manipulating dates and times. Let's start by installing it locally:

```zsh
npm install --save-dev luxon
```

And then in `tasks.js` we can analyse this solution:

```javascript
const { DateTime } = require('luxon');

module.exports = {
  name: 'pnc-after-pregnancy',
  icon: 'icon-follow-up',
  title: 'task.pnc_followup',
  appliesTo: 'contacts',
  appliesToType: ['patient'],
  appliesIf: function (contact) {
    const userIsChw = user.parent && user.parent.contact_type === 'chw_area';
    const isDead = contact.contact.date_of_death;
    const isMuted = contact.contact.muted;

    if (userIsChw && !isDead && !isMuted) {
      const mostRecentPregnancy = Utils.getMostRecentReport(contact.reports, 'pregnancy');
      const calculatedLmp = mostRecentPregnancy && Utils.getField(mostRecentPregnancy, 'g_details.estimated_lmp');
      this.lmp = calculatedLmp && DateTime.fromFormat(calculatedLmp, 'yyyy-MM-dd');
      
      return this.lmp && this.lmp.isValid;
    }
  },
  events: [12, 20, 26, 30, 34, 36, 38, 40] // follow-up weeks after LMP
    .map(weekAfterLmp => ({
      id: `pnc-week-${weekAfterLmp}`,
      start: weekAfterLmp > 30 ? 6 : 7,
      end: weekAfterLmp > 30 ? 7 : 14,
      dueDate: function () {
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
  }]
};
```

## What is this code doing?
### AppliesIf
```
1. Only CHW users should be prompted to complete pregnancy visits
2. Pregnancy visits should appear for pregnant patients after their pregnancy registration
```

This function starts with the standard stuff from the [Configuring Tasks Tutorial]({{< ref "building/tasks/simple-tasks" >}}). We want to confirm the user is a CHW, and the patient is alive and unmuted.

Then, the code searches through each contact's reports to find the most recent (_newest_) pregnancy registration using the [Utils helper library]({{< ref "building/reference/_partial_utils" >}}). It gets that report's value for `report.fields.g_details.estimated_lmp`, which is a date string calculated by the app form. It parses that string using the luxon library and returns true if it is a valid date.

Defining `lmp` as a property of `this`, _stores_ the LMP DateTime and we will use that value later.

### Events
```
3. Pregnancy visits should be scheduled eight times between the last mentrual period (LMP) and delivery.
```

This is a recurring task, unlike the one-time task we wrote in [Configuring Tasks Tutorial]({{< ref "building/tasks/simple-tasks" >}}). This task is going to appear once 12 weeks after the estimated LMP date, again after 20 weeks, and again 6 more times. The `dueDate` on the event says that the task event is due _a variable number of weeks after the estimated LMP_. The time the CHW has to complete the visit is shorter toward the end of the schedule.

We're using the `this.lmp` value which was calculated and saved in the `appliesIf` function.

## ResolvedIf
```
4. A pregnancy visit should be skipped if an _assessment followup_ is completed within the scheduled window for the pregancy visit.
```

`resolvedIf` captures the conditions when the task event should disappear because it has been _completed_. Since we want the task schedule to appear if the user completes an _assessment followup_ or the _pnc followup_, we can't use the [default resolvedIf definition]({{< ref "building/reference/tasks#default-resolvedif-method" >}}). 

This function calculates timestamps for the start and end of each event. Then, it uses the [Utils helper library]({{< ref "building/reference/_partial_utils" >}}) to see if _either_ a _pnc_ or an _assessment_ followup is present within those timestamps.

The concept of _task completion_ is covered in more depth in [Task Completion vs Cancellation]({{< ref "building/guides/tasks/query-task-data#completion-vs-cancellation" >}}).

## Actions
```
5. The first pregnancy visit should prompt the CHW to ask some additional questions
```

The `modifyContent` attribute allows the task to pass data from the task (in JavaScript) into the action app form (xlsx). Check out the guide for [Passing data from a task into the app form]({{< ref "building/guides/tasks/pass-data-to-form" >}}).
