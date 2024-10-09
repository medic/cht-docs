---
title: "Docker Directory Setup"
toc_hide: true
hide_summary: true
---
Create the following directory structure:

```
|-- /home/ubuntu/cht/
                  |-- compose/
                  |-- certs/
                  |-- couchdb/
                  |-- upgrade-service/
```

By calling this `mkdir` commands:

```shell
mkdir -p /home/ubuntu/cht/{compose,certs,upgrade-service,couchdb}
```

1. `compose` - docker-compose files for cht-core and CouchDB
2. `certs` -  TLS certificates directory
3. `upgrade-service` - where docker-compose file for the upgrade-service
3. `couchdb` - the path for the docker-compose file of the upgrade-service (not used in multi-node)
