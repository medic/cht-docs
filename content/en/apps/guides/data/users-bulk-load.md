---
title: "How to bulk load users"
linkTitle: "Bulk Load Users"
weight: 15
description: >
  How to create users in bulk
aliases:
  -    /core/guides/users-bulk-load
relatedContent: >
  apps/guides/data/csv-to-docs
  apps/reference/api/#post-apiv2users
  apps/features/admin

---

Steps to bulk load users:

1. Using Google Sheets, populate a spreadsheet with the users to be imported.
2. Import the new users using the Admin UI in the CHT.
3. Handle any errors that may occur during importation.
4. When done, you will have created new users, new contacts and new places, all of which are correctly associated in CouchDB with the correct UUIDs.

The bulk user upload feature is available in 3.16.0 and later versions of the CHT.As of CHT 3.17.0, when creating both a contact and a place, the contact will be set as the default contact of the place.User creation can be scripted using the [CHT API]({{< relref "apps/reference/api#post-apiv2users" >}}) directly or using the [`cht-conf` tool](https://github.com/medic/cht-conf), which is detailed in the [CSV-to-Docs guide]({{< relref "apps/guides/data/csv-to-docs" >}}).

This feature can be used to load as many users as possible but works optimally with chunks of 1,000 users or less.

## Spreadsheet Instructions

The spreadsheet interfaces with the [this API]({{< relref "apps/reference/api#get-apiv1users" >}}) which works as though passing a JSON array of users. Rows in the spreadsheet represent a user while columns represent properties of the user.
Each column in the spreadsheet maps to an object property understood by the API to insert the users into the database. These properties can be found in [the Users API documentation]({{<relref "apps/reference/api#post-apiv1users" >}}).

The spreadsheet contains a varying number of worksheets depending on the hierarchy in question.Users with different roles are placed in different worksheets as shown in the templates below.For example when creating users with chw and chw_supervisor roles, you will have "contact.chw","contact.chw_VLOOKUP","contact.chw_supervisor" and "contact.chw_supervisor_VLOOKUP" worksheets.These pair per role worksheets contain actual data on users and parent place data respectively.Note that you will need to create the parent place before importing the users.

You will also have another optional worksheet, "place.type_VLOOKUP", that defines the name and type of places in your hierarchy.

To get started, there are three different spreadsheet templates available that are compatible with the `default` configuration of the CHT, they cater for use cases that you might encounter when creating users in bulk.  You will notice some columns have an `:excluded` suffix. These are columns that are ignored by the API and allow addition of autocomplete and data validation within the spreadsheet to make it easier to work with.

Click on any of the use cases below to make a copy of the spreadsheet for the use case in question:
- [when you want to create user accounts only](https://docs.google.com/spreadsheets/d/1zlvF5cWnV2n1rax1bAO2hSBCIxgD0c-5tZ-yh96kwws/copy)
- [when you want to create user accounts and their contacts](https://docs.google.com/spreadsheets/d/1y6wYqRIWiC2QZA7NaWfolP_Wf9FnSahjYHlL3iDYeJ4/copy)
- [when you want to create user accounts, their contacts and their places](https://docs.google.com/spreadsheets/d/1yUenFP-5deQ0I9c-OYDTpbKYrkl3juv9djXoLLPoQ7Y/copy)

We will use the second use case to create user accounts and their contacts as an example in the instructions below.

### Spreadsheet

Before using the bulk user upload feature, please familiarize yourself with the spreadsheet used to manage the users before importing it to the CHT.
There are three sections to the spreadsheet:

![bulk user import spreadsheet with areas labeled](users-spreadsheet.png)

#### **Spreadsheet Area 1**

This area contains three columns that are pasted after running an import as shown in the importing users section below.
1. `import.status:excluded`: This field can have three values. Over time, they should all be `imported` or `skipped` as you will have processed all users on the list:
    <ol type="a">
      <li><code>imported</code> - This user has already been successfully imported</li>
      <li><code>skipped</code> - This user was skipped</li>
      <li><code>error</code> - There was an error importing see import.message:excluded field for more information</li>
    </ol>
3. `import.message:excluded`: The status of the last import. For example, `Imported successfully` or `Username 'mrjones' already taken`
4. `import.username:excluded`: Use this column to ensure you're matching the response with the correct user in the contact.username to the right

#### **Spreadsheet Area 2**

Enter all the data in the columns in this area. Data will be automatically copied for you to columns in area 3.

#### **Spreadsheet Area 3**

Do not edit or enter data here. All columns are automatically populated by the spreadsheet logic.
While this is needed to create a user, it is intentionally not editable and you will see this error when you try to edit data:

![bulk user import spreadsheet warning](users-spreadsheet-warning.png)

Do not edit column headers in row 1. They are needed by the CHT to identify which data is in it. Changing the names will result in errors or missing data in the CHT.

### Passwords

Passwords are automatically generated by the spreadsheet. Use caution when editing rows marked as `imported` in the Import.status:excluded column.
For example, if a user was imported two weeks ago and the token_login is set to `TRUE` and then back to `FALSE`,
the password will be regenerated and thus be different from the one the user is using to login.
If a change is made, you can use Google Sheets history ("File" -> "Version History") to retrieve the old value.

## Importing Users

1. Create a copy of [this spreadsheet](https://docs.google.com/spreadsheets/d/1yUenFP-5deQ0I9c-OYDTpbKYrkl3juv9djXoLLPoQ7Y/copy).
Give it a descriptive name and note its location in Google Drive. You will always come back to your copy of this Sheet whenever you want to add a set of users.

2. Copy the "contact.chw" and "contact.chw_VLOOKUP" worksheets so that you have a set of the pair per level of your hierarchy.
If your hierarchy was "Central -> Supervisor -> CHW", you would have 3 pairs (6 worksheets total). Be sure each worksheet is named accurately.

3. Open the spreadsheet and populate your list of parent places that you'd like to use for your users.
In this example the "Penda Ouedraogo" place has gotten an updated UUID starting with "bcc"
![populate your list of parent places](importing-users-populate-parents-places.png)

4. Add the users you would like to create
![entering data into the spreadsheet](importing-users-entering-data.png)

5. Export spreadsheet into CSV
![export spreadsheet into CSV](importing-users-export-csv.png)

6. Access the [Admin Console]({{< ref "apps/features/admin/" >}}) of your instance, go to "Users", click "Import from file" and select your CSV file you just exported
![import CSV into CHT](importing-users-import-csv.png)

7. Be patient during import (testing showed ~0.4 seconds per record up to 500 records)
![progress feedback during CSV import](importing-users-import-progress.png)

8. Download the status file
![download the status file](importing-users-download-status-file.png)

9. Transfers errors back into spreadsheet. Make sure you copy all three columns A, B and C.
The usernames in column C must match those in column D of the original spreadsheet.
![transfers errors back into spreadsheet](importing-users-transfer-errors.png)

10. Fix the errors and export to CSV
![fix errors and export to CSV](importing-users-fix-errors.png)
<br />
<br />
![export spreadsheet into CSV](importing-users-export-csv.png)

11. Import the fixed CSV, noting already import rows are skipped
![import the fixed CSV](importing-users-import-fixed-csv.png)

12. Deliver credentials to phone or to CHW, using care to not overshare the login and password

## Adding new places

Over time, new places will be added to different levels of the hierarchy.
You will need to manually add these new places to the spreadsheet so that you can add users to the new places.

1. Navigate in the CHT to the new site. In this case, it is "Site Dieco" that has been added (item 1). Copy the 36 character UUID from the URL (item 2).
![navigate in the CHT to the new site](adding-places-cht-new-site.png)

2. Open your existing Google Spreadsheet with your users. Find the hierarchy level you added your new site.
In this case "Site Dieco" is a CHW place, so we'll go to the "contact.c62_chw_VLOOKUP" worksheet.
Add some new rows at the bottom (item 1), enter the new place name in column A (item 2) and paste the UUID in column B (item 3)
![open your existing spreadsheet](adding-places-existing-spreadsheet.png)

## Trouble shooting

### "Wrong type, this is not a person."

If you have miss-matched contact types, you will get an error upon import:

> **Wrong type, this is not a person.**


As of CHT 3.7.0, you're [allowed to declare different contact types]({{< relref "apps/reference/app-settings/hierarchy#app_settingsjson-contact_types" >}}) in your `app_settings.json`. If you have populated the `.contact_types[]` property in your JSON, you will need to update the automatic value of the `contact.contact_type` column.  The default value is:

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

![Access denied - You have insufficient privileges to view this page. Talk to an administrator to increase your privileges](access.denied.png)

A possible cause of this is you have a bad role defined in your spreadsheet that doesn't match your configuration.  For example, the the default role should be `chw_supervisor`, but here we see garbage characters were accidentally added.  While the user was created without errors, they'll see the above error when they try to log in:

![Bad type declared in spreadsheet causes the user to have no role](bad.type.png)

You may manually fix any users you imported to have the correct role.  To ensure future users have valid roles to log in with, check the `/admin/#/authorization/roles` area on your CHT instance for valid roles:

![CHT admin showing a list of valid roles in the "Role" column on the left](valid.roles.png)
