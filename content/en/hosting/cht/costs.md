---
title: "Hosting Costs"
linkTitle: "Costs"
weight: 3
description: >
  A guide for calculating CHT hosting costs
aliases:
  - /hosting/costs/
---

## Cost Calculator

This calculator provides an estimate of the monthly hosting costs for a CHT deployment. It is based on real-world data from production deployments and typical costs for hosting in a public cloud environment. See the details below for more information about how the costs are calculated.

{{< cost-calculator >}}

### Calculation details

The calculator estimates hosting costs based on data collected from production CHT deployments. All values below were derived from [Watchdog metrics](/technical-overview/architecture/cht-watchdog/) and real-world pricing.

#### Estimating document count

The `medic` database document count drives the disk size estimate. It is calculated as:

`medic docs = contacts + data records`

Where:
- **Contacts** = users + population + places
- **Places** = population x `0.36` (average places per person, covering the full place hierarchy)
- **Data records** = population x workflows x deployment age x `1` (average docs per person per workflow per year)

The places-per-person and data-records-per-person-per-workflow-per-year ratios were derived from the [`/impact`](/building/reference/api/#get-apiv1impact) API endpoint data across production instances.

> [!NOTE]
> The data-records-per-person-per-workflow-per-year value (`1`) can vary widely depending on the workflow and how much of the population is targeted by that workflow.

#### Disk sizing

The total disk size has three components:

| Component             | Description                                        |
|-----------------------|----------------------------------------------------|
| **DB disk**           | Estimated `medic` doc count / `76,111` docs-per-GB |
| **Over-provisioning** | DB disk x over-provisioning factor (default `3x`)  |
| **Root volume**       | `50` GB for the OS and CHT software                |

The _docs-per-GB_ value (`76,111`) is a ratio of `medic` doc count to total database disk usage (including CouchDB view indexes and non-`medic` databases). It was measured from production by getting the total disk space used (from Node Exporter metrics) with:

```promql
# DB disk space used (GB)
(node_filesystem_size_bytes{ mountpoint="/" } - node_filesystem_avail_bytes{ mountpoint="/" })
/ 1073741824
- 25  # Subtract OS and non-CHT data
```

Then the total doc count for the `medic` database can be retrieved with `cht_couchdb_doc_total{ db="medic" }`. When this value was divided by the GBs of used disk space, the average result for the measured instances was `76,111` docs per GB.

The goal is not to determine the actual size of the `medic` database, but to use the expected `medic` doc count to estimate the total disk footprint of all databases.

The over-provisioning factor (default `3x`) provides headroom for CouchDB compaction, upgrades, and future growth.

#### Disk cost

Disk is priced at `$0.08`/GB/month based on standard [Amazon EBS](https://aws.amazon.com/ebs/) `gp3` (General Purpose SSD) pricing.

#### CPU and RAM sizing

CPU count is determined by the number of users:

`CPUs = users / 211` (rounded up, minimum 1)

The _users-per-CPU_ value (`211`) was calculated from production instances by:

1. Measuring CPU allocation: `count(node_cpu_seconds_total{ mode="idle" }) by (instance)`
2. Measuring average utilization over 14 days: `(1 - avg(rate(node_cpu_seconds_total{ mode="idle" }[14d])) by (instance)) * 100`
3. Getting active user count: `cht_connected_users_count`
4. Calculating the target CPU count to reach `50%` utilization: `cpu_count + (cpu_count * ((cpu_usage_pct - 50) / 100))`
5. Dividing active users by target CPU count

RAM is allocated at `2` GB per CPU core. This matches the [recommended values](/hosting/cht/requirements/#production-hosting) for CHT deployments and the standard AWS sizing for "Compute optimized" instances.

#### Instance cost

Instance cost is `$20.85` per CPU per month, based on the average "Linux Reserved" per-CPU cost of AWS "Compute optimized" EC2 instances in the US East (N. Virginia) region (collected via [instances.vantage.sh](https://instances.vantage.sh/)).

## Accuracy

This research was based on live instances, so the costs are realistic.  However, since not all programs use the CHT in the exact same way, and not all deployments have the same type of workflows, these numbers are still subject to some fluctuation.

Additionally, the costs given reflect typical costs for hosting in a public cloud (e.g., Amazon AWS or Google Cloud).  If you are hosting in a different environment, such as on-premises or in a private cloud, your costs may differ.

##  Production vs Development

These estimated costs are for a properly provisioned production deployment with a cloud provider. Hosting the CHT in a cloud datacenter ensures the instance has quality connectivity and reliable power and cooling, minimizing service interruptions.

> [!NOTE]
> A [development environment](/hosting/cht/app-developer) can be no cost (or very low cost). Assuming a developer already has a laptop, this is all that is needed to host a development instance.

## What's included in the estimated cost

This document covers hosting cost and does not cover Total Cost of Ownership (TCO).  Below is a list of what's included in the hosting costs above and what is excluded.

### Included

Items that are included in the basic costs of hosting the CHT:

* Servers for hosting the CHT
* Built in overprovisioning to allow for bursts and a bit of growth (targetting `50%` CPU utilization and including `3x` disk space for DB expansion)

### Excluded

There are many additional costs to successfully hosting a CHT instance that are not included in this estimation:

* Backups - Regular snapshots of the production data will need to be taken to ensure there is no data loss in case of catastrophic failure of server hardware.  This takes up a disk space which should be accounted for when budgeting to host the CHT.
* [Monitoring and Alerting](/technical-overview/architecture/cht-watchdog/) - Since all software fails eventually, you need to be prepared to defend against this with aggressive monitoring and alerting.  The goal will be to fix the problem before any users notice.
* Training of Systems Administrators/IT - System administrator IT systems that have not hosted the CHT will need to be trained.
* Training of Trainers (ToT) and user Training
* Data Warehousing & Dashboards – Many deployments require a data warehouse ([CHT Sync](/technical-overview/architecture/cht-sync/) + Postgres) and dashboards (Superset/Klipfolio). However, this is not strictly required to host a CHT instance and can be added at a later date.
* Upfront Purchase of Hardware – It is assumed that a deployment will either be using cloud-based solutions or using managed bare metal, so these costs are not included.
* App Development – Each deployment needs to have the default CHT app customized for the required workflows.
* Smartphones – Device purchase, setup, and distribution for users.
* Analog → Digital Workflow conversion – The process of documenting paper processes the CHT will replace.
* [SMS](/building/messaging/gateways/) – Some projects need the ability to send SMS to users from the CHT.
* [Interoperability](/building/interoperability/) – While the CHT supports this out-of-the-box - development work can be necessary to ensure data exchange with specific third party systems.
* Mobile Device Management - optional.
* Cellphone telecom data services - Users actually uploading/downloading data
* Setup and/or transfer of hosting provider
