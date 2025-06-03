---
title: "CHT Watchdog"
linkTitle: "CHT Watchdog"
weight: 4
description: >
    Monitoring and alerting system using Grafana and Prometheus
relatedContent: >  
    technical-overview/architecture
    hosting/monitoring/
aliases:
   - /core/overview/watchdog/
   - /technical-overview/cht-watchdog/
---

CHT Watchdog is deployed on a separate server so that you can watch for, and alert on, any critical issues with the CHT Core. Read more about [setting up CHT Watchdog]({{< relref "hosting/monitoring/setup" >}}).

<!-- make updates to this diagram on the google slides:            -->
<!-- https://docs.google.com/presentation/d/1j4jPsi-gHbiaLBfgYOyru1g_YV98PkBrx2zs7bwhoEQ/ -->

{{< figure src="cht-watchdog.png" link="cht-watchdog.png" caption="Data Flows" >}}



### Grafana

[Grafana](https://grafana.com/) is a dashboard visualization and alerting software.  It is open source and an industry standard for this task.  There is an [free repository of pre-existing dashboards](https://grafana.com/grafana/dashboards/) which greatly reduce the time to create new dashboards and alerts.  It can send alerts via email, Slack, SMS and many more.

### Prometheus 

[Prometheus](https://prometheus.io/docs/introduction/overview/) is an open source Time Series Database (TSDB) that was developed explicitly to do detailed longitudinal monitoring.  It also aggregates metrics and can automatically cull older data to save on CPU and disk space.

### JSON Exporter

[JSON Exporter](https://github.com/prometheus-community/json_exporter) is a wrapper utility to convert a JSON API to be compatible with Prometheus scrape config. This is used to convert the CHT [Monitoring API's JSON]({{< relref "building/reference/api#get-apiv2monitoring" >}}).

### Postgres Exporter

[Postgres Exporter](https://github.com/prometheus-community/postgres_exporter) allows Prometheus to scrape a Postgres database and at a predefined interval.  The queries can be configured to ingest any relevant data needed.

### CHT Core Framework & RDBMS

For more information on these technologies, see [CHT Core overview]({{< relref "technical-overview/architecture" >}}).
