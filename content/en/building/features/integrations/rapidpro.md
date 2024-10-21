---
title: "RapidPro"
weight: 3
description: >
   Integrate interactive messaging conversations into your workflows
keywords: rapidpro
relatedContent: >
  building/guides/integrations/rapidpro
aliases:
  - /apps/features/integrations/rapidpro/
---

[RapidPro](https://rapidpro.io/) is a software product that allows you to visually build logic to support interactive messaging flows. The flows support a variety of technologies such as: SMS, USSD, IVR, Telegram, Facebook Messenger, and WhatsApp. RapidPro is open source and provides an [API](https://rapidpro.io/api/v2/) to integrate with other applications. To learn more about the platform, check out RapidPro on [GitHub](https://rapidpro.github.io/rapidpro/) or join their Google [Group](https://groups.google.com/g/rapidpro). 

## Overview
CHT-based [SMS workflows]({{< ref "building/concepts/workflows#sms-messaging" >}}) can be configured to support registering of new patients or pregnancies, recording outcomes of visits, confirmation via auto-responses, and scheduling reminders. Some projects are designed entirely around SMS workflows. The CHT also supports person to person SMS [messaging]({{< ref "building/features/messaging" >}}) from the Messages tab. 

For more complex messaging workflows or to utilize other messaging platforms, you can design workflows that leverage the functionality of RapidPro and the CHT together. This enables semi-automated, direct to patient approaches to health assessments and care coordination at the community level.

## Workflows
Integrated RapidPro/CHT workflows are very flexible and leverage the full functionality of each application; You configure RapidPro directly in RapidPro, and configure the CHT in the CHT and the two systems communicate with each other through APIs and [Outbound push]({{< ref "building/reference/app-settings/outbound" >}}). With this architecture, you are not limited to a subset of functionality within either application.

A simple RapidPro/CHT integration might include triggering an interactive SMS messaging flow in RapidPro whenever a new patient is registered in the CHT and then storing the responses of that messaging flow in the CHT. You could then conditionally trigger a [Task]({{< ref "building/features/tasks" >}}) for a health worker in the CHT based on the patient responses from the RapidPro flow. 

App builders have built and deployed a number of interactive messaging workflows that integrate RapidPro and the CHT already, see below for a few examples.

### Contact Tracing
The [COVID-19 Contact Tracing app]({{< ref "building/examples/contact-tracing#workflow-example" >}}) uses RapidPro to send messages to quarantined COVID-19 patients. Messages are sent to the patients daily asking whether or not they developed new symptoms.  If so, a health worker will be notified by SMS and receive a CHT task. All responses to the RapidPro workflow are recorded in the CHT and can be queried in analytics.

### Remote Training
The [Remote Training by SMS app]({{< ref "building/examples/training#remote-training-by-sms" >}}) uses RapidPro to train health workers on Antenatal Care in the language of their choice. If the health worker answers a training question incorrectly, a task can be created for their supervisor to follow up with them.

### CHW Symptom and Mental Health Checks
The [CHW Symptom and Mental Health Checks app](https://docs.google.com/document/d/19F6vOCNFKQnSyREiaBnryUmre20s5QZzYe0hWuWn-0k/edit) is used to proactively check in with health workers to screen for COVID-19 symptoms and/or the need for psychosocial counseling.


