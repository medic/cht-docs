---
title: Supervision
weight: 7
description: >
  Supervision and workforce management to strengthen health systems
keywords: supervisor
relatedContent: >
  building/targets/targets-overview
  design/best-practices/#targets
  building/integrations/dhis2
  building/reference/app-settings/transitions#create_user_for_contacts
  exploring/supervisor-reference-app
aliases:
   - /apps/features/supervision/
---

Supervision and workforce management are important aspects to building and maintaining high-performing community health systems. Supervisors help Community Health Workers deliver quality healthcare services to their patients through building CHW care delivery knowledge and skills, fostering a supportive work environment, and supporting continuity of care between home-based care and community health centers or facilities. 

The importance of regular and systematic CHW supervision is emphasized by the WHO’s [guidelines](https://www.who.int/publications/i/item/9789241550369) on health policy and system support, which is formulated to optimize community-based health worker programs. Following these guidelines, the CHT is designed to enable Supervisors to provide personalized performance feedback during CHW supervision as well as track aggregate statistics. Data collected from completed [Care Guides]({{< relref "building/concepts/care-guides" >}}) produce granular information which can be used to provide coaching that promotes compliance with health program standards of practice and closer monitoring of outcomes.

## CHW Aggregate Targets

{{< figure src="aggregate-supervisor.png" link="aggregate-supervisor.png" class="right col-7 col-lg-6" >}}

For CHW Supervisors, the [Targets]({{< relref "building/targets/targets-overview" >}}) tab provides important insights into their community unit. It presents Supervisors with actionable information about their CHWs, by aggregating data for each of the CHWs that a Supervisor manages and presenting it in an easily digestible format. This enables Supervisors to gain insight into how well their team of CHWs is working together to meet common goals.

Selecting an aggregate widget opens the detailed view with the data for each individual CHW. If a CHW is performing below the target goal, their value will be highlighted in red, making it easier for Supervisors to know with which CHWs to follow up for coaching and performance management.

> [!NOTE] 
> Aggregate targets were introduced in v3.9, and can be configured for both online and offline users. Aggregate targets are based on the widgets seen by CHWs, and dependent on the data that has been synced. If a CHW or the supervisor has not synced, then the aggregate target will not be up to date.

### Filtering Aggregate Targets

The ability for one user to manage multiple areas / facilities was introduced in v4.9.0. With that change it was important for users who manage multiple areas to filter aggregate targets by the respective facilities. The ability for users to filter Aggregate Targets was introduced in v4.10.0.

The following images show the various screens CHW supervisors see in Aggregate Targets. The example user in this illustration manages two facilities: **First Health Facility** and **Second Health Facility**

<br clear="all">

{{< figure src="multi-facility-aggregate-supervisor-landing" link="multi-facility-aggregate-supervisor-landing.png" class="right col-6 col-lg-8" >}}

This is the landing page for the Aggregate Targets for a user who manages multiple areas / facilities. 

The name of the facility appears in the breadcrumbs of the aggregate widgets on the Left Hand Side list and underneath the Target Title.

On the Top Right the user can click the **Filter** button to open the sidebar and change the Aggregate Targets of the other facilities.


<br clear="all">

<br clear="all">

{{< figure src="multi-facility-aggregate-supervisor-filter" link="multi-facility-aggregate-supervisor-filter.png" class="right col-6 col-lg-8" >}}

Clicking the **Filter** button opens the sidebar, which allows the user to filter the Aggregate Targets by **Facility** or **Reporting Period**

Selecting the Second Health Facility in the filter updates the Facility name in the breadcrumbs of the aggregate widgets on the Left Hand Side list and underneath the Target Title.

<br clear="all">

<br clear="all">

{{< figure src="multi-facility-aggregate-supervisor-period" link="multi-facility-aggregate-supervisor-period.png" class="right col-6 col-lg-8" >}}

Filtering the Aggregate Targets by **Reporting Period** adds the name of the previous month to the breadcrumbs of the aggregate widgets on the Left Hand Side list and in the Target details.

<br clear="all">

<br clear="all">

{{< figure src="one-facility-aggregate-supervisor-period" link="one-facility-aggregate-supervisor-period.png" class="right col-6 col-lg-8" >}}

Users who manage one area / facility can only filter their Aggregate Targets by **Reporting Period**.

The name of the facility **does not** appear in the breadcrumbs of the aggregate widgets on the Left Hand Side list or underneath the Target Title.

Filtering the Aggregate Targets by **Reporting Period** adds the name of the previous month to the breadcrumbs of the aggregate widgets on the Left Hand Side list and in the Target Details.

<br clear="all">

> [!NOTE]
> - The list of facilities in the sidebar are sorted in alphabetic order.
> - The default filter option for the facilities filter is the first facility in the sorted `array` of user Facilities.
> - The default filter option for the reporting period is `This month`.
> - The facility filter label in this example (Health Facility) is the `name_key` of the facility `contact_type` configured in the the [app-settings]({{< relref "building/reference/app-settings/hierarchy" >}})
> - The reporting period label in this example (Reporting Period) is added as a translation key `analytics.target.aggregates.reporting_period`.

## Supervisor Tasks

The CHT can be configured to create [Tasks]({{< relref "building/tasks" >}}) for Supervisors to help plan their performance management reviews. Tasks can be generated based on routine CHW supervision interactions, or data-driven based on specific events (e.g. to follow up with health workers whom haven’t submitted any forms in x period of time). Using Supervisor tasks to ensure that the right actions are taken for the right CHWs at the right time strengthens supervisory program design through routine assessments and timely feedback.

 
### Deployment Case Study
[Muso](https://www.musohealth.org), a leading community health organization and major contributor to the CHT, has implemented ”360º supervision”, achieving some of the lowest child mortality rates in sub-Saharan Africa. This model provides dedicated mentorship and supportive supervision to CHWs tailored to each CHW's particular strengths and challenges. A key theme of our human-centered approach was the idea of using data to improve one-to-one supervision, rather than using analytics to replace Supervisors. Read more about findings from a recent [randomized controlled trial](https://medic.org/stories/new-study-precision-supervision-and-personalized-feedback-dashboards-improve-chw-performance-in-mali/).
  

## User Management
Supervisors are able to set up users in the CHT without contacting a system administrator. They can **create** new CHW user accounts or **replace** CHWs on an existing device. 

When _creating_ a new user account, Supervisors fill out the necessary details, including the CHW's phone number, from their own device. They can do this while offline, but must sync before the actual user account is created. Once the Supervisor syncs, the CHT will send an SMS to the new CHW with a [magic link]({{< relref "building/concepts/access#magic-links-for-logging-in-token-login" >}}) that enables them to login and start using the app.

When _replacing_ a CHW, Supervisors access the existing device and provide details about the new CHW. The new CHW can start using the app immediately, even while offline, and will see all of the existing household data. Once the new CHW syncs, the records on the server will be updated to reflect the new CHWs details.  

This can be used to manage both CHW and CHW supervisor roles.

## Managing Multiple Areas

CHT hierarchies tend to mimic geographical areas but Supervisors often manage CHWs across multiple geographical areas. (Offline) Supervisors who manage multiple areas can see data for all the different areas they manage from one app.

 > [!NOTE] 
 > The ability for one user to replicate data from multiple areas was introduced in v4.9.0. A video demonstration of setting up a multi-facility user and what this looks like from a user's perspective can be found [on the forum](https://forum.communityhealthtoolkit.org/t/support-for-supervisors-who-need-to-manage-multiple-areas/3497/2?u=michael) and in the [June 2024 CHT Round-up](https://youtu.be/hrhdrzP41gE?si=_7wglk7Nm7CCSFbY&t=606).



## Supervisor Dashboards

{{< figure src="supervisor-dashboards.png" link="supervisor-dashboards.png" class="right col-7 col-lg-6" >}}

Program dashboards track, visualize, and share health progress with stakeholders more broadly. Supervisors can use program dashboards to help articulate their CHW cohorts activities and how they align with program impact standards and indicators. Summary statistics of CHW service area performance (e.g. number of home visits, number of protocol errors, etc) help to identify areas for continued improvement and deeper audits of care data. 

The data that can be visualized is highly configurable, and depends on what data fields are configured in a particular CHT app’s forms. Dashboards can be built using any software that supports visualizing data with the widely used PostgreSQL database. Examples include the open source tool [Superset](https://superset.incubator.apache.org), as well as proprietary technologies like [Klipfolio](https://www.klipfolio.com) and [Tableau](https://www.tableau.com). 

## DHIS2 Data Verification

Supervisors often provide a critical bridge between CHWs and broader health system reporting. Using the CHT’s [DHIS2 integration]({{< relref "building/integrations/dhis2" >}}), Supervisors can see the aggregate of each DHIS2 Data Value across all CHWs in their area. By tapping on a target, they can also see each CHW’s contribution towards that total. Once the Supervisor has verified data accuracy with CHWs, they can communicate with Health Records Information Officers to feed data into the national health information system.

> [!NOTE] 
> DHIS2 integration was introduced in v3.9.

