---
title: "CHW Aggregate Targets"
linkTitle: "CHW Aggregate Targets"
identifier: "CHW Aggregate Targets"
weight: 2
description: >
  Aggregate targets for CHW supervision
---

{{< figure src="aggregate-supervisor.png" link="aggregate-supervisor.png" class="right col-7 col-lg-6" >}}

For CHW Supervisors, the [Targets](/building/targets/targets-overview) tab provides important insights into their community unit. It presents Supervisors with actionable information about their CHWs, by aggregating data for each of the CHWs that a Supervisor manages and presenting it in an easily digestible format. This enables Supervisors to gain insight into how well their team of CHWs is working together to meet common goals.

Selecting an aggregate widget opens the detailed view with the data for each individual CHW. If a CHW is performing below the target goal, their value will be highlighted in red, making it easier for Supervisors to know with which CHWs to follow up for coaching and performance management.

> [!NOTE]
> Aggregate targets were introduced in v3.9, and can be configured for both online and offline users. Aggregate targets are based on the widgets seen by CHWs, and dependent on the data that has been synced. If a CHW or the supervisor has not synced, then the aggregate target will not be up to date.

### Filtering Aggregate Targets

The ability for one user to manage multiple areas / facilities was introduced in v4.9.0. With that change it was important for users who manage multiple areas to filter aggregate targets by the respective facilities. The ability for users to filter Aggregate Targets was introduced in v4.10.0.

The following images show the various screens CHW supervisors see in Aggregate Targets. The example user in this illustration manages two facilities: **First Health Facility** and **Second Health Facility**.

{{< figure src="multi-facility-aggregate-supervisor-landing.png" link="multi-facility-aggregate-supervisor-landing.png" class="right col-6 col-lg-8" >}}

This is the landing page for the Aggregate Targets for a user who manages multiple areas / facilities.

The name of the facility appears in the breadcrumbs of the aggregate widgets on the Left Hand Side list and underneath the Target Title.

On the Top Right the user can click the **Filter** button to open the sidebar and change the Aggregate Targets of the other facilities.






{{< figure src="multi-facility-aggregate-supervisor-filter.png" link="multi-facility-aggregate-supervisor-filter.png" class="right col-6 col-lg-8" >}}

Clicking the **Filter** button opens the sidebar, which allows the user to filter the Aggregate Targets by **Facility** or **Reporting Period**

Selecting the Second Health Facility in the filter updates the Facility name in the breadcrumbs of the aggregate widgets on the Left Hand Side list and underneath the Target Title.





{{< figure src="multi-facility-aggregate-supervisor-period.png" link="multi-facility-aggregate-supervisor-period.png" class="right col-6 col-lg-8" >}}

Filtering the Aggregate Targets by **Reporting Period** adds the name of the previous month to the breadcrumbs of the aggregate widgets on the Left Hand Side list and in the Target details.





{{< figure src="one-facility-aggregate-supervisor-period.png" link="one-facility-aggregate-supervisor-period.png" class="right col-6 col-lg-8" >}}

Users who manage one area / facility can only filter their Aggregate Targets by **Reporting Period**.

The name of the facility **does not** appear in the breadcrumbs of the aggregate widgets on the Left Hand Side list or underneath the Target Title.

Filtering the Aggregate Targets by **Reporting Period** adds the name of the previous month to the breadcrumbs of the aggregate widgets on the Left Hand Side list and in the Target Details.



> [!NOTE]
> - The list of facilities in the sidebar are sorted in alphabetic order.
> - The default filter option for the facilities filter is the first facility in the sorted `array` of user Facilities.
> - The default filter option for the reporting period is `This month`.
> - The facility filter label in this example (Health Facility) is the `name_key` of the facility `contact_type` configured in the the [app-settings](/building/reference/app-settings/hierarchy)
> - The reporting period label in this example (Reporting Period) is added as a translation key `analytics.target.aggregates.reporting_period`.
