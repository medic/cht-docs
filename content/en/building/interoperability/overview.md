---
title: Overview
linkTitle: "Overview"
weight: 1
description: >
  Interoperability key concepts
keywords: interoperability integrations fhir icd openhie openhim
relatedContent: >
  building/integrations
  building/interoperability/cht-config
  building/interoperability/openhim
  building/interoperability/ltfu
aliases:
  - /apps/concepts/interoperability
  - /building/concepts/interoperability
---

## Introduction 

Interoperability refers to the ability of different health information systems and applications to communicate with each other and exchange data seamlessly. With interoperability, patient information can be seen, exchanged, and used across different platforms. The information/data exchanged has to be understood across the different software for these systems to become interoperable. This is different from _integration_ which requires custom development to connect two specific systems together.

Interoperability is the best practice for health systems because it allows information from one system to be shared with one or more other systems with no additional development. Interoperability allows technical teams to scale in an efficient and repeatable manner due to the already predefined standards. 

## Standards & Components

- [OpenHIE](https://ohie.org/): OpenHIE is an open-source framework for building interoperable health information systems. OpenHIE provides a set of standards and protocols for enabling different health systems and applications to communicate with each other.

- [OpenHIM](http://openhim.org/): OpenHIM is an open-source middleware platform that provides a central point of control for managing health information exchange (HIE). OpenHIM enables healthcare providers to connect different health systems and applications and provides a common interface for managing data exchange and security.

- [FHIR](http://www.hl7.org/fhir): FHIR is a standard for exchanging healthcare data electronically. FHIR provides a modern, web-based approach to exchanging healthcare data and is rapidly becoming the preferred standard for healthcare interoperability.

## CHT Interoperability

[CHT Interoperability](https://github.com/medic/cht-interoperability) implements interoperability between the CHT and other health information systems based on [OpenHIE architecture](https://ohie.org/) and [HL7 FHIR](https://www.hl7.org/fhir/index.html) messaging format.

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

You can find additional information and instructions for setting up [cht-interoperability](https://github.com/medic/cht-interoperability) in the [dedicated guidelines]({{< ref "building/interoperability/openhim" >}}) .

