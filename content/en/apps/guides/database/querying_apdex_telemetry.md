---
title: "Querying Apdex Telemetry Data"
linkTitle: "Querying Apdex Telemetry Data"
weight:
description: >
  How to use SQL queries to view Apdex scores
relatedContent: >
  apps/guides/performance/telemetry/
  core/overview/data-flows-for-analytics
  apps/guides/database/#postgresql
---

Added in `4.7.0`, CHT now records the Apdex (Application Performance Index) that is an open standard for measuring performance of software applications.

Since apdex is part of the [telemetry]({{< ref "apps/guides/performance/telemetry" >}}) system, it is possible to view apdex data directly from CouchDB. However, it is more useful when aggregated across many users, interactions, and/or days. With this in mind, it is typically easier to query the data using SQL from an [analytics database]({{< ref "core/overview/data-flows-for-analytics" >}}).

An example of an SQL to view the apdex score:

```
WITH apdex_telemetry_data AS (
  SELECT
    substring(metric from '^(.*):apdex:') AS event_category,
    CASE
      WHEN metric LIKE '%:satisfied' THEN 'satisfied'
      WHEN metric LIKE '%:tolerable' THEN 'tolerable'
      WHEN metric LIKE '%:frustrated' THEN 'frustrated'
    END AS event_type,
    SUM(count) AS event_count
  FROM
    useview_telemetry_metrics
  WHERE metric LIKE '%:apdex:%'
  GROUP BY event_category, event_type
),
apdex_scores AS (
  SELECT
    event_category,
    SUM(CASE WHEN event_type = 'satisfied' THEN event_count ELSE 0 END) AS satisfied_count,
    SUM(CASE WHEN event_type = 'tolerable' THEN event_count ELSE 0 END) AS tolerable_count,
    SUM(CASE WHEN event_type = 'frustrated' THEN event_count ELSE 0 END) AS frustrated_count,
    SUM(event_count) AS total_event_count
  FROM apdex_telemetry_data
  GROUP BY event_category
)
SELECT
  event_category,
  satisfied_count,
  tolerable_count,
  frustrated_count,
  ROUND(((satisfied_count + (tolerable_count / 2.0)) / total_event_count)::numeric, 2) AS apdex_score
FROM apdex_scores
ORDER BY apdex_score asc;
```

The SQL query above calculates the Apdex scores for various events recorded in the `useview_telemetry_metrics` table, providing insights into the performance of different aspects of the CHT.

Such queries are instrumental in identifying areas of the CHT that may require performance improvements by highlighting how different parts of the application meet user expectations in terms of load times and Apdex score.
