---
title: "Hiding Form Content"
linkTitle: "Hiding Form Content"
weight: 4
description: >
  Controlling visibility of questions within a form
relatedContent: >
  building/forms
  building/forms/configuring/form-inputs
---

There are several different ways to control visibility of questions and other content within a form.  


## Conditionally hiding fields

Expressions in the [`relevant` column](https://docs.getodk.org/form-logic/#conditionally-showing-questions) can be used to dynamically control the visibility of questions, groups, etc. When the expression evaluates to `true`, the content is shown; when it evaluates to `false`, the content is hidden. This allows for showing/hiding content based on previous answers or other data in the form. The relevancy of a group is inherited by the fields it contains. So, when a group is non-relevant, all of its contents will also be considered non-relevant.

When the form is completed, values for non-relevant fields will _NOT be stored in the database._

## Fields hidden by default

[Several types of fields](https://docs.getodk.org/form-question-types/#hidden-questions) are never visible to the user. 

### `calculate` type

[`calculate` fields](https://docs.getodk.org/form-logic/#calculations) are useful for storing data the user does not need to see but are referenced/used elsewhere in the form. The value contained in a `calcuate` field will be stored in the database when the form is completed.

The `calcuate` type is appropriate for fields with a defined initial value or whose value is calculated by the form logic. When a `calculate` field is definied in a form, it must have a value set in either the `calculation` or the `default` column.

### `hidden` type

In some cases, a hidden field is needed, but there are no `calculation` or `default` value to set. In this case, the `hidden` type can be used. The value contained in a `hidden` field will be stored in the database when the form is completed.

When loading existing contact data into a form with the [contact selector](/building/forms/configuring/form-inputs/#contact-selector), `hidden` fields can be used to capture contact properties that should be stored when the form is saved, but not shown to the user.

## `hidden` appearance

The CHT supports a custom `hidden` appearance on questions and groups that can be used to hide the associated UI elements when the form is rendered. This is useful for fields that should be included in the form's data model _and display template_ but should not be visible to the user when filling out the form. Values for fields with the `hidden` appearance will be stored in the database when the form is completed.

Several of the [custom CHT form widgets](/building/forms/app/#cht-xform-widgets) need the associated field to exist in the form's display template (and so cannot be used with the `calculate` or `hidden` types). In these cases you can use a standard question type (e.g. `text`) and an `appearance` value of `hidden`.

The `hidden` appearance can also be set on a group to hide all the contents of the group.

{{< callout type="info" >}}
Setting the `hidden` appearance on a top-level group will prevent an extra blank page from being rendered for that group. However, due to performance optimizations in the Enekto library, for this to work, the form must include at least one `relevant` expression. (Otherwise, Enketo will automatically bypass all logic for hiding pages.) A `relevant` expression for any field in the form is enough. Alternatively, just set `boolean(true)` as the `relevant` value for the hidden group.

| type        | name        | appearance | relevant      |
|-------------|-------------|------------|---------------|
| begin_group | hidden_page | hidden     | boolean(true) |

Note that just setting `true`/`true()`/etc as the appearance is not enough since Enketo will still bypass the relevancy logic.
{{< /callout >}}
