---
title: "Hosting Costs"
linkTitle: "Hosting Costs"
weight: 3
description: >
  A guide for calculating CHT hosting costs
aliases:
  - /hosting/costs/
---

## Interactive Cost Calculator

This calculator provides an estimate of the monthly hosting costs for a CHT deployment. It is based on real-world data from production deployments and typical costs for hosting in a public cloud environment. See the details below for more information about how the costs are calculated.

{{< cost-calculator >}}

## Accuracy

This research was based on live instances, so the costs are realistic.  However, since not all programs use the CHT in the exact same way, and not all deployments have the same type of workflows, these numbers are still subject to some fluctuation.

Additionally, the costs given reflect typical costs for hosting in a public cloud (e.g., Amazon AWS or Google Cloud).  If you are hosting in a different environment, such as on-premises or in a private cloud, your costs may differ.

##  Production vs Development

These estimated costs are for a properly provisioned production deployment with a cloud provider. Hosting the CHT in a cloud datacenter ensures the instance has quality connectivity and reliable power and cooling, minimizing service interruptions.

> [!NOTE]
> A [development environment](/hosting/cht/app-developer) can be no cost (or very low cost). Assuming a developer already has a laptop, this is all that is needed to host a development instance.

## What's included in the estimated cost

This document covers hosting cost and does not cover Total Cost of Ownership (TCO).  Below is a list of what's included in the hosting casts above and what is excluded.

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
* [SMS](building/messaging/gateways/) – Some projects need the ability to send SMS to users from the CHT.
* [Interoperability](/building/interoperability/) – While the CHT supports this out-of-the-box - development work can be necessary to ensure data exchange with specific third party systems.
* Mobile Device Management - optional.
* Cellphone telecom data services - Users actually uploading/downloading data
* Setup and/or transfer of hosting provider

## Calculation details

Following are details regarding the inner workings of the interactive cost calculator.

Disk: 
- `$0.08`/GB/month - Standard [Amazon EBS](https://aws.amazon.com/ebs/) price for `gp3` (General Purpose SSD) storage.
- Docs-per-gb - calculated to be `76111` based on data recorded from production.
  - DB disk space used was measured from Node Exporter metrics using
  ```promql
  (node_filesystem_size_bytes{ mountpoint="/" } - node_filesystem_avail_bytes{ mountpoint="/" }) 
  / 1073741824 # Bytes per GB
  - 25 # Subtract 25GB for OS and other non-CHT data
  ```
  - `medic` doc count was retrieved via
  ```promql
  cht_couchdb_doc_total{ db="medic" }
  ```
  - Docs-per-gb = Medic Doc Count / DB Disk space used
- This value is a useful approximation for determining the _whole size of the db on disk_ (including view indexes and other non-`medic` database). The goal is not to determine the actual _size_ of the `medic` db, but to use the expected number of `medic` docs to estimate the total size of the whole DB.
- `medic` docs count - estimated by taking the estimated number of contacts + the estimated number of data records (anything that is not a contact). 
  - The [`/impact`](/building/reference/api/#get-apiv1impact) api endpoint can be used to get the breakdown/totals of the contact counts for an instance.
  - Using this data, plus the total `medic` doc count, I was able to estimate the following:
    - Average number of places per person: `0.36` - covers the entire place hierarchy.
    - Average number of data records per person per workflow per year: `1` - can vary widely depending on workflow (and how much of the population is targetted by the workflow).
- DB Overprovisioning factor - by default, targetting `3x` disk space free as the minimum for a production instance to give suffcient head-room for upgrades and future DB growth.
- Also including `50GB` for the root volume containing the OS and other software necessary to run the CHT. 

CPU:
- Measured the current CPU allocation with
```promql
count(node_cpu_seconds_total{ mode="idle" }) by (instance)
```
- Measured the average CPU utilization percentage for the last 14 days with:
```promql
(1 - avg(rate(node_cpu_seconds_total{ mode="idle" }[14d])) by (instance)) * 100
```
- Got the active user count with:
```promql
cht_connected_users_count
```
- Calculated the target CPU count (to reach `50%` utilization) by `cpu_count + (cpu_count * ((cpu_usage_pct - 50) / 100))`
- Calculated the average users per CPU by `active_user_count / target_cpu_count`.
- This resulted in an average users per CPU of `211`.
- For RAM, I just went with `2GB` of RAM per CPU core. This matches the [recommended values](/hosting/cht/requirements/#production-hosting) for a CHT deployment as well as the standard AWS values for "Compute optimized" instances.
- The Cost Per CPU Month (`$20.85`) was taken from the average "Linux Reserved" cost per-CPU of AWS "Compute optimized" EC2 instances in the US East (N. Virginia) region (data was collected via https://instances.vantage.sh/).
