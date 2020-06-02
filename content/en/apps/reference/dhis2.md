---
title: "Aggregating Data for DHIS2"
linkTitle: "DHIS2"
weight: 5
description: >
  Instructions and schema for defining DHIS2 aggregate features
relevantLinks: >
keywords: dhis integration interoperability
---

{{% see-also page="apps/features/integrations/dhis2" title="DHIS2 Integration" %}}

## `app_settings.js .dhisDataSets[]`

|Property|Type|Description|Required|
|---|---|---|---|
id | `string` | The data set id from DHIS2 with which to integrate | Yes
name | `translation key` | The translation key of the DHIS2 data set name to be displayed | Yes

## Code samples

Configure the `id` and `translation_key` of the DHIS2 data set. The `id` corresponds to the `id` of the data set in the DHIS2 instance you want to integrate with. The `translation_key` corresponds to the name of the DHIS2 data set as it appears in the dropdown in the admin app.

### `app_settings.js`

```json
"dhisDataSets": [
  {
    "id": "VMuFODsyWaO",
    "name": "dhis.dataset.moh515"
  }
],
```
