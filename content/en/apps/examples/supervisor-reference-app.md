---
title: "Supervisor Reference Application"
linkTitle: "Supervisor Reference Application"
weight:
description: >
  Supervisor Reference Application
relatedContent: >
  apps/concepts
  apps/reference/forms/app
  apps/reference/tasks
---

{{% pageinfo %}}

A reference app for CHW supervisors to support performance management of CHWs using a mobile app.

Medic has worked with D-tree to build a CHT supervisor reference app, the app is built to support community health workers (CHWs) supervisors to continually monitor and improve the program quality for Zanzibar National community health program Jamii ni Afya. The supervisor reference application is designed to enable supervisors access CHW performance information and any other information required to supervise CHWs, mentor CHWs and support CHWs to provide quality community health services. This reference app provides an example that CHT App Developers can easily customize to meet the needs for their specific program areas to support CHW program management.

You can find the code of this application in the CHT code repository on Github {link}

{{% /pageinfo %}}

## Problem being addressed
Community Health Workers (CHWs) play a critical role in delivering quality care as part of the integrated primary health system, in some settings CHWs often serve as the only connection between the health system and the vulnerable and remote populations. For many community health programs, CHWs face a lot of challenges, this includes significant workloads, delivering health services to large and dispersed communities while being supported by limited and inadequate supervision. To ensure sustained positive impacts on CHW programmes, there is a need for supervisory interventions to be embedded within the broader community health system strengthening. The  supervisor reference app empowers supervisors with the ability to monitor in real time the performance of CHWs which can guide supervisors to support CHWs in provision of community health care services.

## Solution overview
The supervisor reference app workflows enables supervisors to: provide quality assurance supervisory activities, plan and document CHW supervisory activities, support CHW activities and monitor CHW performance in real time. The supervisor reference app has been designed to:
<ul>
<li>Monitor the performance of the CHW and supervisors using the in-app aggregate target and the supervisor targets functionalities respectively.</li>

<li>Document and track CHW and supervisory activities.</li>
<li>Schedule CHW monthly meetings quality monitoring visits and follow up visits.</li>
<li>Support supervisors to report on health outcomes for their supervisory area.</li>
<li>Identify CHWs who have not been visited by a supervisor.</li>
<li>Follow up on CHW who have been inactive for 3 months.</li>
</ul>

## Forms hierarchy
The diagram indicates forms and tasks that can be filled by a supervisor on the supervisor reference app. Some of the forms are accessible as actions on the supervisor and CHW profiles while others are accessible as tasks for a supervisor and a CHW.

{{< figure src="Forms_hierarchy.png"  link="Forms_hierarchy.png" alt="Forms hierarchy" title="" class="left col-12">}}

## Supervisor app workflows and features.

### CHW monthly meeting workflows.
A Supervisor conducts a CHW monthly meeting with all the CHWs. During the meeting the supervisor mentors the CHWs, reviews the CHWs performance and discusses with the CHWs the challenges they might be facing in their provision of community health services.

{{< figure src="Monthly_meeting_workflows.png"  link="Monthly_meeting_workflows.png" alt="Monthly meeting workflows" title="" class="left col-10">}}

### Quality monitoring workflow
With the supervisor reference app, a supervisor can schedule a quality monitoring visit to assess the quality of services being provided by a CHW. During the quality monitoring visit a supervisor shadows CHWs as they provide services to household members. A supervisor can schedule additional quality monitoring follow up visits for CHWs who are identified to have some weak areas and may need further support and mentorship from the supervisor.

{{< figure src="Qualtiy_monitoring_workflows.png"  link="Qualtiy_monitoring_workflows.png" alt="Qualtiy monitoring workflows" title="" class="left col-10">}}

### Group session workflow

{{< figure src="Group_session_workflows.png"  link="Group_session_workflows.png" alt="Group session workflows" title="" class="left col-10">}}

### Supervisor in-app targets
A Supervisor has access to the analytics tab. The widgets on the in-app analytics tab enables a supervisor to view individual supervisor performance metrics and the supervisor progress towards the expected monthly goals. The supervisor also has access to CHW aggregate targets which will help the supervisor track metrics for individual CHWs, especially for supervisors overseeing a group of CHWs.

##### CHW aggregate targets
{{< figure src="CHW_aggregate_targets.png"  link="CHW_aggregate_targets.png" alt="CHW aggregate targets" title="" class="left col-10">}}


### Supervisor UHC mode
A supervisor is able to use this feature to view the last time each CHW was visited so that a supervisor can prioritize visiting CHWs who have not been visited for a while. The visit detail information is updated every time a quality monitoring form is submitted.

{{< figure src="Supervisor_UHC_mode.png"  link="Supervisor_UHC_mode.png" alt="Supervisor UHC mode" title="" class="left col-9">}}
