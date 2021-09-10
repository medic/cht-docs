---
title: "COVID-19 RDT Reference Application"
linkTitle: "COVID-19 RDT"
weight: 
description: >
 A customizable CHT application with support for 3rd party RDT integration   
relatedContent: >
---

Medic has worked with [FIND](https://www.finddx.org) to provide a reference implementation of a rapid diagnostic tests (RDTs) for COVID-19 application.  By leveraging the expertise of third-party applications, like [Dimagi's RD-Toolkit](https://github.com/dimagi/rd-toolkit/), you can customize this application in your current or future deployment of the CHT.

## Problem Being Addressed

The original call for proposals best describes why Medic created this app: 

> FIND is working towards supporting countries in implementing an effective test-trace-isolate response using digital tools. To this end, FIND is looking to partner with leading digital solution providers to accelerate the development and deployment of a set of minimum functionalities for the collection of COVID RDT data and supporting incorporation of these functionalities into existing digital tools for use in low- and middle-income country settings.

## Solution Overview

This reference app provides a base layer of functionality that you can easily customize to meet the needs of your health program.  Specifically, this application has examples of:
 * Provisioning COVID-19 RDT tests 
 * Capturing COVID-19 RDT results
 * Storing all RDT data, including pictures, in the CHT
 * Best practices of Health Facility, CHW, patient and RDT hierarchy in the CHT

## Workflow

There are three main components to this application:
 * The CHT forms to provision and capture RDTs (Green)
 * Using a third-party app to use an RDT (Yellow)
 * Tasks to remind CHWs to complete an RDT that has been started (Blue) 

{{< figure src="flow.png" link="flow.png" class="right col-12 col-lg-12" >}}

## Example Videos

<video poster="poster.png">
  <source src="video.mp4" type="video/mp4">
</video>

## Code walkthrough

You can find the code for this application is found in the `config` directory Medic's main [CHT Core repository on GitHub](https://github.com/medic/cht-core/tree/master/config/covid-19).
