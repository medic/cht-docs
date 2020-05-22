---
title: "Defining Targets"
weight: 1
description: >
  Instructions and schema for defining targets
---

All targets are defined in the `targets.js` file as an array of objects according to the Targets schema defined below. Each object corresponds to a target widget that shows in the app. The order of objects in the array defines the display order of widgets on the Targets tab. The properties of the object are used to define when the target should appear, what it should look like, and the values it will display.

{{% alert title="Note" %}}

To build your targets into your app, you must compile them into app-settings, then upload them to your instance. 

`medic-conf --local compile-app-settings backup-app-settings upload-app-settings`

{{% /alert %}}

{{% show-reference targets %}}
