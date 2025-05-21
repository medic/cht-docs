---
title: "Dashboards and Reporting"
linkTitle: "Dashboards and Reporting"
identifier: "Dashboards and Reporting"
weight: 4
description: >
  Dashboards and Reporting
---

## Supervisor Dashboards

{{< figure src="supervisor-dashboards.png" link="supervisor-dashboards.png" class="right col-7 col-lg-6" >}}

Program dashboards track, visualize, and share health progress with stakeholders more broadly. Supervisors can use program dashboards to help articulate their CHW cohorts activities and how they align with program impact standards and indicators. Summary statistics of CHW service area performance (e.g. number of home visits, number of protocol errors, etc) help to identify areas for continued improvement and deeper audits of care data.

The data that can be visualized is highly configurable, and depends on what data fields are configured in a particular CHT app’s forms. Dashboards can be built using any software that supports visualizing data with the widely used PostgreSQL database. Examples include the open source tool [Superset](https://superset.incubator.apache.org), as well as proprietary technologies like [Klipfolio](https://www.klipfolio.com) and [Tableau](https://www.tableau.com).

## DHIS2 Data Verification

Supervisors often provide a critical bridge between CHWs and broader health system reporting. Using the CHT’s [DHIS2 integration]({{< relref "building/integrations/dhis2" >}}), Supervisors can see the aggregate of each DHIS2 Data Value across all CHWs in their area. By tapping on a target, they can also see each CHW’s contribution towards that total. Once the Supervisor has verified data accuracy with CHWs, they can communicate with Health Records Information Officers to feed data into the national health information system.

{{< callout type="info" >}}
  DHIS2 integration was introduced in v3.9.
{{< /callout >}}
