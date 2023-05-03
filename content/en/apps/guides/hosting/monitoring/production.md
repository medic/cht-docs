---
title: "Production CHT Watchdog"
linkTitle: "Production"
weight: 200
description: >
   Production considerations for CHT Watchdog
---

{{% pageinfo %}} 
These instructions apply to both CHT 3.x (beyond 3.12) and CHT 4.x.  
{{% /pageinfo %}}

## What it means to run in production

When you run CHT Watchdog in production, and it is publicly accessible on the Internet, and has mission-critical data on it, you should take extra precautions around security and backup.  This mainly consists of:

* using TLS for all HTTP connections 
* using VPN or SSH for insecure protocols like `ssl=false` in Postgres 
* ensuring if the server were to fail, you can recover the data


This guide assumes you have already [set up TLS]({{< relref "apps/guides/hosting/4.x/adding-tls-certificates" >}}) on your CHT instance and have gone through [the Setup steps]({{< relref "apps/guides/hosting/monitoring/setup" >}}) to deploy an instance of CHT Monitoring on server with a static IP and DNS entry, `monitor.example.com` for example.

## Monitoring over TLS
All monitoring should happen over TLS.  This means the `cht-instances.yml` file should have all the URLs in it start with ` - https`.  

## Accessing Grafana over TLS

By default, the `docker-compose.yml` has the service bind to `127.0.0.1`.  This means if you deploy it on a remote server you can not access Grafana's web UI because you are not on the localhost.  The best solution to expose it to the Internet is to use a reverse proxy.  Medic recommends using [Caddy](https://caddyserver.com/) for this, but any reverse proxy will suffice. A big benefit with Caddy is that with just two files you ensure all traffic, and critically, all login credentials, are always encrypted when being sent and it handles all TLS certificate management tasks for you.

### Reverse Proxy and Docker files

Assuming you have the DNS entry of `monitor.example.com` pointing to your server, you would create the `Caddyfile` file with this code. 

```
cat > /root/Caddyfile << EOF
monitor.example.com {
    reverse_proxy grafana:3000
}
EOF
```

Using the awesome secure defaults of Caddy, this file will tell Caddy to:
1. Create a free certificate for `monitor.example.com` using [Let's Encrypt](https://letsencrypt.org/) (and renew it!)
2. Redirect any requests to `HTTP` to go to the `HTTPS` port
3. Reverse proxy all traffic to the `grafana` docker instance.  

The reverse proxy will only work if the Caddy container is on the same docker network as Grafana.  That's where the  `caddy-compose.yml` file comes in, specifically using the `cht-monitoring-net` network.  Create the file with this code

```
cat > /root/caddy-compose.yml << EOF
version: "3.9"
services:
  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /root/Caddyfile:/etc/caddy/Caddyfile
    networks:
      - cht-monitoring-net
EOF
```

### Running

To start the reverse proxy, us the following command.  Note that on first run it will provision your certificates:

```
cd ~/cht-monitoring
docker compose -f docker-compose.yml -f ../caddy-compose.yml up -d
```

Because both the CHT Monitoring and Caddy compose files have the `restart: unless-stopped` setting, the services will start when the server first boots.

### Upgrades

Upgrades can be done along with upgrades to your CHT Monitoring docker images:

```shell
cd ~/cht-monitoring
docker compose -f docker-compose.yml -f ../caddy-compose.yml pull
docker compose -f docker-compose.yml -f ../caddy-compose.yml up -d
```

## Backup

When you deployed your monitoring instance, you created two directories: 

* `~/cht-monitoring/grafana/data`
* `~/cht-monitoring/prometheus/data`

These are the only directories you need to back up.  Whether you use something as simple as `zip` + `scp` + `cron` or a more full-featured solution like [borgbackup](https://www.borgbackup.org/) or [AWS Data Lifecycle Manager](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-lifecycle.html), be sure you follow [the 3-2-1 backup rule](https://en.wikipedia.org/wiki/Backup#Storage):

> The 3-2-1 rule can aid in the backup process. It states that there should be at least 3 copies of the data, stored on 2 different types of storage media, and one copy should be kept offsite, in a remote location
