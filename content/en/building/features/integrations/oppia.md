---
title: "OppiaMobile"
weight: 3
description: >
   Integrate CHT core with OppiaMobile’s learning management platform
keywords: oppia
relatedContent: >
  exploring/learning-care
  building/guides/integrations/oppia
aliases:
   - /apps/features/integrations/oppia
---

[OppiaMobile](https://digital-campus.org/oppiamobile) is an open source mobile learning platform built by Digital Campus specially designed for delivering learning content, multimedia, and quizzes in low connectivity settings. All the content and activities can be accessed and used when no internet connection is available, and users can earn points and badges for completing activities and watching videos. To learn more about the platform, check out the [overview](https://digital-campus.org/oppiamobile/developers), OppiaMobile on [Github](https://github.com/DigitalCampus), and their [documentation site](http://oppiamobile.readthedocs.io/en/latest). You can also join the OppiaMobile [Community Discussion Board](https://community.oppia-mobile.org).


## Overview
This documentation describes how the CHT and OppiaMobile can integrate to provide a learning and care experience for community health workers and other health care providers. It demonstrates how both apps link to one another to provide a seamless user experience, describes features of both applications, and the required configuration adjustments.

We provide a detailed example of the CHT<>OppiaMobile integration, including how to access the learning material, an overview of the functionalities within educational modules, and post-course assessment and supervisor support.


## Features
This integration leverages the **remote onboarding, task & scheduling, and target features** of the CHT core framework with the **curated, multimedia educational content** available via OppiaMobile’s learning platform. 

The CHT Core Framework & OppiaMobile integration currently supports the following capabilities and features:


- [Task management]({{< ref "building/tasks" >}}) for notifications on new educational modules and software updates
- [Remote onboarding]({{< ref "exploring/training" >}}) to new apps, software features, and workflows when they are updated, without relying on face-to-face training
- Optimized multimedia content with links to educational modules powered by OppiaMobile
- Message and feedback options, to contact supervisors with questions and seek support
- [Supervisor visibility]({{< ref "building/targets/targets-overview#supervisor-view" >}}) into CHW progress for onboarding, learning, and care
- Hosting options for government-led, government-owned platforms



