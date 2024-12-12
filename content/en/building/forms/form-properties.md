---
title: "Setting Form Properties"
linkTitle: Properties
weight: 5
description: >
 How to set form properties that contain meta information related to App forms
relatedContent: >
  building/forms/app/#formsappform_namepropertiesjson
  design/best-practices
aliases:
   - /building/tutorials/form-properties
   - /apps/tutorials/form-properties
---

{{% pageinfo %}}
This tutorial will take you through how to write the `<form_name>.properties.json` file.

The `<form_name>.properties.json` file allows you to add logic that ensures that the right action appears for the right contacts (people and places). For instance, an assessment form for children under-5 will only appear for person contacts on the CHT whose age is less than 5.

You will be adding meta-data and context to an assessment workflow that allows Community Health Workers to conduct a health assessment for children under the age of 5.
{{% /pageinfo %}}

## Brief Overview of Key Concepts

*[Form context]({{< ref "building/forms/app#formsappform_namepropertiesjson" >}})* defines when and where the form should be available in the app.

## Required Resources

You should have a functioning [CHT instance with `cht-conf` installed locally]({{< ref "building/local-setup" >}}), completed a [project folder]({{< ref "building/local-setup#3-create-and-upload-a-blank-project" >}}) setup, and an [assessment form]({{< ref "building/tutorials/app-forms" >}}).

## Implementation Steps

Create a new file in the same folder as your `assessment.xlsx` file and name it `assessment.properties.json`.

### 1. Define the Form's Title

Edit the `assessment.properties.json` file and add a `title` key with the value corresponding to the desired file title.

```json
{
  "title": "Assessment"
}
```

### 2. Define the Form's Icon

Add a `resources` folder in your project folder and put your preferred icon for assessment in it. Name the icon file `icon-healthcare-assessment.png` if it is a `png` file or `icon-healthcare-assessment.svg` if it is an `svg` file.

Create a `resources.json` *file* in your project folder and add key/value pairs for your icon resources.

```json
{
  "icon-healthcare-assessment": "icon-healthcare-assessment.png"
}
```

{{< see-also page="design/interface" title="Interface" >}}

Add an `icon` key in the `assessment.properties.json` file. Pick the key of the icon you require from the `resources.json` file and add it as the `icon` value.

```json
{
  "title": "Assessment",
  "icon": "icon-healthcare-assessment"
}
```

### 3. Define the Form's Context

First, add a `context` key in the `assessment.properties.json` file. Next, add an object with `person`, `place` and `expression` keys. Then, add the boolean value `true` for the `person` key, the boolean value `false` for the `place` key and the expression `ageInYears(contact) < 5` for the `expression` key.

```json
{
  "title": "Assessment",
  "icon": "icon-healthcare-assessment",
  "context": {
        "person": true,
        "place": false,
        "expression": "ageInYears(contact) < 5"
    }
}
```

### 4. Upload resources and the `<form_name>.properties.json` File

Run the following command from the root folder to upload the resources folder and `resources.json` file:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs upload-resources
```

Run the following command from the root folder to upload the `assessment.properties.json` file:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs upload-app-forms -- assessment
```

{{% alert title="Note" %}} Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance. {{% /alert %}}

Once you successfully upload the `assessment.properties.json` file, 'Assessment' will appear as an action _only_ for person contacts who are less that 5 years old. Additionally, the `icon-healthcare-assessment` icon will now show alongside the action name.

## Frequently Asked Questions

- [Can you associate an icon to a xml form?](https://forum.communityhealthtoolkit.org/t/can-you-associate-an-icon-to-a-xml-form/88)
