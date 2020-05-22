---
title: "App Forms"
linkTitle: "App Forms"
weight: 5
description: >
  Properties of App forms
relevantLinks: >
  docs/apps/concepts/workflows
  docs/design/apps
---

### `forms/app/{form_name}.properties.json`

| property | description | required |
|---|---|---|
| `title`| The form's title seen in the app. Uses a localization array using the 2-letter code, not the translation keys discussed in the [Localization section](#localization). | yes |
| `icon` | Icon associated with the form. The value is the image's key in the `resources.json` file, as described in the [Icons section](#icons) | yes |
| `context` | The context defines when and where the form should be available in the app | no |
| `context.person` | Boolean determining if the form can be seen in the Action list for a person's profile. This is still subject to the `expression`. | no |
| `context.place` | Boolean determining if the form can be seen in the Action list for a person's profile. This is still subject to the `expression`. | no |
| `context.expression` | A JavaScript expression which is evaluated when a contact profile or the reports tab is viewed. If the expression evaluates to true, the form will be listed as an available action. The inputs `contact`, `user`, and `summary` are available. By default, forms are not shown on the reports tab, use `"expression": "!contact"` to show the form on the Reports tab since there is no contact for this scenario. | no |
