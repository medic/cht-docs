---
title: "Preparing to upgrade to CHT 5.0"
linkTitle: "Preparing for CHT 5.0"
weight: 
description: >
  Steps to ensure your CHT App will run smoothly on CHT 5.0 and later
  
---

## Introduction

Medic uses [Semantic Versioning](https://en.wikipedia.org/wiki/Semver#Semantic_versioning) (aka "SemVer") which means that the CHT upgrade from the major 4.x version to the 5.x version denotes there are breaking changes. The key to a successful upgrade will be to understand and plan for these breaking changes. The two breaking changes for 5.0 are:

* CouchDB Nouveau imposing changes to Kubernetes hosting infrastructure 
* Removal of upgrade service from Kubernetes deployments


## Breaking Changes

### CouchDB Nouveau

A major feature of CHT 5.0 is replacing the old freetext search in 4.x with CouchDB Nouveau. The addition of Nouveau [decreases the amount of disk space](https://github.com/medic/cht-core/issues/9898#issuecomment-2864545914) used by the CHT.  Disk space has been shown to be a major contributor to hosting costs, hence Nouveau is the first feature to [reduce Hosting Total Cost of Ownership (TCO)](https://github.com/medic/cht-roadmap/issues/171).

#### Kubernetes

Kubernetes based deployments will need to follow the migration steps from the deprecated [CHT 4.x Helm Charts repository](https://github.com/medic/helm-charts/) to the new [CHT 5.x Helm Charts](https://github.com/medic/cht-core/tree/master/scripts/build/helm) in the main CHT repository.

Please see the technical guide on how to migrate Kubernetes based deployments to 5.0.

#### Docker Compose

No action is needed for Docker Compose based deployments. To upgrade, click "Stage" and then "Upgrade" which is the existing process for all 4.x upgrades and continues to apply to 4.21 to 5.0 and beyond.

## Upgrade service removed from Kubernetes

In CHT 4.x there are two ways to upgrade a CHT instance:

1. Click "Stage" and then "Upgrade" in the CHT administration interface.  
2. Push a new helm chart to Kubernetes that specified different versions.

A recurring problem seen on production deployments was that over time CHT administrators would use the CHT administration interface to upgrade.  Then during a migration or a restore from backup, Kubernetes administrators would inadvertently downgrade a CHT instance by using an out of date Helm chart.

To avoid this situation, the upgrade service has been removed from Kubernetes based deployments.


<!--
todo: write real contente above and remove this HTML comment

Taken from https://github.com/medic/cht-docs/issues/1949

Outline:

Intro - TCO + Nouveau
----------
All install methods need to:
        include details about the app_url requirement for token_login documented here: 

    chore(#9983): update token_login docs to clarify app_url requirement #1909 https://github.com/medic/cht-docs/pull/1909
    Any changes to CHT Conf that folks should upgrade for? You should always upgrade CHT Conf 😹
    Do we want to mention CHT Toolbox's sequential upgrade branch which eCHIS KE has been using to test upgrades?
    As usual, you may need up to 5x disk space
    backups

Docker
----------
    no actions needed, you should just be able to click "upgrade"
    show how to check compose files with two service

Kubernetes
----------
    You need to do more - see
        Add documentation for migrating from 4.x medic/helm-charts to the new production charts in 5.x cht-core #1943  
        https://github.com/medic/cht-docs/issues/1943

-->
