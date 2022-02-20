---
title: "CHT Applications"
linkTitle: "CHT Applications"
identifier: "apps"
weight: 2
description: >
  Overview and reference for building CHT Applications
---

{{% pageinfo %}}
This section provides an introduction to CHT Applications, provides some sample CHT Applications, and provides guides and reference materials for those wanting to build a CHT Application or deploy an existing one.
{{% /pageinfo %}}

Community Health Toolkit (CHT) Applications are digital health tools built using the [CHT Core Framework]({{< ref "core" >}}). The Core Framework provides a foundation on which custom CHT Applications are built. Since all CHT Applications share the same foundation, they also share capabilities and attributes. For example, all CHT Applications share a similar user-interface and share the same look-and-feel. All CHT Applications can be built to scale, can run across a variety of devices, support [Offline-First]({{< ref "core/overview/offline-first" >}}) experiences, and support most languages. These baseline capabilities are foundational across all CHT Applications. Read more about this in [Why the CHT?]({{< ref "why-the-cht" >}}).

To create a digital health tool using the Community Health Toolkit, you'll need to build a CHT Application or re-use an existing CHT Application.

CHT Applications have been built to support a range of health interventions including antenatal care, postnatal care, family planning, integrated community case management of childhood illness, malnutrition, immunization, and epidemic response. CHT Applications have been built to support users at all levels of the community health system including patients, CHWs, CHW supervisors, nurses, health facility staff, program staff, researchers, and policy makers. Beyond the community-level, data from CHT Applications can integrate with the broader health system through integrations with software such as OpenMRS, DHIS2, and RapidPro.

## What skills are required

Building a CHT Application or altering an existing app is a technical undertaking requiring a technical skillset.

### To Build an App

Technically speaking, CHT Applications consist of JSON files, XLSForms, JavaScript code, media (images/videos), and translations. Collectively, this is referred to as "configuration code". The following technical skills are necessary to work with all the aspects of configuration code.

* Use of command line tools to compile and deploy configuration code
* [XLSForms](http://xlsform.org) for building forms (to create contacts, add contact actions, complete tasks)
* JSON for modifying settings
* JavaScript for modifying tasks and targets

### To Deploy an App

* System administration
* Database administration for CouchDB and PostgreSQL
* Familiarity with AWS including EC2 and CloudWatch
* Familiarity with Docker
* Service monitoring
* Use of command line tools
