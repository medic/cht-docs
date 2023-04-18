---
title: "Monitoring and alerting on the CHT"
linkTitle: "Monitoring & Alerting"
weight: 40
description: >
    Important metrics to monitor and alert on
---

{{% pageinfo %}} 
This guide applies to all production instances of the CHT including [self hosted]({{< relref "apps/guides/hosting/3.x/self-hosting.md" >}}) and [AWS hosted]({{< relref "apps/guides/hosting/3.x/ec2-setup-guide.md" >}}). It also works with [app developer]({{< relref "apps/guides/hosting/3.x/app-developer.md" >}}) and [CHT core developer]({{< relref "contribute/code/core/dev-environment" >}}) setups if you're looking to test how it works or develop monitoring tools.

These instructions apply to both 3.x (beyond 3.9) and 4.x CHT monitoring
{{% /pageinfo %}}

This guide provides both a high level overview of the general considerations for monitoring and alerting with the CHT as well as [a recommended deployment configuration](#grafana-and-prometheus) for monitoring and alerting with Prometheus and Grafana.

Each deployment will experience different stresses on its resources.  Be sure to tune any alerting levels in the case of a false positive so that you may avoid them in the future. Any thresholds for alerts, and even what is alerted on, is just a guideline, not a guarantee of uptime.

## Monitoring vs Alerting

Monitoring allows CHT admins to see statistics about their server, often over time.  This can be helpful when you want to be aware of growth in your deployment (eg number of active users or number of reports per region). It should not be assumed that these will be checked regularly enough to notice a problem, for example a spike in number of feedback documents.

Alerting is a push mechanism designed to notify users who can act on the alert. These can go over SMS, email, Slack, WhatsApp or any other channel to notify the right users. 

The process of setting up monitoring and alerting should be done together. Monitoring sets the baseline and then alerting tells admins when the metric has gone beyond the baseline to a critical state. Certain metrics, like uptime for example, likely do not need to have a monitoring visualization on a dashboard, but the monitoring system should still be the authority to send an alert to denote when the service has restarted unexpectedly.

## Outside the CHT

Be sure to monitor important items that the CHT depends on in order to be healthy. You should alert when any of these are close to their maximum (disk space) or minimum (days left of valid TLS certificate):

* Domain expiration with registrar
* TLS certificate expiration 
* Disk & swap space
* CPU utilization
* Memory utilization
* Network utilization
* Process count
* OS Uptime

## Inside the CHT

The [monitoring API]({{< relref "apps/reference/api#get-apiv2monitoring" >}}) was added in 3.9.0 and does not require any authentication and so can easily be used with third party tools as they do not need a CHT user account.

All metrics need to be monitored over time so that you can easily see longitudinal patterns when debugging an outage or slow down. 

### Specific of monitoring

#### Explosive Growth

Many of the values in the monitoring API do not mean much in isolation. For example if an instance has 10,714,278 feedback docs, is that bad?  If it's years old and has thousands of users, then this is normal.  If it is 4 months old and has 100 users, this is a dire problem! 

You should monitor these metrics for unexpected growth as measured by percent change over 24 hours. Ideally this can be subjectively calculated when it is more than 5% growth than the prior day.  They're marked as `growth` in the table below.

#### Non-Zero Values

Other values should always be zero, and you should alert when they are not. You may opt to alert only when they are non-zero for more than 24 hours. These are marked as `non-zero` in the table below.

#### Zero or Near Zero Values

Finally, these values should always be _not_ zero, and you should alert when are zero or very close to it.  You may opt to alert only when they are zero for more than 24 hours. They're marked with `zero` below.

#### Elements, types and samples

The names below are extrapolated from the paths in the JSON returned by the API and should be easy to find when viewing the Monitoring API URL on your CHT instance:

Name | Type | Example Value
--|--|--
Conflict Count | `growth` | 23,318
CouchDB Medic Doc Count | `growth` | 16,254,271
CouchDB Medic Fragmentation | `growth` | 1.4366029665729645
CouchDB Sentinel Doc Count | `growth` | 15,756,449
CouchDB Sentinel Fragmentation | `growth` | 2.388733774539664
CouchDB Users Doc Count | `growth` | 535
CouchDB Users Fragmentation | `growth` | 2.356411021364134
CouchDB Users Meta Doc Count | `growth` | 10,761,549
Feedback Count | `growth` | 10,714,368
Messaging Outgoing State Due | `growth` | 3,807
Messaging Outgoing State Failed | `non-zero` | 0
Outbound Push Backlog | `non-zero` | 0
Sentinel Backlog | `non-zero` | 0
Date Uptime | `zero` | 1,626,508.148


## Grafana and Prometheus 

Medic maintains an opinionated configuration of [Prometheus](https://prometheus.io/) (including [json_exporter](https://github.com/prometheus-community/json_exporter)) and [Grafana](https://grafana.com/grafana/) which can easily be deployed using Docker. It is supported on CHT 3.12 and later, including CHT 4.x.  By using this solution a CHT deployment can easily get longitudinal monitoring and push alerts using Email, Slack or other mechanisms.  All tools are open source and have no licensing fees.

The solution provides both an overview dashboard as well as a detail dashboard.  Here is a portion of the overview dashboard:

![Screenshot of Grafana Dashboard showing data from Prometheus](monitoring.and.alerting.screenshot.png)

[Prometheus supports](https://prometheus.io/docs/concepts/metric_types/) four metric types: Counter, Gauge, Histogram, and Summary.  Currently, the CHT only provides Counter and Gauge type metrics. When building panels for Grafana dashboards, [Prometheus Functions](https://prometheus.io/docs/prometheus/latest/querying/functions/) can be used to manipulate the metric data. Refer to the [Grafana Documentation](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/) for best practices on building dashboards.


### Prerequisites

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- URL(s) of the CHT instance(s) 

### Setup

Pre-provisioned dashboards are included in the `CHT` folder in the Grafana UI should not be updated directly. 

These instructions have been tested against Ubuntu, but should work against any OS that meets the prerequisites. They follow a happy path assuming you need to only set a secure password and specify the URL(s) to monitor:

1. Run the following commands to clone this repository, initialize your `.env` file, create a secure password and create your data directories:

    ```sh
    cd ~
    git clone https://github.com/medic/cht-monitoring.git
    cd cht-monitoring
    cp cht-instances.example.yml cht-instances.yml
    cp grafana/grafana.example.ini grafana/grafana.ini
    mkdir -p grafana/data && mkdir  -p prometheus/data 
    apt install -y wamerican
    cp .env.example .env
    password=$(shuf -n7 /usr/share/dict/words --random-source=/dev/random | tr '\n' '-' | tr -d "'" | cut -d'-' -f1,2,3,4,5,6,7)
    sed -i -e "s/password/$password/g" .env
    echo;echo "Setup complete! To log into Grafana in the browser:";echo 
    echo "    username: medic"
    echo "    password: ${password}";echo
    ```
   Note that in step 4 below you'll need the username and password which is printed after you run the above command.

2. Edit the `cht-instances.yml` file to have the URLs of your CHT instances. You may include as many URLs of CHT instances as you like. To preserve data consistency parameters in this file should NOT be adjusted after it is initially set. Be sure to not include a trailing slash (`/`).

   Here is an example:

    ```yml
    - targets:
      - https://subsub.sub.example.com
      - https://cht.domain.com
      - https://website.org
    ```
3. Run the following command to deploy the stack:
    
    ```sh
    cd ~/cht-monitoring
    docker compose up -d
    ```

4. Grafana is available at [http://localhost:3000](http://localhost:3000). See the output from step 1 for your username and password.

If you would like to do more customizing of your deployment, see ["Addition Configuration"](#additional-configuration).

### Upgrading

Before upgrading, you should back up both your current configuration settings and your Prometheus time-series data.

#### Prometheus, Grafana and JSON Exporter

To upgrade these dependencies, update the version numbers set in your `.env` file (or leave them set to `latest`).  Then run the following commands:

```shell
docker compose pull
docker compose up -d
```

#### CHT Monitoring Config

When you see a new version in the [GitHub repository](https://github.com/medic/cht-monitoring), first review the release notes and upgrade instructions. Then, run the following commands to deploy the new configuration:

1. Note the version number to derive the branch to pull.  For example,  `1.1.0` would be `1.1.x`
2. Run this command to update your instance and restart it. Be sure to replace `BRANCH_NAME` with the value from the first step:
   ```shell
   cd ~/cht-monitoring
   git fetch
   git checkout BRANCH_NAME
   ```shell

### Additional Configuration

#### Prometheus Retention and Storage

By default, historical monitoring data will be stored in Prometheus (`PROMETHEUS_DATA` directory) for 60 days (configurable by `PROMETHEUS_RETENTION_TIME`). A longer retention time can be configured to allow for longer-term analysis of the data.  However, this will increase the size of the Prometheus data volume.  See the [Prometheus documentation](https://prometheus.io/docs/prometheus/latest/storage/) for more information.

Local storage is not suitable for storing large amounts of monitoring data. If you intend to store multiple years worth of metrics, you should consider integrating Prometheus with a [Remote Storage](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage/).

#### Alerts

This configuration includes number of pre-provisioned alerts.  Additional alerting rules (and other contact points) can be set in the Grafana UI.  

See the both Grafana [high level alert Documentation](https://grafana.com/docs/grafana/latest/alerting/) and  [provisioning alerts in the UI](https://grafana.com/docs/grafana/latest/alerting/set-up/provision-alerting-resources/file-provisioning/#provision-alert-rules) for more information on how to edit or remove these provisioned alerts.

Additionally, you can configure where these alerts are sent.  Two likely options are Email and Slack.

##### Email

To support sending email alerts from Grafana, you must update the `smtp` section of your `grafana/grafana.ini` file with your SMTP server configuration.  Ten, in the web interface, add the desired recipient email addresses in the `grafana-default-email` contact point settings.

##### Slack

Slack alerts can be configured within the Grafana web GUI for the specific panel you would like to alert on.  Find the panel you want to alert on and edit it.  In the bottom half of the screen, choose the "Alert" tab. Then click "Create alert fule from this panel".

### Configuration Reference 

#### Environment Variables

All the variables in the `.env` file:

| Name                        | Default                         | Description                                                                                            |
|-----------------------------|---------------------------------|--------------------------------------------------------------------------------------------------------|
| `GRAFANA_ADMIN_USER`        | `medic`                         | Username for the Grafana admin user                                                                    |
| `GRAFANA_ADMIN_PASSWORD`    | `password`                      | Password for the Grafana admin user                                                                    |
| `GRAFANA_VERSION`           | `latest`                        | Version of the `grafana/grafana-oss` image                                                             |
| `GRAFANA_PORT`              | `3000`                          | Port on the host where Grafana will be available                                                       |
| `GRAFANA_BIND`              | `127.0.0.1`                     | Interface Grafana will bind to.  Change to `0.0.0.0` if you want to expose to all interfaces.  |
| `GRAFANA_DATA`              | `./grafana/data`                | The host directory where Grafana data will be stored                                                   |
| `GRAFANA_PLUGINS`           | `grafana-discourse-datasource`  | Comma separated list of plugins to install (e.g: `grafana-clock-panel,grafana-simple-json-datasource`) |
| `JSON_EXPORTER_VERSION`     | `latest`                        | Version of the `prometheuscommunity/json-exporter` image                                               |
| `PROMETHEUS_VERSION`        | `latest`                        | Version of the `prom/prometheus` image                                                                 |
| `PROMETHEUS_DATA`           | `./prometheus/data`             | The host directory where Prometheus data will be stored                                                |
| `PROMETHEUS_RETENTION_TIME` | `60d`                           | Length of time that Prometheus will store data (e.g. `15d`, `6m`, `1y`)                                |


#### CHT Metrics

All CHT metrics in Prometheus:

| OpenMetrics name                      | Type    | label(s)                                          | Description                                                                                                                                                                                                     |
|---------------------------------------|---------|---------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `cht_version`                         | N/A     | `app`, `node`, `couchdb`                          | Version information for the CHT instance (recorded in labels)                                                                                                                                                   |
| `cht_conflict_count`                  | Gauge   |                                                   | Number of doc conflicts which need to be resolved manually.                                                                                                                                                     |
| `cht_connected_users_count`           | Gauge   |                                                   | Number of users that have connected to the api recently. By default the time interval is 7 days. Otherwise it is equal to the connected_user_interval parameter value used when making the /monitoring request. |
| `cht_couchdb_doc_total`               | Counter | `medic`, `sentinel`, `medic-users-meta`, `_users` | The number of docs in the db.                                                                                                                                                                                   |
| `cht_couchdb_doc_del_total`           | Counter | `medic`, `sentinel`, `medic-users-meta`, `_users` | The number of deleted docs in the db.                                                                                                                                                                           |
| `cht_couchdb_fragmentation`           | Gauge   | `medic`, `sentinel`, `medic-users-meta`, `_users` | The fragmentation of the db, lower is better, “1” is no fragmentation.                                                                                                                                          |
| `cht_couchdb_update_sequence`         | Counter | `medic`, `sentinel`, `medic-users-meta`, `_users` | The number of changes in the db.                                                                                                                                                                                |
| `cht_date_current_millis`             | Counter |                                                   | The current server date in millis since the epoch, useful for ensuring the server time is correct.                                                                                                              |
| `cht_date_uptime_seconds`             | Counter |                                                   | How long API has been running.                                                                                                                                                                                  |
| `cht_feedback_total`                  | Counter |                                                   | Number of feedback docs created usually indicative of client side errors.                                                                                                                                       |
| `cht_messaging_outgoing_last_hundred` | Gauge   | `group`, `status`                                 | Counts of last 100 messages that have received status updates.                                                                                                                                                  |
| `cht_messaging_outgoing_total`        | Counter | `status`                                          | Counts of the total number of messages.                                                                                                                                                                         |
| `cht_outbound_push_backlog_count`     | Gauge   |                                                   | Number of changes yet to be processed by Outbound Push.                                                                                                                                                         |
| `cht_replication_limit_count`         | Gauge   |                                                   | Number of users that exceeded the replication limit of documents.                                                                                                                                               |
| `cht_sentinel_backlog_count`          | Gauge   |                                                   | Number of changes yet to be processed by Sentinel.                                                                                                                                                              |

