---
title: "Querying Apdex Telemetry Data"
linkTitle: "Querying Apdex Telemetry Data"
weight:
description: >
  How to use SQL queries to view Apdex scores
relatedContent: >
  technical-overview/data/performance/telemetry
  technical-overview/data/analytics/data-flows-for-analytics
  technical-overview/data/analytics/#postgresql
aliases:
   - /apps/guides/database/querying_apdex_telemetry
   - /building/guides/database/querying_apdex_telemetry/
---

Added in `4.7.0`, CHT now records the Apdex (Application Performance Index) that is an open standard for measuring performance of software applications.

Since Apdex is part of the [telemetry](/technical-overview/data/performance/telemetry) system, it is possible to view Apdex data directly from CouchDB. However, it is more useful when aggregated across many users, interactions, and/or days. With this in mind, it is typically easier to query the data using SQL from an [analytics database](/technical-overview/data/analytics/data-flows-for-analytics).

An example of an SQL to view the Apdex score:

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
  satisfied_count + tolerable_count + frustrated_count AS total_count,
  satisfied_count,
  tolerable_count,
  frustrated_count,
  ROUND(((satisfied_count + (tolerable_count / 2.0)) / total_event_count)::numeric, 2) AS apdex_score
FROM apdex_scores
ORDER BY apdex_score asc;
```

The SQL query above calculates the Apdex scores for various events recorded in the `useview_telemetry_metrics` table, providing insights into the performance of different aspects of the CHT. In some cases, it is helpful to visualize the number of occurrences of each metric in a date range:

```
WITH 
  constants (days, start_date, end_date) AS (VALUES (<count_days_in_range>, <YYYY-MM-DD>, <YYYY-MM-DD>)),
  apdex_metrics AS(
    SELECT 
      substring(metric FROM '^(.*):apdex:') AS metric,
      SUM(COUNT) AS COUNT
    FROM useview_telemetry_metrics, constants
    WHERE 
      metric LIKE '%:apdex:%'
      AND period_start BETWEEN constants.start_date::DATE AND constants.end_date::DATE
    GROUP BY metric
  ),   
  apdex_result as (
    SELECT 
      metric,
      CASE 
	    WHEN apdex_metrics.metric = 'contact_list:load' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'contact_list:query' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'contact_detail:<contact_type>:load' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'contact_detail:<contact_type>:load' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'contact_detail:<contact_type>:load' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'enketo:contacts:<contact_form>:add:render' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'enketo:contacts:<contact_form>:add:save' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'enketo:reports:<app_form>:add:render' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'enketo:reports:<app_form>:add:save' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'report_list:load' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'report_list:query' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'report_detail:<app_form_id>:load' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'tasks:load' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'tasks:refresh' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'enketo:tasks:<app_form_id>:add:render' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'enketo:tasks:<app_form_id>:add:save' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'message_list:load' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'messages_detail:load' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'analytics:targets:load' THEN <count_in_a_day> * constants.days
	    WHEN apdex_metrics.metric = 'boot_time' THEN <count_in_a_day> * constants.days
      END AS expected_count,
      SUM(apdex_metrics.count) AS actual_count
    FROM apdex_metrics, constants
    GROUP BY apdex_metrics.metric, constants.days
  )
SELECT
  apdex_result.metric,
  apdex_result.expected_count,
  apdex_result.actual_count,
  CASE
    WHEN apdex_result.actual_count >= apdex_result.expected_count THEN 'TRUE' ELSE 'FALSE'
  END AS meet_expectation
FROM apdex_result
ORDER BY apdex_result.metric ASC
```

Such queries are instrumental in identifying areas of the CHT that may require performance improvements by highlighting how different parts of the application meet user expectations in terms of load times and Apdex score.
