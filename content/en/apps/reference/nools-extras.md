---
title: "nools-extras.js"
weight: 5
description: >
  **Nools Extras**: Helper variables and functions for Tasks and Targets
relatedContent: >
  apps/reference/targets
  apps/reference/tasks
---

Helper variables and functions defined in `nools-extras.js` can be used by both [`tasks.js`]({{< ref "apps/reference/tasks.js" >}}) and [`targets.js`]({{< ref "apps/reference/targets.js" >}}).

The following global variables can be used:

| Variable | Description |
|---|---|
| `c.contact` | The contact's doc. All contacts have `type` of either `person` or `place`.
| `c.reports` | An array of all the reports submitted about the contact.
| `console` | Useful for outputting _debugging_ statements. Should not be used in production code. |
| `Utils` | Set of commonly used helper functions, described in the [Utils section]({{< ref "apps/reference/tasks#utils" >}}). |
