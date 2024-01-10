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
* [Community](https://communityhealthtoolkit.org/) of people and organizations. This is where we document all the things about the CHT Framework. Bookmark it as you primary source of reference. 

### Teams at Medic
Meet the [Medic team](https://medic.org/team/)!
* Product
* Programs
* Research
* Internal Operations
* External Affairs

### Lifecycle of a [CHT Application]({{% ref "/running-programs/#cht-lifecycle" %}}) being built
1. Programs team starts relationship with an organization
1. Service designers and app developers figure out how they want their system to work
1. App developers take latest version of the CHT and build the app for the organization
1. Android flavor deployed to get branded app onto CHW devices / deployment
1. Dashboards are set up in Klipfolio, Superset or Grafana
1. Go!
1. App developers make ongoing enhancements
1. App upgraded as new versions of CHT are available

## Now, all the things…
### People/Team

#### Distributed team 
* Without some effort, it’s easy for things to feel lonely or isolated
* Default to asynchronous communications
* Respect teammate timezones (including your own!)

#### Expensify
* Follow up to make sure things get through 

#### Funding
* Restricted - Clicktime
* Unrestricted

#### Travel 
* Meetups at your own risk are fine

#### Meetings
* A few mandatory calls
* Organization-wide calls are recorded
* No recurring meetings on Fridays
* Retros - MetroRetro
* 2 Daily Standups
* Weekly FWG meetings

### Process

#### Development
* Basic current process:
1. Take ticket (GitHub issue from a board)
1. Code something up on a branch
1. Open pull request
1. Move ticket to “Ready for AT (Acceptance Testing)”
1. Upon testing passing, merge and delete branch
1. Get QA engineers involved early in the process!
* Releases
1. Backwards compatibility matters a lot
1. Can feel slow at times, but we’re making a lot of progress here. See above about how Focused Groups work.
1. Quality matters a lot
* Data engineering -> software engineering
  * Workflow management 
  * Dashboards
* The main repos to look at:
  * cht-core
  * cht-conf
  * cht-android 
  * cht-sync 
  * couch2pg
  * cht-pipeline
  * cht-sync
  * cht-monitoring
* Continuous Integration (CI) with GitHub Actions
* No CD, as no SaaS setup

#### GitHub 
* Tons of stuff happens here.
* Recommendation: [Set up your reminders/notifications](https://medic.slack.com/archives/C024KTGRW/p1617308776092600) 
* A few important boards: 
  * [SRE Engineering](https://github.com/orgs/medic/projects/38)
  * [SRE Support](https://github.com/orgs/medic/projects/19)
  * [Ecosystem Workstream](https://github.com/orgs/medic/projects/134/views/11)
  * [Allies Workstream](https://github.com/orgs/medic/projects/134/views/3)
  * [Care Teams Workstream](https://github.com/orgs/medic/projects/134/views/2)
  * [Test Automation](https://github.com/orgs/medic/projects/134/views/12)

#### QA
* Doing a lot of automation
* Trying to move from manual AT and release testing to fully automated
* Trying out [quality assistance]({{% ref "quality-assistance" %}})
  * Faster start-to-live 
  * Avoiding silos and shifting of responsibilities (coding and quality)

#### SRE
* Support
* Ticketing system: only GitHub
* Not on-call
* We’re offline first, so not every outage calls for immediate action/resolution
* Engineering work - Archv3 (cht-core 4.0 version)

### Product
#### [CHT Forum](https://forum.communityhealthtoolkit.org/)
* We’re trying to keep this active
* Encourage teammates to post and answer questions there instead of slack when the public might benefit
* Expecting you to be proactive and support the team with checking forum posts and helping when questions arise

#### Partners
* Medic-hosted
* Self-hosted
* Technical partners

#### Product Development Process
* At Medic, we follow [Continuous Discovery]({{% ref "continuous-discovery-overview" %}}) as a [Product Development Process]({{% ref "product-development-process" %}})
  * Trying to follow closely with the [Continuous Discovery Habits](https://www.producttalk.org/2021/05/continuous-discovery-habits/) book by Teresa Torres
  * [Focused Working Groups]({{% ref "focused-groups" %}}) within the product team to focus on specific groups of users
    * Allies
    * Care Teams
    * Infrastructure
    * Ecosystem