---
title: Hosting
weight: 6
aliases:
    - /apps/guides/hosting/
description: >
 Guides for hosting, maintaining, and monitoring CHT applications
---

Before beggining any of these guides, be sure to meet all of the [CHT hosting requirements]({{< relref "hosting/requirements" >}}) first.
## Importance of hosting
Hosting is important as it enables the storage of the application’s data and files on servers and provides remote access. For local hosting, it replicates the user’s experience.

It is important to have development, UAT and production environments to ensure that the application is well tested, development and production data is separated , server components are updated to their new versions and their compatibility and functionality is tested.Failure to properly segregate development, test, and production environments may result in loss of availability, confidentiality, and integrity of data.

For most CHT applications, development environments are locally hosted while UAT and dev environments are self-hosted, set up in data centers or cloud hosted.

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

