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

### Provision

This first video shows the left side of the workflow above to provision an RDT for a patient.  The CHW is shown finding Jessica Whitehouse's contact and choosing a new action of "RDT Covid-19 - Provision".  The CHW then does pre-test set up, checking Jessica's symptoms and location and confirming the test method and lot information. You can see the CHW launching the RD-Toolkit, reading the instructions and then, starting the session and timer.  With the RD-Toolkit sending back all the information to the CHT, a task "Capture Covid-19 RDT" can be seen in the CHT for the CHW to follow up on when the RD-Timer has completed. The last part of the video shows the completed provision report in the CHT:

<video controls poster="provision.poster.png"  class=" col-8 col-lg-8" >
    <source src="provision.mp4" type="video/mp4" >
    <source src="provision.webm" type="video/webm" >
</video>

### Capture

This second video shows the right side of the workflow above to capture RDT results for a patient.  The CHW is shown viewing the "Capture Covid-19 RDT" task after the 15 minute time from the RD-Timer has completed. After click the task, the CHW is brought to the CHT form which has the session information for the RD-Toolkit already loaded.  The test results are recorded and then returned to the CHT from the RD-Toolkit. The last part of the video shows the completed capture report in the CHT, including the prognosis and image of the RDT:

<video controls poster="capture.poster.png"  class=" col-8 col-lg-8" >
    <source src="capture.mp4" type="video/mp4" >
    <source src="capture.webm" type="video/webm" >
</video>

## Code walkthrough

You can find the code for this application is found in the `config` directory Medic's main [CHT Core repository on GitHub](https://github.com/medic/cht-core/tree/master/config/covid-19).
