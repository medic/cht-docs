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

The native CHT database structure does not map directly to a [Fast Healthcare Interoperability Resources (FHIR)](http://www.hl7.org/fhir/) message format. To be compatible, we use a middleware to convert the CHT data structure into a standardized JSON format so the other systems can read it. See below the data workflow:

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
OpenHIM was utilised as the middleware component with [Mediators](http://openhim.org/docs/configuration/mediators/) to do the conversion. [Outbound Push]({{< ref "apps/reference/app-settings/outbound" >}}) is configured to make a request to the middleware when relevant documents are created or modified in the CHT. A Mediator then creates a FHIR resource, which is then routed to OpenHIM. OpenHIM routes the resource to any other configured systems.

Conversely to bring data into the CHT, OpenHIM is configured to route the updated resource to the Mediator, which then calls the relevant [CHT APIs]({{< ref "apps/reference/api" >}}) to update the document in the CHT database. This will then be replicated to users’ devices as per usual.

## Standards & Components

- [OpenHIE](https://ohie.org/): OpenHIE is an open-source framework for building interoperable health information systems. OpenHIE provides a set of standards and protocols for enabling different health systems and applications to communicate with each other.

- [OpenHIM](http://openhim.org/): OpenHIM is an open-source middleware platform that provides a central point of control for managing health information exchange (HIE). OpenHIM enables healthcare providers to connect different health systems and applications and provides a common interface for managing data exchange and security.

- [FHIR](http://www.hl7.org/fhir): FHIR is a standard for exchanging healthcare data electronically. FHIR provides a modern, web-based approach to exchanging healthcare data and is rapidly becoming the preferred standard for healthcare interoperability.

A reference application for this pattern is available in the [CHIS Interoperability repository](https://github.com/medic/cht-interoperability). 
This application implements a Loss to Follow Up (LTFU) workflow system for CHIS based on the OpenHIE LTFU Guide. 

## Frequently Asked Questions

### Is the CHT FHIR Compatible and does it have a FHIR API?

Yes. Mediators are one of the components of a CHT deployment and expose FHIR compatible APIs to the rest of the healthcare ecosystem.

### Does the CHT support legacy standards?

One of the advantages of using mediators is they are highly configurable to support different FHIR Implementation Guides, different FHIR versions, and other information standards, so the CHT can work with whatever systems are in the ecosystem.

### What about compatibility with future standards?

The flexibility of mediators also means the CHT is future-proof and can be configured to support future FHIR revisions or completely new standards. Because this can be configured in the mediator layer it's likely to be supported without any Core development required.

### What does the mediator do to the source data?

1. It transforms the structure from the CHT format to the required standardized format.
2. It can make requests for additional data. This could be querying the Client Registry for the patient's national ID number, or other services such as the Terminology service to translate conditions, medications, procedures, and so on into the required classification system.
3. Finally it passes the FHIR resource to the interoperability layer to be shared with other systems.

### What are the FHIR Resources utilized?

1. [Patient](https://www.hl7.org/fhir/patient.html)
2. [Encounter](https://build.fhir.org/encounter.html)
3. [Subscription](https://build.fhir.org/subscription.html)
4. [Organization](https://build.fhir.org/organization.html)
5. [Endpoint](https://build.fhir.org/endpoint.html)

You can find additional information and instructions for setting up locally in the [cht-interoperability repository](https://github.com/medic/cht-interoperability).

