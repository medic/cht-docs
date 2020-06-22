---
title: "contact"
linkTitle: "contact"
weight: 5
description: >
  **Contact Forms**: Used for creating and editing people and places
relevantLinks: >
  docs/apps/features/contacts
  docs/apps/concepts/hierarchies
keywords: hierarchy contacts contact-forms
---

Contact forms are used for the creation and editing of each contact. The type associated to people is `person`, and there are three types of places corresponding to levels in the app: `district_hospital` > `health_center` > `clinic`. The display names for the place levels can be changed via [custom translations]({{< ref "apps/reference/translations" >}}), and wherever they are defined in the contact forms. Each contact type has its own XForm where it defines the fields that it wants to store/edit for the contact:

    - /forms/contact/person-create.xml
    - /forms/contact/person-edit.xml
    - /forms/contact/clinic-create.xml
    - /forms/contact/clinic-edit.xml
    - /forms/contact/health_center-create.xml
    - /forms/contact/health_center-edit.xml
    - /forms/contact/district_hospital-create.xml
    - /forms/contact/district_hospital-edit.xml
    
To create the above XForm files it is recommended to use XLSForms. Also, if the contact forms will be similar for all places, you can use a `PLACE_TYPE-create.xlsx` file for creation, a `PLACE_TYPE-edit.xlsx` for editing, and have `medic-conf` generate the individual forms. For this you would also need `forms/contact/places.json`, where you would define the place names. From the XLSForm you can refer to the place type with `PLACE_TYPE`, and the place name with `PLACE_NAME`. You can even use the place type for conditional behaviour in the form. The base files needed would therefore be:


    - /forms/contact/person-create.xlsx
    - /forms/contact/person-edit.xlsx
    - /forms/contact/PLACE_TYPE-create.xlsx
    - /forms/contact/PLACE_TYPE-edit.xlsx
    - /forms/contact/places.json

Here is an example of a `places.json` files: 

    {
      "clinic": "Village Clinic",
      "health_center": "Health Center",
      "district_hospital": "District Hospital"
    }

Convert and build the contact forms into your application using the `convert-contact-forms` and `upload-contact-forms` actions in `medic-conf`.

> `medic-conf --local convert-contact-forms upload-contact-forms`
