---
title: Building Contact Summary
linkTitle: Building
weight: 1
description: >
  Building CHT Application contact summary
relatedContent: >
  building/contact-management#contact-summary
  building/contact-summary/contact-summary-templated#contact-summary
aliases:
   - /building/tutorials/contact-summary
   - /apps/tutorials/contact-summary
---

 
This tutorial will take you through building a contact summary for CHT applications.

Contact summaries display basic information about the contact.

You will be adding a contact summary that displays information about a person's *patient id*, *age*, *sex*, *phone number*, and information about the place they belong to ie. *parent*.

  

## Brief Overview of Key Concepts

Each *field* that can be shown on a contact’s profile is defined as an object in the *[fields array]({{< ref "building/contact-summary/contact-summary-templated#contact-summarytemplatedjs-fields" >}})* of `contact-summary.templated.js`.

The *properties* for each object determine how and when the field is shown.

## Required Resources

You should have a functioning [CHT instance with `cht-conf` installed locally]({{< ref "building/local-setup" >}}), and completed a [project folder]({{< ref "building/local-setup#3-create-and-upload-a-blank-project" >}}) setup.

## Implementation Steps

Create a `contact-summary.templated.js` file. (This may have already been created by the initialise-project-layout command.)

### 1. Add Dependencies and Variable Definitions

Add the following dependencies and variable definitions at the top of the file:

```javascript
const thisContact = contact;
const thisLineage = lineage;
```

> [!NOTE] 
> contact, reports, lineage are globally available for contact-summary.

<br clear="all">

 *****

### 2. Define Contact Summary Fields

Define the `patient_id`, `age`, `sex`, `phone`, and `parent` contact fields as shown below:

```javascript
const thisContact = contact;
const thisLineage = lineage;

const fields = [
  { appliesToType: 'person', label: 'patient_id', value: thisContact.patient_id, width: 4 },
  { appliesToType: 'person', label: 'contact.age', value: thisContact.date_of_birth, width: 4, filter: 'age' },
  { appliesToType: 'person', label: 'contact.sex', value: 'contact.sex.' + thisContact.sex, translate: true, width: 4 },
  { appliesToType: 'person', label: 'person.field.phone', value: thisContact.phone, width: 4 },
  { appliesToType: 'person', label: 'contact.parent', value: thisLineage, filter: 'lineage' },
];
```

> [!NOTE] 
> The contact field e.g. `patient_id` and `date_of_birth`, should exist in the contact's document for it to return a value.

<br clear="all">

 *****

### 3. Export `fields`

Export the defined fields as shown below:

```javascript
const thisContact = contact;
const thisLineage = lineage;

const fields = [
  { appliesToType: 'person', label: 'patient_id', value: thisContact.patient_id, width: 4 },
  { appliesToType: 'person', label: 'contact.age', value: thisContact.date_of_birth, width: 4, filter: 'age' },
  { appliesToType: 'person', label: 'contact.sex', value: 'contact.sex.' + thisContact.sex, translate: true, width: 4 },
  { appliesToType: 'person', label: 'person.field.phone', value: thisContact.phone, width: 4 },
  { appliesToType: 'person', label: 'contact.parent', value: thisLineage, filter: 'lineage' },
];

module.exports = {
  fields: fields
};
```

<br clear="all">

 *****

### 4. Compile and Upload App Settings

To compile and upload app settings to your local instance, run the following command:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs compile-app-settings upload-app-settings
```

> [!NOTE] 
> Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance.
