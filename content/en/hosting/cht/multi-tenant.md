---
title: Multi-tenant
linkTitle: Multi-tenant
weight: 30
description: >
  How to run multiple instances of the CHT on one server
relatedContent: >
  hosting/cht/kubernetes
  hosting/cht/docker
  hosting/cht/docker/backups
  hosting/monitoring
  hosting/analytics

---

While the CHT has no built-in features to support multi-tenant, there are viable work arounds using existing hosting, backup, monitoring and reporting solutions.

## What is multi-tenant

To clarify what this document covers, "multi-tenant" is defined as the ability to host multiple CHT instances on a single server, physical or virtualized.  There is no graphical interface to deploy these instances, so technical staff will be needed to configure each instance per the linked documentation below.

It is the responsibility of each multi-tenant host to ensure all [requirements](/hosting/cht/requirements/) and [considerations](hosting/cht/considerations/) are met.  

## Hosting

Both production [Docker](/hosting/cht/docker/) and production [Kubernetes](/hosting/cht/kubernetes/) CHT deployments can safely be configured to be multi-tenant. Each instance will silo all the it's own data and not allow any unauthenticated access from instances hosted on the same server.  

See the [Kubernetes vs Docker](/hosting/cht/kubernetes-vs-docker/) for more information on which technology to use.

## Backup, Monitoring and Reporting

Each multi-tenant deployment can choose to have unique [backup](/hosting/cht/docker/backups/), [monitoring](/hosting/monitoring/) and [reporting](/hosting/analytics/).  This would allow a 1:1 mapping of an instances data, with no cross pollination of the data.

Alternately, these same systems can be configured to have a single shared solution. These will be allowed to aggregate backup, monitoring and reporting into a single, global solution. This can be done in addition to or in place of a 1:1 setup as mentioned above.

The benefit of a global solution is that statistics from all deployments can be aggregated together for reporting purposes, which could be desired in a national deployment, for example. 

