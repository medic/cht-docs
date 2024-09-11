---
title: "Contact and User Management - Part 2"
linkTitle: Contacts + Users 2
weight: 4
description: >
  Creating and editing contacts and users with cht-conf
relatedContent: >
  building/tutorials/contact-and-users-1
  core/overview/db-schema
  building/guides/data/users-bulk-load
  building/concepts/users
---

{{% pageinfo %}}
In this tutorial you will learn how to create and edit contacts and their associated users in the CHT application using cht-conf. If you haven't already, have a look at [part 1]({{% ref "building/tutorials/contact-and-users-1" %}}) of this tutorial for a useful overview of key concepts.
{{% /pageinfo %}}

## Brief Overview of Key Concepts

[*cht-conf*](https://github.com/medic/cht-conf) is a command-line interface tool to manage and configure your apps built using the Core Framework of the Community Health Toolkit.

See more [key concepts]({{% ref "building/tutorials/contact-and-users-1#brief-overview-of-key-concepts" %}}) in part 1 of this tutorial.

## Required Resources

You should have a functioning CHT instance and have cht-conf installed locally. Read [How to set up a CHT local configuration environment]({{% ref "building/tutorials/local-setup" %}})

## Implementation Steps

In these steps you are going to create a Health Facility, CHW Areas, primary contacts for the CHW Areas, and their associated users.


### 1. Create Health Facilities (using cht-conf's csv-to-docs and upload-docs features)

To create contacts and their associated users with cht-conf, you will need to create a CSV file with the information of the contacts and the users that you would like to create. The name of the file determines the type of doc created for rows contained in the file.

For example, file named `place.district_hospital.csv` adds the property `"type":"district_hospital"` and a file named `person.clinic.csv` add the property `"type":"person"`

Create a CSV file named `place.district_hospital.csv` and add the details of the Health Facilities you would like to create.

| name                   |
| ---                    |
| Nairobi South Facility |
| Nairobi West Facility  |
| Nairobi East Facility  |

Save this file to a folder name `csv` in your project's base directory.

Open terminal or command line. `cd` to your project's base directory and then run the command

```zsh
cht csv-to-docs
```

This will convert rows of the CSV files from the `csv` folder to JSON docs that are stored in a `json-docs` folder.

To upload the JSON docs to your local test instance, run the command

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs upload-docs
```

Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance.

<br clear="all">

 *****

### 2. Create CHW Areas, CHW Contacts and Users (using cht-conf's create-users feature)

Next you are going to create CHW Areas for the Health Facilities you created in the step above along with the CHW contacts and users for these CHW Areas.

Create a CSV file named `users.csv` and add the details of the Users, CHW contacts, and CHW Areas you would like to create. Save this file in the base project directory.

| username | password | roles | fullname | phone | contact.name | contact.phone | contact.sex | contact.age | place.type | place.name | place.parent |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mmutiso | q3Z5-vH5 | district_admin | Mary Mutiso | 0712345678 | Mary Mutiso | 0712345678 | Female | 36 | health_center | Mary Mutiso's Area | `<facility uuid>` |

<br clear="all">	

{{< figure src="facility-uuid.png" link="facility-uuid.png" class="right col-6 col-lg-8" >}}	

The value `place.parent` is the uuid of the Facility to which the CHW Area belongs to. You can get this value by selecting the Health Facility in the webapp and copying the last portion of the url.

<br clear="all">

Run the command

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs create-users
```

This will create the CHW Area, the CHW contact, and the user that the CHW will use to log into the application.

## Frequently Asked Questions

- [Can one person belong to multiple places in the same hierarchy?](https://forum.communityhealthtoolkit.org/t/can-one-person-belong-to-multiple-places-in-the-same-hierarchy/101)
