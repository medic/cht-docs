---
title: RapidPro best practices and lessons from integration with the CHT
linkTitle: "RapidPro"
weight: 20
description: >
    Best practices for RapidPro deployments
keywords: rapidpro, best practices, tips, lessons, integration
relatedContent: >
    apps/features/integrations/rapidpro
    apps/guides/integrations/rapidpro
---


### Introduction
[RapidPro](https://app.rapidpro.io/) is the open-source platform that powers [TextIt](https://textit.com/), developed by UNICEF and Nyaruka. RapidPro allows you to visually build messaging workflows for mobile-based services. This guide details the best practices when working on a RapidPro deployment. Review RapidPro’s documentation to familiarize yourself with various components that include the [API](https://rapidpro.io/api/v2/). The following section will focus on various components or stages in the deployment process.

### Workspaces
A workspace contains models for a set of RapidPro users, and it also identifies a company or project. Set up `staging` and `production` workspaces so that builds, tests and updates can proceed safely before and after deployment.

### SMS Messaging Channels
RapidPro supports both Android channels and SMS aggregators.

{{% alert title="Note" %}} Android channels have a messaging limit of 330 outgoing messages per hour. {{% /alert %}}

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

Android channels can be [used with a bulk sender](https://help.nyaruka.com/en/article/using-a-bulk-sender-sk27hz/) to get past the 330 outgoing messages per hour.

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
- Medic recommends that you use [timeouts](https://help.nyaruka.com/en/article/adding-timeouts-to-a-flow-1e2oodi/) or [pauses](https://blog.textit.in/feature-update-add-timeouts-pauses-to-flows) to send automatic messages after a period of inactivity during a survey. This helps nudge the respondents to complete their flows.

### Configuration
- Persist a unique identifier for each respondent entering the flows. This identifier shall be used to link flow runs to the recipients to make data analysis smooth.
- Use consistent language and message design patterns to maintain a consistent experience and conversation. For example, if including a contact name at the beginning of a message, keep it that way for all messages including the localized messages.
- Be mindful of when you save data back to the CHT. This should happen at major milestones in a flow, for example, end of a flow or before sending a payload to an API endpoint.
- Use `globals`, shared values that can be referenced inflows, as well as broadcasts and campaigns, within your account referenced by `@globals.value_name`. This prevents re-entry of values in various components and allows flows to be shared easily in staging and production environments.
- Beware of concurrency that is not supported in RapidPro. Concurrency refers to a situation whereby one contact participates in more than one flow at the same time. Whenever this happens, the former flow shall be interrupted in favor of the latter. This can result in respondents exiting flows before completion, which is a confusing user experience and results in poor survey data. A master flow that spins up individual flows may be useful to consider. 

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
