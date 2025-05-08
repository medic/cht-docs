---
title: "Track Wealth Quintiles"
linkTitle: "Quintiles"
weight: 7
aliases:
   - /building/guides/forms/wealth-quintiles
   - /apps/guides/forms/wealth-quintiles
---

{{< hextra/hero-subtitle >}}
  How to track wealth quintiles on the profile of each family member in the household
{{< /hextra/hero-subtitle >}}

Household surveys with questions about the home, possessions, and access to safe drinking water have been used to create equity score and improve the targeting of health services. This guide will cover how quintile information from a household survey can be used in customizing care for individual household members. For example, the equity quintile can be used to increase the number of pregnancy follow-ups for women in specific households, or to display specific notes or questions within patient forms.

For quintile information from a household survey to be used for people in that household, a form about a place must contain `NationalQuintile` and/or `UrbanQuintile` fields at the top level. When that form is submitted all the people belonging to that place will get the corresponding `wealth_quintile_national` and `wealth_quintile_urban` fields. Those fields can then be used by forms, tasks, and contact profiles accordingly.

Note that the `can_write_wealth_quintiles` permission is needed for the user that is submitting the form.

### Sample form

| type | name | label | relevant | appearance | calculate | ... |
|---|---|---|---|---|---|---|				
| string | place_id | | | select-contact type-household
| integer | NationalQuintile | National Quintile		
| integer | UrbanQuintile | Urban Quintile

### Sample Report


``` json
{
  "form": "family_survey",
  "type": "data_record",
  "content_type": "xml",
  "fields": {
    "place_id": "23c7ab6e-6ea5-4f9f-9ffa-f00a1e30278d",
    "NationalQuintile": "5",
    "UrbanQuintile": "3"
  }
}
```

### Sample Contact

``` json 
{
  "_id": "c148d0c7-b200-47f6-a891-3f55c78eda9b",
  "_rev": "3-746a7c8ecb15dc1f43bfa13eba2afbbe",
  "type": "person",
  "name": "Jane Smith",
  "notes": "",
  "sex": "female",
  "date_of_birth_method": "approx",
  "date_of_birth": "1987-12-10",
  "phone": "",
  "alternate_phone": "",
  "external_id": "",
  "reported_date": 1607530340715,
  "parent": {
    "_id": "23c7ab6e-6ea5-4f9f-9ffa-f00a1e30278d",
    "parent": {
      "_id": "8ed3600f-23e2-4446-8ff4-2528067085e7"
    }
  },
  "wealth_quintile_national": "5",
  "wealth_quintile_urban": "3"
}
```
