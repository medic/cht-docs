---
title: "DHIS2"
weight: 1
description: >
   Send aggregate, patient, and event data to DHIS2
keywords: dhis2
relatedContent: >
  building/guides/integrations/dhis2-aggregate
  building/reference/app-settings/dhis2
aliases:
   - /apps/features/integrations/dhis2
---

Most health systems have regular reporting requirements for community-level activities. Health workers often carry around heavy logbooks to manually record all relevant activities. When it is time to submit their data, community health workers (CHWs) summarize what was recorded in their logbooks and share this information with their supervisors, who in turn create paper records of these totals across entire community units or health facilities. This paper record is often passed to yet another individual whose responsibility is to manually key in the data into a health information management system, such as DHIS2.

In communities using digital health apps that do not integrate with DHIS2, it is highly likely that health workers are duplicating efforts by recording the same information both in their app and in their logbook(s).  For example, they are not only registering new pregnancies in their app, but they are also manually recording this in their logbooks, manually adding them up at the end of the month, and then someone else is manually keying this into DHIS2.

In communities using digital health apps built with the CHT, health systems can reduce or eliminate the need to complete paper based forms for DHIS2 reporting needs. This gives health workers more time to focus on caring for the families in their community while also increasing accuracy and timeliness of their DHIS2 reporting requirements.

## Overview

The CHT Core Framework supports integrations with DHIS2 in a variety of ways:

1. Sending patient data
2. Sending event data
3. Sending pre-aggregated "Service Reports"
4. Aggregating data across multiple health workers into DHIS2 Data Values
5. Exporting a file that can be imported into DHIS2 as a Data Set
6. Exposing an API for DHIS2 app developers to pull aggregate data from CHT Core
7. Receiving data from DHIS2

Sending patient, event, and pre-aggregated data can be achieved using the [Outbound push]({{< ref "building/reference/app-settings/outbound" >}}) feature. Receiving data from DHIS2 can be achieved using the [CHT Core Web API](https://github.com/medic/cht-core/tree/master/api). 

Aggregating data across multiple health workers requires a somewhat specific workflow and was designed with three key user personas in mind. The aggregate workflow is described in more detail below.

## Aggregate Workflow

The aggregate workflow was designed specifically for CHWs, Supervisors, and Health Records Information Officers (HRIO) but may be adapted to other contexts. 

**CHW (offline user)**: Conducts home visits and records information in the app. Reviews aggregate data throughout the month and makes sure to sync at the end of the month.

**Supervisor (offline user)**: Provides supervision to the CHWs, reviews and verifies aggregate data for an entire community unit.

**HRIO (online user)**: Exports a file from the CHT and imports into DHIS2. Reviews data in DHIS2.

### Community Health Workers

CHWs support patients in their community by following care guides and recording responses in the CHT. The CHT calculates aggregate DHIS2 Data Values for each CHW based on rules configured in the CHT. CHWs can view these indicators on the Targets tab and should review them and sync at the end of the month.

![CHWs](chw.png "Feature Overview CHWs")

{{< see-also page="building/features/targets" title="Targets" >}}

### Supervisors

In addition to their own targets, Supervisors can see the aggregate of each DHIS2 Data Value across *all* CHWs in their area from the *CHW Aggregate* view on the **Targets tab**. By tapping on a target, they can also see each CHW’s contribution towards that total. Supervisors can review and verify with CHWs that everyone has synced and that their data is correct. The Supervisor can communicate with the HRIO when everything has been validated.

![Supervisors](supervisor.png "Feature Overview Supervisors")

### Health Records Information Officers

HRIOs access the **CHT App Management** tab and select the appropriate *DHIS2 Data Set, Organisation Unit,* and *Period*. They then *Export* a file that is formatted for DHIS2. HRIOs will need access to the **Import/Export** feature in DHIS2 so that they can **Import** the file. Once it has been imported into DHIS2, they review the data from the **Data Entry** screen in DHIS2.

![Data Entry](data-entry-1.png "Feature Overview Data Entry 1")


## DHIS2 apps

The CHT also includes an [API](https://github.com/medic/cht-core/tree/master/api) that can be called from other applications that returns DHIS2 Data Sets. This means that you can build a [DHIS2 app](https://docs.dhis2.org/master/en/developer/html/apps_creating_apps.html) that pulls data from the CHT and imports it electronically into DHIS2. This would allow **Data Entry** to control the process directly from DHIS2 without having to access the CHT.

![Data Entry](data-entry-2.png "Feature Overview Data Entry 2")

## Version Notes

|Feature|CHT Core version|
|---|---|
|Calculate DHIS2 Data Values by aggregating data from CHT Core reports |3.9.0|
|Export file from CHT Core that can be imported into DHIS2 as a Data Set|3.9.0|
