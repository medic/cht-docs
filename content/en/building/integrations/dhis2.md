---
title: "DHIS2"
weight: 1
description: >
   Send aggregate, patient, and event data to DHIS2
keywords: dhis2
relatedContent: >
  building/application-settings/app-settings/dhis2
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

Sending patient, event, and pre-aggregated data can be achieved using the [Outbound push]({{< ref "building/application-settings/app-settings/outbound" >}}) feature. Receiving data from DHIS2 can be achieved using the [CHT Core Web API](https://github.com/medic/cht-core/tree/master/api). 

Aggregating data across multiple health workers requires a somewhat specific workflow and was designed with three key user personas in mind. The aggregate workflow is described in more detail below.

## Aggregate Workflow

The aggregate workflow was designed specifically for CHWs, Supervisors, and Health Records Information Officers (HRIO) but may be adapted to other contexts. 

**CHW (offline user)**: Conducts home visits and records information in the app. Reviews aggregate data throughout the month and makes sure to sync at the end of the month.

**Supervisor (offline user)**: Provides supervision to the CHWs, reviews and verifies aggregate data for an entire community unit.

**HRIO (online user)**: Exports a file from the CHT and imports into DHIS2. Reviews data in DHIS2.

### Community Health Workers

CHWs support patients in their community by following care guides and recording responses in the CHT. The CHT calculates aggregate DHIS2 Data Values for each CHW based on rules configured in the CHT. CHWs can view these indicators on the Targets tab and should review them and sync at the end of the month.

![CHWs](chw.png "Feature Overview CHWs")

{{< see-also page="building/targets" title="Targets" >}}

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

## DHIS2 Aggregate
One of the first things you’ll need to do is identify the specific [DHIS2 data set](https://docs.dhis2.org/2.34/en/dhis2_implementation_guide/data-sets-and-forms.html#what-is-a-data-set) that you plan to implement. You’ll need a list of all the [data elements](https://docs.dhis2.org/2.34/en/dhis2_implementation_guide/data-elements-and-custom-dimensions.html#data-elements) on that data set, a detailed understanding of how each is calculated, the frequency in which the data set is submitted (weekly, monthly, etc…), and for which [organisation units](https://docs.dhis2.org/2.34/en/dhis2_implementation_guide/organisation-units.html) the data set applies. You’ll also want to identify and engage the appropriate DHIS2 stakeholders to get access to DHIS2 metadata, test environments, and discuss workflows. The DHIS2 documentation site provides additional background and advice [here](https://docs.dhis2.org/2.34/en/dhis2_implementation_guide/integration-concepts.html#integration-concepts).

## Design Considerations

There are a few very important considerations related to how you design workflows and set up your CHT application to make sure you will be able to integrate with DHIS2. The main areas are:

1. Hierarchies
2. Fields and calculations
3. Workflows and user access. 

These considerations are summarized below.

### Hierarchies

The CHT relies on your Place hierarchy to determine how data should be aggregated for DHIS2. As such, it’s important that you consider how organization units are configured in the DHIS2 instance that you need to integrate data into. If your CHT Place hierarchy does not align with the DHIS2 organisation unit structure, the CHT will not be able to aggregate data in the way DHIS2 needs it.

{{% alert title="Note" %}}
There should be a one-to-one relationship between DHIS2 organisation units and CHT places.
{{% /alert %}}


{{< see-also page="building/workflows/hierarchy" title="Hierarchies" >}}


### Fields and calculations

It’s important to understand each data element on the DHIS2 data set you want to integrate data into and how each data element is calculated. When you are designing your forms in the CHT, you will need to make sure you are capturing information in your forms so that every data element on the chosen DHIS2 data set can be calculated within the CHT.

{{% alert title="Note" %}}
Once you obtain the list of data elements on the data set, be sure to go through them one by one and figure out how to calculate each one using information available in your CHT forms.
{{% /alert %}}


{{< see-also page="building/forms" title="Forms" >}}

### Workflows and User Access

The aggregate data workflow is really designed around 3 key user personas. You’ll need to make sure that your context can support those assumptions and will be able to have access to the appropriate features in the CHT and DHIS2. 

Moving data from the CHT to DHIS2 can be done in three main ways.

1. Manually downloading from the CHT
2. Building an app in DHIS2 and calling an API in the CHT
3. Orchestrating the steps using an interoperability layer such as [OpenHIM](http://openhim.org/), [OpenFn](https://www.openfn.org/), etc...


## Configuration

Once you have designed your hierarchies, forms, calculations, and workflows, there are a few key configurations that need to be made.

### Data sets

For the CHT to be able to export the file for DHIS2, it needs to know the specific name and ID of the data set in DHIS2. You will need to obtain the ID from the test or production DHIS2 environment.

Configure the data set in `app_settings.json`.

{{< see-also page="building/application-settings/app-settings/dhis2" title="DHIS2 in App Settings" >}}

### Organisation units

Aggregation in the CHT is based on your Place hierarchy. As mentioned in the Hierarchies Design Considerations above, your Places must align with DHIS2 organisation units. You will need to specify the DHIS2 organisation unit's ID on the Place document in the CHT.

{{% alert title="Note" %}}
Update the contact document of each place you wish to map to an organisation unit. Add a `dhis.orgUnit` attribute.
{{% /alert %}}


{{< see-also page="building/forms/contact" title="Contact Forms" >}}

```json
{
  "_id": "my_place",
  "type": "health_center",
  "dhis": {
    "orgUnit": "HJiPOcmziQA"
  }
}
```

### Data elements

Calculations for DHIS2 indicators are done using CHT Target functionality. For each DHIS2 data element, you will need to configure a corresponding CHT Target and specify the ID of the DHIS2 data set and data element. If you do not include the data set, this data element will be included in every data set.

{{% alert title="Note" %}}
In `targets.js`, configure one or more data elements by setting the `dhis.dataSet` and `dhis.dataElement` attributes in the target schema.
{{% /alert %}}



{{< see-also page="building/targets/targets-js" title="Targets" >}}

```javascript
module.export = [
  {
    id: 'births-this-month',
    type: 'count',
    icon: 'icon-infant',
    translation_key: 'targets.births.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    goal: -1,
    appliesTo: 'contacts',
    appliesToType: ['person'],
    appliesIf: contact => !!contact,
    date: (contact) => contact.contact.date_of_birth,
    dhis: {
      dataSet: 'VMuFODsyWaO',
      dataElement: 'kB0ZBFisE0e'
    }
  },
];
```

### Users

For the HRIO role, create a new user role and a new user with that role; or update an existing user role. To export DHIS2 metrics, users need to have the following permissions: `can_configure`, `can_export_all`, and `can_export_dhis`.

{{< see-also page="apps/concepts/users" title="Users" >}}

## User experience

Once your CHT project is configured to integrate with DHIS2, follow these steps to export the data from CHT and import it into DHIS:

### Export data

1. Login to the CHT instance using a user account with the required permissions. You should be automatically navigated to the Admin Console.
2. Select "Import & export data" from the side
3. Select "DHIS2" from the header along the top
4. Select the data set, org unit, and time period that you'd like to send to DHIS2. Click "Export"
5. A file should download in your browser. This file contains a [dataValueSet](https://docs.dhis2.org/master/en/developer/html/webapi_data_values.html) with aggregated user's data.

### Import data

1. Login to DHIS2 using a user account with permission to manage the relevant dataset and organisation units.
2. Select the "import/export" application inside DHIS2. Select "import data".
3. Upload the file you downloaded in Step 5.
4. Click "Import"

Check the UI for any errors. If you get errors you don't understand or are unable to resolve an error, you can always ask for assistance on the [CHT Forum](https://forum.communityhealthtoolkit.org/c/support/18). If there are no errors, you can review the numbers that resulted by reviewing the data set in DHIS2.

## Known limitations

* Data for each user is aggregated based on the contents of the user's target document. Note that if your users don't login and synchronize, their data won't be represented in the exported data.
* Integrations are limited to _monthly_ DHIS2 data sets.
* Integrations are limited to numeric data-types. To support other data types, consider making a [DHIS2 App](https://docs.dhis2.org/master/en/developer/html/apps_creating_apps.html) for your project.
