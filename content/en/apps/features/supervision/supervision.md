---
title: Supervision
weight: 7
description: >
  Supervision and workforce management to strengthen health systems
keywords: supervisor
relatedContent: >
  apps/features/targets
  design/best-practices/#targets
  apps/features/integrations/dhis2
---

Supervision and workforce management are important aspects to building and maintaining high-performing community health systems. Supervisors help Community Health Workers deliver quality healthcare services to their patients through building CHW care delivery knowledge and skills, fostering a supportive work environment, and supporting continuity of care between home-based care and community health centers or facilities. 

The importance of regular and systematic CHW supervision is emphasized by the WHO’s [guidelines](https://www.who.int/hrh/community/guideline-health-support-optimize-hw-programmes/en/) on health policy and system support, which is formulated to optimize community-based health worker programs. Following these guidelines, the CHT is designed to enable Supervisors to provide personalized performance feedback during CHW supervision as well as track aggregate statistics. Data collected from completed [Care Guides]({{< relref "apps/concepts/care-guides" >}}) produce granular information which can be used to provide coaching that promotes compliance with health program standards of practice and closer monitoring of outcomes.

## CHW Aggregate Targets

{{< figure src="aggregate-supervisor.png" link="aggregate-supervisor.png" class="right col-7 col-lg-6" >}}

For CHW Supervisors, the [Targets]({{< relref "apps/features/targets" >}}) tab provides important insights into their community unit. It presents Supervisors with actionable information about their CHWs, by aggregating data for each of the CHWs that a Supervisor manages and presenting it in an easily digestible format. This enables Supervisors to gain insight into how well their team of CHWs is working together to meet common goals.

Selecting an aggregate widget opens the detailed view with the data for each individual CHW. If a CHW is performing below the target goal, their value will be highlighted in red, making it easier for Supervisors to know with which CHWs to follow up for coaching and performance management.

{{% alert title="Note" %}} Aggregate targets were introduced in v3.9. Aggregate targets are based on the widgets seen by CHWs, and dependent on the data that has been synced. If a CHW or the supervisor has not synced, then the aggregate target will not be up to date. {{% /alert %}}

## Supervisor Dashboards

{{< figure src="supervisor-dashboards.png" link="supervisor-dashboards.png" class="right col-7 col-lg-6" >}}

Program dashboards track, visualize, and share health progress with stakeholders more broadly. Supervisors can use program dashboards to help articulate their CHW cohorts activities and how they align with program impact standards and indicators. Summary statistics of CHW service area performance (e.g. number of home visits, number of protocol errors, etc) help to identify areas for continued improvement and deeper audits of care data. 

The data that can be visualized is highly configurable, and depends on what data fields are configured in a particular CHT app’s forms. Dashboards can be built using any software that supports visualizing data with the widely used PostgreSQL database. Examples include the open source tool [Superset](https://superset.incubator.apache.org), as well as proprietary technologies like [Klipfolio](https://www.klipfolio.com) and [Tableau](https://www.tableau.com). 

## DHIS2 Data Verification

Supervisors often provide a critical bridge between CHWs and broader health system reporting. Using the CHT’s [DHIS2 integration]({{< relref "apps/features/integrations/dhis2" >}}), Supervisors can see the aggregate of each DHIS2 Data Value across all CHWs in their area. By tapping on a target, they can also see each CHW’s contribution towards that total. Once the Supervisor has verified data accuracy with CHWs, they can communicate with Health Records Information Officers to feed data into the national health information system.

{{% alert title="Note" %}} DHIS2 integration was introduced in v3.9. {{% /alert %}}

## Supervisor Tasks

The CHT can be configured to create [Tasks]({{< relref "apps/features/tasks" >}}) for Supervisors to help plan their performance management reviews. Tasks can be generated based on routine CHW supervision interactions, or data-driven based on specific events (e.g. to follow up with health workers whom haven’t submitted any forms in x period of time). Using Supervisor tasks to ensure that the right actions are taken for the right CHWs at the right time strengthens supervisory program design through routine assessments and timely feedback.

{{% pageinfo %}}
### Deployment Case Study
[Muso](https://www.musohealth.org), a leading community health organization and major contributor to the CHT, has implemented ”360º supervision”, achieving some of the lowest child mortality rates in sub-Saharan Africa. This model provides dedicated mentorship and supportive supervision to CHWs tailored to each CHW's particular strengths and challenges. A key theme of our [human-centered approach](https://medicmobile.org/design) was the idea of using data to improve one-to-one supervision, rather than using analytics to replace Supervisors. Read more about findings from a recent [randomized controlled trial](https://medicmobile.org/blog/new-study-precision-supervision-and-personalized-feedback-dashboards-improve-chw-performance-in-mali).
{{% /pageinfo %}}
