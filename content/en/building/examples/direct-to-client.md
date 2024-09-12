---
title: "Direct-to-client, two-way texting workflows on CHT"
linkTitle: "Direct-to-client, two-way texting workflows on CHT"
weight:
description: >
  Reference for Direct-to-client, two-way texting workflows with CHT and RapidPro
relatedContent: >
  building/concepts
  building/reference/forms/app
  building/reference/tasks
aliases:
   - /apps/examples/direct-to-client
----

{{% pageinfo %}}

This documentation provides a guide for designing and deploying direct-to-client (D2C), two-way texting (2wT) workflows to support client follow-up care using the community health toolkit (CHT). 2wT is a mobile text messaging system built on open-source, CHT tools to engage clients in their health care; to facilitate  prompt client - healthcare provider interactions; to provide low-cost telehealth; and, to improve health care outcomes through the early identification of, and referral for,  potential complications.

The hybrid 2wT system is used for relaying automated health education and check in messages to clients, generating tasks to improve client follow-up and health provider reporting, while also allowing for free text interaction between clients and healthcare providers. This document describes the hybrid 2wT system features and its functionalities. It also provides an opportunity for digital health implementers to explore and learn how direct-to-client communication can be achieved through integrating app features within the CHT, with messaging technologies such as  [RapidPro](https://docs.communityhealthtoolkit.org/building/features/integrations/rapidpro/) and SMS aggregators.

{{% /pageinfo %}}


## Problem being addressed
Recipients of health care  in sub-Saharan Africa face significant barriers in accessing quality services. These barriers include geographical distance, limited availability of skilled health care workers, and both direct and indirect costs - all of which can present major challenges in clients getting timely access to  health care. It is important to bring healthcare services closer to client’s households, especially those who live in remote areas. The D2C / 2wT workflows assist in addressing the health needs of such clients through connecting clients with health care providers based at the facility or community, including both clinicians or lower-level healthcare workers. Unlike phone calls which must be answered, D2C / 2wT offers convenient care – allowing both parties to communicate when needed or wanted. Unlike interventions that require a smartphone or downloading an app, 2wT clients communicate directly via the SMS capability in even basic mobile phones.  D2C / 2wT can help improve healthcare access, encourage client engagement in care, promote healthy behaviors and support delivery of client centered care, including in harder to reach  rural or remote areas.

## Solution overview

The CHT offers general guidance on how  SMS workflows can be built on CHT. CHT SMS based workflows can be configured to support D2C / 2wT between health care providers and clients. The D2C / 2wT workflows can be designed to support:

<ul>
<li><strong>Regular client check-ins</strong> to help keep track of the client's condition</li>
<li>Sending of <strong>client follow up appointment reminders</strong> with confirmation requests</li>
<li>Sharing of <strong>information and educational health messages</strong> with the clients</li>
<li><strong>Client tracing and client review tasks</strong> can be assigned to specific healthcare workers. Escalated workflows can result in tasks in CHT apps for CHWs, clerks or nurses, depending on need</li>
<li><strong>Two-way conversation messaging</strong> between healthcare providers and clients</li>
<li><strong>2wT-based telehealth</strong>, providing a lower cost format for clinical triaging, reassurance or referral to in-person care via SMS</li>
</ul>

Furthermore, CHT allows integration with other health information systems including District Health Information Software 2 (DHIS2) and facility-based electronic medical record systems such as OpenMRS.

## CHT SMS workflow technical overview

The SMS workflows in CHT can integrate with [RapidPro](https://docs.communityhealthtoolkit.org/building/features/integrations/rapidpro/) flows to support two way interactive messaging between healthcare providers and household members. RapidPro is an open source tool that has the capability to support conversational messaging flows via SMS, Interactive Voice Response (IVR), Telegram, Facebook Messenger and WhatsApp. With the CHT-RapidPro integration, it is possible to design and configure SMS workflows in the two systems. Data is shared between CHT and Rapidpro via the APIs; and the information from the interactive texting is used to update clients details on CHT through CouchDB which can trigger tasks on CHT.

CHT-RapidPro SMS workflows allows for automated visit scheduling, replying and routing to an SMS based gateway based on preconfigured SMS logic, thus eliminating the need for a healthcare worker (clerk or clinician, depending on the intervention specifics) to send, monitor and reply to each text. To use SMS workflows with CHT, you will need a texting channel (a service that enables you to send or receive messages or a phone call). CHT can be integrated with a texting channel like an SMS aggregator which provides a reliable cloud based platform to send and receive an unlimited number of SMSs to and from clients or household members.


 ### Direct-to-client, two-way texting, technical architecture

The CHT-RapidPro integration enables App builders to build complex conversational SMS workflows that support client care and support coordination of care at the facility and community levels.

Clients are enrolled directly using the CHT D2C, 2wT app using a phone, tablet or computer. Clients need only simple phones and do not need to download an app. The resulting client data is then stored and managed using CouchDB and a PostgreSQL database system. Through the CHT application programming interface (API), client messages are sent to Rapidpro, and RapidPro pushes summary data back to the CHT to  update client responses and status. On the client interface these can be automated messages or interactive free text with healthcare providers. An SMS text message aggregator service and a short code channel linked to RapidPro streamlines the incoming and outgoing SMS text messages; while the CHT generates the appropriate tasks (help clinicians triage, refer, track, and trace clients)and reports (keep track of completed actions and monitor clients) as represented in figure 1.


{{< figure src="Figure1SystemArchitecture.jpg" link="Figure1SystemArchitecture.jpg" alt="Direct Messaging technical architecture" title="" caption="<b>Figure 1:</b> System architecture of direct-to-client (D2C), two-way texting (2wT) for voluntary medical male circumcision (VMMC) postoperative care. API: application programming interface; CHT: Community Health Toolkit." class="left col-10">}}

The CHT core framework has  inbuilt [privacy/security features](https://docs.communityhealthtoolkit.org/building/guides/privacy/) including two- factor authentication, role based authorization, data security, and a range of protected data access endpoints. The system can be configured to manage [user roles and permissions](https://docs.communityhealthtoolkit.org/building/concepts/users/) for access of CHT applications. Responsible data practices is enforced through the  [Privacy and Data Protection Policy](https://docs.communityhealthtoolkit.org/building/guides/privacy/policy/).

The D2C, 2wT app incorporates the CHT security features in order to protect client data and ensure the confidentiality and privacy of client information. Users are encouraged to use password protected user accounts, the app also has full disk encryption and auto-lock screens for users’ devices (android phones and tablets) in order to minimize the risk of unwarranted access. Role based access controls also make sure that users can only view and edit information that the permissions assigned to the user role allow them to.

## Case adaptation: Voluntary medical male circumcision app co-designed by I-TECH and Medic

The University of Washington, Department of Global Health’s International Training and Education Center for Health ([I-TECH](https://www.go2itech.org/)), Medic, and local partners including  Zim-TTECH, Lighthouse Trust, and Aurum Institute, collaboratively designed, developed, and scaled a CHT-based voluntary medical male circumcision (VMMC) app for post-operative follow-up with support from the National Institute of Health, USA The D2C, 2wT app supports automated, interactive telehealth via direct-to-client messaging between VMMC nurses  and clients. 2wT telehealth helps improve the quality and efficiency of care, maintaining client safety while lowering follow-up care costs. In the spirit of contributing to the growth of the public global goods, I-TECH and Medic have coordinated to release the application [source code of the D2C, 2wT app](https://github.com/medic/cht-post-ops-app).

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


#### 1. Automated check-in workflow to support client care

Eligible male clients with access to mobile phones are registered on the VMMC app to enable them to receive daily check-in texts to help track the condition of the clients for 13 days after the circumcision. During registration (Day 0), details about the method of circumcision; whether the client is an adult or a minor, and the preferred phone numbers to be used for communication are recorded. Each client receives an enrollment confirmation to ensure that the communication channel is open. Clients also receive postoperative counseling using the 2wT flip-book on how to respond to the daily SMS text message and review photos that illustrate the signs of complications for reporting via  daily SMS text messages. VMMC clients, including those with 2wT, have the option to attend routine pre-scheduled visits on day 2 and day 7 post-op.

After the registration, the VMMC clients registered on the VMMC app receive preconfigured, bidirectional daily follow up texts to check on their healing. These are in the form of automated daily SMS text messages on days 1 to 13 in the predominant languages of the area. The clients respond to the daily SMS text message with a single numeric (0=no problem or 1=I need help) response. They could respond to any daily SMS text message at any time. They could also initiate an unrestricted, freely-worded text response at any time, and in any language -  instead of or in addition to the daily numeric response.

An adverse event (AE) is any complication or problem that may happen during or after a surgery, including a VMMC surgery. AEs may be mild, moderate or severe. All moderate and severe AEs should be reviewed by a clinician. Moderate and severe AEs after VMMC are rare, but occur about 2% of the time. . Identifying AEs swiftly and managing them properly is a sign of a quality surgical program, including VMMC programs.  


{{< figure src="Figure4PatientAutomated.png"  link="Figure4PatientAutomated.png" alt="Patient automated check-in SMS workflows" title="" caption="<b>Figure 4:</b> Direct to client messaging for voluntary male circumcision clients without adverse effects" class="col-9">}}

#### 2. Triaging to care workflow for clients with potential complications

Clients with potential AEs (those who respond with 1 or a free text indicating concerns) are followed up by nurses and given care via the D2C, 2wT intervention. Clients may be followed up via SMS / call. Nurses provide education and reassurance, or refer in cases where they need to go to a health facility for in-person review if an emergency was suspected (Figure 5). The clients could request a call back to speak with the nurse during routine clinic hours; the nurse could also initiate calls to follow up with clients when desired.

{{< figure src="Figure5Triage.png"  link="Figure5Triage.png" alt="" title="" caption="<b>Figure 5:</b> Direct-to-client messaging for voluntary male circumcision clients without adverse effects" class="col-9">}}

#### 3. Escalated workflow to generate tasks when clients do not respond

If the client has not responded to any of the daily check in-messages by day 3, they get a reminder message to check on them and prompt a response. A tracing follow up task is triggered for the 2WT nurse if a VMMC client does not respond to any of the daily check in texts by day 4 for both minors and adults. The 2WT nurse then records the tracing  method and outcomes by completing the trace client task.

A VMMC client who responds with a potential complication triggers a Client review: Potential complication task for the 2WT nurse. They then report and fill in whether the client was reviewed by a clinician. If the client has been reviewed by a clinician, they record the details of the review, time, place and adverse events identified. If the client has not been reviewed by a clinician, the 2WT nurse will try and trace them by SMS, phone call or a home visit; and report the tracing outcomes as shown in figure 6 below.


{{< figure src="Figure6Escalated.png"  link="Figure6Escalated.png" alt="" title="" caption="<b>Figure 6:</b> Direct-to-client messaging for voluntary male circumcision clients without adverse effects" class="col-9">}}


#### 4. Clients can share requests by messaging health care providers.
Clients registered in the intervention can also initiate the bidirectional messaging with a 2WT Nurse by messaging a central phone number or a short code. Clients can report any concern, ask a question about wound healing, or request for help from health care providers via SMS. For this workflow, the logic can be preconfigured to support health triage and clinical referrals. Using the messaging functionality on CHT, health care providers based at the facility can view, manage and respond to incoming texts from VMMC clients.

## Evidence of Impact
In collaboration with researchers at the University of Washington, we  assessed the effectiveness of the 2wT intervention through randomized controlled trials in Zimbabwe and South Africa. The foundational [randomized control trial in Zimbabwe in 2018](https://trialsjournal.biomedcentral.com/articles/10.1186/s13063-019-3470-9), demonstrated that post-surgical client follow up via SMS was as safe as follow up care at the clinic, and that the transition to SMS-based follow-up option enabled an 85% reduction in unnecessary clinic visits. Similar findings were reported in [South Africa](https://www.jmir.org/2023/1/e42111/). This approach to messaging with clients was more efficient and [cheaper](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0239915) than standard care, thereby lowering costs. Both clients and clinicians both found the approach to be [highly usable](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0233234) and [acceptable for post-operative care](https://journals.sagepub.com/doi/full/10.1177/20552076231194924) and further [usability studies](https://formative.jmir.org/2023/1/e44122) found that it was preferred by clients  and providers alike (see figure 7). We are also expanding our application of D2C, 2wT for antiretroviral therapy (ART) clients in Malawi, aiming to have similarly [positive impact on engagement in ART and retention in HIV care](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0278806).

{{< figure src="Figure7EvidenceOfImpact.png"  link="Figure7EvidenceOfImpact.png" alt="" title="" caption="<b>Figure 7:</b> Evidence supported benefits of direct-to-client messaging for voluntary male circumcision clients" class="col-9">}}

## More scenarios where direct-to-client messaging can be used to support client care

### 1. Facility appointment reminders workflow
Appointment reminders can be configured on CHT so that household members and clients can receive facility appointment reminders. Facility appointment reminders are configured as per the recommended health guidelines for specific use cases. The clinic visit appointment reminders can be configured to automatically stop once a client completes the expected clinic visits.

### 2. Active case finding by messaging household members with survey questions
Active case finding by messaging households with survey questions about the health of family members.

## Frequently Asked Questions
##### 1. Is the client charged for receiving or sending the SMS?
It is possible for health programs to acquire a zero rated short code service which is free for clients and household members to send and receive texts from the short code.

##### 2. What are ways to handle exceptions?
Exceptions can occur when programs and flows do not work as expected. This may occur due to various technical issues and may be unavoidable. One possible way to handle these unwanted issues and errors is to set up the mail group such that a notification email is sent whenever there is any exception. Another method is to keep track of whether the flow was completed i.e., all the responses from start to finish nodes were received. For the participants whose flow may have been interrupted or incomplete, one may run the workflow again.

##### 3. Ways to improve response rate from clients?
The workflows in RapidPro can be set up in such a way that they expire after a certain time period. Workflows can expire when there is no response from a client within a time period. You can handle such situations by repeating the workflow i.e., sending them again to the client after a certain time interval. Alternatively, it can be beneficial to do some research on which time to send the message. For example, a person may be busy at work and/or away from the phone during working hours. It may be easier for them to respond during early morning or later in the evening than in the afternoon.

## Resources

VMMC code can be accessed using the following link [D2C messaging app for post-op care](https://github.com/medic/cht-post-ops-app)
##### Training materials
- [User guide including tools for the nurses and clients](https://drive.google.com/file/d/13fz8vDYSFNHLc2a-afsAEjM2nrmca6os/view?ts=65e996b1)
- Illustrative [Videos](https://www.youtube.com/watch?v=HNC5T7QuK2M&list=PLutu6_ZOg77dAgJhDCRKdEIUnThUsqjEh)
##### Publications

  - 2wT is safe and improves efficiency over routine visits: Evidence from [South Africa](https://www.jmir.org/2023/1/e42111/) and from [Zimbabwe](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6903365/)
  - 2wT is highly usable among clients: Evidence from [South Africa](https://journals.sagepub.com/doi/full/10.1177/20552076231194924) and from [Zimbabwe](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0233234)
  - 2wT saves program costs: Evidence from [South Africa](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0294449) and from [Zimbabwe](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0239915)
  - 2wT is usable for healthcare workers: Evidence from [South Africa](https://formative.jmir.org/2023/1/e44122)
  - 2wT is scale up, reaching over 45,000 in [Zimbabwe](https://journals.plos.org/digitalhealth/article?id=10.1371/journal.pdig.0000066)


<strong>Related pages</strong> - [UW website](https://sites.uw.edu/twowaytexting/), [I-tech/Aurum page](https://globalhealth.washington.edu/news/2020/07/02/expanding-two-way-texting-reduce-follow-appointments-male-circumcision-patients)

{{< figure src="Figure8Collab.png"  link="Figure8Collab.png" alt="" title="" class="col-9">}}

<strong>Funding:</strong> 2wT Zimbabwe was supported by the Fogarty International Center of the National Institutes of Health under Award Number R21TW010583, PI Feldacker. 2wT South Africa is supported by National Institute of Nursing Research of the National Institutes of Health (NIH) under award number 5R01NR019229, PIs Feldacker and Setswe. The content is solely the responsibility of the collaborators and authors and does not necessarily represent the official views of the National Institutes of Health.
