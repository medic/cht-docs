---
title: Multi-tenancy in the CHT
linkTitle: Multi-tenancy
weight: 30
description: >
  What "multi-tenancy" can mean for a CHT deployment, what the CHT supports today, and why
relatedContent: >
  hosting/cht/requirements
  hosting/cht/considerations
  hosting/cht/kubernetes
  hosting/cht/docker
  hosting/cht/kubernetes-vs-docker
---

The CHT does not have built-in multi-tenancy features. Because "multi-tenant" is an umbrella term covering several very different setups, this page describes the most common scenarios the community asks about, what is and isn't possible in each, and why.

If your scenario isn't covered here, please describe it on the [CHT Forum](https://forum.communityhealthtoolkit.org/). The more specific you can be about what a "tenant" means in your context, the better the guidance you'll get.

## How a CHT instance is structured

A CHT instance is designed as one stack, one configuration, one admin scope. Per [the architecture page](/technical-overview/architecture/cht-core/), each instance is a fixed set of services pointed at a single CouchDB server:

- **API** – main application service 
- **Sentinel** – background processor for transitions, scheduled messages, purging
- **CouchDB** – data store
- **HAProxy** – logging and reverse proxy for CouchDB
- **nginx** – TLS termination and reverse proxy

All organizational data lives in the single CouchDB server, and the entire deployment shares a single app configuration (forms, hierarchy, tasks, targets) and a single admin scope. There is currently no mechanism to divide an instance into independently configured or independently administered partitions.

See related [forum discussion](https://forum.communityhealthtoolkit.org/t/does-cht-support-muti-tenant-architecture-and-how-much-load-a-single-tenant-can-take/5652).

## Scenario 1: Separate organizations, each with their own configuration and data

*Example: several implementing partners each want their own forms, hierarchy, and data, fully isolated from one another.*

This is not currently possible within a single CHT instance. The supported pattern is **instance-per-tenant**: deploy a separate CHT stack for each organization. Each instance fully silos its own data; there is no shared access between instances.

Running multiple independent CHT instances on shared infrastructure is standard [containerization](https://en.wikipedia.org/wiki/Containerization_(computing)), not a CHT feature. Each CHT instance is deployed in either [Kubernetes](/hosting/cht/kubernetes/) or [Docker hosting](/hosting/cht/docker/). See [Kubernetes vs Docker](/hosting/cht/kubernetes-vs-docker/) to choose between them.

Note that the operator of the shared infrastructure is responsible for ensuring every instance independently meets all [requirements](/hosting/cht/requirements/) and [considerations](/hosting/cht/considerations/), including [backups](/hosting/cht/docker/backups/) and [monitoring](/hosting/monitoring/) for each instance. Sizing, port allocation, TLS, and resource isolation across instances are general infrastructure concerns every CHT deployment should own.

## Scenario 2: Multiple groups sharing one instance, with separated data access

*Example: several implementers work in different regions of the same district and each should only see their own contacts and reports.*

This is only **partially** possible, and the limits are the following:

- **Offline users** are scoped by the contact hierarchy and replication depth, so they can be partitioned: each [offline user](/technical-overview/concepts/offline-first/) only replicates and sees the part of the hierarchy they belong to.
- **Online users and the API have read access to all data in the instance.** There is no mechanism to restrict this.
- **Configuration is shared.** All groups in the instance use the same forms, tasks, targets, and hierarchy definitions. One group cannot have its own variant of the app.

If the groups need isolated online/admin access or their own configuration, this scenario becomes Scenario 1: [run separate instances](#scenario-1-separate-organizations-each-with-their-own-configuration-and-data).

## Scenario 3: Self-service or white-label provisioning

*Example: a host organization wants a graphical interface where third parties can spin up their own customized CHT deployment under a shared umbrella.*

There is no graphical interface for deploying or provisioning CHT instances; every instance is deployed by technical staff following the hosting documentation above.

## Scale of a single instance

Multi-tenancy questions are sometimes really scale questions: "do we need to split into tenants to handle our load?". Usually not. Single CHT instances run in production at national and sub-national scale, comfortably serving tens of thousands of users. The real constraint is replication load — how many offline users sync and how many documents each replicates — rather than raw user count. See [scalability considerations](/hosting/cht/considerations/) before assuming you need multiple instances for capacity reasons.