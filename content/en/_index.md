---
title: "Welcome to the CHT Documentation!"
linkTitle: "Documentation"
identifier: "docs"
weight: 1
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

{{< hextra/hero-subtitle >}}
  Everything you need to know to contribute, implement and be successful with the CHT
{{< /hextra/hero-subtitle >}}

{{< cards >}}
  {{< card link="core" title="CHT Core Framework" icon="template" subtitle="Overview and reference for development of the Core Framework" >}}
  {{< card link="reference-apps" title="References" subtitle="Explore et get inspired by CHT examples of reference applications" icon="collection" >}}
  {{< card link="community" title="Get involved" subtitle="Do you want to get involved in the CHT Community? Here's how..." icon="arrow-circle-right" >}}
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
    style="background: rgb(253, 241, 239);"
  >}}
  {{< hextra/feature-card
    title="Set up a dev environment"
    subtitle="Run the CHT Core from source code locally for development purposes"
    link="../community/contributing/code/core/dev-environment"
    style="background: rgb(238, 245, 249);"
  >}}
  {{< hextra/feature-card
    title="Host the CHT"
    subtitle="Learn how to host the CHT locally or in production"
    link="../hosting/4.x/app-developer"
    style="background: rgb(253, 241, 239);"
  >}}

{{< /hextra/feature-grid >}}


## Have Questions?

{{< callout emoji="❓" >}}
  Want to learn alongside a community of practice? Join the [CHT community forum](https://forum.communityhealthtoolkit.org/) and let us know how we can help! And if you like what you see, don’t forget to star [the CHT Core GitHub repo](https://github.com/medic/cht-core).
{{< /callout >}}

> [!NOTE]
> Feedback appreciated! This docs site is continually changing in response to great community feedback. If you notice a need for any corrections, or would like to see additional content on a particular topic, please feel free to use the **Create Documentation Issue** link in the upper right corner of your window.
