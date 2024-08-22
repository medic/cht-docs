---
title: "Migrating from Couch2pg to CHT Sync"
weight: 1
linkTitle: "Couch2pg to CHT Sync Migration"
description: >
  High-level instructions on how to migrate from Couch2pg to CHT Sync for data synchronization and analytics and what to consider during the migration process.
relatedContent: >
  core/overview/cht-sync
  core/overview/data-flows-for-analytics/
---

This page outlines the process of migrating from [Couch2pg](https://github.com/medic/cht-couch2pg), to the new CHT Sync pipeline. One of the main changes in the new flow involves separating the syncing process from the data transformation, with DBT now handling the latter. This migration will require converting existing SQL views and tables into DBT models. One thing to note is that the schema for CHT Sync differs from Couch2pg, so the SQL views and tables will not be directly replaced by DBT models. For instructions on how to get started with DBT models refer to the [DBT Models](({{< relref "apps/guides/data/analytics/building-dbt-models" >}}))

## Key Considerations
- **Server resources**: To minimize downtime, it is recommended to run both Couch2pg and CHT Sync in parallel during the migration process. With this in mind, ensure that the server and database resources are sufficient to handle the load.
- **DBT Modelling**: Avoid the temptation to model new DBT models after existing SQL views and tables. Instead, take the opportunity to re-evaluate the data needs and design new models that are more efficient and effective. Think of what data needs to be shown and how it should be shown and use that to guide the design of the new models.
- **Testing**: After migrating, thoroughly test the new DBT models to ensure that they are working as expected.
- **Feedback**: Provide any feedback and create issues for errors or bugs encountered in the [CHT Sync](https://github.com/medic/cht-sync) and [CHT Pipeline](https://github.com/medic/cht-pipeline/) repos to make it easier for the next migration.

## Migration Steps
1. **Plan Migration**: Determine the scope of the migration, including the data sources, the data models, and the data transformations. Identify the SQL views and tables that need to be converted into DBT models.
1. **Set up CHT Sync**: Follow the instructions in the [Local CHT Sync Setup](({{< relref "apps/guides/data/analytics/setup" >}})) guide to set up CHT Sync locally and start DBT modelling.
1. **Deploy CHT Sync**: Once the DBT models are tested locally and working as expected, deploy CHT Sync in production. Follow the instructions in the [Production CHT Sync Setup](({{< relref "apps/guides/data/analytics/production" >}})) guide to set up CHT Sync in production. Note that we recommend running CHT Sync in parallel with Couch2pg during the migration process.
1. **Test New Models**: After deploying CHT Sync, test the new DBT models to ensure that they are working as expected. Make any necessary adjustments to the models to ensure that they are accurate and efficient. To do this you will need to create a replica dashboard and compare the data from the old and new pipelines.
1. **Optimize**: Once the new DBT models are working as expected, optimize the models to improve performance. This may involve restructuring the models, adding indexes, or making other adjustments to improve the speed and efficiency of the models. Having a look at the [DBT Models](({{< relref "apps/guides/data/analytics/building-dbt-models" >}})) guide will help you understand how to optimize the models.
<!-- TODO: Link to docs for setting up CHT Watchdog once they are ready -->
1. **Monitor and Maintain**: Setup CHT Watchdog to monitor the running of CHT Sync and CHT Pipeline and set up alerts for any failures.
1. **Remove Couch2pg and the duplicate database**: Once the new pipeline is running smoothly, you can remove Couch2pg and the duplicate database. Ensure that all data is being synced correctly and that the new DBT models are working as expected before switching off and removing Couch2pg.
