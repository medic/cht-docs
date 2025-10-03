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

New developers to the CHT should start with the [Application Developer Hosting](//hosting/cht/app-developer).

System administrators looking to deploy CHT into production should understand [the requirements to host the CHT](//hosting/cht/requirements/) first, then read the [Docker or Kubernetes](//hosting/cht/kubernetes-vs-docker/) to select a style of hosting that best fits them.

{{< cards >}}
  {{< card link="cht/" title="CHT Core" icon="template" subtitle="Guides for hosting CHT applications" >}}
  {{< card link="monitoring/" title="Monitoring & Alerting" subtitle="Using CHT Watchdog to Monitor and Alert on CHT Applications" icon="bell" >}}
  {{< card link="analytics/" title="Data Synchronization & Analytics" subtitle="Using CHT Sync for data synchronization and analytics" icon="chart-pie" >}} 
  {{< card link="couch2pg/" title="couch2pg" subtitle="Guides for using couch2pg" icon="presentation-chart-line" tag="deprecated" tagIcon="warning" tagType="warning" >}}
  {{< card link="sso" title="SSO" subtitle="Setting up Single Sign On" icon="key"  >}}
  {{< card link="medic" title="At Medic" subtitle="Guidelines internal to Medic-hosted CHT instances" icon="briefcase" tag="medic internal" tagIcon="key" >}}
{{< /cards >}}
