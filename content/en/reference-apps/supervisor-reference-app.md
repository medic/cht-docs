---
title: "CHW Supervision and Performance Management"
linkTitle: "Supervision & Performance Management"
weight:
description: >
  Reference app for CHW supervisors to support performance management of CHWs
relatedContent: >
  building/concepts
  building/features/supervision
  building/forms/app
  building/tasks/tasks-js
aliases:
   - /apps/examples/supervisor-reference-app
   - /building/examples/supervisor-reference-app
   - /exploring/supervisor-reference-app
---

{{< hextra/hero-subtitle >}}
  Reference app for CHW supervisors to support performance management of CHWs
{{< /hextra/hero-subtitle >}}

[Medic](https://medic.org/) has worked with [D-tree International](https://www.d-tree.org/) to build a CHT supervisor reference app. The app supports community health worker (CHW) supervisors to continually monitor and improve the program quality for Zanzibar National community health program Jamii ni Afya. The supervisor reference application is designed to enable supervisors to access CHW performance information and any other information required to supervise, mentor, and support CHWs to provide quality community health services. This reference app provides an example that CHT app developers can easily customize to meet the needs for their specific program areas to support CHW program management.

The code for this application will be available soon.

## Problem being addressed
Community Health Workers (CHWs) play a critical role in delivering quality care as part of the integrated primary health system, in some settings CHWs often serve as the only connection between the health system and the vulnerable and remote populations. For many community health programs, CHWs face a lot of challenges, this includes significant workloads, delivering health services to large and dispersed communities while being supported by limited and inadequate supervision. To ensure sustained positive impacts on CHW programmes, there is a need for supervisory interventions to be embedded within the broader community health system strengthening. The  supervisor reference app empowers supervisors with the ability to monitor in real time the performance of CHWs which can guide supervisors to support CHWs in provision of community health care services.

## Solution overview
The supervisor reference app workflows enables supervisors to: provide quality assurance supervisory activities, plan and document CHW supervisory activities, support CHW activities and monitor CHW performance in real time. The supervisor reference app has been designed to:
 * Monitor the performance of the CHW and supervisors using the in-app aggregate target and the supervisor targets functionalities respectively.
 * Document and track CHW and supervisory activities.
 * Schedule CHW monthly meetings quality monitoring visits and follow up visits.
 * Support supervisors to report on health outcomes for their supervisory area.
 * Identify CHWs who have not been visited by a supervisor.
 * Follow up on CHW who have been inactive for 3 months.

## Forms hierarchy
The diagram indicates forms and tasks that can be filled by a supervisor on the supervisor reference app. Some of the forms are accessible as actions on the supervisor and CHW profiles while others are accessible as tasks for a supervisor and a CHW.

{{< figure src="hierarchy.png"  link="hierarchy.png" >}}

## Workflows

### CHW monthly meetings
A Supervisor conducts a CHW monthly meeting with all the CHWs. During the meeting the supervisor mentors the CHWs, reviews the CHWs performance and discusses with the CHWs the challenges they might be facing in their provision of community health services.

| CHW monthly meeting workflow |
|--|--|
|{{< figure src="img1.png"  class="right" >}}|{{< figure src="img2.png">}}|
|**1a Supervisor schedules for a CHW monthly meeting** A supervisor schedules for a CHW monthly meeting by submitting a CHW monthly meeting| **2a CHW monthly meeting task** The task appears 3 days before the due date and the supervisor completes the task during the monthly meeting|
|**1b The Supervisor can also receive a recurring CHW monthly meeting task every month**| **2b CHW monthly meeting form** The CHW monthly meeting form can also be accessed through the action on the profile of the supervisor|
| | **2c Schedule Monthly Meeting** The Supervisor can schedule the next CHW meeting form using the CHW monthly meeting form or task|

### Quality monitoring
With the supervisor reference app, a supervisor can schedule a quality monitoring visit to assess the quality of services being provided by a CHW. During the quality monitoring visit a supervisor shadows CHWs as they provide services to household members. A supervisor can schedule additional quality monitoring follow up visits for CHWs who are identified to have some weak areas and may need further support and mentorship from the supervisor.

| Supervision quality monitoring workflow |
|--|--|--|
|{{< figure src="img1.png" >}} | {{< figure src="img1.png"  class="right" >}} | {{< figure src="img2.png" >}}|
|**1a Supervisor checks/monitors their in-app CHW aggregate targets** The supervisor checks the in app targets to monitor CHW target progress.| **2a Quality Monitoring Planning form** The supervisor schedules shadowing/quality monitoring visits with the CHWs that need support through the quality monitoring planning form| **3a Quality monitoring task** The task appears 2 days before the due date. During the visit the supervisor completes the quality monitoring task|
|**1b Supervisor UHC mode** Using the UHC mode, the supervisor is able to identify CHWs that have not been visited by a supervisor for a while| | **3b Shadowing reminder task** - the task will appear on the CHW app two days before the visit to remind the CHW of the planned shadowing visit|
| | | **3c Quality monitoring form** The quality monitoring form can also be accessed as an action on the profile of the CHW|
| | | **3d Quality Monitoring Follow up task** Just in case a supervisor identifies some weak areas that a CHW need to improve on and be supported, they schedule for a quality monitoring follow up visit|

### Group sessions

| CHW Group session workflow |
|--|--|
|{{< figure src="img1_1.png" class="right" >}} | {{< figure src="img3.png" >}}|
|**1a A CHW organizes for a group session with community members** Group session is a meeting coordinated and organized by CHW with community members to health educate community members of various health topics | **2a Group session form** Supervisor attends the group session meetings, provides supervision, supports the activity and submits the group session form|

### CHW Inactivity
A CHW activity task is generated for a supervisor if a CHW has been inactive for 3 months. This workflow enables a supervisor to follow up CHWs who have been inactive for three months and may need to be replaced.

## Additional Features

### Targets
A Supervisor has access to the analytics tab. The widgets on the in-app analytics tab enables a supervisor to view individual supervisor performance metrics and the supervisor progress towards the expected monthly goals. The supervisor also has access to CHW aggregate targets which will help the supervisor track metrics for individual CHWs, especially for supervisors overseeing a group of CHWs.This feature allows a supervisor to identify CHWs who may need to be supported actively.

##### CHW aggregate targets

{{< figure src="CHW performance.png" link="CHW performance.png" alt="CHW aggregate targets" title="" class="left col-10">}}

### Supervisor UHC mode
A supervisor is able to use this feature to view the last time each CHW was visited so that a supervisor can prioritize visiting CHWs who have not been visited for a while. The visit detail information is updated every time a quality monitoring form is submitted.

{{< figure src="Supervisor_UHC_mode.png" link="Supervisor_UHC_mode.png" alt="Supervisor UHC mode" title="" class="left col-9">}}
