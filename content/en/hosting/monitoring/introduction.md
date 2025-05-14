---
title: "Introduction to monitoring and alerting"
weight: 1
linkTitle: "Introduction"
description: >
  High level approach to monitoring and alerting with CHT applications
aliases:
    - /apps/guides/hosting/monitoring/introduction
    - /apps/guides/hosting/monitoring
---

{{< hextra/hero-subtitle >}}
  High level approach to monitoring and alerting with CHT applications
{{< /hextra/hero-subtitle >}}

{{< callout >}}
This guide applies to all production instances of the CHT for both 3.x (beyond 3.9) and 4.x.
Be sure to see how to deploy a solution to [monitor and alert on production CHT instances]({{< relref "hosting/monitoring/setup.md" >}}).
{{< /callout >}}

Each deployment will experience different stresses on its resources.  Be sure to tune any alerting levels in the case of a false positive so that you may avoid them in the future. Any thresholds for alerts, and even what is alerted on, is just a guideline, not a guarantee of uptime.

## Monitoring vs Alerting

Monitoring allows CHT admins to see statistics about their server, often over time.  This can be helpful when you want to be aware of growth in your deployment (eg number of active users or number of reports per region). It should not be assumed that these will be checked regularly enough to notice a problem, for example a spike in number of feedback documents.

Alerting is a push mechanism designed to notify users who can act on the alert. These can go over SMS, email, Slack, WhatsApp or any other channel to notify the right users. 

The process of setting up monitoring and alerting should be done together. Monitoring sets the baseline and then alerting tells admins when the metric has gone beyond the baseline to a critical state. Certain metrics, like uptime for example, likely do not need to have a monitoring visualization on a dashboard, but the monitoring system should still be the authority to send an alert to denote when the service has restarted unexpectedly.

## Outside the CHT

Be sure to monitor important items that the CHT depends on in order to be healthy. You should alert when any of these are close to their maximum (disk space) or minimum (days left of valid TLS certificate):

* Domain expiration with registrar
* TLS certificate expiration 
* Disk & swap space
* CPU utilization
* Memory utilization
* Network utilization
* Process count
* OS Uptime

## Inside the CHT

The [monitoring API]({{< relref "building/reference/api#get-apiv2monitoring" >}}) was added in 3.9.0 and does not require any authentication and so can easily be used with third party tools as they do not need a CHT user account.

All metrics need to be monitored over time so that you can easily see longitudinal patterns when debugging an outage or slow down. 

### Specific of monitoring

#### Explosive Growth

Many of the values in the monitoring API do not mean much in isolation. For example if an instance has 10,714,278 feedback docs, is that bad?  If it's years old and has thousands of users, then this is normal.  If it is 4 months old and has 100 users, this is a dire problem! 

You should monitor these metrics for unexpected growth as measured by percent change over 24 hours. Ideally this can be subjectively calculated when it is more than 5% growth than the prior day.  They're marked as `growth` in the table below.

#### Non-Zero Values

Other values should always be zero, and you should alert when they are not. You may opt to alert only when they are non-zero for more than 24 hours. These are marked as `non-zero` in the table below.

#### Zero or Near Zero Values

Finally, these values should always be _not_ zero, and you should alert when are zero or very close to it.  You may opt to alert only when they are zero for more than 24 hours. They're marked with `zero` below.

#### Elements, types and samples

The names below are extrapolated from the paths in the JSON returned by the API and should be easy to find when viewing the Monitoring API URL on your CHT instance:

Name | Type | Example Value
--|--|--
Conflict Count | `growth` | 23,318
CouchDB Medic Doc Count | `growth` | 16,254,271
CouchDB Medic Fragmentation | `growth` | 1.4366029665729645
CouchDB Sentinel Doc Count | `growth` | 15,756,449
CouchDB Sentinel Fragmentation | `growth` | 2.388733774539664
CouchDB Users Doc Count | `growth` | 535
CouchDB Users Fragmentation | `growth` | 2.356411021364134
CouchDB Users Meta Doc Count | `growth` | 10,761,549
Feedback Count | `growth` | 10,714,368
Messaging Outgoing State Due | `growth` | 3,807
Messaging Outgoing State Failed | `non-zero` | 0
Outbound Push Backlog | `non-zero` | 0
Sentinel Backlog | `non-zero` | 0
Date Uptime | `zero` | 1,626,508.148

