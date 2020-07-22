---
title: "Antenatal Care"
linkTitle: "Antenatal Care"
weight: 1
description: >
  Antenatal care workflows for CHWs using a mobile app
relatedContent: >
  apps/concepts
  apps/reference/forms/app
  apps/reference/tasks
---

{{% pageinfo %}}
This Antenatal Care workflow is a "reference application" that provides a template for structuring and organizing your Community Health Toolkit digital health app, its configuration code and testing framework. It is a great way to learn about the CHT's foundation for forms, data fields, and analytics that can be easily customized to fit your programs context.
{{% /pageinfo %}}

## Problem Being Addressed

Maternal health is the cornerstone of many community health programs. Pregnancy can be a [vulnerable time](https://www.who.int/health-topics/maternal-health) for women living in communities far from medical care. Additionally, the short window immediately after pregnancy is a critical time for catching life-threatening danger signs for the new mother and baby. Newborns that are not delivered at a facility are much [less likely to survive and thrive](https://www.who.int/health-topics/newborn-health).

## Solution Overview

The antenatal care (ANC) workflow helps ensure that women are safe and supported in a timely manner throughout their pregnancy. Early and timely ANC visits and increased coordination between CHWs and clinics lead to an increase in facility-based deliveries, which in turn has a strong correlation to maternal and newborn survival. Community Health Toolkit applications with ANC workflows are used by health workers and clinical staff to:

- Provide on-time antenatal care visits
- Educate at each stage of pregnancy
- Screen and report danger signs
- Refer and encourage facility delivery
- Improve delivery rates in facilities with skilled care

## Forms Hierarchy

Once a [hierarchy]({{< relref "apps/concepts/hierarchy" >}}) of people and places is established, forms are added at different levels. This diagram indicates the forms that can be filled about a person in the app (in this case, family members at the household level), as well as the person/user who will access these forms and make the reports (CHWs at the CHW Area level). Some forms are accessible as actions from the family member’s profile as actions, others from the CHW’s task list as tasks, and some as either. 

![forms-hierarchy.png](forms-hierarchy.png)

{{< see-also page="apps/reference/forms/app" title="Controlling form properties" >}}

## Pregnancy and Delivery Workflows

Pregnancy and delivery care workflows are defined to connect form actions and data with people. Detailed documentation for these forms and task schedules are linked from the workflow diagrams below. Accompanying this documentation are tips and insights into the design decisions made along the way, and suggestions for how and where to customize the forms.

[![Pregnancy Workflow](preview-pregnancy-workflow.png)](pregnancy-workflow.pdf)

<br /> 

[![Delivery Workflow](preview-delivery-workflow.png)](delivery-workflow.pdf)

## Additional Resources to Get Started

Here are a few additional resources to help get you started with the ANC reference application.

- View the [complete reference app configuration](https://github.com/medic/cht-core/tree/master/config/default/)
- Install the reference app following these [easy installation instructions](apps/tutorials/local-setup)
- Modify the ANC Reference Application for your project context using [configuration best practices]({{< ref "design/apps" >}}) 
