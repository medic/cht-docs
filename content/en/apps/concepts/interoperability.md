---
title: Interoperability
linkTitle: "Interoperability"
weight: 8
description: >
  Two way data synchronization between the CHT Core and other health systems. 
keywords: interoperability integrations fhir icd openhie openhim
relatedContent: >
  apps/features/integrations
---

## Introduction 

Interoperability refers to the ability of different systems and applications to communicate with each other and exchange data seamlessly.With interoperability, patient information can be seen, exchanged, and used across different platforms that may be disparate or relatively similar. The information/data exchanged has to be understood across the different software for these systems to become interoperable. 

# CHT Interoperability

The structure of documents in the CHT database reflect the configuration of the system, and therefore do not map directly to a FHIR message format. As the CHT is not natively FHIR standardized, we use a middleware to convert the CHT data structure into a standardized form so the other systems can read it.

{{< figure src="flow.png" link="flow.png" >}}

Interoperability is the best practice for health systems because it allows information from one system to be shared with one or more other systems with no additional development. Interoperability allows technical teams to scale in an efficient and repeatable manner due to the already predefined standards. 

## Standards & Components

Below is a list standards, components and reference information for interoperability:

- [OpenHIE](https://ohie.org/): OpenHIE is an open-source framework for building interoperable health information systems. OpenHIE provides a set of standards and protocols for enabling different health systems and applications to communicate with each other.

- [OpenHIM](http://openhim.org/): OpenHIM is an open-source middleware platform that provides a central point of control for managing health information exchange (HIE). OpenHIM enables healthcare providers to connect different health systems and applications and provides a common interface for managing data exchange and security.

- [FHIR](http://www.hl7.org/fhir): FHIR is a standard for exchanging healthcare data electronically. FHIR provides a modern, web-based approach to exchanging healthcare data and is rapidly becoming the preferred standard for healthcare interoperability.

# Loss to Follow Up Workflow

This workflow describes a use case where a health facility/requesting system generates a list of patients who have missed appointments for follow-up through on the CHT. A Community Health Worker (CHW) physically visits the patients who missed the appointments and encourages them to visit the health facility. The follow-up process can also be conducted over phone or text messaging.
In the context of the proof of concept, the intended users of the interoperable systems are Community Health Workers (CHWs) on the CHT side and Healthcare Givers on the requesting system side. System administrators can access the mediator on the administration console.

The Interoperating Systems
- [CHT](https://docs.communityhealthtoolkit.org/): Community Health Toolkit.
- [OpenHIM](http://openhim.org/): Mediator (middleware).
- Requesting System: [Postman](https://www.postman.com/) was used for testing purposes.

OpenHIM was chosen as the main component of the interoperability layer and custom mediators were built to deal with the different workflows as it provides a central point of control for managing data exchange and security.

{{< figure workflows="LTFU Sequence Diagram.png" link="LTFU Sequence Diagram.png" >}}

Conversely to bring data in to the CHT, OpenHIM should be configured to route the updated resource to a Mediator, which then calls the relevant CHT APIs to update the document in the CHT database. This will then be replicated to users' devices as per usual.

# Important Links
- A reference to an application repository can be accessed in the [CHT-interoperability repository](https://github.com/medic/cht-interoperability).
- This [README](https://github.com/medic/cht-interoperability#readme) contains documentation on the CHT-interoperability project.
- Test instances:
- - [CHT](https://interop-cht-test.dev.medicmobile.org/medic/login?redirect=https%3A%2F%2Finterop-cht-test.dev.medicmobile.org%2F)
- - [OpenHIM Admin Console](https://interoperability.dev.medicmobile.org/#!/login) 


