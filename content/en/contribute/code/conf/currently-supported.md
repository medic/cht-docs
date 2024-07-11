---
title: "Currently supported"
linkTitle: "Currently supported"
weight: 1
---

# Settings
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

# Forms
* Fetch from Google Drive and save locally as `.xlsx`
* Backup from server
* Delete all forms from server
* Delete specific form from server
* Upload all app or contact forms to server
* Upload specified app or contact forms to server

# Managing data and images
* Convert CSV files with contacts and reports to JSON docs
* Move contacts by downloading and making the changes locally first
* Upload JSON files as docs on instance
* Compress PNGs and SVGs in the current directory and its subdirectories

# Editing contacts across the hierarchy.
To edit existing couchdb documents, create a CSV file that contains the id's of the document you wish to update, and the columns of the document attribute(s) you wish to add/edit. By default, values are parsed as strings. To parse a CSV column as a JSON type, refer to the [Property Types](#property-types) section to see how you can parse the values to different types. Also refer to the [Excluded Columns](#excluded-columns) section to see how to exclude column(s) from being added to the docs.

| Parameter         | Description                                                                                                                                            | Required                |
|-------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|
| column(s)         | Comma delimited list of columns you wish to add/edit. If this is not specified all columns will be added.                                              | No                      |
| docDirectoryPath  | This action outputs files to local disk at this destination                                                                                            | No. Default `json-docs` |
| file(s)           | Comma delimited list of files you wish to process using edit-contacts. By default, contact.csv is searched for in the current directory and processed. | No.                     |
| updateOfflineDocs | If passed, this updates the docs already in the docDirectoryPath instead of downloading from the server.                                               | No.                     |

## Example
1. Create a contact.csv file with your columns in the csv folder in your current path. The documentID column is a requirement. (The documentID column contains the document IDs to be fetched from couchdb.)

    | documentID  | is_in_emnch:bool | 
    |-------------|------------------|
    | documentID1 | false            |
    | documentID2 | false            |
    | documentID3 | true             |

2. Use the following command to download and edit the documents:
   ```
   cht --instance=*instance* edit-contacts -- --column=*is_in_emnch* --docDirectoryPath=*my_folder*
   ```
   or this one to update already downloaded docs
   ```
   cht --instance=*instance* edit-contacts -- --column=*is_in_emnch* --docDirectoryPath=*my_folder* --updateOfflineDocs
   ```
   
3. Then upload the edited documents using the [upload-docs ](#examples) command.
