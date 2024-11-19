---
title: "Custom"
weight: 1
description: >
   Integrate with any system using RESTful APIs
keywords: generic, custom, integrations
aliases:
  -    /apps/features/integrations/generic/
relatedContent: >
  building/features/integrations/dhis2
  building/features/integrations/rapidpro
  building/features/integrations/openmrs
aliases:
   - /apps/features/integrations/custom
---

The CHT Core Framework includes functionality that allows sharing data with any API-based system. Developers have configured CHT integrations with OpenMRS, KenyaEMR, Bahmni, DHIS2, RapidPro, Apache NiFi, OpenHIM, custom electronic medical records (EMR), and several other systems.  

## Overview

Integrating a CHT App into your digital health ecosystem starts with identifying an integration use case. It's important to first understand all the components present in the ecosystem (EMR, laboratory system, community health information system, etc) and then plan out what the workflow will look like operationally. It is important to consider what information is needed at each point, will it be available to them, what happens if it is not, is this workflow even useful for them.

One of the biggest challenges in developing integrations between systems is patient matching and/or [deduplication](https://en.wikipedia.org/wiki/Data_deduplication). Sometimes this can be controlled operationally, other times it requires complicated algorithms or human intervention.

Below are a few example integration use cases:

1. **Lost to Follow-up**: EMR generates a list of patients that require follow-up in the community, that list is sent to the CHT and healthworkers receive a task in the CHT to find those patients and refer them to the health facility.
2. **Referrals from the community**: When a CHW does an assessment and determines the patient should be referred to a health facility, send the referral information to the EMR.
3. **Contact Tracing**: Similar to Lost to Follow-Up, the EMR generates a list of contacts to be followed up with and this is sent to the CHT so that a tracer can call those contacts to see if they have symptoms.
4. **Interactive Messaging**: Integrate with a messaging platform (such as RapidPro) to allow community members to initiate self-screening assessments, which can then be sent to the CHT for follow-up by a healthworker.

As you design your use cases, creating a [sequence diagram](https://www.websequencediagrams.com/) will be helpful in illustrating what the flow will look like. [Here]({{< ref "building/guides/integrations/rapidpro#sequence-diagrams" >}}) is an example sequence diagram for an integration use case with RapidPro.

## Integration Design Patterns

There are a number of different interactions that may occur between digital health systems. Below are some common use cases:

1. Creating a patient in the CHT creates that patient in another system
2. Creating a patient in another system creates that patient in the CHT
2. Submitting a form in the CHT triggers an event in another system
3. Submitting a form in the CHT sends data to another system
4. Activity in another system triggers an event in the CHT
5. Activity in another system stores the results in the CHT
6. Another system needs to look up data in the CHT

## Sending data to other systems 

Using the [outbound push]({{< ref "building/app-settings/app-settings-json/outbound" >}}) feature, you can configure the CHT to send data to another system. Before starting, you'll want to make sure you understand the APIs of the destination system and have login credentials with adequate privileges. 

To send data to other systems from the CHT, you will need to do the following:

1. Enable `outbound` in `app_settings`
2. Specify *when* data is sent
3. Specify *where* data is sent
4. Specify *what* data is sent
5. Set up credentials for the destination system

### Enable outbound
[Enable]({{< ref "building/app-settings/app-settings-json/outbound#configuration" >}}) the `mark_for_outbound` transition in `app_settings`.

### When data is sent
Whenever a document is changed (such as submitting a form, creating a new contact, or editing an existing one) you can configure outbound to send data to another system. The `relevant_to` [property]({{< ref "building/app-settings/app-settings-json/outbound#relevant_to" >}}) in the outbound configuration is used to identify which activities will trigger the sending of data.

{{% alert title="Example" %}} Send data to the EMR whenever a CHW submits an `assessment` form where `referral = true`. {{% /alert %}}

### Where data is sent
The `destination` [property]({{< ref "building/app-settings/app-settings-json/outbound#destination" >}}) in the outbound configuration is used to specify *where* to send data. This will normally be the API endpoint of the destination system or interoperabiliy layer. 

{{% alert title="Example" %}} Send data to the `/api/v1/referral` endpoint in the destination system. {{% /alert %}}

### What data is sent
You configure *what* data is sent using the `mapping` [property]({{< ref "building/app-settings/app-settings-json/outbound#mapping" >}}). You will map data from the CHT to the format required by the destination API endpoint.

{{% alert title="Example" %}} Map the `contact.name` field in the CHT to the `patient.name` field in the EMR. {{% /alert %}}

### Authentication
Credentials for the destination system are [stored in CouchdDB]({{< ref "building/app-settings/app-settings-json/outbound#credentials" >}}). You will need to set this up before you can test your configuration.

## Requests from other systems 
The CHT has a complete RESTful API that other systems can utilize to interact with data in the CHT.

The most common uses are:
1. Looking up data in the CHT from another system
2. POSTing data to the CHT from another system

### Look up data in the CHT
The CHT has a number of different API endpoints that can be used to look up data. 

{{% alert title="Example 1" %}} You have a patient's phone number and you want to look up more information about that patient, such as who their CHW is or what Catchment Area they live in. {{% /alert %}}

You can use the `contacts_by_phone` [endpoint]({{< ref "building/reference/api#get-apiv1contacts-by-phone" >}}) will return the fully hydrated contact information for those patients.

{{% alert title="Example 2" %}} You just have the internal UUID of a particular contact but want to get the complete information available for that contact. {{% /alert %}}

You can use the `hydrate` [endpoint]({{< ref "building/reference/api#get-apiv1hydrate" >}}) to obtain this information. to look up the complete information for that contact.

### POST data to the CHT
The CHT API also allows you to POST data. Using these endpoints, you can create new records in your CHT API. You can store activities that took place in another system on that contact's profile in the CHT, and even create tasks for CHWs in the CHT based on activities that took place in the other system.

{{% alert title="Example 1" %}} You use RapidPro to send daily quarantine follow-up messages to a patient. You want to store the patient's responses to those messages on their profile in the CHT. {{% /alert %}}

You can do this by submitting a JSON Form to the records [endpoint]({{< ref "building/reference/api#post-apiv2records" >}}).

{{% alert title="Example 2" %}} Continuing from Example 1, create a task for a CHW in the CHT whenever a patient responds that they have developed symptoms. {{% /alert %}}

You would do this by simply configuring a [task]({{< ref "building/tasks" >}}) to be generated based on criteria available in the report that was created in Example 1.
