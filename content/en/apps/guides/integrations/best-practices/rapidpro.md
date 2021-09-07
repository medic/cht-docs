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
[RapidPro](https://app.rapidpro.io/) is the Open Source version of Textit, developed by UNICEF and Nyaruka, to  visually build workflow logic targeting mobile-based services. Here, we detail the best practices when working on a RapidPro deployment. Top of the list is to review RapidPro’s documentation to familiarize with various components including the [API](https://rapidpro.io/api/v2/). Next, we focus on various components or stages in the deployment process.

### [Workspaces](https://rapidpro.github.io/rapidpro/docs/orgs/)
Think of workspaces as the equivalent of an instance in the CHT. Medic has an internally hosted RapidPro. Ensure that you request for both `staging` and `production` workspaces early enough to allow SRE set up the workspaces on time.

### SMS Messaging Channels
- RapidPro supports both Android channels and SMS aggregators. Note that Android channels have a messaging limit of 330 outgoing messages/hour. If using Android channels, ensure that you install the maximum number of SMS packs and follow the following best practices for best results:
   1. Avoid the Android Channel going to sleep 
    The following apply (based on Samsung A7 2018) with more details available on [dontkillmyapp](https://dontkillmyapp.com/samsung):
      - Android Settings > Apps > RapidPro > Battery > Optimize battery usage > Don't Optimize.
      - Android Settings > Device care > Battery > App power management > Apps that won’t be put to sleep. Make sure that the app is in this list. Turn off "Put unused apps to sleep."
      - Android Settings > System > Developer Options. Background Limit is set to Standard Limit. Make sure the RapidPro app has the toggle enabled in "Background Check" and ALL of my apps have "App Standby state: ACTIVE" in Standby apps.
      - Keep the phone plugged into a power source.

   2. Automatically Wake up the Phone 
      - The production RapidPro system uses Google Cloud Messaging which wakes up the phone whenever a message is sent. Install an APK that makes the channel to relay messages as soon as RapidPro emits.
   3. Alerts for when things go wrong 
      - Send monitoring emails and alert various parties when the Android Channel goes to sleep or becomes unavailable. This can be done from the channel's management page under `Alert Email`

- The Android channels can however, be used with a [bulk sender](https://help.nyaruka.com/en/articles/5153032-using-a-bulk-sender) to get past the 330 outgoing messages per hour.
- We recommend that you use shortcodes for SMS messaging, which can either be shared or dedicated. Dedicated are preferred because recipients do not have to include the keyword with each response submitted. Make sure to make arrangements for the shortcode in advance to avoid lags due to the duration it might take to fully set up one.
- Regarding SMS costs from experience, zero-rated messages are recommended so that respondents do not incur charges.

### Flow design
Tips and best practices are listed below
 - Length of the survey.
   - If possible, keep the questions to between 5 and 10. Long surveys may either lead to low completion rates or rushed responses that affects the data quality.
- Types of questions
   - Close ended questions are better and easier to respond and handle in RapidPro since respondents only have to send a number or letter such as 1 for “Yes”, 2 for “No”. Avoid sensitive questions since privacy cannot be guaranteed where shared phones are common.
- Intro and outro messages
   - These serve the purpose of giving the survey details such as background of the survey, number of questions, data protection, whether there shall be follow up, SMS billing, thank you notes etc. Include these if possible.
- Consent and opt out
   - Include questions that give the respondent an opportunity to opt in or out of the survey. If they opt out, do not send a follow up text.
- SMS length
   - Keep it short, to the size of one SMS (160 characters). Longer messages may not display well on the recipients’ devices.

### Flow programming
- Utilize skip logic to ask relevant questions only e.g. number of children if only they have children.
- Automate error messages to to validate responses e.g. You submitted an invalid response. Reply 1 for “Yes”, 2 for “No”. These can be customized.
- Use reminders and follow-up messages selectively on respondents by first differentiating those that completed a flow versus those that did not. This reduces spamming.
- Customize messages as much as possible by pre-populating information already known such as name, to target respondents, especially when phones are shared among clients.
- Translate all messages, especially when deploying in a multi-lingual environment. This ensures that respondents fully understand the survey in their language.
- Beware of the timing of the surveys that directly affects response rates. From experience, sending questions when respondents are busy with their errands during the day ultimately leads to low response rates as opposed to evenings when they are done for the day.
- Make sure you handle unsolicited responses by redirecting such to for example, a flow that eventually alerts concerned individuals e.g. reports of an outbreak etc.

### Configuration
1. Persist a unique identifier for each respondent entering the flows. This identifier shall be used to link flow runs to the recipients to make data analysis smooth.
2. Use consistent language and design patterns.
3. Be mindful of when you save data back to the CHT. From experience, this should happen at major milestones in a flow e.g. end of a flow or before sending a payload to an API endpoint.
4. Utilize `globals`, shared values that can be referenced in flows, as well as broadcasts and campaigns, within your account referenced by `@globals.value_name`. This avoids re-entry of values in various components.
5. Beware of concurrency that is not supported in RapidPro. Concurrency refers to a situation whereby one contact participates in more than one flows at the same time. Whenever this happens, the former flow shall be interrupted in favor of the latter. This can result in respondents exiting flows before completion, which impacts data quality. A master flow that controls individual flows is recommended. 
6. Persist a respondent’s state in CHT. A state document is a JSON document that has calculated values of a respondent’s attributes or ledger of reports that is used by RapidPro to check the flows or questions one is eligible to receive. This document should not be editable by users directly. A sample is as follows:
```json
{
  "patient_uuid": "0123...",
  "language": "en",
  "tb": "true",
  "covid": "mild",
  ...
}
```

### Testing
Testing includes manual and scripted.
- Manual
   - Test the workflows as close to production as possible. Telegram is a convenient way of validating the flows, but might not give a true picture of SMS in case of SMS messaging. Such testing will check SMS fidelity too.
   - Piloting prior to a rollout is recommended. Remember, this shall expose the flows to real respondents and be helpful towards uncovering details such as text display among others.
   - In order to prevent breakages in flows test end-to-end and fully, especially when edits and changes are introduced to check that the entire flow is not impacted by the change. 

- Scripted
These tests cover the parts that are inaccessible via manual tests. They include unit that test individual components and end-to-end tests that test a flow from start to end. From experience, and as a best practice, the following test pattern is recommended.
   - Create contact doc via cht-conf-test-harness
   - PUT docs into localhost API
   - Trigger RapidPro flow
   - Wait for a RapidPro flow to complete
   - Fetch state of contact in RapidPro
   - Wait for document to be created in API
   - Inject document into cht-conf-test-harness
   - Mock passage of time to test task behaviour
   - One e2e test per production scenario
   - Replace test/contacts.js mock content

### Deployment
- Make sure all your flows are in source control. For every change, no matter how small (fixing a typo, etc), at the very least, document and commit the JSON for the flows to Github.
- Always ensure that you use the automated deployment when pushing changes to an instance, be it staging or production. This is in line with CI/CD and helps to detect problems early.
- Remember to set up the [rapidpro2pg](https://github.com/medic/rapidpro2pg) service to get your RapidPro workspace data over to the Postgres database.


### Monitoring
- Make sure you are monitoring workflows. Are they finishing as expected? Are some workflows not being used? 
   - A useful feature is the “send email” action whenever an unexpected event occurs while the flow is in progress e.g. failure calling an API endpoint
      - Include relevant parties in the monitoring notifications. For starters, a mailing group that includes all parties will do it without re-entry of each address of relevant recipients. 
      - Include notifications to respondents too, according to the messaging method. 
- Check that your workspace has enough credits and top up on time when necessary.
