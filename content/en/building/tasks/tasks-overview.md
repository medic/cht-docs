---
title: "Overview"
linkTitle: "Overview"
identifier: "Tasks overview"
weight: 1
description: >
  Overview of CHT Tasks
aliases:
   - /building/tasks/overview/
   - /building/features/tasks/
   - /apps/features/tasks/
---

Tasks help CHWs plan their day by prompting them to complete follow-up visits and other activities. The list might include upcoming scheduled ANC or Immunization visits, treatment or referral follow-ups, or other required activities such as a household survey.

{{< cards rows="4" >}}
{{< card link="tasks-mobile.png" image="tasks-mobile.png"  method="resize">}}
{{< card link="tasks-desktop.png" image="tasks-desktop.png"  method="resize">}}
{{< /cards >}}


## Main List

{{< cards rows="4" >}}
{{< card link="tasks-mobile.png" image="tasks-mobile.png"  method="resize">}}
{{< /cards >}}

On the Tasks tab is a consolidated list of tasks for all people and families that the user looks after. The task definition determines how long the task will show on this list before and after it is due.

Each task has an icon on the left side which indicates which type of task it is. The first bold line of text is the person or family that the task is about. The second line of text is the title of the task. The due date for the task is located in the upper right-hand corner. If a task is overdue, the due date will be red.

Tasks are listed in order of due date. Tasks that are past due will appear at the top of the list. CHWs should strive to complete tasks before they are overdue. Many programs add targets to track task completion and timeliness.


<br clear="all">

## Task prioritization

{{< callout >}}
Available from 4.21.0.
{{< /callout >}}

Within the community-based health workflow, where volumes are large, Community Health Volunteers (CHVs) are commonly faced with dozens of active tasks. Tasks are sorted by due date by default, which can make it hard to prioritise the most important or urgent action, particularly when tasks have similar due dates or where task urgency is led by clinical factors, rather than scheduling considerations alone.

{{< cards rows="4" >}}
{{< card link="tasks-prioritization.png" image="tasks-prioritization.png"  method="resize">}}
{{< /cards >}}

To assist with task management and decision-making in the field, the CHT supports custom task prioritization logic. Task prioritization seeks to:
- Assist CHVs in prioritizing activities that have the greatest impacts without having to review them manually.
- Factor in signs of clinical or operational urgency, such as danger signs.
- Facilitate predictive and algorithm-based sorting guided by future risk or predicted behavior.
- Enhance filtering to see the most important or urgent tasks only.

### Quick guides 

For more details and guides, see the following sections:

{{< cards >}}
  {{< card link="/building/tasks/tasks-js" title="Priority Property" subtitle="Using a Numerical Score for Task Sorting" icon="terminal" >}}
  {{< card link="/building/tasks/simple-priority-score" title="Sample Priority Score Function" subtitle="Priority Scoring using Weights" icon="terminal" >}}
{{< /cards >}}

<br clear="all">

## Care Guides

When a CHW clicks on a task, the care guide configured for that task displays. CHWs are then guided through questions for that specific workflow.

{{< cards rows="4" >}}
{{< card link="tasks-care1.png" image="tasks-care1.png"  method="resize">}}
{{< card link="tasks-care2.png" image="tasks-care2.png"  method="resize">}}
{{< card link="tasks-care3.png" image="tasks-care3.png"  method="resize">}}
{{< card link="tasks-care4.png" image="tasks-care4.png"  method="resize">}}
{{< /cards >}}

Find more information on how [care guides]({{< relref "building/care-guides" >}}) provide decision support for healthcare workers.

When the user completes the care guide, the task will be cleared from the Tasks tab, and the report will be accessible from the Reports page or on the profile of the person or place whom the report is about.

## Household Tasks

{{< cards rows="4" >}}
{{< card link="tasks-household.png" image="tasks-household.png"  method="resize">}}
{{< /cards >}}

Alternatively, there is an option to configure Household Tasks. When this [permission]({{< relref "building/reference/app-settings/user-permissions" >}}) is enabled, once a CHW has completed a task, they are taken to the Other Household Tasks page. This page shows the CHW all the additional outstanding tasks within the same household in which the initial task was completed.

CHWs are able to complete tasks directly from this page, or exit by tapping on the “X”. If the household has no additional tasks, they will return directly to the main task list.
    
## Profile Page

{{< cards rows="4" >}}
{{< card link="tasks-profile.png" image="tasks-profile.png"  method="resize">}}
{{< /cards >}}

Tasks are also accessed from the People tab in the app.

Tasks for a particular person or place can be viewed on the contact’s profile in the “Tasks” section. Filters allow you to choose how many tasks you’d like to view for each due date.

<br clear="all">
