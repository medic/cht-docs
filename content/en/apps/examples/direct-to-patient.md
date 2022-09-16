---
title: "Direct-to-patient messaging workflows on CHT"
linkTitle: "Direct-to-patient messaging workflows on CHT "
weight:
description: >
  Reference for Direct-to-patient workflows with CHT and RapidPro
relatedContent: >
  apps/concepts
  apps/reference/forms/app
  apps/reference/tasks
---

{{% pageinfo %}}

This documentation provides a guide for designing and deploying direct-to-patient messaging workflows to support patient care using CHT. It can serve as a great way to learn how to integrate CHT’s with technologies like [RapidPro](https://docs.communityhealthtoolkit.org/apps/features/integrations/rapidpro/) and SMS aggregators  to build direct-to-patient workflows.

{{% /pageinfo %}}


## Problem being addressed
The distance to the nearby health service provider can play a major role in getting proper health attention. It is important to bring healthcare services within reach to household members who have access to phones and live in remote areas. Direct-to-patient workflows assist health needs of such patients through connecting patients with health care providers based at the facility or community levels. Direct to patient messaging can help improve healthcare access, encourage patient engagement in care, promote healthy behaviour and support delivery of patient centered care in rural areas.

## Solution overview
CHT SMS based workflow can be configured to support direct-to-patient messaging between health care providers to household members. The direct patient workflows can be designed to support:
<ul>
<li> <strong>Escalation of safe care</strong> to assigned CHW, a nurse, or immediate referral. Escalated workflows can result in tasks in CHT apps for nurses or other health care workers.
</li>
<li><strong>Regular patient check-in</strong> to help keep track of the patient's  condition.</li>
<li><strong>Sending</strong> of patient follow up appointments reminders.</li>
<li><strong>Sharing of health messages</strong> with the patients.</li>
<li><strong>Two way conversation</strong> messaging between healthcare providers and patients/clients.</li>
<li><strong>Collect feedback</strong> from patients and household members.</li>
</ul>

## CHT SMS workflow technical overview
The SMS workflows in CHT can integrate with RapidPro flows to support two way interactive messaging between healthcare providers and household members. RapidPro is an open source tool that has the capability to support conversational messaging flows via SMS, IVR, Telegram, Facebook Messenger and WhatsApp. With the CHT-RapidPro integration it is possible to design and configure SMS workflows in the two systems; data is shared between CHT and Rapidpro via the APIs. The information from the interactive texting is used to update clients details on CHT CouchDB which can trigger tasks on CHT. CHT-RapidPro SMS workflows allows for scheduling, replying and routing to an SMS based gateway based on preconfigured SMS logic, thus eliminating the need for an individual to send, monitor and reply to each text. To use SMS workflow with CHT, you will need a texting channel (a service that enables you to send or receive messages or a phone call). CHT can be integrated with a texting channel like an SMS aggregator which provides a reliable cloud based platform to send and receive an unlimited number of SMSs to and from patients or household members.

The CHT-RapidPro integration enables App builders to build complex conversational SMS workflows that support patient care and support coordination of care at the facility and community levels.

 ### Direct-to-patient workflow technical architecture

 The CHT-RapidPro integration enables App builders to build complex conversational SMS workflows that support patient care and support coordination of care at the facility and community levels.

{{< figure src="technicalArchitecture.png"  link="technicalArchitecture.png" alt="Direct Messaging technical architecture" title="" class="left col-9">}}
## Use of direct-to-patient messaging to support voluntary medical male circumcision (VMMC)

### Users and hierarchy example

{{< figure src="user_hierarchy.png"  link="user_hierarchy.png" alt="Users and hierarchy example" title="" class="left col-9">}}

### VMMC direct messaging workflows

#### 1. Patient automated check-in workflow to support patient care

Eligible male clients with access to phones are registered on CHT to enable them receive daily check-in texts to help track the condition of the clients for 13 days after the circumcision. After the registration, the VMMC clients receive a registration text message confirming that they have enrolled in the text messaging follow up intervention. It is also possible for two household members belonging to the same household to be registered on CHT to be receiving texts using the same phone number.
Clients registered on CHT will receive preconfigured bidirectional daily follow up texts to check on their condition and clients respond to the check in texts by informing the Site Nurse whether they are experiencing any potential adverse effects. Clients with potential adverse effects are followed up by facility Nurses and guided or referred to a health facility to be able to receive further care.
{{< figure src="automated_check_in.png"  link="automated_check_in.png" alt="Patient automated check-in SMS workflows" title="" class="col-9">}}
#### 2. Escalated workflow to generate tasks on CHT

A VMMC client who responds with a potential adverse effect triggers a task for a Super Nurse. Tracing follow up tasks are triggered for a Super Nurse if a VMMC client does not respond to any of the daily check in texts for seven days.

{{< figure src="VMMC_follow_up.png"  link="VMMC_follow_up.png" alt="VMMC tracing follow up tasks" title="" class="col-9">}}


#### 3. Clients can share requests by messaging health care providers

Patients registered on CHT can also initiate the bidirectional messaging with a Site Nurse by messaging a central number in this case a short code. VMMC patients can screen themselves and report any danger signs or request for help from health care providers and chat with healthcare workers via SMS. For this workflow, the logic can be preconfigured to support health triage and clinical referrals. Using the messaging functionality on CHT, health care providers based at the facility can view, manage and respond to incoming texts from VMMC clients.


## More scenarios where direct-to-patient messaging can be used to support patient care

### 1. Facility appointment reminders workflow
Appointment reminders can be configured on CHT so that household members and patients can receive facility appointment reminders. Facility appointment reminders are configured as per the recommended health guidelines for specific use cases. For example, immunization clinic visit reminders for under 5 children can be configured as per the recommended immunization schedule. The clinic visit appointment reminders can be configured to automatically stop once the period the child is expected to have completed the immunization schedule ends.

### 2. Active case finding by messaging household members with survey questions
Active case finding by messaging households with survey questions about the health of family members.


## Frequently Asked Questions
##### 1. Is the patient charged for receiving or sending the SMS?
It is possible for health programs to acquire a zero rated short code service which is free for patients and household members to send and receive texts from the short code.

##### 2. What are ways to handle exceptions?
Exceptions can occur when programs and flows do not work as expected. This may occur due to various technical issues and may be unavoidable. One possible way to handle these unwanted issues and errors is to set up the mail group such that a notification email is sent whenever there is any exception. Another method is to keep track of whether the flow was completed i.e., all the responses from start to finish nodes were received. For the participants whose flow may have been interrupted or incomplete, one may run the workflow again.

##### 3. Ways to improve response rate from patients or household members?
The workflows in RapidPro can be set up in such a way that they expire after a certain time period. Workflows can expire when there is no response from a patient within a time period. You can handle such situations by repeating the workflow i.e., sending them again to the patient after a certain time interval. Alternatively, it can be beneficial to do some research on which time to send the message. For example, a person may be busy at work and/or away from the phone during working hours. It may be easier for them to respond during early morning or later in the evening than in the afternoon

## Resources

- [RapidPro Messaging Gateway]({{< ref "apps/guides/messaging/gateways/rapidpro" >}})
- [Africa’s Talking SMS Aggregator]({{< ref "apps/guides/messaging/gateways/africas-talking" >}})
