---
title: "Monitoring and alerting on the CHT"
linkTitle: "Monitoring & Alerting"
weight: 40
description: >
    Important metrics to monitor and alert on
---

{{% alert title="Note" %}} This guide applies to all production instances of the CHT including [self hosted]({{< relref "apps/guides/hosting/self-hosting.md" >}}) and [AWS hosted]({{< relref "apps/guides/hosting/ec2-setup-guide.md" >}}). It also works with [app developer]({{< relref "apps/guides/hosting/app-developer.md" >}}) and [CHT core developer]({{< relref "apps/guides/hosting/core-developer" >}}) setups if you're looking to test how it works or develop monitoring tools.{{% /alert %}}

While this guide is agnostic on how exactly to set up monitoring and alerting, it will outline the items you should monitor and alert on.  At a later date we'll deploy an opinionated guide on which software and services to use when doing real world hosting.

## Monitoring vs Alerting

Monitoring allows CHT admins to see statistics about their server, often over time.  This can be helpful when you want to be aware of growth in your deployment (eg number of active users or number of reports per region). It should not be assumed that these will be checked regularly enough to notice a problem, for example a spike in number of feedback documents.

Alerting, must be a push mechanism, forcibly notifying users who can act on the alert. These can go over SMS, email, Slack, WhatsApp or any other mechanism that will find it's way on to the mobile or desktop device of the right users. 

The process of setting up monitoring and alerting should be done together. Monitoring sets the baseline and then alerting tells admins when the metric has gone beyond the baseline to a critical state.

## Outside the CHT

Before we get to what to monitor in the CHT, be sure you're monitoring important items that the CHT depends on in order to be healthy:
* Domain expiration with registrar
* TLS certificate expiration
* 
