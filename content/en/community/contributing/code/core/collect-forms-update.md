---
title: "Update Collect Forms Remotely"
linkTitle: "Remote Collect Update"
weight: 
description: >
  How to do over-the-air updates of forms in Collect
  
aliases:
   - /apps/guides/updates/collect-forms-update
<<<<<<<< HEAD:content/en/building/guides/collect-forms-update.md
   - /building/guides/updates/collect-forms-update/
========
   - /building/guides/updates/collect-forms-update
>>>>>>>> origin/main:content/en/community/contributing/code/core/collect-forms-update.md
---

To do over the air Medic Collect form updates via HTTP rather than sending APKs which have a long manual install process, follow the steps below:

{{% steps %}}

### Step 1

Have your xls forms ready in the folder. 
- They should use underscore as name separators. e.g form_name.xlsx
- They should have `form_id` and `name`  properties in the settings

{{< figure src="xform_name_settings.png" link="xform_name_settings.png" caption="Name property" >}}

### Step 2

Upload the forms to the instance using `cht-conf` Using the `upload-collect-forms` [action](https://github.com/medic/cht-conf/blob/master/src/cli/supported-actions.js) as shown below.
```shell
cht --instance=user:pass@instancename.app.medicmobile.org upload-collect-forms
```

### Step 3

Go to the Collect App. Delete All forms then go to `Get Blank Form` and select all the forms you need.

{{% /steps %}}

# Troubleshooting

When you go to `Get Blank Forms` and instead of getting a list of the forms available, you get a pop-up error which has a portion of this message instead

```shell
...OpenRosa Version 1.0 standard: Forms list entry 1 is missing one or more tags: formId, name or downloadUrl
```

This means you probably uploaded a XLS file without a `name` or `form_id` property. To find out which form is missing that, use this command:

```shell
curl -vvvv -H "x-openrosa-version: 1" http://user:pass@host:port/api/v1/forms
```

Should bring a list like this one:

{{< figure src="xform_list.png" link="xform_list.png" caption="Xform List" >}}

Go through the list and see which form has  a missing `<name>` or `<formID>` property. Add it and reupload the forms using `cht-conf` again.
