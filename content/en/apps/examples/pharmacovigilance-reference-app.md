---
title: "Pharmacovigilance Reference app"
linkTitle: "Pharmacovigilance"
weight: 
description: >
 CHT example application that supports pharmacovigilance in a community setting.
relatedContent: >
  
---

## Problem Being Addressed
Self-medication, unregulated medical products, and counterfeit drugs have led to a significant increase in the prevalence of adverse drug reactions (ADRs), adverse effects following Immunization (AEFI), and the proliferation of poor-quality health products and technologies. ADRs are a common cause of hospital admissions and contribute to patient mortality, placing a substantial economic burden on resource-limited healthcare systems, especially in African countries.

Need for Pharmacovigilance:  Pharmacovigilance focuses on the detection, assessment, understanding and prevention of adverse effects and other potential drug-related problems. Pharmacovigilance facilitates early detection of unknown adverse reactions, identifies increases in frequency of known adverse reactions and helps disseminate information to improve drug prescription and regulation. To address these challenges, there is a crucial need for a robust pharmacovigilance system that enables the detection, reporting, and mitigation of adverse drug reactions and incidents.

## Solution Overview

The CHT Pharmacovigilance Reference app is designed and developed by [IntelliSOFT Consulting LTD](https://www.intellisoftkenya.com/). Components of Kenya’s Pharmacovigilance Electronic Reporting System have been integrated into the Community Health Toolkit (CHT) to support community health providers (CHPs) and Community Health Assistants (CHAs) to efficiently identify, report, refer and manage adverse drug reactions and AEFI while delivering healthcare. 

In the spirit of openness and as a contribution to the CHT open source project, Medic and IntelliSOFT have coordinated to release the source code and the workflows documentation of the CHT Pharmacovigilance Reference app.
This reference app provides an example app that other CHT Implementers can learn how they can build pharmacovigilance workflows to help improve patient safety for community members they serve

## Key Pharmacovigilance Areas Supported

 1. Adverse Drug Reactions (ADRs): detect and report ADRs resulting from pharmaceutical products.
 2. Adverse Effects Following Immunization (AEFI): monitor and report adverse effects following immunization.
 3. Poor Quality Health Products and Technologies: identify and report incidents related to the use of poor-quality health products and technologies
 4. Death  Monitoring: Monitor, identify, report and record deaths resulting from monitored conditions within household members in the Pharmacovigilance application
  

## Users and hierarchy

```
insert diagram
```

## Pharmacovigilance workflows

### Pharmacovigilance workflow that supports reporting, referral and follow up of patients

During a household visit, a CHP uses the pharmacovigilance app to assess household members for suspected severe adverse reactions from medication usage or recent vaccinations/immunisations. Using the assessment form a CHP records any suspicious issues   with the medication, such as unusual colour, smell, or packaging and adverse drug effects from medication and immunizations.

A public report task is generated for a CHA if a CHP submits a suspected case of adverse reaction. The public report form captures information about the adverse effects and medications including side effects, onset date, and current status of the reaction. Additionally, the form captures medication details such as name of the medicine, manufacturer, purchase location, start date, stop date, and expiry date. In case of multiple medications, the form allows a CHA  to enter more details about each medication. 

The CHA also uses the public report to record  outcome details, including outcome specification and recovery status. Using the public report form, the CHA is able to refer household members to the nearest facility for  further review and care, this action generates a  referral follow up task for the CHP. The referral follow up task appears 7 days after facility referral and it guides CHPs to follow up referred cases to confirm if patients attended the referral and CHPs can also check condition of patients, once a CHP completes the referral follow up task, the CHA gets patient status notification task.

```
insert diagram
```

### Death reporting and confirmation workflow

A CHP uses the assessment form to report a death caused by an adverse drug reaction, vaccination/immunisation, or poor quality medicine; submission of a death report triggers a death confirmation task for a CHA.

```
insert diagram
```

 



 
