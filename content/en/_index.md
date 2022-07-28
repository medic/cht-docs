---
title: "Welcome to the Community Health Toolkit Docs Site!"
linkTitle: "Documentation"
identifier: "docs"
weight: 1
cascade:
- _target:
    path: "/**"
  kind: "page"
  type: "docs"
- _target:
    path: "/**"
  kind: "section"
  type: "docs"
---

{{% pageinfo %}}
The [Community Health Toolkit](https://communityhealthtoolkit.org) is a collection of open-source technologies and open-access resources developed by a community focused on global health equity. We envision a world where primary health care is equitable, accessible, and delivered by people who are trusted in their communities. Start with the [CHT overview]({{< ref apps >}}), and join our [community forum](https://forum.communityhealthtoolkit.org/)!

**This documentation site is being actively updated to make it as easy as possible to deploy CHT apps. Please [notify us](https://github.com/medic/cht-docs/issues/new) if you find any errors or inconsistencies.**
{{% /pageinfo %}}


## Why work with the CHT?

Community health systems can dramatically improve the accessibility, quality, speed, and equity of primary health care, but only if health workers are effectively equipped and supported. Advances in open source technology are making it easier and more affordable than ever to deliver impactful, dignified care in even the hardest-to-reach communities.

With more than 27,000 health workers using these tools to support a million home visits every month, the CHT is the most full-featured, mature, and widely-used open source software toolkit designed specifically for community health systems. Hundreds of individuals contribute to the CHT as designers, developers, researchers, health policy experts, health system implementers, and frontline health workers. For more about the unique strengths of our open source community and the technology we’re building together, see [Why the CHT]({{< ref "/why-the-cht" >}}) ?

{{< youtube SXN76-EZnsM >}}

<br />

## What can you build with the CHT?

The CHT provides you with resources to design, build, deploy, and monitor digital tools for community health. It includes open source software frameworks and applications, guides to help design and use them, and a [community forum](https://forum.communityhealthtoolkit.org/) for collaboration and support. The resources provided through the Community Health Toolkit can be used to build digital health apps used at the community, health facility, and health system level:

**At the community level**, community health workers (CHWs) use apps built with the CHT to register patients, conduct guided health assessments, screen for specific conditions and danger signs, and refer patients to health facilities.

**At the health facility level**, nurses and CHW supervisors use apps and admin consoles built with the CHT to coordinate care for patients with the CHWs, promote health practices in the community, and report health and service delivery statistics to health system officials

**At the health system level**, data managers and others use apps and admin consoles built with the CHT to collate and report on key community and health system data. Their work often involves following up with supervisors and nurses to verify data for accuracy and completion.

<img src="appdemo-trio.gif" width=100%>

<br />

## Getting Started

<br />
### Why the CHT?
A great place to start for high-level context on what our community is building together. To explore the diverse kinds of digital health apps you can build with the CHT, you might also find it helpful to read about the [ANC Reference App]({{< ref "apps/examples/anc" >}}), or watch demo videos for [contact tracing](https://youtu.be/I8bBeh80j-0), [covid education](https://youtu.be/pFEFIY_SA7M), or [covid symptom checking](https://youtu.be/9zPnhNMDzh4) apps. If you want to try out the software for yourself, feel free to [request a demo account](https://communityhealthtoolkit.org/contact). 

{{< see-also page="why-the-cht" prefix="Read More" >}}

### CHT Applications
Comprehensive reference material on CHT concepts and features, useful for anyone interested in understanding what features and configuration options are available for CHT apps. This section also includes quick guides on focused app development topics, and a growing collection of thorough step-by-step tutorials for developing and deploying digital health apps with the Community Health Toolkit. If you're a developer and want to dive right into developing your own app, this is the place to start.

{{< see-also page="apps" prefix="Read More" >}}

### CHT Core Framework
An overview and reference for development of the Core Framework of the Community Health Toolkit (CHT). Most CHT App developers are able to build great experiences for their users without extending CHT Core, but you might still find this section useful for its [overview of CHT components]({{< ref "core/overview" >}}).

{{< see-also page="core" prefix="Read More" >}}

### Design System
An overview of key end user personas, notes on the CHT icon library, and configuration best practices for forms, tasks, targets, and contact profiles. These materials include more detail than you will need when you're just beginning to explore the CHT, but they become increasingly helpful when designing your own community health app for a live deployment.

{{< see-also page="design"  prefix="Read More" >}}

### Have Questions?
Want to learn alongside a community of users? Join our community forum and let us know how we can help! And if you like what you see, don’t forget to star [our Github repo](https://github.com/medic/cht-core) :)

<br />

{{% alert title="Feedback appreciated!" %}}
This docs site is continually changing in response to great community feedback. If you notice a need for any corrections, or would like to see additional content on a particular topic, please feel free to use the **Create Documentation Issue** link in the upper right corner of your window.
{{% /alert %}}
