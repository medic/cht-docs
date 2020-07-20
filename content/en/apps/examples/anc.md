---
title: "Reference Application: ANC"
linkTitle: "Reference Application: ANC"
weight: 1
description: >
  Reference application for CHWs using a mobile app for antenatal care
relatedContent: >
  apps/concepts
  apps/reference/forms/app
  apps/reference/tasks
---

The Standard Reference Application for antenatal care (ANC) provides a template for structuring and organizing your Community Health Toolkit digital health app, its configuration code and testing framework. The reference app can be deployed as-is or configured to meet unique community care requirements. Built off of ANC care guide best practices, it includes a foundation for CHT forms, workflows, and impact analytics.

{{< see-also page="apps/concepts" title="Concepts that will help you understand how CHT applications are built" >}}

## Problem Being Addressed

Maternal health is the cornerstone of many community health programs. Pregnancy can be a [vulnerable time](https://www.who.int/health-topics/maternal-health) for women living in communities far from medical care. Additionally, the short window immediately after pregnancy is a critical time for catching life-threatening danger signs for the new mother and baby.

## Solution Overview

The ANC workflow in this reference app helps ensure that women are safe and supported in a timely manner throughout their pregnancy. Early and timely antenatal care visits and increased coordination between CHWs and clinics lead to an increase in facility-based deliveries, which in turn has a strong correlation to maternal and newborn survival. CHT deployments of ANC workflows are used by health workers and clinical staff to:

- Provide on-time antenatal care visits
- Educate at each stage of pregnancy
- Screen and report danger signs
- Refer and encourage facility delivery
- Improve delivery rates in facilities with skilled care

## Forms Hierarchy

Once a program [hierarchy]({{< relref "apps/concepts/hierarchy" >}}) of people and places is established, forms are added at different levels. This diagram indicates the forms that can be filled about a person in the app (in this case, family members at the household level), as well as the person/user who will access these forms and make the reports (CHWs at the CHW Area level). Some forms are accessible as actions from the family member’s profile as actions, others from the CHW’s task list as tasks, and some as either. 

![forms-hierarchy.png](forms-hierarchy.png)

{{< see-also page="apps/reference/forms/app" title="Controlling form properties" >}}

## Pregnancy and Delivery Workflows

Next, pregnancy and delivery care workflows are defined to connect form actions and data with people. Detailed documentation to ANC Reference App forms and task schedules are linked from the workflow diagrams below. Accompanying this documentation are tips and insights into the design decisions made along the way, and suggestions for how and where to customize the forms.

[![Pregnancy Workflow](preview-pregnancy-workflow.png)](pregnancy-workflow.pdf)

<br /> 

[![Delivery Workflow](preview-delivery-workflow.png)](delivery-workflow.pdf)

## Getting Started with the ANC Reference Application

The ANC Reference Application can be used ‘out-of-the-box’ to provide care. It is also a great way to learn about the CHT’s structure and workflows to help you understand how to use or modify it for your program needs. Here are a few additional resources to help get you started: 

- View the [complete reference app configuration](https://github.com/medic/cht-core/tree/master/config/default/forms/app)
- Install the reference app following these [easy installation instructions](apps/tutorials/local-setup)
- Modify the ANC Reference Application for your project context using [configuration best practices]({{< ref "design/apps" >}}) 
