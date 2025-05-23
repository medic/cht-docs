---
title: Host CHT Applications
linkTitle: Host
weight: 7
description: >
  Guides for hosting, maintaining, and monitoring CHT applications
aliases:
    - /apps/guides/hosting/
---

This section has instructions on how to host the CHT Core starting with the most basic Application Development setup on your laptop for just one developer all the way up to large deployments which include multi-node CouchDB cluster hosted in a Cloud based deployment.

{{< callout type="warning" >}}
  All CHT 3.x deployments have been end of life since November 2023 and are not longer supported. They are [documented]({{< relref "hosting/3.x" >}}) to support deployments that are yet to upgrade to 4.x. 
{{< /callout >}}

New developers to the CHT should start on CHT 4.x with the [Application Developer Hosting]({{< relref "hosting/4.x/app-developer" >}}).

System administrators looking to deploy CHT into production should understand [the requirements to host the CHT]({{< relref "/hosting/requirements/" >}}) first, then read the [Docker or Kubernetes]({{< relref "/hosting/kubernetes-vs-docker/" >}}) to select a style of hosting that best fits them.

{{< cards >}}
  {{< card link="considerations" title="Considerations" subtitle="Considerations when hosting the CHT" icon="book-open" >}}
  {{< card link="requirements" title="Requirements" icon="shield-exclamation" subtitle="Requirements for hosting CHT applications" >}}
  {{< card link="costs" title="Costs" subtitle="A guide for calculating CHT hosting costs" icon="banknotes" >}}
  {{< card link="vertical-vs-horizontal" title="Vertical vs Horizontal Scaling" subtitle="The power of clustered CouchDB to horizontally scale the CHT" icon="server" >}}
  {{< card link="kubernetes-vs-docker" title="Kubernetes vs Docker" icon="kubernetes" subtitle="Options for installing CHT applications" >}}
  {{< card link="4.x/" title="4.x" icon="template" subtitle="Guides for hosting CHT 4.x applications" >}}
  {{< card link="3.x/" title="3.x" icon="archive" subtitle="Guides for hosting CHT 3.x applications" >}}
  {{< card link="monitoring/" title="Monitoring & Alerting" subtitle="Using CHT Watchdog to Monitor and Alert on  CHT 3.x and 4.x Applications" icon="bell" >}}
  {{< card link="analytics/" title="Data Synchronization & Analytics" subtitle="Using CHT Sync for data synchronization and analytics" icon="chart-pie" >}}
  {{< card link="sso" title="SSO" subtitle="Setting up Single Sign On" icon="key"  >}}  
  {{< card link="couch2pg/" title="couch2pg" subtitle="Guides for using couch2pg" icon="presentation-chart-line" tag="deprecated" tagType="warning" >}}
  {{< card link="medic" title="At Medic" subtitle="Guidelines internal to Medic-hosted CHT instances " icon="briefcase" tag="medic-internal" >}}
{{< /cards >}}
