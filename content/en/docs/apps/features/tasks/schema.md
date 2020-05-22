---
title: "Defining Tasks"
weight: 1
description: >
  Instructions and schema for defining tasks
---

Tasks are configured in the `tasks.js` file. This file is a JavaScript module which defines an array of objects conforming to the Task schema detailed below. When defining tasks, all the data about contacts on the device (both people and places) along with all their reports are available. Tasks are available only for users of type "restricted to their place". Tasks can pull in fields from reports and pass data as inputs to the form that opens when the task is selected, enabling richer user experiences.

{{% alert title="Note" %}}

To build your tasks into your app, you must compile them into app-settings, then upload them to your instance.

`medic-conf --local compile-app-settings backup-app-settings upload-app-settings`

{{% /alert %}}

{{% show-reference tasks %}}

