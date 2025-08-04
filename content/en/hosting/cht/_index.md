---
title: CHT Core
weight: 6
description: >
    Guides for hosting CHT applications
relatedContent: >
    building/guides/updates/preparing-for-4/
aliases:
  - /apps/guides/hosting/4.x
  - /hosting/4.x/
---

> [!TIP] 
> To get an overview on how these hosting solutions use `docker` and other key CHT concepts, be sure to read the [guide on a Local Setup]({{< relref "building/local-setup" >}}).

Before beginning any of these guides, be sure to meet all of the [CHT hosting requirements]({{< relref "/hosting/cht/requirements" >}}) first. For example, [backups](/hosting/cht/docker/backups) are required for any successful CHT deployment.

To host a production instance of CHT, use the [Production Hosting in CHT]({{< relref "/hosting/cht/docker" >}}) guide. To do app development, see our [App Developer]({{< relref "/hosting/cht/app-developer" >}}) hosting guide.

{{< cards >}}
  {{< card link="considerations" title="Considerations" subtitle="Considerations when hosting the CHT" icon="book-open" >}}
  {{< card link="requirements" title="Requirements" icon="shield-exclamation" subtitle="Requirements for hosting CHT applications" >}}
  {{< card link="costs" title="Costs" subtitle="A guide for calculating CHT hosting costs" icon="banknotes" >}}
  {{< card link="kubernetes-vs-docker" title="Kubernetes vs Docker" icon="kubernetes" subtitle="Options for installing CHT applications" >}}
  {{< card link="app-developer" title="App Developer Hosting" subtitle="Learn how to host the CHT when developing apps" icon="server" >}}
  {{< card link="migration/" title="Migration Guides" icon="arrow-circle-right" subtitle="Guides for migrating CHT applications" >}}
  {{< card link="/hosting/cht/docker/" title="Production Docker" subtitle="Details for hosting the CHT on Docker" icon="docker" >}}
  {{< card link="/hosting/cht/kubernetes/" title="Production Kubernetes" subtitle="Details for hosting the CHT on Kubernetes" icon="kubernetes" >}}
  {{< card link="upgrade-troubleshooting" title="Troubleshooting upgrades" subtitle="What to do when CHT upgrades don't work as planned" icon="search-circle" >}}
{{< /cards >}}

{{< callout emoji="🔍" >}}
All of the above documentation applies to CHT 4.x and CHT 5.x.

Looking CHT 3.x hosting information?  This content [has been removed](https://forum.communityhealthtoolkit.org/t/proposal-remove-cht-3-x-hosting-documentation/5133), but is still available on the [Old Docs site](https://old-docs.dev.medicmobile.org/hosting/3.x/).  

In the coming year (2026), this old docs site will be removed as well. 
{{< /callout >}}
