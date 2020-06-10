---
title: "Database document hydration"
linkTitle: "Document hydration"
weight: 2
description: >
    
keywords: hydration schema  
relatedContent: >
  core/overview/db-schema
---

Documents can be connected with other documents. For example: a contact document is connected to its parent document or a report document is connected to its submitter document.

To optimize database storage, documents are "minified" when stored and are "hydrated" when they are "used" in the app.

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
1. `parent` along with every other ancestor in the hierarchy
1. `contact`
1. `patient` and `place` (for reports) 
1. *As of 3.10* `linked_docs`

### Hydration

Hydration represents the inverse process to minification, where a stored id is replaced with the connected document's content. 
  
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
      
    },
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


