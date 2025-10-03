---
title: Production Docker
weight: 400
description: >
     How to set up couch2pg on Ubuntu Server 22 with Docker Compose
---

{{< callout type="warning" >}}
  CHT couch2pg is deprecated. For data synchronization, refer to [CHT Sync](/hosting/analytics").
{{< /callout >}}

This guide is for Docker Compose on Ubuntu.  See related [NodeJS on Ubuntu](/hosting/couch2pg/exmple-nodejs-deploy)  guide.

## Assumptions


These instructions assume you're on Ubuntu server 22.04 and are running both CHT Core and Postgres on other servers.

## Prerequisites 

* Postgres server with enough free space to sync all of CouchDB data
* Ubuntu server with minimum 4 cores 8GB RAM, 50GB disk
* Credentials for couch2pg to access Postgres
* Credentials for couch2pg to access CHT  

## Deployment 

All commands are run as `root`:

1. Install Docker and related CLI utilities:
   ```shell
   apt update && apt -y dist-upgrade && apt -y install postgresql-client curl git jq
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```
2. Test with `curl` client on couch2pg server to ensure it can connect and successfully authenticate to CHT server. Again, be sure to use the correct CHT Core URL with login and password:
   ```shell
   curl -s https://medic:password@192-168-68-23.local-ip.medicmobile.org/medic/ | jq      
   ```
3. Test with `psql` client on couch2pg server that it can connect and successfully authenticate to the Postgres server. Be sure to use the IP of your SQL server (`172.18.0.1`), user (`postgres_root`) and database (`cht`):
   ```shell
   psql -U cht_couch2pg -h 192.168.68.26 cht
   ```
4. Now that you've confirmed both Postgres (`psql`) and CHT Core (`curl`) tests work, create a compose file `/root/compose.yml`:
   ```yaml
   services:
      cht-couch2pg:
         image: medicmobile/cht-couch2pg:main-node-10
         restart: always
         environment:
            COUCHDB_URL: ${COUCHDB_URL:-https://medic:password@localhost:5988/medic}
   
            POSTGRES_USER_NAME: ${COUCH2PG_USER:-cht_couch2pg}
            POSTGRES_PASSWORD: ${COUCH2PG_USER_PASSWORD:-cht_couch2pg_password}
            POSTGRES_SERVER_NAME: ${POSTGRES_SERVER_NAME:-postgres}
            POSTGRES_DB_NAME: ${POSTGRES_DB_NAME:-cht}
   
            COUCH2PG_CHANGES_LIMIT: ${COUCH2PG_CHANGES_LIMIT:-100}
            COUCH2PG_SLEEP_MINS: ${COUCH2PG_SLEEP_MINS:-60}
            COUCH2PG_DOC_LIMIT: ${COUCH2PG_DOC_LIMIT:-1000}
            COUCH2PG_RETRY_COUNT: ${COUCH2PG_RETRY_COUNT:-5}
            COUCH2PG_USERS_META_DOC_LIMIT: ${COUCH2PG_USERS_META_DOC_LIMIT}
    ```
5. Create a environment file `/root/.env` - being sure to update the values for your production environment:
   ```shell
   COUCHDB_URL='https://medic:password@192-168-68-23.local-ip.medicmobile.org/medic'
   
   COUCH2PG_USER=cht_couch2pg
   COUCH2PG_USER_PASSWORD=cht_couch2pg_password
   POSTGRES_SERVER_NAME=192.168.68.26
   POSTGRES_DB_NAME=cht
   
   COUCH2PG_CHANGES_LIMIT=5000
   COUCH2PG_SLEEP_MINS=360
   COUCH2PG_DOC_LIMIT=100
   COUCH2PG_RETRY_COUNT=5
   COUCH2PG_USERS_META_DOC_LIMIT=50
    ```
6. Start couch2pg in Docker in detached mode:
   ```shell
   cd /root
   docker compose up -d
   ```
7. Wait a few minutes and reboot the entire VM: `reboot`
8. Check for that couch2pg started and there's no errors after reboot: 
   ```
   cd /root
   docker compose logs -f
   ```
9. Over the next 48 hours, monitor couch2pg logs for errors. If errors are found, re-run them, updating this list to be accurate. Add any new requirements above as well, as needed. 
