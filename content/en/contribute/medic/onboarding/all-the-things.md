---
title: "All The Things"
linkTitle: "All The Things"
weight: 2
description: >
  Wide range of topics and resources to support the onboarding
---

This page is meant to serve as a point of conversation, with a wide range of topics to be discussed when joining Medic or starting as a contributor. Many things are not in any particular order. The goal is to convey a general “lay of the land” so someone starting can see a lot of what’s out there without having to be surprised each day as new things pop up.

## First, some general context…

### What is the CHT?
* Why the [CHT (Community Health Toolkit)]({{% ref "/why-the-cht" %}})?
* The [CHT Core Framework]({{% ref "/core" %}}) - App that can be accessed in the [browser](https://docs.communityhealthtoolkit.org/core/overview/architecture/#cht-web-application) or as [PWA](https://docs.communityhealthtoolkit.org/core/overview/pwa/) or [native Android app](https://docs.communityhealthtoolkit.org/core/overview/architecture/#cht-android).
* [Offline-First]({{% ref "/core/overview/offline-first" %}}) - for real
* [Architecture of the CHT]({{% ref "core/overview/architecture" %}})
* [Community](https://docs.communityhealthtoolkit.org/) of people and organizations. This is where we document all the things about the CHT Framework. Bookmark it as you primary source of reference. 

### Teams at Medic
Meet the [Medic team](https://medic.org/team/)!

### Lifecycle of a [CHT Application]({{% ref "/building/implementations#cht-lifecycle" %}}) being built
1. A program or initiative is started by one or multiple organizations.
1. Service designers and app developers figure out how they want their system to work.
1. App developers take latest version of the CHT and build the app for the organization.
1. Android flavor deployed to get branded app onto CHW devices / deployment.
1. Dashboards are set up in Klipfolio, Superset or Grafana.
1. Monitoring and alerting are set up with the CHT Watchdog.
1. Go!
1. App developers make ongoing enhancements.
1. App upgraded as new versions of CHT are available.

### CHT Academy
* [Fantastic way](https://academy.communityhealthtoolkit.org/) to understand how certain features of the CHT work.

## Now, all the things…
### People/Team

#### Distributed team 
* Without some effort, it’s easy for things to feel lonely or isolated.
* Default to asynchronous communication.
* Respect teammate timezones (including your own!).

#### Expensify
* Reach out to Internal Operations team for guidance on how to submit expenses and get refunded. When submitting expenses, follow up to make sure things get through.  

#### Funding
Medic relies on both restricted and unrestricted funds to support our mission. 
* Restricted funds are designated for specific programs or projects, ensuring that funder intent is fulfilled. To ensure the timely payment of restricted funding, accurate and on-time submission of ClickTime timesheets is crucial. These records provide essential data for financial reporting. Please prioritize submitting your timesheets monthly and contact the finance team for any assistance.
* Unrestricted funds provide the flexibility to address urgent needs, cover operational costs, and seize new opportunities to advance Medic's mission.

#### Travel 
* Team Meetups are a great way to build relations with your team! These are usually planned weeks ahead; if you feel comfortable joining, please do!
* The different teams may sometimes organize in-person meetups to meet with the people from the community. It's highly recommended to join those trips to get more connected to the community and the mission! 

#### Meetings
* There a few calls where you will be required to join. We know that depending on your timezone, you might need to adjust your calendar to be able to attend and we provide great flexibility to do so. 
* Organization-wide calls are recorded.
* No meetings on Fridays, as we consider Fridays as Deep Work days! 
* Retrospective sessions
* Weekly team meetings
* Weekly 1-to-1s with your manager

### Process

#### Development
* [Current development process]({{% ref "contribute/code/workflow" %}}). Keep in mind to involve [Quality Assistance]({{% ref "contribute/code/quality-assistance" %}}) from the start. 
* [Releasing]({{% ref "contribute/code/releasing" %}})
* Backwards compatibility matters a lot, so CHWs can keep using the app and delivery care to their community without interruptions. 
* It can feel slow at times, but we’re making a lot of progress here.
* Quality matters a lot!
* [Data Flow]({{% ref "core/overview/data-flows-for-analytics" %}})
* [Monitoring & Alerting]({{% ref "hosting/monitoring" %}})
* The main repositories to look at:
  * [cht-core](https://github.com/medic/cht-core)
  * [cht-conf](https://github.com/medic/cht-conf)
  * [cht-android](https://github.com/medic/cht-android) 
  * [cht-sync](https://github.com/medic/cht-sync) 
  * [cht-watchdog](https://github.com/medic/cht-watchdog)
* Continuous Integration (CI) with GitHub Actions
* No Continuous Deployment, as no SaaS setup
* Sonar for [Code Static Analysis]({{% ref "contribute/code/static-analysis" %}})
* [Technical resources & learning material]({{% ref "contribute/technical-resources" %}}) for CHT contributors.

#### GitHub 
* Tons of things happen here.
* Recommendation: [Set up your reminders/notifications](https://medic.slack.com/archives/C024KTGRW/p1617308776092600) 

#### Quality Assistance
* High emphasis on automation
* We moved from manual AT (acceptance testing) and release testing to fully automated
* We leverage [quality assistance]({{% ref "quality-assistance" %}})
  * Faster start-to-live 
  * Avoiding silos and shifting of responsibilities (coding and quality).

#### SRE (Site Reliability Engineering)
* Support
* Ticketing system: only GitHub
* Not on-call
* We’re offline first, so not every outage calls for immediate action/resolution.


### [CHT Forum](https://forum.communityhealthtoolkit.org/)
* We keep the forum active. It's a great place to talk with people working with the CHT.
* Encourage teammates to post and answer questions there instead of Slack when the community might benefit
* Expecting you to be proactive and support the team with checking forum posts and helping when questions arise

### Technology Radars
* A [Technology Radar]({{% ref "contribute/tech-radar" %}}) is a compilation of technologies and their adoption status in the context of the CHT. When in doubt of using a certain technology or feature of the CHT, check the radars for their adoption status.
  * [CHT Technology Radar for Contributors](https://docs.communityhealthtoolkit.org/cht-tech-radar-contributors/index.html)
  * [CHT Technology Radar for Implementers](https://docs.communityhealthtoolkit.org/cht-tech-radar-implementers/index.html).
