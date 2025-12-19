---
title: "Hosting Costs"
linkTitle: "Hosting Costs"
weight: 3
description: >
  A guide for calculating CHT hosting costs
aliases:
  - /hosting/costs/
---

## Cost per CHT per Month

In a production environment, the CHT costs are estimated at USD$0.10 per active user per month to run. What exactly does this mean? Let's dive into some specifics which importantly cover what is include and excluded and how these costs can vary with each deployment.

{{< callout type="warning" >}}
  Be sure to read the [Accuracy section](#accuracy) so you understand what the costs on these page mean for your deployment.
{{< /callout >}}

## How the number was calculated

Medic hosts a number of production CHT instances in Amazon [Elastic Kubernetes Service](https://aws.amazon.com/eks/) (EKS). By using [OpenCost](https://www.opencost.io/), Medic can closely monitor real world costs with actual end users. OpenCost was used to separate one deployment's CPU, RAM and disk use from another's despite them all running in a multi-tenant EKS cluster.

Here's costs for two week period for an actual production instance which informs our USD$0.10 per active user per month cost, including a bit of over-provisioning to give a deployment some headroom:

| Total Monthly Cost     | $68    | 
|------------------------|--------| 
| Active Users (30 days) | 661    | 
| $/User                 | $0.10  | 
| RAM                    | $22    |  
| CPU                    | $8     |  
| Storage                | $24    |
| Over provision         | $14    |

We derive the $/User/Month cost by taking $68/mo and dividing it by 661 active users to arrive at $0.10.  The bottom 4 lines are the sub-items that make the total $68/mo amount. Note that if a deployment has a lot of active users, but a slower database growth than shown above, it can cause changes in costs mentioned in [the next section](#accuracy).

By using OpenCost, we not only know costs as shown above, but we also know actual resources used with in the cluster.  This allows us to be able to know CPU, storage and RAM usage.  At a higher level, we can also know how many documents were stored and document growth.  Documents are created, for example, when a CHW follows a health workflow on their device and synchronizes to the CHT:

| Monthly Resources |        | 
|-------------------|--------| 
| CPU               | 8      | 
| RAM (Gigs)        | 15     | 
| Storage (TBs)     | 0.42   | 
| Documents         | 10.7M  |
| Documents Growth  | 248.0K |  



### Accuracy

This research was based on live instances so the costs are realistic.  However, since not all programs use the CHT in the exact same way, and not all deployments have the same number of users and workflows, these numbers are still subject to some fluctuation.

Further, the costs in the table above only cover the variable costs.  That is, the costs incurred of actual usage with in an EKS cluster.  In a multi-tenant deployment with multiple instances (for example: Staging, User Acceptance Testing and Production), this can be critical to know what the three different deployments incurred costs are within the EKS cluster.  

Importantly, all production CHT deployments with version higher than 4.x have a fixed cost to run the EKS cluster or generic Kubernetes if not on AWS. This is because all clusters contain servers that are always on and fully available. This cost is not yet included in this document.

###  Production vs Development

A production deployment means the CHT is hosted either at a cloud provider or in a datacenter. Both provide high quality connectivity, power and cooling so the cost is higher than a development instance. This ensures users do not have service interruptions and can continue to have trust the CHT will be up when they need to deliver care.

When analyzing the hosting total cost of ownership (TCO), only production instances were looked at.

> [!NOTE]
> A [development environment](/hosting/cht/app-developer)  can be no cost (or very low cost).  Assuming a developer already has a laptop, this is all that is needed to host a development instance. 

## Small deployment example costs

In order to get a better idea of fixed monthly costs, let's look at the smallest Kubernetes deployment per the [requirements docs](/hosting/requirements).  These estimates use Amazon's [EC2 pricing](https://aws.amazon.com/ec2/pricing/on-demand/) and [EBS pricing](https://aws.amazon.com/ebs/pricing/) in Paris (`eu-west2`) availability zone.  Note that different [types of EC2 pricing](https://aws.amazon.com/compare/the-difference-between-on-demand-instances-and-reserved-instances/) may have different costs along with other cloud providers which will have different costs as well.

{{< callout >}}
For more examples of deployments, but without costs, see [Kubernetes vs Docker](/hosting/kubernetes-vs-docker/#example-deployments).
{{< /callout >}}

### Monthly costs 

| Item            | Cost     | Count     | Total/mo     | Note                    |
|-----------------|----------|-----------|--------------|-------------------------|
| EC2 t4g.small   | $0.01/hr | 1         | $8           | Control-plane node      | 
| EC2 c6g.2xlarge | $0.32/hr | 3         | $692         | Worker nodes            |
| EBS SSD (gp3)   | $0.09/mo | 500       | $45          | 500GB of shared storage |
|                 |          |           |              |                         |
|                 |          | **TOTAL** | **$745/mo*** |                         | 

_* These estimates are as of 2024._

### On-going costs and growth

When running a small instance, be sure to plan for future costs.  Do not assume that costs will stay flat or go down.  Assume they will go up.  Areas where costs can increase are:
* Backups - As your CouchDB instance takes more and more room, backups will cost more and more to store.
* Storage - As with backups, if the 500GB of storage approaches being full, or upgrades require a burst of disk use, plan on adding more active storage. 
* More users - offline and online CHT Core users increase the load on the system.  Be prepared to either add more worker nodes or increase the size of existing worker nodes to add more CPU and RAM. As well, consider stronger CPUs which might have higher clock speeds, more cache and be more efficient. 

## What's included in the per user cost

This document covers hosting cost and does not cover Total Cost of Ownership (TCO).  Below is a list of what's included in the hosting casts above and what is excluded.

### Included

Items that are included in the basic costs of hosting the CHT:

* Servers - Given the large number of hosted CHT instances this is the area with the most data to use to build the calculator.  This includes:
    * Average monthly cost to host the CHT
    * Ability to adjust based on expected user count, number of workflows and a few other program specific numbers like how many workflows there are.
    * Amount of CPU/RAM/Storage needed - while it is assumed this will be for AWS, it will come in the form of something like "20 vCPUs" which can be translated to any hosting environment.
* Built in overprovisioning to allow for bursts and a bit of growth
* Monitoring and Alerting - Since all software fails eventually, you need to be prepared to defend against this with aggressive monitoring and alerting.  The goal will be to fix the problem before any users notice.
* Ingress/Egress - This is the ability to send and receive data to the CHT.  Pricing from Datacenters and Cloud is readily available and "Servers" above can not exist without it.
* CHT Core updates and system maintenance - Both the CHT and underlying operating system will be upgraded on a regular basis.  This not only ensures there are no security vulnerabilities, but also ensures the deployments gains the benefit of new features and performance gains in the CHT.
* Active users - this is the total amount of users that engage with the CHT every day.  If there are credentials that are created, but no users logging in with those credentials, these do not increase costs.

### Excluded

There are many assumptions about what else is needed to run the CHT. While important, they are excluded:

* Kubernetes cluster - Large, multi-tenant deployments in a Kubernetes cluster will have a fixed monthly cost to operate, including the worker nodes which may be large in size (RAM & CPU).
* Backups - Regular snapshots of the production data will need to be taken to ensure there is no data loss in case of catastrophic failure of server hardware.  This takes up a disk space which should be accounted for when budgeting to host the CHT.
* Building a Datacenter (DC) - While some well funded MoH's may have the budget and time to build a complete data center, this is out of the scope for this calculation.  Therefore it is assumed an existing DC will be used or cloud hosting will be used.  In the case where a MoH wants to build a DC, a competent 3rd party should be selected
* Training of Systems Administrators/IT - System administrator IT systems that have not used Kubernetes or have not hosted the CHT, will need to be trained on how to do both.
* Training of Trainers (ToT) and user Training
* Data Warehousing & Dashboards - While close to "Servers" above, not all deployments have a data warehouse (CHT Sync + Postgres) and dashboards (Superset/Klipfolio) at launch.  These are easy to add on at a later date and cost can be estimated at that time.
* Upfront Purchase of Hardware - It is assumed that a deployment will either be using cloud based solutions or using managed bare metal, so these costs don't apply.
* App Development - Each deployment needs to have the default CHT app customized for each of the required workflows.
* Smartphones - Device purchase, setup, and distribution for users to use the CHT.
* Analog -> Digital Workflow conversion - The process of documenting paper processes in places that the CHT will replace.
* SMS - Some projects need the ability to send SMS to users from the CHT.
* Interoperability - While the CHT supports this out of the box - development work is needed to ensure it works with the specific 3rd party systems.
* Mobile Device Management - optional.
* Cellphone telecom services - Users actually uploading/downloading data
* Setup and/or transfer of hosting provider

## Interactive Cost Calculator

{{< cost-calculator >}}
