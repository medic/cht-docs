---
title: "Building Death Report Workflows"
linkTitle: Death Report Workflow
weight: 11
description: >
  Building Death Report Workflows
relatedContent: >
  building/reference/app-settings/transitions#death_reporting
aliases:
   - /apps/tutorials/death-reporting
---

# Death Reporting

#### Guide for setting up a comprehensive death report workflow

{{% pageinfo %}}
In this tutorial you will learn how to set up a death report workflow. This includes laying out a death report form as well as handling all the configurations needed for wiring it up in the CHT.
By the end of the tutorial you should be able to:

- Mark select contacts as deceased
- Make relevant app updates for dead contacts
{{% /pageinfo %}}

## Brief Overview of Key Concepts

When a contact is marked as deceased within the CHT, the contact will be hidden by default on the contacts tab.

{{< figure src="contacts-tab-with-deceased.png" link="contacts-tab-with-deceased.png" class="right col-6 col-lg-8" >}}	

## Required Resources

You will need to:

1. [Configure your application hierarchy]({{% ref "building/tutorials/application-settings" %}})
2. [Create some contacts]({{% ref "building/contact-management/contact-and-users-1" %}})
3. [Know how to create an app form]({{% ref "building/tutorials/app-forms" %}})
4. [Know how to set form properties]({{% ref "building/tutorials/form-properties" %}})

## Implementation Steps

1. Create a new app form with a name like "Death Report". This will be used to flag a contact as deceased.
2. Set the form properties to show for contacts that can die.
3. Enable the [death_reporting transition]({{% ref "building/reference/app-settings/transitions#death_reporting" %}}).
4. Make some recommended updates to tasks, targets, and contact-summary.

### 1. Create the Death Form

Create a [new app form]({{% ref "building/tutorials/app-forms" %}}) with your desired experience for reporting a death. Or you can use the `death_report.xlsx` and `death_report.properties.json` files [from this reference application](https://github.com/medic/cht-core/tree/master/config/default/forms/app).

It is common to want to know the date of death, place of death, or cause of death when reporting a death. If you want to ask date of the contact's death, use a field of type `date`. This information will be used again in step 3.

### 2. Edit the Form Properties.json File

It doesn't make sense to have "places" in your hierarchy that can be deceased. It also doesn't make sense for somebody who is dead to die again. But can the administration of a health facility die? That is for you to decide.

This snippet is an example [form properties file]({{% ref "building/tutorials/form-properties" %}}) which constrains the death form to show only for contacts which:

1. Are currently alive
2. Are within a family
3. Have a [contact_type with "person: true"]({{% ref "building/reference/app-settings/hierarchy" %}})

```json
{
	"context":  {
		"expression":  "!contact.date_of_death && user.parent.contact_type === 'family'",
		"person":  true,
		"place":  false
	},
	"icon":  "icon-death-general",
	"title":  [
		{
			"locale":  "en",
			"content":  "Report death"
		}
	]
}
```

### 3. Enable the `death_reporting` Transition

The [death_reporting transition]({{% ref "building/reference/app-settings/transitions#death_reporting" %}}) will process your death report and update the deceased contact document by adding a `date_of_death` attribute to the document.


To enable death reporting:

```json
"transitions": {
    ...,
    "death_reporting": true
 },
"death_reporting": {
    "mark_deceased_forms": [
      "death_report"
    ],
    "date_field": "fields.date_of_death"
 }
```

 The `date_field` is optional. If a date of death is not provided, the date of the death report will be used. If your form has a field of type `date` asking for the date of the contact's death, use a path to that field in `date_field`.

### 4. Test

1. Create a contact that you expect to be able to die. View the contact's profile in the contacts tab.
2. Click on the "+ New Action" tab. You should see your "Death Report" form there with an appropriate title and icon.
3. Select and complete your Death Report.
4. View the "place" containing the deceased contact in the contacts tab. The contact will not appear as "deceased"
5. Sync your documents (this pushes the death report to the server)
6. Sync your documents again (this pulls down the transitioned contact document from the server)
7. The contact should now be hidden and accessible only via the "View deceased" flyout
8. If you specified a `date_field` in Step 3, confirm that the `date_of_death` attribute on the deceased contact matches the selected date in the death report.
9. Create contacts that you **do not expect** to be able to die. View the contact's profiles and confirm the "Death Report" does not show in the "+ New Action" tab.

### Recommended updates

#### Disable tasks for deceased contacts

If a contact is dead, you may want to disable the majority of tasks for that contact. You will need to update each of your [task's definitions]({{% ref "building/reference/tasks#tasksjs" %}}).

```javascript
{
  appliesIf: (contact) => !contact.contact.date_of_death && myLogic,
  ...
}
```

#### Prevent the display of other forms for deceased persons

You typically don't want users doing actions like "health assessment" for deceased contacts. You can achieve this by updating your other app form's `properties.json` files to only display for alive contacts.

```json
{
	"context":  {
		"expression":  "!contact.date_of_death && myLogic",
    ...
	},
}
```

#### Condition card for "Date of Death"

On your [contact page]({{% ref "building/reference/contact-page" %}}) you may want to add a condition card to display the date of the patient's death.

```javascript
const cards = [
  {
    label: 'contact.profile.death.title',
    appliesToType: 'person',
    appliesIf: () => contact && contact.date_of_date,
    fields: () => ([
      { 
        label: 'contact.profile.death.date', 
        value: contact.date_of_death, 
        filter: 'simpleDate', 
        translate: false, 
        width: 6
      }
    ]),
  }
];
```

#### Targets

Should your targets count deceased contacts in the denominator? This change is left as an exercise for the reader.

## Undoing a death report

To undo a death report, you'll need to create a new app form to undo the death report. Add it to `undo_deceased_forms` (similar to `mark_deceased_forms`) in app_settings step 3 above.
