---
title: Production NodeJS
weight: 300
description: >
     How to set up couch2pg on Ubuntu Server 22 with NodeJS
---

{{< callout type="warning" >}}
  CHT couch2pg is deprecated. For data synchronization, refer to [CHT Sync](/hosting/analytics").
{{< /callout >}}

This guide is for NodeJS on Ubuntu.  See related [Docker Compose on Ubuntu](/hosting/couch2pg/exmple-docker-deploy)  guide.

## Assumptions 


Since the detailed steps were written in a private ticket, we wanted to publish them in case other partners would benefit from the precise steps.  These instructions assume you're on Ubuntu server 22.04 and are running both CHT Core and Postgres on other servers.

## Prerequisites 

* Postgres server with enough free space to sync all of CouchDB data
* Ubuntu server with minimum 4 cores 8GB RAM, 50GB disk
* Credentials for couch2pg to access Postgres
* Credentials for couch2pg to access CHT 

## Deployment 

All commands are run as `root` unless specified to run as `couch2pg`:

1. Install all the prerequisites. Note that we're intentionally installing an old version of NodeJS (12.x LTS):
   ```shell
   apt update && apt -y dist-upgrade && apt -y install postgresql-client curl git jq
   sudo apt update
   sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
   curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
   sudo apt -y install nodejs npm
   ```
2. Test with `psql` client on couch2pg server that it can connect and successfully authenticate to Postgres server. Be sure to use the IP of your SQL server (`172.18.0.1`), user (`postgres_root`) and database (`cht`):
   ```shell
   psql -U cht_couch2pg -h 192.168.68.26 cht
   ```
3. Test with `curl` client on couch2pg server that it can connect and successfully authenticate to CHT server. Again, be sure to use the correct CHT Core URL with login and password:
   ```shell
   curl -s https://medic:password@192-168-68-23.local-ip.medicmobile.org:10443/medic/ | jq      
   ```
4. Create `couch2pg` user on the Ubuntu server
5. As `couch2pg` user, clone couch2pg repo: `git clone https://github.com/medic/cht-couch2pg.git`
6. As `couch2pg` user, install couch2pg dependencies: `cd cht-couch2pg && npm ci`
7. As `couch2pg` user, test couch2pg. Be sure to use correct values for `COUCHDB_URL` and `POSTGRESQL_URL`:
   ```shell
   COUCHDB_URL=https://medic:password@192-168-68-23.local-ip.medicmobile.org:10443/medic \
      POSTGRESQL_URL=postgres://cht_couch2pg:postgres_password@192.168.68.26:5432/cht \
      node .
   ```  
8. Configure couch2pg in a systemd file at `/etc/systemd/system/couch2pg.service` be sure that environment variables are updated (`Environment=".."`):
   ```shell
   [Unit]
   Description=couch2pg
   Documentation=https://docs.communityhealthtoolkit.org/hosting/couch2pg/setup-and-devlopment/
   After=network.target

   [Service]
   Environment="POSTGRESQL_URL=postgres://cht_couch2pg:postgres_password@192.168.68.26:5432/cht"
   Environment="COUCHDB_URL=https://medic:password@192-168-68-23.local-ip.medicmobile.org:10443/medic"
   Environment="COUCH2PG_SLEEP_MINS=360"
   Environment="COUCH2PG_DOC_LIMIT=100"
   Environment="COUCH2PG_CHANGES_LIMIT=5000"
   Environment="COUCH2PG_RETRY_COUNT=5"
   Environment="COUCH2PG_USERS_META_DOC_LIMIT=50"
   Type=simple
   User=couch2pg
   ExecStart=/usr/bin/node .
   WorkingDirectory=/home/couch2pg/cht-couch2pg
   Restart=on-failure

   [Install]
   WantedBy=multi-user.target
   ```
9. Ensure couch2pg runs at boot: `systemctl enable couch2pg`
10. Reload systemd: `systemctl daemon-reload`
11. Reboot VM: `reboot`
12. Check for errors after reboot: `systemctl status couch2pg`
13. monitor couch2pg logs for errors. If errors are found, re-run them, updating this list to be accurate. Add any new requirements above as well, as needed: `journalctl --follow --unit=couch2pg --lines=100`
