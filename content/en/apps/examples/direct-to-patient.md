---
title: "Direct-to-patient workflows"
linkTitle: "Direct-to-patient workflows"
weight: 1
description: >
  Reference for Direct-to-patient workflows with CHT and RapidPro
relatedContent: >
  apps/concepts
  apps/reference/forms/app
  apps/reference/tasks
---

{{% pageinfo %}}
This documentation provides a guide for designing and deploying direct-to household workflows for patient care using CHT. It can serve as a great way to learn how to integrate CHT’s with technologies like [RapidPro](https://docs.communityhealthtoolkit.org/apps/features/integrations/rapidpro/) and SMS aggregators  to build direct-to-patient workflow.
{{% /pageinfo %}}


## Problem being addressed
The distance to the nearby health service provider and access to the smartphone can play a major role in getting proper medical attention. It is important to bring medical services within reach of those who own feature phones and live in remote areas. Direct-to-patient workflows assists medical needs of such patients through automated chat, live chat, or voice follow-up calls by a nurse or their assigned Community Health Worker (CHW). Direct to patient messaging can help improve healthcare access, encourage patient engagement in care, promote healthy behaviour and support delivery of patient centered care in rural areas. These automated workflows also empower patients to seek medical help by simply sending text messages or calling without any incurring charges.

## Solution overview
CHT SMS based workflow can be configured to support direct patient messaging to household and household members. The direct patient workflow can be designed to support:
<ul>
<li> <strong>Escalation of safe care</strong> to assigned CHW, a nurse, or immediate referral. Escalated workflows can result in Tasks in CHT apps for CHWs or other health workers.</li>
<li><strong>Patient check-in</strong> through daily messages to keep track of the patient's  condition.</li>
<li><strong>Scheduling</strong> of patient follow up appointments.</li>
<li><strong>Sharing of health messages</strong> or health tips with the patients.</li>
<li><strong>Two way conversation</strong> messaging between healthcare providers and patients/clients.</li>
<li><strong>Collect feedback</strong> from household members- survey.</li>
</ul>

#### CHT SMS workflow to support care coordination
SMS workflows in CHT can integrate with RapidPro flows to support two way interactive messaging between healthcare providers and household members. RapidPro is an open source tool that has the capability to support conversational messaging flows via SMS, IVR, Telegram, Facebook Messenger and WhatsApp. With the CHT-RapidPro integration it is possible to design and configure SMS workflows in the two systems; data is shared between CHT and Rapidpro via the APIs. The two-way texting messages can be posted to the CHT this information from RapidPro is used to update clients details on CHT CouchDB which can trigger tasks on CHT. CHT-RapidPro SMS workflows allows for scheduling, replying and routing to an SMS based gateway based on preconfigured SMS logic, thus eliminating the need for an individual to send, monitor and reply to each text. To use SMS workflow with CHT, you will need a texting channel- channel (a service that enables you to send or receive messages or a phone call). CHT can be integrated with a texting channel like an SMS aggregator which provides a reliable cloud based platform to send and receive an unlimited number of SMSs to and from clients.

The CHT-RapidPro integration enables App builders to build complex conversational SMS workflows that support patient care and support coordination of care at the community level.

 ## Direct Messaging technical architecture

{{< figure src="technicalArchitecture.jpg"  link="technicalArchitecture.jpg" alt="Direct Messaging technical architecture" title="" class="left col-9">}}
### 1. Patient automated check in workflow
Pregnant mothers and postnatal mothers who own mobile phones are registered on CHT by a CHW, it is also possible for two  household members belonging to the same household to be registered on CHT to be receiving texts using the same phone number. Mothers registered on CHT will receive preconfigured bidirectional check in texts to check on their condition as per the defined schedule, mothers can respond to checkin texts using [USSD](https://en.wikipedia.org/wiki/Unstructured_Supplementary_Service_Data). It is possible to configure on CHT to enable tasks to be generated when mothers and households report danger signs and they can be followed up by a CHW and based on their condition and be referred to the facilities for further review and treatment, this ensures there is a timely referral to the facilities. Patients are free to exit from the two way texting intervention, patients can text and inform health care workers that they are no longer interested in the check in texts and the check in texts will be stopped. Here is an example of an SMS check-in workflow.

{{< figure src="CheckinWorkflow.png" link="CheckinWorkflow.png" alt="Check-in Workflow" class="col-9">}}

You can see the prototype for the above workflow below which captures various flows listed above.

{{< figure src="" class="left col-3" >}}
{{< figure src="CheckinPrototype.gif" link="CheckinPrototype.gif" alt="Check-in prototype" title="" class="col-4 row justify-content-md-center">}}

The tasks created for CHW as mentioned above patient automated check in workflow can be as simple as shown below.

{{< figure src="taskDemo.png" class="col-9">}}

It is also possible for household members to initiate the bidirectional messaging with the CHT. This workflow empowers caregivers and household members to be able to screen themselves  and report any danger signs or request for help via SMS. For this workflow the logic that be preconfigured to support in health triage and clinical referrals

The workflows in RapidPro can be set up in such a way that they expire after a certain time period. Workflows can expire when there is no response from the patient within a time period. You can handle such situations by repeating the workflow i.e., sending them again to the patient after a certain time interval. Alternatively, it can be beneficial to do some research on which time to send the message. For example, a person may be busy at work and/or away from the phone during working hours. It may be easier for them to respond during early morning or later in the evening than in the afternoon.


### 2. Facility appointment reminders workflow

{{< figure src="aptReminderWorkflow.png"  link="aptReminderWorkflow.png" alt="Apt Reminder Workflow" title="" class="col-10">}}

Appointment reminders can be configured on CHT so that mothers can receive appointment reminders for prenatal, postnatal and immunization facility visits. Facility appointment reminders are configured as per the recommended health guidelines for pregnancy, postnatal and immunization health protocols. For this workflow, the immunization clinic visit reminders for under 5 have been configured as per the recommended immunization schedule. The clinic visit appointment reminders would stop once the period the child is expected to have completed the immunization schedule ends. Here is an example of an appointment reminder informing a caregiver to take the child to a facility for a third pneumococcal vaccination.

{{< figure src="" class="left col-2" >}}
{{< figure src="pneumococcal.png" link="pneumococcal.png" alt="Pneumococcal" title="" class="left col-6">}}


### 3. Active case finding by messaging household members with survey questions

Active case finding by messaging households with survey questions about the health of family members.

{{< figure src="" class="left col-3" >}}
{{< figure src="activeCases.gif" link="activeCases.gif" alt="Active Cases" title="" class="col-4 row justify-content-md-center">}}

### 4. Sharing of health messages feedback or health tips with the patients

{{< figure src="sharingTip.png" link="sharingTip.png" alt="Sharing Tip" title="" class="left col-5" >}}
{{< figure src="" class="left col-2" >}}
{{< figure src="sharingTip.gif" link="sharingTip.gif" alt="Sharing Tip" title="" class="left col-4">}}


## Required Resources
<ol>
<li><strong>Cht-conf </strong>
<li><strong>RapidPro </strong>
  <ul>
  <li>RapidPro best practices and lessons from integration with CHT
  </li>
  </ul>
  <li><strong>AfricasTalking</strong></li>
</ol>

## Implementation Steps
<ul>
    <li>RapidPro Messaging Gateway </li>
    <ul>
      <li>Describe process to create the workflow </li>
      <li>Creating flows for appointment reminders and regular automated check in messaging for patients </li>
    </ul>
    <li>Survey</li>
    <li>Africa’s Talking SMS Gateway</li>
      <ul>
    	 <li>Describe process to create SMS Gateway to bind with RapidPro</li>
      </ul>
    <li>Binding with CHT</li>
    <ul>
      <li>Describe process of binding all together with the CHT application</li>
    </ul>
</ul>


## Frequently Asked Questions
<ol>
  <li> Is the patient charged for receiving or sending the SMS?</li>
  <li> How reliable is SMS sending and receiving?</li>
  <li> What are ways to handle exceptions?</li>
  One possible way is to set up the mail group such that a notification email is sent whenever there is any exception. Another method is to keep track of whether the flow was completed i.e., all the responses from start to finish nodes were received. For the participants whose flow may have been interrupted or incomplete, one may run the workflow again.
  <li>Can you update the contact information in existing flows?</li>
</ol>
