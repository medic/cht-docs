---
title: "CHT Watchdog Dashboards"
linkTitle: "Dashboards"
weight: 400
description: >
   Review of the default CHT Watchdog dashboards

---

{{< callout >}}
These instructions apply to both CHT 3.x (beyond 3.12) and CHT 4.x.  
{{< /callout >}}

## Overview

![overview.png](dashboards/overview.png)

## Details

![details.png](dashboards/details.png)

## API Server

![api-server.png](dashboards/api-server.png)

## Replication



| User State | Theshold                    |
|------------|-----------------------------|
| Satisfied  | <180s (3min)                |
| Tolerated  | >= 180 (3min) < 360s (6min) |
| Frustrated | >= 360s (6min)              |

![replication.png](dashboards/replication.png)