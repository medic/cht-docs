---
title: "Defining Care Guides"
weight: 3
date: 2017-01-05
description: >
  Setting the care guides that users can access from contact profiles
---

Each care guide accessible from a contact profile is defined as an [App Form](). Context information can be provided to forms via the `context` object of `contact-summary.templated.js`.

To show an App Form on a contact's profile, the form's `expression` field in its properties file must evaluate to true for that contact. The context infomation from the profile is accessible as the variable `summary`.

The context data is also available directly within the app forms' XForm calculations, as `instance('contact-summary')/context/${variable}`. For instance if `context.is_pregnant` is used in the contact summary, it can be accessed in an XForm field's calculation as `instance('contact-summary')/context/is_pregnant`. Note that these fields are not available when editing a previously completed form, or when accessing the form from outside of the profile page.

See [How to configure profile pages]() and [How to build app forms]() for examples and more information. 