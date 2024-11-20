---
title: Reports
weight: 6
description: >
  Reports for Data & Report Management
relatedContent: >
  building/reference/app-settings/patient_reports
  building/guides/data/invalid-reports
  building/forms/configuring/report-titles
aliases:
   - /apps/features/reports/
---

The Reports tab is where you can access submitted data. Depending on how often you anticipate a user needing to access this tab, you can configure it to show in the main tabs list (preferable for admin users) or in the secondary hamburger menu (preferable for CHW users). 

The permissions set for your role and your placement in the hierarchy will determine which reports you’re able to see on this tab. As a rule, you can only view reports submitted by yourself or those below you in the [hierarchy]({{< ref "building/workflows/hierarchy" >}}). Therefore, CHWs will only see reports that they submitted on this tab, while supervisors will see reports that they submitted as well as those submitted by their CHWs. Advanced configuration options are available for a specific off-line user role to manage what [level of report data]({{< ref "building/guides/performance/replication#report-depth" >}}) is copied to their device. 

{{< figure src="reports-mobile.png" link="reports-mobile.png" class="left col-3 col-lg-3" >}}

{{< figure src="reports-desktop.png" link="reports-desktop.png" class="left col-9 col-lg-9" >}}

## Main List

{{< figure src="reports-mobile.png" link="reports-mobile.png" class="right col-6 col-lg-3" >}}

The first line of bold text is the name of the person whom the report is about. The second line of text is the name of the report, and the third line of text is the hierarchy of place to which that person belongs. In the upper right corner, a timestamp displays when the report was submitted. Reports are sorted by submission date, with the most recent reports at the top. If a report is unread, the timestamp will be bold blue and there will be a horizontal blue line above it. 

Apps built with the Core Framework have a “review” feature that allows managers to indicate whether a report has been reviewed and if it contains errors. If a manager has marked a report as “correct,” a green checkmark will show below the timestamp. If a report is marked as “has errors,” a red ‘X’ will show. This same icon is used for invalid SMS messages.

<br clear="all">


## Filters & Search

The toolbar at the top of the page includes filters and search to help users narrow down the list or search for and find a specific report. These filters are configurable and could include:

- **Report Types** (e.g. pregnancy registration, visits, delivery report)
- **Places** (e.g. districts, health centers or CHW areas)
- **Date of Submission**
- **Status** (e.g. not reviewed, has errors, correct, valid SMS, invalid SMS)

Using the search box, you can search for reports by patient name, phone number, ID number and more. To reset the filters and view the full list of forms, click on "Reset" located in the filter sidebar.

{{< figure src="reports-search.png" link="reports-search.png" class="left col-3 col-lg-3" >}}

{{< figure src="reports-search-reset.png" link="reports-search-reset.png" class="left col-9 col-lg-9" >}}

<br clear="all">

{{% alert title="Note" %}} A new user experience for Filter and Search was introduced in v3.17. The previous version can be re-enabled for users by adding the [permission]({{< ref "building/reference/app-settings/user-permissions" >}}) `can_view_old_filter_and_search` to the user's role; however, the old version should be considered deprecated and will be completely removed in a future release. See [Feature Flags]({{< ref "building/guides/updates/feature-flags" >}}) documentation for more info {{% /alert %}}

<br clear="all">


## Action Buttons

The action buttons at the bottom of the screen are configurable using [permissions]({{< ref "building/reference/app-settings/user-permissions" >}}). Options include submit, edit, delete, review and export reports.

Clicking on the “Export” button will download a CSV file with all the data from the reports. And clicking the “+ Submit report” button opens a menu of forms a user can choose to complete.

{{< figure src="reports-desktop.png" link="reports-desktop.png" class="left col-9 col-lg-9" >}}

<br clear="all">

## Bulk Delete Reports

Allows the user to select multiple reports and delete them. **Please Note**: This action cannot be undone. If in doubt, do not delete! You can restrict a user’s access to this feature by disabling the [permission]({{< ref "building/reference/app-settings/user-permissions" >}}) `can_bulk_delete_reports`.

{{< figure src="reports-bulk-mobile.png" link="reports-bulk-mobile.png" class="left col-3 col-lg-3" >}}

{{< figure src="reports-bulk-desktop.png" link="reports-bulk-desktop.png" class="left col-9 col-lg-9" >}}

<br clear="all">


## Detail Pages

{{< figure src="reports-detail.png" link="reports-detail.png" class="right col-6 col-lg-3" >}}

You can click on any report to view a report detail page. Here you'll find the name and phone number of the user who submitted the report as well as responses to the questions within it. If the report initiated a schedule of SMS messages, you will see the messages queued to send.

The buttons at the bottom are configurable. The ones you see will depend on your user role, permissions, and hierarchy. 

- **Send a Message**​: Opens the Messages page to send a message to the person who submitted the report
- **Review**: Mark as “correct” or “has errors”
- **Edit**: Opens the form to edit it
- **Delete**: Deletes a report ( cannot be undone)

<br clear="all">


## Defining Forms

The reports shown in your app are the completed and submitted *forms*. These forms must be defined and included with the application. There are two types of form definitions for reports:
- **App forms**: actions within the app, such as a completed task, or an action on a contact's profile or reports tab. App forms are defined as [XForms]({{< ref "building/forms/app" >}}).
- **JSON forms**: data coming from external channels such as SMS, or via interoperability with other tools. JSON forms are defined using a [JavaScript Object Notation schema]({{< ref "building/reference/app-settings/forms" >}}). 


