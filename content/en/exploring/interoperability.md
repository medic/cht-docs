---
title: "Loss to Follow Up"
linkTitle: "Loss to Follow Up"
weight: 
description: >
  Generating patients with missed follow-up appointments between the CHT and requesting system
keywords: Loss to Follow Up 
relatedContent: >
  building/interoperability
aliases:
   - /apps/examples/interoperability
   - /building/examples/interoperability
---

## Loss to Follow Up Workflow (LTFU)

This workflow describes a use case where a health facility or a requesting system generates a list of patients who have missed follow-up appointments that were made through the CHT. A CHW would then follow up with the listed patients through SMS, a physical visit or a phone call.

## Problem Being Addressed

Data exchange between the CHT and other systems has primarily been at peer-to-peer level. This means that the integration is built to meet the specific need in the unique scenarios. This presents a problem during maintenance and scalability as there are no defined standards that have been used. [Interoperability]({{% ref "building/interoperability/" %}}) allows technical teams to scale in an efficient and repeatable manner due to the already predefined standards. 

## Solution Overview
This is a model for interoperability that can be used for Loss to Follow up flows between the CHT and a health facility or a requesting system. Community health workers routinely follow up on patients physically at their residences or place of work. In instances where the patient needs to visit a health facility for routine checkups or specialized care, the CHW has no visibility of the process outside the CHT. The interoperability layer built allows other systems including health facilities to exchange data in a standardized format.

## Intended Users 
The intended users of the interoperable systems are CHWs on the CHT side and Healthcare Givers on the requesting system side. System administrators can access the mediator on the administration console. 

See the sequence diagram below showcasing the with the loss to follow up flow:

{{< figure src="LTFU Sequence Diagram.png" link="LTFU Sequence Diagram.png">}}

The systems exchanging data:
- CHT
- [OpenHIM](http://openhim.org/): Mediator (middleware)
- Requesting System (e.g. health facility)

OpenHIM was chosen as the main component of the interoperability layer and custom mediators were built to deal with the different workflows as it provides a central point of control for managing data exchange and security.
