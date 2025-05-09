---
title: "YendaNafe CHT app by PIH in Malawi"
linkTitle: "PIH Malawi"
weight:
aliases:
   - /apps/examples/pih
   - /building/examples/pih
   - /exploring/pih
---

{{< hextra/hero-subtitle >}}
  Reference app co-designed by PIH Malawi and Medic
{{< /hextra/hero-subtitle >}}

Since 2017, [Partners in Health (PIH) Malawi](https://www.pih.org/country/malawi) and [Medic](https://medic.org/) have collaboratively co-designed and developed YendaNafe, a digital health app for community based service provision. In the spirit of openness, Medic and PIH have coordinated the release of the full application source code of Yendanafe app as first of kind ‘‘Integrated CHT Reference app’’. This Reference app provides an example that CHT Implementers can learn how they can design and configure integrated workflows.

## Problem being addressed
Malawi is one of the countries with a high prevalence of HIV, high rates of infant and maternal mortality and a high burden of non communicable diseases (NCD) and tuberculosis. To help respond to community needs and reduce the disease burden, PIH in partnership with the Ministry of Health are implementing an integrated household model in Neno District. Under the model, community health workers (CHWs) and CHW supervisors have been equipped with the YendaNafe app, the app supports the health care workers to provide integrated community based health care services and to coordinate care.


## Solution overview
The YendaNafe app workflows support CHWs to conduct integrated disease screening, provide health care services, refer people in communities to facilities especially those who require facility based care and raise community awareness on health. The app is designed to support the following key health areas:

* Maternal child health (antenatal care and postnatal care)
* Family planning (FP)
* Malnutrition
* Immunization
* Integrated management of childhood illness (IMCI)
* Human Immunodeficiency Virus (HIV)
* Tuberculosis (TB)
* Non communicable diseases (NCDs)

## Users and hierarchy

|Users|Location|Devices|Roles|
|--|--|--|--|
|Community Health Director|admin level|Laptop or desktop| Staff at this level will be given access to dashboards where they can monitor program indicators. Online only access to the app.|
|CHW Manager and Officers|admin level|Laptop or desktop|Staff at this level will be given access to dashboards where they can monitor program indicators. Online only access to the app.|
|Site Supervisors (SS)|admin level|Laptop or desktop|Staff at this level will be given access to dashboards where they can monitor program indicators. Online only access to the app.|
|Senior CHWs (SCHW) - Supervisory role|Facility and community levels|Smartphone|They supervise CHW and mentor CHWs, collect sputum for probable TB cases. They are offline users.|
|CHWs|Community level|Smartphone|CHWs register households, conduct household visits, case screening, referrals, follow-ups, and defaulter tracing. They are offline users.|

## Workflows
### Maternal neonatal health workflow
This workflow consists of the pregnancy, delivery and postnatal workflows.The pregnancy workflow enables CHWs to register new pregnancies, screen pregnant mothers for danger signs and follow up pregnant mother to remind them to attend the scheduled ANC clinic appointments. The postnatal (PNC) workflow supports CHWs to follow up PNC women and newborns for danger signs screening and refer PNC women with danger signs to facilities to receive more care.

#### Pregnancy workflow

{{< workflow-table
  condition-image="pnc-chw.png"
  task-image="chw.png"
  resolution-image="pnc-chw-facility.png"
 >}}
  {{% workflow
        condition="Upon discovering a suspected pregnancy, a CHW escorts the woman to a health facility for a pregnancy test and submits a **Pregnancy Screening Form**."
        task="A **Pregnancy Confirmation and Referral Follow-up Task** will appear immediately and is due 3 days later. The task is to remind the CHW to confirm referral attendance and pregnancy status."
        resolution="The woman visits the health facility, gets a pregnancy test and starts ANC clinic."
  %}}
  {{% workflow
        condition="In case of a confirmed pregnancy(woman has started ANC visits) the CHW submits a **Pregnancy Registration Form** with gestational age and facility EDD if available."
        task="Every first day of the month, the CHW receives **Pregnancy Follow-Up Task** to remind that it is time to check into pregnant mother. The tasks continue for 42 weeks."
        resolution="The CHW submits **Pregnancy Follow-Up Form** demonstrating that she provided ANC counseling, gathered information from prior facility visits, screened for danger signs and reminded the woman of her upcoming facility ANC visit."
  %}}
  {{% workflow
        condition="If the CHW notices danger signs at any time, she submits a **Danger Sign Screening Form** and immediately refers or accompanies the patient to the facility depending on severity."
        task="A **Danger Sign Follow-Up Task** will appear immediately and is due 3 days later. Tasks persist for 7 days after due date."resolution="CHW submits a **Danger Sign Follow-Up Form**, verifying that she visited the woman to confirm that she attended the facility."
  %}}
{{< /workflow-table >}}

#### Delivery workflow
{{< workflow-table
  condition-image="pnc-chw.png"
  task-image="chw.png"
  resolution-image="pnc-chw-facility.png"
 >}}
  {{% workflow
        condition="A currently registered pregnant person has reached a gestational age of 42 weeks and has not had a miscarriage or a delivery reported."
        task="A **Delivery Task** requesting that the CHW check in on the woman to see whether she has delivered. Task appears from 38 weeks."
        resolution="If the woman has delivered and is available at home, CHW submits **Delivery Form**, confirming the pregnancy outcomes. Profiles are created for each baby that is alive. This \"ends\" the pregnancy workflow."
  %}}
  {{% workflow
        condition="When a woman delivers and is discharged from the health facility, a health facility staff (Site Supervisor) submits a **Delivery Discharge Form**."
        task="CHW receives a **Delivery Report Task** to inform them to visit the mother and report the delivery."
        resolution="CHW visits the mother, submits a **Delivery Form**, confirming the pregnancy outcomes. Profiles are created for each baby that is alive. This \"ends\" the pregnancy workflow."
  %}}
{{< /workflow-table >}}
#### Postnatal workflow

{{< workflow-table
  condition-image="anc-chw-facility.png"
  task-image="chw.png"
  resolution-image="anc-chw-facility.png"
 >}}
  {{% workflow
        condition="A woman delivers and CHW submits a **Delivery Report**."
        task="A **PNC Follow Up Task** for both mother and baby appear on the 3rd and 5th day post delivery. The task is to remind the CHW to visit the postnatal mother."
        resolution="CHW visits the mother and baby, submits a **PNC Follow Up Task** confirming that they visited the mother and/or baby, screened for danger and reminded them of upcoming facility appointment."
  %}}
  {{% workflow
        condition="If the CHW notices danger signs at any time for either mother or baby, she submits a **Danger Sign Form** and immediately refers to the facility depending on severity."
        task="A **Danger Sign Follow-Up Task** will appear within 2 days and is due 3 days later. Tasks persists for 7 days after due date."
        resolution="CHW submits a **Danger Sign Follow-Up Form**, verifying that she visited the woman/child to confirm that she attended the facility."
  %}}
{{< /workflow-table >}}

### Integrated management of childhood illness (IMCI) workflow
This workflow is designed to support CHWs to identify symptomatic children at the household level, refer symptomatic children and conduct on-time follow ups for children through the follow up tasks

#### IMCI workflow

{{< workflow-table
  condition-image="patient-child-chw.png"
  task-image="chw.png"
  resolution-image="patient-child-chw-facility.png"
 >}}
  {{% workflow
        condition="CHW visits, educates, and screens under 5 for cough, diarrhea, fast breathing, fever, and fever with convulsions. CHW submits a **IMCHI Screening Form** and refers to the health facility if necessary."
        task="A **IMCI Referral Follow-up Task** will appear within 2 days and is due 3 days later. The task is to remind the CHW to confirm referral attendance."
        resolution="A **IMCI Referral Follow-up Form**, verifying that she visited the child to confirm referral completion and offer adherence counselling or remind on upcoming appointments."
  %}}
{{< /workflow-table >}}
### Malnutrition workflow
The workflow supports CHWs to assess and identify malnourished children, refer them to a health facility and conduct on time follow ups.

#### Malnutrition workflow

{{< workflow-table
  condition-image="patient-child-chw.png"
  task-image="chw.png"
  resolution-image="patient-child-chw-facility.png"
 >}}
  {{% workflow
        condition="CHW counsels and screens under 5 for malnutrition using MUAC tape and danger signs. If suspected to be malnourished, the child is referred to the health facility. CHW submits a **Malnutrition Screening Form**."
        task="A **Malnutrition Referral Follow-up Task** will appear within 2 days and is due 3 days later. The task is to remind the CHW to confirm referral attendance."
        resolution="CHW submits **Malnutrition Referral Follow up Form** verifying that she visited the child to confirm that he was taken to health facility."
  %}}
  {{% workflow
        condition="If Child is malnourished, he/she is enrolled into malnutrition program either Outpatient Therapeutic Programme (OTP) or Supplementary Feeding Programme (SFP)."
        task="On the first day of every month, the CHW receives **Malnutrition Treatment Follow-Up Task** to remind them that it is time to check on the child. The task will continue showing till CHW indicates that the child has been exited from malnutrition programme."
        resolution="The CHW submits **Malnutrition Treatment Follow-Up Form** demonstrating that she provided adherence counselling, and reminded the caregiver of the child's upcoming facility visit."
  %}}
{{< /workflow-table >}}
### Family planning workflow
The FP workflow ensures that eligible women receive their FP needs with support from the CHWs. The FP workflow supports CHWs to counsel eligible women on FP, refer women to facilities for FP services screen FP clients for side effects and refer and ensure ontime FP renewals.

#### Family planning workflow

{{< workflow-table
  condition-image="patient-chw.png"
  task-image="chw.png"
  resolution-image="patient-chw-facility.png"
 >}}
  {{% workflow
        condition="Upon discovering a woman who is not pregnant and not on FP, the CHW provides FP education, refers them to a health facility if necessary and submits a **Family Planning Screening Form**."
        task="A **Pregnancy Confirmation and FP Follow-up Task** will appear 2 days and is due 3 days later. The task reminds the CHW to confirm referral attendance and FP status."
        resolution="The woman visits the health facility and is started on FP if eligible."
  %}}
  {{% workflow
        condition="A woman is found to be already on FP, the CHW records FP method, screen for side effects and counsel on adherence to method and clinic appointments."
        task="Every first day of the month, the CHW receives **Family Planning Follow-Up Task** to remind that it is time to check on the woman."
        resolution="The CHW submits **Family Planning Follow-Up Form** demonstrating that she screened for side effects, need to change FP methods, offered adherence counselling and remind the woman of her upcoming appointment."
  %}}
  {{% workflow
        condition="For women on long term FP methods either IUCD or implant, the CHW records the FP expiry date."
        task="One month to the expiry date the CHW receives **FP Expiry Follow-Up Task** to remind the woman to renew their FP. Tasks persists for 30 days past the due date."resolution="CHW submits a **FP Expiry Follow-Up Form**, verifying that she visited the woman to confirm that she attended the facility for either renewal or change of FP method."
  %}}
{{< /workflow-table >}}

### TB workflows
The TB workflow enables CHWs to screen patients for TB, refer suspected TB cases to senior CHW for sputum collection and follow up TB patients. Senior CHWs who are based at the community level submit the sputum collection form after collecting the sputum samples for TB testing and the Site supervisors who are based at the facility level support in notifying CHWs when the TB results are out and in tracing TB defaulters.

#### TB workflow for TB suspected cases identified in a community setting

{{< workflow-table
  condition-image="patient-chw.png"
  task-image="chw.png"
  resolution-image="patient-chw-facility.png"
 >}}
  {{% workflow
        condition="CHW educates and screens over 5's for TB using the cardinal signs. CHW refers any suspected person to the Senior CHW for sputum collection and submits a **TB Screening Form**."
        task="A **Sputum Collection Task** will appear immediately on the SCHW device. The task is to inform the SCHW to collect sputum from the referred person."
        resolution="SCHW submits **Sputum Collection Form** demonstrating that she collected the sputum from the referred person and submitted the samples to the health facility."
  %}}
  {{% workflow
        condition="When the TB results are ready, a Site Supervisors who is based at the health facility submits **TB Results Form** detailings the TB results outcome."
        task="A TB Results Task will appear immediately on the CHW device while **TB results Notification Task** will appear on the SCHW device."
        resolution="The TB Results task indicates the TB results outcome: positive, negative, or rejected. The SCHW submits **TB results notification form** demonstrating that they have updated the TB results in the paper based cough register."
  %}}
  {{% workflow
        condition="Person is found to be TB positive. CHW refers the person to the health facility for TB treatment commencement"
        task="A **TB Referral Follow-Up Task** will appear within 2 days on the CHW device and is due 3 days later. The task is meant to inform the CHW that it's time to follow up on the person to confirm referral attendance."
        resolution="The CHW submits **TB Follow-Up Form** demonstrating that she visited the person to confirm if she went to the health facility. CHW refers other household members to health facility for TB contact tracing."
  %}}
{{< /workflow-table >}}

#### TB workflow for TB confirmed cases and TB defaulters

{{< workflow-table
  condition-image="patient-chw.png"
  task-image="chw.png"
  resolution-image="patient-chw-facility.png"
 >}}
  {{% workflow
        condition="Person is on started on TB treatment."
        task="A CHW visits the person daily and submits **Daily Follow up Form**. This will continue till the person is cured and CHW submits TB exit form."
        resolution="The CHW submits **TB Daily Follow-Up Form** demonstrating that she provided adherence counselling, screened for danger signs/side effects and reminded the person of upcoming facility visits."
  %}}
  {{% workflow
        condition="A person walks into health facility without CHW referral and is enrolled into TB program. Site Supervisor submits a **TB Enrollment Form** indicating person has been enrolled in TB program."
        task="A **TB Follow-Up Task** will appear immediately on the CHW device. The task is meant to inform the CHW that the person has been enrolled in TB program and needs their follow up."
        resolution="The CHW submits **TB Daily Follow-Up Form** demonstrating that she provided adherence counselling, screened for danger signs/side effects and reminded the person of upcoming facility visits."
  %}}
  {{% workflow
        condition="A TB Client defaults on their clinic visit. Site Supervisor submits Trace Report indicating the missed visit details."
        task="A TRACE Follow-Up Task will appear immediately on the CHW device. The task is meant to inform the CHW that the person missed their clinic visit."
        resolution="The CHW submits **TRACE Follow-Up Form** demonstrating that she visited the TB patient and encouraged them to visit the health facility."
  %}}
{{< /workflow-table >}}

### Non communicable diseases workflow
The non communicable diseases workflows support health care workers to screen for NCD symptoms, refer suspected cases to facilities and trace clients who have defaulted treatment.

{{< workflow-table
  condition-image="patient-chw.png"
  task-image="chw.png"
  resolution-image="patient-chw-facility.png"
 >}}
  {{% workflow
        condition="CHW educates and screens over 5's for NCD symptoms. CHW refers any suspected person to the health facility and submits a **NCD Screening Form**."
        task="A NCD referral **Follow-up Task** will appear within 2 ays and is due 3 days later. The task is to remind the CHW to confirm referral attendance."
        resolution="CHW submits **NCD Referral Follow-up Form** verifying that she visited the person to confirm that he went to the health facility."
  %}}
  {{% workflow
        condition="Person is to found to have either NCD (hypertension, diabetes, epilepsy, asthma, mental health or heart failure) and is enrolled into NCD program."
        task="Every first day of the month, CHW receives **NCD Monthly Treatment Follow-up Task** to remind the CHW it's time to check on the person."
        resolution="The CHW submits **NCD Monthly Treatment Follow-up Form** demonstrating that she provided adherence counselling, screened for danger signs/side effects and reminded the person of upcoming facility visits."
  %}}
  {{% workflow
        condition="A person walks into health facility without CHW referral and is enrolled into NCD program. Site Supervisor submits a **Treatment Enrollment Form** indicating person has been enrolled in NCD program."
        task="A **NCD Monthly Treatment Follow-up Task** will appear immediately on the CHW device. The task is meant to inform the CHW that the person has been enrolled in NCD program and needs their follow up."
        resolution="The CHW submits **Monthly Treatment Follow-up Form** demonstrating that she provided adherence counselling, screened for danger signs/side effects and reminded the person upcoming facility visits."
  %}}
{{< /workflow-table >}}

{{< workflow-table
  condition-image="patient-chw.png"
  task-image="chw.png"
  resolution-image="patient-chw-facility.png"
 >}}
  {{% workflow
        condition="If NCD patient reports danger sign during the follow ups, the CHW immediately refers or accompanies the patient to the facility depending on severity of the danger sign."
        task="A **NCD Danger Signs Follow-up Task** will appear within 2 days and is due 3 days later. The task is to remind the CHW to confirm referral attendance."
        resolution="The CHW submits a **NCD Danger Sign Follow-up Form** verifying that she visited the NCD patient to confirm that she attended the facility."
  %}}
  {{% workflow
        condition="A NCD Client defaults on their clinic visit. Site Supervisor submits **Trace Report** indicating the missed visit details."
        task="A **TRACE Follow-up Task** will appear immediately on the CHW device. The task is meant to inform the CHW that the person missed their clinic visit."
        resolution="The CHW submits **TRACE Follow-up Form** demonstrating that she visited the NCD patient and encouraged them to visit the health facility."
  %}}
{{< /workflow-table >}}

### Human Immunodeficiency Virus workflow
The Human Immunodeficiency Virus (HIV) workflow is designed to guide CHWs in HIV screening of household members, screening for side effects for persons on antiretroviral treatment and CHWs can use the workflows to trace defaulters who are on ART treatment.

{{< workflow-table
  condition-image="patient-chw.png"
  task-image="chw.png"
  resolution-image="patient-chw-facility.png"
 >}}
  {{% workflow
        condition="CHW educates and screens over 5's for duration since last HIV test. CHW refers any eligible person to the health facility and submits a **HIV Screening Form**."
        task="A HIV testing referral **Follow-up Task** will appear within 2 days and is due 3 days later. The task is to remind the CHW to confirm referral attendance and HIV testing status."
        resolution="CHW submits **HIV Testing Referral Follow-up Form** verifying that she visited the person to confirm that he went to the health facility."
  %}}
  {{% workflow
        condition="If person tests HIV positive, he/she is enrolled into HIR/ART program and started on treatment."
        task="In the first year of treatment, the CHW visits the person daily and submits Daily Follow up Form."
        resolution="The CHW submits **Daily Follow-up Form** demonstrating that she provided adherence counselling, screened for danger signs/side effects and reminded the person of upcoming facility visits."
  %}}
  {{% workflow
        condition="A person walks into health facility without CHW referral and is enrolled into ART program. Site Supervisor submits a **Treatment Enrollment Form** indicating person has been enrolled in ART program."
        task="A **HIV Daily Follow-up Task** will appear immediately on the CHW device. The task is meant to inform the CHW that the person has been enrolled in NCD program and needs their follow up."
        resolution="The CHW submits **Daily Follow-up Form** demonstrating that she provided adherence counselling, screened for danger signs/side effects and reminded the person upcoming facility visits."
  %}}
{{< /workflow-table >}}
## Resources to Get Started

Here are a few additional resources to help get you started with the integrated health reference application.

- View the [configuration code for this reference app](https://github.com/medic/cht-pih-malawi-app)
- Install the reference app following these [easy installation instructions]({{< ref "building/local-setup" >}})
- Modify the maternal and newborn reference application for your project context using [configuration best practices]({{< ref "design/best-practices" >}})

The open sharing of digital health apps used by CHWs is a monumental milestone in the digital health space, and for the CHT Community. Reach out on the [forum](https://forum.communityhealthtoolkit.org/) to share how you will leverage these resources, along with your feedback and continued innovations that could benefit the larger community.
