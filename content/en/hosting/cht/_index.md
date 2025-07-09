---
title: CHT Core
weight: 6
description: >
    Guides for hosting CHT 4.x applications
relatedContent: >
    building/guides/updates/preparing-for-4/
aliases:
  - /apps/guides/hosting/4.x
---

> [!TIP] 
> To get an overview on how these hosting solutions use `docker` and other key CHT concepts, be sure to read the [guide on a Local Setup]({{< relref "building/local-setup" >}}).

Before beginning any of these guides, be sure to meet all of the [CHT hosting requirements]({{< relref "/hosting/cht/requirements" >}}) first. For example, [backups](/hosting/cht/docker/backups) are required for any successful CHT deployment.

To host a production instance of CHT, use the [Production Hosting in CHT 4.x]({{< relref "/hosting/cht/docker" >}}) guide. To do app development, see our [App Developer]({{< relref "/hosting/cht/app-developer" >}}) hosting guide.

{{< cards >}}
  {{< card link="app-developer" title="App Developer Hosting" subtitle="Learn how to host the CHT when developing apps" icon="server" >}}
  {{< card link="migration/" title="Migration Guides" icon="arrow-circle-right" subtitle="Guides for migrating CHT applications" >}}
  {{< card link="/hosting/cht/docker/" title="Production Docker" subtitle="Details for hosting the CHT on Docker" icon="docker" >}}
  {{< card link="/hosting/cht/kubernetes/" title="Production Kubernetes" subtitle="Details for hosting the CHT on Kubernetes" icon="kubernetes" >}}
  {{< card link="upgrade-troubleshooting" title="Troubleshooting upgrades" subtitle="What to do when CHT 4.x upgrades don't work as planned" icon="search-circle" >}}
{{< /cards >}}
