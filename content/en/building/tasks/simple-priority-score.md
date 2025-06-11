---
title: "Building A Simple Priority Score Function"
linkTitle: Simple Priority Score Functions
weight: 2
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

- You have already defined the relevant task types in `task.js`. If not, review the [Tasks tutorial]({{< ref "building/tasks/simple-tasks" >}}) to learn how to structure tasks.
- Read [Understanding the data available in tasks and targets]({{< ref "building/tasks/managing-tasks/task-schema-parameters" >}})

## Implementation Steps

### 1. Create a scoring module

Create a `priority-score.js` file, preferrably in the same location as `tasks.js` and add the following code:

```javascript
const extras = require('./nools-extras');

// task type base weights
const taskWeights = {
  first_postpartum_visit: 9,
  // Add more task type weights as appropriate
};

// individual risk factor weights
const riskFactors = {
  pregnant_under_18: 2,
  // Add more risk factor weights as appropriate
};

const priorityLabels = [
  { min: 8, label: 'task.label.high_priority' },
  // add more
];

function calculateIndividualRiskFactor(contact) {
  let score = 0;

  const conditions = [
    { condition: () => extras.isCurrentlyPregnant(contact) && extras.getPregnantWomanAge(contact) < 18, weight: riskFactors.pregnant_under_18 },
  ...
  ];
  // Add more score logic as appropriate
    
  conditions.forEach(item => {
    if (item.condition()) {
      score += item.weight;
    }
  });
  return score;
}

function getPriorityScore(taskName, contact) {
  let score = (taskWeights[taskName] || 0) + calculateIndividualRiskFactor(contact);

  const MAX_SCORE = 13; // adjust accordingly to suit your use case
  score = parseFloat(((score / MAX_SCORE) * 10).toFixed(2)); // normalized to a 0–10 scale

  const priorityLabel = priorityLabels.find(p => score >= p.min);
  return { level: score, label: priorityLabel.label };
}

module.exports = {
  getPriorityScore
};
```

### 2. Use the priority score function in your task definition

Use the `priority.level` attribute to return the corresponding score.

```javascript
const { getPriorityScore } = require('./priority-score');

module.exports = {
  name: 'first_postpartum_visit',
  ...
  priority: {
    level: (report, contact) => getPriorityScore('first_postpartum_visit', contact)
  }
};
```

### 3. Test and iterate

- Compile and deploy your application.
- Inspect the task list to ensure that tasks having higher weights and risk score appear at the top.
- Adjust your weights and thresholds accordingly, to suit your use cases.

