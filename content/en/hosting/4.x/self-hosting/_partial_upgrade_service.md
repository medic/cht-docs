---
title: "Upgrading the cht-upgrade-service"
toc_hide: true
hide_summary: true
---
### Upgrading the cht-upgrade-service

The [CHT Upgrade Service](https://github.com/medic/cht-upgrade-service) provides an interface between the CHT Core API and Docker to allow easy startup and one-click upgrades from the CHT Admin UI. Occasionally, the CHT Upgrade Service, itself, will need to be upgraded. If an upgrade is available, it is highly recommended that you install the upgrade for the CHT Upgrade Service before performing further upgrades on your CHT instance. This is done via the following steps:

1. Verify that the _version_ of the `cht-upgrade-service` image in your `./upgrade-service/docker-compose.yml` files is set to `latest`.
1. Pull the latest `cht-upgrade-service` image from Docker Hub and replace the current container by running the following command:
    ```shell
    cd /home/ubuntu/cht/upgrade-service
    docker compose pull
    docker compose up --detach
    ``` 

{{% alert title="Note" %}}
Upgrading the CHT Upgrade Service will not cause a new CHT version to be installed.  The CHT Core and CouchDB containers are not affected.
{{% /alert %}}

Follow the [Product Releases channel](https://forum.communityhealthtoolkit.org/c/product/releases/26) on the CHT forum to stay informed about new releases and upgrades.
