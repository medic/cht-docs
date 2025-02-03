---
title: "Contact Tracing"
linkTitle: "Contact Tracing"
weight: 
description: >
  A community surveillance tool to help control infectious disease outbreaks and mitigate secondary disease transmission
keywords:  
aliases:
   - /apps/examples/contact-tracing
   - /building/examples/contact-tracing
---

The CHT’s Contact Tracing functionality enables effective disease surveillance within communities to help control infectious disease outbreaks. It is a community public health tool that is designed to: 

* Centrally register patient cases and track contacts to prevent secondary spread of diseases in communities
* Create a coordinated approach to contact tracing within existing health systems
* Communicate the importance of self-isolation and symptom screening to exposed individuals and their families

## Problem Being Addressed

An essential part of containing disease outbreaks, such as COVID-19, requires public health organizations to rapidly notify people who have come into contact with confirmed or suspected patient cases. In many health systems, existing health management information systems are ill equipped to handle the necessary rapid tracking, triage, and care referrals for large numbers of patient cases and contacts to prevent secondary spread of viruses.

## Solution Overview

Contact Tracing with the CHT offers a rapidly scalable surveillance strategy by registering patient cases and their contacts within communities in a responsive and empathetic way. Through proactive tracing of contacts, active symptom screening, and referrals to care or self-isolation, the app can be deployed to assist in: 

* Disrupting secondary transmission via coordinated registration of patient cases
* Enrolling all contacts and households in monitoring during isolation periods
* Referring symptomatic cases for skilled care following triage
* Engaging in community education and follow-up during isolation

## Users and Hierarchy Example

| User                  | Location             | Devices                             | Role                                                                                                                                                                                                                                              |
| :-------------------- | :------------------- | :---------------------------------- | :------------------------------------------------------------------------------------------------- |
| Data Entry  | Facility level       | Desktop, laptop or tablet           | Responsible for ensuring all contacts are traced. Create contact list based on confirmed cases. Assign contacts to Tracers for follow-up. Notified of unsuccessful traces and symptomatic cases. |
| Tracer                | Community level      | Smartphone                          | Responsible for tracing and screening the contacts of the confirmed case upon notification, verifying symptomatic contacts on self-monitoring and escalating them for further investigation. |
| COVID-19 Patient         | Community level      |                                     | Identified and contacted by staff to ensure all contacts are captured for follow-up. |
| Contacts               | Community level      | Feature phone                       | Receive notification alert upon registration of Tracer follow-up. Submit self-monitoring check during self-quarantine via SMS. Referred to care if symptomatic.  |


## Workflow Example

This demo illustrates how a CHT workflow for tracing of contacts of suspected or confirmed patient cases can be deployed to support a COVID-19 health program response. It works on both SMS and the CHT app. It can be combined with other care workflows and configured to suit specific health system needs, particularly in terms of tracer roles. 

{{< youtube I8bBeh80j-0 >}} <br>

More background information can be found in this [summary deck](https://docs.google.com/presentation/d/1gG2CqndW5pWp6Lx_3t6haiqqO-wFY7_JJ4r246YbVEw)
