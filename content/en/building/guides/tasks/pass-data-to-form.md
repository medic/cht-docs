---
title: "Passing data from a task into the app form"
linkTitle: Passing Data from Tasks to Forms
description: >
  Demonstrates how to pass data into an application form via tasks
relatedContent: >
  building/tutorials/tasks-2
  building/tutorials/app-forms
  building/reference/tasks
  building/guides/forms/form-inputs
  
---

{{% pageinfo %}}
This guide explains how to pass data from a task into the action _application form_. 
{{% /pageinfo %}}

## Prerequisites

* [Complex Tasks Tutorial]({{< ref "building/tutorials/tasks-2" >}})
* [Application Forms Tutorial]({{< ref "building/tutorials/app-forms" >}})

## Scenario

Let's look deeper at the scenario from the [Complex Tasks Tutorial]({{< ref "building/tutorials/tasks-2" >}}) where we have an ANC follow-up task which recurs eight times, and we want to ask the user different questions on the first and last follow-up.

## Developing the task
From the [Complex Tasks Tutorial]({{< ref "building/tutorials/tasks-2" >}}), here is the task.

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

## modifyContent
Let's take a look at the `actions` section and specifically the [modifyContent]({{< ref "building/reference/tasks" >}}) attribute. This `modifyContent` attribute allows the task to pass data from the task (in JavaScript) into the action app form (xlsx). The `content` object is the object which binds to the `inputs` section in the app form. You can pass data into the app form by assigning values onto this object. 

This function calculates `t_followup_count` to be the index of the event which is being completed. So the first task event (which appears after 12 weeks) is followup `1`, and the task event after 34 weeks is followup `5`. 

## The action form
In this sample app form `survey`, the value of `t_followup_count` is listed in the inputs section and the CHT _binds_ the data passed by the task onto this hidden variable. An example calculation `is_first_followup` demonstrates how to use the value in the form's logic. `is_first_followup` will be true 12 weeks after the LMP date, and false on all other followups.

| type        | name               | label                       | required | relevant          | appearance | constraint | constraint_message  | calculation                                |
| ----------- | ------------------ | --------------------------- | -------- | ----------------- | ---------- | ---------- | ------------------- | ------------------------------------------ |
| begin group | inputs             |                             |          |                   | field-list |            |                     |                                            |
| hidden      | t_followup_count   | Data from task              |          |                   |            |            |                     |                                            |
| end group   |                    |                             |          |                   |            |            |                     |                                            |
| calculate   | is_first_followup  |                             |          |                   |            |            |                     | if(${t_follow_up_count}='1',true,false)   |
