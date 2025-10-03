---
title: "Building A Simple Priority Score Function"
linkTitle: Simple Priority Score Functions
weight: 3
description: >
  Implementing a simple priority score function
relatedContent: >
  building/tasks
  building/tasks/tasks-js
  building/workflows/workflows-overview
  design/best-practices#anatomy-of-a-task
---

{{< callout >}}
Available from 4.21.0.
{{< /callout >}}

This guide will take you through how to build a basic priority scoring module. The score is based on a task type and individual-person risk factor weights. Tasks with higher priority scores will appear at the top of the task list when `priority.level` is used in your task definitions.

## Overview

You will define:
1. A base weight for each task type, such as visits, referrals and follow-ups, e.g. `first_postpartum_visit`
2. A set of weighted risk scores for individual contacts, such as pregnant under 18.
3. A scoring function that normalises these to return a priority level.
4. An optional label that can be used to indicate high-priority tasks.

## Prerequisites

- You have already defined the relevant task types in `task.js`. If not, review the [Tasks tutorial](/building/tasks/simple-tasks) to learn how to structure tasks.
- Read [Understanding the data available in tasks and targets](/building/tasks/managing-tasks/task-schema-parameters)

## Implementation Steps

{{% steps %}}

### Create a scoring module

We will use this sample code in `nools-extras.js`:
```javascript
const STRING_CONSTANTS = {
  first_postpartum_visit: 'first_postpartum_visit',
  first_postpartum_visit_title: 'task.title.first_postpartum_visit',
  infant_child_visit_action: 'task.action.infant_child_visit',
  infant_child_visit_event_one: 'infant_child_visit_event_one',
  infant_child_visit_event_two: 'infant_child_visit_event_two',
  high_priority_label: 'task.label.high_priority',
  medium_priority_label: 'task.label.medium_priority',
  low_priority_label: 'task.label.low_priority',
  unknown_priority_label: 'task.label.unknown_priority'
};

function isAlive(contact) {
  return contact && contact.contact && !contact.contact.date_of_death;
}

const getField = (report, fieldPath) => ['fields', ...(fieldPath || '').split('.')]
  .reduce((prev, fieldName) => {
    if (prev === undefined) { return undefined; }
    return prev[fieldName];
  }, report);

function isFormArraySubmittedInWindow(reports, formArray, start, end, count) {
  let found = false;
  let reportCount = 0;
  reports.forEach(function (report) {
    if (formArray.includes(report.form)) {
      if (report.reported_date >= start && report.reported_date <= end) {
        found = true;
        if (count) {
          reportCount++;
        }
      }
    }
  });

  if (count) { return reportCount >= count; }
  return found;
}

function getMostRecentReport(reports, form) {
  let result;
  reports.forEach(function (report) {
    if (form.includes(report.form) &&
      !report.deleted &&
      (!result || report.reported_date > result.reported_date)) {
      result = report;
    }
  });
  return result;
}

const getNewestReport = function (reports, forms) {
  let result;
  reports.forEach(function (report) {
    if (!forms.includes(report.form)) { return; }
    if (!result || report.reported_date > result.reported_date) {
      result = report;
    }
  });
  return result;
};

function completedCheckup(contact, forms, field, visit) {
  const latestVisit = getNewestReport(contact.reports, forms);
  if (!latestVisit) return false;
  return getField(latestVisit, field) === visit;
}

module.exports = {
  STRING_CONSTANTS,
  isAlive,
  isFormArraySubmittedInWindow,
  getMostRecentReport,
  getField,
  completedCheckup
};
```

Create a `priority-score.js` file, preferrably in the same location as `tasks.js` and add the following code:

```javascript
const { completedCheckup, STRING_CONSTANTS } = require('./nools-extras');

// task type base weights
const taskWeights = {
  first_postpartum_visit: 5,
};

// individual risk factor weights
const riskFactors = {
  low_birth_weight: 3,
  known_birth_or_delivery_complications: 2,
  missed_24_hours_checkup: 3,
  missed_3_days_checkup: 2,
  missed_7_14_days_checkup: 1
};

// priority thresholds
const PRIORITY_THRESHOLDS = {
  HIGH: 8,
  MEDIUM: 6,
  LOW: 0,
};

// priority labels
const priorityLabels = [
  { min: PRIORITY_THRESHOLDS.HIGH, label: STRING_CONSTANTS.high_priority_label },
  { min: PRIORITY_THRESHOLDS.MEDIUM, label: STRING_CONSTANTS.medium_priority_label },
  { min: PRIORITY_THRESHOLDS.LOW, label: STRING_CONSTANTS.low_priority_label }
];

// adjust accordingly to suit your use case
const MAX_SCORE = 16;
const LOW_WEIGHT_THRESHOLD = 2.5;

// map to check events-related risk factors
const eventCheckupMap = {
  infant_child_visit_event_one: {
    visit: '24_hours',
    weight: riskFactors.missed_24_hours_checkup
  },
  infant_child_visit_event_two: {
    visit: '3_days',
    weight: riskFactors.missed_3_days_checkup
  }
};

// define your score calculation logic
function getPriorityScore(taskName, contact, report, event) {
  let score = taskWeights[taskName] || 0;

  const checkupInfo = eventCheckupMap[event.id];
  if (checkupInfo && !completedCheckup(contact, ['infant_child'], 'checkup_type', checkupInfo.visit)) {
    score += checkupInfo.weight;
  }

  const conditions = [
    {
      condition: () => report?.fields?.baby_weight_kg < LOW_WEIGHT_THRESHOLD,
      weight: riskFactors.low_birth_weight
    },
    {
      condition: () => report?.fields?.birth_complications === 'yes',
      weight: riskFactors.known_birth_or_delivery_complications
    }
  ];

  for (const { condition, weight } of conditions) {
    if (condition()) {score += weight;}
  }

  const normalizedScore = parseFloat(((score / MAX_SCORE) * 10).toFixed(2)); // normalized to a 0–10 scale

  const label = (priorityLabels.find(p => normalizedScore >= p.min) || {}).label || STRING_CONSTANTS.unknown_priority_label;

  return {
    level: normalizedScore,
    label
  };
}

module.exports = {
  getPriorityScore,
  STRING_CONSTANTS,
  PRIORITY_THRESHOLDS
};
```

### Use the priority score function in your task definition

Use the `priority.level` attribute to return the corresponding score. In this example, the priority function also receives the event, to show that two events can have different priorities.

```javascript
const { STRING_CONSTANTS, isAlive, isFormArraySubmittedInWindow} = require('./nools-extras');
const { getPriorityScore } = require('./priority-score');

module.exports = [{
  name: STRING_CONSTANTS.first_postpartum_visit,
  title: STRING_CONSTANTS.first_postpartum_visit_title,
  appliesTo: 'contacts',
  appliesToType: ['person'],
  appliesIf: function (contact) {
    return isAlive(contact) && contact.contact.date_of_birth;
  },
  priority: (contact, report, event) => getPriorityScore(STRING_CONSTANTS.first_postpartum_visit, contact, report, event),
  resolvedIf: function (contact, report, event, dueDate) {
    return isFormArraySubmittedInWindow(contact.reports, ['infant_child'], 
      Utils.addDate(dueDate, -event.start).getTime(),
      Utils.addDate(dueDate,  event.end+1).getTime());
  },
  actions: [
    {
      type: 'report',
      form: 'infant_child',
      label: STRING_CONSTANTS.infant_child_visit_action,
      modifyContent: (content, contact) => {
        content.patient_id = contact.contact.uuid;
      }
    }
  ],
  events: [
    {
      id: STRING_CONSTANTS.infant_child_visit_event_one,
      start: 0,
      end: 0,
      dueDate: function (event, contact) {
        return Utils.addDate(new Date(contact.contact.date_of_birth), 3);
      }
    },
    {
      id: STRING_CONSTANTS.infant_child_visit_event_two,
      start: 0,
      end: 7,
      dueDate: function (event, contact) {
        return Utils.addDate(new Date(contact.contact.date_of_birth), 7);
      }
    }
  ]
}];
```

### Test and iterate
- Compile and deploy your application.
- Inspect the task list to ensure that tasks having higher weights and risk score appear at the top.
- Adjust your weights and thresholds accordingly, to suit your use cases.

Below is an accompanying `priority-score.spec.js` to test sample above.
```javascript
const { expect } = require('chai');
const { getPriorityScore, STRING_CONSTANTS, PRIORITY_THRESHOLDS } = require('../../priority-score');

describe('Priority Score relates tests', () => {
  const contactTemplate = { name: 'Test Infant', date_of_birth: Date.now() - 3 * 24 * 60 * 60 * 1000 };

  const reportWithRisk = {
    _id: 'r1',
    reported_date: Date.now(),
    form: 'infant_child',
    fields: {
      baby_weight_kg: 2.0,
      birth_complications: 'yes',
      checkup_type: 'none'
    }
  };

  const reportWith3DayVisit = {
    _id: 'r2',
    reported_date: Date.now(),
    form: 'infant_child',
    fields: {
      baby_weight_kg: 2.0,
      birth_complications: 'yes',
      checkup_type: '3_days'
    }
  };

  const reportWithoutRisk = {
    _id: 'r3',
    reported_date: Date.now(),
    form: 'infant_child',
    fields: {
      baby_weight_kg: 3.5,
      birth_complications: 'no',
      checkup_type: '24_hours'
    }
  };
  const visit3Days = { id: STRING_CONSTANTS.infant_child_visit_event_one };
  const visit14Days = { id: STRING_CONSTANTS.infant_child_visit_event_two };

  it('should assign high priority when no 24-hour checkup and high-risk birth in 3-day checkup', () => {
    const contact = {
      ...contactTemplate,
      reports: [reportWithRisk]
    };
    const score = getPriorityScore(STRING_CONSTANTS.first_postpartum_visit, contact, reportWithRisk, visit3Days);
    expect(score.level).to.be.greaterThan(PRIORITY_THRESHOLDS.HIGH);
    expect(score.label).to.equal(STRING_CONSTANTS.high_priority_label);
  });

  it('should assign medium priority in 7-14 days check up with 3-day checkup completed', () => {
    const contact = {
      ...contactTemplate,
      reports: [reportWith3DayVisit]
    };
    const score = getPriorityScore(STRING_CONSTANTS.first_postpartum_visit, contact, reportWith3DayVisit, visit14Days);
    expect(score.level).to.be.greaterThan(PRIORITY_THRESHOLDS.MEDIUM);
    expect(score.level).to.be.lessThan(PRIORITY_THRESHOLDS.HIGH);
    expect(score.label).to.equal(STRING_CONSTANTS.medium_priority_label);
  });

  it('should assign low priority when 24-hour checkup was completed and no risks', () => {
    const contact = {
      ...contactTemplate,
      reports: [reportWithoutRisk]
    };
    const score = getPriorityScore(STRING_CONSTANTS.first_postpartum_visit, contact, reportWithoutRisk, visit3Days);
    expect(score.level).to.be.at.lessThan(PRIORITY_THRESHOLDS.MEDIUM);
    expect(score.label).to.equal(STRING_CONSTANTS.low_priority_label);
  });

  it('should assign low priority for unknown event', () => {
    const contact = {
      ...contactTemplate,
      reports: [reportWithoutRisk]
    };
    const event = { id: 'some_other_event' };
    const score = getPriorityScore(STRING_CONSTANTS.first_postpartum_visit, contact, reportWithoutRisk, event);
    expect(score.label).to.equal(STRING_CONSTANTS.low_priority_label);
  });
});
```

{{% /steps %}}
