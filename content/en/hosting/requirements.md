---
title: "Requirements"
linkTitle: "Requirements"
weight: 1
aliases:  
  - /apps/guides/hosting/requirements
description: >
  Requirements for hosting CHT applications
relatedContent: >
  hosting/3.x/self-hosting
  hosting/3.x/ec2-setup-guide
---
## Local hosting

Minimum Hardware requirements
* 4 GiB RAM
* 2 CPU/vCPU
* 8 GB Hard Disk (SSD preferred)
* Root Access

Software requirements
* A static IP
* A DNS Entry pointing to the IP
* TLS certificates
* Helm version 3.
* k3d/k3s with at least 1 control node and 1 worker node - for kubernetes installation

## Self-hosting/Data center setup

Minimum Hardware requirements
* 8 cores and > 8GB RAMs

Software requirements and dependencies
* Helm version 3.
* k3d/k3s with at least 3 control nodes and 1 worker node.

## Cloud hosting

Supported Cloud providers
* AWS

Compute instances required
* m7g.xlarge (4 vCPUs, 16GB)

ALB installation
* Required to support k8s ingress.

Depending on the scale of your operation these may need to be increased. Be sure to monitor disk usage so that the resources can be increased as needed.
