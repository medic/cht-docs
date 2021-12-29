---
title: "RapidPro"
linkTitle: "RapidPro"
weight: 
description: >
  Key concepts, design considerations, how to configure, and best practices
keywords: rapidpro 
relatedContent: >
  apps/features/integrations/rapidpro
  apps/guides/integrations/best-practices/rapidpro
---

Before you embark on designing an integrated RapidPro/CHT workflow, you should start by understanding the needs of your users, identifying a problem to solve, and establishing goals. While an integrated RapidPro/CHT workflow can open up many powerful and personalized messaging capabilities, introducing an additional technology solution does come with complexities and cost. A good way to mitigate some of the complexities of setting up and [hosting](https://rapidpro.github.io/rapidpro/docs/hosting/) RapidPro yourself is to utilize a SaaS solution such as [TextIt](https://textit.in/). TextIt offers transparent per message [pricing](https://textit.in/pricing/) and free credits to start off.

Coming up with a design to accommodate user needs requires a detailed understanding of the capabilities of both systems and conceptually where it makes sense to introduce interactions between them. Below we introduce some of the key concepts in RapidPro, but to learn more you can take one of their [online courses](https://community.rapidpro.io/online-courses/), watch some of their [videos](https://community.rapidpro.io/videos/), and check out their [deployment toolkit](https://community.rapidpro.io/deployment-toolkit/).   

## RapidPro Concepts

Before designing your integrated RapidPro/CHT workflow, it's important to understand a couple key functional concepts in RapidPro: *Flows*, *Campaigns*, and *Triggers*.


### Flows
{{< figure src="flow-concept.png" link="flow-concept.png" class="right col-7 col-lg-5" >}}

[Flows](https://help.nyaruka.com/en/articles/3120713-introduction-to-flows) are a series of steps you link together visually to define the interactions users will have. At any point in the flow, you can trigger actions such as sending an SMS, email, or calling external APIs. Flows are the base for RapidPro's other features.

*Use Case Example:* Send an SMS to a patient asking if they are experiencing any new symptoms today. If so, let the patient know that a CHW will contact them. If not, let the patient know that they will receive another check-in message in three days and to contact their CHW if any new symptoms develop before then.


*Additional Resources:* [Mastering Flows](https://app.rapidpro.io/video/) and [How to Build a RapidPro Flow](https://youtu.be/WcFhpSFhFug).

### Campaigns

{{< figure src="campaign-concept.png" link="campaign-concept.png" class="right col-5" >}}

[Campaigns](https://help.nyaruka.com/en/articles/2217334-introduction-to-campaigns) allow you to schedule messages and flows around a date unique to each contact in a group, like a delivery date or registration date. You can add any number of [Events](https://help.nyaruka.com/en/articles/1911110-adding-a-campaign-event) to the Campaign. 

*Use Case Example:* Send a daily check-in message to quarantined patients for 14 days to see if they have developed any symptoms.

*Additional Resources:* [Creating a Campaign](https://youtu.be/3tJPOoHxJXE)

### Triggers

{{< figure src="trigger-concept.png" link="trigger-concept.png" class="right col-5" >}}

[Triggers](https://help.nyaruka.com/en/articles/1911111-introduction-to-triggers) allow you to control how or when a Flow begins. A Trigger can be a keyword received in a text, a point in time, a missed call, or even a follow to a Twitter handle.

*Use Case Example:* Start a health assessment Flow whenever a person sends the text `assessment` to a specific short code.

*Additional Resources:* [Creating a Keyword Trigger that starts a Flow](https://help.nyaruka.com/en/articles/1911101-creating-a-keyword-trigger-that-starts-a-flow)

## Workflow Design

Designing an integrated workflow between mutliple systems is more of an art than a science. Drafting a sequence diagram (below) is a good first step. When drafting your sequence diagram, it is useful to consider a few key integration touchpoints that are common across many integrated workflows.

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

For RapidPro to communicate with the CHT, you need to create a [User]({{< ref "apps/concepts/users" >}}) in the CHT that will be used by RapidPro when calling the CHT’s APIs.  This can be done from the [App Management]({{< ref "apps/features/admin/" >}}) page in the CHT.  When adding the user in the CHT, be sure to select the `Gateway - Limited access user for Medic Gateway` [Role]({{< ref "apps/concepts/users#roles" >}}).

### Globals

[Globals](https://help.nyaruka.com/en/articles/3561580-global-variables) are shared values that can be referenced in flows, as well as broadcasts and campaigns, within your account referenced by `@globals.value_name`. They allow you to create a value once and use it repeatedly without having to reenter the value. Likewise, globals make updating a shared value much easier. Rather than manually changing a value everywhere it's used in your account, simply update the value found in your `Globals` page.

![Globals](globals.png)

Once you have configured a Global value, you can easily use it in your flows like this:

![Globals-Usage](globals-usage.png)


### Start RapidPro Flow from CHT

One of the most common activities you'll want to do is trigger a Flow in RapidPro based on something that occurred in the CHT. For example... whenever a specific form is submitted in the CHT with some conditional value, start a flow in RapidPro. To do this, you will use the [Outbound]({{< ref "apps/reference/app-settings/outbound" >}}) feature in the CHT, invoking the [Flow Starts Endpoint](https://rapidpro.io/api/v2/explorer/) in RapidPro. 

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

Once a user has completed a Flow in RapidPro, it is likely you will want to record some of the information collected in the RapidPro flow back in the CHT. This can be achieved by utilizing the [Call Webhook](https://help.nyaruka.com/en/articles/1911235-calling-a-webhook-new-editor) action in RapidPro.

|Step |Application  |Config step |
|-----|--|--|
|1|CHT| Configure a [JSON Form]({{< ref "apps/reference/app-settings/forms" >}}) that includes the fields from RapidPro you want to send to the CHT.|
|2|RapidPro|Add a *Call a Webhook* node.|
|3|RapidPro|`POST` to the [records endpoint]({{< ref "apps/reference/api#post-apiv2records" >}}) in the CHT.  If you used the Global value mentioned above, the POST will look something like `@globals.api/v2/records`.|
|4|RapidPro|Set a `Result Name`| 
|5|RapidPro|Configure HTTP Headers to be `Content-Type` -> `application/json`|
|6|RapidPro|Configure the `POST Body` (see example below)|

{{< figure src="post-to-cht.png" link="post-to-cht.png" >}}


### Look up CHT data from RapidPro

Another common action you will likely need to perform in RapidPro is getting information from the CHT about a user or patient based on their phone number. You can use the [contacts-by-phone]({{< ref "apps/reference/api#contacts-by-phone" >}}) API to get fully hydrated contacts associated to that phone number.



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