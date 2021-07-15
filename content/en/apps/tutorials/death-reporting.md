# Death Reporting

#### Guide for setting up a comprehensive death report workflow

{{% pageinfo %}}
In this tutorial you will learn how to set up a death report workflow. This includes laying out a death report form as well as handling all the configurations needed for wiring it up in the CHT.
By the end of the tutorial you should be able to:

- Mark a contact as deceased
- Make app updates which are commonly desired for dead contacts
{{% /pageinfo %}}

## Brief Overview of Key Concepts

When a contact is marked as deceased within the CHT, the contact will be hidden by default on the contacts tab.

{{< figure src="facility-uuid.png" link="facility-uuid.png" class="right col-6 col-lg-8" >}}	

## Required resources

You will need to:

1. [Configure your application hierarchy]({{% ref "apps/tutorials/application-settings" %}})
2. [Create some contacts]({{% ref "apps/tutorials/contact-and-users-1" %}})
3. [Know how to create an app form]({{% ref "apps/tutorials/app-forms" %}})
4. [Know how to set form properties]({{% ref "apps/tutorials/form-properties" %}})

## Implementation Steps

1. Create a new app form with a name like "Death Report". This will be used to flag a contact as deceased.
2. Set the form properties to show for contacts that can die.
3. Enable the [death_reporting transition]({{% ref "apps/reference/app-settings/transitions#death_reporting" %}}).
4. Make some recommended updates to tasks, targets, and contact-summary.

### 1. Create the death form

Create a [new app form]({{% ref "apps/tutorials/app-forms" %}}) with your desired experience for reporting a death. Or you can use the `death_report.xlsx` and `death_report.properties.json` files [from this reference application](https://github.com/medic/cht-core/tree/master/config/default/forms/app).

If you want to ask the user for the date of the contact's death, using a field of type `date`. This information will be used in step 3.

### 2. Edit the form properties.json file

It doesn't really make sense to have "places" in your hierarchy that can be deceased. It also doesn't make sense for somebody who is dead to die again. But can the administration of a health facility die? That is for you to decide.

This snippet is an example properties file which constrains the death form to show only for contacts which:

1. Have a [contact_type with "person: true"]({{% ref "apps/reference/app-settings/hierarchy" %}})
2. Are currently alive
3. Are patients within a family

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

### 3. Enable the death_reporting transition

Enable the [death_reporting transition]({{% ref "apps/reference/app-settings/transitions#death_reporting" %}}) transition.

```json
"transitions": {
    ...,
    "death_reporting": true
 }
```

Add the following section:

```json
"death_reporting": {
    "mark_deceased_forms": [
      "death_report"
    ],
    "date_field": "fields.date_of_death"
 }
```

 The `date_field` is optional. If a date of death is not provided, the date of the death report will be used. If your form has a field of type `date` asking for the date of the contact, use a path to that field in `date_field`.

### 4. Test the system

1. Create a contact that you expect to be able to die. View the contact's profile in the contacts tab.
2. Click on the "+ New Action" tab. You should see your "Death Report" form there with an appropriate title and icon.
3. Select and complete your Death Report.
4. View the "place" containing the deceased contact in the contacts tab. The contact will not appear as "deceased"
5. Sync your documents (this pushes the death report to the server)
6. Sync your documents again (this pulls down the transitioned contact document from the server)
7. The contact should now be hidden and accessable only via the "View deceased" flyout
8. If you specified a `date_field` in Step 3, confirm that the `date_of_death` attribute on the deceased contact matches the selected date in the death report.

### Recommended updates

#### Disable tasks for deceased contacts

If a contact is dead, you probably don't want to recommend that your users complete [Tasks]({{% ref "apps/features/tasks" %}}) for them. You can update your tasks's [appliesIf]({{% ref "apps/reference/tasks#tasksjs" %}}) function

```javascript
{
  appliesIf: (contact) => !contact.date_of_death && myLogic,
}
```

#### Prevent the display of other forms for deceased persons

You typically don't want to do health assessments for deceased patients, so you'll need to update your other app form's `properties.json` files to not display for dead contacts.

```json
{
	"context":  {
		"expression":  "!contact.date_of_death && myLogic",
    ...
	},
}
```

#### Condition card for "Date of Death"

On your [contact page]({{% ref "apps/reference/apps/reference/contact-page" %}}) you might want to add a condition card to display the date of the patient's death.

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

## Undoing a death report

Create a new app form to undo a death report. Add it to `undo_deceased_forms` (similar to `mark_deceased_forms`) in app_settings step 3 above.
