---
title: "EC2 Hosting"
linkTitle: "EC2 Hosting"
weight: 
description: >
  Hosting the CHT on Amazon EC2
relatedContent: >
  apps/guides/hosting/self-hosting
  apps/guides/database/couch2pg-oom-errors
---

## Configure Instance

1. Create EC2 (use security best practices)

    Based on the [CHT hardware requirements]({{< relref "apps/guides/hosting/requirements#hardware-requirements" >}}), start with a A1 Large instance. After creating the instance and downloading the `.pem` file, change permissions to `0600` for it:
    
    ```
    sudo chmod 0600 ~/Downloads/name_of_file.pem
    ```
    
    - [Create Elastic IP (EIP) and associate EIP to EC2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html)
    
    `Goal`: SSH into instance


1. Create or Restore EBS Volume

    - Create EBS Volume
        - Be sure to tag appropriately
    - [Restore EBS Volume](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ebs-restoring-volume.html)
    - Attach volume to EC2 instance
    - (Optional): [Increase disk size](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html)
    
    - If you are using a newly created EBS Volume, you will have to format the disk approriately:
        1) SSH into instance
        2) Follow the instructions here: [Using EBS Volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html)
        3) Use `sudo mkfs -t ext4 <location>` in step 4
        4) Mount disk to /srv
    
    `Goal`: Mount EBS volume to /srv

1. Provision Docker server

    - Follow README & Run scripts: [Prepare Self-Hosting System](https://github.com/medic/cht-infrastructure/tree/master/self-hosting/prepare-system)
    
    `Goal`: CHT Application bootstraps and comes online

1. DNS configuration
    - Point A records to Elastic IP given to Docker server

5. Review SSL certs
    - Location of certs is `/srv/settings/medic-core/nginx/private/`
    - Name the key file as `default.key` and the certificate file as `default.crt`
    - Restarting nginx with new certs: `svc-restart medic-core nginx`

6. Configure couch2pg
    - [Basic configuration](https://github.com/medic/medic-couch2pg/blob/master/README.md)

7. Setup postgres to work with couch2pg
    - Creating the database, setting up permissions, exploring the tables and what they store

8. Debugging couch2pg/postgres
    - Understanding the log and what the entries mean

## Troubleshooting

1. Restarting processes
    - [How to access container, retrieve logs, isolate security groups]({{< ref "apps/guides/hosting/self-hosting#how-to-access-container-retrieve-logs-isolate-security-groups" >}})
    - [MedicOS service management scripts](https://github.com/medic/medic-os#user-content-service-management-scripts)

2. Investigating logs
    - [Helpful docker commands]({{< ref "core/guides/docker-setup#helpful-docker-commands" >}}) (includes getting shell on containers)
    - Inside container, all appropriate logs can be found in: `/srv/storage/<service_name>/logs/*.log`

3. Upgrading the container
    - Backup all data (EBS) 
    - Log into container and stop all services
    - DO NOT REMOVE `/srv/storage/medic-core/`, `/srv/settings/medic-core/couchdb/local.ini`, wipe all other files in `/srv` [Note: Make script publicly accessible]
    - [Change the image tag to the newest image release version]({{< ref "core/guides/docker-setup#use-docker-compose" >}})
    - [Change image tag in docker-compose file]({{< ref "core/guides/docker-setup#use-docker-compose">}})
    - Launch new containers with appropriate COUCHDB_ADMIN_PASSWORD & HA_PASSWORD environment variables

4. Upgrading the webapp
    - Use Admin GUI page
    - [CLI via horticulturalist]({{< ref "apps/guides/hosting/self-hosting#links-to-medic-documentation-for-horticulturalist-for-upgrades" >}})

5. RDS help

    - [Amazon user guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)

## Backups 

1. Configure backups
    - [EBS Snapshot Lifecycle Manager](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-lifecycle.html)

2. Restoring from backup
    - Create volume from snapshot
    - Tag appropriately for backups
    - Mount volume to docker server

## Process supervision
- `supvisorctl`
- `/boot/supervisor-inspect`

## Increasing disk size

* Stop medic: `sudo supervisorctl stop medic`
* Go to EBS in AWS and take a snapshot of the volume.
* Modify the volume size (Increase it by 2x preferably). Wait until the modification succeeds.
* [Make the instance recognize the additional space](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html)
* Turn medic back on: `sudo supervisorctl start medic`

## Monitoring & Backup
* AWS CloudWatch and monitoring tab. Enable detailed monitoring (This costs more money)
* Set up [Lifecycle Management for EBS snapshots](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-lifecycle.html#snapshot-lifecycle-console)
* Steps to mounting a backup snapshot to the instance and restarting the application
* Please see the second-half of “Increasing disk size” reference above
* Setup a TLS cert & DNS registration



