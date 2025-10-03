---
title: "PostgreSQL Analytics"
linkTitle: "PostgreSQL Analytics"
weight: 10
description: >
  Managing databases used by CHT applications
aliases:
   - /apps/guides/database/
   - /building/guides/data/
relatedContent:
  technical-overview/data
---

## PostgreSQL

Used to store data for performant analytical queries such as impact and monitoring dashboards. The CHT uses [CHT Sync](https://github.com/medic/cht-sync) to handle replication of docs from "medic", "medic-sentinel", and "medic-users-meta" databases into Postgres.

{{< subpages >}}
