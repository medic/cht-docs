---
title: Condition Cards
linkTitle: Condition Cards
weight: 3
description: >
  Building CHT application condition cards
relatedContent: >
  building/contact-management
  building/reference/contact-page#condition-cards
aliases:
   - /building/tutorials/condition-cards
   - /apps/tutorials/condition-cards
---

{{% pageinfo %}}
This tutorial will take you through building a condition card for CHT applications.

Condition cards, like contact summaries display information about the contact. The data displayed in condition cards can be pulled from submitted reports.

In this tutorial,you will be adding a condition card that displays information about a person's most recent assessment, including: *the date of the most recent assessment*, and *whether or not they had a cough*.

{{% /pageinfo %}}

## Brief Overview of Key Concepts

Condition cards can be *permanent or conditional*. They can be set to appear only when a specific type of report is submitted. They can also be set to disappear when a condition is resolved or a certain amount of time has passed.

Condition cards have several configurable elements including:

- Title
- Label for each data point displayed
- Data point for the field
- Icon for the field, if desired
- Conditions under which to display

## Required Resources

You should have a functioning [CHT instance with `cht-conf` installed locally]({{< ref "building/local-setup" >}}), completed a [project folder]({{< ref "building/local-setup#3-create-and-upload-a-blank-project" >}}) setup, and an [assessment form]({{< ref "building/tutorials/app-forms" >}}).

## Implementation Steps

Create a `contact-summary.templated.js` file if it doesn't exist. (This may have already been created by the initialise-project-layout command.)

### 1. Add Dependencies and Variable Definitions

Add the following dependencies and variable definitions at the top of the file (some of them may have been added from the [contact summary tutorial]({{< ref "building/tutorials/contact-summary" >}})):

```javascript
const thisContact = contact;
const thisLineage = lineage;
const allReports = reports;
```

{{% alert title="Note" %}} contact, reports, lineage are globally available for contact-summary. {{% /alert %}}

<br clear="all">

 *****

### 2. Define `cards` and Add a Condition Card Object

```javascript
const thisContact = contact;
const thisLineage = lineage;
const allReports = reports;

const cards = [
  {
    label: 'contact.profile.assessment_history',
    appliesToType: 'report',
    appliesIf: (report) => {
      const assessmentForm = getNewestReport(allReports, assessmentForms);
      return assessmentForm.reported_date >= report.reported_date;
    },
    fields: [
      {
        label: 'contact.profile.most_recent_assessment.date',
        value: (report) => { 
          return report.reported_date;
        },
        filter: 'simpleDate',
        width: 6
      },
      {
        label: 'contact.profile.cough',
        value: (report) => {
          return report.fields.cough;
        },
        width: 6,
      }
    ]
  }
];
```

<br clear="all">

 *****

### 3. Export `cards`

Export the defined fields as shown below:

```javascript
const thisContact = contact;
const thisLineage = lineage;
const allReports = reports;

const cards = [
  {
    label: 'contact.profile.assessment_history',
    appliesToType: 'report',
    appliesIf: (report) => {
      const assessmentForm = getNewestReport(allReports, assessmentForms);
      return assessmentForm.reported_date >= report.reported_date;
    },
    fields: [
      {
        label: 'contact.profile.most_recent_assessment.date',
        value: (report) => { 
          return report.reported_date;
        },
        filter: 'simpleDate',
        width: 6
      },
      {
        label: 'contact.profile.cough',
        value: (report) => {
          return report.fields.cough;
        },
        width: 6,
      }
    ]
  }
];

module.exports = {
  cards: cards
};
```

<br clear="all">

 *****

### 4. Compile and Upload App Settings

To compile and upload app settings to your local instance, run the following command:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs compile-app-settings upload-app-settings
```

{{% alert title="Note" %}} Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance. {{% /alert %}}
