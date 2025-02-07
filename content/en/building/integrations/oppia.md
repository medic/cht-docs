---
title: "OppiaMobile"
linkTitle: "OppiaMobile"
weight: 7
description: >
   Integrate CHT core with OppiaMobile’s learning management platformkeywords: oppia
relatedContent: >
  exploring /learning-care
aliases:
   - /apps/guides/integrations/oppia
   - /building/guides/integrations/oppia
   - /apps/features/integrations/oppia
   - /building/features/integrations/oppia
---

## Overview
[OppiaMobile](https://digital-campus.org/oppiamobile) is an open source mobile learning platform built by Digital Campus specially designed for delivering learning content, multimedia, and quizzes in low connectivity settings. All the content and activities can be accessed and used when no internet connection is available, and users can earn points and badges for completing activities and watching videos. To learn more about the platform, check out the [overview](https://digital-campus.org/oppiamobile/developers), OppiaMobile on [Github](https://github.com/DigitalCampus), and their [documentation site](http://oppiamobile.readthedocs.io/en/latest). You can also join the OppiaMobile [Community Discussion Board](https://community.oppia-mobile.org).

This documentation describes how the CHT and OppiaMobile can integrate to provide a learning and care experience for community health workers and other health care providers. It demonstrates how both apps link to one another to provide a seamless user experience, describes features of both applications, and the required configuration adjustments.

We provide a detailed example of the CHT<>OppiaMobile integration, including how to access the learning material, an overview of the functionalities within educational modules, and post-course assessment and supervisor support.

## Features
This integration leverages the **remote onboarding, task & scheduling, and target features** of the CHT core framework with the **curated, multimedia educational content** available via OppiaMobile’s learning platform. 

The CHT Core Framework & OppiaMobile integration currently supports the following capabilities and features:
- [Task management]({{< ref "building/tasks" >}}) for notifications on new educational modules and software updates
- [Remote onboarding]({{< ref "exploring/training" >}}) to new apps, software features, and workflows when they are updated, without relying on face-to-face training
- Optimized multimedia content with links to educational modules powered by OppiaMobile
- Message and feedback options, to contact supervisors with questions and seek support
- [Supervisor visibility]({{< ref "building/targets/targets-overview#supervisor-view" >}}) into CHW progress for onboarding, learning, and care
- Hosting options for government-led, government-owned platforms

The training modules configuration consists of five main components:
- App Forms - Content that the user will interact with;
- Tasks - How forms are presented to the user: how and when the user accesses the forms for input;
- Targets - Shows the progress of the user;
- Contact Summary - Gives a highlight of the modules completed by the user;
- Context - Defines what forms are available to fill from the user’s profile, or available as tasks.

### App Forms

The CHT application uses [XLSForms]({{< ref "building/forms/app" >}}) (app forms), which are a simplified method of setting up form configurations using Excel (or Libre Office Calc, Google sheets, etc). The forms contain the questions/content that the user will interact with, including [web links](https://oppiamobile.readthedocs.io/en/latest/implementers/integration/launch_from_other_app.html) that enable the users to navigate from the CHT application to a specific course in OppiaMobile. App forms are typically created in the `project-folder > forms > app` directory of a project. If the content requires a user to access any form of media, then a media folder for the specific form is created and named after the form. For example, to add video content for a form module_one.xlsx, save the video file to the following directory: `project-folder > forms > app > module_one-media > video`. Once the forms are set up with content, the forms are converted to XForms, which are in xml format. To limit access of App Forms to certain contacts, an App Forms must have a properties file, which defines when and for whom certain forms should be accessed. Once configured, the forms are uploaded to an instance using the CHT configurer with the following commands, which upload specific forms and all forms respectively:

```
cht --instance=<instance> convert-app-forms upload-app-forms -- <form1> <form2>
```

or

```
cht --instance=<instance> convert-app-forms upload-app-forms
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

[Tasks]({{< ref "building/tasks/tasks-js" >}}) are a set of actions available to users from the task tab. Selecting a task opens up a specific form that completes a workflow. Tasks are available within a given timeframe, after which they expire and the user is unable to view or do them. Tasks are defined as an array of objects in a tasks.js file under the project folder, with each task following the task schema. The required properties of a task include:

- Name - unique identifier of the task;
- Title - displays the workflow to be completed for a contact;
- AppliesTo - determines if the task is emitted per contact or report;
- ResolvedIf - conditions to mark a task as resolved/completed;
- Events - specifies the timeframe of a task;
- Actions - specifies the forms accessed by the user and allows injecting content from previous submissions.

On completing the task configuration, the following command is used to compile and upload  the applications settings (tasks, targets, contact-summary, form properties):

```cht --instance=<instance> compile-app-settings upload-app-settings```

The code snippet below illustrates an example of a task configured for the educational modules:

```javascript
{
  title: 'Community Health Academy',
  name: 'cha-module-one-oppia',
  contactLabel: 'Introduction To Covid-19',
  icon:'icon-cha',
  appliesTo: 'contacts',
  appliesToType: ['person'],
  appliesIf: c => c.contact.role === 'chw' && user.parent && user.parent.type === 'health_center',
  actions: [{
    form: 'cha_module_one'
  }],
  events: [{
    dueDate: (event, c) => {
      return Utils.addDate(new Date(c.contact.reported_date), 0);
    },
    start: 0,
    end: 25550
  }],
  resolvedIf: function (c) {
    return c.reports.some(report => report.form === 'cha_module_one' &&
         Utils.getField(report, 'assessment_passed') === 'yes');
  }
}
```

### Targets

The users also have access to [targets]({{< ref "building/targets/targets-js" >}}). Targets are a visual representation of the progress and goals of the user. These are app analytics accessed through the targets tab, where the user is able to view how many modules they have completed. Similar to tasks, targets are defined as an array of objects in a targets.js file under the project folder, with each target following the targets schema. The required properties of a target object include:

- Id - unique identifier of the target;
- Translation_key - title displayed for the widget;
- Type - type of numeric representation i.e. count/percentage;
- Goal - denotes how much the user should achieve;
- appliesTo - Determines whether a contact or a report is counted.

On completing the targets configuration, the following command is used to compile and upload  the applications settings (tasks, targets, contact-summary, form properties):

```
cht --instance=<instance> compile-app-settings upload-app-settings
```

Below is a code snippet for a target configured for the educational modules:

```javascript
{
  id: 'training-modules-completed',
  type: 'percent',
  icon: 'icon-cha',
  goal: 100,
  context: 'user.role === "chw"',
  translation_key: 'targets.training_completion.title',
  subtitle_translation_key: 'targets.all_time.subtitle',
  appliesTo: 'contacts',
  appliesToType: ['person'],
  appliesIf: function (contact) {
    return getField(contact.contact, 'role') === 'chw';
  },
  idType: 'report',
  passesIf: function(contact) {
    return contact.reports || !contact.reports;
  },
  aggregate: true,
  date: 'now',
  emitCustom: (emit, original, contact) => {
    const assessmentModules = ['cha_module_one','cha_module_two','cha_module_three'];
    
    for(let eligibleModule of assessmentModules){
        emit(Object.assign({}, original, {
          _id: `${eligibleModule}`,
          pass: false
      }));
    }
    const validReports = contact.reports.filter(report => ((assessmentModules.includes(report.form)) && report.fields.assessment_passed === 'yes'));

    for (let report of validReports) {
        const instance = Object.assign({}, original, {
            _id: `${report.form}`,
            pass: true
        });
        emit(instance);
    }
  }
}

```


### Contact Summary

In addition to targets, the user is able to see which specific modules they have completed, and view upcoming tasks and other general information on their profile. The section containing this information is known as the [contact summary]({{< ref "building/contact-summary/contact-summary-templated" >}}). The contact summary has 3 main outputs: cards, fields, and context. Contact summary is defined in the `contact-summary.templated.js` file under the project folder.

Cards are an array of objects which can be customized to group information viewed on a contact’s profile. The required properties of a card include:

- Label - title of the card;
- Fields - content of the card;
  - Field name- title/label of a field;
  - Field value - value displayed for a field.

The code snippet below shows an example of a card configured for the educational modules:

```javascript
const isCHW = () => { return getField(contact, 'role') === 'chw'; };

const hasCompletedModuleTraining = function (form) {
  return reports && reports.some(report => report.form === form && report.fields.assessment_passed === 'yes');
};

const hasCompletedModuleOne = hasCompletedModuleTraining('cha_module_one');
const hasCompletedModuleTwo = hasCompletedModuleTraining('cha_module_two');
const hasCompletedModuleThree = hasCompletedModuleTraining('cha_module_three');

const cards = [
  {
    label: 'contact.profile.training',
    appliesToType: 'person',
    appliesIf: isCHW,
    fields: function () {
      let fields = [];
      const completedModuleOne = hasCompletedModuleOne ? 'Complete' : 'Incomplete';
      const completedModuleTwo = hasCompletedModuleTwo ? 'Complete' : 'Incomplete';
      const completedModuleThree = hasCompletedModuleThree ? 'Complete' : 'Incomplete';

      fields.push(
        { icon: 'icon-cha', label: 'Introduction To COVID-19', value: completedModuleOne, width: 6 },
        { icon: 'icon-cha', label: 'COVID Care', value: completedModuleTwo, width: 6 },
        { icon: 'icon-cha', label: 'COVID Misinformation', value: completedModuleThree, width: 6 }
      );
      return fields;
    }
  }
]

```

<br clear="all">

This image shows the training card configured to show completion status of the educational modules:

{{< figure src="status.png" link="status.png" class="left col-7 col-lg-4" >}}

<br clear="all">

Context provides information to App Forms, which are initiated from the contact's profile page. To show an App Form on a contact’s profile, the form’s expression field in its properties file must evaluate to true for the contact. The context information from the profile is accessible as the variable `summary`. 

The code snippet below shows the context variables that can be accessed in the app forms:

```javascript
const context = {
  hasCompletedModuleOne,
  hasCompletedModuleTwo,
  hasCompletedModuleThree,
};
```

<br clear="all">

The three variables `hasCompletedModuleOne`, `hasCompletedModuleTwo` and `hasCompletedModuleThree` are used in the educational modules app forms to determine whether the user will access the forms through the care guide.

The code snippet below shows an example of App Form properties, where the user can only access the form as a care guide if they have completed module one task. This is defined by the phrase `summary.hasCompletedModuleOne` in the expression statement.

```javascript
{
  "icon": "icon-person",
  "context": {
    "person": false,
    "place": false,
    "expression": "!contact || (contact.type === 'person' && user.parent.type === 'health_center' && user.role === 'chw' && contact.role === 'chw' && summary.hasCompletedModuleOne)"
  }
}
```


