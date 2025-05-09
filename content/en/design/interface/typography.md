---
title: "Typography"
linkTitle: "Typography"
weight: 3
description: >
  Typography is the design of type in ways that provides innate hierarchy to UI
---

{{< hextra/hero-subtitle >}}
  Design of type in ways that provides innate hierarchy to UI
{{< /hextra/hero-subtitle >}}

The default CHT app font is [Noto Sans](https://www.google.com/get/noto/). It is free, codepen source, supports 800 languages and was specifically designed for good web legibility. It is bundled with the app so that all users see the same font regardless of their particular device, language, browser, etc. This ensures a consistent experience for all users.

* Most text in the app should be the `@text-normal-color: @gray-ultra-dark color`.
* The lighter text color `@text-secondary-color: @gray-dark)` is used for labels and condition card filters.
* Hyperlinked text color is `@text-hyperlink-color: @blue-dark)`. 

H1 is the highest hierarchical level of text, and should be used sparingly. It is used for the large text underneath percentage bars.

H2 is used as a header style for main content sections on the right-hand side, such as a task title, the name of a person/place on their profile, or the title of a targets widget.

H3 is used for titles of condition cards and section titles on the form summary page.

H4 is the default type size, and should be used for all normal body text throughout the app. Most text should be H4 in size. When in doubt, use H4.

H5 is a smaller body text size that we use sparingly in places where space is tight, such as timestamps in the upper right of content rows, condition card filter text, “belongs to” breadcrumbs, and targets goal labels.

{{< codepen PoZObmY >}}
