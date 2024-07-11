---
title: "Fetching logs"
linkTitle: "Fetching logs"
weight: 1
description: >
  Fetch logs from a CHT v2.x production server.
---

This is a standalone command installed alongside `cht-conf`.  For usage information, run `cht-logs --help`.

# Usage
```
cht-logs <instance-name> <log-types...>
```

Accepted log types:
```
api
couchdb
gardener
nginx
sentinel
```
