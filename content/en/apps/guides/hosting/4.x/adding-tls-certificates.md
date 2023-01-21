---
title: "Adding TLS certificates in CHT 4.x"
linkTitle: "TLS Certificates"
weight: 100
description: >
    How to add TLS certificates to your docker hosted CHT 4.x instance
---

When hosting a production instance of the CHT, you should use the `CERTIFICATE_MODE` environment variable and have it set to `OWN_CERT`.  This ensures that your certificate will persist across reboots as well as when you upgrade images that your containers are built upon.

To load your certificates into your CHT instance, we'll be creating an interstitial container called `cht-temp-tls` which will enable you to copy your local certificate files into the native docker volume. 

## Prerequisites

1. You are using these two environment variables:
   * `CERTIFICATE_MODE=OWN_CERT` - This tells the CHT that you want to bring your own certificates for your domain
   * `SSL_VOLUME_MOUNT_PATH=/etc/nginx/private/` - This ensures that the `nginx` service is reading the certificates from the paths that match [its config](https://github.com/medic/cht-core/blob/master/nginx/nginx.conf#L40).
2. You have two files locally on your workstation in the directory you're currently in:
   * `key.pem` - the private key for your TLS certificate
   * `chain.pem` - both the public and any interstitial keys concatenated into one file
3. Ensure you have started your CHT instance once and all your volumes are created.  

### Loading the certificate

1. Find your project you're using:

   ```shell
   docker-compose ls -a
   ```
   For these instructions, the example project is called `cht_`
2. Find the name of your `cht-ssl` volume by replace `cht_` with your value from the prior step:

   ```shell
   docker volume ls --filter "name=cht_" | grep cht-ssl
   ```
   This results in finding out that `cht_cht-ssl` is the name of our `cht-ssl` volume.
3. Start a container called `temp` which allow us to copy files into the docker volume:

    ```shell
   docker run -d --rm --name temp -v cht_cht-ssl:/etc/nginx/private/ alpine tail -f /dev/null
   ```
4. Copy the two pem files into the volume via the temporary container:
   ```
   docker cp key.pem temp:/etc/nginx/private/.
   docker cp cert.pem temp:/etc/nginx/private/.
   ```
5. Stop the `temp` container: 
   ```shell
   docker kill temp
   ```

Your certificates are now safely stored in the native docker volume. Restart your CHT instance the way you started it, being sure to set the correct `CERTIFICATE_MODE` and `SSL_VOLUME_MOUNT_PATH` per the [prerequisites](#prerequisites).
