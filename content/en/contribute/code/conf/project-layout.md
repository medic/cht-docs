---
title: "Project layout"
linkTitle: "Project layout"
weight: 1
---

This tool expects a project to be structured as follows:
```
example-project/
	.eslintrc
	app_settings.json
	contact-summary.js
	privacy-policies.json
	privacy-policies/
	    language1.html
	    …
	purge.js
	resources.json
	resources/
		icon-one.png
		…
	targets.js
	tasks.js
	task-schedules.json
	forms/
		app/
			my_project_form.xlsx
			my_project_form.xml
			my_project_form.properties.json
			my_project_form-media/
				[extra files]
				…
		contact/
			person-create.xlsx
			person-create.xml
			person-create-media/
				[extra files]
				…
		…
		…
	translations/
		messages-xx.properties
		…
```

If you are starting from scratch you can initialise the file layout using the initialise-project-layout action:
```
cht initialise-project-layout
```

# Derived configs

Configuration can be inherited from another project, and then modified.  This allows the `app_settings.json` and contained files (`task-schedules.json`, `targets.json` etc.) to be imported, and then modified.

To achieve this, create a file called `settings.inherit.json` in your project's root directory with the following format:
```
{
	"inherit": "../path/to/other/project",
	"replace": {
		"keys.to.replace": "value-to-replace-it-with"
	},
	"merge": {
		"complex.objects": {
			"will_be_merged": true
		}
	},
	"delete": [
		"all.keys.listed.here",
		"will.be.deleted"
	],
	"filter": {
		"object.at.this.key": [
			"will",
			"keep",
			"only",
			"these",
			"properties"
		]
	}
}
```
