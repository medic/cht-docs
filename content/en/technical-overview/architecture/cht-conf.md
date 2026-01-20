---
title: "CHT Conf"
linkTitle: "CHT Conf"
weight: 3
description: >
  Manage and configure apps built using the CHT Core Framework
aliases:
   - /core/overview/cht-conf/
   - /technical-overview/cht-conf/ 
---

[CHT Conf](https://github.com/medic/cht-conf) is a command-line interface tool to manage and configure apps built using the [CHT Core Framework](https://github.com/medic/cht-core).

## Installation
Read more about setting up [CHT Conf](/community/contributing/code/cht-conf).

## Currently Supported
The different items that are supported by CHT Conf include:

### Settings
* Compile app settings from:
    - tasks
    - rules
    - schedules
    - contact-summary
    - purge
* App settings can also be defined in a more modular way by having the following files in app_settings folder:
    - base_settings.json
    - forms.json
    - schedules.json
* Backup app settings from server
* Upload app settings to server
* Upload resources to server
* Upload custom translations to the server
* Upload privacy policies to server
* Upload branding to server
* Upload partners to server

### Forms
* Fetch from Google Drive and save locally as `.xlsx`
* Backup from server
* Delete all forms from server
* Delete specific form from server
* Upload all app or contact forms to server
* Upload specified app or contact forms to server

### Managing data and images
* Convert CSV files with contacts and reports to JSON docs
* Move contacts by downloading and making the changes locally first
* Upload JSON files as docs on instance
* Compress PNGs and SVGs in the current directory and its subdirectories

### Editing contacts across the hierarchy.
To edit existing couchdb documents, create a CSV file that contains the ids of the document you wish to update, and the columns of the document attribute(s) you wish to add/edit. By default, values are parsed as strings. To parse a CSV column as a JSON type.

| Parameter         | Description                                                                                                                                            | Required                |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|
| column(s)         | Comma delimited list of columns you wish to add/edit. If this is not specified all columns will be added.                                              | No                      |
| docDirectoryPath  | This action outputs files to local disk at this destination                                                                                            | No. Default `json-docs` |
| file(s)           | Comma delimited list of files you wish to process using edit-contacts. By default, contact.csv is searched for in the current directory and processed. | No.                     |
| updateOfflineDocs | If passed, this updates the docs already in the docDirectoryPath instead of downloading from the server.                                               | No.                     |

#### Example
1. Create a contact.csv file with your columns in the csv folder in your current path. The documentID column is a requirement. The documentID column contains the document IDs to be fetched from couchdb.

   | documentID  | is_in_emnch:bool | 
   |-------------|------------------|
   | documentID1 | false            |
   | documentID2 | false            |
   | documentID3 | true             |

2. Use the following command to download and edit the documents:
   ```shell
   cht --instance=*instance* edit-contacts -- --column=*is_in_emnch* --docDirectoryPath=*my_folder*
   ```
   or this one to update already downloaded docs:
   ```shell
   cht --instance=*instance* edit-contacts -- --column=*is_in_emnch* --docDirectoryPath=*my_folder* --updateOfflineDocs
   ```

3. Then upload the edited documents using the _**upload-docs**_ command.
   ```shell
   cht --instance=*instance* --upload-docs
   ```

## Project layout

This tool expects a project to be structured as follows:
```cli
example-project/
	.eslintrc
	app_settings.json
	contact-summary.js
	privacy-policies.json
	privacy-policies/
	    language1.html
	    …
	purge.js
	resources.json
	resources/
		icon-one.png
		…
	targets.js
	tasks.js
	task-schedules.json
	forms/
		app/
			my_project_form.xlsx
			my_project_form.xml
			my_project_form.properties.json
			my_project_form-media/
				[extra files]
				…
		contact/
			person-create.xlsx
			person-create.xml
			person-create-media/
				[extra files]
				…
		…
		…
	translations/
		messages-xx.properties
		…
```

If you are starting from scratch you can initialise the file layout using the initialise-project-layout action:
```shell
cht initialise-project-layout
```

### Derived configs

Configuration can be inherited from another project, and then modified.  This allows the `app_settings.json` and contained files (`task-schedules.json`, `targets.json` etc.) to be imported, and then modified.

To achieve this, create a file called `settings.inherit.json` in your project's root directory with the following format:
```json
{
	"inherit": "../path/to/other/project",
	"replace": {
		"keys.to.replace": "value-to-replace-it-with"
	},
	"merge": {
		"complex.objects": {
			"will_be_merged": true
		}
	},
	"delete": [
		"all.keys.listed.here",
		"will.be.deleted"
	],
	"filter": {
		"object.at.this.key": [
			"will",
			"keep",
			"only",
			"these",
			"properties"
		]
	}
}
```
