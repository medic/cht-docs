---
title: "Integrating CHT Watchdog"
linkTitle: "Integrating"
weight: 400
description: >
    Scraping and alerting external sources with CHT Watchdog
---

{{% pageinfo %}}
These instructions apply to both CHT 3.x (beyond 3.12) and CHT 4.x.  
{{% /pageinfo %}}

## Going beyond setup and production

After you have [set up]({{< relref "apps/guides/hosting/monitoring/setup.md" >}}) CHT Watchdog and configured it to run [with TLS and have backups enabled]({{< relref "apps/guides/hosting/monitoring/production.md" >}}), you may want extend it to scrape other Prometheus data sources and send other Grafana alerts.
