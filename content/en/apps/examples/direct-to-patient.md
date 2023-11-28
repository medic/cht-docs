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

This documentation provides a guide for designing and deploying direct-to-client, two-way texting workflows to support patient care using the community health toolkit (CHT). Direct-to-client (D2C) messaging documentation, like that used for two-way texting (2wT) between clients and their clinicians or other healthcare workers, can serve as a great way for digital health implementers to learn how direct-to-client communication can be achieved through integrating app features within CHT with messaging technologies like [RapidPro](https://docs.communityhealthtoolkit.org/apps/features/integrations/rapidpro/) and SMS aggregators.

{{% /pageinfo %}}


## Problem being addressed
Barriers to the access of health care services for consumers including geographical distance, health worker availability, direct and indirect costs can present major challenges in patients getting proper health attention. It is important to bring healthcare services within reach to household members especially those who live in remote areas. Direct-to-client, two-way texting (D2C, 2wT) workflows assist in addressing the health needs of such patients through connecting patients with health care providers based at the facility or community levels instantly. D2C, 2wT can help improve healthcare access, encourage client engagement in care, promote healthy behaviour and support delivery of patient centered care in rural areas.

## Solution overview
CHT SMS based workflows can be configured to support D2C, 2wT between health care providers and household members. The D2C, 2wT workflows can be designed to support:
<ul>
<li><strong>Regular patient check-ins</strong> to help keep track of the patient's  condition.</li>
<li>Sending of <strong>patient follow up appointment reminders</strong>.</li>
<li>Sharing of <strong>information and educational health messages</strong> with the patients.</li>
<li><strong>Client tracing and client review tasks</strong> can be assigned to a CHW, a nurse, or immediate referral. Escalated workflows can result in tasks in CHT apps for nurses or other health care workers.</li>
<li><strong>Two-way conversation messaging</strong> between healthcare providers and patients/clients.</li>
<li><strong>Collect feedback</strong> from patients and household members.</li>
</ul>

The CHT also allows integration with health information systems (District Health Information Software 2) and facility-based electronic medical record systems such as OpenMRS.

## CHT SMS workflow technical overview
The SMS workflows in CHT can integrate with [RapidPro](https://docs.communityhealthtoolkit.org/apps/features/integrations/rapidpro/) flows to support two way interactive messaging between healthcare providers and household members. RapidPro is an open source tool that has the capability to support conversational messaging flows via SMS, Interactive Voice Response (IVR), Telegram, Facebook Messenger and WhatsApp. With the CHT-RapidPro integration, it is possible to design and configure SMS workflows in the two systems. Data is shared between CHT and Rapidpro via the APIs; and the information from the interactive texting is used to update clients details on CHT through CouchDB which can trigger tasks on CHT.
CHT-RapidPro SMS workflows allows for scheduling, replying and routing to an SMS based gateway based on preconfigured SMS logic, thus eliminating the need for an individual to send, monitor and reply to each text. To use SMS workflows with CHT, you will need a texting channel (a service that enables you to send or receive messages or a phone call). CHT can be integrated with a texting channel like an SMS aggregator which provides a reliable cloud based platform to send and receive an unlimited number of SMSs to and from patients or household members.

 ### Direct-to-patient workflow technical architecture

 The CHT-RapidPro integration enables App builders to build complex conversational SMS workflows that support patient care and support coordination of care at the facility and community levels.
 Clients are enrolled directly using the CHT D2C, 2wT app using a phone, tablet or computer. The resulting patient data is then stored and managed using CouchDB and a PostgreSQL database system. Through the CHT application programming interface (API), client messages are sent to Rapidpro, and RapidPro pushes summary data back to the CHT to  update client responses and status. On the client interface these can be automated messages or interactive free text with healthcare providers. An SMS text message aggregator service and a short code channel linked to RapidPro streamlines the incoming and outgoing SMS text messages; while the CHT generates the appropriate tasks (help clinicians triage, refer, track, and trace clients)and reports (keep track of completed actions and monitor patients) as represented in figure 1.

{{< figure src="Figure1SystemArchitecture.jpg" link="Figure1SystemArchitecture.jpg" alt="Direct Messaging technical architecture" title="" caption="<b>Figure 1:</b> System architecture of direct-to-client (D2C), two-way texting (2wT) for voluntary medical male circumcision (VMMC) postoperative care. API: application programming interface; CHT: Community Health Toolkit." class="left col-10">}}

## Case adaptation: Voluntary medical male circumcision app co-designed by I-TECH and Medic
The University of Washington, Department of Global Health’s International Training and Education Center for Health ([I-TECH](https://www.go2itech.org/)) and Medic collaboratively designed, developed, and scaled a CHT based voluntary medical male circumcision (VMMC) app. The D2C, 2wT app supports automated, interactive and direct-to-client messaging between male circumcision health care providers and patients to help improve the quality of care and improve efficiency to lower costs. In the spirit of contributing to the growth of the public global goods, I-TECH and Medic have coordinated to release the application source code of the D2C, 2wT app.

### Users and hierarchy

|Users|Location|Devices|Roles|
|--|--|--|--|
|Program managers / M&E|Admin level|Laptop|Users at this level have access to all sites. They can access many sites via the CHT D2C messaging App. They can download information from the dashboard.|
|Hub / Super nurse|Admin level|Laptop / Desktop|Users have access to multiple sites within the district and can access them via the CHT D2C messaging App. They are online users and are able to triage, refer clients to health facilities to be reviewed by site nurses.|
|Site nurse|Health facility or outreach site|Smartphone|Users are routine MC nurses at health facilities or outreach sites who enroll D2C clients and interact with clients enrolled at their site via the CHT D2C messaging app. In higher volume facilities, data clerks may also be involved in data entry of client enrolment details.|
|VMMC Clients|Community / household level|Smartphone / feature phone|VMMC clients with access to mobile devices and who have consented to participate in and have been enrolled into the D2C, 2wT app. They will receive daily check in messages and can communicate with their health care providers via text.|

<b>Figure 2:</b> User types and hierarchy

### Workflows
Current workflow for VMMC client enrollment, screening and VMMC procedures (without messaging) are as described in figure 3 below.

{{< figure src="Figure3Workflows.png"  link="Figure3Workflows.png" alt="Users and hierarchy example" title="" caption="<b>Figure 3:</b> Voluntary male circumcision workflow before direct-to-client messaging was introduced" class="col-9">}}


#### 1. Patient automated check-in workflow to support patient care

Eligible male clients with access to phones are registered on VMMC app to enable them receive daily check-in texts to help track the condition of the clients for 13 days after the circumcision. During registration (Day 0), details about the method of circumcision; whether the client is an adult or a minor, and the preferred phone numbers to be used for communication are recorded. Clients also receive postoperative counseling using the 2wT flip-book on how to respond to the daily SMS text message and review photos that illustrate the terms used in the daily SMS text messages.

After the registration, the VMMC clients registered on the VMMC app receive preconfigured bidirectional daily follow up texts to check on their condition. These are in the form of automated daily SMS text messages on days 1 to 13 in the predominant languages of the area. The clients respond to the daily SMS text message with a single numeric (0 or 1) response; and they could respond to any daily SMS text message at any time. They could also initiate an unrestricted, freely-worded text response at any time, and in any language -  instead of or in addition to the daily numeric response.

The  client's responses to the daily check-in texts inform the Site Nurse of the client's condition: 1=Yes, indicates potential adverse effect(s) while 0=No, indicates the client is okay with no potential adverse effects (see Figure 4).

An adverse effect (AE) is any complication or problem that may happen during or after voluntary medical male circumcision (VMMC).


{{< figure src="Figure4PatientAutomated.png"  link="Figure4PatientAutomated.png" alt="Patient automated check-in SMS workflows" title="" caption="<b>Figure 4:</b> Direct to client messaging for voluntary male circumcision clients without adverse effects" class="col-9">}}

#### 2. Triaging to care workflow for clients with potential complications

Clients with potential AEs (those who respond with 1 or a free text indicating concerns) are followed up by nurses and given care via the D2C, 2wT App with SMS / call, providing education and reassurance; or referred in cases where they need to go to a health facility for review or sending a clinical team to review the clients at home if an emergency was suspected (Figure 5). The clients could also request a call back to speak with the nurse during routine clinic hours; the nurse could also initiate calls to follow up with clients when desired.

{{< figure src="Figure5Triage.png"  link="Figure5Triage.png" alt="" title="" caption="<b>Figure 5:</b> Direct-to-client messaging for voluntary male circumcision clients without adverse effects" class="col-9">}}

#### 3. Escalated workflow to generate tasks when clients do not respond

VMMC clients have routine pre-scheduled visits on day 2 and day 7 post-op. If the client has not responded to any of the daily check in-messages by day 3, they get a reminder message to check on them and prompt a response. A tracing follow up task is triggered for the 2WT nurse if a VMMC client does not respond to any of the daily check in texts by day 4 for both minors and adults. The 2WT nurse then records the tracing  method and outcomes by completing the trace client task.
A VMMC client who responds with a potential complication triggers a Client review: Potential complication task for the 2WT nurse. They then report and fill in whether the client was reviewed by a clinician. If the client has been reviewed by a clinician, they record the details of the review, time, place and adverse effect identified. If the client has not been reviewed by a clinician, the 2WT nurse will try and trace them by SMS, phone call or a home visit; and report the tracing outcomes as shown in figure 6 below.


{{< figure src="Figure6Escalted.png"  link="Figure6Escalted.png" alt="" title="" caption="<b>Figure 6:</b> Direct-to-client messaging for voluntary male circumcision clients without adverse effects" class="col-9">}}


#### 4. Clients can share requests by messaging health care providers.
Clients registered in the intervention can also initiate the bidirectional messaging with a 2WT Nurse by messaging a central phone number or a short code. Clients can report any concern, ask a question about wound healing, or request for help from health care providers via SMS. For this workflow, the logic can be preconfigured to support health triage and clinical referrals. Using the messaging functionality on CHT, health care providers based at the facility can view, manage and respond to incoming texts from VMMC clients.

## Evidence Impact
In collaboration with researchers at the University of Washington, we  assessed the effectiveness of the 2wT intervention through randomized controlled trials in Zimbabwe and South Africa. The foundational randomized control trial in Zimbabwe in 2018, demonstrated that post-surgical patient follow up via SMS was as safe as follow up care at the clinic, and that the transition to SMS-based follow-up option enabled an 85% reduction in unnecessary clinic visits. Similar findings were reported in South Africa. This approach to messaging with patients was more efficient and cheaper than standard care, thereby lowering costs. Both clients and clinicians both found the approach to be highly usable and acceptable for post-operative care and further usability studies found that it was preferred by patients  and providers alike (see figure 7). We are also expanding our application of D2C, 2wT for antiretroviral therapy (ART) patients in Malawi, aiming to have similarly positive impact on engagement in ART and retention in HIV care.

{{< figure src="Figure7EvidenceOfImpact.png"  link="Figure7EvidenceOfImpact.png" alt="" title="" caption="<b>Figure 7:</b> Evidence supported benefits of direct-to-client messaging for voluntary male circumcision clients" class="col-9">}}

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

<div class="row">
{{< figure src="logoaurum.png"  link="" alt="" title="" class="col-3">}}
{{< figure src="logouw.png"  link="" alt="" title="" class="col-3">}}
{{< figure src="logomedic.png"  link="" alt="" title="" class="col-3">}}
</div>

## Resources

VMMC code can be accessed using the following link [D2C messaging app for post-op care](https://github.com/medic/cht-post-ops-app)
##### Training materials
- User manual
- Trainer of trainers slide deck
- Flip Books (updated to include WhatsApp)

##### Illustrative [Videos](https://drive.google.com/drive/folders/1AKsjdhJD3-3nXAqKTzakGAyZS9itnsk2?usp=sharing)

##### Links to related pages - Medic website stories, UW website, I-tech,
