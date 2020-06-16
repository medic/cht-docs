---
title: Targets
weight: 8
description: >
  Dashboards to track metrics for an individual CHW or for an entire health facility
keyword: targets
relatedContent: >
  apps/reference/targets
  core/overview/db-schema#targets
  apps/features/integrations/dhis2
---
<!-- ## Targets: Performance Dashboards -->

*Targets* is the user dashboard or analytics tab. The widgets on this tab provide a summary or analysis of the data in submitted reports. These widgets can be configured to track metrics for an individual CHW, for a Supervisor overseeing a group of CHWs, or for an entire health facility. 

For CHWs, the **Targets** tab provides a quick summary of their progress towards their individual goals. For Supervisors, Nurses, and facility-based users, the **Targets** tab provides important insights into how their community unit is performing.

{{% alert title="Note" %}} Targets or goals can be configured for any user that has online or offline capabilities. A user must have access to the report in order to generate the widget with its data. {{% /alert %}}

## Types of Widgets

There are two basic types of widgets: count and percent. *Count widgets* display a numeric sum while *percent widgets* display progress towards achieving a target. 

The text, icon, goal, and time frame of each widget is easily configured. The time frame is set per widget, and set to show values for "this month" (resets back to zero at the beginning of each month) or "all time" (a cumulative total).



<br clear="all">

### Count Widgets

{{< figure src="mobile-count.png" link="mobile-count.png" class="right col-6 col-lg-3" >}}

Count widgets show a tally of a particular report that has been submitted or data within a report that matches a set of criteria. For example, a count can be done for the number of active pregnancies, the number of facility-based deliveries, or the number of households registered that month.

A count without a goal displays a simple black number count. A count with a goal displays the value of the goal on the right side and a colored count in the center indicating progress towards achieving the goal. Progress is displayed in green if the count is equal to or above the goal, or in red if the count is below the goal.

### Percent Widgets

{{< figure src="mobile-percent.png" link="mobile-percent.png" class="right col-6 col-lg-3" >}}

Percent widgets display a ratio, which helps to provide insight into the proportion that matches a defined criteria. For example, the proportion of newborns delivered in a facility can be presented as a percent with respect to all registered deliveries.

An optional goal can be set, such as “100% of patients with a fever should be given a malaria Rapid Diagnostic Test (mRDT),” to visualize progress towards achieving a target. Widget styling is configured to show green if the goal has been met and red if the goal has not been met. Next to the percent with a goal, the count of reports used in the calculation are shown (e.g. “16 of 20 with mRDT”). CHWs have found this helpful in interpreting target information.

## Supervisor View

Aggregate targets were introduced in v3.9 to provide Supervisors actionable information about their CHWs, and help with coaching and performance management. Aggregate targets combine the info for each CHW that a Supervisor manages. 

{{< figure src="mobile-supervisor.png" link="mobile-supervisor.png" class="right col-4 col-lg-6" >}}

Clicking on an aggregate widget opens the detailed view with the data for each individual CHW. If a CHW is performing below the target goal, their value will be highlighted in red, making it easier for Supervisors to know with which CHWs to follow up.

{{% alert title="Note" %}} Aggregate targets are based on the widgets seen by CHWs, and dependent on the data that has been synced. If a CHW or the supervisor has not synced, then the aggregate target will not be up to date. {{% /alert %}}
