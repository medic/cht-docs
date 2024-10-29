---
title: "Adding TLS certificates in CHT 4.x"
linkTitle: "TLS Certificates"
weight: 40
aliases:
  - /apps/guides/hosting/4.x/adding-tls-certificates
  - /hosting/4.x/adding-tls-certificates
description: >
    How to add TLS certificates to your docker hosted CHT 4.x instance
---

By default, CHT 4.x will create a self-signed certificate for every deployment.  These instructions are for changing to either a pre-existing certificate or automatically creating and renewing a [Certbot](https://certbot.eff.org/) based certificate using [ACME](https://acmeclients.com/), like [Let's Encrypt](https://letsencrypt.org/).

This guide assumes you've already met the [hosting requirements]({{< relref "hosting/requirements" >}}), specifically around Docker being installed.

## Pre-existing certificate

To load your certificates into your CHT instance, we'll be creating an interstitial container called `cht-temp-tls` which will enable you to copy your local certificate files into the native docker volume.

### Prerequisites

You have two files locally on your workstation in the directory you're currently in:

   * `key.pem` - the private key for your TLS certificate
   * `cert.pem` - both the public and any interstitial keys concatenated into one file

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


Assuming your CHT instance is **already running with the default self-signed cert**:

1. Edit the CHT's environment file at `/home/ubuntu/cht/upgrade-service/.env` so this line is present:
   ```shell
   CERTIFICATE_MODE=AUTO_GENERATE
   ```
   This will ensure the `deploy.sh` script that certbot uses to deploy the certificates is available for use.
2. Restart your CHT instance to ensure the new `CERTIFICATE_MODE` value takes effect:
   ```shell
   cd /home/ubuntu/cht/upgrade-service/
   docker stop $(docker ps --filter "name=^cht*" -q)
   docker stop $(docker ps --filter "name=^upgrade-service*" -q)
   docker compose up --detach
   ```
3. Create certbot compose and env files by copying and pasting this code:
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
   Certbot only lets you create the identical certificates 5 times per 7 days.  If you're unsure of how this works you can change `STAGING=` to `STAGING=--staging` in the `/home/ubuntu/cht/certbot/.env` file to do repeated tests.  Be sure to change this back to `STAGING=` when you're ready to create production certificates.
4. Generate certs:
   ```shell
   cd /home/ubuntu/cht/certbot
   docker compose up --detach
   ```
5. Run this command to find the name of your CHT ngnix container:
   ```shell
   docker ps --filter "name=nginx"  --format '{{ .Names }}'
   ```
6. Assuming the name is `cht_nginx_1` from the prior step, reload your `nginx` config with this command:
    ```shell
    docker exec -it cht_nginx_1 nginx -s reload
    ```
7. Attempt to renew your certificates once a week by adding this cronjob via `crontab -e`.  Certbot will only renew them as needed:
   ```shell
   0 0 * * 0 cd /home/ubuntu/cht/certbot&&docker compose up --detach
   ```

## Troubleshooting

### Proxying

#### ERR_TLS_CERT_ALTNAME_INVALID

When proxying to HTTPS from HTTP (for example where an ingress does TLS termination in an SNI environment and then the traffic is proxied to an HTTPS service (eg, haproxy)), not including a `servername` for a request to the HTTPS server (eg, def.org) produces the following error:

   ```sh 
   'ERR_TLS_CERT_ALTNAME_INVALID'
   "RequestError: Error [ERR_TLS_CERT_ALTNAME_INVALID]: Hostname/IP does not match certificate's altnames:
   Host: abc.com. is not in the cert's altnames: DNS:def.org"
   ```

The addition of `servername` resolves this error by providing routing information. See [docs](https://nodejs.org/api/tls.html) for `tls.connect(options[, callback])`: "Server name for the SNI (Server Name Indication) TLS extension. It is the name of the host being connected to, and must be a host name, and not an IP address.".

A `servername` parameter may be added to all requests to the haproxy/couchdb by setting the environment variable `ADD_SERVERNAME_TO_HTTP_AGENT` to `true`.

A similar change can be made for the http clients used in the application by setting `PROXY_CHANGE_ORIGIN` to `true`. This sets the `changeOrigin` parameter of all the `http-proxy` clients to `true`, which "changes the origin of the host header to the target URL". See [http-proxy: options](https://www.npmjs.com/package/http-proxy#options).
