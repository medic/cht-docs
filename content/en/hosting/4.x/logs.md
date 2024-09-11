---
title: "Viewing server logs in CHT 4.x"
linkTitle: "Logs"
weight: 300
aliases:
  - /apps/guides/hosting/4.x/logs
description: >
    What to do when you need to find server side errors in CHT 4.x
relatedContent: >
   building/guides/debugging/sharing-4x-logs.md
   building/guides/debugging/obtaining-logs
---

CHT 4.x has the following services running via Docker and each can have its logs queried:

* nginx
* sentinel
* api
* haproxy
* couchdb
* healthcheck
* upgrade-service

## Setting log level

By default, the CHT server logs are set to the `info` level. To change the log level to `debug`, you can set the `NODE_ENV` environment variable to `development`.  A log level of `debug` can affect system performance and cause log files sizes to grow rapidly.  It is recommended to temporarily set the log level to `debug` only when needed for troubleshooting.

## Viewing logs

First, find the actual names of the containers with the  `docker ps --format '{{.Names}}'`  command which should show something like this:

```
cht_nginx_1
cht_sentinel_1
cht_api_1
cht_haproxy_1
cht_healthcheck_1
cht_couchdb_1
upgrade-service-cht-upgrade-service-1
```

You can then use the `docker logs` command to view the logs of any given container.  For example, if we call `docker logs cht_nginx_1` it will show ALL the logs from that container.  To show only the last 5 lines, you can use the `--tail` flag to specify the number of lines like this `docker logs cht_nginx_1 --tail 5`.  The result will look like this:

```
10.131.161.1 - - [15/Feb/2023:21:08:35 +0000] "GET /medic/_changes?feed=longpoll&heartbeat=10000&since=115-g1AAAAH5eJyF0LENwjAQBVCLRIAEFBTMgESBCA0lrACJBzgnRXSKoKJmClaAxEswRZbIDCTHZ4GzXPzCT-d_rowx8zIqzDK_3fOycKdkf9jucJIKVyMybmVtxhQp6E-s23jfME00B-LdUWQIOBBxmJkG3gXJHHtfM8WaA2ncQ6RnGmsOZLjG5mLtk2mmSKAUCPHGSkxT3dZAiK_IR28A1AMhzta2wbko2iJe3ndMC92iaIfAzwrTmn8as5aY&limit=25 HTTP/1.1" 499 0 "https://10-131-161-159.local-ip.medicmobile.org/" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0"
10.131.161.1 - - [15/Feb/2023:21:08:35 +0000] "GET /medic-user-medic-meta/_changes?include_docs=true&feed=longpoll&heartbeat=10000&since=13-g1AAAAH5eJyF0LENwkAMhWETKGkoWIICERpKWAESD3BOiugUQUXNFKwAiZdgiiyRGUjMY4FYV_zFfbJ8VxPRspqXtCpu96Iq5ZTuD9sdTlrjKgkka-Y8htkE-hOWjWrrOBCVo9noOBATzMwcB5JLVG0cB9LKw2xwHMh4XdCF-TktgTIg5I0nubYBQr5mnxiSaTsAIWfmzp2LRTvkpdq7Fov2CH7WYOMP5CCWMg&limit=25 HTTP/1.1" 499 0 "https://10-131-161-159.local-ip.medicmobile.org/" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0"
10.131.161.1 - - [15/Feb/2023:21:08:35 +0000] "GET /fontawesome-webfont.woff2 HTTP/1.1" 304 0 "https://10-131-161-159.local-ip.medicmobile.org/styles.css" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0"
10.131.161.1 - - [15/Feb/2023:21:08:35 +0000] "GET /fonts/NotoSans-Bold.ttf HTTP/1.1" 304 0 "https://10-131-161-159.local-ip.medicmobile.org/styles.css" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0"
10.131.161.1 - - [15/Feb/2023:21:08:35 +0000] "GET /fonts/NotoSans-Regular.ttf HTTP/1.1" 200 221787 "https://10-131-161-159.local-ip.medicmobile.org/styles.css" "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0
```

Sometimes you may want to search the logs for a specific string. To search, use the pipe (`|`) and `grep` commands to do this.  Here we search for all the times HA Proxy thought CouchDB wasn't reachable (`DOWN`) with this call `docker logs cht_haproxy_1 2>&1 | grep 'DOWN'`:

```
<145>Feb 15 20:52:06 haproxy[25]: Server couchdb-servers/couchdb is DOWN, reason: Layer7 wrong status, code: 0, info: "via agent : down", check duration: 208ms. 0 active and 0 backup servers left. 0 sessions active, 0 requeued, 0 remaining in queue.
[WARNING] 045/205206 (25) : Server couchdb-servers/couchdb is DOWN, reason: Layer7 wrong status, code: 0, info: "via agent : down", check duration: 208ms. 0 active and 0 backup servers left. 0 sessions active, 0 requeued, 0 remaining in queue.
[WARNING] 045/205601 (25) : Server couchdb-servers/couchdb is DOWN, reason: Layer7 wrong status, code: 0, info: "via agent : down", check duration: 207ms. 0 active and 0 backup servers left. 5 sessions active, 0 requeued, 0 remaining in queue.
<145>Feb 15 20:56:01 haproxy[25]: Server couchdb-servers/couchdb is DOWN, reason: Layer7 wrong status, code: 0, info: "via agent : down", check duration: 207ms. 0 active and 0 backup servers left. 5 sessions active, 0 requeued, 0 remaining in queue.
```

If you want to watch the logs for a specific container in real time, you can use the `--follow` flag.  This command would watch the requests come into API in realtime: `docker logs cht_api_1 --follow`.  It's nice to couple this with the `--tail` command so you only see the last 5 lines of the existing logs before watching for new lines with `docker logs cht_api_1 --follow --tail 5` which would show this:

```
RES d17d71f5-2dcb-4ebb-bb0e-7874b3000570 10.131.161.1 - GET /medic/_design/medic-client/_view/reports_by_subject?keys=%5B%22557e79b8-2d99-4bd1-a4d6-a44491d483d8%22%5D HTTP/1.0 200 - 12.452 ms
RES e43c5d7f-4e32-433a-a96d-ef991f4298a3 10.131.161.1 - GET /medic/_design/medic/_view/doc_summaries_by_id?keys=%5B%22557e79b8-2d99-4bd1-a4d6-a44491d483d8%22%5D HTTP/1.0 200 - 31.226 ms
REQ c656ecc7-e6af-4564-ad63-2cab2c42844a 10.131.161.1 - GET /medic/_all_docs?include_docs=true&startkey=%22target~2023-02~557e79b8-2d99-4bd1-a4d6-a44491d483d8~%22&endkey=%22target~2023-02~557e79b8-2d99-4bd1-a4d6-a44491d483d8~%EF%BF%B0%22 HTTP/1.0
RES c656ecc7-e6af-4564-ad63-2cab2c42844a 10.131.161.1 - GET /medic/_all_docs?include_docs=true&startkey=%22target~2023-02~557e79b8-2d99-4bd1-a4d6-a44491d483d8~%22&endkey=%22target~2023-02~557e79b8-2d99-4bd1-a4d6-a44491d483d8~%EF%BF%B0%22 HTTP/1.0 200 - 11.153 ms
2023-02-15 21:54:49 DEBUG: Checking for a configured outgoing message service 
```
