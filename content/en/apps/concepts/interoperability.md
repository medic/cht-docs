---
title: Interoperability
linkTitle: "Interoperability"
weight: 8
description: >
  Exchanging information between the CHT Core and other health systems 
keywords: interoperability integrations fhir icd openhie openhim
relatedContent: >
  apps/features/integrations
---

## Introduction 

Interoperability refers to the ability of different health information systems and applications to communicate with each other and exchange data seamlessly. With interoperability, patient information can be seen, exchanged, and used across different platforms. The information/data exchanged has to be understood across the different software for these systems to become interoperable. This is different from _integration_ which requires custom development to connect two specific systems together.

Interoperability is the best practice for health systems because it allows information from one system to be shared with one or more other systems with no additional development. Interoperability allows technical teams to scale in an efficient and repeatable manner due to the already predefined standards. 

## CHT Interoperability

The native CHT database structure does not map directly to a [Fast Healthcare Interoperability Resources (FHIR)](http://www.hl7.org/fhir/) message format. To be compatible, we use a middleware to convert the CHT data structure into a standardized JSON format so the other systems can read it.

```mermaid
graph LR
cht[CHT]
mediator_a([Mediator])
mediator_b([Mediator])
openhim[OpenHIM]

cht -- Outbound push\nfa:fa-arrow-right --- mediator_a
cht -- API request\nfa:fa-arrow-left --- mediator_b
mediator_a -- Request\nfa:fa-arrow-right --- openhim
mediator_b -- Channel\nfa:fa-arrow-left --- openhim
```

## Standards & Components


- [OpenHIE](https://ohie.org/): OpenHIE is an open-source framework for building interoperable health information systems. OpenHIE provides a set of standards and protocols for enabling different health systems and applications to communicate with each other.

- [OpenHIM](http://openhim.org/): OpenHIM is an open-source middleware platform that provides a central point of control for managing health information exchange (HIE). OpenHIM enables healthcare providers to connect different health systems and applications and provides a common interface for managing data exchange and security.

- [FHIR](http://www.hl7.org/fhir): FHIR is a standard for exchanging healthcare data electronically. FHIR provides a modern, web-based approach to exchanging healthcare data and is rapidly becoming the preferred standard for healthcare interoperability.


A reference application for this pattern is available in the [CHIS Interoperability repository](https://github.com/medic/cht-interoperability). 
This application implements a Loss to Follow Up (LTFU) workflow system for CHIS based on the [OpenHIE LTFU Guide](https://wiki.ohie.org/display/SUB/Use+Case+Summary:+Request+Community+Based+Follow-Up). 

## Important Links
- [cht-interoperability repository](https://github.com/medic/cht-interoperability): A reference application for the LTFU workflow
- [CHT Instance with LTFU configuration](https://interop-cht-test.dev.medicmobile.org/medic/login?redirect=https%3A%2F%2Finterop-cht-test.dev.medicmobile.org%2F)
- [OpenHIM Admin Console](https://interoperability.dev.medicmobile.org/#!/login) 

