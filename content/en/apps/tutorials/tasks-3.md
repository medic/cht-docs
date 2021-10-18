---
title: "Configuring Tasks - Part 3 - A complex task"
linkTitle: Tasks 3
weight: 9
description: >
  Configuring a more complex task
relatedContent: >
  apps/tutorials/tasks-1
  apps/tutorials/tasks-2
  apps/reference/tasks
  apps/reference/_partial_utils
  apps/examples/anc

---

Tasks prompt users to complete activities on a programmatic schedule. This _Configuring Tasks_ tutorial series is a practical guide to the creation and management of tasks.

{{% pageinfo %}}
This tutorial will guide you through the development of an advanced task.

- Create a task with a complex follow-up schedule
- Use a 3rd party JavaScript library `luxon` to make Date/Time calculations easier
- Pass information from the task into the action _app form_
- Custom logic for resolving a task
{{% /pageinfo %}}

## Prerequisites

* [Configuring Tasks - Part 1 - A Simple Task]({{< ref "apps/tutorials/tasks-1" >}})
* [Configuring Tasks - Part 2 - appliesTo and appliesIf]({{< ref "apps/tutorials/tasks-2" >}})
* [Maternal and Newborn Health Reference App]({{< ref "apps/examples/anc" >}})

## Scenario

This scenario is loosely based on the _Pregnancy Visit Task_ from the [Maternal and Newborn Health Reference App]({{< ref "apps/examples/anc" >}}). 

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

This function starts with the standard stuff from [Configuring Tasks - Part 2]({{< ref "apps/tutorials/tasks-2" >}}). We want to confirm the user is a CHW, and the patient is alive and unmuted.

Then, the code searches through each contact's reports to find the most recent (_newest_) pregnancy registration using the [Utils helper library]({{< ref "apps/reference/_partial_utils" >}}). It gets that report's value for `report.fields.g_details.estimated_lmp`, which is a date string calculated by the app form. It parses that string using the luxon library and returns true if it is a valid date.

Defining `lmp` as a property of `this`, _stores_ the LMP DateTime and we will use that value later.

### Events
```
3. Pregnancy visits should be scheduled eight times between the last mentrual period (LMP) and delivery.
```

This is a recurring task, unlike the one-time task we wrote in [Configuring Tasks - Part 1]({{< ref "apps/tutorials/tasks-1" >}}). This task is going to appear once 12 weeks after the estimated LMP date, again after 20 weeks, and again 6 more times. The `dueDate` on the event says that the task event is due _a variable number of weeks after the estimated LMP_. The time the CHW has to complete the visit is shorter toward the end of the schedule.

We're using the `this.lmp` value which was calculated and saved in the `appliesIf` function.

## ResolvedIf
```
4. A pregnancy visit should be skipped if an _assessment followup_ is completed within the scheduled window for the pregancy visit.
```

`resolvedIf` captures the conditions when the task event should disappear because it has been _completed_. Since we want the task schedule to appear if the user completes an _assessment followup_ or the _pnc followup_, we can't use the [default resolvedIf definition]({{< ref "apps/reference/tasks#default-resolvedif-method" >}}). 

This function calculates timestamps for the start and end of each event. Then, it uses the [Utils helper library]({{< ref "apps/reference/_partial_utils" >}}) to see if _either_ a _pnc_ or an _assessment_ followup is present within those timestamps.

We will be looking at `resolvedIf` and the concept of _task completion_ in more depth in [Configuring Tasks - Part 4]({{ < ref "apps/tutorials/tasks-4" >}}).

## Actions
```
5. The first pregnancy visit should prompt the CHW to ask some additional questions
```

The `modifyContent` attribute allows the task to pass data from the task (in JavaScript) into the action app form (xlsx). The `content` object is the object which binds to the `inputs` section in the app form. You can pass data into the app form by assigning values onto this object. 

This function calculates `t_followup_count` to be the index of the event which is being completed. So the first task event (which appears after 12 weeks) is followup `1`, and the task event after 34 weeks is followup `5`. 

### The associated app form
In this sample app form `survey`, the value of `t_followup_count` is bound in the inputs section and the CHT binds the data passed by the task. An example calculation `is_first_followup` demonstrates how to use the value in the form's logic.

| type        | name               | label                       | required | relevant          | appearance | constraint | constraint_message  | calculation                                |
| ----------- | ------------------ | --------------------------- | -------- | ----------------- | ---------- | ---------- | ------------------- | ------------------------------------------ |
| begin group | inputs             |                             |          |                   | field-list |            |                     |                                            |
| hidden      | t_followup_count   | Data from task              |          |                   |            |            |                     |                                            |
| end group   |                    |                             |          |                   |            |            |                     |                                            |
| calculate   | is_first_followup  |                             |          |                   |            |            |                     | if(${t_follow_up_count}='1',true,false)   |

## Next Steps
In [Part 4]({{< ref "apps/tutorials/tasks-4" >}}), we will look at the analytic capabilities of the tasks system.
