---
title: "CHT Watchdog Setup"
linkTitle: "Setup"
weight: 100
description: >
   Setting up Grafana and Prometheus with the CHT
relatedContent: >  
   technical-overview/architecture
   technical-overview/architecture/cht-watchdog
aliases:  
  - /building/guides/hosting/monitoring/setup
  - /apps/guides/hosting/monitoring/setup
---

Medic maintains CHT Watchdog which is an opinionated configuration of [Prometheus](https://prometheus.io/) (including [json_exporter](https://github.com/prometheus-community/json_exporter)) and [Grafana](https://grafana.com/grafana/) which can easily be deployed using Docker. It is supported on CHT 3.12 and later, including CHT 4.x.  By using this solution a CHT deployment can easily get longitudinal monitoring and push alerts using Email, Slack or other mechanisms.  All tools are open source and have no licensing fees.

The solution provides both an overview dashboard as well as a detail dashboard.  Here is a portion of the overview dashboard:

{{< figure src="monitoring.and.alerting.screenshot.png" link="monitoring.and.alerting.screenshot.png" caption="Screenshot of Grafana Dashboard showing data from Prometheus" >}}

[Prometheus supports](https://prometheus.io/docs/concepts/metric_types/) four metric types: Counter, Gauge, Histogram, and Summary.  Currently, the CHT only provides Counter and Gauge type metrics. When building panels for Grafana dashboards, [Prometheus Functions](https://prometheus.io/docs/prometheus/latest/querying/functions/) can be used to manipulate the metric data. Refer to the [Grafana Documentation](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/) for best practices on building dashboards.


### Prerequisites

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- URL(s) of the CHT instance(s)

> [!WARNING]
> Always run Watchdog on a different server than the CHT Core.  This ensures Watchdog doesn't fail if the CHT Core server fails and alerts will always be sent. The instructions assume you're connecting over the public Internet and no special VPN or routing is required.

### Setup

These instructions have been tested against Ubuntu, but should work against any OS that meets the prerequisites. They follow a happy path assuming you need to only set a secure password and specify the URL(s) to monitor:

1. Run the following commands to clone this repository, initialize your `.env` file, create a secure password and create your data directories:

    ```sh
    cd ~
    git clone https://github.com/medic/cht-watchdog.git
    cd cht-watchdog
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
   If you're using docker-compose v2.x, it doesn't support relative paths and you'll have to edit your `.env` file to update paths to absolute path.

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
    cd ~/cht-watchdog
    docker compose up -d
    ```

4. Grafana is available at [http://localhost:3000](http://localhost:3000). See the output from step 1 for your username and password.

If you would like to do more customizing of your deployment, see ["Additional Configuration"](#additional-configuration).

### Upgrading

Before upgrading, you should back up both your current configuration settings as well as your Prometheus/Grafana data directories.

#### Prometheus, Grafana and JSON Exporter

To upgrade these dependencies, update the version numbers set in your `.env` file (or leave them set to `latest`).  Then run the following commands:

```shell
docker compose pull
docker compose up -d
```

#### CHT Watchdog

When you see a new version in the [GitHub repository](https://github.com/medic/cht-watchdog), first review the release notes and upgrade instructions. Then, run the following commands to deploy the new configuration (be sure to replace `TAG` with the tag name associated with the release (e.g. `1.1.0`)):

```shell
cd ~/cht-watchdog
git fetch
git -c advice.detachedHead=false checkout TAG
docker compose pull
docker compose down
docker compose up -d --remove-orphans
```

### Additional Configuration

When making any changes to your CHT Watchdog configuration (e.g. adding/removing instances from the `cht-instances.yml` file) make sure to restart all services to pick up the changes:

```shell
cd ~/cht-watchdog
docker compose down
docker compose up -d
``` 

#### CHT Sync Data (Local)

With the [release of 1.1.0](https://github.com/medic/cht-watchdog/releases/tag/1.1.0), Watchdog now supports easily ingesting [CHT Sync]({{< relref "/hosting/analytics" >}}) data read in from a Postgres database (supports Postgres `>= 9.x`).

1. Copy the example config file, so you can add the correct contents in them:
   ```shell
   cd ~/cht-watchdog
   cp exporters/postgres/sql_servers_example.yml exporters/postgres/sql_servers.yml
   ```
2. Edit `sql_servers.yml` you just created and add your target postgres connection URL. For example, if your postgres server was `db.example.com`, your user was `db_user` and your password was `db_password`,  the config would be:
   ```yaml
   - targets:
      "db-example-com": 'postgres://db_user:db_password@db.example.com:5432/cht?sslmode=disable' # //NOSONAR - password is safe to commit
   ```
   You may add as many targets as you would like here - one for each CHT Core instance in your `cht-instances.yml` file. Be sure to match the key (`db-example-com` in this example) to the exact value defined in your `cht-instances.yml` file while ensuring the entry is unique.
4. Start your instance up, being sure to include both the existing `docker-compose.yml` and the `docker-compose.postgres-exporter.yml` file:

   ```shell
   cd ~/cht-watchdog
   docker compose -f docker-compose.yml -f exporters/postgres/compose.yml up -d
   ```

> [!WARNING]
> Always run this longer version of the `docker compose` command which specifies both compose files for all future [upgrades](#upgrading).

#### CHT Sync Data (Remote)

While not the default setup, and not what most deployments need, you may want to set up a way to monitor CHT Sync data without sharing any Postgres credentials. Instead of sharing credentials, you expose an HTTP endpoint that requires no login or password.  Of course, similar to  CHT Core's [Monitoring API]({{< relref "building/reference/api#get-apiv2monitoring" >}}), this endpoint should be configured to not share sensitive information (since it will be publicly accessible).

This section has two steps. The first is to expose the password-less metrics endpoint and the second is to scrape it with Prometheus.   Here's documentation on how to set up a Kubernetes or Docker endpoint for CHT Sync.

##### Postgres exporter on Kubernetes
1. Uncomment the `metrics_exporter` value in your `values.yaml` file and make sure `enabled` is set to `true`.
1. Expose the metrics endpoint to the internet. This can be done by setting the `service.type` to `LoadBalancer` or `NodePort` in your `values.yaml` file.

Continue on to [set up the scrape on Watchdog](#set-up-watchdog-to-scrape-the-sql-exporter).

##### Postgres exporter on Docker
 
These commands set up a SQL Exporter and should be run on your Postgres server:

1. Clone this repo: `git clone git@github.com:medic/cht-watchdog.git` and `cd` into `cht-watchdog`
1. Copy `exporters/postgres/sql_servers_example.yml` to `exporters/postgres/sql_servers.yml`
1. Edit the new `exporters/postgres/sql_servers.yml` file to have the correct credentials for your server. You need to update the `USERNAME` and `PASSWORD`.   You may need to update the IP address and port also, but likely the default values are correct.
1. Copy `.env.example` to `.env` 
1. In the new `.env` file, edit `SQL_EXPORTER_IP` to be the public IP of the Posgtres server
1. Start the service with these two compose files*:
   ```shell
   docker compose --env-file .env  -f exporters/postgres/compose.yml -f exporters/postgres/compose.stand-alone.yml up -d
   ```
1. Verify that you see the SQL Exporters metrics:  If `SQL_EXPORTER_IP` was set to `10.220.249.15`, then this would be: `http://10.220.249.15:9399/metrics`. The last line starting with `up{job="db_targets"...` should end in a `1` denoting the system is working. If it ends in `0` - check your docker logs for errors.

Continue on to [set up the scrape on Watchdog](#set-up-watchdog-to-scrape-the-sql-exporter).

##### Set up Watchdog to scrape the SQL Exporter

No matter which way you set up your SQL exporter, follow these steps to tell your Watchdog instance to scrape the new endpoint.

1. On your watchdog instance, create a custom scrape definition file: `cp exporters/postgres/scrape.yml ./exporters/postgres/scrape-custom.yml`
1. Edit `scrape-custom.yml` so that it has the ip address of `SQL_EXPORTER_IP` from step 7 above.  If that was `10.220.249.15`, then you file would look like:
   ```yaml
    scrape_configs:
      - job_name: sql_exporter
        static_configs:
          - targets: ['10.220.249.15:9399']
   ```
1. Finally, on your watchdog instance, start (or restart) your server including the `compose.scrape-only.yml` compose file:
    ```bash
    docker compose --env-file .env  -f exporters/postgres/compose.yml -f exporters/postgres/compose.scrape-only.yml up -d
    ```


\* _The `compose.stand-alone.yml` and `compose.scrape-only.yml` compose files override some services.  This is done so that no manual edits are needed to any compose files._ 


#### Prometheus Retention and Storage

By default, historical monitoring data will be stored in Prometheus (`PROMETHEUS_DATA` directory) for 60 days (configurable by `PROMETHEUS_RETENTION_TIME`). A longer retention time can be configured to allow for longer-term analysis of the data.  However, this will increase the size of the Prometheus data volume.  See the [Prometheus documentation](https://prometheus.io/docs/prometheus/latest/storage/) for more information.

Local storage is not suitable for storing large amounts of monitoring data. If you intend to store multiple years worth of metrics, you should consider integrating Prometheus with a [Remote Storage](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage/).

#### Alerts

This configuration includes number of pre-provisioned alert rules.  Additional alerting rules (and other contact points) can be set in the Grafana UI.

See both the Grafana [high level alert Documentation](https://grafana.com/docs/grafana/latest/alerting/) and [provisioning alerts in the UI](https://grafana.com/docs/grafana/latest/alerting/set-up/provision-alerting-resources/file-provisioning/#provision-alert-rules) for more information.

##### Deleting provisioned alert rules

The provisioned alert rules shipped with CHT Watchdog are intended to be the generally applicable for most CHT deployments. However, not all the alert rules will necessarily be useful for everyone. If you would like to delete any of the provisioned alert rules, you can do so with the following steps:

1. In Grafana, navigate to "Alerting"  and then  "Alert Rules"  and click the eye icon for the rule you want to delete.  Copy the `Rule UID` which can be found on the right and is a 10 character value like `mASYtCQ2j`.
2. Create a `delete-rules.yml` file

    ```shell
    cd ~/cht-watchdog
    cp grafana/provisioning/alerting/delete-rules.example.yml grafana/provisioning/alerting/delete-rules.yml
    ```

3. Update your new `delete-rules.yml` file to include the Rule UID(s) of the alert rule(s) you want to delete 
4. Restart Grafana

    ```shell
    docker compose restart grafana
    ```

If you ever want to re-enable the alert rules you deleted, you can simply remove the Rule UID(s) from the `delete-rules.yml` file and restart Grafana again.

##### Modifying provisioned alert rules

The provisioned alert rules cannot be modified directly. Instead, you can copy the configuration of a provisioned alert into a new custom alert with the desired changes. Then, remove the provisioned alert.

1. Open the alert rule you would like to modify in the Grafana alert rules UI and select the "Copy" button.
2. Update the copied alert rule with the desired changes and save it into a new Evaluation group.
3. [Remove the provisioned alert]({{< relref "#deleting-provisioned-alert-rules" >}}).

##### Configuring Contact Points

Grafana supports sending alerts via a number of different methods. Two likely options are Email and Slack.

###### Email

To support sending email alerts from Grafana, you must update the `smtp` section of your `grafana/grafana.ini` file with your SMTP server configuration. Then, in the web interface, add the desired recipient email addresses in the `grafana-default-email` contact point settings.

###### Slack

Slack alerts can be configured within the Grafana web GUI for the specific rules you would like to alert on.


### Environment Variables

See the [example .env file](https://github.com/medic/cht-watchdog/blob/main/.env.example) for a list of all environment variables that can be set.
