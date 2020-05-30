---
title: "Forms"
linkTitle: "Forms"
weight: 1
description: >
  Building block for all CHT apps
keywords: app-forms contact-forms collect-forms json-forms
---

Forms are a building block of all CHT apps. They are used when creating or editing contacts, and when completing a care guide or survey within the app. Forms are also used to interpret SMS interactions with the CHT. 

There are different types of forms:
- [**Contact Forms**]({{< ref "contact-forms" >}}): used to create and edit contacts. Defined as CHT-enhanced XForms.
- [**App Forms**]({{< ref "app-forms" >}}): serve as actions within the app, such as a task or an action. Defined as CHT-enhanced XForms.
- [**Collect Forms**]({{< ref "collect-forms" >}}): used to render forms in Medic Collect. Defined as ODK XForms and need a corresponding JSON form to receive data in CHT.
- [**JSON Forms**]({{< ref "json-forms" >}}): used for data coming from external channels such as SMS, or via interoperability with other tools. Defined according to a JavaScript Object Notation schema.

Forms that can be completed in the app are built using a CHT-enhanced version of [ODK XForms](https://opendatakit.github.io/xforms-spec/) notation -- a XML definition of the structure and format for a set of questions. Since writing raw XML can be tedious, the [XLSForm standard](http://xlsform.org/) is commonly used to define forms. The [medic-conf](https://github.com/medic/medic-conf) command line tool can be used to convert to the XForm format and include the form in a CHT application. The instructions on this site assume some knowledge of XLSForm.