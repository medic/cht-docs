---
title: "Configuring Tasks"
linkTitle: Tasks
weight: 9
description: >
  Configuring CHT tasks
relatedContent: >
  apps/features/tasks
  apps/reference/tasks
  apps/concepts/workflows
  design/best-practices/#anatomy-of-a-task

---

Tasks guide health workers through their days and weeks.

{{% pageinfo %}}
This tutorial will take you through how to configure tasks for CHT applications, including:

- Authoring tasks
- Compiling tasks into app settings and uploading

You will be configuring a task that allows Community Health Workers to conduct a health assessment follow up for children under the age of 5 that have a cough lasting more than 3 days, within 24 hours.
{{% /pageinfo %}}

## Brief Overview of Key Concepts

*[Tasks]({{< ref "apps/features/tasks" >}})* gives a UI overview of tasks.

*[Anatomy of a Task]({{< ref "design/best-practices/#anatomy-of-a-task" >}})* takes you through the anatomy of a task

*[Task schema]({{< ref "apps/reference/tasks#tasksjs" >}})* details a set of properties for tasks.

*[Utils]({{< ref "apps/reference/tasks#utils" >}})* define a set of utility functions in the Core Framework can make common tasks much easier.

*[Nools extras]({{< ref "apps/reference/nools-extras" >}})* where helper variables and functions for Tasks and Targets are defined.


## Required Resources

You should have a functioning [CHT instance with `medic-conf` installed locally]({{< ref "apps/tutorials/local-setup" >}}), completed a [project folder]({{< ref "apps/tutorials/local-setup#3-create-and-upload-a-blank-project" >}}) setup, and an [assessment form]({{< ref "apps/tutorials/app-forms" >}}).

## Implementation Steps

It is good practice to set up a reference document for the tasks similar to the one below. Other formats may also be used.

| Source  | UI Label | Condition  | Due Date | Resolved | Window period |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| Assessment form  | Assessment follow up  | cough_duration > 3  | reported + 1 days  | When assessment follow up or another assessment report is submitted  | 7 days  |

Create the task as per the detail above.

### 1. Define the task

```text
{
    name: 'cough-gt-3-days-follow-up',
    icon: 'icon-followup-general',
    title: 'task.'cough_gt_3_days.follow_up',
    appliesTo: 'reports',
    appliesToType: [‘assessment'],
    appliesIf: function(contact, report) {
      return r && r.fields.group_assessment && parseInt(r.fields.group_assessment)  > 3;
    },
    actions: [
      {
        type: 'report',
        form: 'assessment_follow_up'
      }
    ],
    events: [
      {
        id: 'cough-gt-3-days-follow-up',
        days: 0,
        start: 2,
        end: 7
      }
    ],
    resolvedIf: function(c, r, event, dueDate) {
      return isFormArraySubmittedInWindow(c.reports, ['assessment_follow_up'], dueDate, event, null, r._id);
    }
}
```

### 2. Create an `assessment_follow_up` form as specified below referenced by the task you created. Refer to the app-forms tutorial.

##### Data fields

| type                          | name              | label                              | required | relevant            | appearance | constraint | constraint_message  | calculation | choice_filter  | hint | default |
| ----------------------------- | ----------------- | ---------------------------------- | -------- | ------------------- | ---------- | ---------- | ------------------- | ----------- | -------------- | ---- | ------- |
| begin group                   | group_assessment  | Assessment                         |          |                     |            |            |                     |             |                |      |         |
| select_one yes_no             | visited_hf             | Did ${patient_name} go to a health facility for treatment? | yes      |                     |            |            |                     |             |                |      |         |
| select_one progress_since_last_visit   | progress    | How is ${patient_name}'s condition since the last visit?     | yes      | ${visited_hf} = 'yes'    |            |            |                     |             |                |      |         |
| end group                     |                   |                                    |          |                     |            |            |                     |             |                |      |         |

##### Choices

| list_name         | name | label           |
| ----------------- | ---- | --------------- |
| yes_no            | yes  | Yes             |
| yes_no            | no   | No              |
| progress_since_last_visit            | improved   | Improved              |
| progress_since_last_visit            | same   | Stayed same              |
| progress_since_last_visit            | worse   | Worsened              |

##### Settings

| form_title     | form_id    | version | style | path | instance_name  | default_language  |
| -------------- | ---------- | ------- | ----- | ---- | -------------- | ----------------- |
| Follow up| assessment_follow_up | 1       | pages | data |                | en                |

##### Sub-folder

```json
forms/app
```

#### Build
To build your tasks into your app, you must compile them into app-settings, then upload them to your instance. 

```zsh
medic-conf --url=https://<username>:<password>@localhost --accept-self-signed-certs compile-app-settings backup-app-settings upload-app-settings
```

Remember to convert and upload your assessment_follow_up form
```zsh
medic-conf --url=https://<username>:<password>@localhost --accept-self-signed-certs convert-app-forms upload-app-forms -- assessment_follow_up
```

## Frequently Asked Questions

- [Tasks not appearing](https://forum.communityhealthtoolkit.org/t/tasks-not-appearing/537)
- [How can I debug task rules?](https://forum.communityhealthtoolkit.org/t/how-can-i-debug-task-rules/108)
