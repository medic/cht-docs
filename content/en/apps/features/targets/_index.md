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

Targets is a user dashboard or analytics tab. The tab includes  widgets that provide a summary or analysis of the data in reports that have been submitted. Widgets can be configured to track metrics for an individual CHW, for a Supervisor overseeing a group of CHWs, or for an entire health facility. 

For CHWs, the Targets tab can provide a quick summary of their progress towards their goals. For Supervisors, Nurses, and facility-based users, widgets might display important insights into how their community unit is performing.

{{% alert title="Note" %}} Targets can be configured for any user that has online or offline capabilities. A user must have access to the report in order to generate the widget with its data. {{% /alert %}}

## Types of Widgets

There are two basic types of widgets: count and percent. Count widgets display a number while percent widgets display progress towards achieving a target. 

The data for both widgets is calculated as either “this month” (resets back to zero at the beginning of each month) or “all time” (a cumulative total). The data time frame is selected per widget so there can be a mix of ranges displayed on the Targets page.

Additionally, each widget can have a goal. If a goal is set, the widgets have conditional color styling to show whether a goal is unmet (red) or met (green) based on configured rules. There can be a mix of widget types on a Target page that are displayed with or without goals.

Each element of a widget is configurable, including: text, icon, presence of a goal, value of a goal, and time frame.

<br clear="all">

### Count Widgets

{{< figure src="mobile-count.png" link="mobile-count.png" class="right col-6 col-lg-3" >}}

Count widgets show a tally of a particular report that has been submitted or data within a report that matches a set of criteria. For example, a count can be done for the number of active pregnancies, the number of facility-based deliveries, or the number of households registered that month.

A count without a goal displays a simple black number count. A count with a goal displays the value of the goal on the right side and a colored count in the center indicating progress towards achieving the goal. Progress is displayed in green if the count is equal to or above the goal, or in red if the count is below the goal.

### Percent Widgets

{{< figure src="mobile-percent.png" link="mobile-percent.png" class="right col-6 col-lg-3" >}}

Percent widgets display a ratio of the number complete versus the total number possible for a given target. They provide insight into how much data of a particular report matches a specific criteria against data that does not match that same criteria. This is calculated based on a true / false statement. For example, newborns should be delivered in a facility (“true”) can be displayed next to newborns that were not delivered in a facility (“false”).

An optional goal can be set, such as “100% of patients with a fever should be given a malaria Rapid Diagnostic Test (mRDT),” to visualize progress towards achieving a target. Widget styling is configured to show green if the goal has been met and red if the goal has not been met. Next to the percent with a goal, the count of reports used in the calculation are shown (e.g. “16 of 20 with mRDT”). CHWs have found this helpful in interpreting target information.

## Supervisor View

In version 3.9, a Supervisor view was introduced to provide actionable information for CHW coaching and performance management. Targets can be configured to be aggregated and synced to allow Supervisors to view the progress of their health workers towards their goals. Within a Supervisors hierarchy branch, they can view:

{{< figure src="mobile-supervisor.png" link="mobile-supervisor.png" class="right col-4 col-lg-6" >}}

Aggregate target metrics show an overview of all CHWs. Metrics are configurable based on project needs. For example, some values may be a percent, while others may be a tally. If the group of CHWs is performing on average below the goal, the metrics will be highlighted in red.

Clicking on an aggregate widget navigates to a detailed view with a breakdown of target data by individual CHW. The individual performance of each CHW is displayed on the right. If a CHW is performing below the target goal, their value will be highlighted in red. 

{{% alert title="Note" %}} The data displayed is based directly on CHW targets, thus subject to the same limitations. If a CHW has synced their data, but a manager has not synced, data displayed will not be up to date (also true in reverse). {{% /alert %}}
