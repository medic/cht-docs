---
title: "How to bulk load users"
linkTitle: "Bulk Load Users"
weight: 15
description: >
  How to create users in bulk
aliases:
  -    /core/guides/users-bulk-load
  - /apps/guides/data/users-bulk-load/
relatedContent: >
  building/guides/data/csv-to-docs
  building/reference/api/#post-apiv2users
  building/features/admin

---

{{< callout >}}
 The bulk user upload feature is available in 3.16.0 and later versions of the CHT. As of CHT 3.17.0, when creating both a contact and a place, the contact will be set as the default contact of the place. User creation can be scripted using the [CHT API]({{< relref "building/reference/api#post-apiv2users" >}}) directly or using the [`cht-conf` tool](https://github.com/medic/cht-conf), which is detailed in the [CSV-to-Docs guide]({{< relref "building/guides/data/csv-to-docs" >}}).
 This feature can be used to load as many users as possible but works optimally with chunks of 1,000 users or less.
{{< /callout >}} 

Steps to bulk load users:

1. Using Google Sheets, populate a spreadsheet with the users to be imported.
2. Import the new users using the Admin UI in the CHT.
3. Handle any errors that may occur during importation.
4. When done, you will have created new users, new contacts and new places, all of which are correctly associated in CouchDB with the correct UUIDs.

## Workbook Instructions
The workbook contains a varying number of spreadsheets depending on the hierarchy in question. Users with different roles are placed in different spreadsheets as shown in the templates below. For example when creating users with chw and chw_supervisor roles, you will have "contact.chw", "contact.chw_VLOOKUP", "contact.chw_supervisor" and "contact.chw_supervisor_VLOOKUP" spreadsheets. These pair per role spreadsheets contain actual data on users and parent place data respectively.

There is another spreadsheet, "place.type_VLOOKUP", which is required when creating user accounts, contacts and their places. This spreadsheet defines the name and type of places in your hierarchy and should match those in the app_settings.json file. Note that you will need to create the parent place before importing the users.

To get started, there are three different workbook templates available that are compatible with the `default` configuration of the CHT, they cater for use cases that you might encounter when creating users in bulk.  You will notice some columns have an `:excluded` suffix. These are columns that are ignored by the API and allow addition of autocomplete and data validation within the spreadsheet to make it easier to work with.

Click on any of the use cases below to make a copy of the spreadsheet for the use case in question:
- [when you want to create user accounts only](https://docs.google.com/spreadsheets/d/1zlvF5cWnV2n1rax1bAO2hSBCIxgD0c-5tZ-yh96kwws/copy)
- [when you want to create user accounts and their contacts](https://docs.google.com/spreadsheets/d/1y6wYqRIWiC2QZA7NaWfolP_Wf9FnSahjYHlL3iDYeJ4/copy)
- [when you want to create user accounts, their contacts and their places](https://docs.google.com/spreadsheets/d/1yUenFP-5deQ0I9c-OYDTpbKYrkl3juv9djXoLLPoQ7Y/copy)

We will use the second use case to create user accounts and their contacts in the example below.
## Contact Spreadsheet Instructions

The spreadsheet interfaces with the [`POST /api/v1/users` API]({{< relref "building/reference/api#get-apiv1users" >}}) which works as though passing a JSON array of users. Rows in the spreadsheet represent a user while columns represent properties of the user.
Each column in the spreadsheet maps to an object property understood by the API to insert the users into the database. These properties can be found in [the Users API documentation]({{< relref "building/reference/api#post-apiv1users" >}}).

Contact spreadsheets are named according to the user role, for example when creating users who are chws and others who are chw_supervisors, the following contact spreadsheets are populated respectively: "contact.chw" and "contact.chw_supervisor".

There are three sections to the contact spreadsheet:

{{< figure src="users-spreadsheet.png" link="users-spreadsheet.png" caption="Bulk user import spreadsheet with areas labeled" >}}

#### **Spreadsheet Area 1**

These three columns are where you paste the results after running an import. See step 8 in "Importing users example" [below](#importing-users-example).
1. `import.status:excluded`: This field can have three values. Over time, they should all be `imported` or `skipped` as you will have processed all users on the list:
    * `imported`- This user has already been successfully imported
    * `skipped` - This user was skipped
    * `error` - Contains errors that were encountered during importation. See `import.message:excluded` field for more information
2. `import.message:excluded`: The status of the last import. For example, `Imported successfully` or `Username 'mrjones' already taken`
3. `import.username:excluded`: Use this column to ensure you're matching the response with the correct user in the `contact.username` to the right

#### **Spreadsheet Area 2**

This is where you enter your user data and contains the following columns:
1. `username`: username used to log into the application
2. `Parent-Place:excluded`: existing parent place of the new user place. A drop-down populated from contact vlookup spreadsheet
3. `User-Place-Type:excluded`: type of user place to be created. A drop-down populated from place vlookup spreadsheet
4. `contact.first_name`: first name of the new user
5. `contact.last_name`: last name of the new user
6. `contact.sex`: sex of the new user
7. `contact.phone`: phone number of the  new user
8. `email`: email of the  new user (optional field)
9. `contact.meta.created_by`: this column contains metadata on the person who created the user (optional field)
10. `token_login`: whether the user should be sent login credentials via SMS as a link
11. `contact.type` or `place.type`: when creating a user, is logged as contact. In the case of the [default config](https://github.com/medic/cht-core/tree/master/config/default/), possible values are district_hospital, health_center, clinic, and person
12. `contact.contact_type` or `place.contact_type`: defines the type of contact being created depending on the deployment's configuration. It should match one of the contact types defined in the config's contact_types field
13. `type`: role of the contact

#### **Spreadsheet Area 3**

Columns in this area are automatically populated by the spreadsheet logic.
While this is needed to create a user, it is intentionally not editable and you will see this error when you try to edit data:

{{< figure src="users-spreadsheet-warning.png" link="users-spreadsheet-warning.png" caption="Bulk user import spreadsheet warning" >}}

However, for the mapping to occur as expected, you may edit the fields `contact.role`, `contact.contact_type`, `place.contact_type` and `type` to match your deployment's configuration.

Do not edit column headers in row 1. They are needed by the CHT to identify which data is in it. Changing the names will result in errors or missing data in the CHT.

### Passwords

Passwords are automatically generated by the spreadsheet. Use caution when editing rows marked as `imported` in the Import.status:excluded column.
For example, if a user was imported two weeks ago and the token_login is set to `TRUE` and then back to `FALSE`,
the password will be regenerated and thus be different from the one the user is using to login.
If a change is made, you can use Google Sheets history ("File" -> "Version History") to retrieve the old value.

## Importing users example

1. Create a copy of [this spreadsheet](https://docs.google.com/spreadsheets/d/1yUenFP-5deQ0I9c-OYDTpbKYrkl3juv9djXoLLPoQ7Y/copy).
Give it a descriptive name and note its location in Google Drive. You will always come back to your copy of this Sheet whenever you want to add a set of users.

2. Copy the "contact.chw" and "contact.chw_VLOOKUP" spreadsheets so that you have a set of the pair per level of your hierarchy.
If your hierarchy was "Central -> Supervisor -> CHW", you would have 3 pairs (6 spreadsheets total). Be sure each spreadsheet is named accurately.

3. Open the spreadsheet and populate your list of parent places that you'd like to use for your users.
In this example the "Penda Ouedraogo" place has gotten an updated UUID starting with "bcc"
{{< figure src="importing-users-populate-parents-places.png" link="importing-users-populate-parents-places.png" caption="populate your list of parent places" >}}

4. Add the users you would like to create
{{< figure src="importing-users-entering-data.png" link="importing-users-entering-data.png" caption="entering data into the spreadsheet" >}}

5. Export spreadsheet into CSV
{{< figure src="importing-users-export-csv.png" link="importing-users-export-csv.png" caption="export spreadsheet into CSV" >}}

6. Access the [Admin Console]({{< ref "building/features/admin/" >}}) of your instance, go to "Users", click "Import from file" and select your CSV file you just exported
{{< figure src="importing-users-import-csv.png" link="importing-users-import-csv.png" caption="import CSV into CHT" >}}

7. Be patient during import (testing showed ~0.4 seconds per record up to 500 records)
{{< figure src="importing-users-import-progress.png" link="importing-users-import-progress.png" caption="progress feedback during CSV import" >}}

8. Download the status file
{{< figure src="importing-users-download-status-file.png" link="importing-users-download-status-file.png" caption="download the status file" >}}

9. Transfer errors back into spreadsheet. Make sure you copy all three columns A, B and C.
The usernames in column C must match those in column D of the original spreadsheet.
{{< figure src="importing-users-transfer-errors.png" link="importing-users-transfer-errors.png" caption="transfers errors back into spreadsheet" >}}

10. Fix the errors and export to CSV
{{< figure src="importing-users-fix-errors.png" link="importing-users-fix-errors.png" caption="fix errors and export to CSV" >}}

{{< figure src="importing-users-export-csv.png" link="importing-users-export-csv.png" caption="export spreadsheet into CSV" >}}

11. Import the fixed CSV, noting already import rows are skipped
{{< figure src="importing-users-import-fixed-csv.png" link="importing-users-import-fixed-csv.png" caption="import the fixed CSV" >}}

12. Deliver credentials to phone or to CHW, using care to not overshare the login and password

## Adding new places

Over time, new places will be added to different levels of the hierarchy.
You will need to manually add these new places to the spreadsheet so that you can add users to the new places.

1. Navigate in the CHT to the new site. In this case, it is "Site Dieco" that has been added (item 1). Copy the 36 character UUID from the URL (item 2).

{{< figure src="adding-places-cht-new-site.png" link="adding-places-cht-new-site.png" caption="navigate in the CHT to the new site" >}}

2. Open your existing Google Spreadsheet with your users. Find the hierarchy level you added your new site.
In this case "Site Dieco" is a CHW place, so we'll go to the "contact.c62_chw_VLOOKUP" spreadsheet.
Add some new rows at the bottom (item 1), enter the new place name in column A (item 2) and paste the UUID in column B (item 3)

{{< figure src="adding-places-existing-spreadsheet.png" link="adding-places-existing-spreadsheet.png" caption="open your existing spreadsheet" >}}

## Configuring custom places types

The third use case mentioned in the [workbook instructions section]({{< relref "#workbook-instructions" >}}) links to a Google Sheets to create user places alongside their account and their contact. This works out of the box with the `default` CHT configuration but will require adjustments to be made in the `place.type_VLOOKUP` spreadsheet when dealing with a CHT configuration with custom places types.

The `place.type_VLOOKUP` spreadsheet has two columns that contain the name of the places types set in the [`.contact_types[]`]({{< relref "building/reference/app-settings/hierarchy" >}}) property of your `app_settings.json` and their respective IDs. The place type name is used by the `User-Place-Type:excluded` column in the `contact.chw` spreadsheet to provide a user-friendly way to pick a place with autocompletion. You will want to keep this spreadsheet in sync with your CHT configuration to create users' places.

## Trouble shooting

### "Wrong type, this is not a person."

If you have miss-matched contact types, you will get an error upon import:

> **Wrong type, this is not a person.**

As of CHT 3.7.0, you're [allowed to declare different contact types]({{< relref "building/reference/app-settings/hierarchy#app_settingsjson-contact_types" >}}) in your `app_settings.json`. If you have populated the `.contact_types[]` property in your JSON, you will need to update the automatic value of the `contact.contact_type` column.  The default value is:

```shell
=if(NOT(ISBLANK(D2)),"person","") 
```

Often times numbers are used in `app_settings.json` to declare `contact_types` matching numerical names from `place_hierarchy_types`. It might look like this:

```json
  "contact_types": [
    {
      "id": "c52_supervisor",
      "name_key": "contact.type.c52_supervisor",
      "group_key": "contact.type.c52_supervisor.plural",
      "create_key": "contact.type.c52_supervisor.new",
      "edit_key": "contact.type.c52_supervisor.edit",
      "icon": "icon-manager",
      "create_form": "form:contact:c52_supervisor:create",
      "edit_form": "form:contact:c52_supervisor:edit",
      "person": true
    },
    {
      "id": "c62_chw",
      "name_key": "contact.type.c62_chw",
      "group_key": "contact.type.c62_chw.plural",
      "create_key": "contact.type.c62_chw.new",
      "edit_key": "contact.type.c62_chw.edit",
      "parents": [
        "c60_chw_site"
      ],
      "icon": "icon-chw",
      "create_form": "form:contact:c62_chw:create",
      "edit_form": "form:contact:c62_chw:edit",
      "person": true
    }
  ]
```

In this case, you would need to change the value of the `contact.contact_type` column to match your new types. Based on the `contact.types` above, a CHW would be declared like this now:

```shell
=if(NOT(ISBLANK(D2)),"c62_chw","") 
```

Be sure you copy this updated formula for all rows in the `contact.contact_type` column.

### Access denied

If a user you successfully created can not log in because they see an error:

{{< figure src="access.denied.png" link="access.denied.png" caption="Access denied - You have insufficient privileges to view this page. Talk to an administrator to increase your privileges" >}}

A possible cause of this is you have a bad role defined in your spreadsheet that doesn't match your configuration. For example, the the default role should be `chw_supervisor`, but here we see garbage characters were accidentally added.  While the user was created without errors, they'll see the above error when they try to log in:

{{< figure src="bad.type.png" link="bad.type.png" caption="Bad type declared in spreadsheet causes the user to have no role" >}}

You may manually fix any users you imported to have the correct role.  To ensure future users have valid roles to log in with, check the `/admin/#/authorization/roles` area on your CHT instance for valid roles:

{{< figure src="valid.roles.png" link="valid.roles.png" caption="CHT admin showing a list of valid roles in the Role column on the left" >}}
