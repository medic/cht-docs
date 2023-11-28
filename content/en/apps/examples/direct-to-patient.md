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

This documentation provides a guide for designing and deploying direct-to-patient messaging workflows to support patient care using the community health Toolkit (CHT). Direct-to-patient messaging documentation like that used for the two-way texting (2wT) between patients and their clinicians or health care providers, can serve as a great way for digital health implementers to learn how CHT can be integrated with technologies like [RapidPro](https://docs.communityhealthtoolkit.org/apps/features/integrations/rapidpro/) and SMS aggregators  to build direct-to-patient workflows.

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
The SMS workflows in CHT can integrate with RapidPro flows to support two way interactive messaging between healthcare providers and household members. RapidPro is an open source tool that has the capability to support conversational messaging flows via SMS, interactive voice response (IVR), Telegram, Facebook Messenger and WhatsApp. With the CHT-RapidPro integration it is possible to design and configure SMS workflows in the two systems; data is shared between CHT and Rapidpro via the APIs. The information from the interactive texting is used to update clients details on CHT CouchDB which can trigger tasks on CHT. 
CHT-RapidPro SMS workflows allows for scheduling, replying and routing to an SMS based gateway based on preconfigured SMS logic, thus eliminating the need for an individual to send, monitor and reply to each text. To use SMS workflow with CHT, you need a texting channel (a service that enables you to send or receive messages or a phone call). CHT can be integrated with a texting channel like an SMS aggregator which provides a reliable cloud based platform to send and receive an unlimited number of SMSs to and from patients or household members.

The CHT-RapidPro integration enables App builders to build complex conversational SMS workflows that support patient care and support coordination of care at the facility and community levels.

 ### Direct-to-patient workflow technical architecture

The CHT-RapidPro integration enables App builders to build complex conversational SMS workflows that support patient care and support coordination of care at the facility and community levels.
Clients are enrolled directly on a CHT app using a phone, tablet or computer. The resulting patient data is then stored and managed using CouChDB and postgress database system. Through the CHT application programming interface (API), client messages are sent to RapidPro and RapidPro pushes summary data back to CHT to update client responses and status. On clients interface these can be automated messages or interactive messages with healthcare providers. As SMS text message aggregator service and a short channel linked to RapidPro streamlines the incoming and outgoing text messages; while the CHT generates appropriate tasks to help the clinicians triage, refer, track and trace clients. Reports are also generated on CHT to keep track of completed actions and monitor patients as represented in figure 1 

{{< figure src="technicalArchitecture.png"  link="technicalArchitecture.png" alt="Direct Messaging technical architecture" title="" class="left col-9">}}
## Case adaptation: Voluntary medical male circumcision app co-designed by I-TECH and Medic
The Unviversity of Washington, Department of Global Health International Training and Educatuin Center for Health (I-TECH) and Medic have collaboratively designed, developed and scaled a CHT based voluntary medical male circumcision (VMMC) app. The app supports automated, interactive and two-way messaging between male circumcision health care providers and patients to help improve the quality of care and imprive efficieny to lower costs. In the spirit of contributing to the growth of public global goods, I-TECH and Medic have coordinated the application source code of the VMMC app. 

### Users and hierarchy example

{{< figure src="user_hierarchy.png"  link="user_hierarchy.png" alt="Users and hierarchy example" title="" class="left col-9">}}

### Workflows
Figure 4 below is the workflow for client enrollment, screening and VMMC procedures without the messaging.

#### 1. Patient automated check-in workflow to support patient care

Eligible male clients with access to phones are registered on VMMC app to enable them receive daily check-in texts to help track the condition of the clients for 13 days after the circumcision. During the registration (Day 0), details about the circumcision method, whether the client is an adult or minor and the preferred phone numbers to be used for communication are recorded. Clients also receive also postoperative counselling using the 2wT flipbook on how to respond to daily SMS text message and review photos that illustrate the terms used in daily SMS check in messages.
After the registration, the VMMC clients registered on the VVMC app receive preconfigured bidirectional daily follow up texts to check on their condition. These are in teh form of automated daily SMS text message on day 1 to 13. The clients respond to the daily SMS text message with a single numeric (0 or 1) response: and the could respond to any daily SMS text message at any time. Clients can also initiate unrestricted, freely-worded text response at any time and in any language instead of or in addition to the daily numeric response.
The client's responses to the daily check-in texts inform teh Site Nurse of the clients condition: 1=Yes, indicates potential adverse effects while 0=No indicates the patient is okay with no potential adverse effects.
{{< figure src="automated_check_in.png"  link="automated_check_in.png" alt="Patient automated check-in SMS workflows" title="" class="col-9">}}
#### 2. Triaging to care workflow for clients with potential complications

Clients with potential complications (those who report with 1 or free text indicating concerns) are folloowed up by Site Nurses and given care via the VMMC app with SMS/call, providing education and reassurance; or referred in cases where they need to go to a health facility for review or sending a clinical team to review the clients at home if an emergency is suspected. The clients could also request for a call back to speak with the nurse during routine clinic hours; the nurse can also initiate calls to follow up with clients when desired.

{{< figure src="VMMC_follow_up.png"  link="VMMC_follow_up.png" alt="VMMC tracing follow up tasks" title="" class="col-9">}}


#### 3. Escalated workflow to generate tasks when clients do not respond

VMMC clients have routine pre-scheduled visits on day 2 and 7 post-op. If a client has not responded to any of the daily check-in meassges by day 3, they get a reminedre message to check on them prompt a response. A tracing follow up task is triggered for the 2WT Nurse if a VMMC client does not respond to any of the daily check-in texts by day 4 for both minors and adults. The 2WT nurse then records the tracing method and outcomes by completing the trace client task.



## More scenarios where direct-to-patient messaging can be used to support patient care

### 1. Facility appointment reminders workflow
Appointment reminders can be configured on CHT so that household members and patients can receive facility appointment reminders. Facility appointment reminders are configured as per the recommended health guidelines for specific use cases. The clinic visit appointment reminders can be configured to automatically stop once a patient completes the expected clinic visits.

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
