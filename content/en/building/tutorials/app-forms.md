---
title: "Building App Forms"
linkTitle: App Forms
weight: 7
description: >
  Building CHT app forms
relatedContent: >
  building/forms/contact
  building/forms/app
  design/best-practices/#forms
  design/best-practices/#content-and-layout
  design/best-practices/#summary-page

aliases:
   - /apps/tutorials/app-forms
---

<style>
.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.35em 0.9em;
  font-size: 0.95em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.copy-btn:hover {
  background: #e5e7eb;
  color: #111827;
}
.copy-btn:active {
  background: #d1d5db;
}
#copied-msg {
  display: none;
  color: #388e3c;
  font-weight: bold;
  margin-left: 10px;
  font-size: 1em;
}
.tsv-table {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  font-family: monospace;
  font-size: 0.98em;
  overflow-x: auto;
  white-space: pre;
  margin-top: 0.5em;
}
</style>

App forms allow users to submit reports from Android devices.

This tutorial will take you through how to build App forms for CHT applications, including:

- Authoring forms in Excel, Google sheets or other spreadsheet applications.
- Converting XLSForms to XForms
- Uploading XForms to CHT

You will be building assessment workflow that allows Community Health Workers to conduct a health assessment for children under the age of 5.

## Brief Overview of Key Concepts

*[App forms]({{< ref "building/forms/app" >}})* serve as actions within the app.

*[XLSForm]({{< ref "building/forms/app#xlsform" >}})* is a form [standard](http://xlsform.org/en/) created to help simplify the authoring of forms in Excel.

*[XForm]({{< ref "building/forms/app#xform" >}})* is a CHT-enhanced version of the [ODK XForm](https://getodk.github.io/xforms-spec/) standard.

## Required Resources

You should have a [functioning CHT instance with `cht-conf` installed locally]({{< ref "building/local-setup" >}}) and a [project folder set up]({{< ref "building/local-setup#3-create-and-upload-a-blank-project" >}}) already.

## Implementation Steps

Create a new spread sheet in [Google Sheets](https://workspace.google.com/products/sheets/)  or other preferred editor like [Excel](https://www.microsoft.com/en-us/microsoft-365/excel) or [LibreOffice](https://www.libreoffice.org/). Name the spreadsheet `assessment`. The final file name should be `assessment.xlsx`.

Create 2 additional sheets. Rename the sheets `survey`, `choices` and `settings`.

### 1. Define XLS Survey/Form Fields

Copy everything inside the code block below, then paste into cell A1 of a new sheet named `survey` in Excel or Google Sheets:

{{< copytable id="survey" label="Copy survey sheet" >}}
type	name	label	required	relevant	appearance	constraint	constraint_message	calculation	choice_filter	hint	default
begin group	inputs	Patient		./source = 'user'	field-list						
hidden	source	Source								user
hidden	source_id	Source_ID								
hidden	task_id	Task_ID								
begin group	contact	Contact								
string	_id	Patient ID			select-contact type-person				Select a person from the list	
hidden	patient_id	Medic ID								
hidden	name	Patient Name								
begin group	parent	Parent								
hidden	_id	Family UUID								
begin group	parent	Grandparent								
hidden	_id	CHW Area UUID								
hidden	name	CHW Name								
hidden	phone	CHW Phone								
begin group	parent	Great Grandparent								
hidden	_id	CU UUID								
end group										
end group										
end group										
end group										
end group										
calculate	patient_id						../inputs/contact/_id			
calculate	patient_name						../inputs/contact/name			
begin group	group_assessment	Assessment								
select_one yes_no	cough	Does ${patient_name} have a cough?	yes							
select_one symptom_duration	cough_duration	How long has the cough lasted?	yes	${cough} = 'yes'						
select_one yes_no	fever	Does ${patient_name} have a fever?	yes							
select_one yes_no	diarrhea	Does ${patient_name} have diarrhea?	yes							
end group										
end group
{{< /copytable >}}

### 2. Define the Choices

Copy everything inside the code block below, then paste into cell A1 of a new sheet named `choices`:

{{< copytable id="choices" label="Copy choices sheet" >}}
list_name	name	label
yes_no	yes	Yes
yes_no	no	No
symptom_duration	3	3 days or less
symptom_duration	7	4 - 7 days
symptom_duration	13	8 - 13 days
symptom_duration	14	14 days or more
{{< /copytable >}}

### 3. Define the XLS Settings

Copy everything inside the code block below, then paste into cell A1 of a new sheet named `settings`:

{{< copytable id="settings" label="Copy settings sheet" >}}
form_title	form_id	version	style	path	instance_name	default_language
Assess patient	assessment	1	pages	data		en
{{< /copytable >}}

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

> [!IMPORTANT] 
> Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance.

## Next steps

- *[Setting Form Properties]({{< ref "building/forms/form-properties/" >}})*
