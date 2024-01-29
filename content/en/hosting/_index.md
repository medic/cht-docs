---
title: "Hosting CHT applications"
linkTitle: "Hosting"
weight : 5
---

Hosting guide for CHT development, testing and production instances.

## Importance of hosting
Hosting is important as it enables the storage of the application’s data and files on servers and provides remote access. For local hosting, it replicates the user’s experience.

It is important to have development, UAT and production environments to ensure that the application is well tested, development and production data is separated , server components are updated to their new versions and their compatibility and functionality is tested.Failure to properly segregate development, test, and production environments may result in loss of availability, confidentiality, and integrity of data.

For most CHT applications, development environments are locally hosted while UAT and dev environments are self-hosted, set up in data centers or cloud hosted.

## Considerations when hosting

To produce optimal results, increase efficiency and develop structured processes in CHT applications, below are considerations to be made before hosting.

* Current and future storage needs - this depends on number of documents, users and replication depth.
* Security needs and protocol - Data privacy acts of the specific region, who can access the data, for MoH deployments how different is it? Sensitivity of health information
* Availability and reliability - possibility of downtime and recovery
* Support in case of downtime - setting up various lines of support
* Disaster recovery and business continuity requirements
* Cost implications
* Backup

### Required skills

Basic understanding of command line interface, Kubernetes, docker, container orchestration, deployment, database commands(CouchDB, Postgres), networking components(SSL, IP addresses, DNS).

## Best practices when hosting

* Constant software updates
* Removing unused components
* Backup and restore options
* SSL encryption to avoid zero day exploits and other vulnerabilities and to ensure data protection
* High performance hardware
* Monitoring and evaluation of performance - managing high traffic
* Capacity planning for high performance and utilization





