---
title: "Docker Production Hosting in CHT 4.x"
linkTitle: "Docker"
weight: 2
description: >
  Production hosting the CHT 
relatedContent: >
  hosting/requirements
  hosting/kubernetes-vs-docker
---


Docker allows easy to set up hosting of the CHT.  It can not scale as much as
[Kubernetes]({{< relref "hosting/4.x/production/kubernetes" >}}) 
which is better for both multi-tenant deployments and for highly performant, multi-node CouchDB deployments.