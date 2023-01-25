---
title: "Adding TLS certificates in CHT 4.x"
linkTitle: "TLS Certificates"
weight: 100
description: >
    How to add TLS certificates to your docker hosted CHT 4.x instance
---

To load your certificates into your CHT instance, we'll be creating an interstitial container called `cht-temp-tls` which will enable you to copy your local certificate files into the native docker volume. 

## Prerequisites

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
   docker volume ls --filter "name=cht_" | grep cht-ssl
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
