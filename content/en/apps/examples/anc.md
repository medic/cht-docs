---
title: "Maternal, Newborn and Child Health (MNCH) - Reference App"
linkTitle: "Maternal, Newborn & Child Health"
weight: 1
description: >
  Reference application for maternal, newborn and child health for CHW's using a mobile app
relatedContent: >
  apps/concepts
  apps/reference/forms/app
  apps/reference/tasks
---

{{% pageinfo %}}
This "reference application" for maternal, newborn and child health provides a template for structuring and organizing your Community Health Toolkit digital health app, its configuration, and test code. It can be used as is, or serve as a great way to learn about the CHT's foundation for forms, data fields, and analytics that can be easily customized to fit your context.
{{% /pageinfo %}}

## Problem Being Addressed

Access to quality maternal, newborn, and child care is the cornerstone of many community health programs. For many women living in communities at the last mile, pregnancy can be a [vulnerable time](https://www.who.int/health-topics/maternal-health). There is a need for community health programs to support early pregnancy registration, consistent antenatal care (ANC) visits, and in-facility deliveries. In addition, the short time window following delivery for postnatal care (PNC) is a critical time for catching life-threatening danger signs for the new mother and baby. 

## Solution Overview

The MNCH workflow ensures that women, newborns and children receive the care that they need with the support of CHWs. Early pregnancy registration, timely antenatal care visits, and improved care coordination between CHWs and clinics increase the likelihood that women will deliver in a facility with the support of skilled birth attendants. This ultimately will help save the lives of mothers and babies, as well as strengthen the maternal and newborn health services of the health system. Community Health Toolkit applications with MNCH workflows are used by health workers and clinical staff to:

- Register pregnancies
- Provide a schedule for on-time ANC visits
- Offer education for the mother at each stage of pregnancy
- Screen for and report danger signs in the pregnant woman and newborn
- Refer and encourage pregnant women to deliver at a facility 
- Ensure on-time PNC visits for mother and newborn
- Remotely register children for immunization
- Track immunization status based on individual vaccines and visits
- Report and refer newborn and child for danger signs
- Assess and diagnose sick children using a standardized Integrated Community Case Management (ICCM) protocol
- Screen, treat, and refer for acute malnutrition

## Forms Hierarchy

Once a [hierarchy]({{< relref "apps/concepts/hierarchy" >}}) of people and places is established, forms are added at different levels. This diagram indicates the forms that can be filled about a person in the app (in this case, family members at the household level), as well as the person/user who will access these forms and make the reports (CHWs at the CHW Area level). Some forms are accessible as actions from the family member’s profile as actions, others from the CHW’s task list as tasks, and some as either. Hereunder the form hierarchies for maternal care, and newborn and child care.  

{{< figure src="forms-hierarchy.png" link="forms-hierarchy.png" class="right col-12 col-lg-12" >}}

{{< see-also page="apps/reference/forms/app" title="Controlling form properties" >}}

{{< figure src="NCH form hierarchy-CHT.png" link="NCH form hierarchy-CHT.png" class="right col-12 col-lg-12" >}}

## Workflows

MNCH workflows are defined to connect form actions and data with people. Detailed documentation for these forms and task schedules are linked from the workflow diagrams below. Accompanying this documentation are tips and insights into the design decisions made along the way, and suggestions for how and where to customize the forms.

### Pregnancy Workflow

{{% workflow-table
  condition-image="pregnancy-1.png"
  task-image="pregnancy-2.png"
  resolution-image="pregnancy-3.png"
 %}}
  {{% workflow
        condition="The [Pregnancy Form](https://docs.google.com/drawings/d/1u4OQIgTyzUysFv9Cop-C54nrbPiuPmq7GTpBTFmwZn0/edit) is submitted with a new pregnancy and the estimated gestational age." 
        task=" A [Pregnancy Home Visit Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.wf9x0zhfeasi) appears 3 days before. The task persists 7 days after the due date."  
        resolution="The CHW submits a [Pregnancy Home Visit Form](https://docs.google.com/drawings/d/1_2i6XTMtMkrfQ6NFNjcEDwJPS8i0rEeQlaPgYQhacSw/edit), confirming that she provided ANC counseling, gathered information from prior facility visits, and screened for danger signs."
  %}}
  {{% workflow
        condition="The [Pregnancy Form](https://docs.google.com/drawings/d/1u4OQIgTyzUysFv9Cop-C54nrbPiuPmq7GTpBTFmwZn0/edit) is submitted with the gestational age unknown."
        task="A [Pregnancy Visit Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.2pls723gu6wl) appears every 2 weeks for 42 weeks. The task persists 7 days after the due date"
        resolution="The CHW submits a [Pregnancy Home Visit Form](https://docs.google.com/drawings/d/1_2i6XTMtMkrfQ6NFNjcEDwJPS8i0rEeQlaPgYQhacSw/edit). If the gestational age is entered, the workflow will change to [Pregnancy Home Visit Tasks](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.wf9x0zhfeasi)."
  %}}
  {{% workflow
        condition="The [Pregnancy Home Visit Form](https://docs.google.com/drawings/d/1_2i6XTMtMkrfQ6NFNjcEDwJPS8i0rEeQlaPgYQhacSw/edit) is submitted with an upcoming facility visit date."
        task="A [Health Facility ANC Reminder Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.v3b7bata6j) appears 3 days before. The task persists 7 days after the due date."
        resolution="The CHW submits a *Health Facility ANC Reminder Form*, confirming that she called or visited the woman to remind her of her upcoming facility visit."
  %}}
  {{% workflow
        condition="The *Danger Sign Form* is submitted with danger signs symptoms."
        task="A [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.82ea7ww1x1k) appears immediately. The task persists 7 days after the due date."
        resolution="The CHW submits a *Danger Sign Follow-Up Form*, confirming that she called or visited the woman to check if  she attended the facility."
  %}}
{{% /workflow-table %}}
 
### Delivery Workflow

{{% workflow-table
  condition-image="delivery-1.png"
  task-image="delivery-2.png"
  resolution-image="delivery-3.png"
%}}
  {{% workflow
        condition="A currently registered pregnant person has reached a gestational age of 42 weeks and has not had a miscarriage or a delivery reported."
        task="A [Delivery Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.roycts63w3b8) appears 4 weeks before the due date. The task persists 6 weeks after the due date."
        resolution="The CHW submits a [Delivery Form](https://docs.google.com/drawings/d/1r4SkpSGWzvOZPv3-pFp9wS1k531MnWcbjzzC8U4tt0o/edit), confirming the pregnancy outcomes."
  %}}
  {{% workflow
        condition="The [Delivery Form](https://docs.google.com/drawings/d/1r4SkpSGWzvOZPv3-pFp9wS1k531MnWcbjzzC8U4tt0o/edit) is submitted with a danger sign for mom or baby, or reports that either mom or baby are “alive and unwell.”"
        task="A [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.ojap92eg1e82) appears immediately. The task persists 7 days after the due date."
        resolution="The CHW calls or visits woman confirming that she has attended and submits a *Danger Sign Follow-Up Form*. If this is not received, another [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.ojap92eg1e82) is triggered."
  %}}
  {{% workflow
        condition="The *Danger Sign Form* is submitted with danger signs."
        task="A [Danger Sign Follow-Up Task](https://docs.google.com/document/d/17pJXBf2gEB2wD1P5g9S5XQ2u4QnLGMiUU4sX0XQsvSk/edit#heading=h.ojap92eg1e82) appears immediately. The task persists 7 days after the due date."
        resolution="The CHW submits a *Danger Sign Follow-Up Form*, confirming that she called or visited the woman to check if she attended the facility."
  %}}
{{% /workflow-table %}}

### Immunization and growth Workflow

{{% workflow-table
  condition-image="delivery-1.png"
  task-image="delivery-2.png"
  resolution-image="delivery-3.png"      
  %}}

  {{% workflow
    condition="The immunization and growth form is submitted with the status referred or accompany the mother & child to facility for a child who missed the clinic visit."
    task="An [immunization follow up task]( https://docs.google.com/document/d/1hC7gDsXxbjtoob2g36HNeuAReoWJDP2ffjQe7m6O-uY/edit#heading=h.fash0w4q2e9g) appears after 3 days. The task persists 3 days after the due date."
    resolution="The CHW submits an immunization and growth follow up form confirming that the child has attended the clinic visit and the immunization was completed."
%}}

   {{% workflow
    condition="The Immunization and growth form is submitted with the date for next visit."
    task="An [immunization follow up task]( https://docs.google.com/document/d/1hC7gDsXxbjtoob2g36HNeuAReoWJDP2ffjQe7m6O-uY/edit#heading=h.fash0w4q2e9g) appears after 3 days. The task persists 3 days after the due date."
    resolution="The CHW submits an immunization and growth follow up form confirming that the immunization was completed."
%}}
{{% workflow
     condition="The immunization and growth form is submitted with a child development sign."
     task="A [child development follow up task](https://docs.google.com/document/d/1hC7gDsXxbjtoob2g36HNeuAReoWJDP2ffjQe7m6O-uY/edit#heading=h.v3b7bata6j) appears after 7 days. The task persists 3 days after the due date."
     resolution="The CHW submits a child development follow up confirming that the development milestones visit was completed."
%}}
{{% /workflow-table %}}

### Child assessment workflow

{{% workflow-table
  condition-image="delivery-1.png"
  task-image="delivery-2.png"
  resolution-image="delivery-3.png"      
  %}}

{{% workflow
        condition="A child assessment form is submitted with any of the following:<ul>          <li> danger signs symptoms          <li> fever that lasts 7+ days          <li> cough that lasts 14+ days          <li> fast breathing (50+ bpm, 40+ for infants)          <li> specific diarrhea symptoms</ul>"
        task="A [child referral follow up task](https://docs.google.com/document/d/1hC7gDsXxbjtoob2g36HNeuAReoWJDP2ffjQe7m6O-uY/edit#heading=h.gwiatej2wjp) appears 3 days after the assessment, and lasts for 3 days." 
        resolution="The CHW submits a child referral follow up form confirming that the patient has attended the clinic visit."
  %}}
  {{% workflow
        condition="A child assessment form doesn’t trigger a referral, yet has one of the following condition:<ul>          <li> fever that lasts less than 7 days and RDT that is positive          <li> fever that lasts less than 7 days and with a RDT that is negative or RDT not done          <li> cough less than 14 days, without fast breathing          <li> diarrhea that lasts less than 14 days and with no blood          <li> yellow MUAC</ul>"
        task="Two [child treatment follow up tasks](https://docs.google.com/document/d/1hC7gDsXxbjtoob2g36HNeuAReoWJDP2ffjQe7m6O-uY/edit#heading=h.9sln0fedxe4x) are triggered. The first one 3 days and the second one 6 days after the reported date. The tasks should stay for 3 days after the due date."
        resolution="The CHW submits a child treatment follow up confirming the patient’s health status."
  %}}
  {{% workflow
        condition="A child assessment form doesn’t trigger a referral or treatment, yet has a red MUAC."
        task="A [malnutrition follow up task](https://docs.google.com/document/d/1hC7gDsXxbjtoob2g36HNeuAReoWJDP2ffjQe7m6O-uY/edit#heading=h.u5ijb7zi3ei1) appears after 3 days. The task persists 3 days after the due date."
        resolution="The CHW submits a malnutrition follow up form confirming that the patient has attended the clinic visit." 
  %}} 
{{% /workflow-table %}} 

## Supplement schedule

{{% schedule %}}
|| 6m | 12m | 18m | 2y | 2.5y | 3y | 3.5y | 4y | 4.5y | 5y |
|------------|--|--|--|--|--|--|--|--|--|--|
| Deworming  | | X  | X | X | X | X | X | X | X | X |
| Vitamin A  | X | X | X | X | X | X | X | X | X | X |
{{% /schedule %}}

## Immunization schedule

{{% schedule %}}
||birth | 6w | 10w | 14w | 6m | 9m | 12m | 18m |         
|-----------------------------------|----|----|---|----|--|---|--|---|        
| BCG                               | X  |    |   |    |  |   |  |   |       
| Oral Polio Vaccine (OPV)          | X  | X  | X | X  |  |   |  |   |       
| RotaVirus vaccine                 |    | X  | X |    |  |   |  |   |        
| Pneumococcal vaccine              |    | X  | X | X  |  |   |  |   |       
| Pentavalent vaccine               |    | X  | X | X  |  |   |  |   |        
| Inactivated Polio Vaccine (IPV)   |    |    |   | X  |  |   |  |   |        
| Measles vaccine                   |    |    |   |    |  | X |  | X |        
| Yellow fever vaccine              |    |    |   |    |  | X |  |   |
{{% /schedule %}}

## Additional Resources to Get Started

Here are a few additional resources to help get you started with the maternal and newborn health reference application.

- View the [configuration code for this reference app](https://github.com/medic/cht-core/tree/master/config/default/)
- Install the reference app following these [easy installation instructions]({{< ref "apps/tutorials/local-setup" >}})
- Modify the maternal and newborn reference application for your project context using [configuration best practices]({{< ref "design/best-practices" >}}) 
- Understand the basis for measuring the impact of maternal and newborn workflows by reviewing the World Health Organization's [Core Health Indicators](https://www.who.int/healthinfo/indicators/2018/en/)
