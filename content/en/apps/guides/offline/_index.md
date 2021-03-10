---
title: "Offline CHT Server"
linkTitle: "Offline CHT"
weight: 100
description: >
 Running an instance of CHT Core server with no Internet
---

## Introduction

The CHT is built as an offline first application. This applies to clients, either  browsers or Android applications, connecting to the CHT server.  The server itself assumes it has Internet connectivity to provide services such as DNS, software updates and general use connectivity.  This document explores what it looks like when the CHT server is offline without these services available.

Running a CHT server requires no modifications to the CHT itself.  Instead, supporting services are needed, as seen in 

## Considerations

An offline CHT server is most appropriate for a development environment.  There are serious implications to consider before deploying an offline server in a production environment which are most often ignored .  Deployments that are considering a fully offline solution should have a plan in place to account for:

* Alerting - How will alerts be sent in the case of downtime or degraded service? 
* Power failures and unplanned restarts - Will the server cleanly restart such that the CHT resumes service correctly?
* Backups - What happens to the CHT data if there's a hard drive failure?  
* Disaster Recovery - What happens if there is a flood at the facility and active and backup data are destroyed?
* Scale - What happens when the hardware deployed needs to be upgraded to increase capacity?
* Updates - By definition TLS certificates expire and software needs to be updated - how will the deployment get these updates on a regular basis?

## Assumptions

This document makes these assumptions:  

* The CHT Server will be running on Ubuntu Server 18.04 or later
* All installation and configuration will be done in an environment with Internet connectivity and then deployed to offline location
* An experienced System Administrator familiar with DNS, TLS Certs, DHCP, LAN topology and Linux in general is creating and maintaining the deployment

## Requirements

TBD, but:
* DNS server
* Cert from an online server installed on CHT
* LAN with DHCP pointing to DNS
* Wi-Fi AP - optional

see [this comment](https://github.com/medic/cht-core/issues/6884#issuecomment-768646652) for content to include above



## Benefits Over Reverse Proxy

TBD - but all traffic stays local and can be v. handy in an offline scenario or a when developing in a location with poor connectivity, specifically for Android app development that needs valid certs to test.