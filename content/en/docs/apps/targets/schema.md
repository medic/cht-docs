---
title: "Defining Targets"
weight: 1
date: 2017-01-05
description: >
  Instructions and schema for defining targets
---

All targets are defined in the `targets.js` file as an array of objects according to the Targets schema defined below. Each object corresponds to a target widget that shows in the app. The order of objects in the array defines the display order of widgets on the Targets tab. The properties of the object are used to define when the target should appear, what it should look like, and the values it will display.

{{% alert title="Note" %}}

To build your targets into your app, you must compile them into app-settings, then upload them to your instance. 

`medic-conf --local compile-app-settings backup-app-settings upload-app-settings`

{{% /alert %}}


| property | type | description | required |
|---|---|---|---|
| `id` | `string` | An identifier for the target. Used for querying task completeness. | yes, unique |
| `icon` | `string` | The icon to show alongside the task. Should correspond with a value defined in `resources.json`. | no |
| `translation_key` | `translation key` | Translation key for the title of this target. | no, but recommended |
| `subtitle_translation_key` | `translation key` | Translation key for the subtitle of this target. If none supplied the subtitle will be blank. | no |
| `percentage_count_translation_key` | `translation key` | Translation key for the percentage value detail shown at the bottom of the target, eg "(5 of 6 deliveries)". The translation context has `pass` and `total` variables available. If none supplied this defaults to `targets.count.default`. | no |
| `context` | `string` | A string containing a JavaScript expression. This widget will only be shown if the expression evaluates to true. Details of the current user is available through the variable `user`. | no |
| `type` | `'count'` or `'percent'` | The type of the widget. | yes |
| `goal` | `integer` | For targets with `type: 'percent'`, an integer from 0 to 100. For `type: 'count'`, any positive number. If there is no goal, put -1. | yes |
| `appliesTo` | `'contacts'` or `'reports'` | Do you want to count reports or contacts? This attribute controls the behavior of other attributes herein. | yes |
| `appliesToType` | If `appliesTo: 'reports'`, an array of form codes. If `appliesTo: 'contacts'`, an array of contact types. | Filters the contacts or reports for which `appliesIf` will be evaluated. For example, `['person']` or `['clinic', 'health_center']`. For example, `['pregnancy']` or `['P', 'pregnancy']`. | no |
| `appliesIf` | `function(contact, report)` | If `appliesTo: 'contacts'`, this function is invoked once per contact and `report` is undefined. If `appliesTo: 'reports'`, this function is invoked once per report. Return true to count this document. For `type: 'percent'`, this controls the denominator. | no |
| `passesIf` | `function(contact, report)` | For `type: 'percent'`, return true to increment the numerator. | yes, if `type: 'percent'`. Forbidden when `groupBy` is defined. |
| `date` | `'reported'` or `'now'` or `function(contact, report)` | When `'reported'`, the target will count documents with a `reported_date` within the current month. When `'now'`, target includes all documents. A function can be used to indicate when the document should be counted. Default is `'reported'`. | no |
| `idType` | `'report'` or `'contact'` or `function(contact, report)` | The target's values are incremented once per unique ID. To count individual contacts that have one or more reports that apply, use `'contact'`. Use `'report'` to count all reports, even if there are multiple that apply for a single contact. If you need more than a single count for each applying contact or report then a custom function can be used returning an array with unique IDs — one element for each count. | no |
| `groupBy` | `function(contact, report)` returning string | Allows for target ids to be aggregated and scored in groups. Not required for most targets. Use with passesIfGroupCount. | no |
| `passesIfGroupCount` | `object` | The criteria to determine if the target ids within a group should be counted as passing | yes when `groupBy` is defined |
| `passesIfGroupCount.gte` | `number` | The group should be counted as passing if the number of target ids in the group is greater-than-or-equal-to this value | yes when `groupBy` is defined |
| `dhis` | `object` or `object[]` | Settings relevant to the [DHIS2 Integration](./dhis-integration.md) | no
| `dhis[n].dataElement` | `string` | The hash id of a data element configured in the DHIS2 data set you're integrating with | yes
| `dhis[n].dataSet` | `string` | The hash id of the data set that contains the data element you're integrating with. If this is left undefined, the data element will appear in all data sets. | no
| `visible` | `boolean` | Whether the target is visible in the targets page. **Default: true** | no | 
