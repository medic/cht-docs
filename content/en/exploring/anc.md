---
title: "Maternal and Newborn Health Reference App"
linkTitle: "Maternal & Newborn Health"
weight: 1
description: >
  Reference application for maternal and newborn care for CHW's using a mobile app
relatedContent: >
  building/concepts
  building/forms/app
  building/tasks/tasks-js
aliases:
   - /apps/examples/anc
   - /building/examples/anc
---

This "reference application" for maternal and newborn health provides a template for structuring and organizing your Community Health Toolkit digital health app, its configuration, and test code. It can be used as is, or serve as a great way to learn about the CHT's foundation for forms, data fields, and analytics that can be easily customized to fit your context.

## Problem Being Addressed

Access to quality maternal and newborn care is the cornerstone of many community health programs. For many women living in communities at the last mile, pregnancy can be a [vulnerable time](https://www.who.int/health-topics/maternal-health). There is a need for community health programs to support early pregnancy registration, consistent antenatal care (ANC) visits, and in-facility deliveries. In addition, the short time window following delivery for postnatal care (PNC) is a critical time for catching life-threatening danger signs for the new mother and baby. 

## Solution Overview

The maternal and newborn health workflow ensures that women receive the care that they need during their pregnancy with the support of CHWs. Early pregnancy registration, timely antenatal care visits, and improved care coordination between CHWs and clinics increase the likelihood that women will deliver in a facility with the support of skilled birth attendants. This ultimately will help save the lives of mothers and babies, as well as strengthen the maternal and newborn health services of the health system. Community Health Toolkit applications with maternal and newborn workflows are used by health workers and clinical staff to:

- Register pregnancies
- Provide a schedule for on-time ANC visits
- Offer education for the mother at each stage of pregnancy
- Screen for and report danger signs in the pregnant woman and newborn
- Refer and encourage pregnant women to deliver at a facility 
- Ensure on-time PNC visits for mother and newborn

## Forms Hierarchy

Once a [hierarchy]({{< relref "building/workflows/hierarchy" >}}) of people and places is established, forms are added at different levels. This diagram indicates the forms that can be filled about a person in the app (in this case, family members at the household level), as well as the person/user who will access these forms and make the reports (CHWs at the CHW Area level). Some forms are accessible as actions from the family member’s profile as actions, others from the CHW’s task list as tasks, and some as either. 

{{< figure src="forms-hierarchy.png" link="forms-hierarchy.png" class="right col-12 col-lg-12" >}}

{{< see-also page="building/forms/app" title="Controlling form properties" >}}

## Workflows

Both maternal and newborn care workflows are defined to connect form actions and data with people. Detailed documentation for these forms and task schedules are linked from the workflow diagrams below. Accompanying this documentation are tips and insights into the design decisions made along the way, and suggestions for how and where to customize the forms.

### Pregnancy Workflow

{{< workflow-table
  condition-image="pregnancy-1.png"
  task-image="pregnancy-2.png"
  resolution-image="pregnancy-3.png"
 >}}
  {{% workflow
        condition="Upon discovering a pregnancy, a CHW submits a [Pregnancy Form](https://docs.google.com/drawings/d/1u4OQIgTyzUysFv9Cop-C54nrbPiuPmq7GTpBTFmwZn0/edit) confirming a new pregnancy with the estimated gestational age."
        task="At the 8 ANC touchpoints defined by the WHO, the CHW receives a [Pregnancy Home Visit Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.wf9x0zhfeasi) to let her know that it’s time to check in on the pregnant woman."
        resolution="CHW submits [Pregnancy Home Visit Form](https://docs.google.com/drawings/d/1_2i6XTMtMkrfQ6NFNjcEDwJPS8i0rEeQlaPgYQhacSw/edit), demonstrating that she provided ANC counseling, gathered information from prior facility visits, and screened for danger signs."
  %}}
  {{% workflow
        condition="A [Pregnancy Form](https://docs.google.com/drawings/d/1u4OQIgTyzUysFv9Cop-C54nrbPiuPmq7GTpBTFmwZn0/edit) is submitted with the gestational age unknown."
        task="A [Pregnancy Visit Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.2pls723gu6wl) appears every 2 weeks for 42 weeks."
        resolution="CHW submits [Pregnancy Home Visit Form](https://docs.google.com/drawings/d/1_2i6XTMtMkrfQ6NFNjcEDwJPS8i0rEeQlaPgYQhacSw/edit). If the gestational age is entered, the workflow will change to [Pregnancy Home Visit Tasks](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.wf9x0zhfeasi)."
  %}}
  {{% workflow
        condition="A CHW submits a [Pregnancy Home Visit Form](https://docs.google.com/drawings/d/1_2i6XTMtMkrfQ6NFNjcEDwJPS8i0rEeQlaPgYQhacSw/edit) that includes an upcoming facility visit date."
        task="A [Health Facility ANC Reminder Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.v3b7bata6j) 1 week ahead of the facility visit to remind the woman to attend."
        resolution="CHW submits *Health Facility ANC Reminder Form*, confirming that she called or visited the woman to remind her of her upcoming facility visit."
  %}}
  {{% workflow
        condition="If the CHW notices danger signs at any time, then she submits a *Danger Sign Form* and immediately refers the patient to the facility."
        task="A [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.82ea7ww1x1k) will appear immediately and is due 3 days later. Tasks persists for 7 days after due date."
        resolution="CHW submits a *Danger Sign Follow-Up Form*, verifying that she called or visited the woman to confirm that she attended the facility. If this is not received, another *Danger Sign Follow-Up Task* is triggered."
  %}}
{{< /workflow-table >}}
 
### Delivery Workflow

{{< workflow-table
  condition-image="delivery-1.png"
  task-image="delivery-2.png"
  resolution-image="delivery-3.png"
>}}
  {{% workflow
        condition="A currently registered pregnant person has reached a gestational age of 42 weeks and has not had a miscarriage or a delivery reported."
        task="A [Delivery Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.roycts63w3b8) requesting that the CHW check in on the woman to see whether she has delivered."
        resolution="CHW submits a [Delivery Form](https://docs.google.com/drawings/d/1r4SkpSGWzvOZPv3-pFp9wS1k531MnWcbjzzC8U4tt0o/edit), confirming the pregnancy outcomes. Profiles are created for each baby that is alive. This “ends” the pregnancy workflow."
  %}}
  {{% workflow
        condition="A CHW submits a [Delivery Form](https://docs.google.com/drawings/d/1r4SkpSGWzvOZPv3-pFp9wS1k531MnWcbjzzC8U4tt0o/edit) that contains a danger sign for mom or baby, or reports that either mom or baby are “alive and unwell.”"
        task="A [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.ojap92eg1e82) appears immediately and is due 3 days later. Persists for 7 days after due date."
        resolution="The CHW calls or visits woman to confirm that she attended and submits a *Danger Sign Follow-Up Form*. If this is not received, another [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.ojap92eg1e82) is triggered."
  %}}
  {{% workflow
        condition="If the CHW notices danger signs at any time, then she submits a *Danger Sign Form* and immediately refers the patient to the facility."
        task="A [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.ojap92eg1e82) will appear immediately and is due 3 days later. Tasks persists for 7 days after due date."
        resolution="CHW submits *Danger Sign Follow-Up Form*, verifying that she called or visited the woman to confirm that she attended the facility. If this is not received, another [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.ojap92eg1e82) is triggered."
  %}}
{{< /workflow-table >}}

## Additional Resources to Get Started

Here are a few additional resources to help get you started with the maternal and newborn health reference application.

- View the [configuration code for this reference app](https://github.com/medic/cht-core/tree/master/config/default/)
- Install the reference app following these [easy installation instructions]({{< ref "building/local-setup" >}})
- Modify the maternal and newborn reference application for your project context using [configuration best practices]({{< ref "design/best-practices" >}}) 
- Understand the basis for measuring the impact of maternal and newborn workflows by reviewing the World Health Organization's [Core Health Indicators](https://www.who.int/data/gho/data/indicators/indicators-index)
