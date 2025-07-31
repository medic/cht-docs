---
title: "Troubleshooting upgrades"
linkTitle: "Troubleshooting upgrades"
weight: 50
description: >
  What to do when CHT upgrades don't work as planned
relatedContent: >
  hosting/cht/migration/migration-to-4x-docker
---

{{< callout >}}
  4.0.0 was released in November of 2022 so 4.x is mature and users have learned a number of important lessons on how to fix failed upgrades.  Below are some specific tips as well as general practices on upgrading.
{{< /callout >}}

There's a concept of upgrades "getting stuck" which mainly means that after many many hours an upgrade is not making any progress.  Most likely, this will manifest as the progress bars in the  upgrade admin web UI not increasing and "sticking" at a certain percentage. An alternate possibility is that the progress bars disappear altogether. 

> [!WARNING]
> All tips apply to both [Docker]({{< relref "/hosting/cht/docker" >}}) and [Kubernetes]({{< relref "/hosting/cht/kubernetes" >}}) based deployments unless otherwise specified.
> All upgrades are expected to succeed without issue.  Do not attempt any fixes unless you actively have a problem upgrading.

## Considerations

When troubleshooting, consider making sure there are:

* Backups exist and restores have been tested 
* Extra disk space is availabe (up to 5x!)
* The upgrade has been tested on a development instance with production data

## A go-to fix: restart

A safe fix for any upgrade getting stuck is to restart all services.  Any views that were being re-indexed will be picked up where they left off without losing any work.  This should be your first step when trouble shooting a stuck upgrade. 

If you're able to, after a restart go back into the admin web GUI and try to upgrade again.  Consider trying this at least twice.

## CHT 4.0.x - 4.3.x: CouchDB Crashes

**[Issue #9286](https://github.com/medic/cht-core/issues/9286)**:  Starting an upgrade that involves view indexing can cause CouchDB to crash on large databases (>30m docs).  The upgrade will fail and you will see the logs below when you have this issue.

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
1. Check that all the indexes are warmed by loading them one by one in fauxton.
2. Restart all services, **retry** upgrade from Admin GUI, do not cancel and upgrade. Here's a screenshot showing the retry button:  


{{< figure src="retry.upgrade.png" link="retry.upgrade.png" caption="Admin web GUI showing Retry upgrade button in the lower right" >}}

## CHT 4.0.0 - 4.2.2: view indexing can become stuck after indexing is finished

**[Issue #9617](https://github.com/medic/cht-core/issues/9617):** Starting an upgrade that involves view indexing can become stuck after indexing is finished

Upgrade process stalls while trying to index staged views:

{{< figure src="stalled-upgrade.png" link="stalled-upgrade.png" caption="CHT Core admin UI showing upgrade progress bar stalled at 4%" >}}

**Fix:**

* When API goes stuck after view indexing, simply restart API.
* The admin upgrade page will say that the upgrade was interrupted, click retry upgrade.
* Depending on the state of the database, you might see view indexing again. Depending on how many docs need to be indexed, indexing might get stuck again. Go back to 1 if that happens.
* Eventually, when indexing jobs are short enough not to trigger a request hang, you will get the button to complete the upgrade.

## CHT 4.0.1 - 4.9.0: CouchDB restart causes all services to go down

**Note** - This is a Docker only issue.

**[Issue #9284](https://github.com/medic/cht-core/issues/9284)**:   A couchdb restart in single node docker takes down the whole instance.  The upgrade will fail and you will see the logs below when you have this issue.

Haproxy reports `NOSRV` errors:

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

**Issue\*:** Couch is crashing during upgrade. The upgrade will fail and you will see the logs below when you have this issue. While there's two log scenarios, both have the same fix. 

CouchDB logs scenario 1:

```shell
[error] 2024-11-04T20:42:37.275307Z couchdb@127.0.0.1 <0.29099.2438> -------- rexi_server: from: couchdb@127.0.0.1(<0.3643.2436>) mfa: fabric_rpc:all_docs/3 exit:timeout [{rexi,init_stream,1,[{file,"src/rexi.erl"},{line,265}]},{rexi,stream2,3,[{file,"src/rexi.erl"},{line,205}]},{fabric_rpc,view_cb,2,[{file,"src/fabric_rpc.erl"},{line,462}]},{couch_mrview,finish_fold,2,[{file,"src/couch_mrview.erl"},{line,682}]},{rexi_server,init_p,3,[{file,"src/rexi_server.erl"},{line,140}]}]
[error] 2024-11-04T20:42:37.275303Z couchdb@127.0.0.1 <0.10933.2445> -------- rexi_server: from: couchdb@127.0.0.1(<0.3643.2436>) mfa: fabric_rpc:all_docs/3 exit:timeout [{rexi,init_stream,1,[{file,"src/rexi.erl"},{line,265}]},{rexi,stream2,3,[{file,"src/rexi.erl"},{line,205}]},{fabric_rpc,view_cb,2,[{file,"src/fabric_rpc.erl"},{line,462}]},{couch_mrview,map_fold,3,[{file,"src/couch_mrview.erl"},{line,526}]},{couch_bt_engine,include_reductions,4,[{file,"src/couch_bt_engine.erl"},{line,1074}]},{couch_bt_engine,skip_deleted,4,[{file,"src/couch_bt_engine.erl"},{line,1069}]},{couch_btree,stream_kv_node2,8,[{file,"src/couch_btree.erl"},{line,848}]},{couch_btree,stream_kp_node,8,[{file,"src/couch_btree.erl"},{line,819}]}]
[error] 2024-11-04T20:42:37.275377Z couchdb@127.0.0.1 <0.7374.2434> -------- rexi_server: from: couchdb@127.0.0.1(<0.3643.2436>) mfa: fabric_rpc:all_docs/3 exit:timeout [{rexi,init_stream,1,[{file,"src/rexi.erl"},{line,265}]},{rexi,stream2,3,[{file,"src/rexi.erl"},{line,205}]},{fabric_rpc,view_cb,2,[{file,"src/fabric_rpc.erl"},{line,462}]},{couch_mrview,map_fold,3,[{file,"src/couch_mrview.erl"},{line,526}]},{couch_bt_engine,include_reductions,4,[{file,"src/couch_bt_engine.erl"},{line,1074}]},{couch_bt_engine,skip_deleted,4,[{file,"src/couch_bt_engine.erl"},{line,1069}]},{couch_btree,stream_kv_node2,8,[{file,"src/couch_btree.erl"},{line,848}]},{couch_btree,stream_kp_node,8,[{file,"src/couch_btree.erl"},{line,819}]}]
```

CouchDB logs scenario 2:

```shell
[info] 2024-11-04T20:18:46.692239Z couchdb@127.0.0.1 <0.6832.4663> -------- Starting compaction for db "shards/7ffffffe-95555552/medic-user-mikehaya-meta.1690191139" at 10
[info] 2024-11-04T20:19:47.821999Z couchdb@127.0.0.1 <0.7017.4653> -------- Starting compaction for db "shards/7ffffffe-95555552/medic-user-marnyakoa-meta.1690202463" at 21
[info] 2024-11-04T20:21:24.529822Z couchdb@127.0.0.1 <0.24125.4661> -------- Starting compaction for db "shards/7ffffffe-95555552/medic-user-lilian_lubanga-meta.1690115504" at 15
```

**Fix:** Give CouchDB more disk and Restart all services

_* See eCHIS Kenya [Issue #2578](https://github.com/moh-kenya/config-echis-2.0/issues/2578#issuecomment-2455702112) - a private repo and not available to the public_


## CHT 4.2.x upgrade to 4.11  - Kubernetes has pods stuck in indeterminate state

**Note** - This is a Kubernetes only issue.

**Issue\*:**  A number of pods were stuck in indeterminate state, presumably because of failed garbage collection

API Logs:

```shell
2024-11-04 19:33:56 ERROR: Server error: StatusCodeError: 500 - {"message":"Error: Can't upgrade right now.
   The following pods are not ready...."}
```

Running `kubectl get po` shows 3 pods with status of `ContainerStatusUnknown`:

{{< figure src="container-status-unknown.png" link="container-status-unknown.png" caption="CLI screenshot showing 3 pods with STATUS of ContainerStatusUnknown" >}}

**Fix:** delete pods so they get recreated and start cleanly 

```shell
kubectl delete po 'cht.service in (api, sentinel, haproxy, couchdb)'
```

_* See eCHIS Kenya [Issue #2579](https://github.com/moh-kenya/config-echis-2.0/issues/2579#issuecomment-2455637516) - a private repo and not available to the public_
