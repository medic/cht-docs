---
title: "Database document hydration"
linkTitle: "Document hydration"
weight: 2
description: >
    
keywords: hydration schema  
relatedContent: >
  core/overview/db-schema
---

Documents are connected with each other via their document `_id`. 
For example: 
- a contact document is connected to its parent by storing their `_id` in the `parent` property 
- a report document is connected to its submitter by storing their `_id` in the `contact` property

{{% see-also page="core/overview/db-schema" title="DB Schema" %}}

To optimize database storage, documents are "minified" when stored and are "hydrated" when they are "used" by the app.

### Minification

Minification represents replacing a connected document's content with an object that ony contains its id.    

Unminified object:
```json
{
  "_id": "clinic_uuid",
  "name": "Clinic",
  "type": "clinic",
  "parent": {
    "_id": "health_center_id",
    "name": "Health Center",
    "type": "health_center",
    "parent": {
      "_id": "district_hospital_id",
      "name" : "District",
      "type": "district_hospital"
    }
  },
  "contact": {
    "_id": "contact_id",
    "name": "Primary contact",
    "phone": "555 111 222"
  },
  "linked_docs": {
    "tag1": {
      "_id": "sibling_id",
      "name": "Sibling clinic",
      "type": "clinic"
    },
    "tag2": {
      "_id": "supervisor_id",
      "name": "The supervisor",
      "type": "person"
    }
  }
}
``` 
when minified, becomes:
```json
{
  "_id": "clinic_uuid",
  "name": "Clinic",
  "type": "clinic",
  "parent": {
    "_id": "health_center_id",
    "parent": {
      "_id": "district_hospital_id"
    }
  },
  "contact": {
    "_id": "contact_id"
  },
  "linked_contacts": {
    "tag1": "sibling_id",
    "tag2": "supervisor_id"
  }
}
```

The following properties are minified:
1. `parent` and recursively, every ancestor
1. `contact`
1. `patient` and `place` are removed from reports
1. *As of 3.10* `linked_docs`

### Hydration

Hydration represents the inverse process to minification, where a stored id is replaced with the corresponding document's content. 
  
Minified doc: 
```json
{
  "_id": "clinic_uuid",
  "name": "Clinic",
  "type": "clinic",
  "parent": {
    "_id": "health_center_id",
    "parent": {
      "_id": "district_hospital_id"
    }
  },
  "contact": {
    "_id": "contact_id"
  },
  "linked_contacts": {
    "tag1": "sibling_id",
    "tag2": "supervisor_id"
  }
}
```
when hydrated becomes:
```json
{
  "_id": "clinic_uuid",
  "name": "Clinic",
  "type": "clinic",
  "parent": {
    "_id": "health_center_id",
    "name": "Health Center",
    "type": "health_center",
    "contact": {
      "_id": "supervisor_id",
      "name": "Supervisor",
      "type": "person",
      "parent": { 
        "_id": "parent_id" 
      }
    },
    "parent": {
      "_id": "district_hospital_id",
      "name" : "District",
      "type": "district_hospital",
      "contact": {
        "_id": "manager_id",
        "name": "Manager",
        "type": "person",
        "parent": {
          "_id": "parent_id"
        }       
      }
    }
  },
  "contact": {
    "_id": "contact_id",
    "name": "Primary contact",
    "phone": "555 111 222",
    "parent": {
      "_id": "parent_id"
    } 
  },
  "linked_docs": {
    "tag1": {
      "_id": "sibling_id",
      "name": "Sibling clinic",
      "type": "clinic"
    },
    "tag2": {
      "_id": "supervisor_id",
      "name": "The supervisor",
      "type": "person"
    }
  }
}
``` 

There are two types of hydration:
* *shallow* hydration - when the id is replaced with the document's content
* *deep* hydration - when the id is replaced with the document's content and, recursively, deeply hydrate every parent 

##### A hydrated contact has

- deeply hydrated parent
- shallowly hydrated primary contact
- *as of 3.10* shallowly hydrated linked docs

##### A hydrated report has
- a deeply hydrated submitter
- a deeply hydrated patient





