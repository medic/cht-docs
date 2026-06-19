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

Contact forms can capture the device's GPS location at the time a contact is created or edited. The geolocation widget handles the full capture experience: progress feedback, success and failure states, and retry. It stores the result on the contact document.

The widget includes an embedded context question ("Home" or "Other") that records where the CHW is relative to the beneficiary at capture time. This is part of the widget and requires no additional XForm fields.

_Added in CHT `TBD`._

> [!CAUTION]
> This widget is designed for contact forms only. Adding it to a report form is unsupported and may produce unexpected behavior.

## XForm configuration

Three changes are required in the contact form XML: a model field, a bind, and a body element.

### 1. Model instance

Add the capture field inside the contact's instance node:

```xml
<geo_capture/>
```

### 2. Bind

Add a bind for the capture field:

```xml
<bind nodeset="/data/contact/geo_capture" type="string" required="true()"/>
```

Replace `/data/contact/` with the actual nodeset path for the contact group in your form. The `required="true()"` attribute is recommended. The widget independently prevents the CHW from proceeding without a result, so this acts as a belt-and-suspenders fallback at submission.

### 3. Body

Add the field inside a `field-list` group:

```xml
<group appearance="field-list" ref="/data/contact">
  <input ref="/data/contact/geo_capture" appearance="geolocation-capture">
    <label ref="jr:itext('/data/contact/geo_capture:label')"/>
  </input>
</group>
```

The `appearance="geolocation-capture"` value is the contract between the form and CHT. The field name (`geo_capture` in this example) can be anything; only the appearance matters.

### Translations

Add a label for the capture field in the `<itext>` section for each language your deployment supports:

```xml
<translation lang="en">
  <text id="/data/contact/geo_capture:label">
    <value>Capture GPS location</value>
  </text>
</translation>
```

## XLSForm equivalent

> [!WARNING]
> This section has not been tested against a real cht-conf XLSForm conversion. Verify the output before using it in a deployment.

For forms built with XLSForm, add the following row to the **survey** sheet within the existing contact group:

| type   | name        | label::en            | appearance          | required |
|--------|-------------|----------------------|---------------------|----------|
| string | geo_capture | Capture GPS location | geolocation-capture | yes      |

## Widget behavior

Once the form is configured, the widget handles the capture experience automatically.

**Before capture:**

- The widget displays a capture button and an embedded context question with two options
- The CHW selects a context option before tapping the capture button

**When the CHW taps the capture button:**

- The context question is hidden
- A progress bar fills over up to 30 seconds while GPS is acquired

**On success:**

- The progress bar turns green with a success message
- `geo_capture` is set to `"captured"`
- The CHW can proceed to the next page

**On failure (GPS signal weak):**

When GPS acquisition fails due to a weak or unavailable signal:

- The progress bar turns red
- A warning appears above the buttons prompting the CHW to move to an area with better signal
- A retry button and a button to skip location capture appear
- The skip button is disabled until the CHW checks an acknowledgement confirming the contact will be saved without a location
- Tapping the retry button resets the progress bar and tries again
- Tapping the skip button sets `geo_capture` to `"skipped"`; no coordinates are stored

**On Android when location permission is denied:**

- The capture button is not shown
- The widget displays a message informing the CHW that location access is disabled and directing them to their device settings
- No form configuration is required. This behavior is handled automatically.

## Edit mode

When a contact already has at least one successful GPS capture on record, editing that contact activates a different widget state. No additional XForm configuration is required.

**Edit mode UI:**

- A green badge is shown indicating the location is already saved, along with the capture context (home or other) and the number of days since the last capture
- Two radio options appear: an option to keep the existing location (pre-selected) and an option to capture a new location

**Capturing a new location in edit mode:**

- Selecting the option to capture a new location reveals a confirmation prompt asking the CHW to verify their location, along with an acknowledgement checkbox
- The CHW must check the acknowledgement before capture begins automatically
- If GPS acquisition fails, tapping the skip button returns the CHW to the keep/capture radio choice. The existing location is never discarded.

**Contacts with only failed captures:**

- A contact whose prior captures all failed (for example, permission denied) is treated the same as a contact with no location; the standard create-mode UI is shown instead of the badge

## What gets stored

When the form is submitted, the following fields are written to the contact document. The name `geo_capture` is from the example above; your form may use a different name.

| Field | Value | Notes |
|-------|-------|-------|
| `geo_capture` (example; field name is arbitrary) | `"captured"` or `"skipped"` | Normal form field |
| `geolocation` | GPS coordinates object | Written by CHT at save time; only present when a home capture succeeds |
| `geolocation_log` | Array of capture events | Append-only; grows on subsequent edits |

Each entry in `geolocation_log` has this shape:

```json
{
  "timestamp": 1234567890000,
  "recording": { "latitude": 1.23, "longitude": 4.56, "accuracy": 10 },
  "is_home": true
}
```

`is_home` is `true` for home captures and `false` for other-context captures. On GPS failure, `recording` will be an error object (`{ "code": 2, "message": "..." }`) and `is_home` will not be present.

`geolocation` is only updated when GPS capture succeeds and the CHW selected the home option. When the CHW selects the other option, coordinates are written to `geolocation_log` only.
