---
title: Host CHT Applications
linkTitle: Host
weight: 7
aliases:
    - /apps/guides/hosting/
---

{{< hextra/hero-subtitle >}}
  Guides for hosting, maintaining, and monitoring CHT applications
{{< /hextra/hero-subtitle >}}

This section has instructions on how to host the CHT Core starting with the most basic Application Development setup on your laptop for just one developer all the way up to large deployments which include multi-node CouchDB cluster hosted in a Cloud based deployment.

{{< callout type="warning" >}}
  All CHT 3.x deployments have been end of life since November 2023 and are not longer supported. They're [documented]({{< relref "hosting/3.x" >}}) to support deployments that are yet to upgrade to 4.x. 
{{< /callout >}}

New developers to the CHT should start on CHT 4.x with our [Application Developer Hosting]({{< relref "hosting/4.x/app-developer" >}}).

System administrators looking to deploy CHT into production should understand when to use [single vs multi-node CouchDB]({{< relref "hosting/4.x/production" >}}) first, then read the [4.x production hosting section]({{< relref "hosting/4.x/production" >}}) to select a style of hosting that best fits them.

Before beginning any of these guides, be sure to meet all of the [CHT hosting requirements]({{< relref "hosting/requirements" >}}) first.

{{< subpages >}}