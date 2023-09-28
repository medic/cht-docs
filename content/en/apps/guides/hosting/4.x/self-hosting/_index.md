---
title: "Self Hosting in CHT 4.x"
linkTitle: "Self Hosting"
weight: 10
description: >
  Details for hosting the CHT on self run infrastructure
---

# Recommendations and considerations

## Multi vs Single node couchdb requirements

For smaller deployments a [single node CouchDB]({{< relref "apps/guides/hosting/4.x/self-hosting/single-node" >}}) instance can be used, for larger deployments a [multi-node CouchDB]({{< relref "apps/guides/hosting/4.x/self-hosting/multiple-nodes" >}}) cluster is generally recommended

| Consideration                                                                   | [Single node CouchDB]({{< relref "apps/guides/hosting/4.x/self-hosting/single-node" >}}) | [Multi-node clustered CouchDB]({{< relref "apps/guides/hosting/4.x/self-hosting/multiple-nodes" >}}) |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Less than 2000 users                                                            | {{< icon/yes >}}                                                                         | {{< icon/yes >}}                                                                                     |
| More than 2000 users                                                            | {{< icon/no >}}                                                                          | {{< icon/yes >}}                                                                                     |
| Less than 1 million documents                                                   | {{< icon/yes >}}                                                                         | {{< icon/yes >}}                                                                                     |
| More than 1 million documents                                                   | {{< icon/no >}}                                                                          | {{< icon/yes >}}                                                                                     |
| Significant bursts of traffic (i.e. "Sync day" for a lot of users once a month) | {{< icon/no >}}                                                                          | {{< icon/yes >}}                                                                                     |
| Seamless upgrade with multi-node docker compose                                 | {{< icon/yes >}}                                                                         | {{< icon/no >}}                                                                                      |
| Seamless upgrade with multi-node kubernetes/k3s                                 | {{< icon/yes >}}                                                                         | {{< icon/yes >}}                                                                                     |


## Cloud provider vs Bare metal

| Consideration               | Cloud provider  | Bare Metal       |
| --------------------------- | --------------- | ---------------- |
| Data needs to be in-country | {{< icon/no >}} | {{< icon/yes >}} |

## Recommended orchestration provider

| Consideration                        | Docker Compose   | K3s              |
| ------------------------------------ | ---------------- | ---------------- |
| Small deployment (less than 3 nodes) | {{< icon/yes >}} | {{< icon/yes >}} |
| Large deployment                     | {{< icon/no >}}  | {{< icon/yes >}} |


