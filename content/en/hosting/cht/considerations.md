---
title: Considerations when hosting
linkTitle: Considerations
weight: 1
dscription: >
  Considerations when hosting the CHT
aliases:
    - /apps/guides/hosting/
    - /hosting/considerations/
---

Some important questions to consider when setting up hosting for the CHT: 
* **Alerting** - How will alerts be sent in the case of downtime or degraded service?  While [Watchdog](//hosting/monitoring/introduction) can be set up to monitor CHT Core instances - which monitoring system will be used to alert on OS level warnings?
* **Power failures and unplanned restarts** - Will the server cleanly restart such that the CHT resumes service correctly?
* **Backups** - What happens to the CHT data if there's a hard drive failure? Are there provisions for a [3-2-1 backup strategy](https://en.wikipedia.org/wiki/Backup#Storage)? See the [backup docs](//hosting/cht/docker/backups) for more information.
* **Disaster Recovery** - What happens if there is a flood at the facility and on-site active and backup data are destroyed?
* **Scale** - What happens when the hardware deployed needs to be upgraded to increase capacity?
* **Updates** - CHT Core updates happen many times throughout the year - do you have a maintenance schedule for these and staff who are trained to do the upgrade?
* **Renewals** - Services such as TLS certificates and domains name registration expire periodically and will make the server inaccessible - do you have a schedule for monitoring and renewing these in a timely manner?
* **Security** - While the TLS certificate will protect data on the Internet, is the server hard drive encrypted in the event of property theft? Is there a sufficient policy in place when generating and handling passwords for CHWs?  Have you considered [Token Login](/building/login#magic-links-for-logging-in-token-login) to further reduce risk?
* **Privacy** - The CHT inherently carries sensitive patient medical information in the database. Are there sufficient measures in place to protect this sensitive data?
