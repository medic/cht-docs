---
title: "Switching CHT Versions Locally"
linkTitle: "Switching CHT Versions Locally"
weight: 20
description: >
  Switching CHT Versions Locally
relatedContent: >
  apps/guides/hosting/self-hosting.md
---

# CHT-Core Starter

## TLDR;

When developing configuration locally, especially when working with multiple projects with different versions, it is sometimes convinient to:

- Persist a database for each project when working across multiple projects.
- Start the right version of cht-core when working across different projects.
- Overcome some problems we've experienced using docker (medic/cht-core#6168 medic/cht-core#6455).
- Overcome some challenges using horti to bootstrap different cht-core releases locally.

## Rationale

For a simple local setup, we can use a local couchdb (native or docker) and horti to bootstrap a release of cht-core. If working on multiple projects, you'd need to manually clean up horti's deployment folder every time you boot a different version of cht-core.

The proposal is two pronged. Create a local configuration file (in JSON format) representative of the projects you are working on wherein you'd specify the project name and the version of cht-core deployed. We'd then have a script that wraps horti to help with the setup process by looking up the project key and bootstrapping the appropriate version and at the same time clearing horti's deployment folder for you.

We'd also end up creating different couch databases for each local deployment which would be maintained between runs - unless you explicitly delete them.

This could also end up as an improvement on horti

We rely on bash, jq, curl, horti (+node)

The calling semantics for the script would be:

```bash
./starter.sh -u <username> -p <password> <project key>
```

A sample configuration file (config.json) could have
```json
{
  "projects":[
    {
      "name": "muso",
      "version": "3.9.0"
    },
    {
      "name": "lg",
      "version": "3.6.0"
    }
  ]
}
```
## Caveat

To successfully run projects backed by a couch database not named medic, we need to run cht-core v3.5.0+.
* Backing up via replication is discouraged as restored DBs can cause offline users to restart replication from zero. Use file backups instead.
