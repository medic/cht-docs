---
title: "Production Grafana and Prometheus"
linkTitle: "Production"
weight: 200
description: >
   Production considerations for Grafana and Prometheus with the CHT
---

{{% pageinfo %}} 
These instructions apply to both CHT 3.x (beyond 3.12) and CHT 4.x.  
{{% /pageinfo %}}

## What it means to run in production

When you run your monitoring and alerting in production, and it is publicly accessible on the Internet and has data mission critical data on it, you should take extra precautions around security and backup.  This mainly consists of using TLS for all HTTP connections and security tunnels, either VPN or SSH, to connect to the CHT instance(s) you're monitoring and ensuring if the server were to fail, you can recover the data.

This guide assumes you have already [set up TLS]({{< relref "apps/guides/hosting/4.x/adding-tls-certificates" >}}) on your CHT instance.

## Monitoring over TLS
All monitoring should happen over TLS.  This means the `cht-instnces.yml` file should have all the URLs in it start with ` - https`.  

## Accessing Grafana over TLS
By default, the `docker-compose.yml` has the service bind to `127.0.0.1`.  This means if you deploy it on a server you can not access it.  The best solution to expose it to the internet is to use a reverse proxy.  Medic recommends using [Caddy](https://caddyserver.com/) for this. With just two files you ensure all traffic, and critically, all login credentials, are always encrypted when being sent. 

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
1. Create a free certificate for `monitor.example.com` using Let's Encrypt (and renew it!)
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

## Backup

TK
