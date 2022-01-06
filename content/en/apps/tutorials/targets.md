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

You will be adding target widgets that will allow Community Health Workers (CHWs) to track various metrics based on assessment reports submitted.
{{% /pageinfo %}}

## Brief Overview of Key Concepts

*[Targets]({{< ref "apps/features/targets" >}})* is the user dashboard or analytics tab.

*Target widgets* provide a summary or analysis of the data in submitted reports.

*Count widgets* show a tally of a particular report that has been submitted or data within a report that matches a set of criteria.

*Percent widgets* display a ratio, which helps to provide insight into the proportion that matches a defined criteria.

*[Target schema]({{< ref "apps/reference/targets#targetsjs" >}})* details a set of properties for targets.

## Required Resources

You should have a functioning [CHT instance with `cht-conf` installed locally]({{< ref "apps/tutorials/local-setup" >}}), completed a [project folder]({{< ref "apps/tutorials/local-setup#3-create-and-upload-a-blank-project" >}}) setup, and an [assessment form]({{< ref "apps/tutorials/app-forms" >}}).

## Implementation Steps

It is good practice to set up a reference document outlining the specifications of the target widgets similar to the one below. Other formats may also be used.

| Source  | UI Label | Definition  | Type | Reporting Period | Goal | DHIS |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| Assessment form  | Total assessments | Total number of assessment reports submitted  | Count | All time | _ | No |
| Assessment form  | Total assessments this month | Total number of assessment reports submitted this month | Count | This month | 2 | No |
| Assessment form  | Total population with cough  | Total number of household members with cough  | Count | This month | _ | No |
| Assessment form  | % Population with cough  | Total number of contacts with cough/Total number of contacts assessed | Percent | This month | _ | No |
| Assessment form  | Total households with assessments  | Total number of households with at least one submitted assessment form  | Count | This month | 4 | Yes |
| Assessment form  | % Household with >=2 assessments  | Total number of households with at least two patients assessed/Total number of households | Percent | All time | 20 | No |


Create a `targets.js` file (this may have already been created by the `initialise-project-layout` command).

### 1. Define an All-Time Target Widget
This widget counts the total number of assessment reports that have been submitted by the user from the time that they started reporting.
Edit the `targets.js` file to define the total assessments all-time widget as shown below:

```javascript
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
```

### 2. Define the Total Assessments Monthly Target Widget
This widget counts the total number of assessment reports that have been submitted by the user for this month.
Edit the `targets.js` file and add another target widget definition object to define the total assessments monthly widget as shown below:

```javascript
  {
    id: 'assessments-this-month',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: 2,
    translation_key: 'targets.assessments.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['assessment'],
    date: 'reported'
  }
```

{{% alert title="Note" %}} All-time widgets have the `date` property set to `now` while monthly widgets have the `date` property set to `reported`. {{% /alert %}}

The images below show the `all-time` and `monthly` target widgets respectively, with the resulting figures varying depending on the number of assessment reports submitted within the respective durations:

![All-time assessements](assessments_all_time_no_translation.png) ![Assessments this month](assessments_this_month_no_translation.png)

### 3. Define the Cough Count Widget
This widget calculates the total number of patients assessed that have been indicated to have a cough this month, regardless of the number of reports submitted for them. Note that `idType` counts the contact IDs.
Edit the `targets.js` file and add the target widget as shown below:

```javascript
  {
    id: 'total-contacts-with-cough-this-month',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.assessments.total.cough.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['assessment'],
    appliesIf: function (contact, report) {
      return Utils.getField(report, 'group_assessment.cough') === 'yes';
    },
    idType: 'contact',
    date: 'reported'
  }
```

### 4. Define the Cough Percentage Widget
This widget calculates the percentage patients assessed that have been indicated to have a cough this month, regardless of the number of reports submitted for them.
Edit the `targets.js` file and add the target widget as shown below:

```javascript
  {
    id: 'percentage-contacts-with-cough-this-month',
    type: 'percent',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.assessments.percentage.cough.title',
    percentage_count_translation_key: 'targets.assessments.percentage.with.cough',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['assessment'],
    appliesIf: function (contact) {
      return contact.contact && contact.contact.parent && contact.contact.parent.parent && contact.contact.parent.parent.parent;
    },
    passesIf: function(contact, report) {
      return Utils.getField(report, 'group_assessment.cough') === 'yes';
    },
    idType: 'contact',
    date: 'reported'
  }
```

### 5. Define Total Households with Assessments Widget
This widget calculates the number of households that have patients assessed this month. Note that `emitCustom` emits a custom target instance object. Filter based on reports, and use the contact information from the reports to emit target instances. The target instance ID is the household ID.
Edit the `targets.js` file and add the target widget as shown below:

```javascript
 {
    id: 'households-with-assessments-this-month',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: 4,
    translation_key: 'targets.households.with.assessments.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['assessment'],
    date: 'reported',
    emitCustom: (emit, original, contact) => {
      const householdId = contact.contact && contact.contact.parent._id;
      emit(Object.assign({}, original, {
        _id: householdId,
        pass: true
      }));
    },
    dhis: { //The IDs should correspond to the IDs on DHIS site
      dataSet: 'VMuFODsyWaO',
      dataElement: 'kB0ZBFisE0e'
    }
  },
```

### 6. Define Households with Assessments Widget
This widget calculates the number of households that have two or more patients assessed this month. Use `emitCustom` to emit a custom target instance object. The target instance ID is the household ID.
Edit the `targets.js` file and add the target widget as shown below:

```javascript

//Define a function to get the household ID
const getHouseholdId = (contact) => contact.contact && contact.contact.type === 'clinic' ? contact.contact._id : contact.contact.parent && contact.contact.parent._id;

//Define a function to determine if contact is patient
const isPatient = (contact) => contact.contact && contact.contact.type === 'person' && contact.contact.parent && contact.contact.parent.parent && contact.contact.parent.parent.parent;

 {
    id: 'households-with-gt2-assessments-this-month',
    type: 'percent',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.households.with.gt2.assessments.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person', 'clinic'], //Need the total number of households as denominator
    date: 'now',
    emitCustom: (emit, original, contact) => {
      const householdId = getHouseholdId(contact);
      if (isPatient(contact)) {
        if (contact.reports.some(report => report.form === 'assessment')) {
          emit(Object.assign({}, original, const targetInstance = {
            _id: householdId, //Emits a passing target instance with the household as the target instance ID
            pass: true
          }));
        }
      }
      if(contact.contact && contact.contact.type === 'clinic') { //This represents the denominator, which is the total number of households
        emit(Object.assign({}, original,
          _id: householdId,
          pass: false, //Set to false so that it is counted in the denominator
        }));
      }
    },
    groupBy: contact => getHouseholdId(contact),
    passesIfGroupCount: { gte: 2 }
  }
```
### 7. Final targets.js file

Include the functions and replace appropriately in the file. The final content of the targets file should be similar the one below:

```javascript
//Define a function to get the household ID
const getHouseholdId = (contact) => contact.contact && contact.contact.type === 'clinic' ? contact.contact._id : contact.contact.parent && contact.contact.parent._id;

//Define a function to determine if contact is patient
const isPatient = (contact) => contact.contact && contact.contact.type === 'person' && contact.contact.parent && contact.contact.parent.parent && contact.contact.parent.parent.parent;

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
    goal: 2,
    translation_key: 'targets.assessments.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['assessment'],
    date: 'reported'
  },
  {
    id: 'total-contacts-with-cough-this-month',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.assessments.total.cough.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['assessment'],
    appliesIf: function (contact, report) {
      return Utils.getField(report, 'group_assessment.cough') === 'yes';
    },
    idType: 'contact',
    date: 'reported'
  },
  {
    id: 'percentage-contacts-with-cough-this-month',
    type: 'percent',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.assessments.percentage.cough.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    percentage_count_translation_key: 'targets.assessments.percentage.with.cough',
    appliesTo: 'reports',
    appliesToType: ['assessment'],
    appliesIf: function (contact) {
      return isPatient(contact);
    },
    passesIf: function(contact, report) {
      return Utils.getField(report, 'group_assessment.cough') === 'yes';
    },
    idType: 'contact',
    date: 'reported'
  },
  {
    id: 'households-with-assessments-this-month',
    type: 'count',
    icon: 'icon-healthcare-assessment',
    goal: 4,
    translation_key: 'targets.households.with.assessments.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'reports',
    appliesToType: ['assessment'],
    date: 'reported',
    emitCustom: (emit, original, contact) => {
      const householdId = getHouseholdId(contact);
      emit(Object.assign({}, original, {
        _id: householdId,
        pass: true
      }));
    },
    dhis: { //codes should respond to codes on DHIS site
      dataSet: 'VMuFODsyWaO',
      dataElement: 'kB0ZBFisE0e'
    }
  },
  {
    id: 'households-with-gt2-assessments-this-month',
    type: 'percent',
    icon: 'icon-healthcare-assessment',
    goal: -1,
    translation_key: 'targets.households.with.gt2.assessments.title',
    subtitle_translation_key: 'targets.this_month.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person', 'clinic'], //Need the total number of households as denominator
    date: 'now',
    emitCustom: (emit, original, contact) => {
      const householdId = getHouseholdId(contact);
      if (isPatient(contact)) {
        if (contact.reports.some(report => report.form === 'assessment')) {
          emit(Object.assign({}, original, const targetInstance = {
            _id: householdId, //Emits a passing target instance with the household as the target instance ID
            pass: true
          }));
        }
      }
      if(contact.contact && contact.contact.type === 'clinic') { //This represents the denominator, which is the total number of households
        emit(Object.assign({}, original,
          _id: householdId,
          pass: false, //Set to false so that it is counted in the denominator
        }));
      }
    },
    groupBy: contact => getHouseholdId(contact),
    passesIfGroupCount: { gte: 2 },
  }
];
```

{{< see-also page="apps/reference/targets" title="Targets overview" >}}

### 8. Compile and Upload App Settings

To compile and upload app settings to your local instance, run the following command:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs compile-app-settings upload-app-settings
```

{{% alert title="Note" %}} Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance. {{% /alert %}}


### 8. Upload translations
Ensure that translation keys are in the translations file. Add the following translation keys and their values in the `messages-en.properties` file.

```
targets.assessments.title = Total assessments
targets.assessments.total.cough.title = Total population with cough
targets.assessments.percentage.cough.title = % Population with cough
targets.households.with.assessments.title = Total households with assessments
targets.households.with.gt2.assessments.title = % Household with >=2 assessments
targets.assessments.percentage.with.cough = {{pass}} of {{total}} with cough
```
To upload *[translations]({{< ref "apps/reference/translations#translations" >}})* to your local instance, run the following command:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs upload-custom-translations
```

## Frequently Asked Questions

- [How are targets ordered?](https://forum.communityhealthtoolkit.org/t/how-are-targets-ordered/547)
- [What types of users can see target widgets?](https://forum.communityhealthtoolkit.org/t/targets-are-disabled-for-admin-users-if-you-need-to-see-targets-login-as-a-normal-user/912)
