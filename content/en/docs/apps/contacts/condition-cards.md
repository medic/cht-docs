---
title: "Defining Condition Cards"
weight: 2
date: 2017-01-05
description: >
  Assigning fine grained settings for user roles
---

Each condition card is defined as a card object in the `cards` array of `contact-summary.templated.js`. The properties for each object determine how and when the card and its fields are shown.

<!-- If you change the field data in this table, update the duplicate descriptions in ### Fields -->
| property | type | description | required |
|---|---|---|--|
| `label` | `translation key` | Label on top of card. | yes |
| `appliesToType` | `string[]` | A filter, so `appliesIf` is called only if the contact's type matches one or more of the elements. For example, `['person']`. Please, note that `['report']` is also allowed to create a report card. But, you cannot use it in conjunction with a contact's type. | no |
| `appliesIf` | `function()` or `boolean` | Return true if the field should be shown. | no |
| `modifyContext` | `function(context)` | Used to modify or add data which is passed as input to forms filled from the contact page. | no |
| `fields` | `Array[]` of [fields](#fields) | The content of the card. | yes |
| `fields[n].appliesIf` | `boolean` or `function(report)` | Same as Fields.appliesIf above. | |
| `fields[n].label` | `string` or `function(report)` | Label shown with the field. | yes |
| `fields[n].icon` | `string` or `function(report)` | The name of the icon to display beside this field, as defined through the Configuration > Icons page. | no |
| `fields[n].value` | `string` or `function(report)` | The value shown for the field. | yes |
| `fields[n].filter` | `string` or `function(report)` | The display filter to apply to the value, eg: `{ value: '2005-10-09', filter: 'age' }` will render as "11 years". Common filters are: `age`, `phone`, `weeksPregnant`, `relativeDate`, `relativeDay`, `fullDate`, `simpleDate`, `simpleDateTime`, `lineage`, `resourceIcon`, `translate`. For the complete list of filters, and more details on what each does, check out the code in [`medic/webapp/src/js/filters` dir](https://github.com/medic/medic/tree/master/webapp/src/js/filters). | no |
| `fields[n].width` | `integer` or `function(report)` | The horizontal space for the field. Common values are 12 for full width, 6 for half width, or 3 for quarter width. Default 12. | no |
| `fields[n].translate` | `boolean` or `function(report)` | Whether or not to translate the `value`. Defaults to false. | no |
| `fields[n].context` | `object` | When `translate: true` and `value` uses [translation variables](https://angular-translate.github.io/docs/#/guide/06_variable-replacement), this value should provide the translation variables. Only supports properties `count` and `total` on cards. | no |

See [How to configure profile pages]() for an example. 