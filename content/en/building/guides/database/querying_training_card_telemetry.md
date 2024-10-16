---
title: "Querying Training Card Telemetry Data"
linkTitle: "Querying Training Card Data"
weight:
description: >
  How to use SQL queries to view metrics about Training Card usage
relatedContent: >
  building/guides/performance/telemetry/
  core/overview/data-flows-for-analytics
  building/guides/training/training-cards
aliases:
   - /apps/guides/database/querying_training_card_telemetry
---

Introduced in `4.2.0`, CHT has supported deployment of in-app training cards to facilitate remote training.

Since interaction with training cards logs [telemetry data]({{< ref "building/guides/performance/telemetry" >}}), it is possible to view the data directly from CouchDB. However, it is more useful when you can run queries that provide useful metrics about the usage of training cards aggregated across many users, and interactions. With this in mind, it is typically easier to query the data using SQL from an [analytics database]({{< ref "core/overview/data-flows-for-analytics" >}}).

This guide includes several SQL queries that can act as a starting point for identifying useful metrics. 

In these examples the training cards set has an ID of `chp_self_assessment` which you can replace to get the metrics for any training card set.

1. Total number of users who have viewed a particular training set:

```
SELECT
    'chp_self_assessment' AS form_name,
    COUNT(DISTINCT doc#>>'{metadata,user}') AS total_users_viewed
FROM
    couchdb_users_meta
WHERE
    doc->>'type' = 'telemetry'
    AND COALESCE((doc#>>'{metrics,enketo:training:chp_self_assessment:add:render,count}')::int, 0) > 0;
```

2. How many times each user has viewed but not completed the training:

```
SELECT
    doc#>>'{metadata,user}' AS cht_user,
    SUM((doc#>>'{metrics,enketo:training:chp_self_assessment:add:render,count}')::int) AS views_without_completion
FROM
    couchdb_users_meta
WHERE
    doc->>'type' = 'telemetry'
    AND (doc#>>'{metrics,enketo:training:chp_self_assessment:add:render,count}')::int > 0
    AND NOT (doc#>'{metrics}' ? 'enketo:training:chp_self_assessment:add:save')
GROUP BY
    doc#>>'{metadata,user}'
ORDER BY
    views_without_completion DESC;
```

3. Number of times each user has viewed a particular training set (Includes those who have completed and those who have not completed):

```
SELECT
  doc#>>'{metadata,user}' AS cht_user,
  SUM((doc#>>'{metrics,enketo:training:chp_self_assessment:add:render,count}')::int) AS times_viewed
FROM
  couchdb_users_meta
WHERE
  doc->>'type' = 'telemetry'
  AND COALESCE((doc#>>'{metrics,enketo:training:chp_self_assessment:add:render,count}')::int, 0) > 0
GROUP BY
  doc#>>'{metadata,user}'
ORDER BY
  times_viewed desc;
```

4. How many times each user quit a particular training set:

```
SELECT
  doc#>>'{metadata,user}' AS cht_user,
  SUM((doc#>>'{metrics,enketo:training:chp_self_assessment:add:quit,count}')::int) AS times_quit
FROM
  couchdb_users_meta
WHERE
  doc->>'type' = 'telemetry'
  AND COALESCE((doc#>>'{metrics,enketo:training:chp_self_assessment:add:quit,count}')::int, 0) > 0
GROUP BY
  doc#>>'{metadata,user}'
ORDER BY
  times_quit desc;
```

5. List of users who have completed a particular training set:

```
SELECT DISTINCT
    doc#>>'{metadata,user}' AS cht_user
FROM
    couchdb_users_meta
WHERE
    doc->>'type' = 'telemetry'
    AND doc#>'{metrics}' ? 'enketo:training:chp_self_assessment:add:save';
```

6. Total number of users who have completed (submitted) a particular training set:

```
SELECT
    'chp_self_assessment' AS form_name,
    COUNT(DISTINCT doc#>>'{metadata,user}') AS total_users_completed
FROM
    couchdb_users_meta
WHERE
    doc->>'type' = 'telemetry'
    AND COALESCE((doc#>>'{metrics,enketo:training:chp_self_assessment:add:save,count}')::int, 0) > 0
```

7. How long each user took on the training set for users who have completed the training:

```
SELECT distinct
  doc#>>'{metadata,user}' AS cht_user,
  COALESCE(doc#>>'{metrics,enketo:training:chp_self_assessment:add:user_edit_time,max}','0')::int/1000 AS max_seconds_on_form,    
  COALESCE(doc#>>'{metrics,enketo:training:chp_self_assessment:add:user_edit_time,min}','0')::int/1000 AS min_seconds_on_form
FROM 
    couchdb_users_meta 
WHERE
  doc->>'type'='telemetry'
  AND doc#>'{metrics}' ? 'enketo:training:chp_self_assessment:add:save'
```

Such queries are instrumental in understanding the effectiveness of deploying training cards. The insights gained from such queries that identify useful metrics can inform where users are struggling with training cards. 

For instance, understanding why certain users quit the training repeatedly before completing the training.