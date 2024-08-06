---
title: "Hosting Costs"
linkTitle: "Hosting Costs"
weight: 2
aliases:

---


## Cost per CHT per Month

In a production environment, the CHT costs about $0.50 per CHW per month to run.  What exactly does this mean? Let's dive into some specifics.


###  Production

A production deployment means the CHT is hosted either at a cloud provider or on servers in a datacenter. Both provide high quality connectivity, power and cooling so the cost is higher than a development instance.  This is the environment the CHT should be deployed in so CHWs do not have service interruptions and can continue to have trust the CHT will be up when they need to deliver care.

When we were analyzing the hosting total cost of ownership (TCO), we only looked at production instances.

### Development

A development environment can be no cost (or very low cost).  Assuming a developer already has a workstation or laptop with access to the Internet, this is all that is needed to host a development instance.  More than one developer could even share a server, each connecting their desktop browser and mobile handsets to the instance without issue.  

Running a development environment on only a laptop is an acceptable practice: there is no expectation of high uptime and frequent outages due to testing, breaking changes and power outages are fine.  The removal of all the production environment requirements make this a free option, leveraging resources a normal office would have. 

## How the number was calculated

Medic hosts a number of production CHT instances in Amazon Elastic Kubernetes Service (Amazon EKS). By using [OpenCost](https://www.opencost.io/), we can closely monitoring real world costs with active CHWs. OpenCost allows us to separate one deployment's CPU, RAM and disk use from another's despite them all running in a multi-tenant EKS cluster.

By looking looking at dozens of instances we host, we can focus on the highest usage ones as representative of the reasonable highest cost a self hosting partner may see.  

Here's some real costs we saw for a two week period for two instances that have been renamed to simply **A** and **B**:

|  | A | B | 
| --- | --- | --- | --- |
| $/CHW/mo | $0.05 | $0.10 |  |
| $/mo | $94 | $68 |  |
| 30 day CHW | 2000 | 661 |  |
| DB Size (Millions) | 7.5M | 10.7M |  |
| DB Growth/mo (Thousands) | 123.2K | 248.0K |  |
| RAM/mo | $16 | $22 |  |
| CPU/mo | $6 | $8 |  |
| Storage/mo* | $53 | $24 |  |
| CPU max used (vCPUs) | 2.9 | 8 |  |
| RAM max (Gigs) | 20 | 15 |  |
| Storage Max pvc (TBs) | 0.96 | 0.42 |  |

As the [prescribed method for hosting the CHT](/hosting/4.x/self-hosting/) is in a Kubernetes cluster, the chart above does not include the fixed cost of the worker nodes in this cluster. The $0.50/CHW/mo amount includes the additional cost to run these workers in the cluster.


## Expenses behind the per CHW cost

To be clear, this document is very much a hosting TCO and not a generic TCO document.  


### Included

Items that are included in the basic costs of hosting the CHT:

* Servers - This is the most likely place where Medic can leverage their intimate knowledge from hosting many dozen production instances of the CHT.  This includes:
    * Average monthly cost to host the CHT
    * Ability to adjust based on expected CHW count, number of workflows and a few other program specific numbers like how many workflows there are.
    * Amount of CPU/RAM/Storage needed - while it is assumed this will be for AWS, it will come in the form of something like "20 vCPUs" which can be translated to any hosting environment.
* Built in overprovisioning to allow for bursts and a bit of growth
* Monitoring and Alerting - Since all software fails eventually, we need to be prepared to defend against this with aggressive monitoring and alerting.  The goal will be to fix the problem before any CHWs notice.
* Ingress/Egress - This is the ability to send and receive data to the CHT.  Pricing from Datacenters and Cloud is readily available and "Servers" above can not exist without it.
* CHT Core updates and system maintenance - Both the CHT and underlying operating system will be upgraded on a regular basis.  This not only ensures there are no security vulnerabilities, but also ensures the deployments gains the benefit of new features and performance gains in the CHT.

### Excluded

There are many assumptions about what else is needed to run the CHT. While important, they are excluded:

* Backups - Regular snapshots of the production data will need to be taken to ensure there is no data loss in case of catastrophic failure of server hardware.  This takes up a disk space which should be accounted for when budgeting to host the CHT.
* Building a Datacenter (DC) - While some well funded MoH's may have the budget and time to build a complete data center, this is out of the scope of Medic's core competency.  Therefore it is assumed an existing DC will be used or cloud hosting will be used.  In the case where a MoH wants to build a DC, a competent 3rd party should be selected
* Training of Systems Administrators/IT - System administrator IT systems that have not used Kubernetes or have not hosted the CHT, will need to be trained on how to do both.
* Training of Trainers (ToT) and CHW Training -
* Data Warehousing & Dashboards - While close to "Servers" above, not all deployments have a data warehouse (CHT Sync + Postgres) and dashboards (Superset/Klipfolio) at launch.  These are easy to add on at a later date and cost can be estimated at that time.
* Upfront Purchase of Hardware - It is assumed that a deployment will either be using cloud based solutions or using managed bare metal, so these costs don't apply.
* App Development - Each deployment needs to have the default CHT app customized for each of the required workflows.
* Smartphones - Device purchase, setup, and distribution for CHWs to use the CHT.
* Analog -> Digital Workflow conversion - The process of documenting paper processes in places that the CHT will replace.
* SMS - Some projects need the ability to send SMS to CHWs from the CHT.
* Interoperability - While the CHT supports this out of the box - development work is needed to ensure it works with the specific 3rd party systems.
* Mobile Device Management - optional.
* Cellphone telecom services - Users actually uploading/downloading data
* Transfer of hosting from Medic hosted to MoH Self Hosted - Many person hours needed to help with transfer of data to new MoH based hosting.
