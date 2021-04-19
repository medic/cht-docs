# Building A Death Report Workflow
#### Guide for setting up a comprehensive death report workflow.

This tutorial will take you through setting up a comprehensive death report workflow. This includes laying out a death report form as well as handling all the configurations needed for wiring it up in the CHT.
By the end of the tutorial you should be able to:
-   View the death report menu
-   Open, fill and submit a death report form for a contact
-   Display all the deceased contacts of an area

## Required resources

Before you begin you need to :

1.  have a working CHT development environment (see docs or this)
2.  Know how to build an app form in the CHT ([https://docs.communityhealthtoolkit.org/apps/tutorials/app-forms/](https://docs.communityhealthtoolkit.org/apps/tutorials/app-forms/))
3.  know how to set form properties ([https://docs.communityhealthtoolkit.org/apps/tutorials/form-properties/](https://docs.communityhealthtoolkit.org/apps/tutorials/form-properties/))
4.  know how to configure tasks ([https://docs.communityhealthtoolkit.org/apps/tutorials/tasks/](https://docs.communityhealthtoolkit.org/apps/tutorials/tasks/))
5.  know about targets ([https://docs.communityhealthtoolkit.org/apps/tutorials/targets/](https://docs.communityhealthtoolkit.org/apps/tutorials/targets/))

We will briefly explain most of these concepts on the fly, but it is important to understand them well in order to get the most out of this guide.

## Implementation Steps
### 1. Layout the form
To create the form view, the first step is to create the XLSX file that best matches the proposed design. It should be noted that a death report form is not very long (usually two pages, one for filling in the elements of the report and another for the summary). An example death form XLSX file below:

| name | label |
|--|--|
|  |  |

Then you have to compile the form through the medic-conf tool to convert it into a view in the application.
The form compilation phase then generates two additional files. An <form_code>.xml file which actually corresponds to the file loaded and interpreted by the CHT for the view and another <form_code> .properties.json file. <form_code> being the form identifier (very often the identifier is also the name of the lowercase form with spaces replaced by underscores). We will not touch the XML file, it is just a file generated directly from the XLSX file. The file that interests us for the rest is the <form_code> .properties.json.

### 2. Edit the form properties.json file
The <form_name>.properties.json file allows you to add logic that ensures that the right action appears for the right contacts (people and places). For instance, a death form will only appear for person contacts on the CHT who are alive. You can learn more about form properties here ([https://docs.communityhealthtoolkit.org/apps/tutorials/form-properties/](https://docs.communityhealthtoolkit.org/apps/tutorials/form-properties/))
In our case, if the file doesn’t already exist, you’ll create a file named <form_name>.properties.json in the forms/app folder. Then open that file and add the following code.  
```json
{
	"context":  {
		"expression":  "contact.type === 'person' && summary.alive && !summary.muted && user.parent.type === 'health_center'",
		"person":  true,
		"place":  false
	},
	"icon":  "icon-death-general",
	"title":  [
		{
			"locale":  "en",
			"content":  "Report death"
		},
		{
			"locale":  "fr",
			"content":  "Signaler un décès"
		}
	]
}
```
The code below is made up of 3 sections (context, icon and title):
 - the context is the section which allows to define the display rules of the form. In our case we have 3 rules which basically allow us to restrict our form to person type contact who are alive, not muted and who belong to a health center. This rule is not fixed and needs to be adapted. But for the most part this is what we need for a death form.
 - the icon is the part where we define the icon of the death form. This icon appears in the actions menu next to the button that opens the death form.
 - the title is the part where we define the title of the action button that opens the death form. In our case we have an array of two elements in the title section. This is to manage the translations. Our two elements correspond to the titles in English and French.

### 3. Edit the app_settings.json file
As the name suggests, all the settings that control our application are done in this file. For more information on this file, please refer to [this documentation page](https://docs.communityhealthtoolkit.org/apps/reference/app-settings/). It is a very large file, but there is just a small part that interests us in this file and that is the part of the transitions.

Transitions are functions executed when database documents change. When sentinel detects a document has changed it runs transitions against the doc. These transitions can be used to generate a short form patient id or assign a report to a facility.

We need to declare transitions for our death reporting workflow. To do this, look for the `transitions` section in the `app_settings.json` file. If the section exists, add the following code `"death_reporting": true` else create the section and add the previous code. At the end, the transitions should look like this :

    "transitions": {
        ...,
        "death_reporting": true
     }
Just below the transitions, add the following code:

    "death_reporting": {
        "mark_deceased_forms": [
          "death_report"
        ],
        "date_field": "fields.date_of_death"
     }
 

### 4. Work on the contact summary files

    

### 5. Disable tasks and targets

    

### 6. Prevent the display of other forms for deceased persons

    

### 7. Work on translations

