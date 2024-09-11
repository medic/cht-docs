---
title: "Building App Forms"
linkTitle: App Forms
weight: 7
description: >
  Building CHT app forms
relatedContent: >
  building/reference/forms/contact
  building/reference/forms/app
  design/best-practices/#forms
  design/best-practices/#content-and-layout
  design/best-practices/#summary-page

aliases:
   - /apps/tutorials/app-forms
----

App forms allow users to submit reports from Android devices

{{% pageinfo %}}
This tutorial will take you through how to build App forms for CHT applications, including:

- Authoring forms in Excel, Google sheets or other spreadsheet applications.
- Converting XLSForms to XForms
- Uploading XForms to CHT

You will be building assessment workflow that allows Community Health Workers to conduct a health assessment for children under the age of 5.
{{% /pageinfo %}}

## Brief Overview of Key Concepts

*[App forms]({{< ref "building/reference/forms/app" >}})* serve as actions within the app.

*[XLSForm]({{< ref "building/reference/forms/app#xlsform" >}})* is a form [standard](http://xlsform.org/en/) created to help simplify the authoring of forms in Excel.

*[XForm]({{< ref "building/reference/forms/app#xform" >}})* is a CHT-enhanced version of the [ODK XForm](https://getodk.github.io/xforms-spec/) standard.

## Required Resources

You should have a [functioning CHT instance with `cht-conf` installed locally]({{< ref "building/tutorials/local-setup" >}}) and a [project folder set up]({{< ref "building/tutorials/local-setup#3-create-and-upload-a-blank-project" >}}) already.

## Implementation Steps

Create a new spread sheet in Google sheets or other preferred editor like Excel or Open Office. Name the spreadsheet `assessment`. The final file name should be `assessment.xlsx`.

Create 2 additional sheets. Rename the sheets `survey`, `choices` and `settings`.

### 1. Define XLS Survey/Form Fields

Create the following columns in the survey sheet and then add the following rows that are populated automatically before the form is rendered to the user. These fields are usually hidden by default but can be accessed to display certain information about the person being assessed:

| type        | name            | label                       | required | relevant          | appearance | constraint | constraint_message  | calculation            | choice_filter  | hint                          | default |
|-------------| --------------- | --------------------------- | -------- | ----------------- |------------| ---------- | ------------------- | ---------------------- | -------------- | ----------------------------- | ------- |
| begin group | inputs          | Patient                     |          | ./source = 'user' | field-list |            |                     |                        |                |                               |         |
| hidden      | source          | Source                      |          |                   |            |            |                     |                        |                |                               | user    |
| hidden      | source_id       | Source_ID                   |          |                   |            |            |                     |                        |                |                               |         |
| hidden      | task_id       | Task_ID                   |          |                   |            |            |                     |                        |                |                               |         |
| begin group | contact         | Contact                     |          |                   |            |            |                     |                        |                |                               |         |
| string      | _id             | Patient ID                  |          |                   | select-contact type-person |            |                     |                        |                | Select a person from the list |         |
| hidden      | patient_id      | Medic ID                    |          |                   |            |            |                     |                        |                |                               |         |
| hidden      | name            | Patient Name                |          |                   |            |            |                     |                        |                |                               |         |
| begin group | parent          | Parent                      |          |                   |            |            |                     |                        |                |                               |         |
| hidden      | _id             | Family UUID                 |          |                   |            |            |                     |                        |                |                               |         |
| begin group | parent          | Grandparent                 |          |                   |            |            |                     |                        |                |                               |         |
| hidden      | _id             | CHW Area UUID               |          |                   |            |            |                     |                        |                |                               |         |
| hidden      | name            | CHW Name                    |          |                   |            |            |                     |                        |                |                               |         |
| hidden      | phone           | CHW Phone                   |          |                   |            |            |                     |                        |                |                               |         |
| begin group | parent          | Great Grandparent           |          |                   |            |            |                     |                        |                |                               |         |
| hidden      | _id             | CU UUID                     |          |                   |            |            |                     |                        |                |                               |         |
| end group   |                 |                             |          |                   |            |            |                     |                        |                |                               |         |
| end group   |                 |                             |          |                   |            |            |                     |                        |                |                               |         |
| end group   |                 |                             |          |                   |            |            |                     |                        |                |                               |         |
| end group   |                 |                             |          |                   |            |            |                     |                        |                |                               |         |
| end group   |                 |                             |          |                   |            |            |                     |                        |                |                               |         |
| calculate   | patient_id    |                             |          |                   |            |            |                     | ../inputs/contact/_id |                |                               |         |
| calculate   | patient_name    |                             |          |                   |            |            |                     | ../inputs/contact/name |                |                               |         |


Add the following rows that define the data collection fields below the existing rows (leave out the column names):

| type                          | name              | label                              | required | relevant            | appearance | constraint | constraint_message  | calculation | choice_filter  | hint | default |
| ----------------------------- | ----------------- | ---------------------------------- | -------- | ------------------- | ---------- | ---------- | ------------------- | ----------- | -------------- | ---- | ------- |
| begin group                   | group_assessment  | Assessment                         |          |                     |            |            |                     |             |                |      |         |
| select_one yes_no             | cough             | Does ${patient_name} have a cough? | yes      |                     |            |            |                     |             |                |      |         |
| select_one symptom_duration   | cough_duration    | How long has the cough lasted?     | yes      | ${cough} = 'yes'    |            |            |                     |             |                |      |         |
| end group                     |                   |                                    |          |                     |            |            |                     |             |                |      |         |

### 2. Define the Choices

Add the following column names and rows to the choices sheet:

| list_name         | name | label           |
| ----------------- | ---- | --------------- |
| yes_no            | yes  | Yes             |
| yes_no            | no   | No              |
| symptom_duration  | 3    | 3 days or less  |
| symptom_duration  | 7    | 4 - 7 days      |
| symptom_duration  | 13   | 8 - 13 days     |
| symptom_duration  | 14   | 14 days or more |

### 3. Define the XLS Settings

Add the following column names and rows to the settings sheet:

| form_title     | form_id    | version | style | path | instance_name  | default_language  |
| -------------- | ---------- | ------- | ----- | ---- | -------------- | ----------------- |
| Assess patient | assessment | 1       | pages | data |                | en                |

### 4. Convert the XLSForm and Upload the XForm

Add the file to the `forms/app` subfolder in your project.

```text
project-name
  forms
    app
      assessment.xlsx
```

To convert and upload the form to your local instance, run the following command from the root folder:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs convert-app-forms upload-app-forms -- assessment
```

{{% alert title="Note" %}} Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance. {{% /alert %}}

## Next steps

In the next tutorial, you will define the form `<form_id>.properties.json` which will allow you to define the form’s title and icon, as well as when and where the form should be available.
