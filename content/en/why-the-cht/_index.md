---
title: "Why the Community Health Toolkit?"
linkTitle: "Why the CHT?"
weight : 1
---

{{< callout >}}
  The [Community Health Toolkit](https://communityhealthtoolkit.org) is a collection of open-source technologies and open-access resources developed by a community focused on global health equity. We envision a world where primary health care is equitable, accessible, and delivered by people who are trusted in their communities. Start with the [CHT overview]({{< ref why-the-cht >}}), and join the [community forum](https://forum.communityhealthtoolkit.org/)!
  [![DPG Badge](https://img.shields.io/badge/Verified-DPG-3333AB?logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iMzEiIGhlaWdodD0iMzMiIHZpZXdCb3g9IjAgMCAzMSAzMyIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE0LjIwMDggMjEuMzY3OEwxMC4xNzM2IDE4LjAxMjRMMTEuNTIxOSAxNi40MDAzTDEzLjk5MjggMTguNDU5TDE5LjYyNjkgMTIuMjExMUwyMS4xOTA5IDEzLjYxNkwxNC4yMDA4IDIxLjM2NzhaTTI0LjYyNDEgOS4zNTEyN0wyNC44MDcxIDMuMDcyOTdMMTguODgxIDUuMTg2NjJMMTUuMzMxNCAtMi4zMzA4MmUtMDVMMTEuNzgyMSA1LjE4NjYyTDUuODU2MDEgMy4wNzI5N0w2LjAzOTA2IDkuMzUxMjdMMCAxMS4xMTc3TDMuODQ1MjEgMTYuMDg5NUwwIDIxLjA2MTJMNi4wMzkwNiAyMi44Mjc3TDUuODU2MDEgMjkuMTA2TDExLjc4MjEgMjYuOTkyM0wxNS4zMzE0IDMyLjE3OUwxOC44ODEgMjYuOTkyM0wyNC44MDcxIDI5LjEwNkwyNC42MjQxIDIyLjgyNzdMMzAuNjYzMSAyMS4wNjEyTDI2LjgxNzYgMTYuMDg5NUwzMC42NjMxIDExLjExNzdMMjQuNjI0MSA5LjM1MTI3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==)](https://www.digitalpublicgoods.net/r/community-health-toolkit)
{{< /callout >}}  

Community health systems can dramatically improve the accessibility, quality, speed, and equity of primary health care, but only if health workers are effectively equipped and supported. Advances in open source technology are making it easier and more affordable than ever to deliver impactful, dignified care in even the hardest-to-reach communities.

With thousands of health workers using these tools to support a million home visits every month, the CHT is the most full-featured, mature, and widely-used open source software toolkit designed specifically for community health systems. Hundreds of individuals contribute to the CHT as designers, developers, researchers, health policy experts, health system implementers, and frontline health workers.

<br />

{{< youtube Q93_tSyTp_k >}}

## The CHT Community

The CHT is 100% open source--it always has been and always will be freely available as a [digital public good](https://www.digitalpublicgoods.net/r/community-health-toolkit). This is possible thanks to a diverse and active community of practice that includes contributors from global health NGOs, technical organizations, governments, and research institutions, with the non-profit organization [Medic](https://medic.org) serving as a technical steward.

The CHT community's longterm focus on community-driven health systems, integrated care, and universal health coverage has surfaced innumerable insights that make the CHT unique. We're also deeply committed to [human-centered and participatory design](https://doi.org/10.1080/02681102.2019.1667289), as an approach to building technology with and for hard-to-reach communities. These principles have helped us to foster a remarkably dynamic and innovative community; learning and building with this community is one of the key reasons people decide to work with the CHT.

{{< gallery src="partners" noBorder="true" >}}

If you’re contributing to the CHT and would like to see your organization’s logo featured here, send an email to hello@medic.org.

{{< see-also page="community" title="Get involved" >}}

## Speeding up app development

The Core Framework makes it faster to build full-featured, scalable digital health apps by providing a foundation developers can build on. These apps can support most languages, are offline-first, and work on basic phones (via SMS), smartphones, tablets, and the web. Rich interactive applications that would take 6-18 months to build from scratch can be built using CHT Core in as little as 1-2 months. Some of the COVID-19 response CHT-based applications shipped in under 2 weeks.

App developers are able to define health system roles, permissions and reporting hierarchies, and make use of five highly configurable areas of functionality: messaging, task and schedule management, decision support workflows, longitudinal person profiles, and analytics.

The Core Framework can be used to support the unique needs of a given health system and the work of community health workers, frontline supervisors, facility-based nurses, health system managers, and even patients and caregivers. [Building guides and tutorials]({{< ref "building" >}}) are available to help you kick things off, and you'll also find an [active forum](https://forum.communityhealthtoolkit.org) where the community of practice comes together to support each other.


## Offline-first technology

Digital health apps need to support health systems in a wide range of low infrastructure environments. Apps built with the Core Framework are designed to be [Offline-First]({{< ref "technical-overview/concepts/offline-first" >}}) and work with only an occasional internet connection.

These apps store a user’s data locally on their device so that workflows can be completed without syncing to the server. When a connection becomes available, data will automatically sync to and from the server. Offline-first technology enables health workers to carry out important duties even when opportunities to sync may be weeks apart. As with any app, there is a limit to how much data can be stored locally, particularly on a mobile device. For users needing access to large amounts of data, online user roles are available.


## Build once, deploy for everyone

By design, CHT applications do not rely on proprietary hardware or operating systems. They can run on any device that health workers have -- whether it is basic phones (via SMS), smartphones, tablets, or computers. The same source code powers the experience, meaning that the app you see on your desktop is the same app you see on your mobile device. Having common code for all devices reduces the barriers for users, and makes the digital health toolks easier to maintain.

Apps built with the Core Framework are fully responsive Progressive Web Applications (PWA). The app content will use the available screen space, showing a single-panel mobile layout for small screens on phones, and show a two-panel layout for larger devices like tablets, laptops, and desktop computers. As a PWA, CHT apps get the best of open web standards while also getting native-like capabilities to reach anyone, anywhere, on any device -- all with a single codebase. For more about how CHT Apps and other PWAs integrate the best of native apps and the open web, see the post [What are Progressive Web Apps?](https://web.dev/what-are-pwas/) on web.dev.


## Ready for national scale

Around the world, countries are adopting a model of primary health care that starts in communities and homes where high-quality, integrated services are delivered by trusted health workers who are empowered with technology. The scalability and flexibility of the CHT facilitates the creation of holistic digital community health tools that are [well integrated]({{< ref "building/interoperability" >}}) throughout the hierarchy of national health systems and across the patient continuum of care. As of 2024, six governments have selected the CHT as a tool of choice for their national community health systems.

## Made for localization

Apps can be customized for different deployments and types of workflows. The Core Framework has been used in dozens of countries around the world with [localization settings]({{< ref "building/translations/localizing" >}}).

Users can currently interact with the app in English, French, Hindi, Nepali, Spanish, Swahili, Arabic, or Indonesian and new languages can be added in the admin console. The app also supports Bikram Sambat or Gregorian calendars and localized date formatting.

## Reference apps

The Community Health Toolkit’s [Reference Apps]({{< ref "reference-apps" >}}) provide templates for structuring and organizing a community health workflow, its configuration code, and testing framework. They include a foundation for forms, data fields, and even analytics, and can be deployed as-is or easily customized by a developer for your unique context.
