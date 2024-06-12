---
title: "API to interact with CHT Applications"
linkTitle: "API"
weight: 1
description: >
  RESTful Application Programming Interfaces for integrating with CHT applications
---

<style>
.td-content #TableOfContents ul ul ul {
  display: none;
}
</style>

{{% pageinfo %}}
This page covers the endpoints to use when integrating with the CHT server. If there isn't an endpoint that provides the function or data you need, direct access to the database is possible via the [CouchDB API](https://docs.couchdb.org/en/stable/api/index.html). Access to the [PostgreSQL database]({{% ref "core/overview/data-flows-for-analytics" %}}) may also prove useful for data analysis. If additional endpoints would be helpful, please make suggestions via a [GitHub issue](https://github.com/medic/cht-core/issues/new/choose).
{{% /pageinfo %}}

{{< toc >}}

{{% alert title="Note" %}}

Various properties throughout this API use a timestamp value, the
following formats are supported:

- ISO 8601 combined date and time with timezone of the format below where "Z"
  is offset from UTC like "-03", "+1245", or just "Z" which is UTC (0 offset);

       YYYY-MM-DDTHH:mm:ssZ
       YYYY-MM-DDTHH:mm:ss.SSSZ

- Milliseconds since Unix Epoch

A compatible value can be generated using the `toISOString` or `toValue` method
on a Javascript Date object.

##### Examples
- 2011-10-10T14:48:00-0300
- 2016-07-01T13:48:24+00:00
- 2016-07-01T13:48:24Z
- 1467383343484 (MS since Epoch)

{{% /alert %}}

## Settings

Get and update the app settings.

### GET /api/v1/settings

Returns the settings in JSON format.

### PUT /api/v1/settings

#### Query Parameters

| Variable | Description                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------- |
| overwrite  | Whether to replace settings document with input document. If both replace and overwrite are set, then it overwrites only. Defaults to replace. |
| replace  | Whether to replace existing settings for the given properties or to merge. Defaults to false (merging). |

Returns a JSON object with two fields:

```json
{
  "success": true,
  "upgraded": false
}
```

| Variable | Type | Description                                                                                             |
| -------- | ------|------------------------------------------------------------------------------------------------- |
| success  | Boolean | Always `true`
| upgraded  | Boolean |  Whether the settings doc was updated or not


## Export

Request different types of data in various formats.

Each of the export endpoints except contacts, feedback, and user-devices supports a parameter which returns date formatted in human readable form (ISO 8601). Setting this parameter to false or leaving it out will return dates formatted as an epoch timestamp.

To set this parameter for a GET request use:

```
http://admin:pass@localhost:5988/api/v2/export/messages?options[humanReadable]=true
```

To set this parameter for a POST request submit this as the request body:

```json
{
  "options": {
    "humanReadable": true
  }
}
```

### GET /api/v2/export/dhis

Exports target data formatted as a DHIS2 dataValueSet. The data can be filtered to a specific section of the contact hierarchy or for a given time interval.

Parameter | Description
-- | --
dataSet | A DHIS2 dataSet ID. Targets associated with this dataSet will have their data aggregated. (required)
date.from | Filter the target data to be aggregated to be within the month of this timestamp. (required)
orgUnit | Filter the target data to only that associated with contacts with attribute `{ dhis: { orgUnit } }`. (optional)

```json
{
  "filters": {
    "dataSet": "VMuFODsyWaO",
    "date": {
      "from": 949392000000,
    },
    "orgUnit": "KbY9DJ8mBkx"
  }
}
```

### GET /api/v2/export/reports

It uses the [search shared library](https://github.com/medic/cht-core/tree/master/shared-libs/search) to ensure identical results in the export and the front-end. It also only supports exporting CSV so we can efficiently stream infinitely large exports.

#### Query parameters

These are identical to the JS objects passed to the shared library, as if you were using it directly in Javascript.

You may either pass JSON in the request body using `POST`:

```json
POST /api/v2/export/reports
{
  "filters": {
    "forms": {
      "selected": [
        {
          "code": "immunization_visit"
        }
      ]
    }
  }
}
```

Or using form-style parameters as `GET`:

```
GET /api/v2/export/reports?filters[search]=&filters[forms][selected][0][code]=immunization_visit
```

**NB:** this API is bound directly to this library. For more information on what queries you can perform with the search library, see [its documentation](https://github.com/medic/cht-core/tree/master/shared-libs/search).

### GET /api/v2/export/messages

Download messages.

#### Output

| Column             | Description                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| Record UUID        | The unique ID for the message in the database.                                         |
| Patient ID         | The generated short patient ID for use in SMS.                                         |
| Reported Date      | The date the message was received or generated.                                        |
| From               | This phone number the message is or will be sent from.                                 |
| Contact Name       | The name of the user this message is assigned to.                                      |
| Message Type       | The type of the message                                                                |
| Message State      | The state of the message at the time this export was generated                         |
| Received Timestamp | The datetime the message was received. Only applies to incoming messages.              |
| Other Timestamps   | The datetime the message transitioned to each state.                                   |
| Sent By            | The phone number the message was sent from. Only applies to incoming messages.         |
| To Phone           | The phone number the message is or will be sent to. Only applies to outgoing messages. |
| Message Body       | The content of the message.                                                            |

#### Examples

```
/api/v2/export/messages
```

### GET /api/v2/export/feedback

Export a file containing the user feedback.

#### Query Parameters

| Variable        | Description                                                                                |
| --------------- | ------------------------------------------------------------------------------------------ |
| format          | The format of the returned file, either 'csv' or 'xml'. Defaults to 'csv'.                 |
| locale          | Locale for translatable data. Defaults to 'en'.                                            |
| tz              | The timezone to show date values in, as an offset in minutes from GMT, for example '-120'. |
| skip_header_row | 'true' to omit the column headings. Defaults to 'false'.                                   |

### GET /api/v2/export/contacts

Returns a JSON array of contacts.

#### Output

| Column             | Description                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| id                 | The unique ID for the contact in the database.                                         |
| rev                | The current CouchDb revision of contact in the database.                               |
| name               | The name of the user this message is assigned to.                                      |
| patient_id         | The generated short patient ID for use in SMS.                                         |
| type               | The contact type. For configurable hierarchies, this will always be `contact`.         |
| contact_type       | The configurable contact type. Will be empty if using the default hierarchy.           |
| place_id           | The generated short place ID for use in SMS.                                           |

#### Query parameters

These are identical to the JS objects passed to the shared library, as if you were using it directly in Javascript.

You may either pass JSON in the request body using `POST`:

```json
POST /api/v2/export/contacts
{
  "filters": {
    "search": "jim"
  }
}
```

Or using form-style parameters as `GET`:

```
GET /api/v2/export/contacts?filters[search]=jim
```

### GET /api/v2/export/user-devices

*Added in 4.7.0*

Returns a JSON array of CHT-related software versions for each user device. This information is derived from the latest telemetry entry for each user device. If a particular user has used multiple devices, an entry will be included for _each_ device. You can reference the `date` value to determine which devices have been _recently_ used. If multiple users used the same physical device (e.g. they were logged into the same phone at different times), an entry will be included for _each_ user.

#### Output

| Column          | Description                                                                                                                              |
|-----------------|------------------------------------------------------------------------------------------------------------------------------------------|
| user            | The user's name.                                                                                                                         |
| deviceId        | The unique key for the user's device.                                                                                                    |
| date            | The date the telemetry entry was taken in YYYY-MM-DD, see [relevant docs]({{< relref "apps/guides/performance/telemetry" >}}).           |
| browser.name    | The name of the browser used.                                                                                                            |
| browser.version | The version of the browser used.                                                                                                         |
| apk             | The Internal [version code](https://developer.android.com/reference/android/R.styleable#AndroidManifest_versionCode) of the Android app. |
| android         | The version of Android OS.                                                                                                               |
| cht             | The version of CHT the user was on at time the telemetry entry was generated.                                                            |
| settings        | The revision of the App Settings document stored in CouchDB.                                                                             |

## Forms

### GET /api/v1/forms

Returns a list of currently installed forms (in all available formats) in JSON format.

#### Headers

| Key                | Value | Description                                                                                                                                         |
| ------------------ | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| X-OpenRosa-Version | 1.0   | If this header is specified returns XML formatted forms list. See [OpenRosa FormListAPI](https://bitbucket.org/javarosa/javarosa/wiki/FormListAPI). |

#### Examples

Get list of forms currently installed.

```
GET /api/v1/forms
```

```
HTTP/1.1 200
Content-Type: application/json; charset=utf-8

["anc_visit.xml","anc_registration.xml","off.xml", "off.json"]
```

Get OpenRosa XForms compatible forms installed in XML format.

```
GET /api/v1/forms
Host: medic.local
X-OpenRosa-Version: 1.0
```

```
HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8
X-OpenRosa-Version: 1.0

<?xml version="1.0" encoding="UTF-8"?>
<xforms xmlns="http://openrosa.org/xforms/xformsList">
  <xform>
    <name>Visit</name>
    <formID>ANCVisit</formID>
    <hash>md5:1f0f096602ed794a264ab67224608cf4</hash>
    <downloadUrl>http://medic.local/api/v1/forms/anc_visit.xml</downloadUrl>
  </xform>
  <xform>
    <name>Registration with LMP</name>
    <formID>PregnancyRegistration</formID>
    <hash>md5:1f0f096602ed794a264ab67224608cf4</hash>
    <downloadUrl>http://medic.local/api/v1/forms/anc_registration.xml</downloadUrl>
  </xform>
  <xform>
    <name>Stop</name>
    <formID>Stop</formID>
    <hash>md5:1f0f096602ed794a264ab67224608cf4</hash>
    <downloadUrl>http://medic.local/api/v1/forms/off.xml</downloadUrl>
  </xform>
</xforms>
```

### GET /api/v1/forms/{{id}}.{{format}}

Return form definition for a given form ID and format.

#### Parameters

| Variable | Description                                     |
| -------- | ----------------------------------------------- |
| id       | Form identifier                                 |
| format   | Format string or file extension. e.g. xml, json |

#### Examples

Get latest version of the PregnancyRegistration form in xml (XForms) format.

```
GET /api/v1/forms/pregnancyregistration.xml
```

Get the latest version of the NPYY form in JSON format.

```
GET /api/v1/forms/NPYY.json
```

### POST /api/v1/forms/validate

*Added in 3.12.0*

Validate the XForm passed. Require the `can_configure` permission.

#### Headers

| Key           | Value            | Description                    |
| ------------- | ---------------- | ------------------------------ |
| Content-Type  | application/xml  | The form is sent in XML format |
| Authorization | Basic KEY        | KEY is the "basic" token       |

#### Examples

```
POST /api/v1/forms/validate HTTP/1.1
Content-Type: application/xml
Authorization: Basic XXXXXXXXXX

<?xml version="1.0" encoding="UTF-8"?>
<xforms xmlns="http://openrosa.org/xforms/xformsList">
  <xform>
    <name>Visit</name>
    <formID>ANCVisit</formID>
    <hash>md5:1f0f096602ed794a264ab67224608cf4</hash>
    <downloadUrl>http://medic.local/api/v1/forms/anc_visit.xml</downloadUrl>
  </xform>
  <xform>
    <name>Registration with LMP</name>
    <formID>PregnancyRegistration</formID>
    <hash>md5:1f0f096602ed794a264ab67224608cf4</hash>
    <downloadUrl>http://medic.local/api/v1/forms/anc_registration.xml</downloadUrl>
  </xform>
  <xform>
    <name>Stop</name>
    <formID>Stop</formID>
    <hash>md5:1f0f096602ed794a264ab67224608cf4</hash>
    <downloadUrl>http://medic.local/api/v1/forms/off.xml</downloadUrl>
  </xform>
</xforms>
```

Example response when the form passed the validations:

```
HTTP/1.1 200 OK
Content-Type: application/json

{ok: true}
```

Example response when the form failed the validations:

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{error: "Error transforming xml. xsltproc return ..."}
```

## Records

### POST /api/v2/records

Create a new record based on a [JSON form]({{% ref "apps/reference/app-settings/forms" %}}) that has been configured.

Records can be created one of two ways, parsing the form data yourself and submitting a JSON object or by submitting the raw message string.

#### Headers

| Key          | Value                             | Description                                  |
| ------------ | --------------------------------- | -------------------------------------------- |
| Content-Type | application/x-www-form-urlencoded | Processes form parameters.                   |
| Content-Type | application/json                  | Processes form data in request body as JSON. |

Only one variant of the `Content-Type` header may be provided; RFC 2616 does not
allow multiple content types to appear in a single `Content-Type` header.

##### Form Parameters

| Variable      | Description                                                                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| message       | Message string in a supported format like Muvuku or Textforms. Depending if your CHT instance is configured in forms-only mode or not you might receive an error if the form is not found. |
| from          | Reporting phone number.                                                                                                                                                                             |
| sent_timestamp | Timestamp in MS since Unix Epoch of when the message was received on the gateway. Defaults to now.                                                                                                  |

##### JSON Properties

Special values reside in the property `_meta`, so you can't have a form field named `_meta`. Only strings and numbers are currently support as field values.

All property names will be lowercased.

| Key                  | Description                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------- |
| \_meta.form          | The form code.                                                                                     |
| \_meta.from          | Reporting phone number. Optional.                                                                  |
| \_meta.reported_date | Timestamp in MS since Unix Epoch of when the message was received on the gateway. Defaults to now. |
| \_meta.locale        | Optional locale string. Example: 'fr'                                                              |

#### Examples

Creating new record using message field.

```
POST /api/v1/records
Content-Type: application/x-www-form-urlencoded

message=1!YYYZ!Sam#23#2015#ANC&from=+5511943348031&sent_timestamp=1352399720000
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "id": "364c796a843fbe0a73476f9153012733"
}
```

Creating new record with JSON.

```
POST /api/v1/records
Content-Type: application/json

{
  "nurse": "Sam",
  "week": 23,
  "year": 2015,
  "visit": "ANC",
  "_meta": {
    "form": "YYYZ",
    "reported_date": 1352399720000
  }
}
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "success": true,
  "id": "364c796a843fbe0a73476f9153012733"
}
```

#### Errors

If required fields are not found return 500.

If invalid JSON return error response 500.

If submitting JSON and corresponding form is not found on the server you will receive an error.

## SMS

### POST /api/sms

Endpoint used by cht-gateway to send sms messages. More documentation in the [cht-gateway repo](https://github.com/medic/cht-gateway/blob/master/README.md).

### POST /api/v1/sms/{aggregator}/{endpoint}

Endpoint for integration with SMS aggregators. More details on the [RapidPro]({{< relref "apps/guides/messaging/gateways/rapidpro" >}}) and [Africa's Talking]({{< relref "apps/guides/messaging/gateways/africas-talking" >}}) pages.

## People

### Supported Properties

Use JSON in the request body to specify a person's details.

Note: this does not accommodate having a `place` field on your form and will likely be revised soon.

#### Required

| Key  | Description                         |
| ---- | ----------------------------------- |
| name | String used to describe the person. |
| type | ID of the `contact_type` for the new person. Defaults to 'person' for backwards compatibility. |

#### Optional

| Key           | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| place         | String that references a place or object that defines a new place.     |
| reported_date | Timestamp of when the record was reported or created. Defaults to now. |

### POST /api/v1/people

Create new people.

#### Permissions

By default any user can create or modify a place. Use these permissions to restrict access:

`can_create_people`, `can_create_places`

#### Examples

Create new person and place hierarchy.

```
POST /api/v1/people
Content-Type: application/json

{
  "name": "Hannah",
  "phone": "+2548277210095",
  "type": "contact",
  "contact_type": "patient",
  "place": {
    "name": "CHP Area One",
    "type": "health_center",
    "parent": {
      "name": "CHP Branch One",
      "type": "district_hospital"
    }
  }
}
```

Create new person and assign existing place.

```
POST /api/v1/people
Content-Type: application/json

{
 "name": "Samuel",
 "place": "1d83f2b4a27eceb40df9e9f9ad06d137",
 "type": "contact",
 "contact_type": "chp"
}
```

Example response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "71df9d25ed6732ea3b4435862510d115",
  "rev": "1-a4060843d78f46a60a6f41051e40e3b5"
}
```

## Places

By default any user can create or modify a place.

### Supported Properties

Use JSON in the request body to specify a place's details.

#### Required Properties

| Key    | Description                                                                                                                  |
| ------ | ---------------------------------------------------------------------------------------------------------------------------- |
| name   | String used to describe the place.                                                                                           |
| type   | Place type                                                                                                                   |
| parent | String that references a place or object that defines a new place. Optional for District Hospital and National Office types. |

#### Optional Properties

| Key           | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| contact       | String identifier for a person or object that defines a new person.    |
| reported_date | Timestamp of when the record was reported or created. Defaults to now. |

#### Place Types

| Key               | Description       |
| ----------------- | ----------------- |
| clinic            | Clinic            |
| health_center     | Health Center     |
| district_hospital | District Hospital |
| national_office   | National Office   |

### POST /api/v1/places

Create a new place and optionally a contact.

#### Permissions

By default any user can create new places. Use these permissions to restrict access:

`can_create_places`, `can_create_people`

#### Examples

Create new place referencing existing parent.

```
POST /api/v1/places
Content-Type: application/json

{
 "name": "Busia Clinic",
 "type": "clinic",
 "parent": "1d83f2b4a27eceb40df9e9f9ad06d137"
}
```

Create child and parent places.

```
POST /api/v1/places
Content-Type: application/json

{
  "name": "CHP Area One",
  "type": "health_center",
  "parent": {
    "name": "CHP Branch One",
    "type": "district_hospital"
  }
}
```

Also creates contact (person).

```
POST /api/v1/places
Content-Type: application/json

{
  "name": "CHP Area One",
  "type": "health_center",
  "parent": {
    "name": "CHP Branch One",
    "type": "district_hospital"
  },
  "contact": {
    "name": "Paul",
    "phone": "+254883720611"
  }
}
```

Or assigns them.

```
POST /api/v1/places
Content-Type: application/json

{
  "name": "CHP Area One",
  "type": "health_center",
  "parent": {
    "name": "CHP Branch One",
    "type": "district_hospital"
  },
  "contact": "71df9d25ed6732ea3b4435862510ef8e"
}
```

Example success response:

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "71df9d25ed6732ea3b4435862510d115",
  "rev": "1-a4060843d78f46a60a6f41051e40e3b5"
}
```

Error response if facility structure is not correct:

```
HTTP/1.1 400 Bad Request
Content-Type: text/plain

Health Centers should have "district_hospital" parent type.
```

### POST /api/v1/places/{{id}}

Update a place and optionally its contact.

#### Permissions

By default any user can update a place. Use these permissions to restrict access:

`can_update_places`

#### Examples

Update a place's contact.

```
POST /api/v1/places/1d83f2b4a27eceb40df9e9f9ad06d137
Content-Type: application/json

{
 "contact": "71df9d25ed6732ea3b4435862505f7a9"
}
```

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "1d83f2b4a27eceb40df9e9f9ad06d137",
  "rev": "12-a4060843d78f46a60a6f41051e40e3b5"
}
```

## Users

All user related requests are limited to users with admin privileges by default.

### Supported Properties

Use JSON in the request body to specify user details. Any properties submitted
that are not on the list below will be ignored. Any properties not included
will be undefined.

| Name | Required | Type | Description | Version |
| ---- | -------- | ---- | ----------- | ------ |
| username | yes | String | identifier used for authentication |
| roles  | yes | Array | |
| place | yes, if the roles contain an offline role | string or object | Place identifier string (UUID) or object this user resides in. |
| contact | yes, if the roles contain an offline role | string or object | A person identifier string (UUID) or object based on the form configured in the app. |
| password | yes, if `token_login` is not enabled for the user | String | Password string used for authentication. Only allowed to be set, not retrieved. |
| phone |  yes, if `token_login` is enabled for the user | String | Valid phone number |
| token_login | no | Boolean | A boolean representing whether or not the Login by SMS should be enabled for this user. | 3.10.0 |
| fullname | no | String | Full name  |
| email | no | String | Email address  |
| known | no | Boolean | Boolean to define if the user has logged in before. |

#### Login by SMS

When creating or updating a user, sending a truthy value for the field `token_login` will enable Login by SMS for this user.
This action resets the user's password to an unknown string and generates a complex 64 character token, that is used to generate a token-login URL.
The URL is sent to the user's phone number by SMS, along with another (configurable) SMS that can contain additional information.
Accessing this link, before its expiration time, will log the user in directly - without the need of any other credentials.
The link can only be accessed once, the token becomes invalid after being used for one login.
The token expires in 24 hours, after which logging in is only possible by either generating a new token, or disabling `token_login` and manually setting a password.


The SMS messages are stored in a doc of a new type `login_token`. These docs cannot be viewed as reports from the webapp, and can only be edited by admins, but their messages are visible in the Admin Message Queue page.


To disable login by SMS for a user, update the user sending `token_login` with a `false` value.
To regenerate the token, update the user sending `token_login` with a `true` value.

| `token_login` | user state | action |
| ------------- | -----------| ------ |
| undefined | new | None |
| undefined | existent, no token | None |
| undefined | existent, with token | None. Login by SMS remains enabled. Token is unchanged. |
| true | new | Login by SMS enabled. Token is generated and SMS is sent. |
| true | existent, no token | Password is reset. Login by SMS enabled. Token is generated and SMS is sent. Existent sessions are invalidated. |
| true | existent, with token | Password is reset. Login by SMS enabled. New token is generated and SMS is sent. Old token is invalid. Existent sessions are invalidated. |
| false | new | None. |
| false | existent, no token | None. |
| false | existent, with token | Request requires a password. Login by SMS is disabled. Old token is invalidated. Existent sessions are invalidated. |

This feature uses [`app_settings.app_url`]({{< relref "apps/reference/app-settings/#app_settingsjson" >}}) and [`app_settings.token_login`]({{< relref "apps/reference/app-settings/token_login.md" >}}) to be defined and enabled.
If `app_settings.app_url` is not defined, the generated token-login URL will use the `Host` request header, which may not always be correct.

{{< see-also page="apps/concepts/access" anchor="remote-login" >}}

### GET /api/v1/users

*DEPRECATED: use [/api/v2/users](#get-apiv2users)*

Returns a list of users and their profile data in JSON format.

#### Permissions

`can_view_users`

#### Examples

Get list of users:

```
GET /api/v1/users
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": "org.couchdb.user:admin",
    "rev": "10-6486428924d11781c107ea74de6b63b6",
    "type": "admin",
    "username": "admin"
  },
  {
    "id": "org.couchdb.user:demo",
    "rev": "14-8758c8493edcc6dac50366173fc3e24a",
    "type": "district-manager",
    "fullname": "Example User",
    "username": "demo",
    "place": {
      "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17d38b",
      "type": "district_hospital",
      "name": "Sample District",
      "contact": {
        "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17fd17",
        "type": "person",
        "name": "Paul",
        "phone": "+2868917046"
      }
    },
    "contact": {
      "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17fd17",
      "type": "person",
      "name": "Paul",
      "phone": "+2868917046"
    }
  }
]
```

### GET /api/v2/users

*Added in 4.1.0*

Returns a list of users and their profile data in JSON format.

#### Permissions

`can_view_users`

#### Query Parameters

| Variable    | Description                                                                               |
|-------------|-------------------------------------------------------------------------------------------|
| facility_id | Added in 4.7.0. String identifier representing the uuid of the user’s facility.           |
| contact_id  | Added in 4.7.0. String identifier representing the uuid of the user’s associated contact. |

#### Examples

Get list of users:

```
GET /api/v2/users
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": "org.couchdb.user:admin",
    "rev": "10-6486428924d11781c107ea74de6b63b6",
    "roles": [ "admin" ],
    "username": "admin"
  },
  {
    "id": "org.couchdb.user:demo",
    "rev": "14-8758c8493edcc6dac50366173fc3e24a",
    "roles": [ "district_admin", "data_user" ],
    "fullname": "Example User",
    "username": "demo",
    "place": {
      "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17d38b",
      "type": "district_hospital",
      "name": "Sample District",
      "contact": {
        "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17fd17",
        "type": "person",
        "name": "Paul",
        "phone": "+2868917046"
      }
    },
    "contact": {
      "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17fd17",
      "type": "person",
      "name": "Paul",
      "phone": "+2868917046"
    }
  }
]
```

Get users with a specific `facility_id`:

```
GET /api/v2/users?facility_id=eeb17d6d-5dde-c2c0-62c4a1a0ca17d38b
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": "org.couchdb.user:demo",
    "rev": "14-8758c8493edcc6dac50366173fc3e24a",
    "roles": [ "district_admin", "data_user" ],
    "fullname": "Example User",
    "username": "demo",
    "place": {
      "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17d38b",
      "type": "district_hospital",
      "name": "Sample District",
      "contact": {
        "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17fd17",
        "type": "person",
        "name": "Paul",
        "phone": "+2868917046"
      }
    },
    "contact": {
      "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17fd17",
      "type": "person",
      "name": "Paul",
      "phone": "+2868917046"
    }
  }
]
```

Get users with a specific `contact_id`:

```
GET /api/v2/users?contact_id=eeb17d6d-5dde-c2c0-62c4a1a0ca17fd17
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[
  {
    "id": "org.couchdb.user:demo",
    "rev": "14-8758c8493edcc6dac50366173fc3e24a",
    "roles": [ "district_admin", "data_user" ],
    "fullname": "Example User",
    "username": "demo",
    "place": {
      "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17d38b",
      "type": "district_hospital",
      "name": "Sample District",
      "contact": {
        "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17fd17",
        "type": "person",
        "name": "Paul",
        "phone": "+2868917046"
      }
    },
    "contact": {
      "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17fd17",
      "type": "person",
      "name": "Paul",
      "phone": "+2868917046"
    }
  }
]
```

### GET /api/v2/users/{{username}}

*Added in 4.7.0*

Returns a user's profile data in JSON format.

#### Permissions

`can_view_users`

#### Examples

Get a user by username:

```
GET /api/v2/users/demo
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "id": "org.couchdb.user:demo",
  "rev": "14-8758c8493edcc6dac50366173fc3e24a",
  "type": "district-manager",
  "fullname": "Example User",
  "username": "demo",
  "place": {
    "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17d38b",
    "type": "district_hospital",
    "name": "Sample District",
    "contact": {
      "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17fd17",
      "type": "person",
      "name": "Paul",
      "phone": "+2868917046"
    }
  },
  "contact": {
    "_id": "eeb17d6d-5dde-c2c0-62c4a1a0ca17fd17",
    "type": "person",
    "name": "Paul",
    "phone": "+2868917046"
  }
}
```

### POST /api/v1/users

Create new users with a place and a contact.

 Creating multiple users at once by passing an array of users was introduced in version 3.15.
All users need to meet the following requirements before any of them are created:
- All required fields are filled in
- The password is at least 8 characters long and difficult to guess
- The phone number is valid when [`token_login`]({{< ref "apps/reference/app-settings/token_login" >}}) is enabled

Users are created in parallel and the creation is not aborted even if one of the users fails to be created.

Passing a single user in the request's body will return a single object whereas
passing an array of users will return an array of objects as shown in the examples below.

#### Permissions

`can_create_users`

#### Examples

##### Create one user

Create a new user that can authenticate with a username of "mary" and password
of "secret" that can submit reports and view or modify records associated to
their place. The place is created in the background and automatically linked
to the contact.

```
POST /api/v1/users
Content-Type: application/json

{
  "password": "secret",
  "username": "mary",
  "type": "district-manager",
  "place": {
    "name": "Mary's Area",
    "type": "health_center",
    "parent": "d14e1c3d557761320b13a77e7806e8f8"
  },
  "contact": {
    "name": "Mary Anyango",
    "phone": "+2868917046"
  }
}
```

```
HTTP/1.1 200
Content-Type: application/json

{
  "contact": {
    "id": "65416b8ceb53ff88ac1847654501aeb3",
    "rev": "1-0b74d219ae13137c1a06f03a0a52e187"
  },
  "user-settings": {
    "id": "org.couchdb.user:mary",
    "rev": "1-6ac1d36b775143835f4af53f9895d7ae"
  },
  "user": {
    "id": "org.couchdb.user:mary",
    "rev": "1-c3b82a0b47cfe68edd9284c89bebbae4"
  }
}
```

##### Create many users

Create two new users that can authenticate with a username and a password
that can submit reports and view or modify records associated to their place.
The place is created in the background and automatically linked to the contact.

```
POST /api/v1/users
Content-Type: application/json

[
  {
    "password": "secret",
    "username": "mary",
    "type": "district-manager",
    "place": {
      "name": "Mary's Area",
      "type": "health_center",
      "parent": "d14e1c3d557761320b13a77e7806e8f8"
    },
    "contact": {
      "name": "Mary Anyango",
      "phone": "+2868917046"
    }
  },
  {
    "password": "secret",
    "username": "bob",
    "type": "district-manager",
    "place": {
      "name": "Bob's Area",
      "type": "health_center",
      "parent": "d14e1c3d557761320b13a77e7806e8f8"
    },
    "contact": {
      "name": "Bob Johnson",
      "phone": "+2868194607"
    }
  }
]
```

```
HTTP/1.1 200
Content-Type: application/json

[
  {
    "contact": {
      "id": "65416b8ceb53ff88ac1847654501aeb3",
      "rev": "1-0b74d219ae13137c1a06f03a0a52e187"
    },
    "user-settings": {
      "id": "org.couchdb.user:mary",
      "rev": "1-6ac1d36b775143835f4af53f9895d7ae"
    },
    "user": {
      "id": "org.couchdb.user:mary",
      "rev": "1-c3b82a0b47cfe68edd9284c89bebbae4"
    }
  },
  {
    "contact": {
      "id": "8d8a741c1cb441058e29a60ab7596bf2",
      "rev": "1-acbc31712fd105eae3cd0806cd20a8f4"
    },
    "user-settings": {
      "id": "org.couchdb.user:bob",
      "rev": "1-d8629838127accd531043f845c416ef6"
    },
    "user": {
      "id": "org.couchdb.user:bob",
      "rev": "1-5eac2542c801ba6b518728f53d9276a0"
    }
  }
]
```

#### Errors

##### Response when the username already exists

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "code": 400,
  "error": {
    "message": "Username \"mary\" already taken.",
    "translationKey": "username.taken",
    "translationParams": {
      "username": "mary"
    }
  }
}
```

##### Response when users are missing required fields

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "code": 400,
  "error": "Missing required fields:\n\Missing fields username, password, type or roles for user at index 0\nMissing fields password, type or roles for user at index 1",
  "details": {
    "failingIndexes": [
      {
        "fields": [
          "username",
          "password",
          "type or roles"
        ],
        "index": 0
      },
      {
        "fields": [
          "password",
          "type or roles"
        ],
        "index": 1
      }
    ]
  }
}
```

##### Response when some users failed to be created

```
HTTP/1.1 200
Content-Type: application/json

[
  {
    "contact": {
      "id": "65416b8ceb53ff88ac1847654501aeb3",
      "rev": "1-0b74d219ae13137c1a06f03a0a52e187"
    },
    "user-settings": {
      "id": "org.couchdb.user:mary",
      "rev": "1-6ac1d36b775143835f4af53f9895d7ae"
    },
    "user": {
      "id": "org.couchdb.user:mary",
      "rev": "1-c3b82a0b47cfe68edd9284c89bebbae4"
    }
  },
  {
    "error": "Failed to find place."
  }
]
```

### POST /api/v2/users

*Added in 3.16.0*

Create new users with a place and a contact from a CSV file.

Creating users from a CSV file behaves the same as passing a JSON array of users into the [`POST /api/v1/users`]({{< ref "apps/reference/api#post-apiv1users" >}})
where a row represents a user object and a column represents a user object property.
Columns with a `:excluded` suffix will be ignored, this allows providing a more user-friendly experience with
autocompletion on fields or dealing with names instead of long, unreadable ids.

In order to facilitate this process, we have made available a spreadsheet compatible with the `default` configuration of the CHT.
[Click here](https://docs.google.com/spreadsheets/d/1yUenFP-5deQ0I9c-OYDTpbKYrkl3juv9djXoLLPoQ7Y/copy) to make a copy of the spreadsheet in Google Sheets.
[A guide]({{< ref "apps/guides/data/users-bulk-load" >}}) on how to import users with this spreadsheet from within the Admin Console is available
in case you don't want to interact with this API yourself.

#### Logging

A log entry is created with each bulk import that contains the import status for each user and the import progress status
that gets updated throughout the import and finalized upon completion.
These entries are saved in the [`medic-logs`]({{< ref "apps/guides/database#medic-logs" >}}) database and you can access them
by querying documents with a key that starts with `bulk-user-upload-`.

#### Headers

| Key          | Value    | Description                                  |
|--------------|----------|----------------------------------------------|
| Content-Type | text/csv | Processes form data in request body as JSON. |

#### Permissions

`can_create_users`

#### Example

Create two new users that can authenticate with a username and a password
that can submit reports and view or modify records associated to their place.
Along with a new user, a new contact and new place are created as well.
The new place will be a child of `place.parent` (see the UUID `fe4da0f9-7d65-4834-bb42-88a5239bbd3b` below)
and must already exist or else the new place will be an orphan record in the hierarchy and not show up in the GUI.

```
POST /api/v2/users
Content-Type: text/csv

contact.first_name,contact.last_name,contact.sex,contact.phone,email,contact.meta.created_by,token_login,contact.role,contact.type,contact.contact_type,contact.name,username,password,phone,place.parent,place.type,place.name,place.contact_type,type,fullname
Mary,Anyango,female,+2868917046,,,FALSE,chw,contact,person,Mary Anyango,mary,WrAGyGD9805,2868917046,fe4da0f9-7d65-4834-bb42-88a5239bbd3b,health_center,Mary Anyango's Health center,clinic,chw,Mary Anyango
Bob,Johnson,male,+2868194607,,,FALSE,chw,contact,person,Bob Johnson,bob,JzAEQzY2614,2868194607,fe4da0f9-7d65-4834-bb42-88a5239bbd3b,health_center,Bob Johnson's Health center,clinic,chw,Bob Johnson
```

```
HTTP/1.1 200
Content-Type: application/json

[
  {
    "contact": {
      "id": "65416b8ceb53ff88ac1847654501aeb3",
      "rev": "1-0b74d219ae13137c1a06f03a0a52e187"
    },
    "user-settings": {
      "id": "org.couchdb.user:mary",
      "rev": "1-6ac1d36b775143835f4af53f9895d7ae"
    },
    "user": {
      "id": "org.couchdb.user:mary",
      "rev": "1-c3b82a0b47cfe68edd9284c89bebbae4"
    }
  },
  {
    "contact": {
      "id": "8d8a741c1cb441058e29a60ab7596bf2",
      "rev": "1-acbc31712fd105eae3cd0806cd20a8f4"
    },
    "user-settings": {
      "id": "org.couchdb.user:bob",
      "rev": "1-d8629838127accd531043f845c416ef6"
    },
    "user": {
      "id": "org.couchdb.user:bob",
      "rev": "1-5eac2542c801ba6b518728f53d9276a0"
    }
  }
]
```

#### Errors

##### Response when the username already exists

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

[
  {
    "error": "Missing required fields: username"
  }
]
```

##### Response when users are missing required fields

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

[
  {
    "error": "Missing required fields: username"
  },
  {
    "error": "Missing required fields: password"
  }
]
```

##### Response when some users failed to be created

```
HTTP/1.1 200
Content-Type: application/json

[
  {
    "contact": {
      "id": "65416b8ceb53ff88ac1847654501aeb3",
      "rev": "1-0b74d219ae13137c1a06f03a0a52e187"
    },
    "user-settings": {
      "id": "org.couchdb.user:mary",
      "rev": "1-6ac1d36b775143835f4af53f9895d7ae"
    },
    "user": {
      "id": "org.couchdb.user:mary",
      "rev": "1-c3b82a0b47cfe68edd9284c89bebbae4"
    }
  },
  {
    "error": "Failed to find place."
  }
]
```

### POST /api/v1/users/{{username}}

Allows you to change property values on a user account. Properties listed above
are supported except for `contact.parent`. Creating or modifying people
through the user is not supported, see People section.

#### Permissions

`can_update_users`, `can_update_places`, `can_update_people`

#### Updating yourself

You do not need any of the above permissions if the user you are modifying is yourself. However, you are not allowed to modify your `type`, `roles`, `contact` or `place`.

Further more, if you're updating your `password` you must be authenticating via Basic Auth (either the header or in the URL). This is to ensure the password is known at time of request, and no one is hijacking a cookie.

#### URL Parameters

| Variable | Description                                |
| -------- | ------------------------------------------ |
| username | String identifier used for authentication. |

#### Examples

```
POST /api/v1/users/mary
Content-Type: application/json

{
  "password": "secret",
  "place": "eeb17d6d-5dde-c2c0-62c4a1a0ca17e342"
}
```

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "user": {
    "id": "org.couchdb.user:mary",
    "rev": "23-858e01fafdfa0d367d798fe5b44751ff"
  },
  "user-settings": {
    "id": "org.couchdb.user:mary",
    "rev": "17-c6d03b86d2d5d70f7270c85e67fea96d"
  }
}
```

### DELETE /api/v1/users/{{username}}

Delete a user. Does not affect a person or place associated to a user.

#### Permissions

`can_delete_users`

#### URL Parameters

| Variable | Description                                |
| -------- | ------------------------------------------ |
| username | String identifier used for authentication. |

#### Examples

```
DELETE /api/v1/users/mary
```

```
HTTP/1.1 200 OK
```

### GET /api/v1/users-info

Returns the total number of documents an offline user would replicate (`total_docs`), the number of docs excluding tasks the user would replicate (`warn_docs`), along with a `warn` flag if this number exceeds the recommended limit (now set at 10 000).

When the authenticated requester has an offline role, it returns the requester doc count.

#### Example
```
GET /api/v1/users-info -H 'Cookie: AuthSession=OFFLINE_USER_SESSION;'
```

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "total_docs": 5678,
  "warn_docs": 4852,
  "warn": false,
  "limit: 10000
}
```

When the requester has an online role, the following query parameters are accepted:

##### Query Parameters

| Variable | Description                                | Required |
| -------- | ------------------------------------------ | -------- |
| facility_id | String identifier representing the uuid of the user's facility  | true |
| role | String identifier representing the user role - must be configured as an offline role. Accepts valid UTF-8 JSON array for multiple of roles. | true |
| contact_id | String identifier representing the uuid of the user's associated contact | false |

When requested as an online user, the number of tasks are never counted and never returned, so `warn_docs` is always equal to `total_docs`.

###### Example

```
GET /api/v1/users-info?facility_id={{facility_uuid}}&role={{role}}&contact_id={{contact_uuid}} -H 'Cookie: AuthSession=OFFLINE_USER_SESSION;'
```

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "total_docs": 10265,
  "warn_docs": 10265,
  "warn": true,
  "limit: 10000
}
```

In case any of the required query parameters are omitted or the requested role is not configured as an offline role, the request will result in an error:


```
GET /api/v1/users-info?role={{online_role}} -H 'Cookie: AuthSession=OFFLINE_USER_SESSION;'
```

```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "code": 400,
  "error": "Missing required query params: role and/or facility_id"
}
```

## Bulk Operations

### POST /api/v1/bulk-delete

Bulk delete endpoint for deleting large numbers of documents. Docs will be batched into groups of 100 and will be sent sequentially to couch (new batch sent after the previous one has returned). The response will be chunked JSON (one batch at a time), so if you wish to get an indication of progress you will need to parse incomplete JSON (with a library such as [`partial-json-parser`](https://github.com/indgov/partial-json-parser).

#### Permissions

Only available to online users.

#### Parameters

| Parameter | Description                                 |
| --------- | ------------------------------------------- |
| docs      | Array of JSON objects with `_id` properties |

An array of objects each with an `_id` property is required (rather than an array of strings representing ids) to ensure forwards compatibility if we choose to require that any additional document information (such as `_rev`) also be passed in to this endpoint.

#### Errors

If an error is encountered part-way through the response (eg on the third batch), it's impossible to send new headers to indicate a 5xx error, so the connection will simply be terminated (as recommended here https://github.com/expressjs/express/issues/2700).

#### Examples

```
POST /api/v1/bulk-delete
Content-Type: application/json

{
  "docs": [
    { "_id": "id1" },
    { "_id": "id2" },
    ...
    { "_id": "id150" }
  ]
}
```

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  [
    { "ok": true, "id": "id1", "rev": "1-rev1" },
    { "ok": true, "id": "id2", "rev": "1-rev2" },
    ...
    { "ok": true, "id": "id100", "rev": "1-rev100" }
  ],
  [
    { "ok": true, "id": "id101", "rev": "1-rev101" },
    { "ok": true, "id": "id102", "rev": "1-rev102" },
    ...
    { "ok": true, "id": "id150", "rev": "1-rev150" }
  ]
]
```

## Monitoring

See the [Monitoring and alerting on the CHT]({{< relref "hosting/monitoring" >}}) page for how to use this API in production.

### GET /api/v1/monitoring

*DEPRECATED: use [/api/v2/monitoring](#get-apiv2monitoring)*

Used to retrieve a range of metrics about the instance. While the output is human-readable this is intended for automated monitoring allowing for tracking trends over time and alerting about potential issues.

#### Permissions

No permissions required.

#### Examples

##### JSON format

```
curl http://localhost:5988/api/v1/monitoring

{"version":{"app":"3.9.0","node":"v10.16.0","couchdb":"2.3.1"},"couchdb":{"medic":{"name":"medic","update_sequence":5733,"doc_count":278,"doc_del_count":32,"fragmentation":1.0283517758420173}...
```

#### Response content

| JSON path | Type | Description |
| --------- | ----------------- | ---- |
| `version.app` | String | The version of the webapp. |
| `version.node` | String | The version of NodeJS. |
| `version.couchdb` | String | The version of CouchDB. |
| `couchdb.<dbname>.name` | String | The name of the db, usually one of "medic", "medic-sentinel", "medic-users-meta", "_users". |
| `couchdb.<dbname>.update_sequence` | Number | The number of changes in the db. |
| `couchdb.<dbname>.doc_count` | Number | The number of docs in the db. |
| `couchdb.<dbname>.doc_del_count` | Number | The number of deleted docs in the db. |
| `couchdb.<dbname>.fragmentation` |  Number | The fragmentation of the db, lower is better, "1" is no fragmentation. |
| `date.current` | Number | The current server date in millis since the epoch, useful for ensuring the server time is correct. |
| `date.uptime` | Number | How long API has been running in seconds. |
| `sentinel.backlog` | Number | Number of changes yet to be processed by Sentinel. |
| `messaging.outgoing.state.due` | Number | The number of messages due to be sent. |
| `messaging.outgoing.state.scheduled` | Number | The number of messages scheduled to be sent in the future. |
| `messaging.outgoing.state.muted` | Number | The number of messages that are muted and therefore will not be sent. |
| `messaging.outgoing.state.delivered` | Number | The number of messages that have been delivered or sent. As of 3.12.x. |
| `messaging.outgoing.state.failed` | Number | The number of messages have failed to be delivered. As of 3.12.x |
| `outbound_push.backlog` | Number | Number of changes yet to be processed by Outbound Push. |
| `feedback.count` | Number | Number of feedback docs created usually indicative of client side errors. |
| `conflict.count` | Number | Number of doc conflicts which need to be resolved manually. |
| `replication_limit.count` | Number | Number of users that exceeded the replication limit of documents. |
| `connected_users.count` | Number | Number of users that have connected to the api in a given number of days. The period defaults to 7 days but this can be changed by adding `connected_user_interval` as a query parameter e.g. `http://localhost:5988/api/v1/monitoring?connected_user_interval=14`  |

#### Errors

- A metric of `""` (for string values) or `-1` (for numeric values) indicates an error occurred while querying the metric - check the API logs for details.
- If no response or an error response is received the instance is unreachable. Thus, this API can be used as an uptime monitoring endpoint.


### GET /api/v2/monitoring

Available as of 3.12.x.
Used to retrieve a range of metrics about the instance. While the output is human-readable this is intended for automated monitoring allowing for tracking trends over time and alerting about potential issues.

#### Permissions

No permissions required.

#### Examples

##### JSON format

```
curl http://localhost:5988/api/v2/monitoring

{"version":{"app":"3.12.0","node":"v10.16.0","couchdb":"2.3.1"},"couchdb":{"medic":{"name":"medic","update_sequence":5733,"doc_count":278,"doc_del_count":32,"fragmentation":1.0283517758420173}...
```

#### Response content

| JSON path | Type | Description |
| --------- | ----------------- | ---- |
| `version.app` | String | The version of the webapp. |
| `version.node` | String | The version of NodeJS. |
| `version.couchdb` | String | The version of CouchDB. |
| `couchdb.<dbname>.name` | String | The name of the db, usually one of "medic", "medic-sentinel", "medic-users-meta", "_users". |
| `couchdb.<dbname>.update_sequence` | Number | The number of changes in the db. |
| `couchdb.<dbname>.doc_count` | Number | The number of docs in the db. |
| `couchdb.<dbname>.doc_del_count` | Number | The number of deleted docs in the db. |
| `couchdb.<dbname>.fragmentation` |  Number | The fragmentation of the db, lower is better, "1" is no fragmentation. |
| `date.current` | Number | The current server date in millis since the epoch, useful for ensuring the server time is correct. |
| `date.uptime` | Number | How long API has been running. |
| `sentinel.backlog` | Number | Number of changes yet to be processed by Sentinel. |
| `messaging.outgoing.total.due` | Number | The number of messages due to be sent. |
| `messaging.outgoing.total.scheduled` | Number | The number of messages scheduled to be sent in the future. |
| `messaging.outgoing.total.muted` | Number | The number of messages that are muted and therefore will not be sent. |
| `messaging.outgoing.total.delivered` | Number | The number of messages that have been delivered or sent. |
| `messaging.outgoing.total.failed` | Number | The number of messages have failed to be delivered. |
| `messaging.outgoing.seven_days.due` | Number | The number of messages due to be sent in the last seven days. |
| `messaging.outgoing.seven_days.scheduled` | Number | The number of messages that were scheduled to be sent in the last seven days. |
| `messaging.outgoing.seven_days.muted` | Number | The number of messages that were due in the last seven days and are muted. |
| `messaging.outgoing.seven_days.delivered` | Number | The number of messages that were due in the last seven days and have been delivered or sent. |
| `messaging.outgoing.seven_days.failed` | Number | The number of messages that were due in the last seven days and have failed to be delivered. |
| `messaging.outgoing.last_hundred.pending` | Object | Counts within last 100 messages that have received status updates, and are one of the "pending" group statuses |
| `messaging.outgoing.last_hundred.pending.pending` | Number | Number of messages that are pending |
| `messaging.outgoing.last_hundred.pending.forwarded-to-gateway` | Number | Number of messages that are forwarded-to-gateway |
| `messaging.outgoing.last_hundred.pending.received-by-gateway` | Number | Number of messages that are received-by-gateway |
| `messaging.outgoing.last_hundred.pending.forwarded-by-gateway` | Number | Number of messages that are forwarded-by-gateway |
| `messaging.outgoing.last_hundred.final` | Object | Counts within last 100 messages that have received status updates,  and are in one of the "final" group statuses |
| `messaging.outgoing.last_hundred.final.sent` | Number | Number of messages that are sent |
| `messaging.outgoing.last_hundred.final.delivered` | Number | Number of messages that are delivered |
| `messaging.outgoing.last_hundred.final.failed` | Number | Number of messages that are failed |
| `messaging.outgoing.last_hundred.muted` | Object | Counts within last 100 messages that have received status updates, and are in one of the "muted" group statuses |
| `messaging.outgoing.last_hundred.final.denied` | Number | Number of messages that are denied |
| `messaging.outgoing.last_hundred.final.cleared` | Number | Number of messages that are cleared |
| `messaging.outgoing.last_hundred.final.muted` | Number | Number of messages that are muted |
| `messaging.outgoing.last_hundred.final.duplicate` | Number | Number of messages that are duplicate |
| `outbound_push.backlog` | Number | Number of changes yet to be processed by Outbound Push. |
| `feedback.count` | Number | Number of feedback docs created usually indicative of client side errors. |
| `conflict.count` | Number | Number of doc conflicts which need to be resolved manually. |
| `replication_limit.count` | Number | Number of users that exceeded the replication limit of documents. |
| `connected_users.count` | Number | Number of users that have connected to the api in a given number of days. The period defaults to 7 days but this can be changed by adding `connected_user_interval` as a query parameter e.g. `http://localhost:5988/api/v2/monitoring?connected_user_interval=14`  |

#### Errors

- A metric of `""` (for string values) or `-1` (for numeric values) indicates an error occurred while querying the metric - check the API logs for details.
- If no response or an error response is received the instance is unreachable. Thus, this API can be used as an uptime monitoring endpoint.

### GET /api/v1/express-metrics

*Added in 4.3.0*

Used to retrieve a range of metrics for monitoring CHT API's performance and internals. This API is used by [CHT Watchdog]({{< ref "/core/overview/watchdog" >}}).

The response is formatted for the [Prometheus Data Model](https://prometheus.io/docs/concepts/data_model/). The metrics exposed are defined by the [prometheus-api-metrics package](https://www.npmjs.com/package/prometheus-api-metrics) and include optional default metrics and garbage collection metrics.

#### Permissions

No permissions required.

## Upgrades

All of these endpoints require the `can_configure` permission.

All of these endpoints are asynchronous. Progress can be followed by watching the `horti-upgrade` document and looking at the `log` property.

### POST /api/v1/upgrade

Performs a complete upgrade to the provided version. This is equivalent of calling `/api/v1/upgrade/stage` and then `/api/v1/upgrade/complete` once staging has finished.

#### Example

```
POST /api/v1/upgrade
{
  "build": {
    "namespace": "medic",
    "application": "medic",
    "version": "3.0.0-beta.1"
  }
}
```

For potential forwards compatibility, you must pass the `namespace` and `application` as `medic`.

The `version` should correspond to a release, pre-release or branch that has been pushed to our builds server, which is currently hard-coded to `https://staging.dev.medicmobile.org/builds`. This happens automatically upon a successful Continuous Integration run.

Calling this endpoint will eventually cause api and sentinel to restart.

It is expected that the caller ensures forwards or backwards compatibility is maintained between deployed versions. This endpoint does not stop you from "upgrading" to an earlier version, or a branch that is incompatible with your current state.

### POST /api/v1/upgrade/stage

Stages an upgrade to the provided version. Does as much of the upgrade as possible without actually swapping versions over and restarting.

Parameters are the same as `/api/v1/upgrade`.

You know that an upgrade has been staged when the `horti-upgrade` document in CouchDB has `"action": "stage"` and `"staging_complete": true`.

### POST /api/v1/upgrade/complete

Completes a staged upgrade. Throws a `404` if there is no upgrade in the staged position.

## Hydrate

Accepts a JSON array of document uuids and returns fully hydrated documents, in the same order in which they were requested.
When documents are not found, an entry with the missing uuid and an error is added instead.
Supports both GET and POST.
Only allowed for users with "online" roles.

### GET /api/v1/hydrate

#### Query parameters

| Name | Required | Description |
| -----  | -------- | ------ |
| doc_ids | true | A JSON array of document uuids |


#### Example

```
GET /api/v1/hydrate?doc_ids=["id1","missingId","id3"]
```

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": "id1", "doc": { <...the hydrated document...> } },
  { "id": "missingId1", "error": "not_found" },
  { "id": "id3", "doc": { <...the hydrated document...> } },
]
```


### POST /api/v1/hydrate

#### Parameters

| Name | Required | Description |
| -----  | -------- | ------ |
| doc_ids | true | A JSON array of document uuids |


#### Example

```
POST /api/v1/hydrate
Content-Type: application/json

{
  "doc_ids": ["id1","missingId","id3"]
}

```

```
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": "id1", "doc": { <...the hydrated document...> } },
  { "id": "missingId", "error": "not_found" },
  { "id": "id3", "doc": { <...the hydrated document...> } },
]
```


## Contacts by phone

*Added in 3.10.0*

Accepts a phone number parameter and returns fully hydrated contacts that match the requested phone number.
If multiple contacts are found, all are returned.  When no matches are found, a 404 error is returned.
Supports both GET and POST.
Only allowed for users with "online" roles.

### GET /api/v1/contacts-by-phone

#### Query parameters

| Name | Required | Description |
| -----  | -------- | ------ |
| phone | true | A URL encoded string representing a phone number |


#### Example

```
GET /api/v1/contacts-by-phone?phone="%2B40-(744)-999-999"
```

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "ok": true,
  "docs": {
    { <... first hydrated matching contact found ...> },
    { <... second hydrated matching contact found ...> },
    ...
  }
}
```


### POST /api/v1/contacts-by-phone

#### Parameters

| Name | Required | Description |
| -----  | -------- | ------ |
| phone | true | A string representing a phone number |

#### Example

```
POST /api/v1/contacts-by-phone
Content-Type: application/json

{
  "phone": "+40 (21) 222-3333"
}

```

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "ok": true,
  "docs": {
    { <... first hydrated matching contact found ...> },
    { <... second hydrated matching contact found ...> },
    ...
  }
}
```


## Replication Limit

*Added in 3.11.0*

Returns the quantity of documents that were replicated by each user.
Accepts filtering by user name, when not provided, it returns all users.
Supports GET.
Only allowed for users with "_admin" role.

### GET /api/v1/users-doc-count

#### Query parameters

| Name | Required | Description |
| -----  | -------- | ------ |
| user | false | User's name |


#### Example

```
GET /api/v1/users-doc-count?user=mary"
```

```
HTTP/1.1 200 OK
Content-Type: application/json

{
    "limit": 10000,
    "users": {
        "_id": "replication-count-mary",
        "_rev": "5-cd3252e852ae075da216c3c3fe461291",
        "user": "mary",
        "date": 1595328973273,
        "count": 58
    }
}
```

## Credentials

Securely store credentials for authentication with third party systems such as SMS aggregators and HMIS. Certain CHT services rely on these credentials when enabled.

### PUT /api/v1/credentials

*Added in 4.0.0*

Provide the credential key as a URL parameter and the password in the request body, for example, to set a credential with key "mykey" and password "my pass" use the following command.

```sh
curl -X PUT -H "Content-Type: text/plain" https://<user>:<pass>@<domain>/api/v1/credentials/mykey -d 'my pass'
```

### 3.x API

For 3.x deployments credentials are stored in [CouchDB configuration](https://docs.couchdb.org/en/stable/api/server/configuration.html) in a custom `medic-credentials` section.

To add the credential to the admin config you need to PUT the value using curl, for example, to set a credential with key "mykey" and password "my pass" use the following command.

```sh
curl -X PUT https://<user>:<pass>@<domain>/_node/_local/_config/medic-credentials/mykey -d '"my pass"'
```

You can also add it via Fauxton:
 - Navigate to the Config screen at `https://<domain>/_utils/#/_config`
 - Click `Add Option`
 - The `Section` should be `medic-credentials`, the `Name` should be (in this example) `mykey` and the value should be the password
 - Click `Create`
 - You should then be able to see your credential in the list of configuration shown

