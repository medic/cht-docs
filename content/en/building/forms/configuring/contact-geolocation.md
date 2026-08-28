---
title: "Capture GPS Location in Contact Forms"
linkTitle: "Contact GPS Location Capture"
weight: 9
description: >
  Configure a geolocation widget in contact forms to capture GPS coordinates when a contact is created or edited
relatedContent: >
  building/forms/contact
  building/contact-management/contacts
---

Contact forms can capture the device's GPS location at the time a contact is created or edited. The geolocation widget handles the full capture experience automatically: it starts acquiring a position the instant the form renders, then shows progress, success, and failure states. It stores the result on the contact document.

After a successful capture, the widget asks whether the CHW is at the household or somewhere else, and records the answer alongside the coordinates.

_Added in CHT 5.3._

> [!CAUTION]
> This widget is designed for contact forms only. Adding it to a report form is unsupported and may produce unexpected behavior.
>
> The widget's default copy is written for households ("Household location already saved", "Change household location"... ). Nothing in the widget restricts it to household contacts specifically. It activates on any form field with an `appearance` column value of `geolocation-capture`, regardless of contact type. To use it on another contact type, override the `geolocation.edit.*`, `geolocation.at.household`, and `geolocation.somewhere.else` translation keys with wording appropriate to that contact type. Otherwise the household-specific default text shows through.

## What gets stored

When the form is submitted, CHT writes the following fields to the contact document.

| Field | Value | Notes |
|-------|-------|-------|
| `geolocation` | GPS coordinates object | Written by CHT at save time. Set to the new coordinates only after a successful home capture; left unchanged in every other case (when keeping an existing location, when adding a non-home capture, or a failed capture). Cleared only when removing an existing location. |
| `geolocation_log` | Array of capture events | Append-only; grows on subsequent edits |

Each entry in `geolocation_log` has this shape:

```json
{
  "timestamp": 1234567890000,
  "recording": { "latitude": 1.23, "longitude": 4.56, "accuracy": 10 },
  "is_home": true
}
```

`is_home` is set to `true` for home captures and `false` for other-context captures. On GPS failure, `recording` is an error object (`{ "code": 2, "message": "..." }`) and `is_home` is not present. `geolocation` itself never holds an error. On failure, any existing `geolocation` field on the contact is left untouched.

> [!NOTE]
> A failed GPS attempt is only logged to `geolocation_log` when the contact had no prior location: the create-flow "Save without location" path, or editing a contact with no existing location. Choosing **Remove household location** in edit mode never attempts a capture and never appends a log entry.

## Configuration

{{< tabs items="XLSForm,XForm XML" >}}

  {{< tab >}}
Add the following row to the **survey** sheet, within the existing contact group:

| type   | name        | label::en            | appearance          | required |
|--------|-------------|----------------------|---------------------|----------|
| string | geo_capture | Capture GPS location | geolocation-capture | yes      |

The field name (`geo_capture` in this example) can be anything; only the `appearance` value (`geolocation-capture`) is the contract between the form and CHT. Set `required` to `yes` if you want to require the CHW to submit the geolocation data before continuing. The widget itself does not independently require this, so leaving it blank means the field can be left empty on submission.

For additional languages, add a `label::<lang>` column for each language your deployment supports (for example, `label::fr`).

Convert and upload the form with `cht-conf` as usual.
  {{< /tab >}}

  {{< tab >}}
Here's the same configuration as raw XForm XML. Three changes are required: a model field, a bind, and a body element.

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

Replace `/data/contact/` with the actual nodeset path for the contact group in your form. Set the `required="true()"` attribute if you want to require the CHW to submit the geolocation data when creating or editing the contact. The widget itself does not independently require this, so omitting the required bind means the field can be left empty on submission.

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

  {{< /tab >}}

{{< /tabs >}}

## Widget behavior

Once the form is configured, GPS acquisition starts automatically the moment the form renders. There's no capture button and no question gating it.

**While GPS is acquiring:**

- A progress bar fills over up to 30 seconds while the widget waits for a position.

{{< figure src="gps-acquiring.png" link="gps-acquiring.png" alt="The geolocation widget showing a progress bar mid-fill while GPS is acquiring" >}}

**On success:**

- The progress bar is replaced by a success message.
- The widget shows a context question with two options: "I'm at the household" and "I'm somewhere else".
- Selecting either option records the choice and lets the CHW proceed to the next page.

{{< figure src="success.png" link="success.png" alt="The geolocation widget showing a success message with the 'I'm at the household' and 'I'm somewhere else' context question" >}}

**On failure (weak or unavailable GPS signal):**

- The progress bar is replaced by a failure message.
- If the failure is due to a weak or unreliable signal, a message prompts the CHW to move to an area with better reception.
- A retry button and a checkbox labeled **Save without location** appear.
- Tapping the retry button clears the failure state and starts a new capture attempt.
- Checking **Save without location** immediately cancels the in-progress capture. Unchecking it lets the CHW tap Retry to try again.

{{< figure src="failure-weak-signal.png" link="failure-weak-signal.png" alt="The geolocation widget showing a failure message, weak-signal message, Retry button, and the Save without location checkbox" >}}

**When location permission is denied:**

- No progress bar or context question is shown. Instead, the widget displays a message telling the CHW that location access is turned off and directing them to their device settings.
- A **Save without location** checkbox appears. There's no retry button, since there's nothing to retry until permission changes.
- This check covers a real browser or PWA permission denial, not only the Android-specific permission setting. No form configuration is required.
- If the CHW grants permission while the form is still open, the widget detects the change automatically and drops back into the normal capture flow. No page reload or form restart is needed.

{{< figure src="permission-denied.png" link="permission-denied.png" alt="The geolocation widget showing a permission-denied message and the Save without location checkbox, with no Retry button" >}}

**When GPS is unavailable on the device:**

- The widget shows a message that GPS isn't available on the device, along with the **Save without location** checkbox.

{{< figure src="gps-unavailable.png" link="gps-unavailable.png" alt="The geolocation widget showing a GPS-unavailable message and the Save without location checkbox" >}}

## Edit mode

When a contact already has a valid location on record (`geolocation` set from an earlier successful capture), editing that contact activates a different widget state. No additional configuration is required.

As soon as the edit form opens, GPS starts acquiring silently in the background. There's no progress bar to watch. The CHW finds out whether it succeeded by trying to select one of the capture options below.

**Edit mode UI:**

- A badge reading "Household location already saved" confirms a location is on record. It's static text. It doesn't show the capture context or how long ago the location was captured.
- Four radio options let the CHW choose what to do:

| Option | Effect |
|---|---|
| Keep saved household location (pre-selected) | `geolocation` and `geolocation_log` are left exactly as they are. |
| Change household location | Starts a home capture, the same as the create flow's home context. |
| I am not at the household | Starts an "other" capture, logged to `geolocation_log`, but doesn't overwrite `geolocation`. |
| Remove household location | Clears `geolocation` entirely. No GPS capture is attempted. |

{{< figure src="edit-mode-disabled.png" link="edit-mode-disabled.png" alt="Edit mode showing the saved-location badge and 4 radio options, with Change household location and I am not at the household disabled" >}}

- **Change household location** and **I am not at the household** stay disabled until the background GPS read succeeds. If that read fails, both re-disable and, if either was selected, the choice reverts to **Keep saved household location**. A CHW can never select a capture option without a live, successful GPS read backing it.

{{< figure src="edit-mode-enabled.png" link="edit-mode-enabled.png" alt="Edit mode showing the saved-location badge and 4 radio options, with Change household location and I am not at the household enabled" >}}

**Contacts with only failed captures:**

- A contact whose prior captures all failed (for example, permission denied every time) is treated the same as a contact with no location. The standard create-mode UI is shown instead of the badge and radio options.

**Contacts with no location recorded:**

- Editing a contact that has never had a location recorded shows the standard create-mode UI, plus a message that no GPS location has been recorded for the household yet.
