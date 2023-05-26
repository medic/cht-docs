## Loss to Follow Up Workflow (LTFU)

This workflow describes a use case where a health facility/requesting system generates a list of patients who have missed appointments for follow-up through on the CHT. A Community Health Worker (CHW) physically visits the patients who missed the appointments and encourages them to visit the health facility. The follow-up process can also be conducted over phone or text messaging.

## Problem Being Addressed

Data exchange between the CHT and other systems has primarily been at peer-to-peer level. This means that the integration is built to meet the specific need in the unique scenarios. This presents a problem during maintainance and scalability as there are no defined standards that have been used. Interoperability allows technical teams to scale in an efficient and repeatable manner due to the already predefined standards. 

## Solution Overview
This is a model for interoperability that can be used for Loss to Follow up flows between the CHT and a health facility or a requesting system. Community health workers routinely follow up on patients physically at their residences or place of work. In instances where the patient needs to visit a health facility for routine checkups or specialized care, the CHW has no visibility of the process outside the CHT. The interoperability layer built allows other systems including health facilities to exchange data in a standardized format.

## Intended Users 
The intended users of the interoperable systems are Community Health Workers (CHWs) on the CHT side and Healthcare Givers on the requesting system side. System administrators can access the mediator on the administration console. 
See the sequence diagram below showcasing the with the loss to follow up flow:

<img src="content/en/apps/examples/Interoperability/LTFU Sequence Diagram.png">

The Interoperating Systems:
- [CHT](https://docs.communityhealthtoolkit.org/): Community Health Toolkit.
- [OpenHIM](http://openhim.org/): Mediator (middleware).
- Requesting System: For testing purposes, we used HTTP Requests.



OpenHIM was chosen as the main component of the interoperability layer and custom mediators were built to deal with the different workflows as it provides a central point of control for managing data exchange and security.
