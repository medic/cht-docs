---
title: "Training Cards Configuration"
linkTitle: "Training Cards Configuration"
weight: 15
description: >
  Deploy in-app training cards for remote training.
keyword: training
relatedContent: >
  building/training/training-cards
  building/training/training-cards-resources/
  building/examples/training
  building/examples/learning-care/
aliases:
   - /building/training/training-cards/
   - /building/guides/training/training-cards/
   - /apps/guides/training/training-cards/
---
_Introduced in 4.2.0_

[Training Cards]({{< relref "building/training/training-cards" >}}) enable remote training from within the CHT by showing a sequence of "cards" containing content provided by App Developers. The content might include information about a newly deployed feature, changes to a [care guide]({{< relref "building/concepts/care-guides" >}}), or simply a reminder about an underused feature or workflow. Enketo forms are used to display the content, and App Developers can specify a start date, duration, and to which [user roles]({{< relref "building/reference/app-settings/user-roles" >}}) the cards should be shown. Like [app forms]({{< relref "building/reference/forms/app" >}}), forms used by training cards will automatically be downloaded to the user’s devices.

{{% alert title="Note" %}} Example training forms are available [here]({{< relref "building/training/training-cards-resources" >}}) and provide a good starting point. {{% /alert %}}

# Step 1: Create the training form

Create an [XLS Form]({{< relref "building/reference/forms/app#xlsform" >}}). In the following example, the training form is called `my_new_feature`, it has some text in the `label::en` column, and some images in the column `media::images` to illustrate the feature.

{{< figure src="step-1-xls-form.png" link="step-1-xls-form.png" class="left col-10" >}}

<br clear="all">

# Step 2: Add the form’s ID

Important, define the `form_id` located in the `settings` sheet with the prefix `training:` and add the form name, otherwise the training card won't display. In our example, the `form_id` should be `training:my_new_feature`.

{{< figure src="step-2-xls-form-id.png" link="step-2-xls-form-id.png" class="left col-10" >}}

<br clear="all">

# Step 3: Configure the training form

Create a [properties file]({{< relref "building/tutorials/form-properties#3-define-the-forms-context" >}}) to define the starting date of the training, the number of days it will be active, and the user roles that can access the training. In our example, the file name is `my_new_feature.properties.json` and contains the following properties: 

```
{
  "title": "",
  "context": {
    "start_date": "2023-07-13",
    "duration": 60,
    "user_roles": [ "nurse" ]
  }
}
```

In the example above, the training cards could be shown to any user with the "nurse" role between July 13, 2023 and September 11, 2023 (inclusive). See more information about these configuration settings below: 
| Property | Description |
|---|----|
| "title" | Optional. Enketo’s form title that is displayed under the modal’s header section. Leave this property empty if you don’t need to display a title. |
| "start_date" | Optional. Define the training start day using `yyyy-mm-dd` format. If not defined then the training will start immediately. |
| "duration" | Optional. Number of days this training should be active. If not defined then the training will never expire. |
| "user_roles" | Optional. List of user roles that can access this training. If not defined then all users can access the training. |

{{% alert title="Note" %}} Users with an admin role can access training cards but they need to have a contact associated in the `org.couchdb.user:[user-name]` document from CouchDB. {{% /alert %}}

# Step 4: Add multimedia to the training form

If your training form has images, create a folder with the same name as the form and add `-media` suffix. In our example, the form name is `my_new_feature`, then the folder name should be `my_new_feature-media`.

Inside that new folder, make another one called images and put inside all the `images` that your form needs. See more about [multimedia in forms]({{< relref "building/guides/forms/multimedia" >}}).

# Step 5: Put everything in the right place

In your project configuration folder, place the XLS form, the properties file, and the media folder inside `/forms/training/`. The file structure should look like this:

{{< figure src="step-5-file-structure.png" link="step-5-file-structure.png" class="left col-10" >}}

<br clear="all">

# Step 6: Convert and upload the training form

Open the terminal and use the latest version of the `cht` command line tool to convert and upload the training form:

Convert the form by running this command:

```
cht --url=[instance_url] convert-training-forms -- [form_name]
```

Example:

```
cht --url=http://admin-user:secretpass@my-xyz-project.org convert-training-forms -- my_new_feature
```

Upload the form by running this command:

```
cht --url=[instance_url] upload-training-forms -- [form_name]
```

Example:
```
cht --url=http://admin-user:secretpass@my-xyz-project.org upload-training-forms -- my_new_feature
```

# Step 7: Verify and monitor

At this point the training cards are ready to use. You can verify by logging in with a user that has a valid role assigned for the training card, on the day that the training starts. Remember, to sync the app to see the results (the uncompleted training will display once a day).

Using [telemetry]({{< relref "building/guides/performance/telemetry" >}}) you can monitor user interaction with each training card "set". Some key metrics you can view include:

1. Number of times each user was presented with training cards
2. The date(s) each user was presented with training cards
3. Number of times each user completed a training card set*
4. The min/max amount of time each user spent viewing the training cards
5. The device_id of any device from which the user saw the training cards

_* Training Cards are designed to only be viewed once so this should normally only ever be 0 or 1. It is possible that a user deletes the training "report", in which case they would be presented with training cards again._

Example SQL:

```
SELECT 
	doc#>>'{metadata,user}' AS cht_user,
	doc#>>'{metadata,deviceId}' AS device_id,
	concat(doc#>>'{metadata,year}', '-', doc#>>'{metadata,month}', '-',doc#>>'{metadata,day}')::date AS telemetry_date,
	COALESCE(doc#>>'{metrics,enketo:training:<my_new_feature>:add:render,count}','0')::int AS count_render_training,
	COALESCE(doc#>>'{metrics,enketo:training:<my_new_feature>:add:user_edit_time,count}','0')::int AS count_submit_training,
	COALESCE(doc#>>'{metrics,enketo:training:<my_new_feature>:add:user_edit_time,max}','0')::int/1000 AS max_seconds_on_form,		
	COALESCE(doc#>>'{metrics,enketo:training:<my_new_feature>:add:user_edit_time,min}','0')::int/1000 AS min_seconds_on_form
	
FROM 
    couchdb_users_meta
    
WHERE
	doc->>'type'='telemetry'
	AND doc#>'{metadata}' ? 'day'
	AND doc#>'{metrics}' ? 'enketo:training:<my_new_feature>:add:render'

ORDER BY
	telemetry_date DESC
```
