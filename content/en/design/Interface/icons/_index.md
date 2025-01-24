---
title: "Icon Library"
linkTitle: "Icon Library"
weight: 2
aliases: 
  - /design/icons/
description: >
  Icons for use in CHT application based on our human centered design principles
---

We believe in making our simple but strong visual iconography open and accessible to all. We have assembled and designed these icons for use with the Community Health Toolkit based on our human centered design principles.

## About the Icon Library
<img alt="Example Icons" style="border-width:0" src="https://static1.squarespace.com/static/5bd25eea65a707ad54c1e8ca/t/5bf4a3442b6a2841cd402a05/1542759243884/CHT-feature-overview-01.png?format=1000w" />

This collection of over 60 beautiful icons was made for use in CHT applications. We will continually update this library as new icons are developed for different workflows.

Use the `forms_tasks_targets` folder to find PNG and SVG icons for application code. All instances on 2.15.0 and later should be using SVG icons because they are smaller files. If your project has families or households as the lowest level of the hierarchy, use the `people_and_places` folder to swap out icons as needed so your hierarchy has the correct icons.

NOTE: For those using cht-conf to upload resources, make sure you add the correct icons for people and places to your `resources.json` file. Otherwise, uploading resources will inadvertently remove your people and place icons. An issue is being raised in cht-conf to solve this. You'll need to define `medic-clinic`, `medic-health-center`, `medic-district-hospital` and `medic-person` in your `resources.json` and set them to the appropriate SVG files.

The design team has put together a resource to help with best practices when selecting and using icons in configuration. Check out the [best practices]({{< ref "design/best-practices#icons"  >}}) to learn more about which icons can be used for which use cases and workflows.

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
