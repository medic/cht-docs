---
title: "Tasks.js"
linkTitle: "Tasks.js"
weight: 5
description: >
  **Tasks**: Definition of tasks shown to app users
relatedContent: >
  building/tasks
  building/workflows
  design/best-practices
keywords: tasks workflows
---

![task](task-with-description.png)

Task generation is configured in the `tasks.js` file. This file is a JavaScript module which defines an array of objects conforming to the Task schema detailed below. When defining tasks, all the data about contacts on the device (both people and places) along with all their reports are available. Tasks are available only for users of type "restricted to their place". Tasks can pull in fields from reports and pass data as inputs to the form that opens when the task is selected, enabling richer user experiences.

Task generation occurs on the client periodically and creates documents which track the status of the task over time. To avoid performance issues the developer needs to be conscious about generating too many tasks. For example, to remind a user to do something every day, you could generate one task for each day and fill up the user's device. The recommended approach is to only generate the tasks for the near future, or only once the previous task is resolved. To limit the impact of this misconfiguration, the CHT will only generate tasks that can be completed between 60 days in the past, and (as of 4.0.0) 180 days in the future.

{{< see-also page="building/tasks" title="Tasks Overview" >}}

## `tasks.js`

| property | type | description | required |
|---|---|---|---|
| `name`| `string` | A unique identifier for the task. Used for querying task completeness. | yes, unique |
| `icon` | `string` | The icon to show alongside the task. Should correspond with a value defined in `resources.json`. | no |
| `title` | `translation key` | The title of the task (labeled above). | yes |
| `appliesTo` | `'contacts'` or `'reports'` | Do you want to emit one task per report, or one task per contact? See [Understanding the Parameters in the Task Schema]({{< ref "building/tasks/task-schema-parameters.md" >}}). | yes |
| `appliesIf` | `function(contact, report)` | If `appliesTo: 'contacts'`, this function is invoked once per contact and `report` is undefined. If `appliesTo: 'reports'`, this function is invoked once per report. Return true if the task should appear for the given documents. See [Understanding the Parameters in the Task Schema]({{< ref "building/tasks/task-schema-parameters.md" >}}). | no |
| `appliesToType` | `string[]` | Filters the contacts or reports for which `appliesIf` will be evaluated. If `appliesTo: 'reports'`, this is an array of form codes. If `appliesTo: 'contacts'`, this is an array of contact types. For example, `['person']` or `['clinic', 'health_center']`. For example, `['pregnancy']` or `['P', 'pregnancy']`. See [Understanding the Parameters in the Task Schema]({{< ref "building/tasks/task-schema-parameters.md" >}}). | no |
| `contactLabel` | `string` or `function(contact, report)` | Controls the label describing the subject of the task. Defaults to the name of the contact (`contact.contact.name`). | no |
| `resolvedIf` | `function(contact, report, event, dueDate)` | Return true to mark the task as "resolved". A resolved task uses memory on the phone, but is not displayed. | no, if any `actions[n].type` is `'report'` |
| `events` | `object[]` | An event is used to specify the timing of the task. | yes |
| `events[n].id` | `string` | A descriptive identifier. Used for querying task completeness. | yes if task has multiple events, unique |
| `events[n].days` | `integer` | Number of days after the doc's `reported_date` that the event is due | yes, if `dueDate` is not set |
| `events[n].dueDate` | `function(event, contact, report)` | Returns a `Date` object for the day when this event is due. | yes, if `days` is not set |
| `events[n].start` | `integer` | Number of days to show the task before it is due. | yes |
| `events[n].end` | `integer` | Number of days to show the task after it is due. | yes |
| `actions` | `object[]` | The actions (forms) that a user can access after clicking on a task. If you put multiple forms here, the user will see a task summary screen where they can select which action they would like to complete. | yes |
| `actions[n].type` | `'report'` or `'contact'` | When `'report'`, the action opens the given form. When `'contact'`, the action redirects to a contact's profile page. Defaults to 'report'. | no |
| `actions[n].form` | `string` | The code of the form that should open when you select the action. | yes, if `actions[n].type` is `'report'` |
| `actions[n].label`| `translation key` | The label that should appear on the task summary screen if multiple actions are present. | no |
| `actions[n].modifyContent`| `function (content, contact, report, event)` | Set the values on the content object to control the data which will be passed as `inputs` to the form which opens when the action is selected. See [Passing data from a task into the app form]({{< ref "building/tasks/pass-data-to-form" >}}). | no |
| `priority` | `object` or `function(contact, report)` returning object of same schema | Controls the "high risk" line seen above. | no |
| `priority.level` | `high` or `medium` | Tasks that are `high` will display a high risk icon with the task. Default: `medium`. | no |
| `priority.label` | `translation key` | Text shown with the task associated to the risk level. | no | 

## Utils
{{< read-content file="apps/reference/_partial_utils.md" >}}

## CHT API
{{< read-content file="apps/reference/_partial_cht_api.md" >}}

## Code samples

### Basic task

This sample `tasks.js` generates two postnatal-visit tasks for each delivery form. The tasks are due 7 and 14 days after the delivery report was submitted. Each task is displayed for 2 days before the due date and 2 days after the due date.

#### tasks.js
```js
module.exports = [
  {
    icon: 'mother-child',
    title: 'task.postnatal_followup',
    appliesTo: 'reports',
    appliesToType: [ 'delivery' ],
    actions: [ { form: 'postnatal_visit' } ],
    events: [
      {
        id: 'postnatal-followup-1',
        days:7,
        start:2,
        end:2,
      },
      {
        id: 'postnatal-followup-2',
        days:14, 
        start:2,
        end:2,
      }
    ],
    resolvedIf: function (contact, report, event, dueDate) {
      return Utils.isFormSubmittedInWindow(
        contact.reports,
        'delivery',
        Utils.addDate(dueDate, -event.start).getTime(),
        Utils.addDate(dueDate, event.end + 1).getTime()
      );
    }
  }
];
```

### Tasks with functions

These samples show more complex tasks which use functions kept in a separate `nools-extras.js` file

#### `tasks.js`
```js
const extras = require('./nools-extras');
const { isFormFromArraySubmittedInWindow } = extras;

module.exports = [
  // PNC TASK 1: If a home delivery, needs clinic tasks
  {
    icon: 'mother-child',
    title: 'task.postnatal_followup.title',
    appliesTo: 'reports',
    appliesToType: [ 'D', 'delivery' ],
    appliesIf: function(c, r) {
      return isCoveredByUseCase(c.contact, 'pnc') &&
          r.fields &&
             r.fields.delivery_code &&
             r.fields.delivery_code.toUpperCase() !== 'F';
    },
    actions: [{ 
      form:'postnatal_visit',
      // Pass content that will be used within the task form
      modifyContent: function(content, c, r, event) {
        content.delivery_place = 'home';
        content.event_id = event.id;
      }
    }],
    events: [ {
      id: 'postnatal-visit',
      days:0, start:0, end:4,
    } ],
    priority: {
      level: 'high',
      label: [ { locale:'en', content:'Home Birth' } ],
    },
    resolvedIf: function(c, r, event, dueDate) {
      // Resolved if there a visit report received in time window or a newer pregnancy
      return r.reported_date < extras.getNewestDeliveryTimestamp(c) ||
             r.reported_date < extras.getNewestPregnancyTimestamp(c) ||
             isFormFromArraySubmittedInWindow(c.reports, extras.postnatalForms,
                 Utils.addDate(dueDate, -event.start).getTime(),
                 Utils.addDate(dueDate,  event.end+1).getTime());
    },
  },

  // Option 1a: Place-based task: Family survey when place is created, then every 6 months
  {
    icon: 'family',
    title: 'task.family_survey.title',
    appliesTo: 'contacts',
    appliesToType: [ 'clinic' ],
    actions: [ { form:'family_survey' } ],
    events: [ {
      id: 'family-survey',
      days:0, start:0, end:14,
    } ],
    resolvedIf: function(c, r, event, dueDate) {
      // Resolved if there a family survey received in time window
      return isFormFromArraySubmittedInWindow(c.reports, 'family_survey',
                 Utils.addDate(dueDate, -event.start).getTime(),
                 Utils.addDate(dueDate,  event.end+1).getTime());
    },
  },

  // Regular check for infants
  {
    icon: 'infant',
    title: 'task.infant.title',
    appliesTo: 'contacts',
    appliesToType: [ 'person' ],
    actions: [ { form:'infant_assessment' } ],
    events: [ 
      {
        id: 'infant_asssessment-q1',
        days:91, start:7, end:14,
      },
      {
        id: 'infant_asssessment-q2',
        days:182, start:7, end:14,
      },
      {
        id: 'infant_asssessment-q3',
        days:273, start:7, end:14,
      },
      {
        id: 'infant_asssessment-q4',
        days:365, start:7, end:14,
      }
    ]
  },

  // Option 2: Place-based task: Family survey every 6 months
  {
    icon: 'family',
    title: 'task.family_survey.title',
    appliesTo: 'contacts',
    appliesToType: [ 'clinic' ],
    appliesIf: extras.needsFamilySurvey, // function returns true if family doesn't have survey in previous 6 months
    actions: [ { form:'family_survey' } ],
    events: [ {
      id: 'family-survey',
      start:0, end:14,
      dueDate: extras.getNextFamilySurveyDate  // function gets expected date of next family survey 
    } ],
    resolvedIf: function(c, r, event, dueDate) {
      // Resolved if there a family survey received in time window
      return isFormFromArraySubmittedInWindow(c.reports, 'family_survey',
                 Utils.addDate(dueDate, -event.start).getTime(),
                 Utils.addDate(dueDate,  event.end+1).getTime());
    },
  },

]
```

#### `nools-extras.js`
```js
module.exports = {
  isCoveredByUseCase: function (contact, usecase) {
      // ...
  },
  getNewestDeliveryTimestamp: function (c) {
      // ...
  },
  getNewestPregnancyTimestamp: function (c) {
      // ...
  },
  isFormFromArraySubmittedInWindow: function (reports, formsArray, startTime, endTime) {
      // ...
  },
};
```

### Default resolvedIf method
If the `resolvedIf` is undefined in an action of type `report`, then `resolvedIf` is going to default to `defaultResolvedIf` method.

The `defaultResolvedIf` method returns `true` if it finds any report assigned to the contact that matches the `form` defined in the action of type `report`. Only the reports submitted during a specific time period are considered:
- For a contact-based task, the period is the same as the task window period i.e. when the task is visible.
- For a report based task, the period is determined between `start` and `end` as:
  - `start`: the latest date between start of the task window and one millisecond after the report's reported date
  - `end`: end of the task window

You can also use `this.definition.defaultResolvedIf` inside the `resolvedIf` definition and optionally add more conditions:

```js
resolvedIf: function (contact, report, event, dueDate) {
  return this.definition.defaultResolvedIf(contact, report, event, dueDate) && otherConditions;
}
```

## Build

To build your tasks into your app, you must compile them into app-settings, then upload them to your instance.

`cht --local compile-app-settings backup-app-settings upload-app-settings`
