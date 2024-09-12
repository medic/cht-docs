---
title: "Configuring UHC Mode"
linkTitle: UHC Mode
weight: 5
description: >
  How to enable Universal Health Coverage monitoring with UHC Mode
relatedContent: >
  building/features/uhc-mode
  building/reference/app-settings/user-roles
  building/reference/app-settings/user-permissions
aliases:
   - /apps/guides/forms/uhc-mode
---

_Introduced in v2.18.0_

{{< figure src="UHC.gif" link="UHC.gif" alt="UHC Mode screenshot" class="right col-6 col-lg-3" >}}

The CHT's [UHC Mode]({{< relref "building/features/uhc-mode" >}}) empowers CHWs to provide equitable and timely care to families in their catchment area. The Community Health Toolkit supports this use-case by displaying the number of visits made to a household and highlighting households which haven't met their visit goal in red at the top of the contact list.

The date last visited is colored red whenever the date is 30 days or more in the past. The date last visited is displayed as a relative date. This period is described in terms of "days" up until two months, so "Visited 3 days ago" or "Visited 36 days ago". After two months, we simply say "2 months" or "3 months".

## Household Visits

{{< figure src="sort-dropdown.png" link="sort-dropdown.png" alt="Contact sorting screenshot" class="right col-6 col-lg-3" >}}

The date of the last visit is displayed and contacts can be sorted by last visit date to allow the CHW plan their work.

"Date last visited" and "Visits this month" are different data points:
- Date last visited is calculated based upon a rolling count of "how many days ago" and is not tied to the calendar at all.
- Visits this month are tied directly to the calendar.

## Configuration

Any patient- or household-level form or forms can be used to update the date last visited. You may run into performance issues if you configure this to look at forms submitted very frequently. For example, five forms submitted only once a month would work better than two forms submitted every day.

### UHC Permissions

To see the date last visited, grant the relevant user role (usually CHW) the `can_view_last_visited_date` permission. Once that permission is enabled, you'll be able to display the date the household was last visited in the list.

To view UHC metrics, the `can_view_uhc_stats` permission needs to be granted to the CHW user role.

```json
  "permissions": {
    "can_view_last_visited_date": [ "chwUserRole" ]
  },
```

### Forms

Indicate which forms should be included in the calculation of the date last visited. You can use forms at the person or household level. Add the `visited_contact_uuid` field to forms to track visits. This should be a `calculate` field that contains the place UUID of the visited contact. Ensure this is a top-level field and not in any group. When the form is submitted it would be seen as `doc.fields.visited_contact_uuid`.

### Settings

Information on when to begin counting visits, household visit goals, and default contact sorting is defined in `base_settings.json`.

| Setting              | Description | Default | Version |
|----------------------|---------|---------|---------|
| uhc.contacts_default_sort | <ul><li>"alpha": Sort contacts alphanumerically</li><li>"last_visited_date": sort contacts by the date they were most recently visited.</li></ul> | "alpha" | 2.18.0 |
| uhc.visit_count.month_start_date | The date of each month when the visit count is reset to 0. | 1 |2.18.0 |
| uhc.visit_count.visit_count_goal | The monthly visit count goal. | 0 | 2.18.0 |
