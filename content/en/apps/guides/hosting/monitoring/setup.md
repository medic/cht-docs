---
title: "Grafana and Prometheus Setup"
linkTitle: "Setup"
description: >
    Setting up Grafana and Prometheus with the CHT
---

{{% pageinfo %}} 
These instructions apply to both CHT 3.x (beyond 3.12) and CHT 4.x.  
{{% /pageinfo %}}

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

These instructions have been tested against Ubuntu, but should work against any OS that meets the prerequisites. They follow a happy path assuming you need to only set a secure password and specify the URL(s) to monitor:

1. Run the following commands to clone this repository, initialize your `.env` file, create a secure password and create your data directories:

    ```sh
    cd ~
    git clone https://github.com/medic/cht-monitoring.git
    cd cht-monitoring
    cp cht-instances.example.yml cht-instances.yml
    cp grafana/grafana.example.ini grafana/grafana.ini
    mkdir -p grafana/data && mkdir  -p prometheus/data 
    sudo apt install -y wamerican  # ensures /usr/share/dict/words is present for shuf call below 
    cp .env.example .env
    password=$(shuf -n7 /usr/share/dict/words --random-source=/dev/random | tr '\n' '-' | tr -d "'" | cut -d'-' -f1,2,3,4,5,6,7)
    sed -i -e "s/password/$password/g" .env
    echo;echo "Initial project structure created! To log into Grafana in the browser:";echo 
    echo "    username: medic"
    echo "    password: ${password}";echo
    ```
   Note that in step 4 below you'll need the username and password which is printed after you run the above command.

2. Edit the `cht-instances.yml` file to have the URLs of your CHT instances. You may include as many URLs of CHT instances as you like.

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

Before upgrading, you should back up both your current configuration settings as well as your Prometheus/Grafana data directories.

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
   docker compose pull
   docker compose down
   docker compose up -d --remove-orphans
   ```shell

### Additional Configuration

#### Prometheus Retention and Storage

By default, historical monitoring data will be stored in Prometheus (`PROMETHEUS_DATA` directory) for 60 days (configurable by `PROMETHEUS_RETENTION_TIME`). A longer retention time can be configured to allow for longer-term analysis of the data.  However, this will increase the size of the Prometheus data volume.  See the [Prometheus documentation](https://prometheus.io/docs/prometheus/latest/storage/) for more information.

Local storage is not suitable for storing large amounts of monitoring data. If you intend to store multiple years worth of metrics, you should consider integrating Prometheus with a [Remote Storage](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage/).

#### Alerts

This configuration includes number of pre-provisioned alerts.  Additional alerting rules (and other contact points) can be set in the Grafana UI.

See both the Grafana [high level alert Documentation](https://grafana.com/docs/grafana/latest/alerting/) and [provisioning alerts in the UI](https://grafana.com/docs/grafana/latest/alerting/set-up/provision-alerting-resources/file-provisioning/#provision-alert-rules) for more information on how to edit or remove these provisioned alerts.

Additionally, you can configure where these alerts are sent.  Two likely options are Email and Slack.

##### Email

To support sending email alerts from Grafana, you must update the `smtp` section of your `grafana/grafana.ini` file with your SMTP server configuration.  Then, in the web interface, add the desired recipient email addresses in the `grafana-default-email` contact point settings.

##### Slack

Slack alerts can be configured within the Grafana web GUI for the specific rules you would like to alert on.

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
