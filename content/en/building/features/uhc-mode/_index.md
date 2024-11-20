---
title: "Universal Health Coverage Mode"
linkTitle: UHC Mode
weight: 11
description: >
  Supporting equitable and timely care to families to increase Universal Health Coverage (UHC)
relatedContent: >
  building/forms/configuring/uhc-mode
  building/reference/app-settings/user-roles
  building/reference/app-settings/user-permissions
aliases:
   - /apps/features/uhc-mode/
---

{{% pageinfo %}}
CHT apps using the _UHC Mode_ empower CHWs to provide equitable and timely care to families in their catchment area. This feature was [codeveloped with Muso](https://www.musohealth.org/post/new-study-demonstrates-how-digital-health-tools-can-enable-progress-towards-universal-health-care), and showed an increase in household coverage for both rural and peri-urban settings, thereby increasing the effectiveness of CHWs and improving access to care for the populations they serve. 
{{% /pageinfo %}}

## UHC with the CHT
Apps built using the Community Health Toolkit can be used in support of community-based services, and increase Universal Health Coverage (UHC) by helping health workers regularly reach all the families that they care for. A Muso study in collaboration with Medic, [showed an increase in household coverage](https://drive.google.com/file/d/1fXruezV7sCo-CtJfi8WDivzgMcKZNdXM/view): _UHC Mode should be considered an effective tool that can improve minimum expected home visit coverage and promote progress towards UHC when implemented in the proactive community case management context._

## Prioritizing Households
{{< figure src="UHC.gif" link="UHC.gif" alt="UHC Mode screenshot" class="right col-6 col-lg-3" >}}
{{< figure src="sort-dropdown.png" link="sort-dropdown.png" alt="Contact sorting screenshot" class="right col-6 col-lg-3" >}}

The _UHC Mode_ in the CHT allows health workers to see when a household within their care area was last visited, and prioritize visits accordingly.

When using the _UHC Mode_, the households in the contact list can be sorted by when they were last visited. The days since the last visit is also shown in the app, along with the number of visits made to a household in a month period. 

## Configurability
The last visited date is calculated based on the number of days since an action was taken for that household, and the number of visits reflects the actions taken for that household in the current month. What constitutes as an action for a household, along with the start date for the reporting period, [are configurable]({{< relref "building/forms/configuring/uhc-mode" >}}) to CHT app developers.
