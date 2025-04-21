---
title: "AWS Hosting in CHT 3.x"
linkTitle: "Production Hosting - AWS"
weight: 10
description: >
  Hosting the CHT on Amazon EC2
aliases:
   - /apps/guides/hosting/3.x/ec2-setup-guide
   - /apps/guides/hosting/ec2-setup-guide 
relatedContent: >
  hosting/3.x/self-hosting
---


Most production CHT instances are deployed on AWS EC2.  Leveraging Elastic Compute Cloud (EC2) and Elastic Block Store (EBS), CHT instances can easily be scaled up with larger EC2 instances and have easy increased disk space, backup and restores with EBS.

This guide will walk you through the process of creating an EC2 instance, mounting an EBS volume and provisioning Docker containers.

## Create and Configure EC2 Instance 

1. Create EC2 (use security best practices)

    Review the [CHT hardware requirements]({{< relref "hosting/requirements#hardware-requirements" >}}) and start with an appropriately sized instance. After creating the instance and downloading the `.pem` file, change permissions to `0600` for it:
    
    ```shell
    sudo chmod 0600 ~/Downloads/name_of_file.pem
    ```
    
    Create  an [Elastic IP (EIP) and associate the EIP to your EC2 instance](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html).
    
    You should now be able to SSH into the EC2 instance using the EIP and the `.pem` file.
    
    `Goal`: SSH into instance


1. Create or Restore EBS Volume

    - Create or [Restore](https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/ebs-restoring-volume.html) your EBS Volume, tagging appropriately, so it can be found later. 
    - Attach volume to EC2 instance
    - [Increase disk size](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html) (Optional)    
    - If you are using a newly created EBS Volume, you will have to format the disk appropriately:
        1) SSH into instance
        2) Follow the instructions here: [Using EBS Volumes](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-using-volumes.html)
        3) Use `sudo mkfs -t ext4 <location>` in step 4
        4) Mount disk to `/srv`
    
    `Goal`: Mount EBS volume to `/srv`

1. Provision Docker server

    Follow README & Run scripts in [cht-infrastructure repository](https://github.com/medic/cht-infrastructure/tree/master/self-hosting/prepare-system).
    
    `Goal`: CHT Application bootstraps and comes online

1. DNS configuration
    - Point DNS `A` record to EIP given to Docker server in the prior step.

1. Review SSL certificates
    - Location of certs is `/srv/settings/medic-core/nginx/private/`
    - Name the key file is `default.key` and the certificate file is `default.crt`
    - See [SSL Certificates]({{< relref "hosting/3.x/ssl-cert-install">}}) to install new certificates

1. Configure CHT Sync
    See the [CHT Sync configuration]({{< relref "hosting/analytics">}}).

1. Setup postgres to work with CHT Sync
    - Creating the database, setting up permissions, exploring the tables and what they store

1. Debugging CHT Sync/postgres
    - Understanding the log and what the entries mean

## Troubleshooting

1. Restarting processes
      ```shell
      /boot/svc-<start/stop/restart> <service-name/medic-api/medic-sentinel/medic-core couchdb/medic-core nginx>
      ```
   - Also see [MedicOS service management scripts](https://github.com/medic/medic-os#user-content-service-management-scripts)
2. Investigating logs inside Medic OS
   * To view logs, first run this to access a shell in the medic-os container: `docker exec -it medic-os /bin/bash`
   * View CouchDB logs: `less /srv/storage/medic-core/couchdb/logs/startup.log`
   * View medic-api logs: `less /srv/storage/medic-api/logs/medic-api.log`
   * View medic-sentinel logs: `less /srv/storage/medic-sentinel/logs/medic-sentinel.log`

3. Investigating docker stderr/stdout logs
   ```shell
    sudo docker logs medic-os
    sudo docker logs haproxy
   ```
   
4. Upgrading the container
    - Backup all data (EBS) 
    - Log into container and stop all services
    - To prepare for the upgrade, delete all other files in `/srv` EXCEPT for `/srv/storage/medic-core/`
      
      The `medic-core` directory is where the CHT stores user data. Of key importance is `./couchdb/local.in` and `./medic-core/couchdb/local.d/` where custom CouchDB configuration is stored.
    - Change the image tag to the final Medic OS image release version (`cht-3.9.0-rc.2`) in the docker compose file:
      ```yaml
      services:
         medic-os:
            image: medicmobile/medic-os:cht-3.9.0-rc.2
      ```
    - Launch new containers with appropriate `COUCHDB_ADMIN_PASSWORD` & `HA_PASSWORD` environment variables

5. Upgrading the webapp
    - Use Admin GUI page
    - [CLI via horticulturalist]({{< ref "hosting/3.x/self-hosting#links-to-medic-documentation-for-horticulturalist-for-upgrades" >}})

6. RDS help

    - [Amazon user guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)

## Backups 

1. Configure backups
    - [EBS Snapshot Lifecycle Manager](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-lifecycle.html)

1. Restoring from backup
    - Create volume from snapshot
    - Tag appropriately for backups
    - Mount volume to docker server

## Process supervision
- `supvisorctl`
- `/boot/supervisor-inspect`

## Increasing disk size

Monitor disk usage so alerts are sent before all disk spaces is used up.  If free disk space falls below 40%, increase the disk space as follows:

* Stop medic: `sudo supervisorctl stop medic`
* Go to EBS in AWS and take a snapshot of the volume.
* Modify the volume size (Increase it by 2x preferably). Wait until the modification succeeds.
* [Make the instance recognize the additional space](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/recognize-expanded-volume-linux.html)
* Turn medic back on: `sudo supervisorctl start medic`

## Monitoring & Backup
* AWS CloudWatch and monitoring tab. Enable detailed monitoring (This costs more money)
* Set up [Lifecycle Management for EBS snapshots](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/snapshot-lifecycle.html#snapshot-lifecycle-console)
* Steps to mounting a backup snapshot to the instance and restarting the application
* Please see the second-half of "Increasing disk size" reference above
* Setup a TLS cert & DNS registration
