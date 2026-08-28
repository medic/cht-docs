---
title: "Field Path Linting"
sidebar:
  exclude: true
hide_summary: true
---

_Added in `cht-conf` `6.6.0`._

The `field_path_linting` properties enable validation checks of form fields. The checks run during form validation, which `cht-conf` performs by default before uploading a form.

Field paths are the `nodeset` values in the converted XForm. Every field is checked, including hidden and calculated fields.

| Property        | Description                                                                                          | Required |
|-----------------|------------------------------------------------------------------------------------------------------|----------|
| `warn_length`   | Integer. Warns about any field paths with at least this many characters.                             | no       |
| `error_length`  | Integer. Fails validation for any field paths with at least this many characters.                    | no       |
| `ignore_list`   | Array of field paths to exclude from all of these checks.                                            | no       |
| `reserved_list` | Array of field paths that must not exist in the form. Validation fails if any of them match a field. | no       |

A path's length is the length of the whole path, including the leading `/data`. (Note the `/data` prefix is optional on the configured field paths. `/data/my_field`, `/my_field` and `my_field` are all considered the same.)

Omitting `field_path_linting`, or setting it to an empty object, runs none of these checks.

### Code sample

#### `forms/app/assessment.properties.json`
```json
"field_path_linting": {
  "warn_length": 50,
  "error_length": 63,
  "ignore_list": [ "inputs/contact/parent/parent/contact/phone" ],
  "reserved_list": [ "group_summary/select", "group_summary/order" ]
}
```
