---
title: "Building Target Widgets"
linkTitle: Targets
weight: 10
description: >
 How to build CHT monthly and all time target widgets
relatedContent: >
  apps/features/targets
  apps/reference/targets
  design/best-practices/#anatomy-of-a-task

---

{{% pageinfo %}}
This tutorial will take you through how to build target widgets.

Target widgets provide a summary or analysis of the data in submitted reports.

You will be adding target widgets that will allow Community Health Workers to track the number of assessments done.
{{% /pageinfo %}}

## Brief Overview of Key Concepts

*Targets* is the user dashboard or analytics tab.

*Target widgets* provide a summary or analysis of the data in submitted reports.

*Count widgets* show a tally of a particular report that has been submitted or data within a report that matches a set of criteria.

*Percent widgets* display a ratio, which helps to provide insight into the proportion that matches a defined criteria.

## Required Resources

You should have a functioning [CHT instance with `medic-conf` installed locally]({{< ref "apps/tutorials/local-setup" >}}), completed a [project folder]({{< ref "apps/tutorials/local-setup#3-create-and-upload-a-blank-project" >}}) setup, and an [assessment form]({{< ref "apps/tutorials/app-forms" >}}).

## Implementation Steps

Create a `targets.js` file (this may have already been created by the `initialise-project-layout` command).

### 1. Define an All-Time Target Widget

Edit the `targets.js` file to define an all-time widget as shown below:

```javascript
module.exports = [
  {
    id: 'assessments-all-time',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.assessments.title',
    subtitle_translation_key: 'targets.all_time.subtitle',

    appliesTo: 'reports',
    appliesToType: ['assessment'],
    date: 'now'
  }
];
```

### 2. Define a Monthly Target Widget

Edit the `targets.js` file and add another target widget definition object to define a monthly widget as shown below:

```javascript
module.exports = [
  {
    id: 'assessments-all-time',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.assessments.title',
    subtitle_translation_key: 'targets.all_time.subtitle',

    appliesTo: 'reports',
    appliesToType: ['assessment'],
    date: 'now'
  },
  {
    id: 'assessments-this-month',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.assessments.title',
    subtitle_translation_key: 'targets.this_month.subtitle',

    appliesTo: 'reports',
    appliesToType: ['assessment'],
    date: 'reported'
  }
];
```

{{% alert title="Note" %}} All-time widgets have the `date` property set to `now` while monthly widgets have the `date` property set to `reported`. {{% /alert %}}

{{< see-also page="apps/reference/targets" title="Targets overview" >}}

### 3. Compile and Upload App Settings

To compile and upload app settings to your local instance, run the following command:

```zsh
medic-conf --url=https://<username>:<password>@localhost --accept-self-signed-certs compile-app-settings upload-app-settings
```

{{% alert title="Note" %}} Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance. {{% /alert %}}

## Frequently Asked Questions

- [How are targets ordered?](https://forum.communityhealthtoolkit.org/t/how-are-targets-ordered/547)
- [What types of users can see target widgets?](https://forum.communityhealthtoolkit.org/t/targets-are-disabled-for-admin-users-if-you-need-to-see-targets-login-as-a-normal-user/912)
