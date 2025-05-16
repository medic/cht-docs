---
title: "Welcome to the CHT Documentation!"
linkTitle: "Documentation"
identifier: "docs"
weight: 1
aliases:
    - /search
cascade:
- _target:
    path: "/**"
    _kind: "page"
  type: "docs"
- _target:
    path: "/**"
    _kind: "page"
  type: "docs"
---

{{< cards >}}
  {{< card link="reference-apps" title="Reference Apps" subtitle="Explore et get inspired by examples of CHT reference applications" icon="collection" >}}
  {{< card link="technical-overview" title="Technical Overview" icon="template" subtitle="Overview and architecture of CHT components" >}}
  {{< card link="community" title="Get Involved" subtitle="Do you want to get involved in the CHT Community? Here's how..." icon="arrow-circle-right" >}}
  {{< card link="community/contributing" title="Contribute" subtitle="See how to contribute code and documentation" icon="pencil-alt" >}}
  {{< card link="design" title="Design" icon="sparkles" subtitle="Design guidelines for developers and designers of digital health applications" >}}
  {{< card link="building" title="Build" icon="template" subtitle="Overview of features and reference guides for building CHT Applications" >}}
  {{< card link="hosting" title="Host" icon="server" subtitle="Guides for hosting, maintaining, and monitoring CHT applications" >}}
  {{< card link="releases" title="Releases" subtitle="See what's new in CHT Core" icon="rocket-launch" >}}
{{< /cards >}}

{{< hextra/hero-subtitle style="margin:20px 0">}}
  Step by step tutorials
{{< /hextra/hero-subtitle >}}

{{< hextra/feature-grid >}}
  {{< hextra/feature-card
    title="Build and test the CHT"
    subtitle="Set up up a local environment to build and test CHT applications"
    link="../building/local-setup"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(85, 210, 205, 0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Set up a dev environment"
    subtitle="Run the CHT Core from source code locally for development purposes"
    link="../community/contributing/code/core/dev-environment"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(194, 135, 72, 0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Host the CHT"
    subtitle="Learn how to host the CHT locally or in production"
    link="../hosting/4.x/docker"
    style="background: radial-gradient(ellipse at 50% 80%,rgba(85, 210, 205, 0.15),hsla(0,0%,100%,0));"
  >}}
{{< /hextra/feature-grid >}}


## Have Questions?

{{< callout emoji="❓" >}}
  Want to learn alongside a community of practice? Join the [CHT community forum](https://forum.communityhealthtoolkit.org/) and let us know how we can help! And if you like what you see, don’t forget to ⭐ [the CHT Core GitHub repo](https://github.com/medic/cht-core).
{{< /callout >}}

{{< callout emoji="👥" type="info" >}}
  Feedback appreciated! This docs site is continually changing in response to great community feedback. If you notice a need for any corrections, or would like to see additional content on a particular topic, feel free to use the **Create Docs Issue** link in the left sidebar of your window.
{{< /callout >}}
