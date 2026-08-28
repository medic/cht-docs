---
title: "Task Interaction Tracking"
linkTitle: "Interaction tracking"
weight: 6
description: >
  Record how users move through their tasks so analysts can study task workflows
relatedContent: >
  building/tasks/tasks-overview
  building/reference/app-settings/user-permissions
---

Task interaction tracking records how users work with the Tasks tab. It captures which tasks they open, how they scroll through their list, and how they complete or cancel their work. This gives program managers and analysts a clear picture of how community health workers move through their daily task queue.

{{< callout >}}
Available from 5.2.0.
{{< /callout >}}

Tracking is off by default and only records activity for users whose role has the right [permission](#enabling-interaction-tracking). It runs quietly in the background and does not change what users see or how the Tasks tab behaves.

## What it captures

Interaction tracking records actions on the Tasks tab, including:

- Opening the task list, scrolling through it, and leaving it
- Opening an individual task
- Submitting, completing, or cancelling a task's form
- Moving between tasks for the same household
- Using filters to narrow the task list

> [!IMPORTANT]
> Interaction tracking records only how a user moves through their tasks. It does not capture the answers a user enters into a form, any clinical information, or any other personally identifiable information about a patient.

## Enabling interaction tracking

To turn on tracking, assign the `can_track_task_interactions` [permission](/building/reference/app-settings/user-permissions) to the user roles you want to study. Users whose roles do not have this permission are unaffected, and nothing is recorded for them.

## What happens to the data

Interaction tracking stores and moves its data the same way as [user telemetry](/technical-overview/data/performance/telemetry). As a user works, their interactions are saved on their device. Each day of activity is combined into a single summary for that user and device, so there is no record of every individual tap. That daily summary is kept in the user's meta database on the device and syncs to the server whenever an internet connection is available, where it joins the summaries from all other users for analysts to review.

Just like telemetry, this means the data leaves the device only as a once-per-day summary, and only when the user is online.

To keep the app responsive and storage manageable, tracking records up to 500 interactions per user each day. Any activity beyond that limit is not recorded.

{{< see-also page="building/reference/app-settings/user-permissions" title="User permissions" >}}
