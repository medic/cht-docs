---
title: Kubernetes vs Docker
linkTitle: Kubernetes vs Docker
weight: 5
aliases:
  -  /hosting/vertical-vs-horizontal
---

{{< hextra/hero-subtitle >}}
  Options for installing CHT applications
{{< /hextra/hero-subtitle >}}

{{< callout >}}
Medic previously suggest Kubernetes for all production deployments - this is no longer the case. 
{{< /callout >}}

Medic now recommends [Docker](/hosting/4.x/docker/) for most deployments. Use [Kubernetes](/hosting/4.x/kubernetes/) for multi-tenant or specific hardware constrained deployments. For more details on the research behind suggesting Docker, please see [this forum post](https://forum.communityhealthtoolkit.org/t/investigate-adding-more-shards-as-a-potential-avenue-for-improved-performance/4831?u=mrjones).

This all said, deployments should use the technology they know the best. If a deployment plans for 20 instances and really doesn't want to use Kubernetes, that's fine.  Conversely, if an NGO only uses Kubernetes and wants to deploy a single instance of the CHT - that's also fine.

Application development for both [CHT 3.x]({{< relref "hosting/3.x/app-developer" >}}) and [CHT 4.x]({{< relref "hosting/4.x/app-developer" >}}) should use Docker.

## Docker 

Docker's has stood the test of time and has many benefits:

* Easy to deploy by just downloading a compose file.
* Trivially scales down to a 4 core laptop and [way up to a 48 core server](https://forum.communityhealthtoolkit.org/t/investigate-adding-more-shards-as-a-potential-avenue-for-improved-performance/4831). 
* Easily integrates with existing Docker based solutions like [Watchdog](/hosting/monitoring/) or other services running in Docker.
* Backup and restore can be achieved via simple file management via [bind mounted volumes](https://docs.docker.com/engine/storage/bind-mounts/).
* Just enough complexity to securely and soundly run the CHT with out extra complexities of Kubernetes 
* Natively supports one click CHT upgrades in the admin GUI

Docker Compose deployment has the following services when running the CHT:

* A service for each CouchDB instance.
* A CHT API service.
* HAProxy Healthcheck service.
* HAProxy service.
* Upgrade Service service.
* A CHT Sentinel service.
* An nginx service to act as a reverse proxy and terminate TLS connections


## Kubernetes (k8s)

{{< callout type="warning" >}}
Medic recommends Kubernetes for bare-metal servers with a low core count or for multi-tenant deployments.
{{< /callout >}}

Running CHT on k8s requires additional knowledge and can be more complex to deploy. Docker is the preferred solution for most production deployments.

k8s offers:

* Resilient network across either physical or VM nodes in the cluster. This allows strong distribution of the heavy CPU and RAM loads that CouchDB can incur under heavy use.
* Orchestration of multiple deployments ensuring to allow easy hosting of multi-tenants. For example you may opt to have a user acceptance testing (UAT), staging and production instances all in one cluster.
* Service discovery which  enables to route public requests to deployments within the cluster
* Integration with hypervisors such as VMWare and ESX. This is possible due to CRD support in Kubernetes that allows 3rd parties to create integrations
* Helm support and integration that makes it easy to easily deploy applications on to the cluster
* Highly efficient snapshot backups when used with a storage area network [SAN](https://en.wikipedia.org/wiki/Storage_area_network) or Amazon's [Elastic Block Storage](https://aws.amazon.com/ebs/) (EBS).

The main components of a Kubernetes CHT deployment include one less service than a Compose based deployment as ingress via `nginx` isn't needed as it's handled externally:

* A pod for each CouchDB instance.
* A CHT API pod.
* A CHT HAProxy Healthcheck pod.
* A CHT HAProxy pod.
* Upgrade Service pod.
* CHT-Sentinel pod.

## Example deployments

Below are examples from 2 Ministries of Health (MoH) and Medic hosted instances.

### MoH Kenya

Kenya hosts 47 production instances in a Kenyan data center running [K3s](https://k3s.io/). They run a simplified k3s set up with 47 isolated installations of k3s to easy management complexity.  Thus each CHT instance is bound to the VM's local storage.  If a VM fails, there is no automatic fail-over and a restore from backup is needed.

|                   |         |
|------------------:|:--------|
|    CHT Instances: | 47      |
|          Hosting: | k3s     |
|            Cores: | tk      |
|              RAM: | tk      |
|             Disk: | 4,700GB |
| Multi-Node Couch: | No      |
|            Users: | 123.3k  |


<!-- 
sources:

Jul 15th, 2023 Slack
https://medic.slack.com/archives/CBQH2HNJC/p1689443385526589?thread_ts=1689373994.245809&cid=CBQH2HNJC

May 12 2025 Google doc listing instances, users and disk use
MoH Kenya Kubernetes Migration Schedule
https://docs.google.com/spreadsheets/d/1m0TERssHNlJZ-tLdeDUkEKPP_9wr3_uPMlgcjoVbRjc/edit?gid=0#gid=0

-->

### MoH Uganda

Uganda hosts 1 of production instance in a Uganda data center running [K3s](https://k3s.io/).


|                   |                       |
|------------------:|:----------------------|
|    CHT Instances: | 1                     |
|          Hosting: | K3s on VMware)        |
|            Cores: | 32 (4 VMs x 8 cores)  |
|              RAM: | 64GB (4 VMs x 16GB)   |
|             Disk: | 600GB (4 VMs x 150GB) |
| Multi-Node Couch: | Yes                   |
|            Users: | 12k                   |

<!-- 
sources:

May 2nd,2024 Slack
https://medic.slack.com/archives/C06TP97HRMZ/p1714639214379159

-->


### Medic

Medic hosts 46 production instances on Amazon [Elastic Kubernetes Service](https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html) (EKS).

|                   |                                                       |
|------------------:|:------------------------------------------------------|
|    CHT Instances: | 46                                                    |
|          Hosting: | k8s on EKS                                            |
|            Cores: | 64 (8 VMs x 8 Cores/ea)                               |
|              RAM: | 256GB (8 VMs x 32GB/ea)                               |
|             Disk: | 8.7TB (8 VMS x 500GB/ea + 47 deployments x ~100GB/ea) |
| Multi-Node Couch: | 44 No, 2 Yes                                          |
|            Users: | 25.7k                                                 |


<!-- 
sources:

MoH Mali CHW & Togo are multi-node

There's 8VMs listed in the "Host" drop down on this dashboard:
https://observability.app.medicmobile.org/d/rYdddlPWk/node-exporter-full?orgId=1&refresh=1m&from=now-5m&to=now

Namespaces taken from observability counts up to 47. as well as 12 support sytems not counted
achham-ne
bardiya-ne
bhaktapur-ne-prod
bhojpur-ne-prod
care-sindhuli-prod
cht-app-prod
cht-covid-prod
dhankuta-ne-prod
dho-baitadi-prod
dho-bajura-ne-prod
dho-dadeldhura-ne-prod
dho-rasuwa-ne-prod
dho-sindhupalchowk-ne-prod
dho-sunsari-ne-prod
dpho-banke-prod
dpho-kanchanpur-prod
dpho-pyuthan-ne-prod
gandaki-prod
humla-ne-prod
jajarkot-ne
kailali-ne-prod
kalikot-ne
kfn-ilam-prod
lumbini-ne-prod
lumbini-prod
malaria-consortium-prod
moh-civ-prod
moh-mali-supervisor-prod
moh-siaya-prod
moh-togo-prod
moh-ug-uncdf-prod
moh-zanzibar-prod
morang-ne-prod
msf-goma-prod
ohw-dhading-prod
panchthar-ne-prod
pih-malawi-prod
prod-disc-mali
rolpa-ne-prod
safaridoctors-ke
safesimbaglug-ne-prod
salyan-ne-prod
sankhuwashabha-ne-prod
srhgorkha-ne-prod
syangja-ne-prod
walling-prod

superset4
postgres-to-dhis2-test
medic-deliverybot-prod
medic-observability
kube-system
gandaki-superset
cert-manager
airbyte
auto-ssh-rdbms
test-upgrade-service-prod
users-chis-prod
moh-togo-superset
safari-doctors-superset

========================

Export from Watchdog version table on May 2025

https://watchdog.app.medicmobile.org/d/acac0e0f-d7c9-4be2-a8f2-10dc71772980/deployments-by-version?orgId=1&refresh=30s

instance	Version	Users (30 Day Avg)	Provisioned Users
panchthar-ne.app.medicmobile.org	4.18.0	1	72
dhankuta-ne.app.medicmobile.org	4.18.0	29	106
dho-sunsari-ne.app.medicmobile.org	4.18.0	3	121
waling.app.medicmobile.org	4.18.0	17	22
dpho-banke.app.medicmobile.org	4.18.0	1	24
dho-baitadi.app.medicmobile.org	4.18.0	37	168
kalikot-ne.app.medicmobile.org	4.18.0	30	141
achham-ne.app.medicmobile.org	4.18.0	16	138
bardiya-ne.app.medicmobile.org	4.18.0	21	98
morang-ne.app.medicmobile.org	4.18.0	6	139
rolpa-ne.app.medicmobile.org	4.18.0	10	232
dho-sindhupalchowk-ne.app.medicmobile.org	4.18.0	83	288
sankhuwashabha-ne.app.medicmobile.org	4.18.0	3	62
care-sindhuli.app.medicmobile.org	4.18.0	1	44
moh-togo.app.medicmobile.org	4.9.0	230	7990
dho-dadeldhura-ne.app.medicmobile.org	4.18.0	1	29
syangja-ne.app.medicmobile.org	3.17.2	0	59
srhgorkha.app.medicmobile.org	3.17.2	0	31
dpho-pyuthan-ne.app.medicmobile.org	4.18.0	3	28
ohw-dhading.app.medicmobile.org	4.18.0	71	172
salyan-ne.app.medicmobile.org	4.18.0	8	84
kailali-ne.app.medicmobile.org	4.18.0	24	115
supervisor-moh-mali.app.medicmobile.org	3.15.0	282	308
humla-ne.app.medicmobile.org	4.18.0	1	30
dho-bajura-ne.app.medicmobile.org	4.18.0	1	21
moh-civ.app.medicmobile.org	4.9.0	1406	1870
dho-rasuwa-ne.app.medicmobile.org	4.18.0	2	42
jajarkot-ne.app.medicmobile.org	4.18.0	8	101
kfn-ilam.app.medicmobile.org	4.18.0	5	100
bhojpur-ne.app.medicmobile.org	4.18.0	8	91
lumbini.app.medicmobile.org	4.18.0	88	285
bhaktapur-ne.app.medicmobile.org	4.18.0	12	113
gandaki.app.medicmobile.org	4.18.0	715	1919
disc-mali.ml	4.10.0	2427	6088
safaridoctors-ke.app.medicmobile.org	4.9.0	25	43
dpho-kanchanpur.app.medicmobile.org	4.18.0	35	194
bajhang-ne.app.medicmobile.org	4.18.0	72	199
cht.mali.prod.musohealth.app	4.15.0	468	585
lumbini-ne.app.medicmobile.org	4.18.0	431	511
moh-zanzibar.app.medicmobile.org	4.5.2	1225	2952
chis.dohs.gov.np	4.18.0	55	95

-->
