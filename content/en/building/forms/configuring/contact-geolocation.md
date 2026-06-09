---
title: "Capture GPS Location in Contact Forms"
linkTitle: "GPS Location Capture"
weight: 9
description: >
  Configure a geolocation widget in contact forms to capture GPS coordinates when a contact is created or edited
relatedContent: >
  building/forms/contact
  building/contact-management/contacts
---

Contact forms can capture the device's GPS location at the time a contact is created or edited. The geolocation widget handles the full capture experience — progress feedback, success and failure states, and retry — and stores the result on the contact document.

An optional _context question_ lets the CHW record where they are relative to the beneficiary at capture time (for example, at the home or workplace). When GPS capture succeeds, the context answer is stored alongside the coordinates in the geolocation log.

> [!NOTE]
> Added in CHT `TBD`.

## XForm configuration

If including the context question, four changes are required in the contact form XML: model fields, binds, body group, and translations. Without the context question, only the first three are needed. The context question is optional — see [Omitting the context question](#omitting-the-context-question).

### 1. Model instance

Add both fields inside the contact's instance node:

```xml
<geo_capture/>
<geo_context/>
```

### 2. Binds

Add a bind for each field. It is recommended to mark `geo_context` as required so that form submission is blocked as a fallback if the CHW bypasses the widget. The widget independently enforces this by disabling the capture button until the context question is answered, so `required="true()"` is belt-and-suspenders rather than a widget requirement:

```xml
<bind nodeset="/data/contact/geo_capture" type="string"/>
<bind nodeset="/data/contact/geo_context" type="string" required="true()"/>
```

Replace `/data/contact/` with the actual nodeset path for the contact group in your form.

### 3. Body

Add both fields inside a `field-list` group with the context question **above** the capture widget. Both fields must be in the same group so the widget can read the context selection at save time:

```xml
<group appearance="field-list" ref="/data/contact">
  <select1 ref="/data/contact/geo_context" appearance="geolocation-context">
    <label ref="jr:itext('/data/contact/geo_context:label')"/>
    <item>
      <label ref="jr:itext('/data/contact/geo_context:option0')"/>
      <value>home</value>
    </item>
    <item>
      <label ref="jr:itext('/data/contact/geo_context:option1')"/>
      <value>workplace</value>
    </item>
    <item>
      <label ref="jr:itext('/data/contact/geo_context:option2')"/>
      <value>other</value>
    </item>
  </select1>
  <input ref="/data/contact/geo_capture" appearance="geolocation-capture">
    <label ref="jr:itext('/data/contact/geo_capture:label')"/>
  </input>
</group>
```

The `appearance` values `geolocation-context` and `geolocation-capture` are the contract between the form and CHT. The field names (`geo_capture`, `geo_context`) can be anything — only the appearances matter.

### 4. Translations

Add label text for each language your deployment supports in the `<itext>` section:

```xml
<translation lang="en">
  <text id="/data/contact/geo_capture:label">
    <value>Capture GPS location</value>
  </text>
  <text id="/data/contact/geo_context:label">
    <value>Where are you capturing GPS location?</value>
  </text>
  <text id="/data/contact/geo_context:option0">
    <value>At the beneficiary's home</value>
  </text>
  <text id="/data/contact/geo_context:option1">
    <value>At the beneficiary's workplace</value>
  </text>
  <text id="/data/contact/geo_context:option2">
    <value>Other</value>
  </text>
</translation>
```

## XLSForm equivalent

> [!WARNING]
> This section has not been tested against a real cht-conf XLSForm conversion. Verify the output before using it in a deployment.

For forms built with XLSForm, add the following rows to the **survey** sheet within the existing contact group. The context row must come before the capture row, and both must be in the same `field-list` group.

| type | name | label::en | appearance | required |
|------|------|-----------|------------|----------|
| select_one geo_context_choices | geo_context | Where are you capturing GPS location? | geolocation-context | yes |
| string | geo_capture | Capture GPS location | geolocation-capture | |

Add the following rows to the **choices** sheet:

| list_name | name | label::en |
|-----------|------|-----------|
| geo_context_choices | home | At the beneficiary's home |
| geo_context_choices | workplace | At the beneficiary's workplace |
| geo_context_choices | other | Other |

## Widget behavior

Once the form is configured, the widget handles the capture experience automatically.

**Before capture:**
- The context question is displayed as a radio button group
- The capture button is disabled until the CHW selects a context option

**When the CHW taps the capture button:**
- The context question is hidden
- A progress bar fills over up to 30 seconds while GPS is acquired

**On success:**
- The progress bar turns green with a success message
- `geo_capture` is set to `"captured"`
- The CHW can proceed to the next page

**On failure:**
- The progress bar turns red with a failure message
- **Retry** and **Continue without location tracking** buttons appear
- Tapping **Retry** resets the progress bar and tries again
- Tapping **Continue without location tracking** sets `geo_capture` to `"not_captured"` and skips GPS storage; `geo_context` is still saved to the contact document

**On Android when location permission is denied:**

- The capture button is not shown
- Instead, the widget displays the message: "Location access is turned off. Check your device settings to enable it."
- No form configuration is required for this behavior — it is handled automatically

## What gets stored

When the form is submitted, the following fields are written to the contact document. The names `geo_capture` and `geo_context` are from the examples above — your form may use different names.

| Field | Value | Notes |
|-------|-------|-------|
| `geo_capture` (example; field name is arbitrary) | `"captured"` or `"not_captured"` | Normal form field |
| `geo_context` (example; field name is arbitrary) | The selected choice value (for example, `"home"`) | Normal form field; present even when GPS fails |
| `geolocation` | GPS coordinates object, or error object on failure | Written by CHT at save time |
| `geolocation_log` | Array of capture events | Append-only; grows on subsequent edits |

Each entry in `geolocation_log` has this shape:

```json
{
  "timestamp": 1234567890000,
  "recording": { "latitude": 1.23, "longitude": 4.56, "accuracy": 10 },
  "context": "home"
}
```

`context` is only written to a log entry when GPS capture succeeds. If capture fails, `geo_context` is present on the contact document as a form field but `geolocation_log[n].context` is absent.

## Customizing context choices

The context choices are defined in the XForm and can be changed per deployment. The defaults (`home`, `workplace`, `other`) are a suggested baseline. To add, remove, or relabel choices, edit the `<item>` elements and their corresponding `<text>` entries in `<itext>`.

The widget identifies the context question by `appearance="geolocation-context"` — not by field name or choice values — so the choices are fully customizable.

## Omitting the context question

The context question is optional. If a form includes the capture widget (`appearance="geolocation-capture"`) without a context field (`appearance="geolocation-context"`) in the same group, the capture button is enabled immediately and no context is stored. GPS coordinates are still captured and stored normally.
