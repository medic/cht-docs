---
title: "Contact Forms"
linkTitle: "Contact Forms"
weight: 
description: >
  Forms for creating contacts
relatedContent: >
  apps/guides/forms/additional-docs
  apps/guides/forms/multimedia
  apps/guides/forms/app-form-sms
  apps/guides/messaging/gateway/configuration
---
Contact forms are used to create person or place types. Prior to version 3.7, CHT Core supported 4 contact types - 3 place types (clinic, health_center, district_hospital) and one person type (person). From version 3.7, an unlimited number of place and person types are supported. Each contact-type should ideally have two forms; one for creation, and another for editing. 

These forms are stored in the `forms/contact` subfolder of the project config directory. The naming convention used sould be `<contact_type_id-{create|edit}>.xlsx`. The `contact_type_id` prefix should match what's specified in the contact form settings page. 

{{< see-also page="apps/reference/forms/contact" title="Reference Documentation for Contact Forms" >}}

## Person-type forms

These have the simplest structure since we are only creating one thing - the actual contact. Below, we'll look at the structure of the survey and settings sheets since these are critical to ensuring the contact is created correctly at the appropriate part of the hierarchy.

### Survey sheet

![Person forms survey sheet](person-contact-form-survey.png)

Section 1 and 3 are optional. We can pull in details of the logged in user as shown in section 1 and use that to log some metadata on the created documents as shown in section 3.

Section 2 contains the core components of what will be saved in couchdb. The group name needs to match the contact type id specified in app_settings.json (if using the configurable hierarchy) or `person` if using the old-style hierarchy. To learn more about setting up configurable hieararchy, review the [Hierarchy]({{< ref "apps/reference/app-settings/hierarchy" >}}) page. `parent`, `type`, `contact_type` and `name` attributes are mandatory for things to work correctly.

### Settings sheet

![Person forms settings sheet](person-contact-form-settings.png)

We'll need to replace `PLACE_NAME` with a name that corresponds to the created contact type. We'll also need to replace `PLACE_TYPE` with the contact-type id specified in app_settings.json (for configurable ones) or `person`.

## Place-type forms

The main difference between place type and person type forms is that we can optionally create one or more person-type documents one of which can be linked to the created place as a contact.

We'll look at a simple structure of a place forms showing all the necessary components

![Place forms survey sheet](place-contact-form-survey.png)

Section 1 is similar to what has been described earlier for person forms.

Section 2 specifies the contact that will be linked to the place being created. `parent`, `type` and `contact_type` and `name` are mandatory. This also applies to the place-type definition in section 4. `contact` on the other hand is not mandatory for the successful creation of a place. It usually more conventient to create a place and it's primary contact at the same time.

You can also create additional contacts linked to the place being created when you have a structure similar to that shown in section 3.

## Contact-edit forms

The edit forms are much simpler in structure and one can specify only the relevant fields that need editing. The name of the group should match the contact-type being edited and the field names should correspond to what is saved in Couchdb.

![Contact edit form survey sheet](contact-edit-form.png)


## Generic contact forms

If your place forms are similar across all levels of your specified project hiearachy, you can templatise the form creation process. You'll need to create the following files: `place-type.json`, `PLACE_TYPE-create.xlsx` and `PLACE_TYPE-edit.xlsx`.

`place-type.json` maps the place contact-type to a human readable description that will be shown on the app's user interface.

Both `PLACE_TYPE-create.xlsx` and `PLACE_TYPE-edit.xlsx` will contain two placeholder values `PLACE_TYPE` and `PLACE_NAME` which will be replaced by the keys and values specified in `place-type.json` respectively during form conversion. Also, copies of the different place-type forms will be created (if they don't exist) during the form conversion process with `PLACE_TYPE` being replaced with the keys specified in `place-type.json`. 

For examples on how to structure the above files you can have a look at the sample configurations in CHT-core: [default](https://github.com/medic/cht-core/tree/master/config/default/forms/contact) and [standard](https://github.com/medic/cht-core/tree/master/config/standard/forms/contact).
