---
title: "Adding TLS certificates in CHT 4.x"
linkTitle: "TLS Certificates"
weight: 100
description: >
    How to add TLS certificates to your docker hosted CHT 4.x instance
---

By default, CHT 4.x will create a self-signed certificate for every deployment.  These instructions are for changing to either a pre-existing certificate or automatically creating and renewing a [Certbot](https://certbot.eff.org/) based certificate using [ACME](https://acmeclients.com/), like [Let's Encrypt](https://letsencrypt.org/).

This guide assumes you've already met the [hosting requirements]({{< relref "apps/guides/hosting/requirements" >}}), specifically around Docker being installed.

## Pre-existing certificate

To load your certificates into your CHT instance, we'll be creating an interstitial container called `cht-temp-tls` which will enable you to copy your local certificate files into the native docker volume.

### Prerequisites

You have two files locally on your workstation in the directory you're currently in:

   * `key.pem` - the private key for your TLS certificate
   * `chain.pem` - both the public and any interstitial keys concatenated into one file

Also, be sure you have started your CHT instance once and all your volumes are created.  

### Loading the certificate

{{% alert title="Note" %}}
`docker compose` should work, but you may need to use the older style `docker-compose` if you get an error `docker: 'compose' is not a docker command`.
{{% /alert %}}

1. Find the name of your `cht-ssl` volume with this call:

   ```shell
   docker volume ls --filter "name=cht-ssl"
   ```
   It is very likely that `cht_cht-ssl` is the name of our `cht-ssl` volume.
2. Using the volume name found in step 1, start a container called `temp` which allow us to copy files into the docker volume:

    ```shell
   docker run -d --rm --name temp -v cht_cht-ssl:/etc/nginx/private/ alpine tail -f /dev/null
   ```
3. Copy the two pem files into the volume via the temporary container:
   ```
   docker cp key.pem temp:/etc/nginx/private/.
   docker cp cert.pem temp:/etc/nginx/private/.
   ```
4. Stop the `temp` container: 
   ```shell
   docker kill temp
   ```

Your certificates are now safely stored in the native docker volume. Restart your CHT instance the way you started it, being sure to set the correct `CERTIFICATE_MODE` and `SSL_VOLUME_MOUNT_PATH` per the [prerequisites](#prerequisites).

## Certbot certificate

_This Feature available on CHT 4.2.0 or later_

If you have a deployment with a static, public IP and a domain name pointing to that IP, you can have Certbot automatically create free TLS certificates by using [their Docker image](https://hub.docker.com/r/certbot/certbot/). 

Assuming your CHT instance is running with the default self signed cert. Be sure to change `cht.example.com` to your domain first though:

1. Create certbot compose and env files by copying and pasting this code:
   ```shell
   mkdir -p /home/ubuntu/cht/certbot
   cd /home/ubuntu/cht/certbot
   cat > docker-compose.yml << EOF
   version: '3.9'
   services:
     certbot:
         container_name: certbot
         hostname: certbot
         image: certbot/certbot
         volumes:
           - ssl-storage:/etc/nginx/private/
           - ssl-storage:/var/log/letsencrypt/
         command: certonly --debug --deploy-hook /etc/nginx/private/deploy.sh --webroot -w /etc/nginx/private/certbot/ --domain \$DOMAIN --non-interactive --key-type rsa --agree-tos --register-unsafely-without-email \$STAGING
   volumes:
     ssl-storage:
         name: \${CHT_SSL_VOLUME}
         external: true
   EOF
   
   cat > .env << EOF
   DOMAIN=cht.example.com
   STAGING=
   CHT_SSL_VOLUME=cht_cht-ssl
   TZ=America/Whitehorse
   EOF
   ```
2. Generate certs:
   ```shell
   cd /home/ubuntu/cht/certbot
   docker compose up
   ```
3. Run this command to find the name of your CHT ngnix container:
   ```shell
   docker ps --filter "name=nginx"  --format '{{ .Names }}'
   ```
4. Assuming the name is `cht_nginx_1` from the prior step, reload your `nginx` config with this command:
    ```shell
    docker exec -it cht_nginx_1 nginx -s reload
    ```
5. Attempt to renew your certificates once a week by adding this cronjob via `crontab -e`.  Certbot will only renew them as needed:
   ```shell
   0 0 * * 0 cd /home/ubuntu/cht/certbot&&docker compose up
   ```
