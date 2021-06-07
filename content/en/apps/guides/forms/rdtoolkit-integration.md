---
title: "Rapid Diagnostic Toolkit Integration"
linkTitle: "RDToolkit Integration"
weight:
description: >
  Integration for the Rapid Diagnostic Toolkit (RDToolkit)
keywords: RDToolkit RDT

---

_Introduced in v3.12.0_

CHT has an integration with [Rapid Diagnostic Toolkit (RDToolkit)](https://github.com/dimagi/rd-toolkit) which is an Android app developed by Dimagi that facilitates the use of Rapid Diagnostic Test (RDT) in global health care. 
The integration is only available in the CHT Android app and consists of two Enketo widgets (rdtoolkit-provision and rdtoolkit-capture) that are used in XForms to provision RDT and capture results.

## Create the XForms
It is required to create one form for provisioning RDT and one form for capturing RDT results, see [the documentation](https://docs.communityhealthtoolkit.org/apps/tutorials/app-forms/) for more details about app forms.

### Provisioning RDT form
The following labels are required in the “appearance” tag:
* `rdtoolkit-provision`: To attach the Enketo widget that connects with the RDToolkit app.
* `rdtoolkit-action-btn`: To attach the action button that provisions RDT, this button will open the RDToolkit app.

This form has the following mandatory fields:
* `patient_uuid` | Text
    * Patient's unique ID in the system.
    * Defined in the root level.
    * Auto filled when using the contact lookup field.
* `patient_id` | Text
    * Patient's representative ID, for example, can be the ID in the health facility's records.
    * Defined in the root level.
    * Auto filled when using the contact lookup field.
* `patient_name` | Text
    * Patient's first name and / or last name
    * Defined in the root level.
    * Auto filled when using the contact lookup field.
* `rdtoolkit_session_id` | Text
    * The unique ID for the RD Test.
    * Defined in the `data` group level.
    * Auto filled by CHT integration.
* `rdtoolkit_filter` | Text
    * The group of RDT that users can select when provisioning RDT by using RDToolkit app.
    * Defined in the `data` group level.
    * The available options can be found in the [RDToolkit app source code](https://github.com/dimagi/rd-toolkit).
    * Assign a group name to enable all the RDT associated with the group, example: `mal_pf`.
    * Assign individual RDT names to limit the options available for the user, separated by one space, example: `sd_bioline_mal_pf_pv carestart_mal_pf_pv`.

Optional fields:
* `rdtoolkit_api_url` | Text
    * API URL that will receive the RDT results, sent by RDToolkit app via `POST`. See [RDToolkit app source code](https://github.com/dimagi/rd-toolkit) for more details.
    * Defined in the `data` group level.
* `rdtoolkit_state` | Text
    * The RDT status.
    * Defined in the `data` group level.
    * Auto filled by the CHT integration.
* `rdtoolkit_time_started` | Text
    * The date and time when the RDT started.
    * Defined in the `data` group level.
    * Auto filled by the CHT integration.
* `rdtoolkit_time_resolved` | Text
    * The date and time when the RDT result is ready to capture.
    * Defined in the `data` group level.
    * Auto filled by the CHT integration.

### Sample form for provisioning RDT
![Provisioning RDT form](rdtoolkit-povision-form.png)

### Capturing RDT result form
The following labels are required in the “appearance” tag:
* `rdtoolkit-capture`: To attach the Enketo widget that connects with the RDToolkit app.
* `rdtoolkit-action-btn`: To attach the action button that captures the RDT result, this button will open the RDToolkit.

This form has the following mandatory fields:
* `patient_uuid` | Text
    * Patient's unique ID in the system.
    * Defined in the root level.
    * Auto filled when using the contact lookup field.
* `patient_id` | Text
    * Patient's representative ID, for example, can be the ID in the health facility's records.
    * Defined in the root level.
    * Auto filled when using the contact lookup field.
* `patient_name` | Text
    * Patient's first name and / or last name
    * Defined in the root level.
    * Auto filled when using the contact lookup field.
* `rdtoolkit_session_id` | Text
    * The unique ID for the RDT.
    * Defined in the root level.
    * Auto filled by CHT integration.
* `rdtoolkit_results` | Text
    * JSON representation of the RDT result
    * Defined in the `data` group level.
    * Auto filled by CHT integration.
* `rdtoolkit_results_description` | Text
    * Translation of the results
    * Defined in the `data` group level.
    * Auto filled by CHT integration.
* `rdtoolkit_image` | Text
    * Base64 image encoding.
    * Defined in the `data` group level.
    * Auto filled by CHT integration and will render the image.
    * **appearance**: hidden
    * **instance::type**: binary

Optional fields:
* `rdtoolkit_state` | Text
    * The RDT status.
    * Defined in the `data` group level.
    * Auto filled by CHT integration.
* `rdtoolkit_time_started` | Text
    * The date and time when RDT started.
    * Defined in the `data` group level.
    * Auto filled by CHT integration.
* `rdtoolkit_time_resolved` | Text
    * The date and time when the RDT result is ready to capture.
    * Defined in the `data` group level.
    * Auto filled by CHT integration.
* `rdtoolkit_time_read` | Text
    * The date and time when RDT result was captured.
    * Defined in the `data` group level.
    * Auto filled by CHT integration.

### Sample form for capturing RDT results
![Capturing RDT result form](rdtoolkit-capture-form.png)

## Create a task
A [task](https://docs.communityhealthtoolkit.org/apps/features/tasks/) is added when a new provisioning RDT form is created, and it will be resolved when a capture RDT result form is saved. 
The task needs to copy the `rdtoolkit_session_id` from the provision form to the capture form in order to retrieve RDT results from the RDToolkit app. 

The following is an example of a task implementation:

```javascript
{
  name: 'rdtoolkit-capture-results',
  icon: 'icon-follow-up',
  title: 'task.rdtoolkit.capture.title',
  appliesTo: 'reports',
  appliesToType: ['rdtoolkit-provision'], // The form associated with the creation of tasks.
  appliesIf: (contact, report) => {
    return !!(getField(report, 'data.__patient_id') && getField(report, 'data.rdtoolkit_session_id'));
  },
  resolvedIf: (contact, report, event, dueDate) => {
    if (!contact.reports) {
      return false;
    }

    const captureReport = contact.reports.find(reportDoc => {
      if (reportDoc.form !== 'rdtoolkit-capture') {
        return false;
      }
      return getField(reportDoc, 'rdtoolkit_session_id') === getField(report, 'data.rdtoolkit_session_id');
    });

    if (!captureReport || !getField(captureReport, 'data.rdtoolkit_results')) {
      return false;
    }

    const startTime = Math.max(addDays(dueDate, -event.start).getTime(), report.reported_date + 1);
    const endTime = addDays(dueDate, event.end + 1).getTime();

    return isFormArraySubmittedInWindow(contact.reports, ['rdtoolkit-capture'], startTime, endTime);
  },
  actions: [
    {
      type: 'report',
      form: 'rdtoolkit-capture',
      modifyContent: (content, contact, report) => {
        content.rdtoolkit_session_id = getField(report, 'data.rdtoolkit_session_id'); // Copy rdtoolkit_session_id from provision form to capture form.
      }
    }
  ],
  events: [
    {
      id: 'rdtoolkit-capture-event',
      start: 1,
      end: 2,
      days: 1
    }
  ]
}
```

## Add translations
Add translations by following the [CHT guide](https://docs.communityhealthtoolkit.org/apps/reference/translations/). The following is an example of translation labels:

```
report.rdtoolkit-provision.data = Test details
report.rdtoolkit-provision.data.rdtoolkit_state = RD test status
report.rdtoolkit-provision.data.rdtoolkit_time_resolved = Results available on
report.rdtoolkit-provision.data.rdtoolkit_time_started = Started on
report.rdtoolkit-provision.data.__patient_id = Patient ID
report.rdtoolkit-provision.data.__patient_name = Patient name

report.rdtoolkit-capture.data = Test details
report.rdtoolkit-capture.data.rdtoolkit_image = Image
report.rdtoolkit-capture.data.rdtoolkit_results_description = Results
report.rdtoolkit-capture.data.rdtoolkit_state = RD test status
report.rdtoolkit-capture.data.rdtoolkit_time_read = Results were captured on
report.rdtoolkit-capture.data.rdtoolkit_time_resolved = Results were available on
report.rdtoolkit-capture.data.rdtoolkit_time_started = Started on
report.rdtoolkit-capture.data.__patient_id = Patient ID
report.rdtoolkit-capture.data.__patient_name = Patient name
mal_pf = Malaria P. falciparum
mal_pf_neg = Pf negative
mal_pf_pos = Pf positive
mal_pv = Malaria P. vivax
mal_pv_neg = Pv negative
mal_pv_pos = Pv positive
sars_cov2 = SARS-CoV-2
sars_cov2_neg = COVID-19 negative
sars_cov2_pos = COVID-19 positive
universal_control_failure = Invalid - control failed
```

## Upload the assets
Once the forms, the task and the translation are ready, use [medic-conf](https://github.com/medic/medic-conf) to upload these assets to the CHT Core instance.
* [Build and upload translations](https://docs.communityhealthtoolkit.org/apps/reference/translations/#build)
* [Convert and upload forms](https://docs.communityhealthtoolkit.org/apps/reference/forms/app/#build)
* [Build and upload tasks](https://docs.communityhealthtoolkit.org/apps/reference/tasks/#build)

Alternatively the assets can be uploaded by using the [App Manager app](https://docs.communityhealthtoolkit.org/apps/features/admin/).
