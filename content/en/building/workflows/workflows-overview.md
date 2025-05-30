---
title: Overview
weight: 5
description: >
  Build connections between people, actions, and data systems
aliases:
   - /building/concepts/workflows
   - /apps/concepts/workflows
---

Workflows can be defined within apps built with the Core Framework to connect actions and data with people. Forms are the main building block of tasks and messaging workflows, and are useful in creating reminders for follow-up visits or referrals.

## Tasks

Tasks within the app can drive a workflow, ensuring that the right actions are taken for people at the right time. Tasks indicate a recommended action to the user. They indicate who the user should perform the action with, and the recommended timeframe of that action. When the user taps the task, they are directed to a form where the details of the action are captured.

Tasks can be triggered by a set of conditions, such as contact details or submitted reports. Tasks are accessible in the Tasks tab and the profile in the Contact tab, and initiate a follow up action to complete a form. More information on building app workflows is available in the [Tasks section]({{< ref "building/tasks" >}}).

Data submitted in one form can generate several tasks at once, for example, multiple ANC visits following one pregnancy registration. Some workflows involve a series of sequential forms and tasks, such as a child health assessment form, a follow up task scheduled 48 hours later, a referral form (only if the child’s condition hasn’t improved), and then a referral follow up task. Tasks are accessible on the Tasks tab, as well as the Tasks section of profiles. 

{{< see-also page="building/tasks/tasks-js" title="Defining Tasks" >}}

{{< cards rows="4" >}}
{{< card link="tasks-mobile.png" image="tasks-mobile.png"  method="resize">}}
{{< card link="tasks-desktop.png" image="tasks-desktop.png"  method="resize">}}
{{< /cards >}}

## SMS Messaging

Workflows can include notifications and interactions with CHWs, nurses, supervisors, and patients via SMS. A report can trigger SMS messages to be sent immediately or upon a set schedule. Responses via SMS or the app can update the workflows.
{{< see-also page="building/reference/app-settings" anchor="sms-workflows" title="Defining SMS Workflows" >}}

{{< cards rows="4" >}}
{{< card link="messages-mobile.png" image="messages-mobile.png"  method="resize">}}
{{< card link="messages-desktop.png" image="messages-desktop.png"  method="resize">}}
{{< /cards >}}

## Interoperability 

Workflows can incorporate other digital tools, such as a facility-based electronic medical record system for referral workflows. New contacts or reports can trigger an interoperabilty workflow using the [outbound push]() feature. Data can be received as reports using the [CHT API](https://github.com/medic/cht-core/tree/master/api)
{{< see-also page="building/reference/app-settings/outbound" title="Outbound Push" >}}.
