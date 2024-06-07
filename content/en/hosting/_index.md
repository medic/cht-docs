---
title: Hosting
weight: 6
aliases:
    - /apps/guides/hosting/
description: >
 Guides for hosting, maintaining, and monitoring CHT applications
---

This section has instructions on how to host the CHT Core starting with the most basic Application Development setup on your laptop for just one developer all the way up to large deployments which include multi-node CouchDB cluster hosted in a Cloud based deployment.

All CHT 3.x deployments have been end of life since November 2023 and are not longer supported. They're [documented]({{< relref "hosting/3.x" >}}) to support deployments that are yet to upgrade to 4.x. 

New developers to the CHT should start on CHT 4.x with our [Application Developer Hosting]({{< relref "hosting/4.x/app-developer" >}}).

Medic is standardizing production CHT Core hosting on Kubernetes - read up on [Kubernetes vs Docker Compose]({{< relref "hosting/kubernetes-vs-docker" >}}) to understand why.

System administrators looking to deploy CHT into production should understand when to use [single vs multi-node CouchDB]({{< relref "hosting/4.x/self-hosting" >}}) first, then read the [4.x self hosting section]({{< relref "hosting/4.x/self-hosting" >}}) to select a style of hosting that best fits them.

## Considerations when hosting

To produce optimal results, increase efficiency and develop structured processes in CHT applications, below are considerations to be made before hosting.

* Current and future storage needs depending on the number of potential users
* Security needs and protocol considering the sensitivity of health information
* Availability and reliability
* Support in case of downtime by setting up various lines of support
* Disaster recovery and business continuity requirements
* Cost implications
* Backup

Some important questions to consider include: 
* Alerting - How will alerts be sent in the case of downtime or degraded service?
* Power failures and unplanned restarts - Will the server cleanly restart such that the CHT resumes service correctly?
* Backups - What happens to the CHT data if there's a hard drive failure?
* Disaster Recovery - What happens if there is a flood at the facility and on-site active and backup data are destroyed?
* Scale - What happens when the hardware deployed needs to be upgraded to increase capacity?
* Updates - By definition TLS certificates expire and software needs to be updated - how will the deployment get these updates on a regular basis?
* Security - While the TLS certificate will protect data on the LAN, is the server hard drive encrypted in the event of property theft?
* Privacy - The CHT inherently carries sensitive patient medical information in the database. Are there sufficient measures in place to protect this sensitive data?

### Required skills

Basic understanding of command line interface, Kubernetes, docker, container orchestration, deployment, database commands(CouchDB, Postgres), networking components(SSL, IP addresses, DNS).

