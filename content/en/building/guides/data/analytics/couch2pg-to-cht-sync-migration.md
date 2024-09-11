---
title: "Migrating from couch2pg to CHT Sync"
weight: 1
linkTitle: "Couch2pg to CHT Sync Migration"
description: >
  Instructions on migrating from couch2pg to CHT Sync for data synchronization and analytics.
relatedContent: >
  core/overview/cht-sync
  core/overview/data-flows-for-analytics/
---

This page outlines guidelines for migrating from [couch2pg](https://github.com/medic/cht-couch2pg) to the data pipeline based on CHT Sync. One of the main changes in this flow is separating the syncing process from the data transformation, with dbt now handling the latter in [cht-pipeline](https://github.com/medic/cht-pipeline/). This migration requires dbt models in the cht-pipeline repository instead of SQL views and tables. One thing to note is that the schema for CHT Sync differs from couch2pg, so dbt models will not directly replace the SQL views and tables. For instructions on how to get started with dbt models, refer to the [dbt models guide]({{< relref "building/guides/data/analytics/testing-dbt-models" >}}).

## Key Considerations
- **Server resources**: To minimize downtime, running both couch2pg and CHT Sync in parallel during the migration process is recommended. With this in mind, ensure that the server and database resources are sufficient to handle the load.
- **dbt Modelling**: Avoid the temptation to model new dbt models after existing SQL views and tables. Instead, take the opportunity to re-evaluate the data needs and design new models that are more efficient and effective. Think of what data needs to be shown and how it should be shown in data visualization tools and use that to guide the design of the new models.
- **Testing**: After migrating, thoroughly test the new dbt models to ensure that they work as expected. Refer to the [testing dbt models guide](({{< relref "building/guides/data/analytics/building-dbt-models" >}})) for more information on testing.
- **Feedback**: Provide any feedback and create issues for errors or bugs encountered in the [CHT Sync](https://github.com/medic/cht-sync) and [CHT Pipeline](https://github.com/medic/cht-pipeline/) repositories to improve the tools.

## Migration Steps
1. **Plan the migration**: Determine the scope of the migration, including the data sources, the data models, and the data transformations. Identify the existing SQL views, tables, and dashboards and assess what data you want to visualize. 
1. **Set up CHT Sync**: Follow the instructions [to setup CHT Sync locally](({{< relref "building/guides/data/analytics/setup" >}})).
1. **Build dbt models**:  Use the [dedicated guidelines](({{< relref "building/guides/data/analytics/building-dbt-models" >}})) to build dbt models for the data you want to visualize.
1. **Deploy CHT Sync**: Once the dbt models are tested locally and working as expected, deploy CHT Sync in production. Follow [the instructions to set up CHT Sync in production](({{< relref "building/guides/data/analytics/production" >}})). It is recommended that CHT Sync be run in parallel with couch2pg during the migration process. This minimises disruption to users of the existing dashboards because they can continue to use the existing data while the new pipeline is being set up. It also makes it easier to compare the data from couch2pg when testing the new pipeline.
1. **Create replica dashboards**: In the data visualization tool of your choice, create replica dashboards of your current setup and compare the data from the old and new pipelines.
1. **Test and adjust the dbt models**: Test the dbt models to ensure they are working as expected and that the replica and initial dashboards match. Adjust the models to ensure they are accurate.
1. **Optimize**: Once the dbt models are working as expected and the dashboards display the expected data, optimize the models to improve performance. This may involve restructuring the models, adding indexes, or making other adjustments to improve the speed and efficiency of the models. Having a look at the [dbt models guide](({{< relref "building/guides/data/analytics/building-dbt-models" >}})) will help you understand how to optimize the models.
1. **Set up monitoring and alerting**: [Setup CHT Watchdog](({{< relref "hosting/monitoring/setup" >}})) to monitor the running of CHT Sync and CHT Pipeline and set up alerts for any failures.
1. **Remove couch2pg and the duplicate database**: Once the new pipeline runs as expected, you can remove couch2pg and the duplicate database. Ensure that all data is being synced correctly, that the dbt models are working as expected, and that the dashboards display the expected data before switching them off and removing couch2pg.
