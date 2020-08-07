---
title: "Remote Onboarding and Training"
linkTitle: "Remote Training"
weight: 
description: >
  App and care workflow training using remote capabilities.
keywords: training onboarding
relatedContent: >
  apps/reference/app-settings/token_login/
---

The CHT’s Remote Onboarding and Training functionality enables Supervisors and Administrators to train CHWs on care workflows and related app use without being physically present. It is designed for:

* Safety: maintaining distance due to infectious disease
* Speed: faster deployment when timing is a critical
* Scalability: onboarding large numbers of users at the same time
* Measurability: evaluation to provide added support where needed
* Adaptability: integration with existing program and workflow structures

## Problem Being Addressed

Providing consistent training for CHWs is critically important in the context of evolving health programs and use of digital support tools. In-person training is often not feasible (due to distance, infectious disease outbreaks, or similar), but is still required to build and maintain effective care programs. Relying on CHWs to learn to use these new digital tools and adhere to care workflows on their own is a major challenge to health program success.

## Solution Overview

The CHT’s onboarding and training capabilities offer a remote way to provide education to CHWs and Supervisors about digital tools functionality and care workflows. It can be deployed in both SMS and App based modules. Through asynchronous communication, program administrators are able to:

* Create customized training modules that match program requirements
* Capture assessments of CHW knowledge levels of training material
* Assess user training participation abandonment
* Identify CHWs who need additional Supervisor support

## User Roles Example

![user-roles.png](user-roles.png) 

## Reporting Hierarchy Example

![hierarchy.png](hierarchy.png)

## Workflow Examples

### Remote Login by App

When creating users, the admin has the option to send a user their credentials via SMS using a [magic link](https://hackernoon.com/magic-links-d680d410f8f7). This generates a new, random and complex password with a 24-hour expiry. If no gateway is set up, the message may be sent via another messaging app. 

![admin-magiclink](admin-magiclink.png)

By clicking the magic link to log in, the user is able to enter their project's instance directly, bypassing the need to enter their username and password. If the app is not installed on their phone, it will open in their default browser.

![login.png](login.png)

To recover a password, the user needs to contact the admin so that they may regenerate a new magic link and repeat the workflow. 

{{% alert title="Note" %}}
The magic link workflow will not work for users who want to use multiple devices or for multiple users on one device.
{{% /alert %}}
 
### Remote Training Overview

These SMS and App based workflow examples illustrate how the CHT enables remote training, tasking and communication at scale. Training can be done using simple guides, audio/videos suitable for low bandwidth, or interactive experiences on personal devices. Training programs can be easily configured to suit specific health program needs.
<br><br>

![workflow.png](workflow1.png)


### Remote Training by SMS

{{< youtube -24pWKckXMk >}}


### Remote Training by App

{{< youtube pFEFIY_SA7M >}}

<br>

More background information can be found in this [summary deck](https://docs.google.com/presentation/d/13bFoyU2vhwPiOUiVWzUJ2urtAyR6_XKTxp0XASCLVko).
