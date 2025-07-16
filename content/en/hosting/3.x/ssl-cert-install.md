---
title: "SSL Cert Install in CHT 3.x"
linkTitle: "SSL Cert Install"
weight: 4
description: >
  SSL Cert Installation for Self-Hosting Setups using Medic OS/3.x
relatedContent: >
  hosting/3.x/self-hosting
aliases:
  - /apps/guides/hosting/3.x/ssl-cert-install
  - /apps/guides/hosting/ssl-cert-install
---

{{< callout type="warning" >}}
  CHT 3.x is [End-of-Life](/releases/#supported-versions) and no longer supported. 
{{< /callout >}}


## Requirements
- Installed CHT-Core 3.x via either [Self Hosted](/hosting/3.x/self-hosting), [EC2](/hosting/3.x/ec2-setup-guide) or [Local Setup](/building/local-setup), but must use `docker compose`.
- Your own SSL certifications like Let's Encrypt.

## Copy certs into medic-os container

On your server  copy the `.crt` and `.key` files to the `medic-os` container. The existing self signed `.crt` and `.key` files will be overwritten:

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
