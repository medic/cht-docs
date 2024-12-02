---
title: "Customizing Titles in the Reports List"
linkTitle: "Report Titles"
weight: 
description: >
  Customizing the title shown in the Reports list
relatedContent: >
  building/features/reports
  building/reference/app-settings/patient_reports
aliases:
   - /building/guides/forms/report-titles
   - /apps/guides/forms/report-titles
---

_Added in 3.9.0_

By default the CHT shows the name of the subject of the report in the reports list. This can be overridden by configuring the `subject_key` property with a translation key in the form document.

The translation uses a summary of the report as the evaluation context so you can include report fields in your value, for example: `Case registration {{case_id}}`. Useful properties available in the summary include: `from` (the phone number of the sender), `phone` (the phone number of the report contact), `form` (the form code), `subject.name` (the name of the subject), and `case_id` (the generated case id).

## Code Sample

```json
  "internalId": "signal",
  "title": "Signal signoff",
  "subject_key": "signal.list.subject",
```

