---
title: "DHIS2 Integration"
weight: 1
description: >
   Aggregate data across multiple health workers and generate a file that can be imported into DHIS2
---


Most health systems have regular reporting requirements for community-level activities. Health workers often carry around heavy logbooks to manually record all relevant activities. When it is time to submit their data, community health workers summarize what was recorded in their logbooks and share this information with their supervisors, who in turn create paper records of these totals across entire community units or health facilities. This paper record is often passed to yet another individual whose responsibility is to manually key in the data into a health information management system, such as DHIS2.

In communities using digital health apps that do not integrate with DHIS2, it is highly likely that health workers are duplicating efforts by recording the same information in their app and in their logbook(s).  For example, they are not only registering new pregnancies in their app, but they are also manually recording this in their logbooks, manually adding them up at the end of the month, and then someone else is manually keying this into DHIS2.  

In communities using digital health apps built with the CHT, health systems will now be able to reduce or eliminate the need to complete paper based forms for DHIS2 reporting needs. We believe this will give health workers more time to focus on caring for the families in their community while also increasing accuracy and timeliness of their DHIS2 reporting requirements.

## Overview

This feature was designed around 3 key user personas: CHWs, Supervisors, and DHIS2 Data Enterer.

### CHWs (offline user)

CHWs support patients in their community by following care guides and recording responses in the CHT. The CHT calculates DHIS2 indicators based on configured rules. CHWs can view these indicators on the Targets tab.

![CHWs](chw.png "Feature Overview CHWs")

### Supervisors (offline user)

Supervisors can see the aggregate of each DHIS2 indicator across all CHWs in their area. They can also see each CHW’s contribution towards that total. This capability is not limited to DHIS2 indicators, it’s relevant to CHW Targets in general

![Supervisors](supervisor.png "Feature Overview Supervisors")

### Data Enterer

An Online user in the CHT will have access to the App Management tab where they can select the appropriate Data Set, Organisation Unit, and Period.  They can then “Export” a file that is formatted for DHIS2. They will then have access to the “Import/Export” feature in DHIS2 and “Import” the file.

![Data Entry](data-entry-1.png "Feature Overview Data Entry 1")

The CHT also includes an API that can be called from other applications that returns DHIS2 data sets. This means that you can build a [DHIS2 app](https://docs.dhis2.org/master/en/developer/html/apps_creating_apps.html) that pulls data from the CHT and imports it electronically into DHIS2. This would allow Data Entry to control the process, while not needing an account in the CHT.

![Data Entry](data-entry-2.png "Feature Overview Data Entry 2")

## Implementation

### Getting Started

*This feature requires CHT Core version 3.9+.*

One of the first things you’ll need to do is identify the specific DHIS2 Data Set (i.e. dataSet) that you plan to integrate data into. You’ll need a list of all the indicators on that dataSet, a detailed understanding of how each indicator is calculated, the frequency in which the dataSet is submitted (weekly, monthly, etc…), and for which Organisation Units (i.e. orgUnits) the Data Set applies. You’ll also want to identify and engage the appropriate DHIS2 stakeholders to discuss getting access to DHIS2 metadata, test environments, and discuss workflows.

### Design Considerations

There are a few very important considerations related to how you design workflows and set up your CHT application to make sure you will be able to integrate with DHIS2. The main areas are (1) hierarchies; (2) data & indicators; and (3) workflows and user access. These considerations are summarized below and expanded on in more detail in [this presentation](https://docs.google.com/presentation/d/11HUGG3QdiBCyyJdH3LdvkojezVEz2tEhAWfchdXYgZA/edit#slide=id.p3).

##### Hierarchies

The CHT relies on your Place hierarchy to determine how data should be aggregated for DHIS2. As such, it’s important that you consider how Organization Units are configured in the DHIS2 instance that you need to integrate data into. If your CHT Place hierarchy does not align with the DHIS2 Organisation Unit structure, the CHT will not be able to aggregate data in the way DHIS2 needs it.

See also: [Hierarchies]({{< ref "docs/apps/concepts/hierarchy" >}})

##### Data and Indicators

It’s important to understand each indicator on the DHIS2 dataSet you want to integrate data into and how each indicator is calculated. When you are designing your forms in the CHT, you will need to make sure you are capturing information in your forms so that every indicator on the chosen DHIS2 dataSet can be calculated within the CHT.

##### Workflows and User Access

As mentioned in the Overview section above, the CHT DHIS2 workflow is really designed around 3 key user personas. You’ll need to make sure that your context can support those assumptions and will be able to have access to the appropriate features in the CHT and DHIS2. 

Moving data from the CHT to DHIS2 can be done in three main ways.

1. Manually downloading from the CHT
2. Building an app in DHIS2 and calling an API in the CHT
3. Orchestrating the steps using an interoperability layer such as [OpenHIM](http://openhim.org/), [OpenFn](https://www.openfn.org/), etc...

### Configuration

Once you have designed your hierarchies, forms, indicators, and workflows, there are a few key [configurations](https://github.com/medic/medic-docs/blob/74c1e4cb20b1cc2e45d81de8181347a9264c4646/configuration/dhis-integration.md#configuration) that need to be addressed.

##### DHIS2 Data Set

For the CHT to be able to export the file for DHIS2, it needs to know the specific name and GUID of the dataSet in DHIS2. You will need to obtain the GUID from the test or production DHIS2 environment.

##### Associate CHT Places to DHIS2 orgUnits

Aggregation in the CHT is based on your Place hierarchy. As mentioned in the Hierarchies Design Considerations above, your Places must align with DHIS2 orgUnits. You will need to specify the DHIS2 orgUnit’s GUID on the Place document in the CHT.

##### Configure CHT Targets as DHIS2 dataElements

Calculations for DHIS2 indicators are done using CHT Target functionality. For each DHIS2 indicator, you will need to configure a corresponding CHT Target and specify the GUID of the DHIS2 dataElement.

### Known Limitations

A list of known limitations is maintained [here](https://github.com/medic/medic-docs/blob/74c1e4cb20b1cc2e45d81de8181347a9264c4646/configuration/dhis-integration.md#limitations-and-known-issues).
