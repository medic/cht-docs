---
title: "Self Hosting in CHT 4.x"
linkTitle: "Self Hosting"
weight: 10
aliases:
  - /apps/guides/hosting/4.x/self-hosting/
description: >
  Details for hosting the CHT on self run infrastructure
---

# Recommendations and considerations

## Multi vs Single node couchdb requirements

For smaller deployments a [single node CouchDB][single-couch] instance can be used, for larger deployments a [multi-node CouchDB][multi-couch] cluster is generally recommended

| Consideration                                            | [Single node CouchDB][single-couch] | [Multi-node clustered CouchDB][multi-couch] |
| -------------------------------------------------------- | ----------------------------------- | ------------------------------------------- |
| Less than {{< format-number 4_000 >}} users              | {{< icon/yes >}}                    | {{< icon/yes >}}                            |
| More than {{< format-number 4_000 >}} users              | {{< icon/no >}}                     | {{< icon/yes >}}                            |
| Less than {{< format-number 10_000 >}} documents per day | {{< icon/yes >}}                    | {{< icon/yes >}}                            |
| More than {{< format-number 10_000 >}} documents per day | {{< icon/no >}}                     | {{< icon/yes >}}                            |
| Seamless upgrade with multi-node docker compose          | {{< icon/yes >}}                    | {{< icon/no >}}                             |
| Seamless upgrade with multi-node kubernetes/k3s          | {{< icon/yes >}}                    | {{< icon/yes >}}                            |

[single-couch]: {{< relref "hosting/4.x/self-hosting/single-node" >}}
[multi-couch]: {{< relref "hosting/4.x/self-hosting/multiple-nodes" >}}

## Cloud provider vs Bare metal

| Consideration               | Cloud provider  | Bare Metal       |
| --------------------------- | --------------- | ---------------- |
| Data needs to be in-country | {{< icon/no >}} | {{< icon/yes >}} |
