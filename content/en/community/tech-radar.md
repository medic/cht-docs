---
title: "CHT Technology Radars"
linkTitle: "Tech Radar"
weight: 3
description: >
  Technology Radars for contributors and implementers
aliases:
  -    /contribute/tech-radar
---

{{< hextra/hero-subtitle >}}
  Technology Radars for contributors and implementers
{{< /hextra/hero-subtitle >}}

It is essential for a development toolkit such as the Community Health Toolkit to constantly improve and keep track with the latest useful innovations. It is important to openly look for innovations and new technologies and to question established technologies and methods every now and then.

To enhance visibility and clarity on the technology choices, the technological strategy, and the available CHT features and tools, we leverage a framework called **Technology Radar**.

A Technology Radar provides an easy-to-grasp visual representation of tools, languages, frameworks, platforms, and techniques, as well as features and functionalities we use to build the CHT. Additionally, the Technology Radar provides a **degree of adoption** and guidelines on using (or not using) a particular technology. The community can leverage it to answer questions like: *What's the difference between technologies such as Klipfolio, Superset, and Grafana*? *Should we use cht-couch2pg or cht-sync for our project*?

While reflecting on the audience of such a tool, we’ve identified the need to build two separate versions: a **CHT Technology Radar for Implementers** and a **CHT Technology Radar for Contributors**. We leverage existing open-source tools by [ThoughtWorks](https://github.com/thoughtworks/build-your-own-radar) and [AOE](https://github.com/AOEpeople/aoe_technology_radar) to implement the user interface. Due to our commitment to open-source, all the content of the Technology Radars is public on GitHub and open to the community to provide comments and suggestions.

## For Implementers
The [CHT Technology Radar for Implementers](https://docs.communityhealthtoolkit.org/cht-tech-radar-implementers/index.html) provides a view of all CHT-related tools and components so that CHT implementers and application developers can decide which to use when designing, developing, and hosting their CHT applications.

We categorized this radar’s content into four quadrants:

* **App Building**: These components help build CHT apps, like CHT Conf, and form preview/builder tools like XLSForm.
* **CHT App Features**: Aspects of CHT Core Framework that can be used in CHT Apps. These could include new CHT form widgets, updated UI elements like the floating action button, and user management features.
* **Data Use**: This includes tools and components used to manage data that comes in or out of the CHT. It also includes integrations, interoperability standards and methods, ETL, Pipeline, and querying techniques. Additionally, this quadrant contains visualization tools for dashboards.
* **Deployment Management**: Deploying and maintaining CHT instances takes considerable coordination, especially for large-scale deployments. This quadrant also includes key aspects for hosting, including tools and methods for alerts and monitoring.

We classify each of the items above in one of these rings:

* **Adopt**: The Adopt ring represents tools that you should seriously consider using. We don't say you should use these for every project; one should only use a tool in an appropriate context. However, an item in the Adopt ring represents something where there's no doubt it's proven and mature for use with the CHT.
* **Trial**: The Trial ring is for tools ready for use but only partially proven as those in the Adopt ring. You should use these on a trial basis to decide whether they should be part of your toolkit. Others may already be using these items in production, likely as early adopters of the tools.
* **Stop**: The Stop (or Not Recommended) ring is for things we think implementers should avoid using or look for ways to move off of. These include items for which a better alternative is available, or where the item is found to not work correctly with the CHT.

You can learn how to contribute to the CHT Technical Radar for Implementers in the related [GitHub repository](https://github.com/medic/cht-tech-radar-implementers).

## For Contributors
The [CHT Technology Radar for Contributors](https://docs.communityhealthtoolkit.org/cht-tech-radar-contributors/index.html) provides a helpful view for developers to know what languages, tools, platforms, or techniques to use while contributing to CHT tools.

We categorized this radar’s content into four quadrants:

* **Languages & Frameworks**: Include development languages and more low-level development frameworks, which help implement custom software of all kinds.
* **Tools**: These can be components, like databases, software development tools, such as version control systems.
* **Techniques**: Include elements of a software development process, such as continuous integration, and ways of creating software, such as progressive web applications.
* **Platforms**: There are things that we build software on top of, such as mobile technologies like Android or generic kinds of platforms like Amazon Web Services.

We classify each of the items above in one of these rings:

* **Adopt**, **Trial**, **Stop**. These adoption degrees have the same usage recommendation as the ones for the CHT Technology Radar for Implementers above.
* **Assess**: The Assess ring contains items to look at closely, but not necessarily trial yet - unless you think they would be a particularly good fit for you. Typically, items in the Assess ring are interesting and worth keeping an eye on.

You can learn how to contribute to the CHT Technical Radar for Contributors in the related [GitHub repository](https://github.com/medic/cht-tech-radar-contributors).
