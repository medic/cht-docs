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

Before beginning any of these guides, be sure to meet all of the [CHT hosting requirements]({{< relref "hosting/requirements" >}}) first.

## Considerations when hosting


Some important questions to consider when setting up hosting for the CHT: 
* **Alerting** - How will alerts be sent in the case of downtime or degraded service?  While [Watchdog]({{< relref "hosting/monitoring/introduction" >}}) can be set up to monitor CHT Core instances - which monitoring system will be used to alert on OS level warnings?
* **Power failures and unplanned restarts** - Will the server cleanly restart such that the CHT resumes service correctly?
* **Backups** - What happens to the CHT data if there's a hard drive failure? Are there provisions for a [3-2-1 backup strategy](https://en.wikipedia.org/wiki/Backup#Storage)? See the [backup docs]({{< relref "hosting/4.x/backups" >}}) for more information.
* **Disaster Recovery** - What happens if there is a flood at the facility and on-site active and backup data are destroyed?
* **Scale** - What happens when the hardware deployed needs to be upgraded to increase capacity?
* **Updates** - CHT Core updates happen many times throughout the year - do you have a maintenance schedule for these and staff who are trained to do the upgrade?
* **Renewals** - Services such as TLS certificates and domains name registration expire periodically and will make the server inaccessible - do you have a schedule for monitoring and renewing these in a timely manner?
* **Security** - While the TLS certificate will protect data on the Internet, is the server hard drive encrypted in the event of property theft? Is there a sufficient policy in place when generating and handling passwords for CHWs?  Have you considered [Token Login]({{< relref "building/concepts/access#magic-links-for-logging-in-token-login" >}}) to further reduce risk?
* **Privacy** - The CHT inherently carries sensitive patient medical information in the database. Are there sufficient measures in place to protect this sensitive data?
