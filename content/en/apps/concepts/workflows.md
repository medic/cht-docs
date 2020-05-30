---
title: Building Workflows
linkTitle: "Workflows"
weight: 3
description: >
  Building connections between people, actions, and data systems
keywords: workflows
---

Workflows can be defined with CHT apps to connect actions and data with people. Forms are the main building block of tasks and messaging workflows, and are useful in creating reminders for follow-up visits or referrals.

## Tasks

Tasks in the app can drive a workflow, ensuring that the right actions are taken for people at the right time. Tasks indicate a recommended action to the user. They indicate who the user should perform the action with, and the recommended timeframe of that action. When the user taps the task, they are directed to a form where the details of the action are captured.

Tasks can be triggered by a set of conditions, such as contact details or submitted reports. Tasks are accessible in the Tasks tab and the profile in the Contact tab, and initiate a follow up action to complete a form. More information on building app workflows is available in the [Tasks section]().

Data submitted in one form can generate several tasks at once, e.g., multiple ANC visits following one pregnancy registration. Some workflows involve a series of sequential forms and tasks, e.g., a child health assessment form, a follow up task scheduled 48 hours later, a referral form (only if the child’s condition hasn’t improved), and then a referral follow up task. Tasks are accessible on the Tasks tab, as well as the Tasks section of profiles. 

{{% see-also page="apps/reference/tasks" title="Defining Tasks" %}}

## SMS Messaging

Workflows can include notifications and interactions with CHWs, nurses, supervisors, and patients via SMS. A report can trigger SMS messages to be sent immediately or upon a set schedule. Responses via SMS or the app can update the workflows.

{{% see-also page="apps/reference/workflows-sms" title="Defining SMS Workflows" %}}

## Interoperability 

Workflows can incorporate other digital tools, such as a facility-based electronic medical record system for referral workflows. New contacts or reports can trigger an interoperabilty workflow using the [outbound push]() feature. Data can be received as reports using the [CHT API](https://github.com/medic/cht-core/tree/master/api)

{{% see-also page="apps/reference/outbound" title="Outbound Push" %}}
