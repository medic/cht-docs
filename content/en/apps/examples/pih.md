---
title: "YendaNafe CHT app by PIH in Malawi"
linkTitle: "PIH Malawi"
weight:
description: >
  The YendaNafe app co-designed by PIH Malawi and Medic
keywords:  
---
{{% pageinfo %}}
Since 2017, [Partners in Health (PIH) Malawi](https://www.pih.org/country/malawi) and [Medic](https://medic.org/) have collaboratively co-designed and developed YendaNafe app, a digital health app for community based service provision. In the spirit of openness, Medic and PIH have coordinated the release of the full application source code of Yendanafe app as first of kind "Integrated CHT Reference app". This Reference app provides an example that CHT Implementers can learn how they can design and configure integrated workflows.
{{% /pageinfo %}}

## Problem being addressed
Malawi is one of the countries with a high prevalence of HIV, high rates of infant and maternal mortality and a high burden of non communicable diseases (NCD) and tuberculosis. To help respond to community needs and reduce the disease burden, PIH in partnership with the Ministry of Health are implementing an integrated household model in Neno District. Under the model, community health workers (CHWs) and CHW supervisors have been equipped with the YendaNafe app, the app supports the health care workers to provide integrated community based health care services and to coordinate care.

## Solution overview
The YendaNafe app workflows support CHWs to conduct integrated disease screening, provide health care services, refer people in communities to facilities especially those who require facility based care and raise community awareness on health. The app is designed to support the following key health areas:
* Maternal child health (antenatal care and postnatal care)
* Immunization
* Family planning
* Malnutrition
* Integrated management of childhood illness (IMCI)
* Human Immunodeficiency Virus (HIV)
* Tuberculosis (TB)
* Non communicable diseases


## Users and hierarchy

{{< figure src="users_hierarchy.png"  link="users_hierarchy.png" alt="users hierarchy" title="" class="left col-12">}}

## Workflows
### Maternal neonatal health workflow
This workflow consists of the pregnancy, delivery and postnatal workflows.The pregnancy workflow enables CHWs to register new pregnancies, screen pregnant mothers for danger signs and follow up pregnant mother to remind them to attend the scheduled ANC clinic appintments. The postnatal (PNC) workflow supports CHWs to follow up PNC women and newborns for danger signs screening and refer PNC women with danger signs to facilities to receive more care.

#### Pregnancy workflow

{{< figure src="pregnancy_workflow.png"  link="pregnancy_workflow.png" alt="pregnancy workflow" title="" class="left col-12">}}

#### Delivery workflow
{{< figure src="delivery_workflow.png"  link="delivery_workflow.png" alt="delivery workflow" title="" class="left col-12">}}

#### Postnatal workflow
{{< figure src="post_natal_workflow.png"  link="post_natal_workflow.png" alt="post natal workflow" title="" class="left col-12">}}

### Integrated management of childhood illness (IMCI) workflow
This workflow is designed to support CHWs to identify symptomatic children at the household level, refer symptomatic children and conduct on-time follow ups for children through the follow up tasks

#### IMCI workflow

{{< figure src="IMCI_workflow.png"  link="IMCI_workflow.png" alt="IMCI workflow" title="" class="left col-12">}}

### Malnutrition workflow
The workflow supports CHWs to assess and identify malnourished children, refer them to a health facility and conduct on time follow ups.

#### Malnutrition workflow

{{< figure src="malnutrition_workflow.png"  link="malnutrition workflow.png" alt="malnutrition workflow" title="" class="left col-12">}}


### Family planning workflow
The FP workflow ensures that eligible women receive their FP needs with support from the CHWs. The FP workflow supports CHWs to counsel eligible women on FP, refer women to facilities for FP services screen FP clients for side effects and refer and ensure ontime FP renewals.

#### Family planning workflow

{{< figure src="family_planning_workflow.png"  link="family planning workflow.png" alt="family planning workflow" title="" class="left col-12">}}


### TB workflows
The TB workflow enables CHWs to screen patients for TB, refer suspected TB cases to senior CHW for sputum collection and follow up TB patients. Senior CHWs who are based at the community level submit the sputum collection form after collecting the sputum samples for TB testing and the Site CHWs who are based at the facility level support in notifying CHWs when the TB results are out and in tracing TB defaulters..

#### TB workflow for TB cases identified in a community setting

{{< figure src="TB_workflow.png"  link="TB workflow.png" alt="TB workflow" title="" class="left col-12">}}

#### TB workflow for TB confirmed cases and TB defaulters

{{< figure src="TB_workflow_screened.png"  link="TB_workflow_screened.png" alt="TB workflow screened" title="" class="left col-12">}}

### Non communicable diseases workflow
The non communicable diseases workflows support health care workers to screen for NCD symptoms, refer suspected cases to facilities and trace clients who have defaulted treatment.

{{< figure src="ncd.png"  link="ncd.png" alt="NCD" title="" class="left col-12">}}

{{< figure src="ncd_1.png"  link="ncd_1.png" alt="NCD" title="" class="left col-12">}}

### Human Immunodeficiency Virus workflow
The Human Immunodeficiency Virus (HIV) workflow is designed to guide CHWs in HIV screening of household members, screening for side effects for persons on antiretroviral treatment and CHWs can use the workflows to trace defaulters who are on ART treatment.

{{< figure src="Human_Immunodeficiency_Virus.png"  link="Human_Immunodeficiency_Virus.png" alt="Human Immunodeficiency Virus" title="" class="left col-12">}}

## Resources to Get Started

Here are a few additional resources to help get you started with the maternal and newborn health reference application.

- View the [configuration code for this reference app](https://github.com/medic/cht-pih-malawi-app)
- Install the reference app following these [easy installation instructions]({{< ref "apps/tutorials/local-setup" >}})
- Modify the maternal and newborn reference application for your project context using [configuration best practices]({{< ref "design/best-practices" >}})

The open sharing of digital health apps used by CHWs is a monumental milestone in the digital health space, and for the CHT Community. Reach out on the [forum](https://forum.communityhealthtoolkit.org/) to share how you will leverage these resources, along with your feedback and continued innovations that could benefit the larger community.
