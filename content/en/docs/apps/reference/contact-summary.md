---
title: "Contact Summary"
linkTitle: "Contact Summary"
weight: 5
description: >
  Schema for contact profile summary card
relevantLinks: >
  docs/apps/features/contacts
  docs/apps/concepts/hierarchies
---

### `contact-summary.templated.js .fields[]`

| property | type | description | required |
|---|---|---|---|
| `label` | `string` | A translation key which is shown with the field. | yes |
| `icon` | `string` | The name of the icon to display beside this field, as defined through the Configuration > Icons page. | no |
| `value` | `string` | The value shown for the field. | yes |
| `filter` | `string` | The display filter to apply to the value, eg: `{ value: '2005-10-09', filter: 'age' }` will render as "11 years". Common filters are: `age`, `phone`, `weeksPregnant`, `relativeDate`, `relativeDay`, `fullDate`, `simpleDate`, `simpleDateTime`, `lineage`, `resourceIcon`, `translate`. For the complete list of filters, and more details on what each does, check out the code in [`medic/webapp/src/js/filters` dir](https://github.com/medic/medic/tree/master/webapp/src/js/filters). | no |
| `width` | `integer` | The horizontal space for the field. Common values are 12 for full width, 6 for half width, or 3 for quarter width. Default 12. | no |
| `translate` | `boolean` | Whether or not to translate the `value`. Defaults to false. | no |
| `context` | `object` | When `translate: true` and `value` uses [translation variables](https://angular-translate.github.io/docs/#/guide/06_variable-replacement), this value should provide the translation variables. | no |
| `appliesIf` | `function()` or `boolean` | Return true if the field should be shown. | no |
| `appliesToType` | `string[]` | Filters the contacts for which `appliesIf` will be evaluated. For example, `['person']` or `['clinic', 'health_center']`. | no |
