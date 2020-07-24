---
title: "Maternal and Newborn Health Reference App"
linkTitle: "Maternal and Newborn Health App"
weight: 1
description: >
  Reference application for maternal and newborn care for CHW's using a mobile app
relatedContent: >
  apps/concepts
  apps/reference/forms/app
  apps/reference/tasks
---

{{% pageinfo %}}
This "reference application" for maternal and newborn health provides a template for structuring and organizing your Community Health Toolkit digital health app, its configuration and test code. It can be used as is, or serve as a great way to learn about the CHT's foundation for forms, data fields, and analytics that can be easily customized to fit your context.
{{% /pageinfo %}}

## Problem Being Addressed

Maternal health is the cornerstone of many community health programs. Pregnancy can be a [vulnerable time](https://www.who.int/health-topics/maternal-health) for women living in communities far from medical care. Additionally, the short window immediately after pregnancy is a critical time for catching life-threatening danger signs for the new mother and baby. Newborns that are not delivered at a facility are much [less likely to survive and thrive](https://www.who.int/health-topics/newborn-health).

## Solution Overview

The maternal and newborn health workflows help ensure that women are safe and supported in a timely manner throughout their pregnancy. Early and timely maternal health visits and improved coordination between CHWs and clinics lead to an increase in facility-based deliveries, which in turn has a strong correlation to maternal and newborn survival. Community Health Toolkit applications with maternal and newborn workflows are used by health workers and clinical staff to:

- Provide on-time antenatal care visits
- Educate at each stage of pregnancy
- Screen and report mother and newborn danger signs
- Refer and encourage facility delivery
- Improve delivery rates in facilities with skilled care

## Forms Hierarchy

Once a [hierarchy]({{< relref "apps/concepts/hierarchy" >}}) of people and places is established, forms are added at different levels. This diagram indicates the forms that can be filled about a person in the app (in this case, family members at the household level), as well as the person/user who will access these forms and make the reports (CHWs at the CHW Area level). Some forms are accessible as actions from the family member’s profile as actions, others from the CHW’s task list as tasks, and some as either. 

![forms-hierarchy.png](forms-hierarchy.png)

{{< see-also page="apps/reference/forms/app" title="Controlling form properties" >}}

## Pregnancy and Delivery Workflows

Pregnancy and delivery care workflows are defined to connect form actions and data with people. Detailed documentation for these forms and task schedules are linked from the workflow diagrams below. Accompanying this documentation are tips and insights into the design decisions made along the way, and suggestions for how and where to customize the forms.

[![Pregnancy Workflow](preview-pregnancy-workflow.png)](pregnancy-workflow.pdf)

**TEXT (left to right)**
- Upon discovering a pregnancy, a CHW submits a [Pregnancy Form](https://docs.google.com/drawings/d/1u4OQIgTyzUysFv9Cop-C54nrbPiuPmq7GTpBTFmwZn0/edit) confirming a new pregnancy with the estimated gestational age.

- At the 8 ANC touchpoints defined by the WHO, the CHW receives a [Pregnancy Home Visit Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.wf9x0zhfeasi) to let her know that it’s time to check in on the pregnant woman. 

- CHW submits [Pregnancy Home Visit Form](https://docs.google.com/drawings/d/1_2i6XTMtMkrfQ6NFNjcEDwJPS8i0rEeQlaPgYQhacSw/edit), demonstrating that she provided ANC counseling, gathered information from prior facility visits, and screened for danger signs.

- A [Pregnancy Form](https://docs.google.com/drawings/d/1u4OQIgTyzUysFv9Cop-C54nrbPiuPmq7GTpBTFmwZn0/edit) is submitted with the gestational age unknown. 

- A [Pregnancy Visit Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.2pls723gu6wl) appears every 2 weeks for 42 weeks. 

- CHW submits [Pregnancy Home Visit Form](https://docs.google.com/drawings/d/1_2i6XTMtMkrfQ6NFNjcEDwJPS8i0rEeQlaPgYQhacSw/edit). If the gestational age is entered, the workflow will change to [Pregnancy Home Visit Tasks](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.wf9x0zhfeasi).

- A CHW submits a [Pregnancy Home Visit Form](https://docs.google.com/drawings/d/1_2i6XTMtMkrfQ6NFNjcEDwJPS8i0rEeQlaPgYQhacSw/edit) that includes an upcoming facility visit date.

- A [Health Facility ANC Reminder Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.v3b7bata6j) 1 week ahead of the facility visit to remind the woman to attend.

- CHW submits *Health Facility ANC Reminder Form*, confirming that she called or visited the woman to remind her of her upcoming facility visit. 

- If the CHW notices danger signs at any time, then she submits a *Danger Sign Form* and immediately refers the patient to the facility.

- A [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.82ea7ww1x1k) will appear immediately and is due 3 days later. Tasks persists for 7 days after due date.

- CHW submits a *Danger Sign Follow-Up Form*, verifying that she called or visited the woman to confirm that she attended the facility. If this is not received, another *Danger Sign Follow-Up Task* is triggered.

<br /> 

[![Delivery Workflow](preview-delivery-workflow.png)](delivery-workflow.pdf)

**TEXT (left to right)**

- A currently registered pregnant person has reached a gestational age of 42 weeks and has not had a miscarriage or a delivery reported.

- A [Delivery Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.roycts63w3b8) requesting that the CHW check in on the woman to see whether she has delivered.

- CHW submits a [Delivery Form](https://docs.google.com/drawings/d/1r4SkpSGWzvOZPv3-pFp9wS1k531MnWcbjzzC8U4tt0o/edit), confirming the pregnancy outcomes. Profiles are created for each baby that is alive. This “ends” the pregnancy workflow. 

- A CHW submits a [Delivery Form](https://docs.google.com/drawings/d/1r4SkpSGWzvOZPv3-pFp9wS1k531MnWcbjzzC8U4tt0o/edit) that contains a danger sign for mom or baby, or reports that either mom or baby are “alive and unwell.”

- A [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.ojap92eg1e82) appears immediately and is due 3 days later. Persists for 7 days after due date.

- The CHW calls or visits woman to confirm that she attended and submits a *Danger Sign Follow-Up Form*. If this is not received, another [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.ojap92eg1e82) is triggered.

- If the CHW notices danger signs at any time, then she submits a *Danger Sign Form* and immediately refers the patient to the facility.

- A [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.ojap92eg1e82) will appear immediately and is due 3 days later. Tasks persists for 7 days after due date.

- CHW submits *Danger Sign Follow-Up Form*, verifying that she called or visited the woman to confirm that she attended the facility. If this is not received, another [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.ojap92eg1e82) is triggered.

## Additional Resources to Get Started

Here are a few additional resources to help get you started with the maternal and newborn health reference application.

- View the [complete reference app configuration](https://github.com/medic/cht-core/tree/master/config/default/)
- Install the reference app following these [easy installation instructions](apps/tutorials/local-setup)
- Modify the maternal and newborn reference application for your project context using [configuration best practices]({{< ref "design/apps" >}}) 
