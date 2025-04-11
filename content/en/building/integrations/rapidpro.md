---
title: "RapidPro"
linkTitle: "RapidPro"
weight: 6
description: >
  Integrate interactive messaging conversations into CHT workflows
keywords: rapidpro 
aliases:
  - /apps/guides/integrations/best-practices/rapidpro
  - /apps/guides/integrations/rapidpro/ 
  - /building/guides/integrations/rapidpro/ 
  - /apps/features/integrations/rapidpro/
  - /building/features/integrations/rapidpro/
---

[RapidPro](https://app.rapidpro.io/) is the open-source platform that powers [TextIt](https://textit.com/), developed by UNICEF and Nyaruka. RapidPro allows you to visually build messaging workflows for mobile-based services. The flows support a variety of technologies such as: SMS, USSD, IVR, Telegram, Facebook Messenger, and WhatsApp. Review RapidPro’s documentation to familiarize yourself with various components that include the [API](https://rapidpro.io/api/v2/). Before you embark on designing an integrated RapidPro/CHT workflow, you should start by understanding the needs of your users, identifying a problem to solve, and establishing goals. While an integrated RapidPro/CHT workflow can open up many powerful and personalized messaging capabilities, introducing an additional technology solution does come with complexities and cost. A good way to mitigate some of the complexities of setting up and [hosting](https://rapidpro.github.io/rapidpro/docs/hosting/) RapidPro yourself is to utilize a SaaS solution such as [TextIt](https://textit.in/). TextIt offers transparent per message [pricing](https://textit.com/pricing) and free credits to start off.

To learn more about the platform, check out RapidPro on [GitHub](https://rapidpro.github.io/rapidpro/) or join their Google [Group](https://groups.google.com/g/rapidpro). 

Coming up with a design to accommodate user needs requires a detailed understanding of the capabilities of both systems and conceptually where it makes sense to introduce interactions between them. Below we introduce some of the key concepts in RapidPro, but to learn more you can have a look at their [documentation](https://rapidpro.github.io/rapidpro/docs/).

## Overview
CHT-based [SMS workflows]({{< ref "building/workflows/workflows-overview#sms-messaging" >}}) can be configured to support registering of new patients or pregnancies, recording outcomes of visits, confirmation via auto-responses, and scheduling reminders. Some projects are designed entirely around SMS workflows. The CHT also supports person to person SMS [messaging]({{< ref "building/messaging" >}}) from the Messages tab. 

For more complex messaging workflows or to utilize other messaging platforms, you can design workflows that leverage the functionality of RapidPro and the CHT together. This enables semi-automated, direct to patient approaches to health assessments and care coordination at the community level.

## Workflows
Integrated RapidPro/CHT workflows are very flexible and leverage the full functionality of each application; You configure RapidPro directly in RapidPro, and configure the CHT in the CHT and the two systems communicate with each other through APIs and [Outbound push]({{< ref "building/reference/app-settings/outbound" >}}). With this architecture, you are not limited to a subset of functionality within either application.

A simple RapidPro/CHT integration might include triggering an interactive SMS messaging flow in RapidPro whenever a new patient is registered in the CHT and then storing the responses of that messaging flow in the CHT. You could then conditionally trigger a [Task]({{< ref "building/tasks" >}}) for a health worker in the CHT based on the patient responses from the RapidPro flow. 

App builders have built and deployed a number of interactive messaging workflows that integrate RapidPro and the CHT already, see below for a few examples.

### Contact Tracing
The [COVID-19 Contact Tracing app]({{< ref "exploring/contact-tracing#workflow-example" >}}) uses RapidPro to send messages to quarantined COVID-19 patients. Messages are sent to the patients daily asking whether or not they developed new symptoms.  If so, a health worker will be notified by SMS and receive a CHT task. All responses to the RapidPro workflow are recorded in the CHT and can be queried in analytics.

### Remote Training
The [Remote Training by SMS app]({{< ref "exploring/training#remote-training-by-sms" >}}) uses RapidPro to train health workers on Antenatal Care in the language of their choice. If the health worker answers a training question incorrectly, a task can be created for their supervisor to follow up with them.

### CHW Symptom and Mental Health Checks
The [CHW Symptom and Mental Health Checks app](https://docs.google.com/document/d/19F6vOCNFKQnSyREiaBnryUmre20s5QZzYe0hWuWn-0k/edit) is used to proactively check in with health workers to screen for COVID-19 symptoms and/or the need for psychosocial counseling.


## RapidPro Concepts

Before designing your integrated RapidPro/CHT workflow, it's important to understand a couple key functional concepts in RapidPro: *Flows*, *Campaigns*, and *Triggers*.

### Flows
{{< figure src="flow-concept.png" link="flow-concept.png" class="right col-7 col-lg-5" >}}

[Flows](https://help.nyaruka.com/en/article/introduction-to-flows-1vmh15z/) are a series of steps you link together visually to define the interactions users will have. At any point in the flow, you can trigger actions such as sending an SMS, email, or calling external APIs. Flows are the base for RapidPro's other features.

*Use Case Example:* Send an SMS to a patient asking if they are experiencing any new symptoms today. If so, let the patient know that a CHW will contact them. If not, let the patient know that they will receive another check-in message in three days and to contact their CHW if any new symptoms develop before then.


*Additional Resource:* [How to Build a RapidPro Flow](https://youtu.be/WcFhpSFhFug).

### Campaigns

{{< figure src="campaign-concept.png" link="campaign-concept.png" class="right col-5" >}}

[Campaigns](https://help.nyaruka.com/en/article/introduction-to-campaigns-1d71057/) allow you to schedule messages and flows around a date unique to each contact in a group, like a delivery date or registration date. You can add any number of [Events](https://help.nyaruka.com/en/article/adding-a-campaign-event-1amovrz/) to the Campaign.

*Use Case Example:* Send a daily check-in message to quarantined patients for 14 days to see if they have developed any symptoms.

*Additional Resources:* [Creating a Campaign](https://youtu.be/3tJPOoHxJXE)

### Triggers

{{< figure src="trigger-concept.png" link="trigger-concept.png" class="right col-5" >}}

[Triggers](https://help.nyaruka.com/en/article/introduction-to-triggers-1pm94xb/) allow you to control how or when a Flow begins. A Trigger can be a keyword received in a text, a point in time, a missed call, or even a follow to a Twitter handle.

*Use Case Example:* Start a health assessment Flow whenever a person sends the text `assessment` to a specific short code.

*Additional Resources:* [Creating a Keyword Trigger that starts a Flow](https://help.nyaruka.com/en/article/creating-a-keyword-trigger-that-starts-a-flow-bpmhw0/)

## Workflow Design

Designing an integrated workflow between multiple systems is more of an art than a science. Drafting a sequence diagram (below) is a good first step. When drafting your sequence diagram, it is useful to consider a few key integration touchpoints that are common across many integrated workflows.

1. One system **initiates or triggers an action in** the other system
2. One system needs to **get information from** the other system
3. One system wants to **store or update data in** the other system


### Sequence Diagrams
A *sequence diagram* will help you identify the various actors in a given workflow and what the flow of data will look like. Below is an overview and example diagram for a patient initiated triage and feedback workflow. 

1. Patient triggers a RapidPro flow by sending a message to a short code
2. Using the phone number of the patient, RapidPro requests information from the CHT
3. The CHT responds with the patient's name and other details
4. RapidPro sends personalized messages to conduct triage for the patient 
5. RapidPro determines the outcome
6. RapidPro sends the outcome to the patient via SMS and posts the results to the CHT
7. If the patient needs to be followed-up with, the CHT creates a task for the appropriate CHW
8. Once the CHW completes that task, the CHT initiates the Feedback Flow in RapidPro
9. RapidPro logic records feedback via SMS from the patient
10. The results of the feedback flow are saved in the CHT 

![Sequence](sequence-diagram.png)

## Configuration

The information below focuses on specific interactions between RapidPro and the CHT, it does not cover RapidPro specific configuration, consult RapidPro documentation and resources for that. Also, the examples and code snippets below are using TextIt, the hosted RapidPro service mentioned above.

### Create RapidPro user in CHT

For RapidPro to communicate with the CHT, you need to create a [User]({{< ref "building/concepts/users" >}}) in the CHT that will be used by RapidPro when calling the CHT’s APIs.  This can be done from the [App Management]({{< ref "building/features/admin/" >}}) page in the CHT.  When adding the user in the CHT, be sure to select the `Gateway - Limited access user for Medic Gateway` [Role]({{< ref "building/concepts/users#roles" >}}).

### Globals

[Globals](https://help.nyaruka.com/en/article/global-variables-km8la6/) are shared values that can be referenced in flows, as well as broadcasts and campaigns, within your account referenced by `@globals.value_name`. They allow you to create a value once and use it repeatedly without having to reenter the value. Likewise, globals make updating a shared value much easier. Rather than manually changing a value everywhere it's used in your account, simply update the value found in your `Globals` page.

![Globals](globals.png)

Once you have configured a Global value, you can easily use it in your flows like this:

![Globals-Usage](globals-usage.png)


### Start RapidPro Flow from CHT

One of the most common activities you'll want to do is trigger a Flow in RapidPro based on something that occurred in the CHT. For example... whenever a specific form is submitted in the CHT with some conditional value, start a flow in RapidPro. To do this, you will use the [Outbound]({{< ref "building/reference/app-settings/outbound" >}}) feature in the CHT, invoking the [Flow Starts Endpoint](https://rapidpro.io/api/v2/explorer/) in RapidPro. 

Below is an example `outbound` config in the CHT called `textit-self-quarantine` that will trigger a flow in RapidPro whenever a `covid_trace_follow_up` form is submitted in the CHT where `symptom = no`. It will also pass an extra date value for `self_quarantine_enrollment`.

```JSON
{
  "textit-self-quarantine": {
    "relevant_to": "doc.type === 'data_record' && doc.form === 'covid_trace_follow_up' && doc.fields.trace.symptom === 'no'",
    "destination": {
      "base_url": "https://textit.in",
      "auth": {
        "type": "header",
        "name": "Authorization",
        "value_key": "textit.in"
      },
      "path": "/api/v2/flow_starts.json"
    },
    "mapping": {
      "flow": {
        "expr": "<UUID of Flow in RapidPro>'"
      },
      "urns": {
        "expr": "[ 'tel:' + doc.fields.inputs.contact.phone ]",
        "optional": false
      },
      "extra.self_quarantine_enrollment": {
        "expr": "new Date(doc.reported_date).getDate()+'-'+ (new Date(doc.reported_date).getMonth()+1) +'-' + new Date(doc.reported_date).getFullYear()+ ' ' + new Date(doc.reported_date).getHours() + ':' +  new Date(doc.reported_date).getMinutes()",
        "optional": false
      },
      "extra.name": "doc.fields.inputs.contact.surname"
    }
  }
}
```


### Save flow data to the CHT

Once a user has completed a Flow in RapidPro, it is likely you will want to record some of the information collected in the RapidPro flow back in the CHT. This can be achieved by utilizing the [Call Webhook](https://help.nyaruka.com/en/article/calling-a-webhook-adicxq/) action in RapidPro.

|Step |Application  |Config step |
|-----|--|--|
|1|CHT| Configure a [JSON Form]({{< ref "building/reference/app-settings/forms" >}}) that includes the fields from RapidPro you want to send to the CHT.|
|2|RapidPro|Add a *Call a Webhook* node.|
|3|RapidPro|`POST` to the [records endpoint]({{< ref "building/reference/api#post-apiv2records" >}}) in the CHT.  If you used the Global value mentioned above, the POST will look something like `@globals.api/v2/records`.|
|4|RapidPro|Set a `Result Name`| 
|5|RapidPro|Configure HTTP Headers to be `Content-Type` -> `application/json`|
|6|RapidPro|Configure the `POST Body` (see example below)|

{{< figure src="post-to-cht.png" link="post-to-cht.png" >}}


### Look up CHT data from RapidPro

Another common action you will likely need to perform in RapidPro is getting information from the CHT about a user or patient based on their phone number. You can use the [contacts-by-phone]({{< ref "building/reference/api#contacts-by-phone" >}}) API to get fully hydrated contacts associated to that phone number.



## Best Practices

### Messages

1. If language options are included allow users to select their preference before beginning the flow
2. Make sure the language and terminology of your messages are appropriate for the audience
2. Use a personalized welcome message before asking users to take actions
3. Keep content brief and relevant to the topic as to not overload the user 
4. Make your response requests and calls-to-action clear
4. Be cognizant of form collisions during assessments (ex. “0=no, 1=yes” if those numbers may also reference workflow codes, or “N=no” if “N” is the code to create a new person)
5. Use standards in logic where possible (ex. The non-zero value is true; 0=false, 1=true, 0=no, 1=yes)
6. Sign the first message with the partner’s name, or MOH for visibility
7. Consider providing an option to revisit information again (ex. Text 123 to this number to receive these messages again)

### Workspaces

A workspace contains models for a set of RapidPro users, and it also identifies a company or project. Set up `staging` and `production` workspaces so that builds, tests and updates can proceed safely before and after deployment.

### SMS Messaging Channels

RapidPro supports both Android channels and SMS aggregators.

> [!NOTE]
> Android channels have a messaging limit of 330 outgoing messages per hour.

Ensure that you install the maximum number of SMS packs (available in the  RapidPro SMS Channel Android app) and follow these best practices when using Android channels:

   1. Prevent the Android channel from going to sleep.
      Some steps to achieve this are available on [dontkillmyapp](https://dontkillmyapp.com):
      - Do not optimize battery usage.
      - Make sure that the app is on the list of Apps that will not be put to sleep.
      - Set `Background Limit` to Standard Limit and confirm that the RapidPro app has the toggle enabled in "Background Check" and all of the apps have "App Standby state: ACTIVE" in Standby apps.
      - Keep the phone plugged into a power source.

   2. Automatically wake up the phone.
      - The RapidPro system uses Google Cloud Messaging which wakes up the phone whenever a message is sent. Install an APK that makes the channel relay messages as soon as RapidPro emits.

   3. Alerts for when things go wrong. 
      - Send monitoring emails and alert various parties when the Android Channel goes to sleep or becomes unavailable. This can be done from the channel's management page under `Alert Email`

Android channels can be [used with a bulk sender](http://web.archive.org/web/20220126134411/https://help.nyaruka.com/en/article/using-a-bulk-sender-sk27hz/) to get past the 330 outgoing messages per hour.

Medic recommends that you use shared or dedicated shortcodes for SMS messaging. Dedicated shortcodes are preferred because recipients do not have to include the keyword with each response submitted. Shortcode procurement can be a lengthy process, so make arrangements for the shortcode in advance. It is possible but inconvenient to migrate to a shortcode after deployment.

Medic recommends that SMS costs be zero-rated so that respondents do not incur charges. This motivates them to respond.

### Flow design

Tips and best practices are listed below:
- If possible, have less than 10 questions. Long surveys may either lead to low completion rates or rushed responses that affects the data quality.
- Close ended questions are better and easier to respond and handle in RapidPro since respondents only have to send a number or letter such as 1 for “Yes”, 2 for “No”. 
- Avoid sensitive questions since privacy cannot be guaranteed over SMS and where it is common to share phones.
- Include intro and outro messages. Intro messages serve the purpose of giving the survey details such as the background of the survey, the number of questions, data protection, whether there shall be follow up, SMS billing, etc. Outro messages are helpful to notify respondents that they survey is over and commonly include thank you notes.
- Include questions that give the respondent an opportunity to opt-in or out of the survey. If they opt out, do not send a follow-up text.
- Keep it short, to the size of one SMS (160 characters). Longer messages will be split and may not display well on the recipients’ devices since Mobile Network Operators (MNOs) cannot guarantee that the multi-parts shall be delivered in the desired order. Medic recommends that you retain the same message length as you localize to multiple languages. Truncate appropriately if long contact names included in the message push the length beyond the limit.

### Flow programming

- Use skip logic to ask relevant questions only. For example, number of children only if they have children.
- Automate error messages to validate responses. For example, `You submitted an invalid response. Reply 1 for “Yes”, 2 for “No”`. These can be customized.
- Reduce unnecessary messaging by using reminders and follow-up messages selectively on respondents by first differentiating those that completed a flow versus those that did not.
- Customize messages as much as possible by pre-populating information already known such as name, to target respondents, especially when phones are shared among clients.
- Translate all messages, especially when deploying in a multi-lingual environment. This ensures that respondents fully understand the survey in their language.
- Beware of the timing of the surveys that directly affects response rates. From experience, sending questions when respondents are busy with their errands during the day ultimately leads to low response rates as opposed to evenings when they are done for the day.
- Make sure you handle unsolicited responses by redirecting such to, for example, a flow that eventually alerts concerned individuals such as reports of an outbreak.
- Medic recommends that you use [timeouts](https://help.nyaruka.com/en/article/adding-timeouts-to-a-flow-1e2oodi/) or [pauses](https://web.archive.org/web/20210927110029/https://blog.textit.com/feature-update-add-timeouts-pauses-to-flows) to send automatic messages after a period of inactivity during a survey. This helps nudge the respondents to complete their flows.

### Configuration

- Persist a unique identifier for each respondent entering the flows. This identifier shall be used to link flow runs to the recipients to make data analysis smooth.
- Use consistent language and message design patterns to maintain a consistent experience and conversation. For example, if including a contact name at the beginning of a message, keep it that way for all messages including the localized messages.
- Be mindful of when you save data back to the CHT. This should happen at major milestones in a flow, for example, end of a flow or before sending a payload to an API endpoint.
- Use `globals`, shared values that can be referenced inflows, as well as broadcasts and campaigns, within your account referenced by `@globals.value_name`. This prevents re-entry of values in various components and allows flows to be shared easily in staging and production environments.
- Beware of concurrency that is not supported in RapidPro. Concurrency refers to a situation whereby one contact participates in more than one flow at the same time. Whenever this happens, the former flow shall be interrupted in favor of the latter. This can result in respondents exiting flows before completion, which is a confusing user experience and results in poor survey data. A main flow that spins up individual flows may be useful to consider. 

### Testing

Testing includes manual and scripted.

_Manual testing_
   - Telegram is an effective, free, convenient tool for testing that is great for developers and quick testing.
   - Prior to release, it is crucial that you test the workflow as close to production as possible. Medic recommends that you use the production messaging channels, to especially check messaging fidelity.
   - Medic recommends that you run a pilot prior to scaling a deployment. Remember, this shall expose the flows to real respondents and be helpful towards uncovering details such as text display among others.
   - In order to prevent breakages in flows, run full end-to-end tests as edits/changes can have unpredictable impacts. Check that the entire flow is not impacted by the change prior to releasing in production.

_Scripted testing_

These tests cover the parts that are inaccessible via manual tests. They include units that test individual components and end-to-end tests that test a flow from start to end. As a best practice, the following test pattern using the [cht-conf-test-harness](http://docs.communityhealthtoolkit.org/cht-conf-test-harness/) is recommended:
   - Create contact doc via cht-conf-test-harness
   - PUT docs into localhost API
   - Trigger RapidPro flow
   - Wait for a RapidPro flow to complete
   - Fetch state of contact in RapidPro
   - Wait for document to be created in API
   - Inject document into cht-conf-test-harness
   - Mock passage of time to test task behavior
   - One e2e test per production scenario

### Deployment

- Make sure all your flows are in source control. For every change, no matter how small (fixing a typo, etc), at the very least, document and commit the JSON for the flows to Github. This makes flows restorable, auditable, and releasable across environments
- Medic recommends that you use an automated deployment process when pushing changes to an instance - either staging or production. A CI/CD reduces manual errors and ensures your production state is tested and reproducible.
- Remember to set up the [rapidpro2pg](https://github.com/medic/rapidpro2pg) service to get your RapidPro workspace data over to the Postgres database.

### Monitoring

- Make sure you are monitoring workflows. Are they finishing as expected? Are some workflows not being used? A useful feature is the “send email” action whenever an unexpected event occurs while the flow is in progress, for example, failure calling an API endpoint.
   - Include relevant parties in the monitoring notifications. For starters, a mailing group that includes all parties will do it without re-entry of each address of relevant recipients. 
   - Include notifications to respondents too, appropriate to the messaging method. 
- Check that your workspace has enough credits and ensure RapidPro email credit alerts are configured so that credits top ups are done promptly.
