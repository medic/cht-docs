---
title: "Forms"
linkTitle: "Forms"
weight: 3
description: >
  Building block for all CHT apps
keywords: app-forms contact-forms collect-forms json-forms
relatedContent: >
  apps/concepts/care-guides
  apps/guides/forms
  apps/reference/forms
  apps/reference/app-settings/forms
---

Forms are a building block of all CHT apps. They are used when creating or editing contacts, and when completing a care guide or survey within the app. Forms are also used to interpret SMS interactions with the CHT. 

When a completed form is submitted, it is treated as a Report in the app. All reports can be viewed in the [Reports tab]({{< ref "apps/features/reports" >}}) by those with the proper access within the [hierarchy]({{< ref "apps/concepts/hierarchy" >}}).

There are four different types of forms:
- [**Contact Forms**]({{< ref "apps/reference/forms/contact" >}}): used to create and edit contacts. Defined as CHT-enhanced XForms.
- [**App Forms**]({{< ref "apps/reference/forms/app" >}}): serve as actions within the app, such as a task or an action. Defined as CHT-enhanced XForms.
- [**Collect Forms**]({{< ref "apps/reference/forms/collect" >}}): used to render forms in Medic Collect. Defined as ODK XForms and need a corresponding JSON form to receive data in CHT.
- [**JSON Forms**]({{< ref "apps/reference/app-settings/forms" >}}): used for data coming from external channels such as SMS, or via interoperability with other tools. Defined according to a JavaScript Object Notation schema.

Forms that can be completed in the app are built using a CHT-enhanced version of [ODK XForms](https://opendatakit.github.io/xforms-spec/) notation -- a XML definition of the structure and format for a set of questions. Since writing raw XML can be tedious, the [XLSForm standard](http://xlsform.org/) is commonly used to define forms. The [cht-conf](https://github.com/medic/cht-conf) command line tool can be used to convert to the XForm format and include the form in a CHT application. The instructions on this site assume some knowledge of XLSForm.