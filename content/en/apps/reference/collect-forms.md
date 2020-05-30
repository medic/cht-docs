---
title: "Defining Collect Forms"
linkTitle: "Collect Forms"
weight: 5
description: >
  Instructions for defining forms used in Medic Collect
keywords: collect-forms collect
---

ODK XForms are used to render forms in the Medic Collect Android app. These forms cannot use any Medic-specific XForm notations. All Medic Collect forms are processed as SMS (even when submitted over a wifi) therefore a corresponding JSON form with matching fields is used to interpret the incoming report.

Collect forms must be in the `forms/collect` folder to be processed by [`medic-conf`](https://github.com/medic/medic-conf)'s `convert-collect-forms` and `upload-collect-forms` actions. Once uploaded to the server, they can be downloaded by the Medic Collect app. These forms can also be included in Medic Collect builds for users without a data connection to get forms.

XForms require a couple minor changes to be compatible with Medic Collect so that they can properly be received by a Medic instance. The changes can be done either manually in the XForm's XML, or automatically with XLSForm forms using `medic-conf`.

### Automatic changes with XLSForms
If using a [XLSForm](http://xlsform.org/) and using [`medic-conf`](https://github.com/medic/medic-conf) to convert to XForm, the necessary fields will be automatically added to the resulting XForm. You can override the default prefix and separator by declaring `sms_keyword` and `sms_seperator` respectively in the Settings tab.

### Manual changes in XForm
Collect forms need `prefix` and `delimiter` values added to the XForm's XML. This is done where the form ID is declared in the instance's data model. For example, the following:
```
<instance>
   <data id="myform" >
   ...
```

becomes:
```
<instance>
   <data id="myform" prefix="J1!FORM_CODE!" delimiter="#">
   ...
```

Note that `FORM_CODE` should be replaced with the form code as defined in the JSON forms version of the form. If the form code is `ABCD` the prefix value would be `J1!ABCD!`, resulting in `prefix="J1!ABCD!"`. In case you are curious, the `J1` lets the Medic Mobile server know that version 1 of the JavaRosa parser should be used on the incoming SMS.

