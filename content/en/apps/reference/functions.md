<!-- ---
title: "Functions"
linkTitle: "Functions"
weight: 5
description: >
  Utility and helper functions for tasks, targets, and contact pages
keywords: tasks targets contacts
--- -->

## Utils
Utility functions in the Core Framework can make common tasks much easier. These are available only for Tasks and Targets. To use the function call `Utils.<function-name>(<params>)`, for example `Utils.addDate(report.reported_date, 10)`.

| Name | Description |
|---|---|
| `isTimely(date, event)` | Returns true if the given date is after the start date and before the end date of the event. |
| `addDate(date, days)` | Returns a new Date set to midnight the given number of days after the given date. If no date is given the date defaults to today. |
| `getLmpDate(doc)` | Attempts to work out the LMP from the given doc. If no LMP is given it defaults to four weeks before the reported_date. |
| `getSchedule(name)` | Returns the task schedule with the given name from the configuration. |
| `getMostRecentTimestamp(reports, form)` | Returns the reported_date of the most recent of the reports with form ID matching the given form. |
| `getMostRecentReport(reports, form)` | Like `getMostRecentTimestamp` but returns the report, not just the reported_date. |
| `isFormSubmittedInWindow(reports, form, start, end)` | Returns true if any of the given reports are for the given form and were reported after start and before end. |
| `isFirstReportNewer(firstReport, secondReport)` | Returns true if the firstReport was reported before the secondReport. |
| `isDateValid(date)` | Returns true if the given date is a validate JavaScript Date. |
| `now()` | Returns the current Date. |
| `MS_IN_DAY` | A constant for the number of milliseconds in a day. |

{{% alert title="Note" color="info" %}}
Please open [an issue](https://github.com/medic/cht-core/issues/new) if you'd like other functions included.
{{% /alert %}}


## Nools Extras
Helper variables and functions can be defined in `nools-extras.js`, which is shared by both `tasks.js` and `targets.js`. The following are global variables that can be used:

| Variable | Description |
|---|---|
| `c.contact` | The contact's doc. All contacts have `type` of either `person` or `place`.
| `c.reports` | An array of all the reports submitted about the contact.
| `console` | Useful for outputting _debugging_ statements. Should not be used in production code. |
| `Utils` | Useful functions across projects are available, and describe in the Utils section. |

## Contact Summary Extras
Helper variables and functions for the contact summary can be defined in `contact-summary-extras.js`. There are several variables available to inspect to generate the summary information:

| Variable | Description |
|---|---|
| `contact` | The currently selected contact. This has minimal stubs for the `contact.parent`, so if you want to refer to a property on the parent use `lineage` below.| 
| `reports` | An array of reports for the contact. | 
| `lineage` | An array of the contact's parents (2.13+), eg `lineage[0]` is the parent, `lineage[1]` is the grandparent, etc. Each lineage entry has full information for the contact, so you can use `lineage[1].contact.phone`. | 

