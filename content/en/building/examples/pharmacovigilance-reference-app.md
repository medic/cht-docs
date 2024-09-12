---
title: "Pharmacovigilance Reference app"
linkTitle: "Pharmacovigilance"
weight:
description: >
 CHT example application that supports pharmacovigilance in a community setting.
relatedContent: >

aliases:
   - /apps/examples/pharmacovigilance-reference-app
---

## Problem Being Addressed
Self-medication, unregulated medical products, and counterfeit drugs have led to a significant increase in the prevalence of adverse drug reactions (ADRs), adverse effects following Immunization (AEFI), and the proliferation of poor-quality health products and technologies. ADRs are a common cause of hospital admissions and contribute to patient mortality, placing a substantial economic burden on resource-limited healthcare systems, especially in African countries.

Need for Pharmacovigilance:  Pharmacovigilance focuses on the detection, assessment, understanding and prevention of adverse effects and other potential drug-related problems. Pharmacovigilance facilitates early detection of unknown adverse reactions, identifies increases in frequency of known adverse reactions and helps disseminate information to improve drug prescription and regulation. To address these challenges, there is a crucial need for a robust pharmacovigilance system that enables the detection, reporting, and mitigation of adverse drug reactions and incidents.

## Solution Overview

The CHT Pharmacovigilance Reference app is designed and developed by [IntelliSOFT Consulting LTD](https://www.intellisoftkenya.com/). Components of Kenya’s Pharmacovigilance Electronic Reporting System have been integrated into the Community Health Toolkit (CHT) to support community health providers (CHPs) and Community Health Assistants (CHAs) to efficiently identify, report, refer and manage ADRs and AEFI while delivering healthcare.

In the spirit of openness and as a contribution to the CHT open source project, Medic and IntelliSOFT have coordinated to provide the source code and documentation of the workflows of the CHT Pharmacovigilance Reference app.
This reference app serves as an example application that other CHT Implementers can use to learn how to build pharmacovigilance workflows to help improve patient safety for the community members they serve.

## Key Pharmacovigilance Areas Supported

 1. Adverse Drug Reactions (ADRs): detect and report ADRs resulting from pharmaceutical products.
 2. Adverse Effects Following Immunization (AEFI): monitor and report adverse effects following immunization.
 3. Poor Quality Health Products and Technologies: identify and report incidents related to the use of poor-quality health products and technologies.
 4. Death  Monitoring: Monitor, identify, report and record deaths resulting from monitored conditions within household members in the Pharmacovigilance application.


## Users and hierarchy

{{< figure src="PharmacovigilanceHierarchy.png" link="PharmacovigilanceHierarchy.png" class="right col-12 col-lg-12" >}}



## Pharmacovigilance workflows

### Reporting, referral and follow up of patients

During a household visit, a CHP uses the pharmacovigilance app to assess household members for suspected severe adverse reactions to medication or recent vaccinations/immunizations. Using the assessment form, a CHP records any suspicious issues with the medication, such as unusual colour, smell, or packaging and adverse drug effects from medication and immunizations.

A public report task is generated for a CHA once a CHP submits a suspected case of adverse reaction. The public report form captures information about the adverse effects and medication including side effects, onset date, and current status of the reaction. Additionally, the form captures medication details such as name of the medicine, manufacturer, purchase location, start date, stop date, and expiry date. In case of a variety of medicines, the form allows a CHA to perform multiple entries.

The CHA also uses the public report to record  outcome details, including outcome specification and recovery status. Using the public report form, the CHA is able to refer household members to the nearest facility for further review and care, this action generates a referral follow up task for the CHP. The referral follow up task appears 7 days after facility referral and guides the CHP to follow up referred cases to confirm if patients attended the referral . The CHP can also check the condition of patients and once they complete the referral follow up task, the CHA gets patient status notification task.

{{< figure src="Workflow.png" link="Workflow.png" class="right col-12 col-lg-12" >}}


### Death reporting and confirmation workflow

A CHP uses the assessment form to report a death caused by an adverse drug reaction, vaccination/immunization, or poor quality medicine; submission of a death report triggers a death confirmation task for a CHA.

{{< figure src="deathReportingConfirmation.png" link="deathReportingConfirmation.png" class="right col-12 col-lg-12" >}}

## Resources to Get Started

Here are a few additional resources to help get you started with the pharmacovigilance health reference application.

- View the [configuration code for this reference app](https://github.com/medic/cht-accelerator/tree/main/IntelliSOFT/Example%20CHT%20application/cht_pvers)
- Install the reference app following these [easy installation instructions]({{< ref "building/tutorials/local-setup" >}})
- Modify the pharmacovigilance reference application for your project context using [configuration best practices]({{< ref "design/best-practices" >}})

The open sharing of digital health apps used by CHWs is a monumental milestone in the digital health space, and for the CHT Community. Reach out on the [forum](https://forum.communityhealthtoolkit.org/) to share how you will leverage these resources, along with your feedback and continued innovations that could benefit the larger community.

