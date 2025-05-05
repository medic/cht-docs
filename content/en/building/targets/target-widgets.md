---
title: "Target Widgets"
linkTitle: Target Widgets
weight: 2
description: >
 How to build CHT monthly and all time target widgets
relatedContent: >
  building/targets/targets-overview
  building/targets/targets-js
  design/best-practices/#anatomy-of-a-task
aliases:
   - /apps/tutorials/targets
   - /building/tutorials/targets
---

This tutorial will take you through how to build target widgets.

Target widgets provide a summary or analysis of the data in submitted reports.

You will be adding target widgets that will allow Community Health Workers (CHWs) to track various metrics based on assessment reports submitted.

## Brief Overview of Key Concepts

*[Targets]({{< ref "building/targets/targets-overview" >}})* is the user dashboard or analytics tab.

*[Target widgets]({{< ref "building/targets/targets-overview#types-of-widgets" >}})* provide a summary or analysis of the data in submitted reports.

*[Count widgets]({{< ref "building/targets/targets-overview#count-widgets" >}})* show a tally of a particular report that has been submitted or data within a report that matches a set of criteria.

*[Percent widgets]({{< ref "building/targets/targets-overview#percent-widgets" >}})* display a ratio, which helps to provide insight into the proportion that matches a defined criteria.

*[Target schema]({{< ref "building/targets/targets-js#targetsjs" >}})* details a set of properties for targets.

*Target instance* is an object emitted and counted or aggregated based on target configuration.

## Required Resources

You should have a functioning [CHT instance with `cht-conf` installed locally]({{< ref "building/local-setup" >}}), completed a [project folder]({{< ref "building/local-setup#3-create-and-upload-a-blank-project" >}}) setup, and an [assessment form]({{< ref "building/tutorials/app-forms" >}}).

## Implementation Steps

It is good practice to set up a reference document outlining the specifications of the target widgets similar to the one below. Other formats may also be used.

| Source  | UI Label | Definition  | Type | Reporting Period | Goal |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| Assessment form  | Total assessments | Total number of assessment reports submitted  | Count | All time | _ |
| Assessment form  | Total assessments | Total number of assessment reports submitted this month | Count | This month | 2 |
| Assessment form  | Total population with cough  | Total number of household members with cough  | Count | This month | _ |
| Assessment form  | % Population with cough  | Total number of contacts with cough/Total number of contacts assessed | Percent | This month | _ |
| Assessment form  | Total households with assessments  | Total number of households with at least one submitted assessment form  | Count | This month | 2 |
| Assessment form  | % Household with >=2 assessments  | Total number of households with at least two patients assessed/Total number of households | Percent | All time | 60 |


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

> [!NOTE]
> All-time widgets have the `date` property set to `now` while monthly widgets have the `date` property set to `reported`. 

{{< figure src="assessments_all_time_no_translation.png" link="assessments_all_time_no_translation.png" class="right col-6 col-lg-4" >}}
{{< figure src="assessments_this_month_no_translation.png" link="assessments_this_month_no_translation.png" class="right col-6 col-lg-4" >}}

The images show the `monthly` and `all-time` target widgets respectively, with the resulting figures varying depending on the number of assessment reports submitted within the respective durations.


### 3. Define the Cough Count Widget
This widget calculates the total number of patients assessed that have been indicated to have a cough this month, regardless of the number of reports submitted for them. Note that `idType` counts the contact IDs.
Edit the `targets.js` file and add the target widget as shown below:

```javascript
  {
    id: 'total-contacts-with-cough-this-month',
    type: 'count',
    icon: 'icon-cough',
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
    icon: 'icon-cough',
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
This widget calculates the number of households that have patients assessed this month. Note that `emitCustom` emits a target with custom conditions that may otherwise not be directly configurable through the target schema. Filter based on reports, and use the contact information from the reports to emit targets. The target ID is the household ID.
Edit the `targets.js` file and add the target widget as shown below:

```javascript
 {
    id: 'households-with-assessments-this-month',
    type: 'count',
    icon: 'icon-household',
    goal: 2,
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
    }
  },
```

{{< figure src="household_assessments_reached_goal.png" link="household_assessments_reached_goal.png" class="right col-6 col-lg-4" >}}
{{< figure src="household_assessments_zero_reports.png" link="household_assessments_zero_reports.png" class="right col-6 col-lg-4" >}}

Note the difference in appearance on the resulting `count` target widgets based on whether the `goal` is achieved. The figures vary depending on the number of assessment reports submitted for household members.

### 6. Define Percentage Households with >=2 Assessments Widget
This widget calculates the percentage of households that have two or more patients assessed all time. Use `emitCustom` to emit a custom target instance. The target instance ID is the household ID.
Edit the `targets.js` file and add the target widget as shown below:

```javascript

//Define a function to get the household ID based on the hierarchy configuration
const getHouseholdId = (contact) => contact.contact && contact.contact.type === 'clinic' ? contact.contact._id : contact.contact.parent && contact.contact.parent._id;

//Define a function to determine if contact is patient
const isPatient = (contact) => contact.contact && contact.contact.type === 'person' && contact.contact.parent && contact.contact.parent.parent && contact.contact.parent.parent.parent;

 {
    id: 'households-with-gt2-assessments-this-month',
    type: 'percent',
    icon: 'icon-household',
    goal: 60,
    translation_key: 'targets.households.with.gt2.assessments.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person', 'clinic'], //Need the total number of households as denominator
    date: 'now',
    emitCustom: (emit, original, contact) => {
      const householdId = getHouseholdId(contact);
      if (isPatient(contact)) {
        if (contact.reports.some(report => report.form === 'assessment')) {
          emit(Object.assign({}, original, const targetInstance = {
            _id: householdId, //Emits a passing target instance with the household ID as the target instance ID
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

{{< see-also page="building/workflows/hierarchy" title="Hierarchies" >}}

{{< figure src="households_gt2_goal_reached.png" link="households_gt2_goal_reached.png" class="right col-6 col-lg-4" >}}
{{< figure src="households_gt2_goal_not_reached.png" link="households_gt2_goal_not_reached.png" class="right col-6 col-lg-4" >}}


The images show the resulting `percent` target widgets, with the figures varying depending on the number of assessment reports submitted for household members. Note the difference in appearance based on whether the `goal` is achieved.

### 7. Final `targets.js` file

Include the functions and replace appropriately in the file. The final content of the targets file should be similar the one below:

```javascript
//Define a function to get the household ID based on the hierarchy configuration
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
    icon: 'icon-cough',
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
    icon: 'icon-cough',
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
    icon: 'icon-household',
    goal: 2,
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
    }
  },
  {
    id: 'households-with-gt2-assessments-this-month',
    type: 'percent',
    icon: 'icon-household',
    goal: 60,
    translation_key: 'targets.households.with.gt2.assessments.title',
    subtitle_translation_key: 'targets.all_time.subtitle',
    appliesTo: 'contacts',
    appliesToType: ['person', 'clinic'], //Need the total number of households as denominator
    date: 'now',
    emitCustom: (emit, original, contact) => {
      const householdId = getHouseholdId(contact);
      if (isPatient(contact)) {
        if (contact.reports.some(report => report.form === 'assessment')) {
          emit(Object.assign({}, original, const targetInstance = {
            _id: householdId, //Emits a passing target instance with the household ID as the target instance ID
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

{{< see-also page="building/targets/targets-js" title="Targets overview" >}}

### 8. Compile and Upload App Settings

To compile and upload app settings to your local instance, run the following command:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs compile-app-settings upload-app-settings
```

> [!IMPORTANT] 
> Be sure to replace the values `<username>` and `<password>` with the actual username and password of your test instance.

{{< figure src="targets_no_translations.png" link="targets_no_translations.png" class="right col-6 col-lg-8" >}}


The image on the right-hand side shows the expected outcome on the `analytics tab`, with figures varying depending on the number of reports submitted on your instance.

### 9. Upload translations
To update the titles of the target widgets, ensure that the `translation keys` are in the translations file. Add the following translation keys and their values in the `messages-en.properties` file. You may word your translation keys and values differently.

```
targets.assessments.title = Total assessments
targets.assessments.total.cough.title = Total population with cough
targets.assessments.percentage.cough.title = % Population with cough
targets.households.with.assessments.title = Total households with assessments
targets.households.with.gt2.assessments.title = % Household with >=2 assessments
```
To upload *[translations]({{< ref "building/translations/localizing" >}})* to your local instance, run the following command:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs upload-custom-translations
```

{{< figure src="targets_with_translations.png" link="targets_with_translations.png" class="right col-6 col-lg-8" >}}

The image on the right-hand side shows the updated target titles. Your image may be different depending on your wording.

> [!IMPORTANT] 
> Be sure to have the correct translation key in your target widget's `translation_key` property.

### 10. Target icons
You may add `icons` to your target widgets to enhance their appearance and to help users locate specific widgets more quickly. Use the icons in the *[targets icon library]({{< ref "design/interface/icons/forms_tasks_targets" >}})*, or icons of your choice for the target widgets. Add your selected icons to the `resources` folder in your project folder. In your `resources.json` *file*, add key/value pairs for your icon resources.

```json
{
  "icon-healthcare-assessment": "icon-healthcare-assessment.svg",
  "icon-household": "icon-places-household.svg",
  "icon-cough": "icon-condition-cough.svg"
}
```
> [!NOTE] 
> The `key` in the `resources.json` file is the value of the `icon` property in the target widget configuration.

{{< see-also page="design/interface/icons" title="Icon Library" >}}

To upload *[resources]({{< ref "building/branding/resources#icons" >}})* to your local instance, run the following command:

```zsh
cht --url=https://<username>:<password>@localhost --accept-self-signed-certs upload-resources
```

{{< figure src="final_targets.png" link="final_targets.png" class="right col-6 col-lg-8" >}}

The image on the right-hand side shows the expected final appearance of the target widgets on adding and uploading resources. The figures on the widgets will depend on the number of reports submitted for contacts and the number of contacts you have created on your instance.



## Frequently Asked Questions

- [How are targets ordered?](https://forum.communityhealthtoolkit.org/t/how-are-targets-ordered/547)
- [What types of users can see target widgets?](https://forum.communityhealthtoolkit.org/t/targets-are-disabled-for-admin-users-if-you-need-to-see-targets-login-as-a-normal-user/912)
