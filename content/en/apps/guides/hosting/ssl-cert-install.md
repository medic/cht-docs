---
title: "SSL Cert Install"
linkTitle: "SSL Cert Install"
weight: 
description: >
  SSL Cert Installation for Self-Hosting Setups
relevantLinks: > 
relatedContent: >
  apps/guides/hosting/self-hosting
---


## Requirements
- Installed CHT-Core 3.x via either [Self Hosted]({{< relref "apps/guides/hosting/self-hosting" >}}), [EC2]({{< relref "apps/guides/hosting/ec2-setup-guide" >}}) or [Local Setup]({{< relref "apps/tutorials/local-setup" >}}), but must use `docker-compose`.
- Your own SSL certifications like Let's Encrypt.

## Copy certs into medic-os container

On your server  copy the `.crt` and `.key` files to the `medic-os` container. The existing self signed `.crt` and `.key` files will be overwitten:

```bash
sudo docker cp /path/to/ssl.crt medic-os:/srv/settings/medic-core/nginx/private/default.crt
sudo docker cp /path/to/ssl.key medic-os:/srv/settings/medic-core/nginx/private/default.key
```

## Restart services

Now that the `.crt` and `.key` files are in place, restart `nginx` in the `medic-os` container with:

```bash
docker exec -it medic-os /boot/svc-restart medic-core nginx
```

## View Nginx Logs

To troubleshoot any problems with the new certificates, after running `docker exec -it medic-os bash`, the `nginx` log files can be found in `/srv/storage/medic-core/nginx/logs/`, including:
* access.log 
* error-ssl.log 
* error.log 
* startup.log