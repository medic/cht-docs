---
title: "Interoperability Stack Kubernetes Deployment"
linkTitle: "Interoperability"
weight: 3
description: >
  Deploy the CHT Interoperability Stack to Kubernetes using Helm charts
---

## Overview

The CHT Interoperability Stack (CHT + OpenHIM + FHIR) can be deployed to Kubernetes using Helm charts. This provides a production-ready, scalable deployment suitable for both local development and cloud environments.

## What's Included

The Helm chart deploys:

- **CHT (Community Health Toolkit)**: API, Nginx, Sentinel, and CouchDB
- p
- **OpenHIM**: Health information mediator with Core API, Router, Console UI, and MongoDB
- **HAPI FHIR**: FHIR R4 server with PostgreSQL database
- **Custom Services**: Configurator for initial setup and Mediator for integration logic

## Deployment Options

Choose your deployment target:

{{< cards >}}
{{< card link="kind" title="Local Development (KIND)" subtitle="Deploy to your local machine using KIND for development and testing" icon="desktop-computer" >}}
{{< card link="eks" title="AWS EKS Deployment" subtitle="Deploy to AWS EKS with Application Load Balancer and SSL" icon="cloud" >}}
{{< /cards >}}

## Prerequisites

Both deployment options require:

- Docker
- kubectl
- Helm 3+

Additional prerequisites are listed in each deployment guide.
