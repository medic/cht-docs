---
title: "Troubleshooting upgrades"
linkTitle: "Troubleshooting upgrades"
weight: 50
aliases:
  - 
description: >
  What to do when CHT 4.x upgrades get stuck
relatedContent: >
  hosting/4.x/data-migration
---

With 4.x well into a mature stage as 4.0.0 was released in November of 2022, Medic has learned a number of important lessons on how to unstick 4.x upgrades that get stuck.  Below are some specific tips as well as general practices on upgrading 4.x.

{{% pageinfo %}}
All tips apply to both [Docker]({{< relref "hosting/4.x/production/docker" >}}) and [Kubernetes]({{< relref "hosting/4.x/production/kubernetes" >}}) based deployments unless otherwise specified.

All upgrades are expected to succeed without issue.  Do not attempt any fixes unless you actively have a problem upgrading.
{{% /pageinfo %}}

## Before you start

tk - flesh out, but be prepared by:

* Have and have tested backups
* Have extra disk space (up to 5x!)
* Have tested the upgrade on a dev instance
* ?

## A go-to fix: restart

A safe fix for any upgrade getting stuck is to restart all services.  Any views that were being re-indexed will be picked up where they left off without loosing any work.  This should be your first step when trouble shooting a stuck upgrade.

## CHT 4.0.x - 4.3.x: CouchDB Crashes

**[issue](https://github.com/medic/cht-core/issues/9286)**:  Starting an upgrade that involves view indexing can cause CouchDB to crash on large databases (>30m docs)

HAProxy:

```shell
<150>Jul 26 20:57:39 haproxy[12]: 172.22.0.4,<NOSRV>,503,0,0,0,GET,/,-,medic,'-',217,-1,-,'-'
<150>Jul 26 20:57:40 haproxy[12]: 172.22.0.4,<NOSRV>,503,0,0,0,GET,/,-,medic,'-',217,-1,-,'-'
<150>Jul 26 20:57:41 haproxy[12]: 172.22.0.4,<NOSRV>,503,0,0,0,GET,/,-,medic,'-',217,-1,-,'-'
```

CouchDB

```shell
[notice] 2024-07-26T20:52:45.229027Z couchdb@127.0.0.1 <0.10998.4> dca1387a05 haproxy:5984 172.22.0.4 medic GET /_active_tasks 200 ok 1
[notice] 2024-07-26T20:52:45.234397Z couchdb@127.0.0.1 <0.10986.4> 2715cd1e47 haproxy:5984 172.22.0.4 medic GET /medic-logs/_all_docs?descending=true&include_docs=true&startkey=%22upgrade_log%3A1722027165223%3A%22&limit=1 200 ok 6
[notice] 2024-07-26T20:52:45.468469Z couchdb@127.0.0.1 <0.11029.4> 3bf85c6071 haproxy:5984 172.22.0.4 medic GET /_active_tasks 200 ok 1
```

**Fix:**
1. I'm checking that all the indexes are warmed by loading them one by one in fauxton.
2. Restart all services, **retry** upgrade from Admin GUI (not cancel and upgrade)

## CHT 4.2.4 - 4.c.x: view indexing can become stuck after indexing is finished

**[issue](https://github.com/medic/cht-core/issues/9617):** Starting an upgrade that involves view indexing can become stuck after indexing is finished

upgrade process stalls after view indexes are built

tk - get screenshot of admin UI with no progress bar

**Fix:**

Unfortunately, the workaround is manual and very technical and involves:

* When API goes stuck after view indexing, simply restart API.
* The admin upgrade page will say that the upgrade was interrupted, click retry upgrade.
* Depending on the state of the database, you might see view indexing again. Depending on how many docs need to be indexed, indexing might get stuck again. Go back to 1 if that happens.
* Eventually, when indexing jobs are short enough not to trigger a request hang, you will get the button to complete the upgrade.
* 
## CHT 4.0.1 - 4.9.0: CouchDB restart causes all services to go down

**Note** - This is a Docker only issue.

**[issue](https://github.com/medic/cht-core/issues/9284)**:   A couchdb restart in single node docker takes down the whole instance.

Haproxy continuously reports NOSRV errors like:

```shell
<150>Jul 25 18:11:03 haproxy[12]: 172.18.0.9,<NOSRV>,503,0,1001,0,GET,/,-,admin,'-',241,-1,-,'-'
```

API logs:

```shell
StatusCodeError: 503 - {"error":"503 Service Unavailable","reason":"No server is available to handle this request","server":"haproxy"}
```

nginx reports:

```shell
2024/07/25 18:40:28 [error] 43#43: *5757 connect() failed (111: Connection refused) while connecting to upstream, client: 172.18.0.1, 
```


**Fix:** Restart all services


## CHT 4.x.x upgrade to 4.x.x - no more free disk space  

[Issue](https://github.com/moh-kenya/config-echis-2.0/issues/2578#issuecomment-2455702112): prod instance couch is  crashing, stuck at compaction initiation - escalated to MoH Team to resolve [lack of free disk space issue]

tk - can't (re)start services during upgrade

**Fix:** Give CouchDB more disk and Restart all services


## CHT 4.2.x upgrade to 4.11  - kubernetes has pods stuck in indeterminate state

**Note** - This is a Kubernetes only issue.

[Issue](https://github.com/moh-kenya/config-echis-2.0/issues/2579#issuecomment-2455637516): A number of pods were stuck in indeterminate state, presumably because of failed garbage collection

API Logs
```shell
2024-11-04 19:33:56 ERROR: Server error: StatusCodeError: 500 - {"message":"Error: Can't upgrade right now.
   The following pods are not ready...."}
```

Running `kubectl get po` shows 3 pods with status of `ContainerStatusUnknown`:

![CLI screenshot showing 3 pods with STATUS of "ContainerStatusUnknown" ](container-status-unknown.png)

**Fix:** delete pods so they get recreated and start cleanly 

(tk - is this syntax legal/correct?)

`kubectl delete po 'cht.service in (api, sentinel, haproxy, couchdb)'`

