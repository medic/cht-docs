---
title: contact-summary.templated.js
linkTitle: contact-summary.templated.js
weight: 2
description: >
  Customize fields, cards, and actions on profile pages
relatedContent: >
  building/forms/configuring/form-inputs
aliases:
   - /building/reference/contact-page
   - /apps/reference/contact-page
---

Contact profile pages display basic information about the contact along with their history and upcoming tasks.
A contact's profile page is defined by the [Fields](#contact-summary), [Cards](#condition-cards), and [Care Guides](#care-guides) available.

Helper variables and functions for the contact summary can be defined in `contact-summary-extras.js`. There are several variables available to inspect to generate the summary information:

| Variable | Description |
|---|---|
| `contact` | The currently selected contact. This has minimal stubs for the `contact.parent`, so if you want to refer to a property on the parent use `lineage` below.| 
| `reports` | An array of reports for the contact or for any of the contact's `person` children. Note that if the contact has more than 500 reports, only the 500 with the latest `reported_date` values will be provided. Prior to version `4.7.0`, only 50 reports were provided. |
| `lineage` | An array of the contact's parents (2.13+), eg `lineage[0]` is the parent, `lineage[1]` is the grandparent, etc. Each lineage entry has full information for the contact, so you can use `lineage[1].contact.phone`. `lineage` will include only those contacts which are visible to the logged in profile | 
| `targetDoc` | Doc with [`target`]({{< ref "technical-overview/db-schema#targets" >}} ) document of the contact, hydrated with the config information of every target it contains a value for. If there is no target document available (for example when viewing a contact that does not upload targets), this value will be `undefined`. This value might also be `undefined` if the contact has not yet synced the current target document. Added in `3.9.0`. |
| `uhcStats` | Object containing UHC stats information. Added in `v3.12.0` |
| `uhcStats.uhcInterval` | Object containing the start and end date of UHC reporting period, it is calculated from the `uhc.visit_count.month_start_date` defined in the [app settings]({{< ref "/building/reference/app-settings/#app_settingsjson" >}}). |
| `uhcStats.uhcInterval.start` | Timestamp, start date of the UHC reporting period. |
| `uhcStats.uhcInterval.end` | Timestamp, end date of the UHC reporting period. |
| `uhcStats.homeVisits` | Object containing the contact's home visits stats. The [contact's type]({{< ref "/building/reference/app-settings/hierarchy.md#app_settingsjson-contact_types" >}}) should have `count_visits` enabled and the [UHC visit count settings]({{< ref "/building/reference/app-settings/#app_settingsjson" >}}) should be defined, additionally this information is only available for users that have `can_view_uhc_stats` permission and that are not System Administrators. |
| `uhcStats.homeVisits.lastVisitedDate` | Timestamp, date of contact's last home visit. |
| `uhcStats.homeVisits.count` | Number of contact's home visits in the current reporting interval. |
| `uhcStats.homeVisits.countGoal` | Number, home visits goal, defined in the [UHC visit count settings]({{< ref "/building/reference/app-settings/#app_settingsjson" >}}). |
| `cht` | Object containing the [CHT API](#cht-api) for contact summary, targets and tasks. Added in `v3.12.0` |

## CHT API
{{< read-content file="building/reference/_partial_cht_api.md" >}}

## Contact Summary

Each field that can be shown on a contact's profile is defined as an object in the `fields` array of `contact-summary.templated.js`. The properties for each object determine how and when the field is shown.

### `contact-summary.templated.js .fields[]`

<!-- If you change this table, update the duplicate descriptions in ### Cards -->
| property | type | description | required |
|---|---|---|---|
| `label` | `string` | A translation key which is shown with the field. | yes |
| `icon` | `string` | The name of the icon to display beside this field, as defined through the Configuration > Icons page. | no |
| `value` | `string` | The value shown for the field. | yes |
| `filter` | `string` | The display filter to apply to the value, eg: `{ value: '2005-10-09', filter: 'age' }` will render as "11 years". Common filters are: `age`, `phone`, `weeksPregnant`, `relativeDate`, `relativeDay`, `fullDate`, `simpleDate`, `simpleDateTime`, `lineage`, `resourceIcon`, `translate`. For the complete list of filters, and more details on what each does, check out the code in [`webapp/src/ts/pipes` dir](https://github.com/medic/cht-core/tree/3.15.x/webapp/src/ts/pipes). | no |
| `width` | `integer` | The horizontal space for the field. Common values are 12 for full width, 6 for half width, or 3 for quarter width. Default 12. | no |
| `translate` | `boolean` | Whether or not to translate the `value`. Defaults to false. | no |
| `context` | `object` | When `translate: true` and `value` uses [translation variables](https://angular-translate.github.io/docs/#/guide/06_variable-replacement), this value should provide the translation variables. | no |
| `appliesIf` | `function()` | Return `true` if the field should be shown, and `false` if it should be hidden. Default is `true`. | no |
| `appliesToType` | `string[]` | Filters the contacts for which `appliesIf` will be evaluated. For example, `['person']` or `['clinic', 'health_center']`. It defaults to all types if it is not defined. | no |

<!-- TODO: See [How to configure profile pages]() for an example.  -->

## Condition Cards

Each condition card is defined as a card object in the `cards` array of `contact-summary.templated.js`. Condition cards are conditional and are configured to appear when a certain report is submitted or condition is met. The properties for each object determine how and when the card and its fields are shown.

### `contact-summary.templated.js .cards[]`

<!-- If you change the field data in this table, update the duplicate descriptions in ### Fields -->
| property | type | description | required |
|---|---|---|--|
| `label` | `translation key` | Label on top of card. | yes |
| `appliesToType` | `string[]` | A filter, so `appliesIf` is called only if the contact's type matches one or more of the elements. For example, `['person']`. Note that `['report']` is also allowed to create a report card. But, you cannot use it in conjunction with a contact's type. It defaults to all types if it is not defined. | no |
| `appliesIf` | `function(report)` or `boolean` | Return true if the field should be shown. | no |
| `modifyContext` | `function(context, report)` | Used to modify or add data which is passed as input to forms filled from the contact page. | no |
| `fields` | `Array[]` of fields | The content of the card. | yes |
| `fields[n].appliesIf` | `boolean` or `function(report)` | Same as Fields.appliesIf above. | |
| `fields[n].label` | `string` or `function(report)` | Label shown with the field. | yes |
| `fields[n].icon` | `string` or `function(report)` | The name of the icon to display beside this field, as defined through the Configuration > Icons page. | no |
| `fields[n].value` | `string` or `function(report)` | The value shown for the field. | yes |
| `fields[n].filter` | `string` or `function(report)` | The display filter to apply to the value, eg: `{ value: '2005-10-09', filter: 'age' }` will render as "11 years". Common filters are: `age`, `phone`, `weeksPregnant`, `relativeDate`, `relativeDay`, `fullDate`, `simpleDate`, `simpleDateTime`, `lineage`, `resourceIcon`, `translate`. For the complete list of filters, and more details on what each does, check out the code in [`webapp/src/ts/pipes` dir](https://github.com/medic/cht-core/tree/3.15.x/webapp/src/ts/pipes). | no |
| `fields[n].width` | `integer` or `function(report)` | The horizontal space for the field. Common values are 12 for full width, 6 for half width, or 3 for quarter width. Default 12. | no |
| `fields[n].translate` | `boolean` or `function(report)` | Whether or not to translate the `value`. Defaults to false. | no |
| `fields[n].context` | `object` | When `translate: true` and `value` uses [translation variables](https://angular-translate.github.io/docs/#/guide/06_variable-replacement), this value should provide the translation variables. Only supports properties `count` and `total` on cards. | no |

<!-- TODO: See [How to configure profile pages]() for an example. -->

## Care Guides

Each care guide accessible from a contact profile is defined as an [App Form]({{< ref "building/forms/app" >}}). Context information can be provided to forms via the `context` object of `contact-summary.templated.js`.

To show an App Form on a contact's profile, the form's `expression` field in its properties file must evaluate to true for that contact. The context information from the profile is accessible as the variable `summary`.

The context data is also available directly within the app forms' XForm calculations, as `instance('contact-summary')/context/${variable}`. For instance if `context.is_pregnant` is used in the contact summary, it can be accessed in an XForm field's calculation as `instance('contact-summary')/context/is_pregnant`. Note that these fields are not available when editing a previously completed form, or when accessing the form from outside of the profile page.

<!-- TODO: See [How to configure profile pages]() and [How to build app forms]() for examples and more information. -->

## Code samples

The following samples show how fields, cards, and care guide context comes together in the `contact-summary.templated.js` file.

### `contact-summary.templated.js`
```js
module.exports = {
  context: {
    use_cases: {
      anc: isCoveredByUseCaseInLineage(lineage, 'anc'),
      pnc: isCoveredByUseCaseInLineage(lineage, 'pnc'),
    },
  },

  fields: [
    { appliesToType: 'person',  label: 'patient_id', value: contact.patient_id, width: 4 },
    { appliesToType: 'person',  label: 'contact.age', value: contact.date_of_birth, width: 4, filter: 'age' },
    { appliesToType: 'person',  label: 'contact.parent', value: lineage, filter: 'lineage' },
    { appliesToType: '!person', appliesIf: function() { return contact.parent && lineage[0]; }, label: 'contact.parent', value: lineage, filter: 'lineage' },
  ],

  cards: [
    {
      label: 'contact.profile.pregnancy',
      appliesToType: 'report',
      appliesIf: extras.isActivePregnancy,
      fields: [
        {
          label: 'contact.profile.edd',
          value: function(report) { return report.fields.edd_8601; },
          filter: 'relativeDay',
          width: 12
        },
        {
          label: 'contact.profile.visit',
          value: 'contact.profile.visits.of',
          translate: true,
          context: {
            count: function(report) { return extras.getSubsequentVisits(report).length; },
            total: 4,
          },
          width: 6,
        },
        {
          label: 'contact.profile.risk.title',
          value: function(report) { return extras.isHighRiskPregnancy(report) ? 'high' : 'normal'; },
          translate: true,
          width: 5,
          icon: function(report) { return extras.isHighRiskPregnancy(report) ? 'risk' : ''; },
        },
      ],
      modifyContext: function(ctx) {
        ctx.pregnant = true; // don't show Create Pregnancy Report button
      },
    },
  ],
};
```

### `contact-summary-extras.js`

```js
module.exports = {
  isActivePregnancy : function(report) {
    // ...
  },
  isCoveredByUseCaseInLineage: function(lineage, usecase) {
    // ...
  },
  isHighRiskPregnancy: function(report) {
    // ...
  },
  getSubsequentVisits: function(report) {
    // ...
  },
};
```

## Build

To update the Contact profiles for an app, changes must be compiled into `app-settings`, then uploaded.


```shell
  cht --local compile-app-settings backup-app-settings upload-app-settings
```
