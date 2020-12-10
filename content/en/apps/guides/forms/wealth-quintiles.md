---
title: "Tracking Wealth Quintiles"
linkTitle: "Quintiles"
weight: 
description: >
  How to track wealth quintiles on the profile of each family member in the household
relatedContent: >

---


A few things are needed to get the data copied onto the family members. 

1. A report submitted with either `doc.fields.NationalQuintile` or `doc.fields.UrbanQuintile` or both. 
1. An offline user that has the permission of `can_write_wealth_quintiles`. 
1. Once the form is submitted the contact will then get the fields `"wealth_quintile_national"` and ` "wealth_quintile_urban"` if they are provided in the form.


### Sample Report


``` json
{
  "form": "family_survey",
  "type": "data_record",
  "content_type": "xml",
  "fields": {
    "place_id": "23c7ab6e-6ea5-4f9f-9ffa-f00a1e30278d",
    "place_name": "Medic Area",
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