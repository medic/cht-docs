---
title: "OppiaMobile"
linkTitle: "OppiaMobile"
weight: 
description: >
  Components & configuration
keywords: oppia
relatedContent: >
  apps/features/integrations/oppia
  apps/examples/learning-care
---

The training modules configuration consists of five main components:
- App Forms - Content that the user will interact with;
- Tasks - How forms are presented to the user: how and when the user accesses the forms for input;
- Targets - Shows the progress of the user;
- Contact Summary - Gives a highlight of the modules completed by the user;
- Context - Defines what forms are available to fill from the user’s profile, or available as tasks.
 

### App Forms

The CHT application uses [XLSForms]({{< ref "apps/reference/forms/app" >}}) (app forms), which are a simplified method of setting up form configurations using Excel (or Libre Office Calc, Google sheets, etc). The forms contain the questions/content that the user will interact with, including [web links](https://oppiamobile.readthedocs.io/en/latest/implementers/integration/launch_from_other_app.html) that enable the users to navigate from the CHT application to a specific course in OppiaMobile. App forms are typically created in the `project-folder > forms > app` directory of a project. If the content requires a user to access any form of media, then a media folder for the specific form is created and named after the form. For example, to add video content for a form module_one.xlsx, save the video file to the following directory: `project-folder > forms > app > module_one-media > video`. Once the forms are set up with content, the forms are converted to XForms, which are in xml format. To limit access of App Forms to certain contacts, an App Forms must have a properties file, which defines when and for whom certain forms should be accessed. Once configured, the forms are uploaded to an instance using the medic-configurer with the following commands, which upload specific forms and all forms respectively:

```
Medic-conf --instance=<instance> convert-app-forms upload-app-forms -- <form1> <form2>
```

or

```
Medic-conf --instance=<instance> convert-app-forms upload-app-forms
```

The image below shows an example of an XLSForm configured for the Educational Modules:

{{< figure src="xls-modules.png" link="xls-modules.png" class="left col-12 col-lg-9" >}}

### Integration with OppiaMobile using weblinks

The CHT application makes use of weblinks to direct the user to the OppiaMobile application. Each task in the CHT has a weblink configured to point to a specific course in OppiaMobile. The weblinks are configured in the forms as a button, which, when clicked or tapped, redirects the user accordingly, depending on the installation status of the OppiaMobile application and the respective course. The weblinks are configured in each of the XLSForms that are triggered by a selected task as illustrated in the image below: 

{{< figure src="weblink.png" link="weblink.png" class="left col-12 col-lg-9" >}}

<br clear="all">

```[<span style='background-color: #648af7; color:white; padding: 1em; text-decoration: none;border-radius: 8px; '>Open Oppia Mobile</span>]``` represents the button styling and label.

`https://staging.cha.oppia-mobile.org/view?course=introduction-to-covid-19` represents the weblink, where `course=introduction-to-covid-19` specifies the name of the course to be launched in OppiaMobile as configured on Moodle.

This image shows the outcome of the button configuration:

{{< figure src="weblink-config-outcome.png" link="weblink-config-outcome.png" class="left col-7 col-lg-4" >}}


### Tasks

[Tasks]({{< ref "apps/reference/tasks" >}}) are a set of actions available to users from the task tab. Selecting a task opens up a specific form that completes a workflow. Tasks are available within a given timeframe, after which they expire and the user is unable to view or do them. Tasks are defined as an array of objects in a tasks.js file under the project folder, with each task following the task schema. The required properties of a task include:

- Name - unique identifier of the task;
- Title - displays the workflow to be completed for a contact;
- AppliesTo - determines if the task is emitted per contact or report;
- ResolvedIf - conditions to mark a task as resolved/completed;
- Events - specifies the timeframe of a task;
- Actions - specifies the forms accessed by the user and allows injecting content from previous submissions.

On completing the task configuration, the following command is used to compile and upload  the applications settings (tasks, targets, contact-summary, form properties):

```Medic-conf --instance=<instance> compile-app-settings upload-app-settings```

The image below illustrates an example of a task configured for the educational modules:

{{< figure src="code-tasks.png" link="code-tasks.png" class="left col-12 col-lg-9" >}}

### Targets

The users also have access to [targets]({{< ref "apps/reference/targets" >}}). Targets are a visual representation of the progress and goals of the user. These are app analytics accessed through the targets tab, where the user is able to view how many modules they have completed. Similar to tasks, targets are defined as an array of objects in a targets.js file under the project folder, with each target following the targets schema. The required properties of a target object include:

- Id - unique identifier of the target;
- Translation_key - title displayed for the widget;
- Type - type of numeric representation i.e. count/percentage;
- Goal - denotes how much the user should achieve;
- appliesTo - Determines whether a contact or a report is counted.

On completing the targets configuration, the following command is used to compile and upload  the applications settings (tasks, targets, contact-summary, form properties):

```
Medic-conf --instance=<instance> compile-app-settings upload-app-settings
```

The image below shows a code snippet of an example of a target configured for the educational modules:

{{< figure src="code-targets.png" link="code-targets.png" class="left col-12 col-lg-9" >}}

### Contact Summary

In addition to targets, the user is able to see which specific modules they have completed, and view upcoming tasks and other general information on their profile. The section containing this information is known as the [contact summary]({{< ref "apps/reference/contact-page" >}}). The contact summary has 3 main outputs: cards, fields, and context. Contact summary is defined in the `contact-summary.templated.js` file under the project folder.

Cards are an array of objects which can be customized to group information viewed on a contact’s profile. The required properties of a card include:

- Label - title of the card;
- Fields - content of the card;
  - Field name- title/label of a field;
  - Field value - value displayed for a field.

The image below shows a code snippet of an example of a card configured for the educational modules:

{{< figure src="code-contact-summary.png" link="code-contact-summary.png" class="left col-12 col-lg-9" >}}

<br clear="all">

This image shows the training card configured to show completion status of the educational modules:

{{< figure src="status.png" link="status.png" class="left col-7 col-lg-4" >}}

<br clear="all">

Context provides information to App Forms, which are initiated from the contact's profile page. To show an App Form on a contact’s profile, the form’s expression field in its properties file must evaluate to true for the contact. The context information from the profile is accessible as the variable `summary`. 

The image below shows a code snippet that defines the context variables that can be accessed in the app forms:

{{< figure src="code-forms.png" link="code-forms.png" class="left col-12 col-lg-9" >}}

<br clear="all">

The three variables `hasCompletedModuleOne`, `hasCompletedModuleTwo` and has `CompletedModuleThree` are used in the educational modules app forms to determine whether the user will access the forms through the care guide.

The image below shows an example of an App Form properties file, where the user can only access the form as a care guide if they have completed module one task. This is defined by the phrase `summary.hasCompletedModuleOne` in the expression statement.

{{< figure src="code-properties.png" link="code-properties.png" class="left col-12 col-lg-9" >}}


