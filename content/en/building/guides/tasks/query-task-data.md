---
title: "Querying Task Documents"
linkTitle: Querying Task Documents 
description: >
  Querying the data which results from an example task. Notes on the performance implications of tasks.
relatedContent: >
  building/tutorials/tasks-1
  core/overview/db-schema#tasks
  core/overview/data-flows-for-analytics
aliases:
   - /apps/guides/tasks/query-task-data
----

{{% pageinfo %}}
This guide explains the data which results from tasks and how to query it.

- Write a PostgreSQL query to examine task data
- Build deeper understanding of task data
- Present some data considerations of which task authors should remain mindful
{{% /pageinfo %}}

## Prerequisites

* [Data Flows for Analytics]({{< ref "core/overview/data-flows-for-analytics" >}})

## Querying task data
The task system running on each user's device is powered by [task documents]({{< ref "core/overview/db-schema#tasks" >}}) and those task documents sync to the server and to PostgreSQL just like a contact or a report. Having task documents in PostgreSQL allows system administrators to analyse how users are interacting with tasks.

{{< see-also page="core/overview/data-flows-for-analytics" title="Data flows for analytics" >}}

### First Assessment Completion Rate
Working with the _First Assessment_ task from the [Configuring Tasks Tutorial]({{< ref "building/tutorials/tasks-1" >}}), let's try to answer the question **What percentage of the scheduled _first assessment_ events have been completed?**. 

Let's query data from the last three months to see how the _first assessment_ task is behaving in production:

```sql (thanks to couch2pg)
SELECT
 date_trunc('month', duedate) AS due_date_month,
 task_state,
 count(*)
FROM useview_task
WHERE
  title = 'assessment-after-registration' and
  duedate >= date_trunc('month', now()) - '3 months'::interval and
  duedate < date_trunc('month', now()) + '1 months'::interval
GROUP BY 1, 2
ORDER BY 1, 2
;
```

For convenience, here is the task definition from the _First Assessment_ task in the tutorial:

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
* `useview_task` - This is a materialized view created automatically by the medic-couch2pg service. It is an intuitive view of the data from the [task document schema]({{< ref "core/overview/db-schema#tasks" >}}).
* `task_state` - The meaning of each task state is explained in the [task document schema]({{< ref "core/overview/db-schema#tasks" >}}).
* `WHERE title` - The _name_ attribute in the [task.js schema]({{< ref "building/reference/tasks#tasksjs" >}}) is used exclusively in the task's backend data. Here we limit the query to task documents resulting from our named task. The `title` in postgres maps to the `name` in JavaScript not the `title` in JavaScript - which is confusing.
* `WHERE duedate` - One task document is created per event and this task has one event per contact which is due 7 days after the contact's creation date. Here we limit the query to task documents which are _due in the last 3 calendar months_.

## Understanding the data
Here is a sample output from that query above. The query was executed some day in July (07), 2021.

due_date_month | task_state | count
-- | -- | --
2021-05-01 | Cancelled | 6
2021-05-01 | Completed | 749
2021-05-01 | Failed | 226
2021-06-01 | Cancelled | 3
2021-06-01 | Completed | 769
2021-06-01 | Draft | 3
2021-06-01 | Failed | 177
2021-07-01 | Completed | 1135
2021-07-01 | Draft | 399
2021-07-01 | Failed | 193
2021-07-01 | Ready | 13

Task docs from May and June are mostly in states `Completed` or `Failed`. In May, you could say with high confidence that the _completion rate_ for this task was 749/(749+226) or 76%. Task docs in July have end dates in the future still, so they are in state `Draft` or `Ready`.

**Why are tasks Cancelled?** - A task document is cancelled when `tasks.js` schedules the task event (`appliesToType` and `appliesIf` both pass), and later does not schedule the task event. So in this _first assessment_ scenario, a likely cause of task cancellation would be that a contact was deleted, muted, or dead. The task document is created when `appliesIf` returns true. When the contact is muted, the task disappears from the UI, and the task document is moved to state _Cancelled_.

**How can there be documents in state "Draft" in June?** - The state _Draft_ means that the task event is _scheduled in the future_. How can these documents with due dates in the past (June) be in a state which says they are in the future? **Task documents are calculated and updated on the _user's device_**, so the most likely explanation is that the user hasn't synced. [Other potential explanations are possible](https://forum.communityhealthtoolkit.org/t/task-state-for-tasks-whose-enddate-is-in-the-past/1011).

## Task data considerations
### Performance
Performance of CHT Applications is a major factor for many users and partners. The CHT Core is designed and tested to work on low-cost devices, but tasks have the potential to cause performance problems by creating too many task documents or performing excessive computations. Be mindful of the task documents which will be created by your tasks. Monitor the number of task documents being created in production. 

### Completion vs Cancellation
A task can "disappear" because `appliesIf` returns false or because `resolvedIf` returns true. To the user the experience is identical - but the difference is in the data. 

`resolvedIf` should contain only your programmatic _task success criteria_. Everything else should be in `appliesIf`.

Resultant State | appliesIf | resolvedIf
-- | -- | --
Draft/Ready/Failed | true | false
Completed | true | true
Cancelled | false | -

### Testing task document data
The [medic-conf-test-harness](http://docs.communityhealthtoolkit.org/cht-conf-test-harness/) is useful for making assertions about the expected behaviour of tasks in different user scenarios. The [countTaskDocsByState](https://docs.communityhealthtoolkit.org/cht-conf-test-harness/Harness.html#countTaskDocsByState) interface is relevant for making assertions about task document creation and state.

## Frequently Asked Questions

* [Are task documents indefinitely on user's devices?](https://forum.communityhealthtoolkit.org/t/are-task-documents-indefinitely-on-users-devices/1432)
* ["State" for tasks whose endDate is in the past](https://forum.communityhealthtoolkit.org/t/task-state-for-tasks-whose-enddate-is-in-the-past/1011)