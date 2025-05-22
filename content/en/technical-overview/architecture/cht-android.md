---
title: "CHT Android"
linkTitle: "CHT Android"
weight: 8
description: >
  Native Android wrapper for CHT Web Application
aliases:
   - /core/overview/cht-android/
---

The [cht-android](https://github.com/medic/cht-android) application is a thin Android wrapper to load the [CHT Core Framework web application]{{< relref "technical-overview/architecture/cht-core" >}} in a Webview native container.

It consists of “flavored” configurations, where each “flavor” or “brand” is an app, which allows the application to be hardcoded to a specific CHT deployment and have a partner-specific logo and display name. The app also provides some deeper integration with other android apps and native phone functions that are otherwise unavailable to webapps.

