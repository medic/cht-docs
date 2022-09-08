---
title: "Monitoring and alerting on the CHT"
linkTitle: "Monitoring & Alerting"
weight: 40
description: >
    Important metrics to monitor and alert on
---

{{% alert title="Note" %}} This guide applies to all production instances of the CHT including [self hosted]({{< relref "apps/guides/hosting/self-hosting.md" >}}) and [AWS hosted]({{< relref "apps/guides/hosting/ec2-setup-guide.md" >}}). It also works with [app developer]({{< relref "apps/guides/hosting/app-developer.md" >}}) and [CHT core developer]({{< relref "apps/guides/hosting/core-developer" >}}) setups if you're looking to test how it works or develop monitoring tools.{{% /alert %}}

While this guide does not detail exactly how to set up monitoring and alerting, it will outline the items you should monitor and alert on.  At a later date we'll deploy an opinionated guide on which software and services to use when doing real world hosting.

Each deployment will experience different stresses on its resources.  Be sure to tune the alerting levels in the case of an outage so that you may avoid it in the future. Any thresholds for alerts, and even what is alerted on, is just a guideline, not a garuntee of uptime.

## Monitoring vs Alerting

Monitoring allows CHT admins to see statistics about their server, often over time.  This can be helpful when you want to be aware of growth in your deployment (eg number of active users or number of reports per region). It should not be assumed that these will be checked regularly enough to notice a problem, for example a spike in number of feedback documents.

Alerting, must be a push mechanism, forcibly notifying users who can act on the alert. These can go over SMS, email, Slack, WhatsApp or any other mechanism that will find it's way on to the mobile or desktop device of the right users. 

The process of setting up monitoring and alerting should be done together. Monitoring sets the baseline and then alerting tells admins when the metric has gone beyond the baseline to a critical state. Certain metrics, like uptime for example, likely do not need to have a monitoring visualization on a dashboard, but the monitoring system should still be the authority to send an alert to denote when the service has restarted unexpectedly.

## Outside the CHT

Be sure to monitor important items that the CHT depends on in order to be healthy. You should alert when any of these are close to their maximum(disk space)  or minimum (days left of valid TLS certificate):

* Domain expiration with registrar
* TLS certificate expiration 
* Disk & swap space
* CPU utilization
* Memory utilization
* Network utilization
* Process count
* OS Uptime

## Inside the CHT

As of [CHT 3.9.0]({{% ref "core/releases/3.9.0.md#instance-monitoring" %}}), the [Monitoring v1 API]({{< relref "apps/reference/api#get-apiv1monitoring" >}}) has been available. In  [CHT 3.12.0]({{% ref "core/releases/3.12.0.md#instance-monitoring" %}}) this API was depricated in [favor of v2]({{< relref "apps/reference/api#get-apiv3monitoring" >}}). These APIs do not require any authentication and so can easily be used with third party tools as they do not need a CHT user account.

All metrics need to be monitored over time so that you can easily see longitudinal patterns when debugging an outage or slow down. The names below are extrapolated from the paths in the JSON returned by the API and should be easy to find when viewing the `/api/v1/monitoring` or `/api/v2/monitoring` URLs on your CHT instance.

### Explosive Growth

Many of the values in the monitoring API do not mean much in isolation. For example if an instance has 10,714,278 feedback docs, is that bad?  If it's years old and has thousands of users, then this is normal.  If it is 4 months old and has 100 users this is a dire problem! 

You should monitor these metrics for unexpected growth as measured by percent change over 24 hours. Ideally this can be subjectively calculated when it is more than 5% growth than the prior day. 

* Conflict Count
* CouchDB Medic Doc Count
* CouchDB Medic Fragmentation
* CouchDB Sentinel Doc Count
* CouchDB Sentinel Fragmentation
* CouchDB Users Doc Count
* CouchDB Users Fragmentation
* CouchDB Users Meta Doc Count
* Feedback Count
* Messaging Outgoing State Due
* Messaging Outgoing State Failed

### Non-Zero Values

Other values should always be zero, and you should alert when they are not. You may opt to alert only when they are non-zero for more than 24 hours:

* Messaging Outgoing State Failed
* Outbound Push Backlog
* Sentinel Backlog

### Zero or Near Zero Values

Finally, these values should always be _not_ zero, and you should alert when are zero or very close to it.  You may opt to alert only when they are zero for more than 24 hours:

* Date Uptime
